'use server';

import { createAdminSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { withRetry } from "@/config/helpers/retry.helpers";

/**
 * List patients for Admin Dashboard
 */
export const getAdminPatients = async (
    query?: string,
    limit: number = 10,
    offset: number = 0
) => {
    try {
        const { tables } = await createAdminSession();

        let queries = [
            Query.limit(limit),
            Query.offset(offset),
            Query.orderDesc('$createdAt')
        ];

        if (query) {
            queries.push(Query.search('lastName', query));
        }

        const { rows, total } = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.patients,
                queries
            }),
            3,
            2000,
            "Get Admin Patients"
        );

        return {
            success: true,
            patients: rows,
            total
        };
    } catch (error: any) {
        console.error("Get Admin Patients Error:", error);
        return {
            success: false,
            message: error?.message || "Failed to fetch patients",
            patients: [],
            total: 0
        };
    }
};

/**
 * Create a new Patient (Admin)
 * Admin creates patient record directly. 
 * Note: Does this create a User account? Usually yes, to allow portal access.
 * But schema has 'userId' as optional.
 * Let's assume Admin creates the Patient Record first, and optionally invites them (creates User) later?
 * Or creates both? 
 * User request: "Patient Administration ... Register patients". 
 * Let's Create User + Patient Record to keep it consistent with "Portal".
 */
export const registerPatient = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: Date;
    gender: "male" | "female" | "other";
    address: string;
    medicalId: string;
    emergencyContact?: string;
    allergies?: string[];
    chronicConditions?: string[];
    medications?: string[];
    profilePhoto?: string;
}) => {
    try {
        const { users, tables } = await createAdminSession();

        // 1. Create Auth User
        const password = ID.unique() + ID.unique();
        const userId = ID.unique();

        const user = await withRetry(
            () => users.create({
                userId,
                email: data.email,
                phone: data.phone,
                password: password,
                name: `${data.firstName} ${data.lastName}`,
            }),
            3,
            2000,
            "Create Auth User"
        );

        // 2. Add patient record to users table

        await withRetry(
            () => tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                rowId: ID.unique(),
                data: {
                    userId: user.$id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    role: 'patient',
                    profilePhoto: data.profilePhoto,
                }
            }),
            3,
            2000,
            "Add Patient Record to Users Table"
        );


        // 3. Create Patient Record
        await withRetry(
            () => tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.patients,
                rowId: ID.unique(),
                data: {
                    userId: user.$id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    dateOfBirth: data.dob.toISOString(),
                    gender: data.gender,
                    address: data.address,
                    medicalIdNumber: data.medicalId,
                    emergencyContact: data.emergencyContact || null,
                    allergies: data.allergies || [],
                    chronicConditions: data.chronicConditions || [],
                    medications: data.medications || [],
                    status: 'active'
                }
            }),
            3,
            2000,
            "Create Patient Record"
        );

        revalidatePath('/admin/patients');
        return { success: true, user };

    } catch (error: any) {
        console.error("Register Patient Error:", error);
        return { success: false, message: error.message };
    }
}

/**
 * Update Patient Details
 */
export const updatePatient = async (patientId: string, data: Partial<{
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    emergencyContact: string;
    allergies: string[];
    chronicConditions: string[];
    medications: string[];
    status: string;
    profilePhoto: string;
}>) => {
    try {
        const { tables } = await createAdminSession();

        await withRetry(
            () => tables.updateRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.patients,
                rowId: patientId,
                data
            }),
            3,
            2000,
            "Update Patient Record"
        );

        revalidatePath('/admin/patients');
        return { success: true };
    } catch (error: any) {
        console.error("Update Patient Error:", error);
        return { success: false, message: error.message };
    }
}

/**
 * Soft Delete Patient
 */
export const deletePatient = async (patientId: string) => {
    try {
        const { tables } = await createAdminSession();

        await withRetry(
            () => tables.updateRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.patients,
                rowId: patientId,
                data: { isDeleted: true, status: 'archived', deletedAt: new Date().toISOString() }
            }),
            3,
            2000,
            "Soft Delete Patient"
        );

        revalidatePath('/admin/patients');
        return { success: true };
    } catch (error: any) {
        console.error("Delete Patient Error:", error);
        return { success: false, message: error.message };
    }
}
