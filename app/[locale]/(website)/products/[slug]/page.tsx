import { notFound } from "next/navigation";
import ProductDetails from "@/component/ProductDetails";
import { constructMetadata, generateBreadcrumbSchema, generateFaqSchema } from "@/lib/seo";
import { productService } from "@/services/productService";
import { normalizeSlug } from "@/lib/apiClient";

interface ProductDetailsPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function generateProductSchema({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description: string;
  url: string;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    ...(image ? { image } : {}),
    publisher: {
      "@type": "Organization",
      name: "Tech Gear Solutions",
    },
  };
}

/** Resolve a slug (or legacy GUID) to a full ProductDetail */
async function resolveProduct(slug: string, locale: string) {
  // Fetch all products and find the one whose normalized name matches the slug.
  // We also fall back to matching by ID so that any old GUID links still work.
  const all = await productService.getProducts(locale, 1, 100);
  const match = all.find(
    (p) => normalizeSlug(p.name) === slug || p.id === slug,
  );
  return match || null;
}

export async function generateMetadata({ params }: ProductDetailsPageProps) {
  const { locale, slug } = await params;
  const product = await resolveProduct(slug, locale);

  if (!product) {
    return constructMetadata({
      title: "Product Details | Tech Gear Solutions",
      description: "Explore Tech Gear digital products.",
      path: `/${locale}/products/${slug}`,
    });
  }

  return constructMetadata({
    title: `${product.name} | Products | Tech Gear Solutions`,
    description: product.description || `Explore ${product.name} by Tech Gear Solutions.`,
    path: `/${locale}/products/${slug}`,
    image: product.heroImageUrl || undefined,
    keywords: [product.name, "Product", "Digital Product", "Tech Gear"],
  });
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { locale, slug } = await params;
  const product = await resolveProduct(slug, locale);

  if (!product) {
    notFound();
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: `/${locale}` },
    { name: "Products", item: `/${locale}/products` },
    { name: product.name, item: `/${locale}/products/${slug}` },
  ]);

  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description || product.name,
    url: `/${locale}/products/${slug}`,
    image: product.heroImageUrl,
  });

  const faqSchema =
    product.faqs.length > 0
      ? generateFaqSchema(
          product.faqs
            .filter((faq) => faq.question && faq.answer)
            .map((faq) => ({ question: faq.question!, answer: faq.answer! })),
        )
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}
      <ProductDetails locale={locale} product={product} />
    </>
  );
}
