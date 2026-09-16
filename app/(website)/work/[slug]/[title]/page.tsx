import ProjectDetails from "@/component/ProjectDetails";
import { projectService, getProjectMainImage } from "@/services/projectService";
import { constructMetadata, generateBreadcrumbSchema, generateProjectSchema } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string; title: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, title } = await params;
  const project = await projectService.getProjectById(slug, "en").catch(() => null);
  const path = `/work/${slug}/${title}`;

  return constructMetadata({
    title: project ? `${project.title} | Case Study | Tech Gear Solutions` : "Project Details | Tech Gear Solutions",
    description: project?.description || "Explore our software development project details.",
    path,
    image: project ? getProjectMainImage(project) || undefined : undefined,
    keywords: project ? [project.title, project.industry, project.projectType].filter(Boolean) as string[] : undefined,
  });
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug, title } = await params;
  const project = await projectService.getProjectById(slug, "en").catch(() => null);
  const path = `/work/${slug}/${title}`;
  const projectTitle = project?.title || title;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Our Work", item: "/work" },
    { name: projectTitle, item: path },
  ]);
  const projectSchema = generateProjectSchema({
    name: projectTitle,
    description: project?.description || "Case study by Tech Gear Solutions",
    url: path,
    image: project ? getProjectMainImage(project) : undefined,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }} />
      <ProjectDetails locale="en" projectSlug={slug} />
    </>
  );
}
