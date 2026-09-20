"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";
import { getProjectMainImage, projectService, type Project } from "@/services/projectService";
import { useProjectCategories } from "@/hooks/useProjectCategories";
import { ProjectCard } from "./ProjectCard";

interface ProjectSectionProps {
  locale?: string;
}

export default function ProjectSection({ locale }: ProjectSectionProps) {
  const { language, direction } = useLanguage();
  const { t } = useTranslation(language);
  const currentLocale = locale || language;
  const { data: categories = [], isLoading: isCategoriesLoading } = useProjectCategories();
  const [activeProject, setActiveProject] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
  const categoryLabel = project?.categoryName ?? "";

  return (
    <section className="relative isolate overflow-hidden bg-[#000918] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-28" aria-labelledby="projects-heading">
      <div className="pointer-events-none absolute inset-0 z-[-1] overflow-hidden" aria-hidden="true">
        <div className="absolute bottom-[-42%] left-1/2 h-[min(105vw,1050px)] w-[min(105vw,1050px)] -translate-x-1/2 h-full w-[95%] opacity-20 bg-[#22D3EE]/20 blur-2xl sm:bottom-[-48%] lg:bottom-[-55%]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.header 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative mb-12 text-center sm:mb-16"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.42em] text-[#22D3EE]">{t("projects_label")}</p>
          <h2 id="projects-heading" className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{t("projects_heading")}</h2>
          <span className="mx-auto mt-5 block h-1.5 w-28 rounded-full bg-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.6)]" aria-hidden="true" />
          <Link href={`/${currentLocale}/work`} className={`translate-y-8 flex items-center gap-2 text-sm text-[#22D3EE] transition-colors hover:text-white sm:absolute sm:bottom-0 sm:mt-0 sm:text-base ${direction === "rtl" ? "sm:left-0" : "sm:right-0"}`}>
            {t("projects_view_all")} <ArrowRight size={19} className={direction === "rtl" ? "rotate-180" : ""} />
          </Link>
        </motion.header>


        {!isCategoriesLoading && categories.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mb-10 grid w-full max-w-[520px] grid-cols-2 gap-3 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center"
          >
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              aria-pressed={selectedCategory === null}
              className={`min-w-0 rounded-full px-3 cursor-pointer py-2 text-center text-sm font-medium leading-5 transition-colors sm:px-5 ${
                selectedCategory === null
                  ? "bg-[#22D3EE] text-[#011022]"
                  : "bg-white/10 text-white/75 hover:bg-white/20 hover:text-white"
              }`}
            >
              {language === "ar" ? "الكل" : "All"}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                aria-pressed={selectedCategory === category.id}
                className={`min-w-0 rounded-full px-3 cursor-pointer py-2 text-center text-sm font-medium leading-5 transition-colors sm:px-5 ${
                  selectedCategory === category.id
                    ? "bg-[#22D3EE] text-[#011022]"
                    : "bg-white/10 text-white/75 hover:bg-white/20 hover:text-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
        )}

        {loading && <p className="rounded-2xl border border-white/10 p-12 text-center text-white/70">{t("work_loading")}</p>}
        {!loading && error && <p className="rounded-2xl border border-red-300/20 p-12 text-center text-white/70">{t("work_error")}</p>}
        {!loading && !error && !project && <p className="p-12 text-center text-white/70">{t("work_no_data")}</p>}

        {!loading && !error && project && <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div key={project.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.3 }}>
              <ProjectCard project={project} locale={currentLocale} language={language} />
            </motion.div>
          </AnimatePresence>
        </motion.div>}

        {projects.length > 0 && <div className="mt-14 flex justify-center gap-4" aria-label="Project carousel navigation">
          {projects.map((item, index) => (
            <button key={item.id} type="button" aria-label={`Show ${item.title}`} aria-current={activeProject === index} onClick={() => setActiveProject(index)} className={`h-4 w-4 rounded-full transition-all ${activeProject === index ? "scale-110 bg-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.7)]" : "bg-[#7b8791] hover:bg-white"}`} />
          ))}

          
        </div>}
      </div>
    </section>
  );
}
