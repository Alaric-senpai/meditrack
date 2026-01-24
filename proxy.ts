import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
    MedicalRole,
    ROLE_ALLOWED_ROUTES,
    getDefaultRouteForRole,
    isValidRole,
} from "@/lib/rbac";
import { ROLE_COOKIE, SESSION_COOKIE } from "./lib/utils";

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/terms",
    "/privacy",
    "/hipaa-notice",
];

// Auth routes (logged-in users should be redirected away)
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get session and role from cookies
    const sessionCookie = request.cookies.get(SESSION_COOKIE);
    const roleCookie = request.cookies.get(ROLE_COOKIE);

    const isAuthenticated = !!sessionCookie?.value;
    const userRole = roleCookie?.value;

    // Check if it's a public route
    const isPublicRoute = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Check if it's an auth route
    const isAuthRoute = AUTH_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Skip middleware for API routes, static files, and Next.js internals
    if (
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname.includes(".")
    ) {
        return addSecurityHeaders(NextResponse.next());
    }

    // If authenticated and trying to access auth routes, redirect to dashboard
    if (isAuthenticated && isAuthRoute) {
        const role = isValidRole(userRole || "") ? (userRole as MedicalRole) : MedicalRole.PATIENT;
        const redirectUrl = getDefaultRouteForRole(role);
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // If not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If authenticated, check role-based route access
    if (isAuthenticated && !isPublicRoute) {
        const role = isValidRole(userRole || "") ? (userRole as MedicalRole) : MedicalRole.PATIENT;

        // Check if user can access this route based on role
        const allowedRoutes = ROLE_ALLOWED_ROUTES[role] || [];
        const canAccess = allowedRoutes.some((route) => pathname.startsWith(route));

        // If trying to access a role-protected route they don't have access to
        if (!canAccess && !pathname.startsWith("/client")) {
            // Check specific route prefixes
            const protectedPrefixes = ["/admin", "/clinician", "/lab", "/pharmacy", "/patient"];
            const isProtectedRoute = protectedPrefixes.some((prefix) =>
                pathname.startsWith(prefix)
            );

            if (isProtectedRoute) {
                // Redirect to their appropriate dashboard
                const redirectUrl = getDefaultRouteForRole(role);
                return NextResponse.redirect(new URL(redirectUrl, request.url));
            }
        }
    }

    // Add security headers and continue
    return addSecurityHeaders(NextResponse.next());
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
    // Prevent clickjacking
    response.headers.set("X-Frame-Options", "DENY");

    // Prevent MIME type sniffing
    response.headers.set("X-Content-Type-Options", "nosniff");

    // Referrer policy
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // XSS protection (legacy but still useful)
    response.headers.set("X-XSS-Protection", "1; mode=block");

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    ],
};
