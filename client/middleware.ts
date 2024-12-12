import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const auths: string[] = ["/login", "/register"];

const requireAuth: string[] = ["/dashboard", "/settings"];

const requireAdmin: string[] = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const token = await getToken({ req: request });
  console.log(token);

  if (auths.some((path) => pathname.startsWith(path))) {
    if (token) {
      const url = new URL(`/`, request.url);
      return NextResponse.redirect(url);
    }
  }

  if (requireAuth.some((path) => pathname.startsWith(path))) {
    //check not logged in
    if (!token) {
      const url = new URL(`/`, request.url);
      return NextResponse.redirect(url);
    }

    if (requireAdmin.some((path) => pathname.startsWith(path))) {
      //check if not authorized
      if (!token.isAdmin) {
        const url = new URL(`/`, request.url);
        return NextResponse.rewrite(url);
      }
    }
  }

  return res;
}

// note that middleware is not applied to api/auth as this is required to logon (i.e. requires anon access)
export const config = {
  matcher: [
    "/unauthorized/:path*",
    "/dashboard/:path*",
    "/login/:path*",
    "/register/:path*",
    "/api/images:path*",
  ],
};
