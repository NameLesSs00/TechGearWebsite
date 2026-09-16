"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";
import { getProjectMainImage, ProjectCategory, projectService, type Project } from "@/services/projectService";

const categoryLabels = {
  en: { 0: "Mobile App", 1: "Website", 2: "Desktop App" },
  ar: { 0: "تطبيق موبايل", 1: "موقع ويب", 2: "تطبيق سطح المكتب" },
} as const;

interface ProjectSectionProps {
  locale?: string;
}

export default function ProjectSection({ locale }: ProjectSectionProps) {
  const { language, direction } = useLanguage();
  const { t } = useTranslation(language);
  const currentLocale = locale || language;
  const [activeProject, setActiveProject] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(false);
    projectService
      .getProjects(currentLocale, selectedCategory, 1, 20)
      .then((result) => {
        if (active) {
          setProjects(result.items);
          setActiveProject(0);
        }
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
  }, [currentLocale, selectedCategory]);

  const project = projects[activeProject];
  const categoryLabel = project
    ? categoryLabels[language][project.category as keyof (typeof categoryLabels)[typeof language]] ?? ""
    : "";

  return (
    <section className="relative isolate overflow-hidden bg-[#000918] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-28" aria-labelledby="projects-heading">
      <div className="pointer-events-none absolute inset-0 z-[-1] overflow-hidden" aria-hidden="true">
        <div className="absolute bottom-[-42%] left-1/2 h-[min(105vw,1050px)] w-[min(105vw,1050px)] -translate-x-1/2 h-full w-[95%] opacity-20 bg-[#22D3EE]/20 blur-2xl sm:bottom-[-48%] lg:bottom-[-55%]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="relative mb-12 text-center sm:mb-16">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.42em] text-[#22D3EE]">{t("projects_label")}</p>
          <h2 id="projects-heading" className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{t("projects_heading")}</h2>
          <span className="mx-auto mt-5 block h-1.5 w-28 rounded-full bg-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.6)]" aria-hidden="true" />
 <Link href={`/${currentLocale}/work`} className={`translate-y-8 flex items-center gap-2 text-sm text-[#22D3EE] transition-colors hover:text-white sm:absolute sm:bottom-0 sm:mt-0 sm:text-base ${direction === "rtl" ? "sm:left-0" : "sm:right-0"}`}>
            {t("projects_view_all")} <ArrowRight size={19} className={direction === "rtl" ? "rotate-180" : ""} />
          </Link>
        </header>


        <div className="mx-auto mb-10 grid w-full max-w-[520px] grid-cols-2 gap-3 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center">
          {[
            { value: null, en: "All", ar: "الكل" },
            { value: ProjectCategory.Mobile, en: "Mobile App", ar: "تطبيق موبايل" },
            { value: ProjectCategory.Web, en: "Website", ar: "موقع ويب" },
            { value: ProjectCategory.Desktop, en: "Desktop App", ar: "تطبيق سطح المكتب" },
          ].map((filter) => (
            <button
              key={filter.en}
              type="button"
              onClick={() => setSelectedCategory(filter.value)}
              aria-pressed={selectedCategory === filter.value}
              className={`min-w-0 rounded-full px-3 cursor-pointer py-2 text-center text-sm font-medium leading-5 transition-colors sm:px-5 ${
                selectedCategory === filter.value
                  ? "bg-[#22D3EE] text-[#00121F]"
                  : "bg-white/10 text-white/75 hover:bg-white/20 hover:text-white"
              }`}
            >
              {language === "ar" ? filter.ar : filter.en}
            </button>
          ))}
        </div>

        {loading && <p className="rounded-2xl border border-white/10 p-12 text-center text-white/70">{t("work_loading")}</p>}
        {!loading && error && <p className="rounded-2xl border border-red-300/20 p-12 text-center text-white/70">{t("work_error")}</p>}
        {!loading && !error && !project && <p className="rounded-2xl border border-white/10 p-12 text-center text-white/70">{t("work_no_data")}</p>}

        {!loading && !error && project && <AnimatePresence mode="wait">
          <motion.article key={project.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.3 }} className="grid overflow-hidden rounded-[1.75rem] border border-[#22D3EE] bg-[#1d2c3a] shadow-[0_0_22px_rgba(34,211,238,0.18)] lg:grid-cols-[1fr_1fr]">
            <div className="order-2 flex min-h-[430px] flex-col items-start justify-center p-8 sm:p-12 lg:order-none lg:p-14">
              <span className="rounded-full bg-[#7aaebc] px-7 py-3 text-sm font-medium text-white">{categoryLabel}</span>
              <h3 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h3>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">{project.description}</p>
              <Link href={`/${currentLocale}/work/${project.slug}`} className="mt-8 inline-flex min-w-[180px] items-center justify-center rounded-full bg-[#22D3EE] px-7 py-3.5 text-sm font-bold text-[#00121F] transition-transform hover:scale-105">{t("work_view_project")}</Link>
            </div>
            <div className="order-1 relative min-h-[300px] overflow-hidden bg-[#101820] lg:order-none lg:min-h-[500px]">
              {getProjectMainImage(project) && <Image src={getProjectMainImage(project)} alt={`${project.title} project preview`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-top transition-transform duration-700 hover:scale-105" />}
            </div>
          </motion.article>
        </AnimatePresence>}

        {projects.length > 0 && <div className="mt-14 flex justify-center gap-4" aria-label="Project carousel navigation">
          {projects.map((item, index) => (
            <button key={item.id} type="button" aria-label={`Show ${item.title}`} aria-current={activeProject === index} onClick={() => setActiveProject(index)} className={`h-4 w-4 rounded-full transition-all ${activeProject === index ? "scale-110 bg-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.7)]" : "bg-[#7b8791] hover:bg-white"}`} />
          ))}

          
        </div>}
      </div>
    </section>
  );
}
