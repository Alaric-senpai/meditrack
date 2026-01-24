"use server";

import { actionClient } from "./safe-action";
import { RegisterformSchema, LoginformSchema } from "../lib/form-schema";
import { createAdminSession, createClientSession } from "@/server/clients";
import { ID, Query, Client, Account, OAuthProvider } from "node-appwrite";
import { appwritecfg } from "@/config/appwrite.config";
import { setSessionCookie, setRoleCookie, deleteSessionCookie, deleteRoleCookie, getRoleCookie, getUserSessionCookie } from "@/server/cookies";
import { createUserRecord, getUserRole } from "./user.actions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";
import { UserRole as roles } from "@/lib/utils";
import { authConfig } from "@/config/app.config";
import { sendWelcomeEmail } from "./mail.actions";
import { withRetry } from "@/config/helpers/retry.helpers";

export const RegisterserverAction = actionClient
  .inputSchema(RegisterformSchema)
  .action(async ({ parsedInput }) => {
    const { email, password, name, role } = parsedInput;

    try {
      // 1. Create Admin Session
      const { accounts } = await createAdminSession();

      // 2. Create Auth User
      const user = await withRetry(
        () => accounts.create({ userId: ID.unique(), email, password, name }),
        3,
        2000,
        "Register User"
      );

      // 3. Create User Document with role (Delegated to user.actions)
      const userRole = role || "patient";
      await createUserRecord(user.$id, email, name, userRole);

      // 4. Send Welcome Email
      await sendWelcomeEmail({ email, userName: name });

      // 5. Set role cookie for the new user
      await setRoleCookie(userRole as roles);

      return {
        success: true,
        message: "Account created successfully",
        data: { role: userRole }
      };
    } catch (error: any) {
      console.error("Registration Error:", error);
      return {
        success: false,
        message: error?.message || "Failed to create account",
      };
    }
  });


export const LoginserverAction = actionClient
  .inputSchema(LoginformSchema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput;

    try {
      // 1. Use admin session to create email password session
      const { accounts: account } = await createAdminSession();

      // 2. Create Session
      const session = await withRetry(
        () => account.createEmailPasswordSession({ email, password }),
        3,
        2000,
        "Login Session"
      );

      // 3. Set Session Cookie with expiration
      await setSessionCookie(session.secret);

      // 4. Fetch User Role and set cookie
      const role = await getUserRole(session.userId);
      await setRoleCookie(role as roles);

      return {
        success: true,
        message: "Login successful",
        data: {
          userId: session.userId,
          expire: session.expire,
          role: role as roles
        }
      };
    } catch (error: any) {
      console.error("Login Error:", error);
      return {
        success: false,
        message: error?.message || "Invalid credentials",
      };
    }
  });

const OAuthSchema = z.object({
  provider: z.enum(["google", "github", "apple", "microsoft", "facebook"])
});

export const OAuthServerAction = actionClient
  .inputSchema(OAuthSchema)
  .action(async ({ parsedInput }) => {
    const { provider } = parsedInput;
    const origin = (await headers()).get("origin");

    try {
      // Construct Appwrite OAuth2 URL manually to control redirect flow
      const target = new URL(`${appwritecfg.project.endpoint}/account/sessions/oauth2/${provider}`);
      target.searchParams.set("project", appwritecfg.project.id);
      target.searchParams.set("success", `${origin}/oauth`);
      target.searchParams.set("failure", `${origin}/fail?error=oauth_failed`);

      return {
        success: true,
        data: { redirectUrl: target.toString() }
      };
    } catch (error: any) {
      console.error("OAuth Initialization Error:", error);
      return {
        success: false,
        message: error?.message || "Failed to initialize OAuth",
      };
    }
  });



export const Logout = async () => {
  try {
    const { accounts } = await createClientSession();

    await withRetry(
      () => accounts.deleteSession({
        sessionId: "current"
      }),
      3,
      2000,
      "Logout Session"
    );

    await deleteSessionCookie();
    await deleteRoleCookie();

    return {
      success: true,
      message: "Logged out successfully"
    };
  } catch (error: any) {
    console.error("Logout Error:", error);

    // Even if Appwrite session deletion fails, clear local cookies
    await deleteSessionCookie();
    await deleteRoleCookie();

    return {
      success: false,
      message: error?.message || "Failed to logout",
    };
  }
};

/**
 * Initialize GitHub OAuth flow
 */
