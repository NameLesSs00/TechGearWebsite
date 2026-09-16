import Link from "next/link";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "404 - Page Not Found | Tech Gear Solutions",
  description: "The page you are looking for does not exist or has been moved.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#000918] px-5 py-32 text-center text-white flex flex-col items-center justify-center">
      <div className="mx-auto max-w-md">
        <h1 className="text-8xl font-extrabold text-[#22D3EE] drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
          404
        </h1>
        <h2 className="mt-6 text-2xl font-bold sm:text-3xl">Page Not Found</h2>
        <p className="mt-4 text-base text-slate-300">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-[#22D3EE] px-7 py-3 text-sm font-bold text-[#00121F] transition-transform hover:scale-105"
          >
            Back to Home
          </Link>
          <Link
            href="/work"
            className="rounded-full border border-[#22D3EE] px-7 py-3 text-sm font-semibold text-[#22D3EE] transition-colors hover:bg-[#22D3EE]/10"
          >
            Explore Projects
          </Link>
        </div>
      </div>
    </main>
  );
}
