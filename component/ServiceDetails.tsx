"use client";

import { ArrowUpRight, Check, CloudCog, Megaphone, Monitor, PenTool, Search, Smartphone } from "lucide-react";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeServiceSlug, serviceService, type ServiceApiItem } from "@/services/serviceService";
import { isValidGuid } from "@/lib/apiClient";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

import WebVisual from "../prompts/home.png";
import ProductVisual from "../prompts/ourproduct.png";
import ProductDetailVisual from "../prompts/underourproduct.png";
import ReactLogo from "../prompts/reacr.png";
import NextLogo from "../prompts/next.png";
import JavaScriptLogo from "../prompts/java.png";
import CSSLogo from "../prompts/css.png";
import DotNetLogo from "../prompts/net.png";
import HTMLLogo from "../prompts/html.png";

interface ServiceDetailsData {
  title: string;
  eyebrow: string;
  description: string;
  deliverables: string[];
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  image: string;
}

interface Technology {
  id?: string;
  name: string;
  logo: string;
}

const defaultServiceDetails: Record<string, ServiceDetailsData> = {
  "web-development": {
    title: "Web Development",
    eyebrow: "Websites built to move your business forward",
    description: "Your website is more than just a digital presence - it is an important part of how customers discover, trust, and interact with your business. We design and develop modern, responsive, high-performance websites that combine strong visuals with seamless functionality.",
    deliverables: ["Custom Website Development", "Landing Pages", "Performance & Speed Optimization", "API & Third-Party Integrations"],
    icon: Monitor,
    image: WebVisual.src,
  },
  "mobile-development": {
    title: "Mobile Development",
    eyebrow: "Mobile experiences people love to use",
    description: "We create fast, intuitive mobile applications that turn useful ideas into dependable everyday experiences for your customers and team.",
    deliverables: ["iOS & Android Applications", "Cross-Platform Development", "User-Centered Interfaces", "App Store Readiness"],
    icon: Smartphone,
    image: ProductVisual.src,
  },
  "software-development": {
    title: "Software Development",
    eyebrow: "Software shaped around your business",
    description: "We build reliable custom software that connects your workflows, data, and people so your business can operate with greater clarity.",
    deliverables: ["Business Platforms", "Custom Dashboards", "Secure Integrations", "Scalable Architecture"],
    icon: CloudCog,
    image: ProductDetailVisual.src,
  },
  marketing: {
    title: "Marketing",
    eyebrow: "Make your next opportunity easier to find",
    description: "We connect your brand with the right audience through focused campaigns, clear messaging, and measurable digital growth strategies.",
    deliverables: ["Digital Campaigns", "Content Strategy", "Social Media Marketing", "Performance Reporting"],
    icon: Megaphone,
    image: WebVisual.src,
  },
  "graphic-design": {
    title: "Graphic Design",
    eyebrow: "A visual identity people remember",
    description: "We translate your ideas into a consistent visual language that makes every interaction feel considered and recognizably yours.",
    deliverables: ["Brand Identity", "Marketing Materials", "Social Media Design", "UI Visual Systems"],
    icon: PenTool,
    image: ProductVisual.src,
  },
  seo: {
    title: "SEO",
    eyebrow: "Be visible when it matters most",
    description: "We improve your search visibility with practical technical, content, and performance work that helps the right people discover you.",
    deliverables: ["Technical SEO", "Keyword Strategy", "On-Page Optimization", "Search Performance"],
    icon: Search,
    image: ProductDetailVisual.src,
  },
};

const defaultTechnologies: Technology[] = [
  { id: "html5", name: "HTML5", logo: HTMLLogo.src },
  { id: "css3", name: "CSS3", logo: CSSLogo.src },
  { id: "javascript", name: "JavaScript", logo: JavaScriptLogo.src },
  { id: "react", name: "React", logo: ReactLogo.src },
  { id: "dotnet", name: ".NET", logo: DotNetLogo.src },
  { id: "nextjs", name: "NEXT.js", logo: NextLogo.src },
];

