import "server-only";
import { cookies } from "next/headers";

interface CookieOptions {
  path?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

/**
 * Parses a single Set-Cookie header string into name, value, and options.
 * Ignores any Domain attribute so cookies stay host-only on the frontend domain.
 */
export function parseCookieString(cookieStr: string): {
  name: string;
  value: string;
  options: CookieOptions;
} | null {
  const parts = cookieStr.split(";").map((p) => p.trim());
  if (parts.length === 0 || !parts[0]) return null;

  const firstEqual = parts[0].indexOf("=");
  if (firstEqual === -1) return null;

  const name = parts[0].slice(0, firstEqual).trim();
  const value = parts[0].slice(firstEqual + 1).trim();

  const options: CookieOptions = {};

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const [rawKey, ...valParts] = part.split("=");
    const key = rawKey.trim().toLowerCase();
    const val = valParts.join("=").trim();

    switch (key) {
      case "path":
        options.path = val || "/";
        break;
      case "max-age": {
        const num = parseInt(val, 10);
        if (!isNaN(num)) {
          options.maxAge = num;
        }
        break;
      }
      case "expires": {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          options.expires = d;
        }
        break;
      }
      case "httponly":
        options.httpOnly = true;
        break;
      case "secure":
        options.secure = true;
        break;
      case "samesite": {
        const s = val.toLowerCase();
        if (s === "strict" || s === "lax" || s === "none") {
          options.sameSite = s;
        }
        break;
      }
      case "domain":
        // Deliberately ignored to keep cookie host-only
        break;
    }
  }

  return { name, value, options };
}

/**
 * Forwards Set-Cookie headers from a backend Response onto Next.js cookies().
 */
export async function forwardResponseCookies(response: Response): Promise<void> {
  const cookieStore = await cookies();

  let setCookieHeaders: string[] = [];
  if (typeof response.headers.getSetCookie === "function") {
    setCookieHeaders = response.headers.getSetCookie();
  } else {
    const raw = response.headers.get("set-cookie");
    if (raw) {
      setCookieHeaders = [raw];
    }
  }

  for (const cookieStr of setCookieHeaders) {
    const parsed = parseCookieString(cookieStr);
    if (!parsed) continue;

    const { name, value, options } = parsed;

    // Check if cookie is expired or max-age is 0
    const isExpired =
      options.maxAge === 0 ||
      (options.expires && options.expires.getTime() <= Date.now()) ||
      value === "";

    if (isExpired) {
      cookieStore.delete({
        name,
        path: options.path || "/",
      });
    } else {
      cookieStore.set({
        name,
        value,
        path: options.path || "/",
        maxAge: options.maxAge,
        expires: options.expires,
        httpOnly: options.httpOnly ?? true,
        secure: process.env.NODE_ENV === "production" ? (options.secure ?? true) : false,
        sameSite: process.env.NODE_ENV === "production" ? (options.sameSite || "lax") : "lax",
      });
    }
  }
}