export const handleGithubOauth = async () => {
  try {
    const { accounts } = await createAdminSession();
    const origin = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    const githubAuth = await withRetry(
      () => accounts.createOAuth2Token({
        provider: OAuthProvider.Github,
        success: `${origin}/oauth`,
        failure: `${origin}/fail?error=github_oauth_failed`,
        scopes: ['user', 'user:email']
      }),
      3,
      2000,
      "Create Github OAuth Token"
    );

    if (githubAuth) {
      return {
        success: true,
        message: "GitHub OAuth initialized successfully",
        callback: githubAuth
      };
    }

    return {
      success: false,
      message: "Failed to initialize GitHub OAuth"
    };
  } catch (error: any) {
    console.error("GitHub OAuth Error:", error);
    return {
      success: false,
      message: error?.message || "Error initializing GitHub OAuth"
    };
  }
};

/**
 * Initialize Google OAuth flow
 */
export const handleGoogleOauth = async () => {
  try {
    const { accounts } = await createAdminSession();
    const origin = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    const googleAuth = await withRetry(
      () => accounts.createOAuth2Token({
        provider: OAuthProvider.Google,
        success: `${origin}/oauth`,
        failure: `${origin}/fail?error=google_oauth_failed`,
        scopes: ['profile', 'email']
      }),
      3,
      2000,
      "Create Google OAuth Token"
    );

    if (googleAuth) {
      return {
        success: true,
        message: "Google OAuth initialized successfully",
        callback: googleAuth
      };
    }

    return {
      success: false,
      message: "Failed to initialize Google OAuth"
    };
  } catch (error: any) {
    console.error("Google OAuth Error:", error);
    return {
      success: false,
      message: error?.message || "Error initializing Google OAuth"
    };
  }
};



/**
 * Handle OAuth callback - called from the OAuth route handler
 */
