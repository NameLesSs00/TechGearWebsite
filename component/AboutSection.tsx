"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const Logo = "/logo.svg";
import { teamMemberService, TeamMember } from "@/services/teamMemberService";
import { journeyService, Journey } from "@/services/journeyService";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="relative text-center mb-16 flex flex-col items-center">
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
        {children}
      </h2>
      <div className="mt-4 h-1 w-16 bg-[#56C1C8] rounded-full" />
    </div>
  );
}

// ─── Journey Timeline Sub-components ───────────────────────────────────────

function getYearOnly(val: string): string {
  if (!val) return "";
  const match = val.match(/\b(19\d{2}|20\d{2})\b/);
  if (match) return match[0];
  if (val.includes("-")) return val.split("-")[0].trim();
  if (val.includes("/")) return val.split("/")[0].trim();
  return val;
}

function JourneyVerticalTimeline({ journeys, isRtl }: { journeys: Journey[], isRtl: boolean }) {
  const [screenWidth, setScreenWidth] = useState<number>(1200);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (journeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-white/5 border border-white/10 rounded-2xl max-w-2xl mx-auto w-full mt-12">
        <svg className="w-16 h-16 text-[#56C1C8]/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-2xl font-bold text-white mb-2">Our Journey is Evolving</h3>
        <p className="text-slate-400">There is no current data available. Check back soon for updates.</p>
      </div>
    );
  }

  const N = journeys.length;
  const isMobile = screenWidth < 640;
  const isTablet = screenWidth >= 640 && screenWidth < 1024;

  // Enlarged number circle nodes
  const nodeSize = isMobile ? 66 : isTablet ? 86 : 102;

  // Spacing between items vertically
  let itemSpacing = isMobile ? 180 : isTablet ? 220 : 250;
  
  // Base radius and negative horizontal offset so circle comes out of the screen
  let baseRadius = isMobile ? 200 : isTablet ? 340 : 480;
  let xCenterOffset = isMobile ? -40 : isTablet ? -80 : -120;

  if (N <= 2) {
    baseRadius = isMobile ? 180 : isTablet ? 320 : 440;
    itemSpacing = isMobile ? 180 : isTablet ? 220 : 250;
    xCenterOffset = isMobile ? -40 : isTablet ? -80 : -110;
  } else if (N >= 4) {
    itemSpacing = isMobile ? 160 : isTablet ? 190 : 210;
    baseRadius = isMobile ? 240 : isTablet ? 420 : 580;
    xCenterOffset = isMobile ? -50 : isTablet ? -100 : -140;
  }

  const deltaYMax = N > 1 ? ((N - 1) / 2) * itemSpacing : 0;
  const R = Math.max(baseRadius, Math.round(deltaYMax * 1.35));
  const containerHeight = Math.max(2 * R + 80, N * itemSpacing + 140);
  const Y_center = containerHeight / 2;

  return (
    <div 
      className="relative mt-8 w-full overflow-hidden"
      style={{ height: `${containerHeight}px` }}
    >
      {/* Background Half-Circle Div coming out of the screen */}
      <div 
        className="absolute rounded-full pointer-events-none"
        style={{
          width: `${2 * R}px`,
          height: `${2 * R}px`,
          border: "2px solid #334155",
          [isRtl ? "right" : "left"]: `${xCenterOffset - R}px`,
          top: `${Y_center - R}px`,
        }}
      />

      {/* Journey Nodes & Cards */}
      {journeys.map((item, index) => {
        // Position items starting from top down
        let deltaY: number;
        if (N === 1) {
          deltaY = 0;
        } else if (N === 2) {
          deltaY = index === 0 ? -170 : 80;
        } else {
          deltaY = (index - (N - 1) / 2) * itemSpacing;
        }

        const y = Math.round(Y_center + deltaY);
        const x = Math.round(xCenterOffset + Math.sqrt(Math.max(0, R * R - deltaY * deltaY)));

        return (
          <div
            key={item.id}
            className="absolute flex items-center -translate-y-1/2 z-10"
            style={{
              top: `${y}px`,
              [isRtl ? "right" : "left"]: `${x - Math.round(nodeSize / 2)}px`,
            }}
          >
            {/* Appear sequentially from top down */}
            <motion.div
              initial={{ opacity: 0, y: -45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.25, ease: "easeOut" }}
              dir="ltr"
              className="flex items-center"
              style={{ flexDirection: isRtl ? "row-reverse" : "row" }}
            >
              {/* Glowing Number Circle Node */}
              <div 
                className="relative flex-shrink-0 rounded-full flex items-center justify-center bg-[#1a3d47]/85 backdrop-blur-md border-2 border-[#56C1C8]/60 transition-all duration-300"
                style={{ 
                  width: `${nodeSize}px`, 
                  height: `${nodeSize}px`,
                  boxShadow: "0 0 25px rgba(86, 193, 200, 0.45), 0 0 50px rgba(86, 193, 200, 0.2), inset 0 0 15px rgba(86, 193, 200, 0.25)"
                }}
              >
                {/* Subtle Ambient Pulse Aura */}
                <div className="absolute -inset-1.5 rounded-full bg-[#56C1C8]/25 blur-md pointer-events-none animate-pulse" />

                {/* Inner Glowing Turquoise Circle */}
                <div 
                  className="relative z-10 rounded-full bg-gradient-to-br from-[#5ae2ec] to-[#36b2be] flex items-center justify-center"
                  style={{ 
                    width: `${Math.round(nodeSize * 0.7)}px`, 
                    height: `${Math.round(nodeSize * 0.7)}px`,
                    boxShadow: "0 0 16px rgba(86, 193, 200, 0.7), 0 0 32px rgba(34, 211, 238, 0.35)"
                  }}
                >
                  <span 
                    className="text-white font-semibold text-xl sm:text-2xl md:text-3xl drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" 
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {index + 1}
                  </span>
                </div>
              </div>

              {/* Content Card */}
              <div 
                className={`bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-7 md:p-8 shadow-2xl shadow-black/25 text-slate-900 ${
                  isRtl ? 'mr-5 sm:mr-7 md:mr-9 text-right' : 'ml-5 sm:ml-7 md:ml-9 text-left'
                }`}
                style={{
                  maxWidth: isMobile ? "calc(100vw - 150px)" : isTablet ? "380px" : "480px",
                  width: isMobile ? "calc(100vw - 150px)" : isTablet ? "380px" : "480px",
                }}
              >
                <div 
                  className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#0B132B] tracking-normal" 
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {getYearOnly(item.yearOrDate)}
                </div>
                {item.title && (
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mt-2">
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className="text-slate-500 text-xs sm:text-sm md:text-base leading-relaxed mt-2 font-normal">
                    {item.description}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

export default function AboutSection(props?: { locale?: string }) {
  const { language, direction } = useLanguage();
  const { t } = useTranslation(language);
  const locale = props?.locale || language;
  
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
    <main className="min-h-screen overflow-hidden bg-[#000918] pb-24 pt-32 text-white sm:pt-40">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center text-sm font-medium sm:text-base"
        >
          <Link href={`/${locale}`} className="text-white hover:text-[#22D3EE] transition-colors">{t("nav_home")}</Link>
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
                  className="flex flex-col overflow-hidden rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.06] hover:border-white/20"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-900/50 flex items-center justify-center">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-white/30">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Member Details */}
                  <div className="flex flex-col items-center text-center p-6 md:p-8">
                    <h3 className="text-2xl font-bold tracking-tight text-white">
                      {member.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-[#22D3EE]">
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
      </div>

      {/* Full-width Journey Section - Circle comes out from the screen edge */}
      <section className="mt-24 sm:mt-32 border-t border-white/10 pt-16 relative w-full overflow-hidden" aria-labelledby="journey-heading">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
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
          ) : journeys.length === 0 ? (
            <div className="mt-12 text-center text-slate-400">{t("about_journey_no_data")}</div>
          ) : null}
        </div>

        {!journeyLoading && journeys.length > 0 && (
          <JourneyVerticalTimeline journeys={journeys} isRtl={direction === "rtl"} />
        )}
      </section>

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <section className="mt-24 rounded-2xl border border-white/10 bg-white/[0.04] p-7 sm:mt-32 sm:p-10 lg:flex lg:items-center lg:justify-between lg:px-14" aria-label="Contact call to action">
          <h2 className="max-w-xl text-center text-3xl font-bold leading-tight sm:text-4xl">{t("about_cta_heading")}</h2>
          <Link href={`/${locale}/contactus`} className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#22D3EE] px-8 py-3.5 text-sm font-bold !text-[#011022] transition-transform hover:scale-105 lg:mt-0">{t("footer_contact_us")} <ArrowUpRight size={17} className="!text-[#011022]" /></Link>
        </section>
      </div>
    </main>
  );
}
