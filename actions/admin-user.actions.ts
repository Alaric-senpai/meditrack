"use server";

import { createAdminSession, createClientSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";
import { ID, Query } from "node-appwrite";
import { UserRole } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { sendInvitationEmail, sendSuspensionEmail } from "./mail.actions";
import { createAuditLog } from "./admin-logs.actions";
import { getCurrentUser } from "./user.actions";
import { withRetry } from "@/config/helpers/retry.helpers";
import { listDepartments } from "./departments.actions";
import { MedicalRole } from "@/lib/rbac";

/**
 * Hashing utility to map string ID to a unique enough integer for the pharmacists table
 * As requested by the schema where userId is an integer
 */
const stringToSafeInteger = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    // Ensure it's positive and within standard integer range
    return Math.abs(hash);
};

/**
 * List users with advanced filtering for Admin Dashboard
 */
export const getAdminUsers = async (
    query?: string,
    role?: string,
    status?: string,
    limit: number = 10,
    offset: number = 0
) => {
    try {
        const { tables } = await createClientSession();

        let queries = [
            Query.limit(limit),
            Query.offset(offset),
            Query.orderDesc('$createdAt')
        ];

        if (query) {
            queries.push(Query.search('firstName', query));
        }

        if (role && role !== 'all') {
            queries.push(Query.equal('role', role));
        }

        if (status && status !== 'all') {
            queries.push(Query.equal('status', status));
        }

        const { rows, total } = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                queries
            }),
            3,
            2000,
            "Get Admin Users"
        );

        // Fetch all active departments for resolving references
        const { departments = [] } = await listDepartments();
        const deptLookup = new Map(departments.map((d: any) => [d.$id, d]));

        // Enrichment
        const enrichedUsers = await Promise.all(rows.map(async (user: any) => {
            if (['doctor', 'nurse', 'lab-tech', 'pharmacist'].includes(user.role)) {
                try {
                    let tableId = "";
                    if (user.role === 'doctor') tableId = appwritecfg.tables.doctors;
                    else if (user.role === 'nurse') tableId = appwritecfg.tables.nurses;
                    else if (user.role === 'lab-tech') tableId = appwritecfg.tables.lab_technicians;
                    else if (user.role === 'pharmacist') tableId = appwritecfg.tables.pharmacists;

                    if (!tableId) return user;

                    const clinicalDocs = await tables.listRows({
                        databaseId: appwritecfg.databaseId,
                        tableId,
                        queries: [Query.limit(100)]
                    });
                    const lookupId = user.role === 'pharmacist' ? String(stringToSafeInteger(user.userId)) : String(user.userId);
                    const record = clinicalDocs.rows.find((r: any) => String(r.userId) === lookupId);

                    // Resolve ID to Name/Code if it exists
                    // Pharmacists use department_id, others use department
                    const deptId = record?.department_id || record?.department;
                    const dept = deptId ? deptLookup.get(deptId) : null;

                    return {
                        ...user,
                        department: dept ? `${dept.name} (${dept.code})` : (deptId || null)
                    };
                } catch (e) {
                    return user;
                }
            }
            return user;
        }));

        return {
            success: true,
            users: enrichedUsers,
            total
        };
    } catch (error: any) {
        console.error("Get Admin Users Error:", error);
        return {
            success: false,
            message: error?.message || "Failed to fetch users",
            users: [],
            total: 0
        };
    }
};

/**
 * Invite a new user (Creates Auth Account + DB Record)
 */
