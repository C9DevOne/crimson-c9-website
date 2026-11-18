import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Routes reachable in production. Everything else redirects to the landing page while the
 * prototype is built behind it (see WORKING_LOG.md).
 *
 * `/imprint` and `/terms` are here because they are legally required in Germany — the
 * landing page collects personal data through its contact form, so they have to be
 * reachable, not just present in the codebase. Leaving them out of this list is the
 * failure mode worth knowing about: the folder can be un-prefixed and the page can build
 * perfectly, and this redirect would still quietly send every visitor back to `/`.
 */
// `/admin` was here for Payload's admin panel, which is out of routing for v1. `/api` has
// to stay: it carries the collaboration form's endpoint.
const PUBLIC_PREFIXES = ["/api", "/imprint", "/terms"];

export function proxy(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const pathname = request.nextUrl.pathname;

  const isPublic =
    pathname === "/" || PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProduction && !isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo, icons, or backgrounds (e.g., key_portal_background_169.png)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|js|css)).*)",
  ],
};
