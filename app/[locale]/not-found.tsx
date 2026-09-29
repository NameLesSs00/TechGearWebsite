import NotFoundContent from "@/component/NotFoundContent";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "404 - Page Not Found | Tech Gear Solutions",
  description: "The page you are looking for does not exist or has been moved.",
  noIndex: true,
});

export default function LocaleNotFound() {
  return <NotFoundContent />;
}
