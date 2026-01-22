"use server";

/**
 * Email Verification Actions for MediTrack Pro
 * Handles email verification flow using Appwrite's built-in verification
 */

import { createAdminSession, createClientSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";
import { actionClient } from "./safe-action";
import * as z from "zod";

// Schema for email verification completion
const VerifyEmailSchema = z.object({
    userId: z.string(),
    secret: z.string(),
});

/**
 * Send verification email to current user
 * Uses Appwrite's built-in email verification
 */
export async function sendVerificationEmail(): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        const { accounts } = await createClientSession();
        const origin = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

        // Create email verification - Appwrite sends the email automatically
        await accounts.createEmailVerification({
            url: `${origin}/verify-email`,
        });

        return {
            success: true,
            message: "Verification email sent. Please check your inbox.",
        };
    } catch (error: any) {
        console.error("Send Verification Email Error:", error);

        if (error?.code === 409 || error?.type === "user_already_verified") {
            return {
                success: false,
                message: "Email is already verified.",
            };
        }

        return {
            success: false,
            message: error?.message || "Failed to send verification email",
        };
    }
}

/**
 * Complete email verification with token
 */
export const verifyEmail = actionClient
    .inputSchema(VerifyEmailSchema)
    .action(async ({ parsedInput }) => {
        const { userId, secret } = parsedInput;

        try {
            const { accounts } = await createClientSession();

            // Complete the verification
            await accounts.updateEmailVerification({
                userId,
                secret,
            });

            return {
                success: true,
                message: "Email verified successfully!",
            };
        } catch (error: any) {
            console.error("Email Verification Error:", error);

            if (error?.code === 401 || error?.type === "user_invalid_token") {
                return {
                    success: false,
                    message: "Invalid or expired verification link. Please request a new one.",
                };
            }

            return {
                success: false,
                message: error?.message || "Failed to verify email",
            };
        }
    });

/**
 * Check if current user's email is verified
 */
export async function isEmailVerified(): Promise<boolean> {
    try {
        const { accounts } = await createClientSession();
        const user = await accounts.get();
        return user.emailVerification;
    } catch (error) {
        console.error("Check Email Verification Error:", error);
        return false;
    }
}

/**
 * Resend verification email (with rate limiting consideration)
 */
export async function resendVerificationEmail(): Promise<{
    success: boolean;
    message: string;
}> {
    return sendVerificationEmail();
}
