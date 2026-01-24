'use server';

import { createAdminSession, createClientSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { withRetry } from "@/config/helpers/retry.helpers";
import { record } from "zod";

/**
 * List all active departments
 */
export const listDepartments = async () => {
    try {
        const { tables } = await createClientSession();
        const { rows } = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.departments || 'departments',
                queries: [Query.equal('is_active', true), Query.limit(100)]
            }),
            3,
            2000,
            "List Departments"
        );

        return { success: true, departments: rows };
    } catch (error: any) {
        console.error("List Departments Error:", error);
        return { success: false, message: error.message, departments: [] };
    }
};

/**
 * Create a new department
 */
export const createDepartment = async (data: {
    name: string;
    code: string;
    description: string;
    type?: string;
}) => {
    try {
        const { tables } = await createAdminSession();
        const department = await withRetry(
            () => tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.departments || 'departments',
                rowId: ID.unique(),
                data: {
                    ...data,
                    is_active: true
                }
            }),
            3,
            2000,
            "Create Department"
        );

        revalidatePath('/admin/departments');
        return { success: true, department };
    } catch (error: any) {
        console.error("Create Department Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Update an existing department
 */
export const updateDepartment = async (departmentId: string, data: any) => {
    try {
        const { tables } = await createAdminSession();
        await withRetry(
            () => tables.updateRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.departments || 'departments',
                rowId: departmentId,
                data
            }),
            3,
            2000,
            "Update Department"
        );

        revalidatePath('/admin/departments');
        return { success: true };
    } catch (error: any) {
        console.error("Update Department Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Assign a Doctor to a department
 */
export const assignDoctorToDepartment = async (
    userId: string,
    departmentId: string
) => {
    try {
        const { tables } = await createAdminSession();
        const doc = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.doctors,
                queries: [Query.equal('userId', userId), Query.limit(1)]
            }),
            3,
            2000,
            "Lookup Doctor Record"
        );

        const record = doc.rows[0];
        if (!record) throw new Error("Doctor record not found");

        await withRetry(
            () => tables.updateRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.doctors,
                rowId: record.$id,
                data: { department: departmentId }
            }),
            3,
            2000,
            "Assign Doctor to Department"
        );

        revalidatePath('/admin/users');
        revalidatePath('/admin/doctors');
        return { success: true };
    } catch (error: any) {
        console.error("Assign Doctor Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Assign a Nurse to a department
 */
export const assignNurseToDepartment = async (
    userId: string,
    departmentId: string
) => {
    try {
        const { tables } = await createAdminSession();
        const doc = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.nurses,
                queries: [Query.equal('userId', userId), Query.limit(1)]
            }),
            3,
            2000,
            "Lookup Nurse Record"
        );

        // const record = docs.rows.find((r: any) => String(r.userId) === String(userId) || r.$id === userId);
        // if (!record) throw new Error("Nurse record not found");

        await withRetry(
            () => tables.updateRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.nurses,
                rowId: doc.rows[0].$id,
                data: { department: departmentId }
            }),
            3,
            2000,
            "Assign Nurse to Department"
        );

        revalidatePath('/admin/users');
        revalidatePath('/admin/nurses');
        return { success: true };
    } catch (error: any) {
        console.error("Assign Nurse Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Assign a Lab Tech to a department
 */
export const assignLabTechToDepartment = async (
    userId: string,
    departmentId: string
) => {
    try {
        const { tables } = await createAdminSession();
        const doc = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.lab_technicians,
                queries: [Query.equal('userId', userId), Query.limit(1)]
            }),
            3,
            2000,
            "Lookup Lab Tech Record"
        );

        if (doc.total === 0) throw new Error("Lab Tech record not found");

        await withRetry(
            () => tables.updateRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.lab_technicians,
                rowId: doc.rows[0].$id,
                data: { department: departmentId }
            }),
            3,
            2000,
            "Assign Lab Tech to Department"
        );

        revalidatePath('/admin/users');
        revalidatePath('/admin/lab-technicians');
        return { success: true };
    } catch (error: any) {
        console.error("Assign Lab Tech Error:", error);
        return { success: false, message: error.message };
    }
};
