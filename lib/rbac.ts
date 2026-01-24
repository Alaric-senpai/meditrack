
/**
 * Role-Based Access Control (RBAC) System for MediTrack Pro
 * Defines medical roles, permissions, and access control utilities
 */

// Medical roles enum
export enum MedicalRole {
    PATIENT = "patient",
    DOCTOR = "doctor",
    NURSE = "nurse",
    LAB_TECHNICIAN = "lab-tech",
    PHARMACIST = "pharmacist",
    ADMIN = "admin",
}

// Role display names
export const RoleDisplayNames: Record<MedicalRole, string> = {
    [MedicalRole.PATIENT]: "Patient",
    [MedicalRole.DOCTOR]: "Doctor",
    [MedicalRole.NURSE]: "Nurse",
    [MedicalRole.LAB_TECHNICIAN]: "Lab Technician",
    [MedicalRole.PHARMACIST]: "Pharmacist",
    [MedicalRole.ADMIN]: "Administrator",
};

// Resources that can be accessed
export type Resource =
    | "patients"
    | "visits"
    | "diagnoses"
    | "treatments"
    | "vitals"
    | "lab_requests"
    | "lab_results"
    | "prescriptions"
    | "users"
    | "audit_logs"
    | "settings"
    | "own_profile"
    | "own_records";

// Actions that can be performed
export type Action = "create" | "read" | "update" | "delete";

// Permission matrix defining what each role can do
const PERMISSIONS: Record<MedicalRole, Record<Resource, Action[]>> = {
    [MedicalRole.ADMIN]: {
        patients: ["create", "read", "update", "delete"],
        visits: ["create", "read", "update", "delete"],
        diagnoses: ["create", "read", "update", "delete"],
        treatments: ["create", "read", "update", "delete"],
        vitals: ["create", "read", "update", "delete"],
        lab_requests: ["create", "read", "update", "delete"],
        lab_results: ["create", "read", "update", "delete"],
        prescriptions: ["create", "read", "update", "delete"],
        users: ["create", "read", "update", "delete"],
        audit_logs: ["read"],
        settings: ["read", "update"],
        own_profile: ["read", "update"],
        own_records: ["read"],
    },
    [MedicalRole.DOCTOR]: {
        patients: ["create", "read", "update"],
        visits: ["create", "read", "update"],
        diagnoses: ["create", "read", "update"],
        treatments: ["create", "read", "update"],
        vitals: ["read"],
        lab_requests: ["create", "read"],
        lab_results: ["read"],
        prescriptions: ["create", "read", "update"],
        users: [],
        audit_logs: [],
        settings: [],
        own_profile: ["read", "update"],
        own_records: ["read"],
    },
    [MedicalRole.NURSE]: {
        patients: ["read", "update"],
        visits: ["create", "read", "update"],
        diagnoses: ["read"],
        treatments: ["read"],
        vitals: ["create", "read", "update"],
        lab_requests: ["read"],
        lab_results: ["read"],
        prescriptions: ["read"],
        users: [],
        audit_logs: [],
        settings: [],
        own_profile: ["read", "update"],
        own_records: ["read"],
    },
    [MedicalRole.LAB_TECHNICIAN]: {
        patients: ["read"],
        visits: [],
        diagnoses: [],
        treatments: [],
        vitals: [],
        lab_requests: ["read", "update"],
        lab_results: ["create", "read", "update"],
        prescriptions: [],
        users: [],
        audit_logs: [],
        settings: [],
        own_profile: ["read", "update"],
        own_records: ["read"],
    },
    [MedicalRole.PHARMACIST]: {
        patients: ["read"],
        visits: [],
        diagnoses: [],
        treatments: [],
        vitals: [],
        lab_requests: [],
        lab_results: [],
        prescriptions: ["read", "update"],
        users: [],
        audit_logs: [],
        settings: [],
        own_profile: ["read", "update"],
        own_records: ["read"],
    },
    [MedicalRole.PATIENT]: {
        patients: [],
        visits: [],
        diagnoses: [],
        treatments: [],
        vitals: [],
        lab_requests: [],
        lab_results: [],
        prescriptions: [],
        users: [],
        audit_logs: [],
        settings: [],
        own_profile: ["read", "update"],
        own_records: ["read"],
    },
};

// Route mappings for each role
export const ROLE_ROUTES: Record<MedicalRole, string> = {
    [MedicalRole.PATIENT]: "/patient",
    [MedicalRole.DOCTOR]: "/clinician",
    [MedicalRole.NURSE]: "/clinician",
    [MedicalRole.LAB_TECHNICIAN]: "/lab",
    [MedicalRole.PHARMACIST]: "/pharmacy",
    [MedicalRole.ADMIN]: "/admin",
};

// Route prefixes allowed for each role
export const ROLE_ALLOWED_ROUTES: Record<MedicalRole, string[]> = {
    [MedicalRole.ADMIN]: ["/admin", "/client"],
    [MedicalRole.DOCTOR]: ["/clinician", "/client"],
    [MedicalRole.NURSE]: ["/clinician", "/client"],
    [MedicalRole.LAB_TECHNICIAN]: ["/lab", "/client"],
    [MedicalRole.PHARMACIST]: ["/pharmacy", "/client"],
    [MedicalRole.PATIENT]: ["/patient", "/client"],
};

/**
 * Check if a user with a given role can access a resource
 */
export function canAccess(role: MedicalRole, resource: Resource): boolean {
    const permissions = PERMISSIONS[role];
    if (!permissions) return false;
    const actions = permissions[resource];
    return actions && actions.length > 0;
}

/**
 * Check if a user with a given role can perform a specific action on a resource
 */
export function canPerformAction(
    role: MedicalRole,
    resource: Resource,
    action: Action
): boolean {
    const permissions = PERMISSIONS[role];
    if (!permissions) return false;
    const actions = permissions[resource];
    return actions?.includes(action) ?? false;
}

/**
 * Get all allowed actions for a role on a resource
 */
export function getAllowedActions(
    role: MedicalRole,
    resource: Resource
): Action[] {
    return PERMISSIONS[role]?.[resource] ?? [];
}

/**
 * Check if a role can access a given route
 */
export function canAccessRoute(role: MedicalRole, pathname: string): boolean {
    const allowedRoutes = ROLE_ALLOWED_ROUTES[role];
    if (!allowedRoutes) return false;

    return allowedRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Get the default redirect route for a role
 */
export function getDefaultRouteForRole(role: MedicalRole): string {
    return ROLE_ROUTES[role] || "/patient";
}

/**
 * Validate if a string is a valid medical role
 */
export function isValidRole(role: string): role is MedicalRole {
    return Object.values(MedicalRole).includes(role as MedicalRole);
}

/**
 * Get role from string, with fallback to patient
 */
export function parseRole(role: string | undefined | null): MedicalRole {
    if (role && isValidRole(role)) {
        return role;
    }
    return MedicalRole.PATIENT;
}
