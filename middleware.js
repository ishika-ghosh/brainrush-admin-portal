import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isPublic =
    path === "/" ||
    path === "/dashboard" ||
    path === "/dashboard/scan" ||
    path === "/dashboard/scan/eventScan" ||
    path === "/dashboard/scan/paymentScan";
  try {
    const token = await getToken({ req });
    if (token) {
      if (path === "/") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      if (!isPublic && !token?.isSuperUser) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/api/event-timings",
    "/api/event-timings/(.*)",
    "/api/users/createuser",
    "/api/users",
    "/api/users/signout",
    "/dashboard",
    "/dashboard/(.*)",
  ],
};
