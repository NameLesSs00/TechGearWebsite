"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

// Journey timeline layout constants
const STEP_H = 3000;       // Spacing between steps
const C_SIZE = 120;        // Circle diameter

const circlePositions = [
  { left: 130, top: 0 },
  { left: 590, top: 200 },
  { left: 510, top: 410 },
  { left: 30, top: 540 },
];

const circlePositionsMedium = [
  { left: 80, top: 0 },
  { left: 480, top: 180 },
  { left: 440, top: 360 },
  { left: 90, top: 530 },
];

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
            <>
              {/* ── Large desktop timeline (lg+): absolute positioned C-curve ── */}
              <div
                className="relative ml-[-50px] mt-14 hidden lg:block"
                style={{ height: "730px", maxWidth: "900px" }}
              >
                <svg
                  className="pointer-events-none absolute inset-0"
                  width="900"
                  height="730"
                  style={{ overflow: "visible", zIndex: 1 }}
                  aria-hidden="true"
                >
                  {/* Static background arc */}
                  <path
                    d="M -64 30 A 499 199 0 0 1 -64 610"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="3"
                  />
                  {/* Scroll draw reveal arc */}
                  <motion.path
                    d="M -64 30 A 499 199 0 0 1 -64 610"
                    fill="none"
                    stroke="rgba(34, 211, 238, 0.4)"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  {/* Continuous flowing dash arc */}
                  <motion.path
                    d="M -64 30 A 499 199 0 0 1 -64 610"
                    fill="none"
                    stroke="rgba(34, 211, 238, 0.8)"
                    strokeWidth="3"
                    strokeDasharray="10 14"
                    strokeLinecap="round"
                    animate={{ strokeDashoffset: [0, -48] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                </svg>

                {journeys.slice(0, 4).map((item, index) => {
                  const pos = circlePositions[index] || { left: 30, top: 40 };
                  const cardLeft = pos.left + C_SIZE + 24;
                  return (
                    <motion.div
                      key={item.id}
                      style={{ position: "absolute", top: `${pos.top}px`, left: 0, right: 0 }}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                    >
                      {/* Outer continuous rotating ring ("always turned") */}
                      <motion.div
                        style={{
                          position: "absolute",
                          left: `${pos.left - 12}px`,
                          top: "-12px",
                          width: `${C_SIZE + 24}px`,
                          height: `${C_SIZE + 24}px`,
                          borderRadius: "9999px",
                          border: "2px dashed rgba(34, 211, 238, 0.45)",
                          zIndex: 1,
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                      />

                      {/* Teal circle with glow ring */}
                      <div
                        style={{
                          position: "absolute",
                          left: `${pos.left}px`,
                          top: 0,
                          width: `${C_SIZE}px`,
                          height: `${C_SIZE}px`,
                          borderRadius: "9999px",
                          background: "linear-gradient(135deg, #3fc1d1 0%, #2a9fb0 100%)",
                          boxShadow: "0 0 0 9px rgba(47,170,190,0.22), 0 0 0 16px rgba(47,170,190,0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                          fontWeight: "800",
                          color: "white",
                          zIndex: 2,
                        }}
                      >
                        {index + 1}
                      </div>

                      {/* White content card */}
                      <motion.div
                        style={{
                          position: "absolute",
                          left: `${cardLeft}px`,
                          top: "4px",
                          width: "220px",
                          background: "white",
                          borderRadius: "14px",
                          padding: "16px 20px 18px",
                          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                          zIndex: 2,
                        }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h3 className="text-lg font-extrabold leading-tight sm:text-xl" style={{ color: "#0a0e1a", margin: 0 }}>
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed sm:text-sm" style={{ color: "#64748b" }}>
                          {item.description}
                        </p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ── Medium screen timeline (sm to lg): explicit positions ── */}
              <div
                className="relative mr-auto mt-14 hidden sm:block lg:hidden"
                style={{ height: "650px", maxWidth: "680px" }}
              >
                <svg
                  className="pointer-events-none absolute inset-0"
                  width="680"
                  height="650"
                  style={{ overflow: "visible", zIndex: 1 }}
                  aria-hidden="true"
                >
                  {/* Static background arc */}
                  <path
                    d="M -40 20 A 350 180 0 0 1 -40 580"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="2.5"
                  />
                  {/* Scroll draw reveal arc */}
                  <motion.path
                    d="M -40 20 A 350 180 0 0 1 -40 580"
                    fill="none"
                    stroke="rgba(34, 211, 238, 0.4)"
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  {/* Continuous flowing dash arc */}
                  <motion.path
                    d="M -40 20 A 350 180 0 0 1 -40 580"
                    fill="none"
                    stroke="rgba(34, 211, 238, 0.8)"
                    strokeWidth="2.5"
                    strokeDasharray="8 12"
                    strokeLinecap="round"
                    animate={{ strokeDashoffset: [0, -40] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                </svg>

                {journeys.slice(0, 4).map((item, index) => {
                  const pos = circlePositionsMedium[index] || { left: 30, top: 40 };
                  const mdCircle = 90; // circle diameter for medium screen
                  const isFarRight = pos.left > 250;
                  const cardLeft = isFarRight
                    ? pos.left - 190 - 14
                    : pos.left + mdCircle + 14;

                  return (
                    <motion.div
                      key={item.id}
                      style={{ position: "absolute", top: `${pos.top}px`, left: 0, right: 0 }}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                    >
                      {/* Outer continuous rotating ring ("always turned") */}
                      <motion.div
                        style={{
                          position: "absolute",
                          left: `${pos.left - 10}px`,
                          top: "-10px",
                          width: `${mdCircle + 20}px`,
                          height: `${mdCircle + 20}px`,
                          borderRadius: "9999px",
                          border: "2px dashed rgba(34, 211, 238, 0.45)",
                          zIndex: 1,
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          left: `${pos.left}px`,
                          top: 0,
                          width: `${mdCircle}px`,
                          height: `${mdCircle}px`,
                          borderRadius: "9999px",
                          background: "linear-gradient(135deg, #3fc1d1 0%, #2a9fb0 100%)",
                          boxShadow: "0 0 0 7px rgba(47,170,190,0.22), 0 0 0 13px rgba(47,170,190,0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "22px",
                          fontWeight: "800",
                          color: "white",
                          zIndex: 2,
                        }}
                      >
                        {index + 1}
                      </div>

                      <motion.div
                        style={{
                          position: "absolute",
                          left: `${cardLeft}px`,
                          top: `${mdCircle / 2}px`,
                          marginTop: `-${mdCircle / 2}px`,
                          width: "190px",
                          background: "white",
                          borderRadius: "12px",
                          padding: "14px 16px 16px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.16)",
                          zIndex: 2,
                        }}
                        whileHover={{ y: -4, scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h3 className="text-lg font-extrabold leading-tight sm:text-xl" style={{ color: "#0a0e1a", margin: 0 }}>
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed sm:text-sm" style={{ color: "#64748b" }}>
                          {item.description}
                        </p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ── Mobile timeline (below sm): straight vertical line ── */}
              <div className="relative mx-auto mt-14 max-w-[520px] sm:hidden">
                <div
                  className="absolute left-[31px] top-6 bottom-6 w-px"
                  style={{ background: "rgba(255,255,255,0.18)" }}
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-8">
                  {journeys.map((item, index) => (
                    <article key={item.id} className="flex items-start gap-4">
                      <div
                        className="shrink-0 flex items-center justify-center rounded-full text-xl font-bold text-white"
                        style={{
                          width: "62px",
                          height: "62px",
                          background: "linear-gradient(135deg, #3fc1d1 0%, #2a9fb0 100%)",
                          boxShadow: "0 0 0 6px rgba(47,170,190,0.2)",
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 rounded-xl bg-white px-5 py-4 text-[#071a32] shadow-sm">
                        <h3 className="text-lg font-bold leading-tight sm:text-xl">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </>
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