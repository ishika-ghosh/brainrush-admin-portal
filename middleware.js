import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublic = path === "/";
  const token = request.cookies.get("token")?.value || "";
  if (token.length > 0) {
    if (isPublic) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/api/users/signout",
    "/api/((?!users|login).*)",
    "/dashboard",
    "/dashboard/(.*)",
  ],
};
