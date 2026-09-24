"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}
const Logo = "/logo.svg";
import { teamMemberService, TeamMember } from "@/services/teamMemberService";
import { journeyService, Journey } from "@/services/journeyService";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="relative text-center mb-12">
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
        {children}
      </h2>
    </div>
  );
}

// ─── Journey Timeline Sub-components ───────────────────────────────────────

/** Null-image fallback: a stylised gradient placeholder with a subtle icon */
function ImagePlaceholder() {
  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{
        aspectRatio: "16/9",
        background: "linear-gradient(135deg, rgba(34,211,238,0.12) 0%, rgba(42,159,176,0.08) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px dashed rgba(34,211,238,0.25)",
      }}
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="rgba(34,211,238,0.4)" />
        <path d="M3 15l5-5 4 4 3-3 6 6" stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function JourneyHorizontalScroll({ journeys, isRtl }: { journeys: Journey[], isRtl: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current || journeys.length === 0) return;

    const cards = gsap.utils.toArray<HTMLElement>('.journey-card');
    const totalSections = cards.length;

    // Prepare all cards for GPU compositing
    gsap.set(cards, { force3D: true });

    // Pre-hide text elements on ALL cards except the first
    cards.forEach((card, i) => {
      const year = card.querySelector<HTMLElement>('[data-journey="year"]');
      const title = card.querySelector<HTMLElement>('[data-journey="title"]');
      const desc = card.querySelector<HTMLElement>('[data-journey="desc"]');
      const line = card.querySelector<HTMLElement>('[data-journey="line"]');
      if (i !== 0) {
        gsap.set([year, title, desc, line], { y: 60, opacity: 0 });
      }
    });

    // Animate the first card's text in on mount
    (() => {
      const card = cards[0];
      const year = card.querySelector<HTMLElement>('[data-journey="year"]');
      const title = card.querySelector<HTMLElement>('[data-journey="title"]');
      const desc = card.querySelector<HTMLElement>('[data-journey="desc"]');
      const line = card.querySelector<HTMLElement>('[data-journey="line"]');
      gsap.fromTo(
        [line, year, title, desc],
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.18, delay: 0.3 }
      );
    })();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 0.5,
        end: () => "+=" + (window.innerHeight * totalSections),
        onUpdate: (self) => {
          const index = Math.min(totalSections - 1, Math.floor(self.progress * totalSections));
          if (index !== activeIndex) {
            setActiveIndex(index);
          }
        }
      }
    });

    cards.forEach((card, i) => {
      if (i === 0) {
        gsap.set(card, { zIndex: 1 });
        return;
      }

      const prevCard = cards[i - 1];
      const newYear  = card.querySelector<HTMLElement>('[data-journey="year"]');
      const newTitle = card.querySelector<HTMLElement>('[data-journey="title"]');
      const newDesc  = card.querySelector<HTMLElement>('[data-journey="desc"]');
      const newLine  = card.querySelector<HTMLElement>('[data-journey="line"]');

      // Start new card offscreen
      gsap.set(card, { xPercent: isRtl ? -100 : 100, zIndex: i + 1 });

      // ── Phase 1: Slide cards (50% of budget)
      tl.to(prevCard, { scale: 0.93, opacity: 0, ease: "power2.inOut", force3D: true }, ">")
        .to(card,     { xPercent: 0,  ease: "power2.inOut", force3D: true }, "<");

      // ── Phase 2: Stagger the text in after the card lands (50% of budget)
      tl.to(newLine,  { y: 0, opacity: 1, ease: "power3.out", force3D: true }, ">");
      tl.to(newYear,  { y: 0, opacity: 1, ease: "power3.out", force3D: true }, "-=0.6");
      tl.to(newTitle, { y: 0, opacity: 1, ease: "power3.out", force3D: true }, "-=0.5");
      tl.to(newDesc,  { y: 0, opacity: 1, ease: "power3.out", force3D: true }, "-=0.5");
    });

  }, { scope: containerRef, dependencies: [journeys, isRtl] });

  return (
    <div ref={containerRef} className="relative mt-12 bg-[#000918]">
      <div className="h-screen w-full flex flex-col items-center justify-center">
        {journeys.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white/5 border border-white/10 rounded-2xl max-w-2xl w-[92vw]">
            <svg className="w-16 h-16 text-[#22D3EE]/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-2">Our Journey is Evolving</h3>
            <p className="text-slate-400">There is no current data available. Check back soon for updates.</p>
          </div>
        ) : (
          <>
            {/* Track — overflow-hidden HERE clips the sliding cards */}
          <div 
            ref={trackRef}
            className="relative w-[92vw] max-w-[1500px] h-[68vh] overflow-hidden rounded-[2rem]"
          >
          {journeys.map((item, index) => (
            <div
              key={item.id}
              className="journey-card absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden border border-white/10 bg-[#000918] shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex flex-col"
              style={{ willChange: "transform, opacity" }}
            >
              {/* Massive Image Background */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="95vw"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              {/* Heavy dark gradient — always visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000918] via-[#000918]/70 to-transparent" />
              </div>

              {/* Content Overlay — clean vertical stack, always fits */}
              <div className="relative z-10 flex-1 flex flex-col justify-end p-6 md:p-10 lg:p-12">
                {/* Decorative top line */}
                <div data-journey="line" className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#22D3EE]/50 to-transparent" />

                {/* Year badge — small pill, never overflows */}
                <div
                  data-journey="year"
                  className="mb-4 inline-flex items-center self-start gap-2 px-4 py-2 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/10 backdrop-blur-sm"
                >
                  <span className="text-[#22D3EE] font-extrabold text-xl md:text-2xl tracking-widest select-none">
                    {item.yearOrDate}
                  </span>
                </div>

                {/* Title */}
                <h3
                  data-journey="title"
                  className="text-white font-bold text-2xl md:text-4xl lg:text-5xl leading-tight mb-3"
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  data-journey="desc"
                  className="text-slate-300 text-sm md:text-base lg:text-lg leading-relaxed max-w-3xl"
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Step Indicators */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20" aria-hidden="true">
          {journeys.map((_, idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${idx === activeIndex ? "bg-[#22D3EE] scale-150 shadow-[0_0_12px_rgba(34,211,238,0.6)]" : "bg-white/20"}`}
            />
          ))}
        </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AboutSection(_props?: { locale?: string }) {
  const { language, direction } = useLanguage();
  const { t } = useTranslation(language);
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(true);
  const [journeyLoading, setJourneyLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [journeyError, setJourneyError] = useState<string | null>(null);


  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setTeamLoading(true);
        setError(null);
        const members = await teamMemberService.getTeamMembers(language, 1, 20);
        setTeamMembers(members);
      } catch (err) {
        console.error("Failed to fetch team members:", err);
        setError(t("about_team_error"));
      } finally {
        setTeamLoading(false);
      }
    };

    const fetchJourneys = async () => {
      try {
        setJourneyLoading(true);
        setJourneyError(null);
        const journeyData = await journeyService.getJourneys(language, 1, 20);
        setJourneys(journeyData);
      } catch (err) {
        console.error("Failed to fetch journeys:", err);
        setJourneyError(t("about_journey_error"));
      } finally {
        setJourneyLoading(false);
      }
    };

    fetchTeamMembers();
    fetchJourneys();
  }, [language]);

  const loading_state = loading || teamLoading || journeyLoading;

  const missionVisionData = [
    { title: t("about_mission_title"), text: t("about_mission_text") },
    { title: t("about_vision_title"), text: t("about_vision_text") }
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#000918] px-5 pb-24 pt-32 text-white sm:px-8 sm:pt-40 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center text-sm font-medium sm:text-base"
        >
          <Link href="/" className="text-white hover:text-[#22D3EE] transition-colors">{t("nav_home")}</Link>
          <span className="mx-2 text-white">{language === "ar" ? "<" : ">"}</span>
          <span className="text-[#22D3EE]">{t("about_breadcrumb")}</span>
        </motion.nav>

        <section className="grid items-center gap-16 lg:grid-cols-[1.1fr_.9fr] lg:gap-12" aria-labelledby="about-heading">
          <motion.div 
            initial={{ opacity: 0, x: direction === "rtl" ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 id="about-heading" className="max-w-[620px] text-3xl font-bold leading-tight sm:text-4xl text-white">
              {t("about_heading")}
            </h1>
            <div className="mt-8 max-w-[650px] space-y-4 text-sm leading-[1.8] text-slate-300 sm:text-base lg:text-[17px]">
              <p>{t("about_description_1")}</p>
              <p>{t("about_description_2")}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto flex h-[280px] w-full max-w-[520px] items-center justify-center sm:h-[360px]"
          >
            <Image 
              src={Logo} 
              alt="Tech Gear" 
              width={180} 
              height={145} 
              className="relative z-10 w-36 object-contain sm:w-48" 
            />
          </motion.div>
        </section>

        <section className="mt-20 grid gap-8 md:grid-cols-2" aria-label="Mission and vision">
          {missionVisionData.map((item, index) => (
            <motion.article 
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + (index * 0.2) }}
              className="flex flex-col gap-6 rounded-3xl bg-white/[0.05] backdrop-blur-xl p-8 sm:p-10 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-colors hover:bg-white/[0.08] hover:border-white/20"
            >
              <div>
                <h2 
                  className="text-[32px] font-medium leading-none text-white"
                  style={{ fontFamily: "'Rubik', sans-serif" }}
                >
                  {item.title}
                </h2>
                <div className="mt-4 h-[3px] w-16 bg-[#22D3EE] rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              </div>
              <p 
                className="text-[20px] font-normal leading-[1.6] text-slate-300"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                {item.text}
              </p>
            </motion.article>
          ))}
        </section>

        <section className="mt-24 sm:mt-32 border-t border-white/10 pt-16" aria-labelledby="team-heading">
          <SectionTitle>{t("about_team_heading")}</SectionTitle>
          {error && (
            <div className="mt-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 border border-red-500/20">
              {error}
            </div>
          )}
          {teamLoading ? (
            <div className="mt-12 flex justify-center py-12">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22D3EE]/20 border-t-[#22D3EE] mx-auto mb-4" />
                <p className="text-slate-400">{t("about_team_loading")}</p>
              </div>
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, index) => (
                <motion.article
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e1a2b] to-[#08111e] p-4 transition-all duration-500 hover:border-[#22D3EE]/40 hover:shadow-[0_12px_40px_rgba(34,211,238,0.12)]"
                >
                  {/* Ambient top border glow on hover */}
                  <div className="pointer-events-none  absolute -inset-px rounded-2xl bg-gradient-to-b from-[#22D3EE]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Image Container */}
                  <div className="relative cursor-pointer aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-900">
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Soft vignette overlay */}
                    <div className="absolute cursor-pointer inset-0 bg-gradient-to-t from-[#08111e]/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-30" />
                  </div>

                  {/* Member Details */}
                  <div className="relative cursor-pointer z-10 flex flex-col pt-5 px-1 pb-2">
                    <h3 className="text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-[#22D3EE]">
                      {member.name}
                    </h3>
                    <p className="mt-1.5 text-xs font-semibold uppercase tracking-widest text-[#22D3EE]/90">
                      {member.jobTitle}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center text-slate-400">{t("about_team_no_data")}</div>
          )}
        </section>

        <section className="mt-24 sm:mt-32 border-t border-white/10 pt-16" aria-labelledby="journey-heading">
          <SectionTitle>{t("about_journey_heading")}</SectionTitle>

          {journeyError && (
            <div className="mt-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 border border-red-500/20">
              {journeyError}
            </div>
          )}

          {journeyLoading ? (
            <div className="mt-12 flex justify-center py-12">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22D3EE]/20 border-t-[#22D3EE] mx-auto mb-4" />
                <p className="text-slate-400">{t("about_journey_loading")}</p>
              </div>
            </div>
          ) : journeys.length > 0 ? (
            <JourneyHorizontalScroll journeys={journeys} isRtl={direction === "rtl"} />
          ) : (
            <div className="mt-12 text-center text-slate-400">{t("about_journey_no_data")}</div>
          )}
        </section>

        <section className="mt-24 rounded-2xl border border-white/10 bg-white/[0.04] p-7 sm:mt-32 sm:p-10 lg:flex lg:items-center lg:justify-between lg:px-14" aria-label="Contact call to action">
          <h2 className="max-w-xl text-center text-3xl font-bold leading-tight sm:text-4xl">{t("about_cta_heading")}</h2>
          <Link href="/contactus" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#22D3EE] px-8 py-3.5 text-sm font-bold !text-[#011022] transition-transform hover:scale-105 lg:mt-0">{t("footer_contact_us")} <ArrowUpRight size={17} className="!text-[#011022]" /></Link>
        </section>
      </div>
    </main>
  );
}