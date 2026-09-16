"use client";

import { ChevronLeft, ChevronRight, Play, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { reviewService, type ReviewApiItem } from "@/services/reviewService";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: string;
  videoUrl: string;
  coverImageUrl: string;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: "fallback-1",
    name: "Sameer Rai",
    quote: "Tech Gear understood what we needed and turned our vision into a digital experience that feels clear, professional, and easy to use.",
    rating: "4.8",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    coverImageUrl: "",
  },
  {
    id: "fallback-2",
    name: "Mariam Hassan",
    quote: "The team brought structure to a complex project and delivered a thoughtful product that our customers enjoy using every day.",
    rating: "5.0",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    coverImageUrl: "",
  },
];

const toEmbedUrl = (videoUrl: string) => {
  if (!videoUrl) {
    return "";
  }

  if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
    try {
      const url = new URL(videoUrl);
      const videoId = url.searchParams.get("v") || url.pathname.split("/").filter(Boolean).at(-1);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
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
              rating: `${review.stars || 5}.0`,
              videoUrl: review.videoUrl || "",
              coverImageUrl: review.coverImageUrl || review.coverImage || "",
            }))
          : fallbackTestimonials;

        if (isMounted) {
          setTestimonials(mapped);
          setActiveIndex(0);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        if (isMounted) {
          setTestimonials(fallbackTestimonials);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTestimonials();

    return () => {
      isMounted = false;
    };
  }, [language]);

  const testimonial = testimonials[activeIndex] ?? fallbackTestimonials[0];
  const activeVideoUrl = useMemo(() => toEmbedUrl(testimonial?.videoUrl || ""), [testimonial?.videoUrl]);

  const move = (direction: number) => {
    if (testimonials.length === 0) {
      return;
    }

    setActiveIndex((current) => (current + direction + testimonials.length) % testimonials.length);
  };

  return (
    <section dir={direction} className="relative overflow-hidden bg-[#000918] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-28" aria-labelledby="testimonials-heading">
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-[58%] h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.10)_0%,rgba(34,211,238,0.07)_25%,rgba(34,211,238,0.035)_45%,rgba(34,211,238,0.015)_62%,transparent_80%)] blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-1/2 -z-0 h-64 w-[min(850px,95vw)] -translate-x-1/2 rounded-full bg-[#22D3EE]/[0.05] blur-3xl" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-[1100px]">
        <header className="text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.32em] text-[#22D3EE] sm:text-sm sm:tracking-[0.42em]">{t("testimonials_label")}</p>
          <h2 id="testimonials-heading" className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{t("testimonials_heading")}</h2>
          <span className="mx-auto mt-4 block h-1.5 w-24 rounded-full bg-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.6)] sm:mt-5 sm:w-28" aria-hidden="true" />
        </header>

        {loading ? (
          <div className="mt-20 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22D3EE]/20 border-t-[#22D3EE]" />
          </div>
        ) : (
          <>
            <div className="relative mt-20 sm:mt-20">
              <span className="absolute -left-1 -top-10 font-serif text-[clamp(4rem,12vw,8rem)] leading-none text-transparent [-webkit-text-stroke:1px_white] sm:-left-2 sm:-top-16 md:-left-4 md:-top-20 md:[-webkit-text-stroke:2px_white]" aria-hidden="true">&ldquo;</span>
              <span className="absolute -bottom-10 -right-1 rotate-180 font-serif text-[clamp(4rem,12vw,8rem)] leading-none text-transparent [-webkit-text-stroke:1px_white] sm:-bottom-16 sm:-right-2 md:-bottom-20 md:-right-4 md:[-webkit-text-stroke:2px_white]" aria-hidden="true">&ldquo;</span>

              <div className="grid overflow-hidden rounded-xl border border-white/15 bg-white p-3 text-[#14203a] shadow-[0_0_25px_rgba(34,211,238,0.08)] sm:rounded-2xl sm:p-7 lg:grid-cols-[1fr_1fr] lg:gap-7 lg:p-7">
                <div className="relative min-h-[190px] overflow-hidden rounded-lg bg-[#152532] sm:min-h-[340px] sm:rounded-xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.22),_rgba(17,24,39,0.92)_55%)]" />
                  {testimonial.coverImageUrl && (
                    <img
                      src={testimonial.coverImageUrl}
                      alt={`${testimonial.name} testimonial`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center text-center text-sm font-semibold uppercase tracking-[0.28em] text-white/80">
                    {!testimonial.coverImageUrl && testimonial.name}
                  </div>

                  {testimonial.videoUrl ? (
                    <button
                      type="button"
                      aria-label="Play testimonial video"
                      onClick={() => setSelectedVideoUrl(activeVideoUrl || testimonial.videoUrl)}
                      className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#1d5be1] shadow-xl transition-transform hover:scale-110"
                    >
                      <Play size={25} fill="currentColor" className="ml-1" />
                    </button>
                  ) : null}
                </div>

                <div className="flex flex-col justify-center px-2 py-6 sm:px-5 lg:py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#d9e7e8] text-base font-bold text-[#0c5660] sm:h-12 sm:w-12 sm:text-lg">{testimonial.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-bold text-[#171454] sm:text-base">{testimonial.name}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#10152c] sm:text-sm">
                        <Star size={13} fill="#f9c52d" className="text-[#f9c52d]" /> {testimonial.rating}
                      </p>
                    </div>
                  </div>

                  <blockquote className="mt-6 text-sm leading-relaxed text-[#686a91] sm:mt-8 sm:text-base lg:text-lg">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                </div>
              </div>

              <button type="button" onClick={() => move(-1)} aria-label="Previous testimonial" className="absolute -left-16 top-1/2 hidden h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-[#e9ebff] text-[#2563eb] shadow-lg transition-transform hover:scale-110 sm:grid hover:bg-[#10EDFD] hover:text-white"><ChevronLeft size={26} /></button>
              <button type="button" onClick={() => move(1)} aria-label="Next testimonial" className="absolute -right-16 top-1/2 hidden h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-[#e9ebff] text-[#2563eb] shadow-lg transition-transform hover:scale-110 hover:bg-[#10EDFD] hover:text-white sm:grid"><ChevronRight size={26} /></button>
            </div>

            <div className="mt-14 flex justify-center gap-3 sm:mt-12" aria-label="Testimonial navigation">
              {testimonials.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show testimonial from ${item.name}`}
                  aria-current={activeIndex === index}
                  className={`h-3 w-3 rounded-full transition-all ${activeIndex === index ? "scale-125 bg-[#22D3EE]" : "bg-[#71808a] hover:bg-white"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedVideoUrl(null)}>
          <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#020b17] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              aria-label="Close video"
              onClick={() => setSelectedVideoUrl(null)}
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
            >
              <X size={20} />
            </button>

            {selectedVideoUrl.includes("youtube.com") || selectedVideoUrl.includes("youtu.be") ? (
              <div className="aspect-video w-full">
                <iframe
                  src={selectedVideoUrl}
                  title="Testimonial video"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
