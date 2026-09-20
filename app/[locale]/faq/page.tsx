import FaqSection from "@/component/FaqSection";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Tech Gear Solutions | FAQ",
  description: "Find answers to frequently asked questions about our web development, mobile app, and digital marketing services.",
  path: "/faq",
});

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;

  return (
    <main className="flex-1 bg-[#000918] pt-16 min-h-[70vh]">
      <FaqSection locale={locale} limit={100} />
    </main>
  );
}
