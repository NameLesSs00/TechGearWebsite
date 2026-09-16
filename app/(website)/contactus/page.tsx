import ContactSection from "../../../component/ContactSection";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

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

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Contact Us", item: "/contactus" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContactSection />
    </>
  );
}
