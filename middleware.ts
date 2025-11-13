import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

function handleUnauthorized(url: URL) {
  if (url.pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (url.pathname.startsWith("/mahasiswa") || url.pathname.startsWith("/dosen") || url.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/unauthorized", url));
  }
  return NextResponse.redirect(new URL("/login", url));
}

export default withAuth(
  function middleware(request) {
    const token = request.nextauth.token;
    const path = request.nextUrl.pathname;

    if (!token) {
      return handleUnauthorized(request.nextUrl);
    }

    if (path.startsWith("/mahasiswa") || path.startsWith("/api/mahasiswa")) {
      if (token.role !== "mahasiswa") {
        return handleUnauthorized(request.nextUrl);
      }
    }

    if (path.startsWith("/dosen") || path.startsWith("/api/dosen")) {
      if (token.role !== "dosen") {
        return handleUnauthorized(request.nextUrl);
      }
    }

    if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
      if (token.role !== "admin") {
        return handleUnauthorized(request.nextUrl);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    "/mahasiswa/:path*",
    "/dosen/:path*",
    "/admin/:path*",
    "/api/mahasiswa/:path*",
    "/api/dosen/:path*",
    "/api/admin/:path*",
  ],
};

