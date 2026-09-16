"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { partnerService, Partner } from "../services/partnerService";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

export default function BusinessSection(_props?: { locale?: string }) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedLogoIndex, setSelectedLogoIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await partnerService.getPartners(language);
        setPartners(data);
      } catch (error) {
        console.error("Failed to fetch partners:", error);
      }
    };

    fetchPartners();
  }, [language]);

  const handleLogoClick = (index: number) => {
    setSelectedLogoIndex(index);
  };

  return (
    <section
      className="relative overflow-hidden bg-[#000918] px-5 py-16 text-white sm:px-8 sm:py-20 lg:py-12"
      aria-labelledby="businesses-heading"
    >
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-99 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[min(125vw,1600px)] w-[min(125vw,1400px)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1)_0%,rgba(34,211,238,0.1)_38%,rgba(34,211,238,0)_74%)] blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#22D3EE]">
            {t("business_trusted_partnerships")}
          </p>
          <h2
            id="businesses-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl"
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
            <div className="flex w-max items-center animate-logo-marquee motion-reduce:animate-none">
              {[...partners, ...partners].map((partner, index) => (
                <motion.div
                  key={`${partner.id}-${index}`}
                  className="flex cursor-pointer h-24 w-[190px] shrink-0 items-center justify-center px-6 sm:w-[230px] lg:w-[260px]"
                  onClick={() => handleLogoClick(index % partners.length)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
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
                    width={200}
                    height={100}
                    aria-hidden={index >= partners.length}
                    className="max-h-full w-auto max-w-full object-contain brightness-0 invert transition-transform duration-300 hover:scale-105 select-none"
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
