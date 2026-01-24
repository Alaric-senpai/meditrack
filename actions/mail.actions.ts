'use server';

import { resend } from "@/lib/mail/resend";
import { appConfig } from "@/config/app.config";
import UserInvitationEmail from "@/components/emails/UserInvitationEmail";
import WelcomeEmail from "@/components/emails/WelcomeEmail";
import SuspensionEmail from "@/components/emails/SuspensionEmail";
import PasswordResetEmail from "@/components/emails/PasswordResetEmail";
import { render } from "@react-email/components";
import * as React from "react";

// ... (previous functions)

/**
 * Send a password reset email
 */
export const sendPasswordResetEmail = async ({
    email,
    userName,
    resetLink,
}: {
    email: string;
    userName: string;
    resetLink: string;
}) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `MediTrack Support <support@${appConfig.resendDomain}>`,
            to: [email],
            subject: "Identity Security: Password Reset Request",
            react: PasswordResetEmail({ userName, resetLink }) as React.ReactElement,
        });

        if (error) {
            console.error("Resend Error:", error);
            return { success: false, message: error.message };
        }

        return { success: true, data };
    } catch (error: any) {
        console.error("Mail Action Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Send an invitation email to a new user
 */
export const sendInvitationEmail = async ({
    email,
    userName,
    role,
    tempPassword,
}: {
    email: string;
    userName: string;
    role: string;
    tempPassword?: string;
}) => {
    try {
        const invitationLink = `${appConfig.url}/login`;

        const { data, error } = await resend.emails.send({
            from: `MediTrack Admin <admin@${appConfig.resendDomain}>`,
            to: [email],
            subject: "Join MediTrack - Invitation to Project Portal",
            react: UserInvitationEmail({
                userName,
                role,
                tempPassword,
                invitationLink,
            }) as React.ReactElement,
        });

        if (error) {
            console.error("Resend Error:", error);
            return { success: false, message: error.message };
        }

        return { success: true, data };
    } catch (error: any) {
        console.error("Mail Action Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Send a welcome email to a newly registered user
 */
export const sendWelcomeEmail = async ({
    email,
    userName,
}: {
    email: string;
    userName: string;
}) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `MediTrack Support <support@${appConfig.resendDomain}>`,
            to: [email],
            subject: "Welcome to MediTrack - Account Successfully Created",
            react: WelcomeEmail({ userName }) as React.ReactElement,
        });

        if (error) {
            console.error("Resend Error:", error);
            return { success: false, message: error.message };
        }

        return { success: true, data };
    } catch (error: any) {
        console.error("Mail Action Error:", error);
        return { success: false, message: error.message };
    }
};

/**
 * Send a suspension notice email
 */
export const sendSuspensionEmail = async ({
    email,
    userName,
    reason,
}: {
    email: string;
    userName: string;
    reason?: string;
}) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `MediTrack Security <security@${appConfig.resendDomain}>`,
            to: [email],
            subject: "Security Notice: MediTrack Account Status Update",
            react: SuspensionEmail({ userName, reason }) as React.ReactElement,
        });

        if (error) {
            console.error("Resend Error:", error);
            return { success: false, message: error.message };
        }

        return { success: true, data };
    } catch (error: any) {
        console.error("Mail Action Error:", error);
        return { success: false, message: error.message };
    }
};
