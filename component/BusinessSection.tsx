"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";
import { usePartners } from "@/hooks/usePartners";

export default function BusinessSection(_props?: { locale?: string }) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { data: partners = [] } = usePartners(language);
  const [selectedLogoIndex, setSelectedLogoIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = (index: number) => {
    setSelectedLogoIndex(index);
  };

  return (
    <section
      className="relative overflow-hidden bg-[#000918] px-5 pt-16 pb-28 text-white sm:px-8 sm:pt-20 sm:pb-36 lg:pt-12 lg:pb-40"
      aria-labelledby="businesses-heading"
    >
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-99 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[min(125vw,1600px)] w-[min(125vw,1400px)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.03)_0%,rgba(34,211,238,0.03)_38%,rgba(34,211,238,0)_74%)] blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl">
        <div className="text-center">

          <h2
            id="businesses-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl [text-shadow:0_0_25px_rgba(255,255,255,0.4)]"
          >
            {t("business_grew_with_us")}
          </h2>
          <span
            className="mx-auto mt-5 block h-1.5 w-24 rounded-full bg-[#22D3EE] shadow-[0_0_18px_rgba(34,211,238,0.45)]"
            aria-hidden="true"
          />
        </div>

        {partners.length > 0 && (
          <div
            className="mt-14 overflow-hidden"
            aria-label="Businesses that grew with us"
            ref={carouselRef}
          >
            <div className="flex w-max items-center gap-6 animate-logo-marquee motion-reduce:animate-none">
              {[...partners, ...partners].map((partner, index) => (
                <motion.div
                  key={`${partner.id}-${index}`}
                  className="group flex h-36 w-[180px] shrink-0 items-center justify-center px-4 sm:w-[220px] lg:w-[260px]"
                  onClick={() => handleLogoClick(index % partners.length)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleLogoClick(index % partners.length);
                    }
                  }}
                  aria-label={index >= partners.length ? "" : partner.name}
                  aria-pressed={selectedLogoIndex === (index % partners.length)}
                >
                  <Image
                    src={partner.imageUrl}
                    alt={index >= partners.length ? "" : partner.name}
                    width={320}
                    height={160}
                    aria-hidden={index >= partners.length}
                    className="max-h-[105px] w-auto max-w-full object-contain brightness-0 invert transition-transform duration-500 ease-out will-change-transform group-hover:scale-110 select-none"
                    draggable={false}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