export const inviteUser = async (data: {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone?: string;
    specialty?: string;
    profilePhoto?: string;
}) => {
    try {
        const { users } = await createAdminSession();
        const { accounts, tables } = await createClientSession();
        const admin = await getCurrentUser();
        const { email, firstName, lastName, role, phone } = data;
        const name = `${firstName} ${lastName}`;

        const tempPassword = ID.unique() + ID.unique();
        const userId = ID.unique();

        const account = await withRetry(
            () => users.create({
                userId,
                email,
                phone,
                password: tempPassword,
                name
            }),
            3,
            2000,
            "Create User Account"
        );

        await withRetry(
            () => tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                rowId: ID.unique(),
                data: {
                    userId: account.$id,
                    firstName,
                    lastName,
                    email,
                    phone,
                    role,
                    profilePhoto: data.profilePhoto,
                    status: 'active'
                }
            }),
            3,
            2000,
            "Create User DB Record"
        );

        if (admin) {
            await createAuditLog({
                userId: admin.$id,
                userRole: 'admin',
                action: "invite_user",
                resourceType: "user",
                resourceId: account.$id,
                details: `Invited ${firstName} ${lastName} as ${role}`,
                status: "success"
            });
        }

        await sendInvitationEmail({
            email,
            userName: name,
            role,
            tempPassword
        });

        revalidatePath('/admin/users');
        return { success: true, user: account };
    } catch (error: any) {
        console.error("Invite User Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Update User Role
 */
export const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
        const { tables } = await createClientSession();
        const admin = await getCurrentUser();

        const userDocs = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.users,
            queries: [Query.equal('userId', userId)]
        });

        if (userDocs.total === 0) throw new Error("User record not found");
        const docId = userDocs.rows[0].$id;

        await withRetry(
            () => tables.updateRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                rowId: docId,
                data: { role: newRole }
            }),
            3,
            2000,
            "Update User Role"
        );

        if (admin) {
            await createAuditLog({
                userId: admin.$id,
                userRole: 'admin',
                action: "update_role",
                resourceType: "user",
                resourceId: userId,
                details: `Updated role to ${newRole}`,
                status: "success"
            });
        }

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error: any) {
        console.error("Update Role Error:", error);
        return {
            success: false,
            message: error?.message || "Failed to update user role"
        };
    }
};

/**
 * Toggle User Status (Suspend/Activate)
 */
