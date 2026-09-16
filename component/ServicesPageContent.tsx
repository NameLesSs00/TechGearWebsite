"use client";

import Link from "next/link";
import ServiceSection from "@/component/ServiceSection";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

interface ServicesPageContentProps {
  locale: string;
}

export default function ServicesPageContent({ locale }: ServicesPageContentProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <main className="min-h-screen bg-[#000918] pb-12 pt-32 text-white sm:pt-40">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <nav aria-label="Breadcrumb" className="mb-8 text-center text-sm sm:text-base">
          <Link href={`/${locale}`} className="hover:text-[#22D3EE]">
            {t("nav_home")}
          </Link>
          <span className="mx-1.5 text-[#22D3EE]">{language === "ar" ? "<" : ">"}</span>
          <span className="text-[#22D3EE]">{t("services_label")}</span>
        </nav>
      </div>

      <ServiceSection locale={locale} />
    </main>
  );
}
