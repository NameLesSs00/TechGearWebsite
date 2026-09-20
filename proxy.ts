import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ar"];
const defaultLocale = "en";

function getPreferredLocale(request: NextRequest): string {
  // Check stored locale cookie preference first
  const localeCookie = request.cookies.get("NEXT_LOCALE");
  if (localeCookie?.value && locales.includes(localeCookie.value)) {
    return localeCookie.value;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
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

  // Strip iisnode named-pipe prefix if present (MonsterASP.NET / IIS deployment)
  const pipeRegex = /^\/pipe\/[^/]+/;
  if (pipeRegex.test(url.pathname)) {
    url.pathname = url.pathname.replace(pipeRegex, "");
  }

  const pathname = url.pathname;

  // Skip static assets and API routes entirely — no redirect needed
  const isStaticOrApi =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|js|css|map|txt|xml)$/.test(pathname);

  if (isStaticOrApi) {
    return NextResponse.next();
  }

  // If the URL already contains a valid locale segment, continue
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to locale-prefixed URL
  const locale = getPreferredLocale(request);
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder static assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};