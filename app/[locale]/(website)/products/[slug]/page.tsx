import ProductDetails from "@/component/ProductDetails";
import { productService } from "@/services/productService";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

interface ProductDetailsPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailsPageProps) {
  const { locale, slug } = await params;

  try {
    const product = await productService.getProductBySlug(slug, locale);
    if (product) {
      return constructMetadata({
        title: `${product.title} | Products | Tech Gear Solutions`,
        description: product.description || `Discover ${product.title} by Tech Gear Solutions.`,
        path: `/${locale}/products/${slug}`,
        keywords: [product.title, "Product", "Tech Gear"],
      });
    }
  } catch (error) {
    console.error("Error fetching product for metadata:", error);
  }

  return constructMetadata({
    title: "Product Details | Tech Gear Solutions",
    description: "Explore our innovative products and solutions.",
    path: `/${locale}/products/${slug}`,
  });
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { locale, slug } = await params;

  let title = "Product";

  try {
    const product = await productService.getProductBySlug(slug, locale);
    if (product) {
      title = product.title;
    }
  } catch (error) {
    console.error("Error fetching product for schema:", error);
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: `/${locale}` },
    { name: "Products", item: `/${locale}/products` },
    { name: title, item: `/${locale}/products/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetails locale={locale} productSlug={slug} />
    </>
  );
}
