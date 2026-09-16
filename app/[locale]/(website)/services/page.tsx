import ServicesPageContent from "@/component/ServicesPageContent";
import { constructMetadata, generateBreadcrumbSchema, generateServiceSchema } from "@/lib/seo";

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export const metadata = constructMetadata({
  title: "Software & Web Development Services | Tech Gear Solutions",
  description:
    "Explore our complete range of digital services: Web Development, Mobile App Development, Custom Software Engineering, UI/UX Design, SEO, and Digital Marketing.",
  path: "/services",
  keywords: [
    "Web Development Services",
    "Mobile Application Services",
    "Custom Software Services",
    "SEO Services",
    "UI/UX Design Services",
    "Tech Gear Services",
  ],
});

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: `/${locale}` },
    { name: "Services", item: `/${locale}/services` },
  ]);

  const webDevSchema = generateServiceSchema({
    name: "Web Development",
    description: "Custom, responsive, high-performance websites built for modern businesses.",
    url: `/${locale}/services/web-development`,
  });

  const mobileDevSchema = generateServiceSchema({
    name: "Mobile Development",
    description: "Intuitive iOS and Android applications for enterprise and consumers.",
    url: `/${locale}/services/mobile-development`,
  });

  const softwareDevSchema = generateServiceSchema({
    name: "Software Development",
    description: "Custom software architecture, APIs, and business automation platforms.",
    url: `/${locale}/services/software-development`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webDevSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mobileDevSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareDevSchema) }}
      />
      <ServicesPageContent locale={locale} />
    </>
  );
}
