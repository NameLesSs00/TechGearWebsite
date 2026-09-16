import ProductsPageContent from "@/component/ProductsPageContent";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export const metadata = constructMetadata({
  title: "Our Products | Tech Gear Solutions",
  description: "Explore our range of innovative digital products and solutions.",
  path: "/products",
  keywords: ["Products", "Digital Products", "Tech Solutions", "Tech Gear"],
});

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: `/${locale}` },
    { name: "Products", item: `/${locale}/products` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductsPageContent locale={locale} />
    </>
  );
}
