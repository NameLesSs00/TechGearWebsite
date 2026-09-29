import JourneyForm from "../../_components/JourneyForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJourneyPage({ params }: PageProps) {
  const { id } = await params;
  return <JourneyForm id={id} />;
}
