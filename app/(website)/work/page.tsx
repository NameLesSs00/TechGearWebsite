import ProjectsPageContent from "@/component/ProjectsPageContent";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Our Work & Project Portfolio | Tech Gear Solutions",
  description:
    "Explore our portfolio of successful web development, mobile application, and custom software projects delivered to clients worldwide by Tech Gear Solutions.",
  path: "/work",
  keywords: [
    "Software Portfolio",
    "Web Development Projects",
    "Mobile App Case Studies",
    "Custom Software Work",
    "Tech Gear Portfolio",
  ],
});

export default function WorkPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Our Work", item: "/work" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProjectsPageContent locale="en" />
    </>
  );
}
