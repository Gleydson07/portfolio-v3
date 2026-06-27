import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const blogAdminPath = "/blog/admin";
const legacyStudioPath = "/blog/studio";
const blogStudioPath = `${blogAdminPath}/studio`;

export default auth((request) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const target = pathname.replace(/^\/admin/, blogAdminPath);
    return NextResponse.redirect(new URL(target || blogAdminPath, request.url));
  }

  if (pathname === legacyStudioPath || pathname.startsWith(`${legacyStudioPath}/`)) {
    const target = pathname.replace(legacyStudioPath, blogStudioPath);
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (!pathname.startsWith(`${blogAdminPath}/`)) {
    return NextResponse.next();
  }

  if (request.auth) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(blogAdminPath, request.url));
});

export const config = {
  matcher: ["/admin/:path*", "/blog/admin/:path*", "/blog/studio", "/blog/studio/:path*"],
};
