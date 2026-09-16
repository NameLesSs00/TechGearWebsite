import ProjectDetails from "@/component/ProjectDetails";
import { notFound } from "next/navigation";
import { projectService, getProjectMainImage } from "@/services/projectService";
import { constructMetadata, generateBreadcrumbSchema, generateProjectSchema } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  try {
    const project = await projectService.getProjectBySlug(slug, "en");

    if (!project) {
      return constructMetadata({
        title: "Project Details | Tech Gear Solutions",
        description: "Case study and project details.",
        path: `/work/${slug}`,
      });
    }

    return constructMetadata({
      title: `${project.title} | Case Study | Tech Gear Solutions`,
      description: project.description || `Case study on ${project.title}, developed by Tech Gear Solutions. Industry: ${project.industry || "Software Development"}.`,
      path: `/work/${slug}`,
      image: getProjectMainImage(project) || undefined,
      keywords: [project.title, project.industry, project.projectType].filter(Boolean) as string[],
    });
  } catch {
    return constructMetadata({
      title: "Project Details | Tech Gear Solutions",
      description: "Explore our software development project details.",
      path: `/work/${slug}`,
    });
  }
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  let project = null;
  try {
    project = await projectService.getProjectBySlug(slug, "en");
  } catch {
    project = null;
  }

  const path = `/work/${slug}`;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Our Work", item: "/work" },
    { name: project?.title || "Project Case Study", item: path },
  ]);
  const projectSchema = generateProjectSchema({
    name: project?.title || "Software Project Case Study",
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
