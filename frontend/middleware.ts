import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for an admin route (except login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // Check for access_token cookie
    const token = request.cookies.get("access_token");

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If accessing login page with a token, redirect to dashboard
  if (pathname === "/admin/login") {
    const token = request.cookies.get("access_token");
    if (token) {
      const dashboardUrl = new URL("/admin", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
