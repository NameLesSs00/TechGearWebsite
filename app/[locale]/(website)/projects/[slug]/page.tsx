import { notFound } from "next/navigation";
import ProjectDetails from "@/component/ProjectDetails";
import { projectService } from "@/services/projectService";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import { normalizeSlug } from "@/lib/apiClient";

interface ProjectDetailsPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

/** Resolve a slug (or legacy GUID) to a Project */
async function resolveProject(slug: string, locale: string) {
  const all = await projectService.getProjects(locale, null, 1, 100);
  const match = all.items.find(
    (p) => normalizeSlug(p.title) === slug || p.id === slug,
  );
  if (!match) return null;
  try {
    return await projectService.getProjectById(match.id, locale);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ProjectDetailsPageProps) {
  const { locale, slug } = await params;

  try {
    const project = await resolveProject(slug, locale);
    if (project) {
      return constructMetadata({
        title: `${project.title} | Our Projects | Tech Gear Solutions`,
        description:
          project.description ||
          `Discover the ${project.title} project by Tech Gear Solutions.`,
        path: `/${locale}/projects/${slug}`,
        keywords: [project.title, "Project", "Portfolio", "Tech Gear"],
      });
    }
  } catch (error) {
    console.error("Error fetching project for metadata:", error);
  }

  return constructMetadata({
    title: "Project Details | Tech Gear Solutions",
    description: "Explore our project portfolio and case studies.",
    path: `/${locale}/projects/${slug}`,
  });
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { locale, slug } = await params;

  const project = await resolveProject(slug, locale);

  if (!project) {
    notFound();
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: `/${locale}` },
    { name: "Projects", item: `/${locale}/projects` },
    { name: project.title, item: `/${locale}/projects/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProjectDetails locale={locale} projectId={project.id} />
    </>
  );
}
