import FaqForm from "../_FaqForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFaqPage({ params }: PageProps) {
  const { id } = await params;
  return <FaqForm id={id} />;
}

