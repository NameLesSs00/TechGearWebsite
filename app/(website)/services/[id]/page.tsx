import ServiceDetails from "../../../../component/ServiceDetails";
import { serviceService } from "@/services/serviceService";
import { constructMetadata, generateBreadcrumbSchema, generateServiceSchema } from "@/lib/seo";

interface ServiceDetailsPageProps {
  params: Promise<{ id: string }>;
}

const serviceTitles: Record<string, { title: string; description: string }> = {
  "web-development": {
    title: "Web Development Services | Tech Gear Solutions",
    description:
      "Modern, responsive, high-performance websites and web applications designed and developed to move your business forward.",
  },
  "mobile-development": {
    title: "Mobile App Development | Tech Gear Solutions",
    description:
      "Fast, intuitive iOS & Android mobile applications built for seamless performance and outstanding user experiences.",
  },
  "software-development": {
    title: "Custom Software Development | Tech Gear Solutions",
    description:
      "Reliable custom software architecture, dashboards, and integrations built around your specific business workflows.",
  },
  marketing: {
    title: "Digital Marketing & Growth | Tech Gear Solutions",
    description:
      "Strategic digital marketing campaigns, content strategy, and search optimization to reach and convert your target audience.",
  },
  "graphic-design": {
    title: "Graphic Design & Branding | Tech Gear Solutions",
    description:
      "Memorable visual brand identity, UI visual systems, and marketing materials that set your company apart.",
  },
  seo: {
    title: "Search Engine Optimization (SEO) | Tech Gear Solutions",
    description:
      "Technical SEO, on-page optimization, and content strategy to rank higher on search engines and drive organic traffic.",
  },
};

export async function generateMetadata({ params }: ServiceDetailsPageProps) {
  const { id } = await params;
  const knownService = serviceTitles[id];

  if (knownService) {
    return constructMetadata({
      title: knownService.title,
      description: knownService.description,
      path: `/services/${id}`,
      keywords: [id.replace(/-/g, " "), "Services", "Tech Gear"],
    });
  }

  // Fallback to API lookup
  try {
    const apiService = await serviceService.getServiceById(id, "en");
    if (apiService) {
      return constructMetadata({
        title: `${apiService.title} | Services | Tech Gear Solutions`,
        description:
          apiService.description ||
          `Professional ${apiService.title} services provided by Tech Gear Solutions.`,
        path: `/services/${id}`,
        keywords: [apiService.title, "Software Services"],
      });
    }
  } catch (error) {
    console.error("Error fetching service for metadata:", error);
  }

  return constructMetadata({
    title: "Service Details | Tech Gear Solutions",
    description: "Professional software development and technology services.",
    path: `/services/${id}`,
  });
}

export default async function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
  const { id } = await params;
  const knownService = serviceTitles[id];

  let title = knownService ? knownService.title.split(" | ")[0] : "Service";
  let description = knownService ? knownService.description : "Software development service.";

  if (!knownService) {
    try {
      const apiService = await serviceService.getServiceById(id, "en");
      if (apiService) {
        title = apiService.title;
        description = apiService.description || description;
      }
    } catch (error) {
      console.error("Error fetching service for schema:", error);
    }
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Services", item: "/services" },
    { name: title, item: `/services/${id}` },
  ]);

  const serviceSchema = generateServiceSchema({
    name: title,
    description,
    url: `/services/${id}`,
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
      <ServiceDetails locale="en" serviceSlug={id} />
    </>
  );
}
