import ContactSection from "../../../../component/ContactSection";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export const metadata = constructMetadata({
  title: "Contact Us | Tech Gear Solutions - Get a Project Quote",
  description:
    "Have questions or need a custom software solution? Contact Tech Gear Solutions today. Write to us or visit our office in Hurghada, Egypt for a consultation.",
  path: "/contactus",
  keywords: [
    "Contact Tech Gear Solutions",
    "Get Software Quote",
    "Hire Software Developers",
    "Software Company Contact",
  ],
});

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: `/${locale}` },
    { name: "Contact Us", item: `/${locale}/contactus` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContactSection locale={locale} />
    </>
  );
}
