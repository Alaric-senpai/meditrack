"use server";

import { createClientSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";
import { ID, Query } from "node-appwrite";
import { withRetry } from "@/config/helpers/retry.helpers";

export const createAuditLog = async (data: {
    userId: string;
    userRole: string;
    action: string;
    resourceType: string;
    resourceId: string;
    details?: string;
    severity?: "info" | "warning" | "critical";
    status: "success" | "failed";
}) => {
    try {
        const { tables } = await createClientSession();
        await withRetry(
            () => tables.createRow({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.auditLogs,
                rowId: ID.unique(),
                data: {
                    ...data,
                    timestamp: new Date().toISOString()
                }
            }),
            3,
            2000,
            "Create Audit Log"
        );
        return { success: true };
    } catch (error: any) {
        console.error("Create Audit Log Error:", error);
        return { success: false, message: error.message };
    }
};

export const getAuditLogs = async (limit: number = 20, offset: number = 0) => {
    try {
        const { tables } = await createClientSession();
        const logs = await withRetry(
            () => tables.listRows({
                databaseId: appwritecfg.databaseId,
                tableId: appwritecfg.tables.auditLogs,
                queries: [
                    Query.limit(limit),
                    Query.offset(offset),
                    Query.orderDesc('$createdAt')
                ]
            }),
            3,
            2000,
            "Get Audit Logs"
        );

        return {
            success: true,
            logs: logs.rows,
            total: logs.total
        };
    } catch (error: any) {
        console.error("Get Logs Error:", error);
        return { success: false, logs: [], total: 0 };
    }
}
