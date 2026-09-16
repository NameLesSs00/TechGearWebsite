import ProjectsPageContent from "@/component/ProjectsPageContent";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

interface WorkPageProps {
  params: Promise<{ locale: string }>;
}

export const metadata = constructMetadata({
  title: "Our Work | Projects & Case Studies | Tech Gear Solutions",
  description:
    "Explore our portfolio of successful projects: mobile apps, websites, and custom software solutions delivered for clients worldwide.",
  path: "/work",
  keywords: ["Projects", "Portfolio", "Case Studies", "Our Work", "Tech Gear"],
});

export default async function WorkPage({ params }: WorkPageProps) {
  const { locale } = await params;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: `/${locale}` },
    { name: "Work", item: `/${locale}/work` },
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
