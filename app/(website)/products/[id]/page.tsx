import ProductDetails from "@/component/ProductDetails";
import { productService } from "@/services/productService";
import { constructMetadata, generateBreadcrumbSchema, generateProjectSchema } from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await productService.getProductById(id, "en");

  if (!product) {
    return constructMetadata({
      title: "Product Details | Tech Gear Solutions",
      description: "Product details and software platform features.",
      path: `/products/${id}`,
    });
  }

  const title = `${product.title} | Software Product by Tech Gear Solutions`;
  const description =
    product.description ||
    `Explore ${product.title}, a high-performance software platform designed and built by Tech Gear Solutions.`;
  const image = product.photoUrl || undefined;

  return constructMetadata({
    title,
    description,
    path: `/products/${id}`,
    image,
    keywords: [product.title, "Software Product", "Tech Gear Product"],
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await productService.getProductById(id, "en");

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Products", item: "/products" },
    { name: product?.title || "Product", item: `/products/${id}` },
  ]);

  const productSchema = generateProjectSchema({
    name: product?.title || "Software Product",
    description: product?.description || "Software solution built by Tech Gear Solutions",
    url: `/products/${id}`,
    image: product?.photoUrl || undefined,
  });

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
      <ProductDetails locale="en" productSlug={id} />
    </>
  );
}
