"use server";

/**
 * Admin User Management Actions
 * Only admins can create staff accounts (doctor, nurse, lab-tech, pharmacist)
 */

import { actionClient } from "./safe-action";
import { createAdminSession } from "@/server/clients";
import { createUserRecord } from "./user.actions";
import { ID } from "node-appwrite";
import { setRoleCookie } from "@/server/cookies";
import * as z from "zod";
import { MedicalRole } from "@/lib/rbac";

// Staff roles that can only be created by admin
const StaffRoles = ["doctor", "nurse", "lab-tech", "pharmacist", "admin"] as const;

// Schema for creating staff accounts
const CreateStaffSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2, "Name is required"),
    role: z.enum(StaffRoles, { message: "Please select a valid staff role" }),
});

/**
 * Create a staff account (admin only)
 * Used by admins to create doctor, nurse, lab-tech, pharmacist accounts
 */
export const createStaffAccount = actionClient
    .inputSchema(CreateStaffSchema)
    .action(async ({ parsedInput }) => {
        const { email, password, name, role } = parsedInput;

        try {
            // 1. Create Admin Session
            const { accounts } = await createAdminSession();

            // 2. Create Auth User
            const user = await accounts.create(ID.unique(), email, password, name);

            // 3. Create User Document with staff role
            await createUserRecord(user.$id, email, name, role);

            return {
                success: true,
                message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`,
                data: {
                    userId: user.$id,
                    email,
                    name,
                    role
                }
            };
        } catch (error: any) {
            console.error("Create Staff Account Error:", error);
            return {
                success: false,
                message: error?.message || "Failed to create staff account",
            };
        }
    });

/**
 * Get list of staff roles available for admin creation
 */
export function getStaffRoles() {
    return [
        { value: "doctor", label: "Doctor", description: "Manage patient care and prescriptions" },
        { value: "nurse", label: "Nurse", description: "Monitor patient vitals and care" },
        { value: "lab-tech", label: "Lab Technician", description: "Process lab tests and results" },
        { value: "pharmacist", label: "Pharmacist", description: "Manage prescriptions and medications" },
        { value: "admin", label: "Administrator", description: "Manage system and users" },
    ];
}
