import ServiceSection from "@/component/ServiceSection";
import { constructMetadata } from "@/lib/seo";

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ServicesPageProps) {
  const { locale } = await params;

  return constructMetadata({
    title: "Services | Tech Gear Solutions",
    description: "Explore Tech Gear Solutions services across web, mobile, software, marketing, design, and SEO.",
    path: `/${locale}/services`,
    keywords: ["Tech Gear services", "Software services", "Web development", "Mobile development", "SEO"],
  });
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-[#000918] pt-24 text-white">
      <ServiceSection locale={locale} showBreadcrumb={true} />
    </main>
  );
}
