import ServiceDetails from "@/component/ServiceDetails";
import { serviceService } from "@/services/serviceService";
import { constructMetadata, generateBreadcrumbSchema, generateServiceSchema } from "@/lib/seo";
import { matchesEntitySlug } from "@/lib/apiClient";

interface ServiceDetailsPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailsPageProps) {
  const { locale, slug } = await params;

  // Fallback to API lookup
  try {
    const services = await serviceService.getServices(locale, 1, 100);
    const apiService = services.find((s) => matchesEntitySlug(slug, s, s.title));
    if (apiService) {
      return constructMetadata({
        title: `${apiService.title} | Services | Tech Gear Solutions`,
        description:
          apiService.description ||
          `Professional ${apiService.title} services provided by Tech Gear Solutions.`,
        path: `/${locale}/services/${slug}`,
        keywords: [apiService.title, "Software Services", "Tech Gear"],
      });
    }
  } catch (error) {
    console.error("Error fetching service for metadata:", error);
  }

  return constructMetadata({
    title: "Service Details | Tech Gear Solutions",
    description: "Professional software development and technology services.",
    path: `/${locale}/services/${slug}`,
  });
}

export default async function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
  const { locale, slug } = await params;

  let title = "Service";
  let description = "Software development service.";

  try {
    const services = await serviceService.getServices(locale, 1, 100);
    const apiService = services.find((s) => matchesEntitySlug(slug, s, s.title));
    if (apiService) {
      title = apiService.title;
      description = apiService.description || description;
    }
  } catch (error) {
    console.error("Error fetching service for schema:", error);
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: `/${locale}` },
    { name: "Services", item: `/${locale}/services` },
    { name: title, item: `/${locale}/services/${slug}` },
  ]);

  const serviceSchema = generateServiceSchema({
    name: title,
    description,
    url: `/${locale}/services/${slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ServiceDetails locale={locale} serviceSlug={slug} />
    </>
  );
}