export default function ServiceDetails({ locale, serviceSlug }: { locale: string; serviceSlug: string }) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const router = useRouter();
  const [serviceData, setServiceData] = useState<ServiceDetailsData>(defaultServiceDetails[serviceSlug] ?? defaultServiceDetails["web-development"]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [allServices, setAllServices] = useState<ServiceApiItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllServices = async () => {
      try {
        const services = await serviceService.getServices(locale, 1, 50);
        setAllServices(services);
      } catch (error) {
        console.error("Failed to fetch all services:", error);
      }
    };

    loadAllServices();
  }, [locale]);

  useEffect(() => {
    const loadService = async () => {
      try {
        const response = await serviceService.getServiceBySlug(serviceSlug, locale);

        if (response) {
          const slugKey = normalizeServiceSlug(response.title) || normalizeServiceSlug(serviceSlug) || response.id;
          const serviceIcon = slugKey.includes("mobile") ? Smartphone : slugKey.includes("web") || slugKey.includes("website") ? Monitor : slugKey.includes("software") ? CloudCog : slugKey.includes("market") ? Megaphone : slugKey.includes("design") ? PenTool : slugKey.includes("seo") ? Search : Monitor;

          const mappedService: ServiceDetailsData = {
            title: response.title || "Service",
            eyebrow: response.subTitle || response.title || "Our service",
            description: response.description || "We build modern digital solutions tailored to your business goals.",
            deliverables: response.serviceDetails?.map((detail) => detail.description) || [],
            icon: serviceIcon,
            image: response.photoUrl || defaultServiceDetails[slugKey]?.image || WebVisual.src,
          };

          setServiceData(mappedService);
          setTechnologies(
            (response.technologies ?? [])
              .filter((technology) => !!technology.image)
              .map((technology, index) => ({
                id: technology.id || `${technology.name || "technology"}-${index}`,
                name: technology.name || "Technology",
                logo: technology.image || "",
              }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch service details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [serviceSlug, locale]);

  const Icon = serviceData.icon;
  const visibleTechnologies = useMemo(() => technologies.filter((tech) => Boolean(tech.logo)), [technologies]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#000918] px-5 pb-24 pt-32 text-white sm:px-8 sm:pt-40 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <nav aria-label="Breadcrumb" className="mb-12 text-center text-sm sm:mb-16 sm:text-base">
          <Link href={`/${locale}`} className="hover:text-[#22D3EE]">{t("nav_home")}</Link>
          <span className="mx-1 text-white/70">{language === "ar" ? "<" : ">"}</span>
          <Link href={`/${locale}/services`} className="text-white/70 hover:text-[#22D3EE]">{t("service_breadcrumb")}</Link>
          <span className="mx-1 text-white/70">{language === "ar" ? "<" : ">"}</span>
          <span className="text-[#22D3EE]">{serviceData.title}</span>
        </nav>

      

        <section className="-mt-[40px] grid items-center gap-10 lg:grid-cols-[1fr_.9fr] lg:gap-[200px]" aria-labelledby="service-heading">
          <div className="order-2 lg:order-1">
            <div className="mb-7  flex items-center gap-3 text-[#22D3EE]">
              <Icon size={28} strokeWidth={1.6} />
              <span className="text-xs font-semibold uppercase tracking-[0.25em]">Our service</span>
            </div>
            <h1 id="service-heading" className="text-3xl font-bold leading-tight sm:text-4xl">{serviceData.eyebrow}</h1>
            <p className="mt-7 max-w-[650px] text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">{serviceData.description}</p>
            <h2 className="mt-12 text-2xl font-bold leading-tight sm:text-3xl">What We Deliver</h2>
            <ul className="mt-6 space-y-4">
              {serviceData.deliverables.length > 0 ? (
                serviceData.deliverables.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/90 sm:text-base">
                    <Check size={23} className="text-[#86EFAC]" />
                    {item}
                  </li>
                ))
              ) : (
                <li className="text-white/70">No deliverables available.</li>
              )}
            </ul>
          </div>

          <div className="order-1 relative mx-auto flex aspect-square w-full max-w-[540px] items-center justify-center rounded-full border border-[#22D3EE] p-8 shadow-[0_0_30px_rgba(34,211,238,0.15)] sm:p-14 lg:order-2">
            <div className="absolute inset-5 rounded-full border border-[#22D3EE]/30 sm:inset-10" />
            {serviceData.image ? (
              <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
                <Image src={serviceData.image} alt={`${serviceData.title} preview`} fill sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover object-top" />
              </div>
            ) : null}
          </div>
        </section>

        {visibleTechnologies.length > 0 && (
          <section className="mt-24 text-center sm:mt-32" aria-labelledby="technology-heading">
            <h2 id="technology-heading" className="text-3xl font-bold leading-tight sm:text-4xl">Tools &amp; Technologies We Use</h2>
            <span className="mx-auto mt-5 block h-1.5 w-28 rounded-full bg-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
            <div className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-8">
              {visibleTechnologies.map((tech, index) => (
                <div key={tech.id ?? `${tech.name}-${tech.logo || index}`} className="group flex cursor-pointer flex-col items-center justify-center gap-3">
                  <div className="flex h-24 w-24 items-center justify-center p-3 transition-all duration-300 group-hover:scale-110">
                    {tech.logo ? (
                      <Image src={tech.logo} alt={tech.name} width={80} height={80} className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#22D3EE]/20 text-sm font-bold text-[#22D3EE]">{tech.name.slice(0, 2).toUpperCase()}</div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white/80 group-hover:text-[#22D3EE]">{tech.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {loading && (
          <div className="mt-10 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22D3EE]/20 border-t-[#22D3EE]" />
          </div>
        )}

        <Link href={`/${locale}/contactus`} className="mx-auto mt-16 flex w-fit items-center gap-2 rounded-full bg-[#22D3EE] px-8 py-3.5 text-sm font-bold text-[#00121F] transition-transform hover:scale-105">
          Start a project <ArrowUpRight size={17} />
        </Link>
      </div>
    </main>
  );
}

