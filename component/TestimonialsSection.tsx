"use client";

import { ChevronLeft, ChevronRight, Play, Star, X, Quote } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { reviewService } from "@/services/reviewService";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: number;
  videoUrl: string;
  heroImageUrl: string;   // hero_image — large background / video cover
  clientImageUrl: string; // client_image — large portrait / avatar
  iconImageUrl: string;   // icon_image — small brand/company icon
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: "fallback-1",
    name: "Sameer Rai",
    quote: "Tech Gear understood what we needed and turned our vision into a digital experience that feels clear, professional, and easy to use.",
    rating: 4.8,
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    heroImageUrl: "",
    clientImageUrl: "",
    iconImageUrl: "",
  },
  {
    id: "fallback-2",
    name: "Mariam Hassan",
    quote: "The team brought structure to a complex project and delivered a thoughtful product that our customers enjoy using every day.",
    rating: 5.0,
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    heroImageUrl: "",
    clientImageUrl: "",
    iconImageUrl: "",
  },
];

const toEmbedUrl = (videoUrl: string) => {
  if (!videoUrl) return "";
  if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
    try {
      const url = new URL(videoUrl);
      const videoId = url.searchParams.get("v") || url.pathname.split("/").filter(Boolean).at(-1);
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return videoUrl;
    }
  }
  return videoUrl;
};

export default function TestimonialsSection(_props?: { locale?: string }) {
  const { language, direction } = useLanguage();
  const { t } = useTranslation(language);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadTestimonials = async () => {
      try {
        const reviews = await reviewService.getReviews(language, 1, 20);
        const mapped: Testimonial[] = reviews.length > 0
          ? reviews.map((review) => ({
              id: review.id,
              name: review.clientName || "Client",
              quote: review.reviewContent || "We are proud to help businesses move forward with confidence.",
              rating: review.stars || 5,
              videoUrl: review.videoUrl || "",
              heroImageUrl: review.hero_image || "",
              clientImageUrl: review.client_image || "",
              iconImageUrl: review.icon_image || "",
            }))
          : fallbackTestimonials;

        if (isMounted) {
          setTestimonials(mapped);
          setActiveIndex(0);
        }
      } catch {
        if (isMounted) setTestimonials(fallbackTestimonials);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadTestimonials();
    return () => { isMounted = false; };
  }, [language]);

  const testimonial = testimonials[activeIndex] ?? fallbackTestimonials[0];
  const activeVideoUrl = useMemo(() => toEmbedUrl(testimonial?.videoUrl || ""), [testimonial?.videoUrl]);

  const move = (dir: number) => {
    if (testimonials.length === 0) return;
    setActiveIndex((current) => (current + dir + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < full ? "text-amber-400 fill-amber-400" : "text-amber-400/30 fill-amber-400/30"}
      />
    ));
  };

  return (
    <section dir={direction} className="relative overflow-hidden bg-[#000918] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-12" aria-labelledby="testimonials-heading">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22D3EE]/[0.05] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1100px]">
        {/* Header */}
        <header className="text-center mb-16">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.32em] text-[#22D3EE] sm:text-sm sm:tracking-[0.42em]">{t("testimonials_label")}</p>
          <h2 id="testimonials-heading" className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{t("testimonials_heading")}</h2>
          <span className="mx-auto mt-5 block h-1.5 w-24 rounded-full bg-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.6)]" aria-hidden="true" />
        </header>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22D3EE]/20 border-t-[#22D3EE]" />
          </div>
        ) : (
          <div className="relative">
            {/* Card */}
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
              <div className="grid lg:grid-cols-[1fr_1.1fr]">

                {/* LEFT — Hero / Video cover */}
                <div className="relative min-h-[280px] sm:min-h-[380px] lg:min-h-[460px] bg-[#050f20] overflow-hidden">
                  {/* Hero image */}
                  {testimonial.heroImageUrl && (
                    <img
                      src={testimonial.heroImageUrl}
                      alt={`${testimonial.name} project`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000c24]/80 via-[#000c24]/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#000c24]/60 hidden lg:block" />

                  {/* Play button */}
                  {testimonial.videoUrl && (
                    <button
                      type="button"
                      aria-label="Play testimonial video"
                      onClick={() => setSelectedVideoUrl(activeVideoUrl || testimonial.videoUrl)}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group"
                    >
                      <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-transform group-hover:scale-110 shadow-[0_0_40px_rgba(34,211,238,0.3)]">
                        <div className="absolute inset-0 rounded-full bg-[#22D3EE]/20 animate-ping opacity-60" />
                        <Play size={28} fill="white" className="text-white ml-1.5" />
                      </div>
                    </button>
                  )}


                </div>

                {/* RIGHT — Content (white bg) */}
                <div className="flex flex-col justify-between p-8 sm:p-10 lg:p-12 bg-white">
                  <div>
                    {/* Icon above quote — shows icon_image in original color on white, falls back to Quote mark */}
                    <div className="mb-8">
                      {testimonial.iconImageUrl ? (
                        <img
                          src={testimonial.iconImageUrl}
                          alt="company icon"
                          className="h-16 w-auto max-w-[200px] object-contain"
                        />
                      ) : (
                        <Quote className="w-14 h-14 text-black/10 rotate-180" />
                      )}
                    </div>

                    {/* Quote text */}
                    <blockquote className="text-lg sm:text-xl lg:text-2xl leading-relaxed font-medium text-[#14203a]">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                  </div>

                  {/* Client info */}
                  <div className="mt-8 pt-8 border-t border-black/10">
                    <div className="flex items-center gap-5">
                      {/* Large client photo */}
                      <div className="shrink-0">
                        {testimonial.clientImageUrl ? (
                          <img
                            src={testimonial.clientImageUrl}
                            alt={testimonial.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#22D3EE]/30 shadow-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#22D3EE]/20 to-[#22D3EE]/5 border border-[#22D3EE]/20 flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#22D3EE]">
                            {testimonial.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Name + stars */}
                      <div>
                        <p className="text-lg sm:text-xl font-bold text-[#14203a]">{testimonial.name}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {renderStars(testimonial.rating)}
                          <span className="ml-2 text-sm font-semibold text-amber-500">{testimonial.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dot navigation */}
                    {testimonials.length > 1 && (
                      <div className="flex items-center gap-2 mt-8">
                        {testimonials.map((item, index) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Show testimonial from ${item.name}`}
                            className={`rounded-full transition-all duration-300 ${
                              activeIndex === index
                                ? "w-8 h-2.5 bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                                : "w-2.5 h-2.5 bg-black/15 hover:bg-black/30"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow navigation */}
            {testimonials.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="Previous testimonial"
                  className="absolute -left-5 top-1/2 -translate-y-1/2 hidden sm:flex w-11 h-11 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#22D3EE]/20 hover:border-[#22D3EE]/40 transition-all"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label="Next testimonial"
                  className="absolute -right-5 top-1/2 -translate-y-1/2 hidden sm:flex w-11 h-11 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#22D3EE]/20 hover:border-[#22D3EE]/40 transition-all"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Video modal */}
      {selectedVideoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setSelectedVideoUrl(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#020b17] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close video"
              onClick={() => setSelectedVideoUrl(null)}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            >
              <X size={20} />
            </button>
            {selectedVideoUrl.includes("youtube.com") ? (
              <div className="aspect-video w-full">
                <iframe
                  src={selectedVideoUrl}
                  title="Testimonial video"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <video src={selectedVideoUrl} controls autoPlay className="aspect-video w-full bg-black" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
