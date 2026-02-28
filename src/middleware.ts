import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /studio (Sanity Studio)
  // - /_next (Next.js internals)
  // - /favicon.ico, /images, etc. (static files)
  matcher: [
    "/",
    "/(nl|fr|en)/:path*",
    "/((?!api|studio|_next|_vercel|.*\\..*).*)",
  ],
};
