import { NextResponse } from "next/server";
import { auth } from "./src/lib/auth"; 
import { headers } from "next/headers";

export async function proxy(request) {
  try {
   const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { pathname } = request.nextUrl;
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!session || !session?.user) {
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/classroom")) {
        return NextResponse.redirect(new URL("/signin", request.url));
      }
      return NextResponse.next();
    }

    const currentUser = session.user;
 const res = await fetch(`${BASE_URL}/users/${currentUser.id}`);
    const result = await res.json();

    if (!res.ok || !result.success) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    const dbUser = Array.isArray(result.data) ? result.data[0] : result.data;
    // console.log('proxy dbUser:',dbUser);

    if (dbUser.status !== "approved") {
     if (pathname.startsWith("/dashboard") || pathname.startsWith("/classroom")) {
      return NextResponse.redirect(new URL("/", request.url)); 
      }
      return NextResponse.next();
    }

    if (pathname === "/" || pathname === "/signin") {
      if (dbUser.role === "student") {
        return NextResponse.redirect(new URL("/dashboard/student/classroom", request.url));
      } else if (dbUser.role === "teacher") {
        return NextResponse.redirect(new URL("/dashboard/teacher/classroom", request.url));
      }
    }

     if (dbUser.role === "student" && pathname.startsWith("/dashboard/teacher")) {
      return NextResponse.redirect(new URL("/dashboard/student/classroom", request.url));
    }
    if (dbUser.role === "teacher" && pathname.startsWith("/dashboard/student")) {
      return NextResponse.redirect(new URL("/dashboard/teacher/classroom", request.url));
    }

  } catch (error) {
    console.error("Middleware Error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signin",
    "/dashboard/:path*", 
    "/classroom/:path*",
  ],
};