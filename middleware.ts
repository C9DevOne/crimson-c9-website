import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const pathname = request.nextUrl.pathname;

  // In production, restrict access to everything except the homepage and asset files.
  if (isProduction && pathname !== "/") {
    // Redirect to home page
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo, icons, or backgrounds (e.g., key_portal_background_169.png)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|js|css)).*)",
  ],
};
