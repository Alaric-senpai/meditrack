"use server";

import { createAdminSession, createClientSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";
import { ID, Query } from "node-appwrite";
import { UserRole } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { withRetry } from "@/config/helpers/retry.helpers";

/**
 * Create a user record in the database
 * Linked to the Appwrite Auth User ID
 */
export const createUserRecord = async (
    userId: string,
    email: string,
    name: string,
    role: UserRole = "patient", // Default to patient role,
    profilePhoto: string | null = null
) => {
    const { tables } = await createAdminSession();

    name = name.trim();

    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1];

    try {
        await withRetry(
            () => tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                rowId: ID.unique(),
                data: {
                    userId: userId,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    role: role,
                    profilePhoto: profilePhoto
                }
            }),
            3,
            2000,
            "Create User Record"
        );
        return { success: true, role };
    } catch (error) {
        console.error("Failed to create user record:", error);
        throw error;
    }
}

/**
 * Get user role by Auth User ID
 */
export const getUserRole = async (userId: string) => {
    const { tables } = await createAdminSession();

    try {
        const userDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                queries: [Query.equal("userId", userId)]
            }),
            3,
            2000,
            "Get User Role"
        );

        return userDocs.rows[0]?.role as UserRole || "patient";
    } catch (error) {
        console.error("Failed to fetch user role:", error);
        return "patient"; // Fallback
    }
}


export const listAllUsers = async (limit: number = 25, offset: number = 0) => {
    try {

        const { tables } = await createClientSession()

        const users = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                queries: [Query.limit(limit), Query.offset(offset)]
            }),
            3,
            2000,
            "List All Users"
        );

        if (users) {
            return {
                success: true,
                users: users.rows,
                total: users.total
            }
        }
        return {
            success: false
        }

    } catch (error) {
        return {
            success: false,
        }
    }
}

/**
 * Get current authenticated user details
 */
export const getCurrentUser = async () => {
    try {
        const { accounts, tables } = await createClientSession();
        const user = await withRetry(
            () => accounts.get(),
            3,
            2000,
            "Get Auth Account (Current User)"
        );

        const userDocs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.users,
                queries: [Query.equal("userId", user.$id)]
            }),
            3,
            2000,
            "Get User Record (Current User)"
        );

        if (userDocs.total === 0) return null;

        return {
            ...user,
            ...userDocs.rows[0]
        };
    } catch (error) {
        return null;
    }
}