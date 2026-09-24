"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";
import { getProjectMainImage, projectService, type Project } from "@/services/projectService";
import { useProjectCategories } from "@/hooks/useProjectCategories";

const detailLabels = {
  en: {
    overview: "Project overview",
    industry: "Industry",
    projectType: "Project Type",
    service: "Services",
    platform: "Platform",
    livePreview: "Live Preview",
    previous: "Previous image",
    next: "Next image",
  },
  ar: {
    overview: "نظرة عامة على المشروع",
    industry: "المجال",
    projectType: "نوع المشروع",
    service: "الخدمات",
    platform: "المنصة",
    livePreview: "عرض مباشر",
    previous: "الصورة السابقة",
    next: "الصورة التالية",
  },
} as const;

export default function ProjectDetails({ locale, projectId }: { locale: string; projectId: string }) {
  const { language, direction } = useLanguage();
  const { t } = useTranslation(language);
  const labels = detailLabels[language];
  const { data: categories = [] } = useProjectCategories();
  const [project, setProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(false);
    projectService
      .getProjectById(projectId, locale)
      .then((result) => {
        if (active) {
          setProject(result);
          setActiveImage(0);
        }
      })
      .catch(() => {
        if (active) {
          setProject(null);
          setError(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [projectId, locale]);

  const galleryImages = project
    ? Array.from(
        new Set([
          ...project.images
            .slice()
            .sort((first, second) => first.displayOrder - second.displayOrder)
            .map((image) => image.imageUrl),
          project.heroImageUrl,
          project.featuredImageUrl,
        ].filter(Boolean)),
      )
    : [];
  const mainImage = project ? getProjectMainImage(project) : "";
  const selectedImage = galleryImages[activeImage] || mainImage;

  return (
    <main dir={direction} className="min-h-screen overflow-hidden bg-[#000918] px-5 pb-24 pt-32 text-white sm:px-8 sm:pt-40 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <motion.nav initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} aria-label="Breadcrumb" className="mb-12 text-center text-sm sm:mb-16 sm:text-base">
          <Link href={`/${locale}`} className="hover:text-[#22D3EE]">{t("nav_home")}</Link>
          <span className="mx-1.5 text-white/70">&gt;</span>
          <Link href={`/${locale}/projects`} className="hover:text-[#22D3EE]">{t("work_breadcrumb")}</Link>
          {project && <><span className="mx-1.5 text-white/70">&gt;</span><span className="text-[#22D3EE]">{project.title}</span></>}
        </motion.nav>

        {loading && <p className="rounded-2xl border border-white/10 p-12 text-center text-white/70">{t("work_loading")}</p>}
        {!loading && error && <p className="rounded-2xl border border-red-300/20 p-12 text-center text-white/70">{t("work_error")}</p>}

        {!loading && !error && project && <>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-10 text-3xl font-bold leading-tight sm:text-4xl">{project.title}</motion.h1>

          <section className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col gap-6">
              <div 
                className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] bg-[#101820] cursor-pointer group"
                onClick={() => setIsLightboxOpen(true)}
              >
                {selectedImage && <Image src={selectedImage} alt={project.title} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />}
              </div>

              {galleryImages.length > 0 && <div className="cursor-pointer flex items-center gap-4">
                <button type="button" aria-label={labels.previous} onClick={() => setActiveImage((current) => (current - 1 + galleryImages.length) % galleryImages.length)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm text-[#011022] transition-colors hover:bg-gray-100">
                  <ChevronLeft size={24} className={`text-[#011022] ${direction === "rtl" ? "rotate-180" : ""}`} />
                </button>

                <div className="flex flex-1 gap-4 overflow-hidden">
                  {galleryImages.map((image, index) => (
                    <button type="button" key={`${image}-${index}`} onClick={() => setActiveImage(index)} className={`relative aspect-square flex-1 overflow-hidden rounded-[24px] border-2 bg-white ${activeImage === index ? "border-[#22D3EE]" : "border-transparent"}`}>
                      <Image src={image} alt={`${project.title} ${index + 1}`} fill className={`object-cover object-top transition-opacity ${activeImage === index ? "opacity-100" : "opacity-50 hover:opacity-100"}`} />
                    </button>
                  ))}
                </div>

                <button type="button" aria-label={labels.next} onClick={() => setActiveImage((current) => (current + 1) % galleryImages.length)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#22D3EE] text-[#011022] transition-colors hover:bg-[#1bbccf]">
                  <ChevronRight size={24} className={`text-[#011022] ${direction === "rtl" ? "rotate-180" : ""}`} />
                </button>
              </div>}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="rounded-[32px] bg-white p-8 text-[#011022] sm:p-10">
              {project.iconImageUrl && (
                <div className="mb-8 relative h-16 w-32">
                  <Image src={project.iconImageUrl} alt={`${project.title} logo`} fill className="object-contain object-left" />
                </div>
              )}
              
              <div className="space-y-7">
                <div>
                  <h3 className="mb-3 text-xl font-bold tracking-tight sm:text-2xl">{labels.overview}</h3>
                  <p className="text-base leading-relaxed text-[#555]">{project.description}</p>
                </div>
                <Detail label={labels.industry} value={project.industry} />
                <Detail label={labels.projectType} value={project.projectType} />
                <Detail label={labels.service} value={project.services} />
                <Detail label={labels.platform} value={project.platform} />
              </div>

              {project.projectLink && <div className="mt-12">
                <a 
                  href={project.projectLink.match(/^https?:\/\//) ? project.projectLink : `https://${project.projectLink}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex w-full items-center justify-center rounded-full border-2 border-[#22D3EE] bg-transparent py-4 text-base font-bold text-[#011022] transition-colors hover:bg-[#22D3EE] hover:text-[#011022]"
                >
                  {labels.livePreview}
                </a>
              </div>}
            </motion.div>
          </section>
        </>}

        <AnimatePresence>
          {isLightboxOpen && project && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            >
              <button 
                onClick={() => setIsLightboxOpen(false)} 
                className="absolute right-6 top-6 z-[110] rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              >
                <X size={28} />
              </button>
              
              <div className="relative h-[80vh] w-full max-w-6xl">
                <Image src={selectedImage} alt={project.title} fill className="object-contain" />
              </div>

              <div className="absolute top-1/2 flex w-full -translate-y-1/2 justify-between px-6 pointer-events-none">
                <button type="button" aria-label={labels.previous} onClick={(e) => { e.stopPropagation(); setActiveImage((current) => (current - 1 + galleryImages.length) % galleryImages.length); }} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 shadow-sm text-white transition-colors hover:bg-white/30 pointer-events-auto">
                  <ChevronLeft size={32} className={direction === "rtl" ? "rotate-180" : ""} />
                </button>
                <button type="button" aria-label={labels.next} onClick={(e) => { e.stopPropagation(); setActiveImage((current) => (current + 1) % galleryImages.length); }} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#22D3EE] text-[#011022] transition-colors hover:bg-[#1bbccf] pointer-events-auto">
                  <ChevronRight size={32} className={direction === "rtl" ? "rotate-180" : ""} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;

  return (
    <div>
      <h3 className="mb-1.5 text-lg font-bold tracking-tight">{label}:</h3>
      <p className="text-base text-[#777]">{value}</p>
    </div>
  );
}
