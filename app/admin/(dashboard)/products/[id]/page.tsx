import ProductEditor from "../_components/ProductEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  return <ProductEditor productId={id} />;
}

