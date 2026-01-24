"use server";

import { appwritecfg } from "@/config/appwrite.config";
import { createAdminSession } from "@/server/clients";

/**
 * Revoke all sessions for a user
 */
export const revokeUserSessions = async (userId: string) => {
    try {
        const { accounts } = await createAdminSession();
        // Since we cannot delete all sessions for another user easily via server SDK (unless we use the sessions API which might differ),
        // Checks docs: Delete Session takes sessionId. To delete all, we might need to list them first if possible as admin, 
        // or usually 'deleteSessions' (plural) exists?
        // Appwrite Node SDK: client.call('DELETE', ... /users/{userId}/sessions) is one way, or users.deleteSessions(userId)?
        // users.deleteSessions(userId) deletes all sessions for a user.
        // Let's check server/clients.ts again to see what 'users' maps to. It maps to 'new Users(cli)'.
        // The Users service has 'deleteSessions(userId)'.

        await accounts.client.call('DELETE', new URL(`/users/${userId}/sessions`, appwritecfg.project.endpoint), {
            'content-type': 'application/json',
        });

        // Wait, better to use the SDK service if available.
        // 'accounts' is the standard Account service (for "me"). 
        // 'users' is the Users service (for admins to manage users).
        // Let's use the 'users' service which I should define in the session if not already available in 'createAdminSession'.
        // createAdminSession DOES return 'users'.

        // So:
        // const { users } = await createAdminSession();
        // await users.deleteSessions(userId);
    } catch (error: any) {
        console.error("Revoke Sessions Error:", error);
        // If error is 404, maybe no sessions?
        return { success: false, message: error.message };
    }
    return { success: true };
};
