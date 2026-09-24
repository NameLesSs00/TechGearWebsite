import ProjectsPageContent from "@/component/ProjectsPageContent";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export const metadata = constructMetadata({
  title: "Our Projects | Projects & Case Studies | Tech Gear Solutions",
  description:
    "Explore our portfolio of successful projects: mobile apps, websites, and custom software solutions delivered for clients worldwide.",
  path: "/projects",
  keywords: ["Projects", "Portfolio", "Case Studies", "Our Projects", "Tech Gear"],
});

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: `/${locale}` },
    { name: "Projects", item: `/${locale}/projects` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProjectsPageContent locale={locale} />
    </>
  );
}
