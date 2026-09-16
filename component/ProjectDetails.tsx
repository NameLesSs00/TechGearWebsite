"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";
import { getProjectMainImage, ProjectCategory, projectService, type Project } from "@/services/projectService";

const categoryLabels = {
  en: {
    [ProjectCategory.Mobile]: "Mobile App",
    [ProjectCategory.Web]: "Website",
    [ProjectCategory.Desktop]: "Desktop App",
  },
  ar: {
    [ProjectCategory.Mobile]: "تطبيق موبايل",
    [ProjectCategory.Web]: "موقع ويب",
    [ProjectCategory.Desktop]: "تطبيق سطح المكتب",
  },
} as const;

const detailLabels = {
  en: {
    overview: "Project overview",
    industry: "Industry",
    projectType: "Project Type",
    category: "Category",
    service: "Service",
    includes: "Includes",
    livePreview: "Live Preview",
    previous: "Previous image",
    next: "Next image",
  },
  ar: {
    overview: "نظرة عامة على المشروع",
    industry: "المجال",
    projectType: "نوع المشروع",
    category: "الفئة",
    service: "الخدمة",
    includes: "يتضمن",
    livePreview: "عرض مباشر",
    previous: "الصورة السابقة",
    next: "الصورة التالية",
  },
} as const;

export default function ProjectDetails({ locale, projectSlug }: { locale: string; projectSlug: string }) {
  const { language, direction } = useLanguage();
  const { t } = useTranslation(language);
  const labels = detailLabels[language];
  const [project, setProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(false);
    projectService
      .getProjectBySlug(projectSlug, locale)
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
  }, [projectSlug, locale]);

  const galleryImages = project
    ? Array.from(
        new Set([
          ...project.projectImages
            .slice()
            .sort((first, second) => first.displayOrder - second.displayOrder)
            .map((image) => image.imageUrl),
          ...project.images,
          project.image,
          project.photoUrl,
        ].filter(Boolean)),
      )
    : [];
  const mainImage = project ? getProjectMainImage(project) : "";
  const selectedImage = galleryImages[activeImage] || mainImage;

  return (
    <main dir={direction} className="min-h-screen overflow-hidden bg-[#000918] px-5 pb-24 pt-32 text-white sm:px-8 sm:pt-40 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <nav aria-label="Breadcrumb" className="mb-12 text-center text-sm sm:mb-16 sm:text-base">
          <Link href={`/${locale}`} className="hover:text-[#22D3EE]">{t("nav_home")}</Link>
          <span className="mx-1.5 text-white/70">&gt;</span>
          <Link href={`/${locale}/work`} className="hover:text-[#22D3EE]">{t("work_breadcrumb")}</Link>
          {project && <><span className="mx-1.5 text-white/70">&gt;</span><span className="text-[#22D3EE]">{project.title}</span></>}
        </nav>

        {loading && <p className="rounded-2xl border border-white/10 p-12 text-center text-white/70">{t("work_loading")}</p>}
        {!loading && error && <p className="rounded-2xl border border-red-300/20 p-12 text-center text-white/70">{t("work_error")}</p>}

        {!loading && !error && project && <>
          <h1 className="mb-10 text-3xl font-bold leading-tight sm:text-4xl">{project.title}</h1>

          <section className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
            <div className="flex flex-col gap-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] bg-[#101820]">
                {selectedImage && <Image src={selectedImage} alt={project.title} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover object-top" />}
              </div>

              {galleryImages.length > 0 && <div className="cursor-pointer flex items-center gap-4">
                <button type="button" aria-label={labels.previous} onClick={() => setActiveImage((current) => (current - 1 + galleryImages.length) % galleryImages.length)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E2E6EF] text-[#000918] transition-colors hover:bg-white">
                  <ChevronLeft size={24} className={direction === "rtl" ? "rotate-180" : ""} />
                </button>

                <div className="flex flex-1 gap-4 overflow-hidden">
                  {galleryImages.map((image, index) => (
                    <button type="button" key={`${image}-${index}`} onClick={() => setActiveImage(index)} className={`relative aspect-square flex-1 overflow-hidden rounded-[24px] border-2 bg-white ${activeImage === index ? "border-[#22D3EE]" : "border-transparent"}`}>
                      <Image src={image} alt={`${project.title} ${index + 1}`} fill className={`object-cover object-top transition-opacity ${activeImage === index ? "opacity-100" : "opacity-50 hover:opacity-100"}`} />
                    </button>
                  ))}
                </div>

                <button type="button" aria-label={labels.next} onClick={() => setActiveImage((current) => (current + 1) % galleryImages.length)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#22D3EE] text-[#00121F] transition-colors hover:bg-[#1bbccf]">
                  <ChevronRight size={24} className={direction === "rtl" ? "rotate-180" : ""} />
                </button>
              </div>}
            </div>

            <div className="rounded-[32px] bg-white p-8 text-[#00121F] sm:p-10">
              <div className="space-y-7">
                <div>
                  <h3 className="mb-3 text-xl font-bold tracking-tight sm:text-2xl">{labels.overview}</h3>
                  <p className="text-base leading-relaxed text-[#555]">{project.description}</p>
                </div>
                <Detail label={labels.industry} value={project.industry} />
                <Detail label={labels.projectType} value={project.projectType} />
                <Detail label={labels.category} value={categoryLabels[language][project.category as ProjectCategory]} />
                <Detail label={labels.service} value={project.serviceTitle} />
                <Detail label={labels.includes} value={project.includes} />
              </div>

              {project.liveDemoUrl && <div className="mt-12">
                <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center rounded-full bg-[#22D3EE] py-4 text-base font-bold text-[#00121F] transition-transform hover:scale-[1.02]">
                  {labels.livePreview}
                </a>
              </div>}
            </div>
          </section>
        </>}
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
