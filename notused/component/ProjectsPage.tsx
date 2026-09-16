"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";
import { getProjectMainImage, ProjectCategory, projectService, type Project } from "@/services/projectService";

const filters = [
  { value: null, en: "All", ar: "الكل" },
  { value: ProjectCategory.Mobile, en: "Mobile App", ar: "تطبيق موبايل" },
  { value: ProjectCategory.Web, en: "Website", ar: "موقع ويب" },
  { value: ProjectCategory.Desktop, en: "Desktop App", ar: "تطبيق سطح المكتب" },
] as const;

export default function ProjectsPage() {
  const { language, direction } = useLanguage();
  const { t } = useTranslation(language);
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(false);
    projectService
      .getProjects(language, activeFilter, 1, 20)
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
  }, [language, activeFilter]);

  return (
    <main dir={direction} className="min-h-screen overflow-hidden bg-[#000918] px-5 pb-24 pt-32 text-white sm:px-8 sm:pt-40 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <nav aria-label="Breadcrumb" className="mb-20 text-center text-sm text-white/90 sm:mb-24 sm:text-base">
          <Link href="/" className="transition-colors hover:text-[#22D3EE]">{t("nav_home")}</Link>
          <span className="mx-1.5 text-[#22D3EE]">{language === "ar" ? "<" : ">"}</span>
          <span className="text-[#22D3EE]">{t("work_breadcrumb")}</span>
        </nav>

        <div className="mb-14 flex flex-wrap justify-center gap-4 sm:justify-start sm:gap-5">
          {filters.map((filter) => (
            <button key={filter.en} type="button" onClick={() => setActiveFilter(filter.value)} aria-pressed={activeFilter === filter.value} className={`min-w-[172px] rounded-full px-7 py-2.5 text-sm font-medium transition-all sm:min-w-[180px] sm:text-base ${activeFilter === filter.value ? "bg-[#20D9EC] text-white shadow-[0_0_16px_rgba(32,217,236,0.3)]" : "bg-[#70747d] text-white/75 hover:bg-[#88909a] hover:text-white"}`}>
              {language === "ar" ? filter.ar : filter.en}
            </button>
          ))}
        </div>

        <div className="space-y-14 sm:space-y-16">
          {loading && <p className="rounded-2xl border border-white/10 p-12 text-center text-white/70">{t("work_loading")}</p>}
          {!loading && error && <p className="rounded-2xl border border-red-300/20 p-12 text-center text-white/70">{t("work_error")}</p>}
          {!loading && !error && projects.length === 0 && <p className="rounded-2xl border border-white/10 p-12 text-center text-white/70">{t("work_no_data")}</p>}
          {!loading && !error && projects.map((project) => (
            <article key={project.id} className="grid overflow-hidden rounded-[1.5rem] border border-[#22D3EE] bg-[#1b2635] shadow-[0_0_20px_rgba(34,211,238,0.08)] lg:min-h-[540px] lg:grid-cols-[1.05fr_.95fr]">
              <div className="flex flex-col items-start justify-center p-8 sm:p-12 lg:p-9 xl:p-14">
                <span className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-[#6ba2ad] px-7 py-3 text-sm font-medium text-white sm:text-base">{filters.find((filter) => filter.value === project.category)?.[language] ?? ""}</span>
                <h2 className="mt-7 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{project.title}</h2>
                <p className="mt-7 max-w-[590px] text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">{project.description}</p>
                <Link href={`/work/${project.id}/${project.slug}`} className="mt-8 inline-flex min-w-[235px] items-center justify-center gap-2 rounded-full bg-[#22D3EE] px-7 py-3.5 text-sm font-bold text-[#00121F] transition-transform hover:scale-105">{t("work_view_project")} <ArrowRight size={18} className={direction === "rtl" ? "rotate-180" : ""} /></Link>
              </div>
              <div className="relative min-h-[280px] overflow-hidden bg-[#101820] sm:min-h-[390px] lg:min-h-full">
                {getProjectMainImage(project) && <Image src={getProjectMainImage(project)} alt={`${project.title} project preview`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-top transition-transform duration-500 hover:scale-105" />}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 flex justify-center gap-3" aria-label="Projects pagination">
          <span className="h-3 w-3 rounded-full bg-[#22D3EE]" />
          <span className="h-3 w-3 rounded-full bg-[#7b8791]" />
          <span className="h-3 w-3 rounded-full bg-[#7b8791]" />
        </div>
      </div>
    </main>
  );
}
