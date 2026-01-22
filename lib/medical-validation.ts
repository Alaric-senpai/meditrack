import { z } from "zod";

/**
 * Validation schemas for MediTrack Pro medical data
 */

// Patient validation
export const patientProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  dateOfBirth: z.string().datetime("Invalid date format"),
  gender: z.enum(["male", "female", "other"]),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  medicalIdNumber: z.string().min(5).max(20).regex(/^[A-Z0-9\-]+$/, "Invalid medical ID format"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  emergencyContact: z.object({
    name: z.string().min(2),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
    relationship: z.string().min(2),
  }).optional(),
  address: z.object({
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    zipCode: z.string().min(3),
    country: z.string().min(2),
  }),
  allergies: z.array(z.string()).optional(),
  chronicConditions: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
});

// Clinical visit validation
export const clinicalVisitSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  clinicianId: z.string().min(1, "Clinician ID is required"),
  visitType: z.enum(["consultation", "follow-up", "emergency", "preventive"]),
  visitDate: z.string().datetime("Invalid date format"),
  visitTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  visitNotes: z.string().min(10, "Visit notes must be at least 10 characters"),
  chiefComplaint: z.string().min(5, "Chief complaint is required"),
  status: z.enum(["scheduled", "completed", "cancelled", "no-show"]),
  nextVisitDate: z.string().datetime("Invalid date format").optional(),
});

// Diagnosis validation
export const diagnosisSchema = z.object({
  visitId: z.string().min(1, "Visit ID is required"),
  patientId: z.string().min(1, "Patient ID is required"),
  icdCode: z.string().regex(/^[A-Z]\d{2}(\.\d{1,3})?$/, "Invalid ICD-10 code format"),
  diagnosisName: z.string().min(3, "Diagnosis name is required"),
  description: z.string().min(10, "Description is required"),
  severity: z.enum(["mild", "moderate", "severe", "critical"]),
  isPrimary: z.boolean(),
  clinicianId: z.string().min(1, "Clinician ID is required"),
  status: z.enum(["active", "resolved", "archived"]),
});

// Treatment validation
export const treatmentSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  diagnosisId: z.string().min(1, "Diagnosis ID is required"),
  treatmentType: z.enum(["medication", "procedure", "therapy", "lifestyle", "surgery"]),
  treatmentName: z.string().min(3, "Treatment name is required"),
  description: z.string().min(10, "Description is required"),
  startDate: z.string().datetime("Invalid date format"),
  endDate: z.string().datetime("Invalid date format").optional(),
  instructions: z.string().min(5, "Instructions are required"),
  clinicianId: z.string().min(1, "Clinician ID is required"),
  status: z.enum(["planned", "ongoing", "completed", "discontinued", "paused"]),
  outcome: z.string().optional(),
});

// Vital signs validation
export const vitalSignsSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  visitId: z.string().optional(),
  recordedBy: z.string().min(1, "Recorder ID is required"),
  recordedAt: z.string().datetime("Invalid date format"),
  bloodPressureSystolic: z.number().min(40).max(250, "Invalid systolic BP"),
  bloodPressureDiastolic: z.number().min(20).max(150, "Invalid diastolic BP"),
  heartRate: z.number().min(30).max(200, "Invalid heart rate"),
  temperature: z.number().min(35).max(42, "Invalid temperature"),
  respiratoryRate: z.number().min(6).max(60, "Invalid respiratory rate"),
  oxygenSaturation: z.number().min(70).max(100, "Invalid SpO2"),
  weight: z.number().optional(),
  height: z.number().optional(),
  notes: z.string().optional(),
});

// Lab request validation
export const labRequestSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  visitId: z.string().min(1, "Visit ID is required"),
  requestedBy: z.string().min(1, "Requester ID is required"),
  testType: z.enum(["blood", "urine", "imaging", "pathology", "genetic", "other"]),
  testName: z.string().min(3, "Test name is required"),
  description: z.string().min(10, "Description is required"),
  urgency: z.enum(["routine", "urgent", "stat"]),
  specialInstructions: z.string().optional(),
  status: z.enum(["requested", "collected", "processing", "completed", "cancelled"]),
});

// Lab result validation
export const labResultSchema = z.object({
  labRequestId: z.string().min(1, "Lab request ID is required"),
  patientId: z.string().min(1, "Patient ID is required"),
  testName: z.string().min(3, "Test name is required"),
  resultValue: z.string().min(1, "Result value is required"),
  unit: z.string().optional(),
  referenceRange: z.string().optional(),
  isAbnormal: z.boolean(),
  interpretations: z.string().optional(),
  uploadedBy: z.string().min(1, "Uploader ID is required"),
  uploadedDate: z.string().datetime("Invalid date format"),
  verifiedBy: z.string().optional(),
  verifiedDate: z.string().datetime("Invalid date format").optional(),
  reportFileId: z.string().optional(),
  status: z.enum(["preliminary", "verified", "final", "corrected"]),
});

// Prescription validation
export const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  visitId: z.string().optional(),
  prescribedBy: z.string().min(1, "Prescriber ID is required"),
  medicationName: z.string().min(3, "Medication name is required"),
  dosage: z.string().min(2, "Dosage is required"),
  frequency: z.string().min(3, "Frequency is required"),
  duration: z.string().min(3, "Duration is required"),
  route: z.enum(["oral", "injection", "topical", "inhalation", "rectal", "other"]),
  instructions: z.string().min(5, "Instructions are required"),
  startDate: z.string().datetime("Invalid date format"),
  endDate: z.string().datetime("Invalid date format").optional(),
  quantity: z.number().positive().optional(),
  refillsAllowed: z.number().min(0).optional(),
  refillsRemaining: z.number().min(0).optional(),
  contraindications: z.array(z.string()).optional(),
  sideEffects: z.array(z.string()).optional(),
  status: z.enum(["issued", "dispensed", "completed", "cancelled", "suspended"]),
  dispensedBy: z.string().optional(),
  dispensedDate: z.string().datetime("Invalid date format").optional(),
});

// Pagination validation
export const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(25),
  offset: z.number().min(0).default(0),
});

// Audit log validation
export const auditLogSchema = z.object({
  userId: z.string().min(1),
  userRole: z.enum(["patient", "doctor", "nurse", "lab_technician", "pharmacist", "admin"]),
  action: z.string().min(3),
  resourceType: z.string().min(3),
  resourceId: z.string().min(1),
  patientId: z.string().optional(),
  details: z.string().optional(),
  severity: z.enum(["info", "warning", "critical"]).default("info"),
});

// Combined update schemas
export type PatientProfileInput = z.infer<typeof patientProfileSchema>;
export type ClinicalVisitInput = z.infer<typeof clinicalVisitSchema>;
export type DiagnosisInput = z.infer<typeof diagnosisSchema>;
export type TreatmentInput = z.infer<typeof treatmentSchema>;
export type VitalSignsInput = z.infer<typeof vitalSignsSchema>;
export type LabRequestInput = z.infer<typeof labRequestSchema>;
export type LabResultInput = z.infer<typeof labResultSchema>;
export type PrescriptionInput = z.infer<typeof prescriptionSchema>;
export type AuditLogInput = z.infer<typeof auditLogSchema>;
