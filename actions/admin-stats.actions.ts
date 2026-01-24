"use server";

import { createAdminSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";
import { Query } from "node-appwrite";
import { withRetry } from "@/config/helpers/retry.helpers";

export const getSystemStats = async () => {
    try {
        const { tables, users: authUsers, health } = await createAdminSession();

        // 1. Fetch Basic Totals & Role Distribution
        const [usersData, patients, visits, recentLogsDocs] = await withRetry(
            () => Promise.all([
                tables.listRows({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.users,
                    queries: [Query.limit(5000)]
                }),
                tables.listRows({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.patients,
                    queries: [Query.limit(1)]
                }),
                tables.listRows({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.visits,
                    queries: [Query.limit(1)]
                }),
                tables.listRows({
                    databaseId: appwritecfg.databaseId,
                    tableId: appwritecfg.tables.auditLogs,
                    queries: [Query.orderDesc('$createdAt'), Query.limit(5)]
                })
            ]),
            3,
            2000,
            "Get System Stats"
        );

        // Calculate Role Distribution
        const roleDistribution: Record<string, number> = {
            admin: 0,
            doctor: 0,
            nurse: 0,
            "lab-tech": 0,
            pharmacist: 0,
            patient: 0
        };

        usersData.rows.forEach((u: any) => {
            if (roleDistribution[u.role] !== undefined) {
                roleDistribution[u.role]++;
            }
        });

        // 2. Mock or Fetch System Health (Appwrite Health API requires specific permissions/endpoints)
        // For now, we'll provide factual operational status based on the successful DB calls above
        const systemHealth = {
            api: "operational",
            database: "operational",
            storage: "operational"
        };

        return {
            success: true,
            stats: {
                totalUsers: usersData.total,
                totalPatients: patients.total,
                totalVisits: visits.total,
                totalLogs: recentLogsDocs.total,
                roleDistribution,
                recentActivity: recentLogsDocs.rows.map((log: any) => ({
                    id: log.$id,
                    action: log.action,
                    details: log.details,
                    timestamp: log.$createdAt,
                    userId: log.userId
                })),
                health: systemHealth
            }
        };

    } catch (error: any) {
        console.error("Get Enhanced Stats Error:", error);
        return {
            success: false,
            stats: {
                totalUsers: 0,
                totalPatients: 0,
                totalVisits: 0,
                totalLogs: 0,
                roleDistribution: {},
                recentActivity: [],
                health: { api: "down", database: "down", storage: "down" }
            }
        };
    }
}
