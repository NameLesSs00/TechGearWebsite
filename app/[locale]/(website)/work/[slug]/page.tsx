import ProjectDetails from "@/component/ProjectDetails";
import { projectService } from "@/services/projectService";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

interface ProjectDetailsPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailsPageProps) {
  const { locale, slug } = await params;

  try {
    const project = await projectService.getProjectBySlug(slug, locale);
    if (project) {
      return constructMetadata({
        title: `${project.title} | Our Work | Tech Gear Solutions`,
        description: project.description || `Discover the ${project.title} project by Tech Gear Solutions.`,
        path: `/${locale}/work/${slug}`,
        keywords: [project.title, "Project", "Portfolio", "Tech Gear"],
      });
    }
  } catch (error) {
    console.error("Error fetching project for metadata:", error);
  }

  return constructMetadata({
    title: "Project Details | Tech Gear Solutions",
    description: "Explore our project portfolio and case studies.",
    path: `/${locale}/work/${slug}`,
  });
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { locale, slug } = await params;

  let title = "Project";

  try {
    const project = await projectService.getProjectBySlug(slug, locale);
    if (project) {
      title = project.title;
    }
  } catch (error) {
    console.error("Error fetching project for schema:", error);
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: `/${locale}` },
    { name: "Work", item: `/${locale}/work` },
    { name: title, item: `/${locale}/work/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProjectDetails locale={locale} projectSlug={slug} />
    </>
  );
}