export const toggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
        const { users } = await createAdminSession()
        const { tables } = await createClientSession();
        const admin = await getCurrentUser();
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        const isActive = newStatus === 'active';

        await withRetry(
            () => users.updateStatus(userId, isActive),
            3,
            2000,
            "Update Auth Status"
        );

        const userDocs = await tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.users,
            queries: [Query.equal('userId', userId)]
        });

        if (userDocs.total > 0) {
            const userRow = userDocs.rows[0];
            await withRetry(
                () => tables.updateRow({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.users,
                    rowId: userRow.$id,
                    data: { status: newStatus }
                }),
                3,
                2000,
                "Update User Status Record"
            );

            if (newStatus === 'inactive') {
                await sendSuspensionEmail({
                    email: userRow.email,
                    userName: `${userRow.firstName} ${userRow.lastName}`,
                    reason: "Administrative policy compliance check."
                });
            }

            if (admin) {
                await createAuditLog({
                    userId: admin.$id,
                    userRole: 'admin',
                    action: "toggle_status",
                    resourceType: "user",
                    resourceId: userId,
                    details: `Set status to ${newStatus}`,
                    status: "success"
                });
            }
        }

        revalidatePath('/admin/users');
        return { success: true, status: newStatus };
    } catch (error: any) {
        console.error("Toggle Status Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Revoke all sessions for a user
 */
export const revokeUserSessions = async (userId: string) => {
    try {
        const { users } = await createAdminSession();
        const admin = await getCurrentUser();
        await withRetry(
            () => users.deleteSessions(userId),
            3,
            2000,
            "Revoke User Sessions"
        );

        if (admin) {
            await createAuditLog({
                userId: admin.$id,
                userRole: 'admin',
                action: "revoke_sessions",
                resourceType: "user",
                resourceId: userId,
                status: "success"
            });
        }
        return { success: true, message: "All sessions revoked" };
    } catch (error: any) {
        console.error("Revoke Sessions Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Update Doctor Metadata (User table + Doctors table)
 */
export const updateDoctorMetadata = async (userId: string, data: {
    firstName: string;
    lastName: string;
    specialization: string[];
    licenseNumber: string;
    yearsOfExperience?: number;
    education?: string;
    hospitalAffiliation?: string;
    medicalRegistrationNumber: string;
    bio?: string;
    gender: "male" | "female";
    profilePhoto?: string;
    department?: string;
}) => {
    try {
        const { tables } = await createClientSession();
        const admin = await getCurrentUser();

        const userDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                queries: [Query.equal('userId', userId)]
            }),
            3,
            2000,
            "Lookup User for Doctor Update"
        );

        if (userDocs.total > 0) {
            await withRetry(
                () => tables.updateRow({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.users,
                    rowId: userDocs.rows[0].$id,
                    data: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        profilePhoto: data.profilePhoto,
                    }
                }),
                3,
                2000,
                "Update User Record (Doctor)"
            );
        }

        const doctorDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.doctors,
                queries: [Query.equal('licenseNumber', data.licenseNumber)]
            }),
            3,
            2000,
            "Lookup Doctor Record"
        );

        if (doctorDocs.total > 0) {
            await withRetry(
                () => tables.updateRow({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.doctors,
                    rowId: doctorDocs.rows[0].$id,
                    data: {
                        yearsOfExperience: data.yearsOfExperience,
                        education: data.education,
                        hospitalAffiliation: data.hospitalAffiliation,
                        bio: data.bio,
                        medicalRegistrationNumber: data.medicalRegistrationNumber,
                        specilization: data.specialization,
                        gender: data.gender,
                        department: data.department
                    }
                }),
                3,
                2000,
                "Update Doctor Clinical Record"
            );
        }

        if (admin) {
            await createAuditLog({
                userId: admin.$id,
                userRole: 'admin',
                action: "update_doctor",
                resourceType: "user",
                resourceId: userId,
                status: "success"
            });
        }

        revalidatePath('/admin/users');
        revalidatePath('/admin/doctors');
        return { success: true };
    } catch (error: any) {
        console.error("Update Doctor Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Update Nurse Metadata (User table + Nurses table)
 */
export const updateNurseMetadata = async (userId: string, data: {
    firstName: string;
    lastName: string;
    specialization: string[];
    licenseNumber: string;
    employmentDate: string;
    shiftType: "Day" | "Night" | "Rotational";
    isAvailable: boolean;
    gender: "male" | "female";
    profilePhoto?: string;
    department?: string;
}) => {
    try {
        const { tables } = await createClientSession();
        const admin = await getCurrentUser();

        const userDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                queries: [Query.equal('userId', userId)]
            }),
            3,
            2000,
            "Lookup User for Nurse Update"
        );

        if (userDocs.total > 0) {
            await withRetry(
                () => tables.updateRow({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.users,
                    rowId: userDocs.rows[0].$id,
                    data: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        profilePhoto: data.profilePhoto,
                    }
                }),
                3,
                2000,
                "Update User Record (Nurse)"
            );
        }

        const nurseDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.nurses,
                queries: [Query.equal('licenseNumber', data.licenseNumber)]
            }),
            3,
            2000,
            "Lookup Nurse Record"
        );

        if (nurseDocs.total > 0) {
            await withRetry(
                () => tables.updateRow({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.nurses,
                    rowId: nurseDocs.rows[0].$id,
                    data: {
                        employmentDate: data.employmentDate,
                        shiftType: data.shiftType,
                        isAvailable: data.isAvailable,
                        specialization: data.specialization,
                        gender: data.gender,
                        department: data.department
                    }
                }),
                3,
                2000,
                "Update Nurse Clinical Record"
            );
        }

        if (admin) {
            await createAuditLog({
                userId: admin.$id,
                userRole: 'admin',
                action: "update_nurse",
                resourceType: "user",
                resourceId: userId,
                status: "success"
            });
        }

        revalidatePath('/admin/users');
        revalidatePath('/admin/nurses');
        return { success: true };
    } catch (error: any) {
        console.error("Update Nurse Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Create a new Doctor (Auth + DB record in Users + Clinical record in Doctors)
 */
export const createDoctor = async (data: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    licenseNumber: string;
    yearsOfExperience?: number;
    education?: string;
    hospitalAffiliation?: string;
    bio?: string;
    medicalRegistrationNumber: string;
    specialization?: string[];
    gender: "male" | "female";
    profilePhoto?: string;
    department?: string;
}) => {
    try {
        const { users } = await createAdminSession()
        const { tables } = await createClientSession();
        const admin = await getCurrentUser();
        const { email, firstName, lastName, phone, ...clinicalData } = data;
        const name = `${firstName} ${lastName}`;
        const tempPassword = ID.unique() + ID.unique();
        const userId = ID.unique();

        const account = await withRetry(
            () => users.create({
                userId,
                email,
                phone,
                password: tempPassword,
                name
            }),
            3,
            2000,
            "Create User Account"
        );

        await withRetry(
            () => tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                rowId: ID.unique(),
                data: {
                    userId: account.$id,
                    firstName,
                    lastName,
                    email,
                    phone,
                    role: 'doctor',
                    profilePhoto: data.profilePhoto,
                    status: 'active',
                }
            }),
            3,
            2000,
            "Create User DB Record (Doctor)"
        );

        await withRetry(
            () => tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.doctors,
                rowId: ID.unique(),
                data: {
                    userId: account.$id,
                    licenseNumber: clinicalData.licenseNumber,
                    yearsOfExperience: clinicalData.yearsOfExperience,
                    education: clinicalData.education,
                    hospitalAffiliation: clinicalData.hospitalAffiliation,
                    bio: clinicalData.bio,
                    medicalRegistrationNumber: clinicalData.medicalRegistrationNumber,
                    specilization: clinicalData.specialization,
                    gender: clinicalData.gender,
                    department: clinicalData.department
                }
            }),
            3,
            2000,
            "Create Doctor Clinical Record"
        );

        if (admin) {
            await createAuditLog({
                userId: admin.$id,
                userRole: 'admin',
                action: "create_doctor",
                resourceType: "user",
                resourceId: account.$id,
                details: `Registered Dr. ${firstName} ${lastName}`,
                status: "success"
            });
        }

        await sendInvitationEmail({
            email,
            userName: name,
            role: 'doctor',
            tempPassword
        });

        revalidatePath('/admin/users');
        revalidatePath('/admin/doctors');
        return { success: true, user: account };
    } catch (error: any) {
        console.error("Create Doctor Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Create a new Nurse (Auth + DB record in Users + Clinical record in Nurses)
 */
export const createNurse = async (data: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    licenseNumber: string;
    employmentDate: string;
    shiftType: "Day" | "Night" | "Rotational";
    isAvailable: boolean;
    specialization?: string[];
    gender: "male" | "female";
    profilePhoto?: string;
    department?: string;
}) => {
    try {
        const { users } = await createAdminSession()
        const { tables } = await createClientSession();
        const admin = await getCurrentUser();
        const { email, firstName, lastName, phone, ...clinicalData } = data;
        const name = `${firstName} ${lastName}`;
        const tempPassword = ID.unique() + ID.unique();
        const userId = ID.unique();

        const account = await withRetry(
            () => users.create({
                userId,
                email,
                phone,
                password: tempPassword,
                name
            }),
            3,
            2000,
            "Create User Account"
        );

        await withRetry(
            () => tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                rowId: ID.unique(),
                data: {
                    userId: account.$id,
                    firstName,
                    lastName,
                    email,
                    phone,
                    role: 'nurse',
                    profilePhoto: data.profilePhoto,
                    status: 'active'
                }
            }),
            3,
            2000,
            "Create User DB Record (Nurse)"
        );

        await withRetry(
            () => tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.nurses,
                rowId: ID.unique(),
                data: {
                    userId: account.$id,
                    licenseNumber: clinicalData.licenseNumber,
                    employmentDate: clinicalData.employmentDate,
                    shiftType: clinicalData.shiftType,
                    isAvailable: clinicalData.isAvailable,
                    specialization: clinicalData.specialization,
                    gender: clinicalData.gender,
                    department: clinicalData.department
                }
            }),
            3,
            2000,
            "Create Nurse Clinical Record"
        );

        if (admin) {
            await createAuditLog({
                userId: admin.$id,
                userRole: 'admin',
                action: "create_nurse",
                resourceType: "user",
                resourceId: account.$id,
                details: `Registered Nurse ${firstName} ${lastName}`,
                status: "success"
            });
        }

        await sendInvitationEmail({
            email,
            userName: name,
            role: 'nurse',
            tempPassword
        });

        revalidatePath('/admin/users');
        revalidatePath('/admin/nurses');
        return { success: true, user: account };
    } catch (error: any) {
        console.error("Create Nurse Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Get specialized doctor profile (User Record + Clinical Data)
 */
export const getDoctorClinicalProfile = async (userId: string) => {
    try {
        const { tables } = await createClientSession();

        const userDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                queries: [Query.equal('userId', userId)]
            }),
            3,
            2000,
            "Lookup User for Doctor Profile"
        );

        if (userDocs.total === 0) throw new Error("User record not found");
        const user = userDocs.rows[0];

        const doctorDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.doctors,
                queries: [Query.limit(100)]
            }),
            3,
            2000,
            "Lookup Doctor Records"
        );

        // Fallback to manual find because userId in this table is currently an Integer (timestamp)
        const clinicalData = doctorDocs.rows.find((d: any) =>
            d.medicalRegistrationNumber || d.licenseNumber
        );

        return { success: true, user, clinical: clinicalData || null };
    } catch (error: any) {
        console.error("Get Doctor Profile Error:", error);
        return { success: false, message: error.message };
    }
}

