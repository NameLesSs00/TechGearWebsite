"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CloudCog, Megaphone, Monitor, PenTool, Search, Smartphone } from "lucide-react";
import type { ComponentType } from "react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { serviceService, type ServiceApiItem } from "@/services/serviceService";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

interface ServiceItem {
  id: string;
  title: string;
  href: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  subtitle?: string;
}

const defaultIcons: Record<string, ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  web: Monitor,
  website: Monitor,
  mobile: Smartphone,
  software: CloudCog,
  marketing: Megaphone,
  design: PenTool,
  seo: Search,
};

interface ServiceSectionProps {
  locale?: string;
}

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.31,
        delay: Math.min(index * 0.05, 0.3),
      }}
      whileHover={{ y: -4 }}
      className="group relative flex min-h-[220px] flex-col items-center justify-center rounded-[3rem] border border-[#22D3EE] bg-[#132D3A] px-8 py-10 text-center shadow-[0_0_12px_rgba(34,211,238,0.2)] transition-shadow duration-300 hover:shadow-[0_0_18px_rgba(34,211,238,0.35)] sm:min-h-[238px]"
    >
      <Icon size={58} strokeWidth={1.7} className="mb-7 text-white" />

      <h3 className="text-xl lg:mb-5 mb-0 font-bold leading-tight text-white sm:text-2xl">{service.title}</h3>

      <Link
        href={service.href}
        aria-label={`Explore ${service.title}`}
        className="absolute bottom-5 right-8 grid h-12 w-12 place-items-center rounded-full border border-[#22D3EE] text-white transition-colors hover:bg-[#22D3EE] hover:text-[#000918]"
      >
        <ArrowUpRight size={24} strokeWidth={1.6} />
      </Link>
    </motion.article>
  );
}

export default function ServiceSection({ locale }: ServiceSectionProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const currentLocale = locale || language;
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const fetchedServices = await serviceService.getServices(currentLocale, 1, 20);

        if (fetchedServices.length > 0) {
          const mappedServices = fetchedServices.map((service: ServiceApiItem) => {
            const slug = service.slug || service.title.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-").replace(/(^-|-$)/g, "") || service.id;
            const iconKey = slug.includes("mobile") ? "mobile" : slug.includes("web") || slug.includes("website") ? "web" : slug.includes("software") ? "software" : slug.includes("market") ? "marketing" : slug.includes("design") ? "design" : slug.includes("seo") ? "seo" : "web";

            return {
              id: service.id,
              title: service.title,
              subtitle: service.subTitle || undefined,
              href: `/${currentLocale}/services/${slug}`,
              icon: defaultIcons[iconKey] ?? Monitor,
            };
          });

          setServices(mappedServices);
        }
      } catch (error) {
        console.error("Failed to fetch services for homepage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [currentLocale]);

  const visibleServices = useMemo(() => services, [services]);

  return (
    <section className="relative isolate overflow-hidden bg-[#000918] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-28" aria-labelledby="services-heading">
      <div className="pointer-events-none absolute inset-0 z-[-1] overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[min(125vw,1200px)] w-[min(125vw,1200px)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1)_0%,rgba(34,211,238,0.1)_38%,rgba(34,211,238,0)_74%)] blur-2xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="mb-14 text-center sm:mb-16">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.42em] text-[#22D3EE]">{t("services_label")}</p>
          <h2 id="services-heading" className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{t("services_heading")}</h2>
          <span className="mx-auto mt-5 block h-1.5 w-28 rounded-full bg-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.6)]" aria-hidden="true" />
        </header>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22D3EE]/20 border-t-[#22D3EE]" />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-7">
          {visibleServices.map((service, index) => (
            <ServiceCard key={service.id || service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
