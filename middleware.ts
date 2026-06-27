import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  if (request.auth) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/admin/comentarios") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/admin/comentarios", request.url));
});

export const config = {
  matcher: ["/admin/:path*"],
};
