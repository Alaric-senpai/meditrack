'use server';

import { actionClient } from "./safe-action";
import { patientProfileSchema } from "@/lib/medical-validation";
import { createAdminSession, createClientSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";
import { ID, Query } from "node-appwrite";
import { logAuditEvent, AuditAction } from "@/lib/audit-logger";
import { MedicalRoles } from "@/lib/medical-schema";
import { z } from "zod";

/**
 * PATIENT MANAGEMENT
 */

export const createPatientAction = actionClient
  .schema(patientProfileSchema.extend({ userId: z.string() }))
  .action(async ({ parsedInput }) => {
    try {
      const session = await createAdminSession();
      
      const now = new Date().toISOString();
      const patientData = {
        ...parsedInput,
        createdAt: now,
        updatedAt: now,
        status: "active",
      };

      const document = await session.tables.createDocument(
        appwritecfg.databaseId,
        appwritecfg.tables.patients,
        ID.unique(),
        patientData
      );

      // Audit log
      await logAuditEvent({
        userId: "system", 
        userRole: MedicalRoles.ADMIN,
        action: AuditAction.PATIENT_CREATED,
        resourceType: "patient",
        resourceId: document.$id,
        patientId: document.$id,
        newValue: patientData,
        severity: "info",
        status: "success",
      });

      return { success: true, data: document };
    } catch (error: any) {
      console.error("Create patient error:", error);
      return { success: false, error: error.message };
    }
  });

export const getPatientByIdAction = actionClient
  .schema(z.object({ patientId: z.string() }))
  .action(async ({ parsedInput }) => {
    try {
      const session = await createAdminSession();
      const document = await session.tables.getDocument(
        appwritecfg.databaseId,
        appwritecfg.tables.patients,
        parsedInput.patientId
      );

      return { success: true, data: document };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const listPatientsAction = actionClient
  .schema(z.object({
    search: z.string().optional(),
    limit: z.number().optional().default(25),
    offset: z.number().optional().default(0),
  }))
  .action(async ({ parsedInput }) => {
    try {
      const session = await createAdminSession();
      const queries = [
        Query.limit(parsedInput.limit),
        Query.offset(parsedInput.offset),
        Query.orderDesc("createdAt"),
      ];

      if (parsedInput.search) {
        queries.push(Query.or([
          Query.contains("firstName", parsedInput.search),
          Query.contains("lastName", parsedInput.search),
          Query.contains("medicalIdNumber", parsedInput.search),
        ]));
      }

      const result = await session.tables.listDocuments(
        appwritecfg.databaseId,
        appwritecfg.tables.patients,
        queries
      );

      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const updatePatientAction = actionClient
  .schema(z.object({
    patientId: z.string(),
    data: patientProfileSchema.partial()
  }))
  .action(async ({ parsedInput }) => {
    try {
      const session = await createAdminSession();
      
      const oldDoc = await session.tables.getDocument(
        appwritecfg.databaseId,
        appwritecfg.tables.patients,
        parsedInput.patientId
      );

      const updateData = {
        ...parsedInput.data,
        updatedAt: new Date().toISOString(),
      };

      const document = await session.tables.updateDocument(
        appwritecfg.databaseId,
        appwritecfg.tables.patients,
        parsedInput.patientId,
        updateData
      );

      await logAuditEvent({
        userId: "system",
        userRole: MedicalRoles.ADMIN,
        action: AuditAction.PATIENT_UPDATED,
        resourceType: "patient",
        resourceId: parsedInput.patientId,
        patientId: parsedInput.patientId,
        oldValue: oldDoc,
        newValue: updateData,
        severity: "info",
        status: "success",
      });

      return { success: true, data: document };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

/**
 * VISITS & ENCOUNTERS
 */

export const createVisitAction = actionClient
  .schema(z.object({
    patientId: z.string(),
    clinicianId: z.string(),
    visitType: z.enum(["consultation", "follow-up", "emergency", "preventive"]),
    chiefComplaint: z.string(),
    visitNotes: z.string(),
  }))
  .action(async ({ parsedInput }) => {
    try {
      const session = await createAdminSession();
      const now = new Date().toISOString();
      
      const visitData = {
        ...parsedInput,
        visitDate: now,
        status: "completed",
        vitalsSigned: false,
        createdAt: now,
        updatedAt: now,
      };

      const document = await session.tables.createDocument(
        appwritecfg.databaseId,
        appwritecfg.tables.visits,
        ID.unique(),
        visitData
      );

      await logAuditEvent({
        userId: parsedInput.clinicianId,
        userRole: MedicalRoles.DOCTOR,
        action: AuditAction.VISIT_CREATED,
        resourceType: "visit",
        resourceId: document.$id,
        patientId: parsedInput.patientId,
        severity: "info",
        status: "success",
      });

      return { success: true, data: document };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

/**
 * VITALS & OBSERVATIONS
 */

export const recordVitalsAction = actionClient
  .schema(z.object({
    patientId: z.string(),
    visitId: z.string().optional(),
    recordedBy: z.string(),
    bloodPressureSystolic: z.number(),
    bloodPressureDiastolic: z.number(),
    heartRate: z.number(),
    temperature: z.number(),
    respiratoryRate: z.number(),
    oxygenSaturation: z.number(),
    weight: z.number().optional(),
    height: z.number().optional(),
  }))
  .action(async ({ parsedInput }) => {
    try {
      const session = await createAdminSession();
      const now = new Date().toISOString();

      const isAbnormal = 
        parsedInput.bloodPressureSystolic > 140 || 
        parsedInput.bloodPressureSystolic < 90 ||
        parsedInput.heartRate > 100 || 
        parsedInput.heartRate < 60 ||
        parsedInput.temperature > 38 ||
        parsedInput.oxygenSaturation < 95;

      const vitalsData = {
        ...parsedInput,
        recordedAt: now,
        isAbnormal,
        createdAt: now,
        updatedAt: now,
      };

      const document = await session.tables.createDocument(
        appwritecfg.databaseId,
        appwritecfg.tables.vitals,
        ID.unique(),
        vitalsData
      );

      if (parsedInput.visitId) {
        await session.tables.updateDocument(
          appwritecfg.databaseId,
          appwritecfg.tables.visits,
          parsedInput.visitId,
          { vitalsSigned: true }
        );
      }

      await logAuditEvent({
        userId: parsedInput.recordedBy,
        userRole: MedicalRoles.NURSE,
        action: AuditAction.VITALS_RECORDED,
        resourceType: "vitals",
        resourceId: document.$id,
        patientId: parsedInput.patientId,
        details: isAbnormal ? "Abnormal vitals flagged" : "Normal vitals recorded",
        severity: isAbnormal ? "warning" : "info",
        status: "success",
      });

      return { success: true, data: document };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

/**
 * DIAGNOSIS & TREATMENT
 */

export const createDiagnosisAction = actionClient
  .schema(z.object({
    visitId: z.string(),
    patientId: z.string(),
    clinicianId: z.string(),
    icdCode: z.string(),
    diagnosisName: z.string(),
    description: z.string(),
    severity: z.enum(["mild", "moderate", "severe", "critical"]),
    isPrimary: z.boolean(),
  }))
  .action(async ({ parsedInput }) => {
    try {
      const session = await createAdminSession();
      const now = new Date().toISOString();

      const diagnosisData = {
        ...parsedInput,
        recordedDate: now,
        status: "active",
        createdAt: now,
        updatedAt: now,
      };

      const document = await session.tables.createDocument(
        appwritecfg.databaseId,
        appwritecfg.tables.diagnoses,
        ID.unique(),
        diagnosisData
      );

      await logAuditEvent({
        userId: parsedInput.clinicianId,
        userRole: MedicalRoles.DOCTOR,
        action: AuditAction.DIAGNOSIS_CREATED,
        resourceType: "diagnosis",
        resourceId: document.$id,
        patientId: parsedInput.patientId,
        severity: "info",
        status: "success",
      });

      return { success: true, data: document };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

/**
 * PRESCRIPTIONS
 */

export const createPrescriptionAction = actionClient
  .schema(z.object({
    patientId: z.string(),
    visitId: z.string().optional(),
    prescribedBy: z.string(),
    medicationName: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    duration: z.string(),
    instructions: z.string(),
    startDate: z.string(),
  }))
  .action(async ({ parsedInput }) => {
    try {
      const session = await createAdminSession();
      const now = new Date().toISOString();

      const prescriptionData = {
        ...parsedInput,
        status: "issued",
        createdAt: now,
        updatedAt: now,
      };

      const document = await session.tables.createDocument(
        appwritecfg.databaseId,
        appwritecfg.tables.prescriptions,
        ID.unique(),
        prescriptionData
      );

      await logAuditEvent({
        userId: parsedInput.prescribedBy,
        userRole: MedicalRoles.DOCTOR,
        action: AuditAction.PRESCRIPTION_CREATED,
        resourceType: "prescription",
        resourceId: document.$id,
        patientId: parsedInput.patientId,
        severity: "info",
        status: "success",
      });

      return { success: true, data: document };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

/**
 * LAB & DIAGNOSTICS
 */

export const requestLabTestAction = actionClient
  .schema(z.object({
    patientId: z.string(),
    visitId: z.string(),
    requestedBy: z.string(),
    testName: z.string(),
    testType: z.enum(["blood", "urine", "imaging", "pathology", "genetic", "other"]),
    urgency: z.enum(["routine", "urgent", "stat"]),
    description: z.string(),
  }))
  .action(async ({ parsedInput }) => {
    try {
      const session = await createAdminSession();
      const now = new Date().toISOString();

      const requestData = {
        ...parsedInput,
        requestDate: now,
        status: "requested",
        createdAt: now,
        updatedAt: now,
      };

      const document = await session.tables.createDocument(
        appwritecfg.databaseId,
        appwritecfg.tables.labRequests,
        ID.unique(),
        requestData
      );

      await logAuditEvent({
        userId: parsedInput.requestedBy,
        userRole: MedicalRoles.DOCTOR,
        action: AuditAction.LAB_REQUEST_CREATED,
        resourceType: "lab_request",
        resourceId: document.$id,
        patientId: parsedInput.patientId,
        severity: "info",
        status: "success",
      });

      return { success: true, data: document };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