export const handleOauthCallback = async (secret: string, userId: string) => {
  try {
    const { accounts, tables } = await createAdminSession();

    const session = await withRetry(
      () => accounts.createSession({
        userId,
        secret
      }),
      3,
      2000,
      "Complete OAuth Session"
    );

    if (session) {
      await setSessionCookie(session.secret);

      // Check if user record exists in database
      try {
        const userDocs = await withRetry(
          () => tables.listRows({
            databaseId: appwritecfg.databaseId,
            tableId: appwritecfg.tables.users,
            queries: [Query.equal("userid", userId)]
          }),
          3,
          2000,
          "Check OAuth User Record"
        );

        // If user record doesn't exist, create one
        if (!userDocs.rows || userDocs.rows.length === 0) {
          // Get user details from the session's userId
          const userAccount = await withRetry(
            () => accounts.get(),
            3,
            2000,
            "Get OAuth User Details"
          );
          await createUserRecord(userId, userAccount.email, userAccount.name);
        }
      } catch (dbError: any) {
        console.error("Database check/creation error:", dbError);
        // Continue with auth even if DB operation fails
      }

      const role = await getUserRole(session.userId);
      await setRoleCookie(role as roles);

      return {
        success: true,
        message: "OAuth process completed successfully",
        data: {
          userId: session.userId,
          expire: session.expire
        }
      };
    }

    return {
      success: false,
      message: "Failed to complete OAuth process"
    };
  } catch (error: any) {
    console.error("OAuth Callback Error:", error);
    return {
      success: false,
      message: error?.message || "Failed to complete auth process",
    };
  }
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = async () => {
  try {
    const { accounts } = await createClientSession();
    const user = await withRetry(
      () => accounts.get(),
      3,
      2000,
      "Check Login Status"
    );

    return !!(user && user.$id);
  } catch (error) {
    return false;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  try {
    const { accounts } = await createClientSession();
    const user = await withRetry(
      () => accounts.get(),
      3,
      2000,
      "Get Current User"
    );

    if (!user) {
      return {
        success: false,
        message: "No authenticated user found",
        user: null
      };
    }

    return {
      success: true,
      message: "User retrieved successfully",
      user
    };
  } catch (error: any) {
    console.error("Get Current User Error:", error);
    return {
      success: false,
      message: error?.message || "Failed to get active user",
      user: null
    };
  }
};

/**
 * Check if user matches a specific role
 */
export const userMatchesRole = async (role: roles) => {
  const savedRole = await getRoleCookie();

  if (savedRole) {
    return savedRole as roles === role;
  }
  return false;
};

/**
 * Validate and refresh session if needed
 * Returns true if session is valid or was refreshed successfully
 */
export const validateSession = async (): Promise<boolean> => {
  try {
    const sessionSecret = await getUserSessionCookie();

    if (!sessionSecret) {
      return false;
    }

    // Try to get user with current session
    const { accounts } = await createClientSession();
    const user = await withRetry(
      () => accounts.get(),
      3,
      2000,
      "Validate Session User"
    );

    if (user && user.$id) {
      return true;
    }

    return false;
  } catch (error: any) {
    console.error("Session Validation Error:", error);

    // If session is invalid, clear cookies
    if (error?.code === 401 || error?.type === 'user_unauthorized') {
      await deleteSessionCookie();
      await deleteRoleCookie();
    }

    return false;
  }
};

/**
 * Check session expiry and return time remaining
 */
export const getSessionExpiry = async () => {
  try {
    const { accounts } = await createClientSession();
    const session = await withRetry(
      () => accounts.getSession('current'),
      3,
      2000,
      "Get Current Session"
    );

    if (session) {
      const expireDate = new Date(session.expire);
      const now = new Date();
      const timeRemaining = expireDate.getTime() - now.getTime();

      return {
        success: true,
        expire: session.expire,
        timeRemaining: Math.max(0, timeRemaining),
        isExpired: timeRemaining <= 0
      };
    }

    return {
      success: false,
      message: "No active session found"
    };
  } catch (error: any) {
    console.error("Get Session Expiry Error:", error);
    return {
      success: false,
      message: error?.message || "Failed to get session expiry"
    };
  }
};

/**
 * Extend current session by updating it
 */
export const extendSession = async () => {
  try {
    const { accounts } = await createClientSession();

    // Get current session
    const currentSession = await withRetry(
      () => accounts.getSession('current'),
      3,
      2000,
      "Get Session for Extension"
    );

    if (!currentSession) {
      return {
        success: false,
        message: "No active session to extend"
      };
    }

    // Update session to extend its lifetime
    const updatedSession = await withRetry(
      () => accounts.updateSession({
        sessionId: 'current'
      }),
      3,
      2000,
      "Extend Session"
    );

    if (updatedSession) {
      // Update session cookie with new secret if it changed
      await setSessionCookie(updatedSession.secret);

      return {
        success: true,
        message: "Session extended successfully",
        data: {
          expire: updatedSession.expire
        }
      };
    }

    return {
      success: false,
      message: "Failed to extend session"
    };
  } catch (error: any) {
    console.error("Extend Session Error:", error);
    return {
      success: false,
      message: error?.message || "Failed to extend session"
    };
  }
};

/**
 * List all active sessions for the current user
 */
export const listActiveSessions = async () => {
  try {
    const { accounts } = await createClientSession();
    const sessions = await withRetry(
      () => accounts.listSessions(),
      3,
      2000,
      "List Active Sessions"
    );

    return {
      success: true,
      sessions: sessions.sessions,
      total: sessions.total
    };
  } catch (error: any) {
    console.error("List Sessions Error:", error);
    return {
      success: false,
      message: error?.message || "Failed to list sessions",
      sessions: [],
      total: 0
    };
  }
};

/**
 * Delete a specific session by ID
 */
export const deleteSessionById = async (sessionId: string) => {
  try {
    const { accounts } = await createClientSession();

    await withRetry(
      () => accounts.deleteSession({
        sessionId
      }),
      3,
      2000,
      "Delete Session by ID"
    );

    // If deleting current session, clear cookies
    if (sessionId === 'current') {
      await deleteSessionCookie();
      await deleteRoleCookie();
    }

    return {
      success: true,
      message: "Session deleted successfully"
    };
  } catch (error: any) {
    console.error("Delete Session Error:", error);
    return {
      success: false,
      message: error?.message || "Failed to delete session"
    };
  }
};

/**
 * Get OAuth identities linked to the user account
 */
export const getLinkedIdentities = async () => {
  try {
    const { accounts } = await createClientSession();
    const identities = await withRetry(
      () => accounts.listIdentities(),
      3,
      2000,
      "List Linked Identities"
    );

    return {
      success: true,
      identities: identities.identities,
      total: identities.total
    };
  } catch (error: any) {
    console.error("Get Linked Identities Error:", error);
    return {
      success: false,
      message: error?.message || "Failed to get linked identities",
      identities: [],
      total: 0
    };
  }
};

/**
 * Delete an OAuth identity (unlink provider)
 */
export const unlinkIdentity = async (identityId: string) => {
  try {
    const { accounts } = await createClientSession();

    await withRetry(
      () => accounts.deleteIdentity({
        identityId
      }),
      3,
      2000,
      "Unlink Identity"
    );

    return {
      success: true,
      message: "Identity unlinked successfully"
    };
  } catch (error: any) {
    console.error("Unlink Identity Error:", error);
    return {
      success: false,
      message: error?.message || "Failed to unlink identity"
    };
  }
};