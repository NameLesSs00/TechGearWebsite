import type { Metadata } from "next";
import ReviewsPageContent from "@/component/ReviewsPageContent";

export const metadata: Metadata = {
  title: "Client Reviews | Tech Gear Solutions",
  description:
    "Read what our clients say about working with Tech Gear Solutions. Real reviews from businesses we have helped grow through technology.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params;
  return <ReviewsPageContent locale={locale} />;
}