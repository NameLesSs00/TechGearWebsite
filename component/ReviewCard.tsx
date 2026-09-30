"use client";

import { Quote, Play, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export interface ReviewCardData {
  id: string;
  name: string;
  quote: string;
  rating: number;
  videoUrl: string;
  heroImageUrl: string;
  clientImageUrl: string;
  iconImageUrl: string;
}

interface ReviewCardProps {
  review: ReviewCardData;
  index: number;
}

export default function ReviewCard({ review, index }: ReviewCardProps) {
  const { direction } = useLanguage();
  const stars = Math.min(5, Math.max(0, Math.round(review.rating)));
  const initials = review.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const handleVideoClick = () => {
    if (review.videoUrl) {
      window.open(review.videoUrl, "_blank", "noopener,noreferrer");
    }
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < full ? "text-amber-400 fill-amber-400" : "text-amber-400/30 fill-amber-400/30"
        }
      />
    ));
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      dir={direction}
      className="overflow-hidden flex flex-col h-full rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(34,211,238,0.08)] bg-white"
    >
      {/* TOP — Hero / Video cover */}
      <div className="relative min-h-[240px] sm:min-h-[280px] lg:min-h-[320px] shrink-0 bg-[#050f20] overflow-hidden">
        {/* Hero image */}
        {review.heroImageUrl && (
          <img
            src={review.heroImageUrl}
            alt={`${review.name} project`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000c24]/80 via-[#000c24]/20 to-transparent" />

        {/* Play button */}
        {review.videoUrl && (
          <button
            type="button"
            aria-label="Play testimonial video"
            onClick={handleVideoClick}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group"
          >
            <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-transform group-hover:scale-110 shadow-[0_0_40px_rgba(34,211,238,0.3)]">
              <div className="absolute inset-0 rounded-full bg-[#22D3EE]/20 animate-ping opacity-60" />
              <Play size={24} fill="white" className="text-white ml-1.5" />
            </div>
          </button>
        )}
      </div>

      {/* BOTTOM — Content (white bg) */}
      <div className="flex flex-col justify-between flex-grow p-6 sm:p-8 lg:p-10 bg-white">
        <div>
          {/* Icon above quote */}
          <div className="mb-6">
            {review.iconImageUrl ? (
              <img
                src={review.iconImageUrl}
                alt="company icon"
                className="h-12 w-auto max-w-[180px] object-contain"
              />
            ) : (
              <Quote className="w-12 h-12 text-black/10 rotate-180" />
            )}
          </div>

          {/* Quote text */}
          <blockquote className="text-base sm:text-lg lg:text-xl leading-relaxed font-medium text-[#14203a]">
            &ldquo;{review.quote}&rdquo;
          </blockquote>
        </div>

        {/* Client info */}
        <div className="mt-6 pt-6 border-t border-black/10">
          <div className="flex items-center gap-4">
            {/* Large client photo */}
            <div className="shrink-0">
              {review.clientImageUrl ? (
                <img
                  src={review.clientImageUrl}
                  alt={review.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#22D3EE]/30 shadow-lg"
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#22D3EE]/20 to-[#22D3EE]/5 border border-[#22D3EE]/20 flex items-center justify-center text-xl sm:text-2xl font-bold text-[#22D3EE]">
                  {initials}
                </div>
              )}
            </div>

            {/* Name + stars */}
            <div>
              <p className="text-base sm:text-lg font-bold text-[#14203a]">{review.name}</p>
              <div className="flex items-center gap-1 mt-1.5">
                {renderStars(review.rating)}
                <span className="ml-2 text-xs sm:text-sm font-semibold text-amber-500">
                  {review.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
