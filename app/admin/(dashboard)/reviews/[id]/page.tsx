import ReviewEditor from "../_components/ReviewEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReviewPage({ params }: PageProps) {
  const { id } = await params;
  return <ReviewEditor reviewId={id} />;
}
