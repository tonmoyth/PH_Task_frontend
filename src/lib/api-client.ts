import "server-only";
import { cookies } from "next/headers";
import { PaginatedResponse } from "@/types/api";

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;
  retryAfter?: number;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string[]>,
    retryAfter?: number,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.retryAfter = retryAfter;
  }
}

export interface ApiFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  cache?: RequestCache;
}

export interface ApiResponse<T> {
  data: T;
  headers: Headers;
  status: number;
  rawResponse: Response;
}

const getApiUrl = (): string => {
  return process.env.API_URL || "http://localhost:5000";
};

const getAppUrl = (): string => {
  return process.env.APP_URL || "http://localhost:3000";
};

/**
 * Normalizes backend routes:
 * Backend has Better Auth at /api/auth/*
 * Backend has custom routes at /api/v1/* (/api/v1/submissions, /api/v1/admin/mentors, /api/v1/auth/change-password)
 */
function resolveBackendPath(path: string): string {
  if (path.startsWith("/api/auth")) {
    return path;
  }

  if (path === "/api/account/change-password" || path === "/account/change-password") {
    return "/api/v1/auth/change-password";
  }

  if (path.startsWith("/api/submissions")) {
    return path.replace(/^\/api\/submissions/, "/api/v1/submissions");
  }

  if (path.startsWith("/api/admin/mentors")) {
    return path.replace(/^\/api\/admin\/mentors/, "/api/v1/admin/mentors");
  }

  if (path.startsWith("/api/v1/")) {
    return path;
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<ApiResponse<T>> {
  const baseUrl = getApiUrl().replace(/\/$/, "");
  const appUrl = getAppUrl().replace(/\/$/, "");
  const resolvedPath = resolveBackendPath(path);

  // Build query string, ignoring empty values
  const url = new URL(`${baseUrl}${resolvedPath.startsWith("/") ? resolvedPath : `/${resolvedPath}`}`);
  if (options.searchParams) {
    for (const [key, val] of Object.entries(options.searchParams)) {
      if (val !== undefined && val !== null && val !== "") {
        url.searchParams.set(key, String(val));
      }
    }
  }

  // Retrieve current request cookies
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const reqHeaders: Record<string, string> = {
    Origin: appUrl,
    ...(options.headers || {}),
  };

  if (cookieString) {
    reqHeaders["Cookie"] = cookieString;
  }

  let requestBody: string | undefined = undefined;
  if (options.body !== undefined && options.body !== null) {
    reqHeaders["Content-Type"] = "application/json";

    // Adapt body fields if submitting/updating submissions
    // Backend schema requires `liveLink` instead of `liveUrl`
    if (typeof options.body === "object" && options.body !== null) {
      const bodyObj = { ...(options.body as Record<string, unknown>) };
      if ("liveUrl" in bodyObj && !("liveLink" in bodyObj)) {
        bodyObj.liveLink = bodyObj.liveUrl;
        delete bodyObj.liveUrl;
      }
      requestBody = JSON.stringify(bodyObj);
    } else {
      requestBody = JSON.stringify(options.body);
    }
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: options.method || "GET",
      headers: reqHeaders,
      body: requestBody,
      cache: options.cache || "no-store",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to connect to backend server";
    throw new ApiError(errorMsg, 500);
  }

  // Handle errors
  if (!response.ok) {
    let errorData: Record<string, unknown> | null = null;
    try {
      errorData = (await response.json()) as Record<string, unknown>;
    } catch {
      // response is not json
    }

    let message = "An error occurred";
    let fieldErrors: Record<string, string[]> | undefined = undefined;

    if (errorData) {
      const errObj = errorData.error as Record<string, unknown> | undefined;
      message =
        (typeof errorData.message === "string" && errorData.message) ||
        (errObj && typeof errObj.message === "string" && errObj.message) ||
        (typeof errorData.error === "string" && errorData.error) ||
        response.statusText ||
        "Request failed";

      if (errorData.errors && typeof errorData.errors === "object") {
        fieldErrors = errorData.errors as Record<string, string[]>;
      } else if (errorData.fieldErrors && typeof errorData.fieldErrors === "object") {
        fieldErrors = errorData.fieldErrors as Record<string, string[]>;
      } else if (Array.isArray(errorData.errorMessages)) {
        fieldErrors = {};
        for (const item of errorData.errorMessages as Array<{ path?: string; message: string }>) {
          if (item.path) {
            fieldErrors[item.path] = [item.message];
          }
        }
      }
    } else {
      message = `Request failed with status ${response.status}`;
    }

    // Read Retry-After for 429
    let retryAfter: number | undefined = undefined;
    if (response.status === 429) {
      const headerVal = response.headers.get("Retry-After");
      if (headerVal) {
        const parsed = parseInt(headerVal, 10);
        if (!isNaN(parsed)) {
          retryAfter = parsed;
        }
      }
    }

    throw new ApiError(message, response.status, fieldErrors, retryAfter);
  }

  // Parse JSON or return empty if 204
  let rawJson: unknown = null;
  if (response.status !== 204) {
    const text = await response.text();
    if (text) {
      try {
        rawJson = JSON.parse(text);
      } catch {
        rawJson = text;
      }
    }
  }

  // Adapt backend envelope { success: true, meta: { total, page, totalPages }, data: [...] }
  let adaptedData: unknown = rawJson;
  if (rawJson && typeof rawJson === "object") {
    const jsonObj = rawJson as Record<string, unknown>;
    if ("meta" in jsonObj && jsonObj.meta && "data" in jsonObj && Array.isArray(jsonObj.data)) {
      const meta = jsonObj.meta as { page?: number; total?: number; totalPages?: number };
      const paginated: PaginatedResponse<unknown> = {
        data: jsonObj.data,
        total: meta.total ?? jsonObj.data.length,
        page: meta.page ?? 1,
        totalPages: meta.totalPages ?? 1,
      };
      adaptedData = paginated;
    } else if ("data" in jsonObj && !("total" in jsonObj) && !("totalPages" in jsonObj)) {
      adaptedData = jsonObj.data;
    }
  }

  return {
    data: adaptedData as T,
    headers: response.headers,
    status: response.status,
    rawResponse: response,
  };
}
