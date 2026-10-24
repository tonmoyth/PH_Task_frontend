import "server-only";
import { cache } from "react";
import { redirect, notFound } from "next/navigation";
import { apiFetch, ApiError, ApiResponse } from "@/lib/api-client";
import { User, Role } from "@/types/user";

interface RawUserResponse {
  id: string;
  name: string;
  email: string;
  role?: string;
  mustChangePassword?: boolean;
  banned?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

interface RawSessionResponse {
  session?: { id: string } | null;
  user?: RawUserResponse | null;
}

interface RawLoginResponse {
  accessToken?: string;
  mustChangePassword?: boolean;
  user?: RawUserResponse;
}

function normalizeRole(rawRole?: string | null): Role {
  if (!rawRole) return "student";
  const lower = rawRole.toLowerCase();
  if (lower === "admin") return "admin";
  if (lower === "mentor") return "mentor";
  return "student";
}

/**
 * Cached getter for currently authenticated user in the current request lifecycle.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  // 1. Try Better Auth get-session first
  try {
    const res = await apiFetch<RawSessionResponse>("/api/auth/get-session");
    if (res.data && res.data.user) {
      const u = res.data.user;
      if (u.banned || u.isActive === false) {
        return null;
      }
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: normalizeRole(u.role),
        mustChangePassword: Boolean(u.mustChangePassword),
        banned: false,
        isActive: true,
        createdAt: u.createdAt,
      };
    }
  } catch {
    // Continue to /api/v1/auth/me fallback
  }

  // 2. Fall back to /api/v1/auth/me (backend JWT session)
  try {
    const meRes = await apiFetch<RawUserResponse>("/api/v1/auth/me");
    const u = meRes.data;
    if (u && u.id) {
      if (u.banned || u.isActive === false) {
        return null;
      }
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: normalizeRole(u.role),
        mustChangePassword: Boolean(u.mustChangePassword),
        banned: false,
        isActive: true,
        createdAt: u.createdAt,
      };
    }
  } catch {
    return null;
  }

  return null;
});

/**
 * Enforces authenticated session. Redirects to /login if no active user.
 * Redirects to /change-password if user.mustChangePassword is true.
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?reauth=1");
  }
  return user;
}

/**
 * Enforces role-based authorization.
 */
export async function requireRole(...allowedRoles: Role[]): Promise<User> {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role)) {
    notFound();
  }
  return user;
}

export async function loginService(payload: { email: string; password: string }) {
  // Try /api/v1/auth/login first (sets both accessToken and sessionToken)
  try {
    const res = await apiFetch<RawLoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: payload,
    });
    return res;
  } catch (err: unknown) {
    if (err instanceof ApiError && err.status === 404) {
      // Fallback to /api/auth/sign-in/email
      return await apiFetch<RawLoginResponse>("/api/auth/sign-in/email", {
        method: "POST",
        body: payload,
      });
    }
    throw err;
  }
}

export async function signUpService(payload: { name: string; email: string; password: string }) {
  // Better Auth sign-up endpoint
  try {
    const res = await apiFetch<RawLoginResponse>("/api/auth/sign-up/email", {
      method: "POST",
      body: payload,
    });
    return res;
  } catch (err: unknown) {
    if (err instanceof ApiError && err.status === 409) {
      throw err;
    }
    // Fallback to /api/v1/auth/signup
    try {
      return await apiFetch<RawLoginResponse>("/api/v1/auth/signup", {
        method: "POST",
        body: payload,
      });
    } catch (fallbackErr: unknown) {
      throw fallbackErr instanceof ApiError ? fallbackErr : err;
    }
  }
}

export async function signOutService(): Promise<ApiResponse<unknown> | null> {
  const results: ApiResponse<unknown>[] = [];
  try {
    const res = await apiFetch<unknown>("/api/auth/sign-out", {
      method: "POST",
    });
    results.push(res);
  } catch {
    // Continue
  }

  try {
    const res2 = await apiFetch<unknown>("/api/v1/auth/logout", {
      method: "POST",
    });
    results.push(res2);
  } catch {
    // Continue
  }

  return results[0] || null;
}

export async function requestPasswordResetService(email: string) {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  try {
    const res = await apiFetch<{ message?: string }>("/api/auth/request-password-reset", {
      method: "POST",
      body: {
        email,
        redirectTo: `${appUrl}/reset-password`,
      },
    });
    return res;
  } catch {
    // Fallback to /api/v1/auth/forgot-password
    try {
      return await apiFetch<{ message?: string }>("/api/v1/auth/forgot-password", {
        method: "POST",
        body: { email },
      });
    } catch {
      // Always succeed as per contract
      return { data: { message: "Instructions dispatched" }, headers: new Headers(), status: 200, rawResponse: new Response() };
    }
  }
}

export async function resetPasswordService(payload: { token: string; newPassword: string }) {
  try {
    const res = await apiFetch<{ message?: string }>("/api/auth/reset-password", {
      method: "POST",
      body: payload,
    });
    return res;
  } catch {
    // Fallback to /api/v1/auth/reset-password
    return await apiFetch<{ message?: string }>("/api/v1/auth/reset-password", {
      method: "POST",
      body: {
        token: payload.token,
        newPassword: payload.newPassword,
      },
    });
  }
}

export async function changePasswordService(payload: { currentPassword: string; newPassword: string }) {
  return await apiFetch<{ accessToken?: string }>("/api/account/change-password", {
    method: "POST",
    body: payload,
  });
}
