/**
 * MediTrack Pro - Medical Database Schema Definition
 * 
 * This file defines all the collections and their attributes for the medical system
 */

export enum MedicalRoles {
  PATIENT = "patient",
  DOCTOR = "doctor",
  NURSE = "nurse",
  LAB_TECHNICIAN = "lab_technician",
  PHARMACIST = "pharmacist",
  ADMIN = "admin"
}

export interface PatientProfile {
  $id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO 8601 format
  gender: "male" | "female" | "other";
  bloodType?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  medicalIdNumber: string; // Unique medical ID
  email: string;
  phone: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  allergies?: string[]; // List of known allergies
  chronicConditions?: string[]; // Existing medical conditions
  medications?: string[]; // Current medications
  userId: string; // Reference to Appwrite user
  status: "active" | "inactive" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalVisit {
  $id?: string;
  patientId: string; // Reference to PatientProfile
  clinicianId: string; // Reference to Doctor/Nurse user
  visitType: "consultation" | "follow-up" | "emergency" | "preventive";
  visitDate: string; // ISO 8601 format
  visitTime?: string;
  visitNotes: string; // Clinical notes from the visit
  chiefComplaint: string; // Why the patient came in
  vitalsSigned: boolean; // Whether vitals were recorded
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  diagnosesMade?: string[]; // References to Diagnosis documents
  treatmentsInitiated?: string[]; // References to Treatment documents
  nextVisitDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Diagnosis {
  $id?: string;
  visitId: string; // Reference to ClinicalVisit
  patientId: string; // Reference to PatientProfile
  icdCode: string; // ICD-10 code
  diagnosisName: string;
  description: string;
  severity: "mild" | "moderate" | "severe" | "critical";
  isPrimary: boolean; // Is this the main diagnosis
  clinicianId: string; // Doctor who made the diagnosis
  recordedDate: string; // ISO 8601 format
  status: "active" | "resolved" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface Treatment {
  $id?: string;
  patientId: string; // Reference to PatientProfile
  diagnosisId: string; // Reference to Diagnosis
  treatmentType: "medication" | "procedure" | "therapy" | "lifestyle" | "surgery";
  treatmentName: string;
  description: string;
  startDate: string; // ISO 8601 format
  endDate?: string;
  instructions: string;
  clinicianId: string; // Doctor who prescribed
  status: "planned" | "ongoing" | "completed" | "discontinued" | "paused";
  outcome?: string; // Result/outcome of treatment
  createdAt: string;
  updatedAt: string;
}

export interface VitalSigns {
  $id?: string;
  patientId: string; // Reference to PatientProfile
  visitId?: string; // Reference to ClinicalVisit (optional if standalone)
  recordedBy: string; // Nurse/Clinician user ID
  recordedAt: string; // ISO 8601 format
  bloodPressureSystolic: number; // mmHg
  bloodPressureDiastolic: number; // mmHg
  heartRate: number; // bpm
  temperature: number; // Celsius or Fahrenheit
  respiratoryRate: number; // breaths per minute
  oxygenSaturation: number; // % SpO2
  weight?: number; // kg or lbs
  height?: number; // cm or inches
  bmi?: number; // Calculated automatically
  notes?: string;
  isAbnormal: boolean; // Flag if any value is outside normal range
  createdAt: string;
  updatedAt: string;
}

export interface LabRequest {
  $id?: string;
  patientId: string; // Reference to PatientProfile
  visitId: string; // Reference to ClinicalVisit
  requestedBy: string; // Doctor user ID
  testType: "blood" | "urine" | "imaging" | "pathology" | "genetic" | "other";
  testName: string;
  description: string;
  urgency: "routine" | "urgent" | "stat";
  collectionDate?: string;
  requestDate: string; // ISO 8601 format
  status: "requested" | "collected" | "processing" | "completed" | "cancelled";
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabResult {
  $id?: string;
  labRequestId: string; // Reference to LabRequest
  patientId: string; // Reference to PatientProfile
  testName: string;
  resultValue: string; // Could be numeric, text, or complex
  unit?: string; // Unit of measurement (e.g., mg/dL)
  referenceRange?: string; // Normal range
  isAbnormal: boolean;
  interpretations?: string;
  uploadedBy: string; // Lab technician user ID
  uploadedDate: string; // ISO 8601 format
  verifiedBy?: string; // Doctor who verified results
  verifiedDate?: string;
  reportFileId?: string; // Reference to file in storage
  status: "preliminary" | "verified" | "final" | "corrected";
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  $id?: string;
  patientId: string; // Reference to PatientProfile
  visitId?: string; // Reference to ClinicalVisit (optional)
  prescribedBy: string; // Doctor user ID
  medicationName: string;
  dosage: string; // e.g., "500mg"
  frequency: string; // e.g., "3 times daily"
  duration: string; // e.g., "7 days" or "ongoing"
  route: "oral" | "injection" | "topical" | "inhalation" | "rectal" | "other";
  instructions: string; // Additional instructions
  startDate: string; // ISO 8601 format
  endDate?: string;
  quantity?: number;
  refillsAllowed?: number;
  refillsRemaining?: number;
  contraindications?: string[];
  sideEffects?: string[];
  status: "issued" | "dispensed" | "completed" | "cancelled" | "suspended";
  dispensedBy?: string; // Pharmacist user ID
  dispensedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  $id?: string;
  userId: string; // User who performed the action
  userRole: MedicalRoles;
  action: string; // e.g., "patient_created", "diagnosis_updated", "lab_result_verified"
  resourceType: string; // e.g., "patient", "diagnosis", "prescription"
  resourceId: string; // ID of the affected resource
  patientId?: string; // Patient affected (if applicable)
  oldValue?: Record<string, any>; // Previous state
  newValue?: Record<string, any>; // New state
  details?: string; // Additional context
  ipAddress?: string;
  severity: "info" | "warning" | "critical";
  status: "success" | "failed";
  timestamp: string; // ISO 8601 format
  createdAt: string;
}

// Collection IDs for Appwrite
export const MEDICAL_COLLECTIONS = {
  PATIENTS: "patients",
  VISITS: "visits",
  DIAGNOSES: "diagnoses",
  TREATMENTS: "treatments",
  VITAL_SIGNS: "vital_signs",
  LAB_REQUESTS: "lab_requests",
  LAB_RESULTS: "lab_results",
  PRESCRIPTIONS: "prescriptions",
  AUDIT_LOGS: "audit_logs"
} as const;

// Attribute constraints
export const VALIDATION_RULES = {
  firstName: { min: 2, max: 50 },
  lastName: { min: 2, max: 50 },
  medicalIdNumber: { min: 5, max: 20 },
  phone: { pattern: /^\+?[1-9]\d{1,14}$/ },
  email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  icdCode: { pattern: /^[A-Z]\d{2}(\.\d{1,3})?$/ }, // ICD-10 format
} as const;

// Default permission scopes
export const PERMISSION_SCOPES = {
  PUBLIC_READ: "public", // Anyone can read
  PATIENT_READ: (patientId: string) => `patient_${patientId}`, // Patient can read
  ROLE_READ: (role: MedicalRoles) => `role_${role}`, // Role-based read
  DOCTOR_WRITE: (doctorId: string) => `doctor_${doctorId}`, // Doctor can write
  ADMIN_WRITE: "admin", // Admin can write
} as const;
