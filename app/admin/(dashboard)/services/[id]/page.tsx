import ServiceEditor from "../_components/ServiceEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;
  return <ServiceEditor serviceId={id} />;
}
