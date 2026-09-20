"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";
import { getProjectMainImage, projectService, type Project } from "@/services/projectService";
import { useProjectCategories } from "@/hooks/useProjectCategories";
import { ProjectCard } from "./ProjectCard";

interface ProjectsPageContentProps {
  locale: string;
}

export default function ProjectsPageContent({ locale }: ProjectsPageContentProps) {
  const { language, direction } = useLanguage();
  const { t } = useTranslation(language);
  const { data: categories = [], isLoading: isCategoriesLoading } = useProjectCategories();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(false);
    projectService
      .getProjects(locale, activeFilter, 1, 20)
      .then((result) => {
        if (active) setProjects(result.items);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [locale, activeFilter]);

  return (
    <main dir={direction} className="min-h-screen overflow-hidden bg-[#000918] px-5 pb-24 pt-32 text-white sm:px-8 sm:pt-40 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <nav aria-label="Breadcrumb" className="mb-20 text-center text-sm text-white/90 sm:mb-24 sm:justify-start sm:text-base">
          <Link href={`/${locale}`} className="transition-colors hover:text-[#22D3EE]">{t("nav_home")}</Link>
          <span className="mx-1.5 text-[#22D3EE]">{language === "ar" ? "<" : ">"}</span>
          <span className="text-[#22D3EE]">{t("work_breadcrumb")}</span>
        </nav>

        {!isCategoriesLoading && categories.length > 0 && (
          <div className="mb-14 flex flex-wrap justify-center gap-4 sm:justify-start">
            <button
              type="button"
              onClick={() => setActiveFilter(null)}
              aria-pressed={activeFilter === null}
              className={`min-w-[172px] cursor-pointer rounded-full px-7 py-2.5 text-base font-medium transition-all sm:min-w-[180px] sm:text-lg ${
                activeFilter === null
                  ? "bg-[#20D9EC] text-white shadow-[0_0_16px_rgba(32,217,236,0.3)]"
                  : "bg-[#70747d] text-white/75 hover:bg-[#88909a] hover:text-white"
              }`}
            >
              {language === "ar" ? "الكل" : "All"}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveFilter(category.id)}
                aria-pressed={activeFilter === category.id}
                className={`min-w-[172px] cursor-pointer rounded-full px-7 py-2.5 text-base font-medium transition-all sm:min-w-[180px] sm:text-lg ${
                  activeFilter === category.id
                    ? "bg-[#20D9EC] text-white shadow-[0_0_16px_rgba(32,217,236,0.3)]"
                    : "bg-[#70747d] text-white/75 hover:bg-[#88909a] hover:text-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-14 sm:space-y-16">
          {loading && <p className="rounded-2xl border border-white/10 p-12 text-center text-white/70">{t("work_loading")}</p>}
          {!loading && error && <p className="rounded-2xl border border-red-300/20 p-12 text-center text-white/70">{t("work_error")}</p>}
          {!loading && !error && projects.length === 0 && <p className="p-12 text-center text-white/70">{t("work_no_data")}</p>}
          {!loading &&
            !error &&
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} locale={locale} language={language} className="lg:min-h-[540px]" />
            ))}
        </div>
      </div>
    </main>
  );
}