/**
 * Get specialized nurse profile (User Record + Clinical Data)
 */
export const getNurseClinicalProfile = async (userId: string) => {
    try {
        const { tables } = await createClientSession();
        const userDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                queries: [Query.equal('userId', userId)]
            }),
            3,
            2000,
            "Lookup User for Nurse Profile"
        );

        if (userDocs.total === 0) throw new Error("User record not found");
        const user = userDocs.rows[0];

        const nurseDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.nurses,
                queries: [Query.limit(100)]
            }),
            3,
            2000,
            "Lookup Nurse Records"
        );

        // Fallback to manual find because userId in this table is currently an Integer (timestamp)
        const clinicalData = nurseDocs.rows.find((n: any) => n.licenseNumber);
        return { success: true, user, clinical: clinicalData || null };
    } catch (error: any) {
        console.error("Get Nurse Profile Error:", error);
        return { success: false, message: error.message };
    }
}

/**
 * Get specialized patient profile (User Record + Medical Data)
 */
export const getPatientProfile = async (userId: string) => {
    try {
        const { tables } = await createClientSession();
        const userDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                queries: [Query.equal('userId', userId)]
            }),
            3,
            2000,
            "Lookup User for Patient Profile"
        );

        if (userDocs.total === 0) throw new Error("User record not found");
        const user = userDocs.rows[0];

        const patientDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.patients,
                queries: [Query.equal('userId', userId)]
            }),
            3,
            2000,
            "Lookup Patient Records"
        );

        const clinicalData = patientDocs.rows[0]
        return { success: true, user, clinical: clinicalData || null };
    } catch (error: any) {
        console.error("Get Patient Profile Error:", error);
        return { success: false, message: error.message };
    }
}

