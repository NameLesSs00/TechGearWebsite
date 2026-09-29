"use client";

import Link from "next/link";
import { ArrowRight, Compass, Home, Mail, Wrench } from "lucide-react";
import { usePathname } from "next/navigation";

function getLocale(pathname: string | null): "en" | "ar" {
  const firstSegment = pathname?.split("/").filter(Boolean)[0];
  return firstSegment === "ar" ? "ar" : "en";
}

export default function NotFoundContent({ standalone = false }: { standalone?: boolean }) {
  const pathname = usePathname();
  const locale = getLocale(pathname);
  const isArabic = locale === "ar";
  const homeHref = `/${locale}`;
  const servicesHref = `/${locale}/services`;
  const contactHref = `/${locale}/contactus`;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className={`relative isolate overflow-hidden bg-[#000918] px-5 text-white ${standalone ? "min-h-screen py-24" : "min-h-[78vh] pb-24 pt-36 sm:pt-44"}`}
    >
      <div className="pointer-events-none absolute inset-0 z-[-1]" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[min(120vw,900px)] w-[min(120vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.16)_0%,rgba(34,211,238,0.08)_35%,transparent_70%)] blur-3xl" />
      </div>

      <section className="mx-auto flex min-h-[560px] max-w-5xl flex-col items-center justify-center text-center">
        <div className="mb-8 grid h-20 w-20 place-items-center rounded-3xl border border-[#22D3EE]/30 bg-[#22D3EE]/10 shadow-[0_0_40px_rgba(34,211,238,0.18)]">
          <Compass className="h-10 w-10 text-[#22D3EE]" strokeWidth={1.6} />
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.42em] text-[#22D3EE]">404</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          {isArabic ? "لم نتمكن من العثور على هذه الصفحة" : "This page slipped out of range"}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          {isArabic
            ? "قد يكون الرابط قد تغير أو تم نقل المحتوى. يمكنك العودة للصفحة الرئيسية أو استكشاف خدماتنا."
            : "The link may have changed, or the page may have moved. Head back home or explore the services that are ready to go."}
        </p>

        <div className="mt-10 flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={homeHref}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#22D3EE] px-6 text-sm font-bold text-[#00121F] transition-colors hover:bg-[#1bb8d1]"
          >
            <Home className="h-4 w-4" />
            {isArabic ? "الصفحة الرئيسية" : "Back Home"}
          </Link>
          <Link
            href={servicesHref}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition-colors hover:border-[#22D3EE]/60 hover:text-[#22D3EE]"
          >
            <Wrench className="h-4 w-4" />
            {isArabic ? "استكشف الخدمات" : "Explore Services"}
          </Link>
          <Link
            href={contactHref}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition-colors hover:border-[#22D3EE]/60 hover:text-[#22D3EE]"
          >
            <Mail className="h-4 w-4" />
            {isArabic ? "تواصل معنا" : "Contact Us"}
            <ArrowRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </section>
    </main>
  );
}
