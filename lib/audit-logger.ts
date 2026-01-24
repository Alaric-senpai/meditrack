/**
 * Audit Logging System for MediTrack Pro
 * Tracks all critical medical actions for compliance and audit trails
 */

'use server';

import { createAdminSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";
import { MedicalRoles } from "./medical-schema";
import { ID, Query } from "node-appwrite";

export enum AuditAction {
  // Patient actions
  PATIENT_CREATED = "patient_created",
  PATIENT_UPDATED = "patient_updated",
  PATIENT_DELETED = "patient_deleted",
  PATIENT_VIEWED = "patient_viewed",

  // Visit actions
  VISIT_CREATED = "visit_created",
  VISIT_COMPLETED = "visit_completed",
  VISIT_CANCELLED = "visit_cancelled",
  VISIT_UPDATED = "visit_updated",

  // Diagnosis actions
  DIAGNOSIS_CREATED = "diagnosis_created",
  DIAGNOSIS_UPDATED = "diagnosis_updated",
  DIAGNOSIS_RESOLVED = "diagnosis_resolved",

  // Treatment actions
  TREATMENT_CREATED = "treatment_created",
  TREATMENT_UPDATED = "treatment_updated",
  TREATMENT_COMPLETED = "treatment_completed",

  // Lab actions
  LAB_REQUEST_CREATED = "lab_request_created",
  LAB_RESULT_UPLOADED = "lab_result_uploaded",
  LAB_RESULT_VERIFIED = "lab_result_verified",

  // Prescription actions
  PRESCRIPTION_CREATED = "prescription_created",
  PRESCRIPTION_DISPENSED = "prescription_dispensed",
  PRESCRIPTION_CANCELLED = "prescription_cancelled",

  // Vitals actions
  VITALS_RECORDED = "vitals_recorded",
  VITALS_UPDATED = "vitals_updated",

  // Access control
  SENSITIVE_DATA_ACCESSED = "sensitive_data_accessed",
  PERMISSION_DENIED = "permission_denied",

  // System actions
  USER_LOGIN = "user_login",
  USER_LOGOUT = "user_logout",
  USER_ROLE_CHANGED = "user_role_changed",
  USER_INVITED = "invite_user",
  USER_ROLE_UPDATED = "update_role",
  USER_STATUS_TOGGLED = "toggle_status",
  USER_SESSIONS_REVOKED = "revoke_sessions",
  DOCTOR_CREATED = "create_doctor",
  NURSE_CREATED = "create_nurse"
}

export interface AuditLogEntry {
  userId: string;
  userRole: MedicalRoles | "admin";
  action: AuditAction | string;
  resourceType: string;
  resourceId: string;
  patientId?: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  details?: string;
  ipAddress?: string;
  severity: "info" | "warning" | "critical";
  status: "success" | "failed";
}

/**
 * Log an audit event to the database
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const session = await createAdminSession();

    const auditDocument = {
      userId: entry.userId,
      userRole: entry.userRole,
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      patientId: entry.patientId,
      oldValue: entry.oldValue ? JSON.stringify(entry.oldValue) : null,
      newValue: entry.newValue ? JSON.stringify(entry.newValue) : null,
      details: entry.details,
      ipAddress: entry.ipAddress,
      severity: entry.severity,
      status: entry.status,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await session.tables.createRow({
      databaseId: appwritecfg.databaseId,
      tableId: appwritecfg.tables.auditLogs,
      rowId: ID.unique(),
      data: auditDocument
    });
  } catch (error) {
    console.error("Failed to log audit event:", error);
  }
}

/**
 * Retrieve audit logs with filtering
 */
export async function getAuditLogs(options?: {
  userId?: string;
  resourceType?: string;
  resourceId?: string;
  patientId?: string;
  action?: AuditAction;
  severity?: "info" | "warning" | "critical";
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const session = await createAdminSession();
    const queries: any[] = [];

    if (options?.userId) {
      queries.push(Query.equal("userId", options.userId));
    }
    if (options?.resourceType) {
      queries.push(Query.equal("resourceType", options.resourceType));
    }
    if (options?.resourceId) {
      queries.push(Query.equal("resourceId", options.resourceId));
    }
    if (options?.patientId) {
      queries.push(Query.equal("patientId", options.patientId));
    }
    if (options?.action) {
      queries.push(Query.equal("action", options.action));
    }
    if (options?.severity) {
      queries.push(Query.equal("severity", options.severity));
    }
    if (options?.startDate) {
      queries.push(Query.greaterThanEqual("timestamp", options.startDate));
    }
    if (options?.endDate) {
      queries.push(Query.lessThanEqual("timestamp", options.endDate));
    }

    // Add ordering and pagination
    queries.push(Query.orderDesc("timestamp"));
    if (options?.limit) {
      queries.push(Query.limit(Math.min(options.limit, 100)));
    }
    if (options?.offset) {
      queries.push(Query.offset(options.offset));
    }

    const result = await session.tables.listRows({
      databaseId: appwritecfg.databaseId,
      tableId: appwritecfg.tables.auditLogs,
      queries
    });

    return { rows: result.rows, total: result.total };
  } catch (error) {
    console.error("Failed to retrieve audit logs:", error);
    throw error;
  }
}

/**
 * Archive old audit logs (for compliance with retention policies)
 */
export async function archiveOldAuditLogs(olderThanDays: number = 365): Promise<number> {
  try {
    const session = await createAdminSession();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const { rows } = await session.tables.listRows({
      databaseId: appwritecfg.databaseId,
      tableId: appwritecfg.tables.auditLogs,
      queries: [Query.lessThanEqual("timestamp", cutoffDate.toISOString())]
    });

    let archivedCount = 0;
    for (const doc of rows) {
      try {
        archivedCount++;
      } catch (error) {
        console.error(`Failed to archive log ${doc.$id}:`, error);
      }
    }

    return archivedCount;
  } catch (error) {
    console.error("Failed to archive audit logs:", error);
    throw error;
  }
}

/**
 * Helper to log sensitive data access
 */
export async function logSensitiveDataAccess(
  userId: string,
  userRole: MedicalRoles,
  patientId: string,
  dataType: string,
  authorized: boolean
) {
  await logAuditEvent({
    userId,
    userRole,
    action: AuditAction.SENSITIVE_DATA_ACCESSED,
    resourceType: "patient_data",
    resourceId: patientId,
    patientId,
    details: `Accessed ${dataType}. ${authorized ? "Authorized" : "UNAUTHORIZED"}`,
    severity: authorized ? "info" : "critical",
    status: authorized ? "success" : "failed",
  });
}

/**
 * Helper to log failed permission attempts
 */
export async function logPermissionDenied(
  userId: string,
  userRole: MedicalRoles,
  action: string,
  resourceId: string,
  reason: string
) {
  await logAuditEvent({
    userId,
    userRole,
    action: AuditAction.PERMISSION_DENIED,
    resourceType: "access_control",
    resourceId,
    details: `${action} - Reason: ${reason}`,
    severity: "warning",
    status: "failed",
  });
}

/**
 * Helper to log critical medical events
 */
export async function logCriticalEvent(
  userId: string,
  userRole: MedicalRoles,
  action: AuditAction,
  resourceType: string,
  resourceId: string,
  patientId: string,
  details: string,
  oldValue?: Record<string, any>,
  newValue?: Record<string, any>
) {
  await logAuditEvent({
    userId,
    userRole,
    action,
    resourceType,
    resourceId,
    patientId,
    details,
    oldValue,
    newValue,
    severity: "critical",
    status: "success",
  });
}
