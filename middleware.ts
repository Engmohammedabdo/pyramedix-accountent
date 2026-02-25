import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const intlMiddleware = createMiddleware({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip locale detection for API routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if the path includes a login route — allow without auth
  const isLoginPage =
    pathname.includes("/login") ||
    pathname === "/ar/login" ||
    pathname === "/en/login";

  // Apply intl middleware first
  const response = intlMiddleware(request);

  // If it's the login page, just return the intl response
  if (isLoginPage) {
    return response;
  }

  // Check for auth cookie (simple check — Supabase stores session in cookies)
  const supabaseAuthToken =
    request.cookies.get("sb-access-token")?.value ||
    request.cookies.get("supabase-auth-token")?.value;

  // For now, allow all requests through (auth will be enforced client-side)
  // This prevents blocking during development
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
