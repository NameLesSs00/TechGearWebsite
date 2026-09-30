"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { reviewService } from "@/services/reviewService";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";
import ReviewCard, { ReviewCardData } from "./ReviewCard";

interface ReviewsPageContentProps {
  locale: string;
}

export default function ReviewsPageContent({ locale }: ReviewsPageContentProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [reviews, setReviews] = useState<ReviewCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await reviewService.getReviews(language, 1, 50);
        if (isMounted) {
          setReviews(
            data.map((r) => ({
              id: r.id,
              name: r.clientName || "Client",
              quote: r.reviewContent || "",
              rating: r.stars || 5,
              videoUrl: r.videoUrl || "",
              heroImageUrl: r.hero_image || "",
              clientImageUrl: r.client_image || "",
              iconImageUrl: r.icon_image || "",
            }))
          );
        }
      } catch {
        if (isMounted) setReviews([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [language]);

  return (
    <main className="min-h-screen bg-[#000918] px-5 pb-24 pt-32 text-white sm:px-8 sm:pt-36 lg:px-12">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 h-[min(120vw,1100px)] w-[min(120vw,1100px)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08)_0%,rgba(34,211,238,0.04)_45%,transparent_75%)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1100px]">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center text-sm font-medium sm:text-base"
        >
          <Link
            href={`/${locale}`}
            className="text-white transition-colors hover:text-[#22D3EE]"
          >
            {t("nav_home")}
          </Link>
          <span className="mx-2 text-white">
            {language === "ar" ? "<" : ">"}
          </span>
          <span className="text-[#22D3EE]">{t("reviews_breadcrumb")}</span>
        </motion.nav>

        {/* Page header */}
        <header className="mb-16 text-center sm:mb-20">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.32em] text-[#22D3EE] sm:text-sm sm:tracking-[0.42em]">
            {t("reviews_label")}
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t("reviews_heading")}
          </h1>
          <span
            className="mx-auto mt-6 block h-1.5 w-24 rounded-full bg-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.6)]"
            aria-hidden="true"
          />
        </header>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#22D3EE]/20 border-t-[#22D3EE]" />
          </div>
        )}

        {/* Empty state */}
        {!loading && reviews.length === 0 && (
          <div className="mt-12 text-center text-slate-400">
            {t("reviews_no_reviews")}
          </div>
        )}

        {/* Reviews List */}
        {!loading && reviews.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            {reviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
