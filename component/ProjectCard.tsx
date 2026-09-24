import Image from "next/image";
import Link from "next/link";
import { getProjectMainImage, type Project } from "@/services/projectService";
import { forwardRef } from "react";
import { normalizeSlug } from "@/lib/apiClient";

interface ProjectCardProps extends React.HTMLAttributes<HTMLElement> {
  project: Project;
  locale: string;
  language: string;
}

export const ProjectCard = forwardRef<HTMLElement, ProjectCardProps>(
  ({ project, locale, language, className = "", ...props }, ref) => {
    const categoryLabel = project.categoryName ?? "";
    
    return (
      <article
        ref={ref}
        className={`grid overflow-hidden rounded-[1.75rem] border border-[#22D3EE] bg-[#1d2c3a] shadow-[0_0_22px_rgba(34,211,238,0.18)] lg:grid-cols-[1fr_1fr] ${className}`}
        {...props}
      >
        <div className="order-2 flex min-h-[430px] flex-col items-start justify-center p-8 sm:p-12 lg:order-none lg:p-14">
          {categoryLabel && <span className="inline-flex items-center justify-center rounded-full bg-[#6ba2ad] px-6 py-2 text-sm font-medium text-white">{categoryLabel}</span>}
          <h3 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{project.title}</h3>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl">{project.description}</p>
          <Link href={`/${locale}/projects/${normalizeSlug(project.title)}`} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#22D3EE] px-8 py-3 text-sm font-bold text-[#011022] transition-transform hover:scale-105">
            {language === "ar" ? "اقرأ المزيد" : "Read More"}
          </Link>
        </div>
        <div className="order-1 relative min-h-[300px] flex items-center justify-center overflow-hidden bg-[#101820] lg:order-none lg:min-h-[500px]">
          {getProjectMainImage(project) && <Image src={getProjectMainImage(project)} alt={`${project.title} project preview`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain object-center" />}
        </div>
      </article>
    );
  }
);

ProjectCard.displayName = "ProjectCard";
