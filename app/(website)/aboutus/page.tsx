import AboutSection from "../../../component/AboutSection";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "About Us | Tech Gear Solutions - Technology & Software Company",
  description:
    "Learn about Tech Gear Solutions, our mission, vision, and expert software development team in Hurghada, Egypt. We turn complex business challenges into clear, useful digital solutions.",
  path: "/aboutus",
  keywords: [
    "About Tech Gear Solutions",
    "Software Development Team",
    "Tech Company Hurghada",
    "Software Agency Egypt",
  ],
});

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "About Us", item: "/aboutus" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutSection />
    </>
  );
}
