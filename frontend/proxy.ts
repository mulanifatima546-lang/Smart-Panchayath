import { NextRequest, NextResponse } from "next/server";
import { url } from "./constant/api";

const BACKEND_URL = `${url}/api`;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLandingPage = pathname === "/";
  const isCitizenPage =
    pathname === "/citizen" || pathname.startsWith("/citizen/");

  if (!isLandingPage && !isCitizenPage) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/auth/sign-in", request.url);
  const cookie = request.headers.get("cookie");

  if (!cookie) {
    return isCitizenPage
      ? NextResponse.redirect(signInUrl)
      : NextResponse.next();
  }

  if (!BACKEND_URL) {
    console.error("BACKEND_URL is not configured");

    return isCitizenPage
      ? NextResponse.redirect(signInUrl)
      : NextResponse.next();
  }

  try {
    const response = await fetch(`${BACKEND_URL}/auth/me`, {
      method: "GET",
      headers: {
        cookie,
      },
      cache: "no-store",
    });

    if (response.ok) {
      return isLandingPage
        ? NextResponse.redirect(new URL("/citizen", request.url))
        : NextResponse.next();
    }

    return isCitizenPage
      ? NextResponse.redirect(signInUrl)
      : NextResponse.next();
  } catch (error) {
    console.error("Authentication verification failed:", error);

    return isCitizenPage
      ? NextResponse.redirect(signInUrl)
      : NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/citizen/:path*"],
};
