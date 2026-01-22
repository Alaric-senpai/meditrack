"use server";

/**
 * Password Reset Actions for MediTrack Pro
 * Handles password reset request and password update flows
 */

import { createAdminSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";
import { ID, Query } from "node-appwrite";
import { actionClient } from "./safe-action";
import * as z from "zod";

// Schema for password reset request
const RequestResetSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

// Schema for password reset completion
const ResetPasswordSchema = z.object({
    userId: z.string(),
    secret: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Request a password reset - sends email with reset link
 * Uses Appwrite's built-in password recovery
 */
export const requestPasswordReset = actionClient
    .inputSchema(RequestResetSchema)
    .action(async ({ parsedInput }) => {
        const { email } = parsedInput;

        try {
            const { accounts } = await createAdminSession();
            const origin = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

            // Create password recovery - Appwrite sends the email automatically
            await accounts.createRecovery({
                email,
                url: `${origin}/reset-password`,
            });

            return {
                success: true,
                message: "Password reset email sent. Please check your inbox.",
            };
        } catch (error: any) {
            console.error("Password Reset Request Error:", error);

            // Don't reveal if email exists or not for security
            if (error?.code === 404 || error?.type === "user_not_found") {
                return {
                    success: true,
                    message: "If this email exists, a reset link has been sent.",
                };
            }

            return {
                success: false,
                message: error?.message || "Failed to send reset email",
            };
        }
    });

/**
 * Complete password reset with token
 * Uses Appwrite's updateRecovery
 */
export const resetPassword = actionClient
    .inputSchema(ResetPasswordSchema)
    .action(async ({ parsedInput }) => {
        const { userId, secret, password } = parsedInput;

        try {
            const { accounts } = await createAdminSession();

            // Complete the recovery process
            await accounts.updateRecovery({
                userId,
                secret,
                password,
            });

            return {
                success: true,
                message: "Password reset successfully. You can now login with your new password.",
            };
        } catch (error: any) {
            console.error("Password Reset Error:", error);

            if (error?.code === 401 || error?.type === "user_invalid_token") {
                return {
                    success: false,
                    message: "Invalid or expired reset link. Please request a new one.",
                };
            }

            return {
                success: false,
                message: error?.message || "Failed to reset password",
            };
        }
    });

/**
 * Simple function to request reset without action client (for direct calls)
 */
export async function sendPasswordResetEmail(email: string): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        const { accounts } = await createAdminSession();
        const origin = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

        await accounts.createRecovery({
            email,
            url: `${origin}/reset-password`,
        });

        return {
            success: true,
            message: "Password reset email sent",
        };
    } catch (error: any) {
        console.error("Send Password Reset Email Error:", error);
        return {
            success: false,
            message: error?.message || "Failed to send reset email",
        };
    }
}
