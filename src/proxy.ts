import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for presence of auth session cookies with non-empty values
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) =>
      (c.name.includes("session_token") ||
        c.name.includes("accessToken") ||
        c.name.includes("sessionToken")) &&
      Boolean(c.value && c.value.trim().length > 0),
  );

  const isProtectedPath =
    pathname.startsWith("/dashboard") || pathname === "/change-password";
  const isAuthEntryPath = pathname === "/login" || pathname === "/register";

  // Optimistic redirect: if not authenticated and trying to access protected paths
  if (!hasAuthCookie && isProtectedPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Optimistic redirect: if already has cookie and visiting login/register
  // Do not redirect if reauth is requested (backend rejected invalid session)
  if (hasAuthCookie && isAuthEntryPath) {
    if (request.nextUrl.searchParams.has("reauth")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
