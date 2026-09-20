import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ar"];
const defaultLocale = "en";

function getPreferredLocale(request: NextRequest): string {
  // Check if there's a stored locale preference in cookies
  const localeCookie = request.cookies.get("NEXT_LOCALE");
  if (localeCookie?.value && locales.includes(localeCookie.value)) {
    return localeCookie.value;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    // Parse Accept-Language header
    const languages = acceptLanguage
      .split(",")
      .map((lang) => {
        const [code, qValue] = lang.trim().split(";q=");
        return {
          code: code.split("-")[0].toLowerCase(),
          quality: qValue ? parseFloat(qValue) : 1.0,
        };
      })
      .sort((a, b) => b.quality - a.quality);

    // Find first matching locale
    for (const lang of languages) {
      if (locales.includes(lang.code)) {
        return lang.code;
      }
    }
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  let url = request.nextUrl.clone();
  
  // Strip iisnode pipe from pathname if present
  let isRewritten = false;
  const pipeRegex = /^\/pipe\/[^/]+/;
  if (pipeRegex.test(url.pathname)) {
    url.pathname = url.pathname.replace(pipeRegex, '');
    isRewritten = true;
  }

  const pathname = url.pathname;

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return isRewritten ? NextResponse.rewrite(url) : NextResponse.next();
  }

  // Redirect root path to locale-specific path
  const locale = getPreferredLocale(request);

  // Handle root path
  if (pathname === "/") {
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  // Handle other paths without locale (redirect old routes to new locale-based routes)
  // This ensures backward compatibility with old URLs
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$|api).*)",
  ],
};