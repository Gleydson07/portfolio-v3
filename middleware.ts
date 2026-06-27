import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const blogAdminPath = "/blog/admin";

export default auth((request) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL(blogAdminPath, request.url));
  }

  if (!pathname.startsWith(blogAdminPath)) {
    return NextResponse.next();
  }

  if (request.auth) {
    return NextResponse.next();
  }

  if (pathname === blogAdminPath) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(blogAdminPath, request.url));
});

export const config = {
  matcher: ["/admin/:path*", "/blog/admin", "/blog/admin/:path*"],
};
