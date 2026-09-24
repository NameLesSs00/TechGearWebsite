import ProjectDetails from "@/component/ProjectDetails";
import { projectService } from "@/services/projectService";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

interface ProjectDetailsPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: ProjectDetailsPageProps) {
  const { locale, id } = await params;

  try {
    const project = await projectService.getProjectById(id, locale);
    if (project) {
      return constructMetadata({
        title: `${project.title} | Our Projects | Tech Gear Solutions`,
        description: project.description || `Discover the ${project.title} project by Tech Gear Solutions.`,
        path: `/${locale}/projects/${id}`,
        keywords: [project.title, "Project", "Portfolio", "Tech Gear"],
      });
    }
  } catch (error) {
    console.error("Error fetching project for metadata:", error);
  }

  return constructMetadata({
    title: "Project Details | Tech Gear Solutions",
    description: "Explore our project portfolio and case studies.",
    path: `/${locale}/projects/${id}`,
  });
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { locale, id } = await params;

  let title = "Project";

  try {
    const project = await projectService.getProjectById(id, locale);
    if (project) {
      title = project.title;
    }
  } catch (error) {
    console.error("Error fetching project for schema:", error);
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: `/${locale}` },
    { name: "Projects", item: `/${locale}/projects` },
    { name: title, item: `/${locale}/projects/${id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProjectDetails locale={locale} projectId={id} />
    </>
  );
}