/**
 * Update staff metadata (generic)
 */
export const updateStaffMetadata = async (userId: string, data: { specialty: string; bio?: string }) => {
    try {
        const { tables } = await createClientSession();

        const userDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                queries: [Query.equal('userId', userId)]
            }),
            3,
            2000,
            "Lookup User for Staff Update"
        );

        if (userDocs.total === 0) throw new Error("User record not found");

        await withRetry(
            () => tables.updateRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                rowId: userDocs.rows[0].$id,
                data: {
                    specialty: data.specialty,
                    bio: data.bio
                }
            }),
            3,
            2000,
            "Update Staff Metadata"
        );

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error: any) {
        console.error("Update Staff Metadata Error:", error);
        return { success: false, message: error.message };
    }
};
/**
 * Create a new Lab Technician
 */
export const createLabTechnician = async (data: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    licenseId: string;
    yearsOfExperience?: number;
    expertise?: string;
    specialization?: string[];
    shift_type: "day" | "night" | "rotational" | "on-call";
    employment_date: string;
    profilePhoto?: string;
    department?: string;
}) => {
    try {
        const { users } = await createAdminSession()
        const { tables } = await createClientSession();
        const admin = await getCurrentUser();
        const { email, firstName, lastName, phone, ...clinicalData } = data;
        const name = `${firstName} ${lastName}`;
        const tempPassword = ID.unique() + ID.unique();
        const userId = ID.unique();

        const account = await withRetry(
            () => users.create({
                userId,
                email,
                phone,
                password: tempPassword,
                name
            }),
            3,
            2000,
            "Create User Account"
        );

        await withRetry(
            () => tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                rowId: ID.unique(),
                data: {
                    userId: account.$id,
                    firstName,
                    lastName,
                    email,
                    phone,
                    role: MedicalRole.LAB_TECHNICIAN,
                    profilePhoto: data.profilePhoto,
                    status: 'active'
                }
            }),
            3,
            2000,
            "Create User DB Record (Lab Tech)"
        );

        await withRetry(
            () => tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.lab_technicians,
                rowId: ID.unique(),
                data: {
                    userId: account.$id,
                    licenseId: clinicalData.licenseId,
                    yearsOfExperience: clinicalData.yearsOfExperience,
                    expertise: clinicalData.expertise,
                    specialization: clinicalData.specialization,
                    shift_type: clinicalData.shift_type,
                    employment_date: clinicalData.employment_date,
                    department: clinicalData.department
                }
            }),
            3,
            2000,
            "Create Lab Tech Clinical Record"
        );

        if (admin) {
            await createAuditLog({
                userId: admin.$id,
                userRole: 'admin',
                action: "create_lab_tech",
                resourceType: "user",
                resourceId: account.$id,
                details: `Registered Lab Tech ${firstName} ${lastName}`,
                status: "success"
            });
        }

        await sendInvitationEmail({
            email,
            userName: name,
            role: 'lab_tech' as any,
            tempPassword
        });

        revalidatePath('/admin/users');
        revalidatePath('/admin/lab-technicians');
        return { success: true, user: account };
    } catch (error: any) {
        console.error("Create Lab Tech Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Update Lab Technician Metadata
 */
export const updateLabTechnicianMetadata = async (userId: string, data: {
    firstName: string;
    lastName: string;
    licenseId: string;
    yearsOfExperience?: number;
    expertise?: string;
    specialization?: string[];
    shift_type: "day" | "night" | "rotational" | "on-call";
    employment_date: string;
    profilePhoto?: string;
    department?: string;
}) => {
    try {
        const { tables } = await createClientSession();
        const admin = await getCurrentUser();

        const userDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                queries: [Query.equal('userId', userId)]
            }),
            3,
            2000,
            "Lookup User for Lab Tech Update"
        );

        if (userDocs.total > 0) {
            await withRetry(
                () => tables.updateRow({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.users,
                    rowId: userDocs.rows[0].$id,
                    data: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        profilePhoto: data.profilePhoto,
                    }
                }),
                3,
                2000,
                "Update User Record (Lab Tech)"
            );
        }

        const clinicalDoc = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.lab_technicians,
                queries: [Query.equal('userId', userId), Query.limit(1)]
            }),
            3,
            2000,
            "Lookup Lab Tech Record"
        );

        if (clinicalDoc.total > 0) {
            await withRetry(
                () => tables.updateRow({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.lab_technicians,
                    rowId: clinicalDoc.rows[0].$id,
                    data: {
                        yearsOfExperience: data.yearsOfExperience,
                        expertise: data.expertise,
                        specialization: data.specialization,
                        licenseId: data.licenseId,
                        shift_type: data.shift_type,
                        employment_date: data.employment_date,
                        department: data.department
                    }
                }),
                3,
                2000,
                "Update Lab Tech Clinical Record"
            );
        }

        if (admin) {
            await createAuditLog({
                userId: admin.$id,
                userRole: 'admin',
                action: "update_lab_tech",
                resourceType: "user",
                resourceId: userId,
                status: "success"
            });
        }

        revalidatePath('/admin/users');
        revalidatePath('/admin/lab-technicians');
        return { success: true };
    } catch (error: any) {
        console.error("Update Lab Tech Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Get specialized lab tech profile
 */
export const getLabTechnicianClinicalProfile = async (userId: string) => {
    try {
        const { tables } = await createClientSession();
        const userDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                queries: [Query.equal('userId', userId)]
            }),
            3,
            2000,
            "Lookup User for Lab Tech Profile"
        );

        if (userDocs.total === 0) throw new Error("User record not found");
        const user = userDocs.rows[0];

        const clinicalDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.lab_technicians,
                queries: [Query.equal('userId', userId), Query.limit(1)]
            }),
            3,
            2000,
            "Lookup Lab Tech Records"
        );

        return { success: true, user, clinical: clinicalDocs.rows[0] || null };
    } catch (error: any) {
        console.error("Get Lab Tech Profile Error:", error);
        return { success: false, message: error.message };
    }
}


