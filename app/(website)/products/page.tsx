import ProductsPageContent from "@/component/ProductsPageContent";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Products & Software Platforms | Tech Gear Solutions",
  description:
    "Explore our ready-to-use business products, custom software platforms, and enterprise solutions developed by Tech Gear Solutions.",
  path: "/products",
  keywords: [
    "Software Products",
    "Enterprise Solutions",
    "Digital Business Platforms",
    "Tech Gear Products",
  ],
});

export default function ProductsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Products", item: "/products" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductsPageContent locale="en" />
    </>
  );
}
