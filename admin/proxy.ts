import { NextRequest, NextResponse } from "next/server";
import { url } from "./constant/api";

const BASE_URL = url.replace(/\/+$/, "");

const API_URL = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

const AUTH_ME_URL = `${API_URL}/auth/me`;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isSignInPage = pathname === "/";
  const isDashboardPage =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (!isSignInPage && !isDashboardPage) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/", request.url);
  const cookie = request.headers.get("cookie");

  // No cookie: allow sign-in page, but protect dashboard.
  if (!cookie) {
    return isDashboardPage
      ? NextResponse.redirect(signInUrl)
      : NextResponse.next();
  }

  try {
    const response = await fetch(AUTH_ME_URL, {
      method: "GET",
      headers: {
        cookie,
      },
      cache: "no-store",
    });

    const isAuthenticated = response.ok;

    // Valid cookie: redirect sign-in page to dashboard.
    if (isSignInPage && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Invalid or expired cookie: redirect dashboard to sign-in.
    if (isDashboardPage && !isAuthenticated) {
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Authentication verification failed:", error);

    return isDashboardPage
      ? NextResponse.redirect(signInUrl)
      : NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