/**
 * Create a new Pharmacist
 */
export const createPharmacist = async (data: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    licenseNumber: string;
    hire_date: string;
    employmentDate?: string;
    qualification?: string;
    specilization?: string[];
    shift_type?: "day" | "night" | "rotational" | "on-call";
    can_disperse_controlled_drugs: boolean;
    can_manage_inventory: boolean;
    profilePhoto?: string;
    department_id?: string;
}) => {
    try {
        const { users } = await createAdminSession()
        const { tables } = await createClientSession();
        const admin = await getCurrentUser();
        const { email, firstName, lastName, phone, ...clinicalData } = data;
        const name = `${firstName} ${lastName}`;
        const tempPassword = ID.unique() + ID.unique();
        const userId = ID.unique();

        const account = await withRetry(
            () => users.create({
                userId,
                email,
                phone,
                password: tempPassword,
                name
            }),
            3,
            2000,
            "Create User Account"
        );

        await withRetry(
            () => tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                rowId: ID.unique(),
                data: {
                    userId: account.$id,
                    firstName,
                    lastName,
                    email,
                    phone,
                    role: MedicalRole.PHARMACIST,
                    profilePhoto: data.profilePhoto,
                    status: 'active'
                }
            }),
            3,
            2000,
            "Create User DB Record (Pharmacist)"
        );

        await withRetry(
            () => tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.pharmacists,
                rowId: ID.unique(),
                data: {
                    userId: stringToSafeInteger(account.$id),
                    licenseNumber: clinicalData.licenseNumber,
                    hire_date: clinicalData.hire_date,
                    employmentDate: clinicalData.employmentDate,
                    qualification: clinicalData.qualification,
                    specilization: clinicalData.specilization,
                    shift_type: clinicalData.shift_type,
                    can_disperse_controlled_drugs: clinicalData.can_disperse_controlled_drugs,
                    can_manage_inventory: clinicalData.can_manage_inventory,
                    department_id: clinicalData.department_id
                }
            }),
            3,
            2000,
            "Create Pharmacist Clinical Record"
        );

        if (admin) {
            await createAuditLog({
                userId: admin.$id,
                userRole: 'admin',
                action: "create_pharmacist",
                resourceType: "user",
                resourceId: account.$id,
                details: `Registered Pharmacist ${firstName} ${lastName}`,
                status: "success"
            });
        }

        await sendInvitationEmail({
            email,
            userName: name,
            role: 'pharmacist' as any,
            tempPassword
        });

        revalidatePath('/admin/users');
        revalidatePath('/admin/pharmacists');
        return { success: true, user: account };
    } catch (error: any) {
        console.error("Create Pharmacist Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Update Pharmacist Metadata
 */
export const updatePharmacistMetadata = async (userId: string, data: {
    firstName: string;
    lastName: string;
    licenseNumber: string;
    hire_date: string;
    employmentDate?: string;
    qualification?: string;
    specilization?: string[];
    shift_type?: "day" | "night" | "rotational" | "on-call";
    can_disperse_controlled_drugs: boolean;
    can_manage_inventory: boolean;
    profilePhoto?: string;
    department_id?: string;
}) => {
    try {
        const { tables } = await createClientSession();
        const admin = await getCurrentUser();

        const userDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                queries: [Query.equal('userId', userId)]
            }),
            3,
            2000,
            "Lookup User for Pharmacist Update"
        );

        if (userDocs.total > 0) {
            await withRetry(
                () => tables.updateRow({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.users,
                    rowId: userDocs.rows[0].$id,
                    data: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        profilePhoto: data.profilePhoto,
                    }
                }),
                3,
                2000,
                "Update User Record (Pharmacist)"
            );
        }

        const clinicalDoc = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.pharmacists,
                queries: [Query.equal('userId', stringToSafeInteger(userId)), Query.limit(1)]
            }),
            3,
            2000,
            "Lookup Pharmacist Record"
        );

        if (clinicalDoc.total > 0) {
            await withRetry(
                () => tables.updateRow({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.pharmacists,
                    rowId: clinicalDoc.rows[0].$id,
                    data: {
                        licenseNumber: data.licenseNumber,
                        hire_date: data.hire_date,
                        employmentDate: data.employmentDate,
                        qualification: data.qualification,
                        specilization: data.specilization,
                        shift_type: data.shift_type,
                        can_disperse_controlled_drugs: data.can_disperse_controlled_drugs,
                        can_manage_inventory: data.can_manage_inventory,
                        department_id: data.department_id
                    }
                }),
                3,
                2000,
                "Update Pharmacist Clinical Record"
            );
        }

        if (admin) {
            await createAuditLog({
                userId: admin.$id,
                userRole: 'admin',
                action: "update_pharmacist",
                resourceType: "user",
                resourceId: userId,
                status: "success"
            });
        }

        revalidatePath('/admin/users');
        revalidatePath('/admin/pharmacists');
        return { success: true };
    } catch (error: any) {
        console.error("Update Pharmacist Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Get specialized pharmacist profile
 */
export const getPharmacistClinicalProfile = async (userId: string) => {
    try {
        const { tables } = await createClientSession();
        const userDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                queries: [Query.equal('userId', userId)]
            }),
            3,
            2000,
            "Lookup User for Pharmacist Profile"
        );

        if (userDocs.total === 0) throw new Error("User record not found");
        const user = userDocs.rows[0];

        const clinicalDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.pharmacists,
                queries: [Query.equal('userId', stringToSafeInteger(userId)), Query.limit(1)]
            }),
            3,
            2000,
            "Lookup Pharmacist Records"
        );

        return { success: true, user, clinical: clinicalDocs.rows[0] || null };
    } catch (error: any) {
        console.error("Get Pharmacist Profile Error:", error);
        return { success: false, message: error.message };
    }
}
