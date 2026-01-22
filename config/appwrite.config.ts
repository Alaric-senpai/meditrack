/**
 * centralised access point to appwrite ids and configurations eg like database ids etc
 * 
 */
export const appwritecfg = {
    project: {
        id: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
        endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
        apikey: process.env.APPWRITE_API_KEY!
    },
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    tables: {
        users: process.env.NEXT_PUBLIC_APPWRITE_USERS_TABLE_ID!,
        // Medical collections
        patients: process.env.NEXT_PUBLIC_APPWRITE_PATIENTS_TABLE_ID!,
        visits: process.env.NEXT_PUBLIC_APPWRITE_VISITS_TABLE_ID!,
        diagnoses: process.env.NEXT_PUBLIC_APPWRITE_DIAGNOSES_TABLE_ID!,
        treatments: process.env.NEXT_PUBLIC_APPWRITE_TREATMENTS_TABLE_ID!,
        vitals: process.env.NEXT_PUBLIC_APPWRITE_VITALS_TABLE_ID!,
        labRequests: process.env.NEXT_PUBLIC_APPWRITE_LAB_REQUESTS_TABLE_ID!,
        labResults: process.env.NEXT_PUBLIC_APPWRITE_LAB_RESULTS_TABLE_ID!,
        prescriptions: process.env.NEXT_PUBLIC_APPWRITE_PRESCRIPTIONS_TABLE_ID!,
        auditLogs: process.env.NEXT_PUBLIC_APPWRITE_AUDIT_LOGS_TABLE_ID!,
    },
    storage: {
        // Storage buckets
        medicalFiles: process.env.NEXT_PUBLIC_APPWRITE_MEDICAL_FILES_BUCKET_ID!,
        labReports: process.env.NEXT_PUBLIC_APPWRITE_LAB_REPORTS_BUCKET_ID!,
        patientDocuments: process.env.NEXT_PUBLIC_APPWRITE_PATIENT_DOCUMENTS_BUCKET_ID!,
    }
}