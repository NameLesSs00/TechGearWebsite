"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Braces, Code2, FileCode2, SquareTerminal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";
import Button from "./Button";

/* ─────────────────── TypewriterText component ──────────────────── */
function TypewriterText({
  text,
  delay = 0,
  speed = 80,
}: {
  text: string;
  delay?: number;
  speed?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    let interval: ReturnType<typeof setInterval> | undefined;
    let i = 0;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay, speed, reduceMotion]);

  return (
    <span className="flex items-center gap-[1px]">
      <span>{reduceMotion ? text : displayed}</span>
      <motion.span
        className="inline-block h-[12px] w-[1.5px] rounded-full bg-[#19CFFC]"
        animate={reduceMotion ? { opacity: 1 } : { opacity: done ? [1, 0, 1] : 1 }}
        transition={
          done
            ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0 }
        }
      />
    </span>
  );
}

/* ─────────────────────────── animation presets ────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease, delay },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.75, ease, delay },
  }),
};

/* ─────────────────── floating animations ──────────────────────── */
function TypeDelayText({
  text,
  color = "#f8fafc",
}: {
  text: string;
  color?: string;
}) {
  return <span className="inline-block" style={{ color }}>{text.replaceAll(" ", "\u00A0")}</span>;
}

/* ─────────────────────────── code lines ──────────────────────────── */
const codeLines = [
  [
    { text: "import", color: "#c792ea" },
    { text: " { ", color: "#f8fafc" },
    { text: "Website", color: "rgb(56, 255, 222)" },
    { text: " } ", color: "#f8fafc" },
    { text: "from", color: "#c792ea" },
    { text: " '@techgear/core';", color: "#c3e88d" },
  ],
  [],
  [
    { text: "export", color: "#c792ea" },
    { text: " ", color: "#f8fafc" },
    { text: "function", color: "#c792ea" },
    { text: " ", color: "#f8fafc" },
    { text: "launch", color: "#ffcb6b" },
    { text: "(client) {", color: "#f8fafc" },
  ],
  [
    { text: "  return", color: "#c792ea" },
    { text: " ", color: "#f8fafc" },
    { text: "new", color: "#82aaff" },
    { text: " ", color: "#f8fafc" },
    { text: "Website", color: "#82aaff" },
    { text: "({", color: "#f8fafc" },
  ],
  [
    { text: "    responsive", color: "#f07178" },
    { text: ": ", color: "#89ddff" },
    { text: "true", color: "#ff9d00" },
    { text: ",", color: "#f8fafc" },
  ],
  [
    { text: "    fast", color: "#f07178" },
    { text: ": ", color: "#89ddff" },
    { text: "true", color: "#ff9d00" },
    { text: ",", color: "#f8fafc" },
  ],
  [{ text: "  });", color: "#f8fafc" }],
  [{ text: "}", color: "#f8fafc" }],
];

/* ──────────────────── node graph data ─────────────────────────── */
const nodes = [
  { x: 18, y: 20, size: 9, pulse: true },
  { x: 55, y: 12, size: 7, pulse: false },
  { x: 82, y: 30, size: 11, pulse: true },
  { x: 38, y: 55, size: 6, pulse: false },
  { x: 70, y: 68, size: 8, pulse: true },
];

const edges: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [2, 4],
];

/* ══════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */
interface HeroSectionProps {
  locale?: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const { language, direction } = useLanguage();
  const { t } = useTranslation(language);
  const reduceMotion = useReducedMotion();

  const currentLocale = locale || language;

  return (
    <main dir={direction} className="relative isolate min-h-screen overflow-hidden bg-[#000918] text-white">
      {/* ── grid ── */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(rgba(31,61,88,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(31,61,88,0.12) 1px, transparent 1px)",
          backgroundSize: "110px 110px",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,_rgba(25,207,252,0.09),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,_rgba(25,207,252,0.16),_transparent_26%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,_rgba(0,0,0,0.28),_transparent_50%)]" />
      <div className="absolute   top-[18%] h-[520px] w-[520px] -translate-x-0 rounded-full bg-[#19CFFC]/8 blur-[100px]" />

      <div className="absolute  inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 36 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#9fe8ff]/80"
            style={{
              left: `${(i * 13) % 100}%`,
              top: `${(i * 17) % 100}%`,
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              boxShadow: "0 0 6px rgba(25,207,252,0.65)",
            }}
            animate={reduceMotion ? {} : { opacity: [0.2, 0.9, 0.2] }}
            transition={{
              duration: 2.5 + (i % 5) * 0.7,
              repeat: Infinity,
              delay: (i * 0.13) % 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>



      {/* ══════════════════ MAIN CONTENT ══════════════════ */}
      <section dir={direction} className="relative z-30 mx-auto flex min-h-screen w-full max-w-[1500px] items-center px-6 pb-20 pt-24 sm:px-8 sm:pt-28 lg:px-12 lg:pt-20 xl:px-16">
        <div dir={direction} className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-8">

          {/* ════ LEFT ════ */}
          <div
            className={`mx-auto max-w-[660px] ${direction === "rtl"
              ? "text-right lg:text-right p-0 md:pr-12"
              : "text-center lg:text-left p-0 md:pl-12"
              } lg:mx-0`}
          >

            {/* headline */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.1}
              className={`text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl ${direction === "rtl"
                ? "lg:text-left text-left"
                : "text-center lg:text-left"
                }`}
            >
              {t("hero_title_complete")}{" "}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease, delay: 0.2 }}
                className="relative inline-block text-[#19CFFC] "
                style={{ textShadow: "0 0 40px rgba(25,207,252,0.4)" }}
              >
                {t("hero_title_digital")}
                <motion.span
                  className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#19CFFC] to-transparent"
                  initial={{ scaleX: 0, originX: "0%" }}
                  animate={{ scaleX: 1 }}
                  style={{ transformOrigin: "left" }}
                  transition={{ duration: 0.8, delay: 0.75, ease }}
                />
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease, delay: 0.3 }}
                className="block"
              >
                {t("hero_title_solutions")}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease, delay: 0.4 }}
                className="block"
              >
                {t("hero_title_under_one_roof")}
              </motion.span>
            </motion.h1>

            {/* description */}
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.5}
              className={`mt-6 max-w-[560px] text-sm leading-relaxed text-slate-300/75 sm:text-base ${direction === "rtl"
                ? "text-left lg:text-right "
                : "text-center lg:text-left "
                }`}
            >
              {t("hero_description")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.6}
              className={`mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center ${direction === "rtl" ? "lg:justify-start" : "lg:justify-start"
                }`}
            >
              <Link href={`/${currentLocale}/contactus`} className="block">
                <Button className="group relative min-h-[50px] min-w-[180px] overflow-hidden rounded-full px-6 text-sm font-bold shadow-[0_0_28px_rgba(25,207,252,0.32)] sm:min-w-[190px] sm:text-base">
                  <span className="relative z-10 flex items-center gap-2">
                    {t("hero_start_project")}
                    <motion.span
                      animate={reduceMotion ? {} : { x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {direction === "rtl" ? " ←" : "→"}
                    </motion.span>
                  </span>
                  {/* shimmer sweep */}
                  <motion.span
                    className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-150%" }}
                    animate={reduceMotion ? {} : { x: "150%" }}
                    transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                  />
                </Button>
              </Link>

              <Link href={`/${currentLocale}/projects`} className="block">
                <Button
                  variant="secondary"
                  className="min-h-[50px] min-w-[180px] rounded-full border border-white/20 bg-white/5 px-6 text-sm font-bold text-white shadow-[0_0_22px_rgba(25,207,252,0.1)] transition-colors duration-300 hover:border-[#19CFFC]/60 hover:bg-[#19CFFC]/8 hover:text-[#19CFFC] sm:min-w-[190px] sm:text-base"
                >
                  {t("hero_see_work")}
                </Button>
              </Link>
            </motion.div>

          </div>

          {/* ════ RIGHT ════ */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            custom={0.3}
            className="relative hidden min-h-[580px] lg:flex lg:items-center lg:justify-center"
          >

            <div className="pointer-events-none absolute inset-0 z-110" aria-hidden="true">
              <div className="absolute left-[2%] top-[16%] grid h-14 w-14 place-items-center rounded-full border border-[#19CFFC]/30 bg-[#061d2d]/90 text-[#19CFFC] shadow-[0_0_26px_rgba(25,207,252,0.2)]">
                <Code2 className="h-6 w-6" />
              </div>
              <div className="absolute right-[2%] top-[16%] grid h-14 w-14 place-items-center rounded-full border border-[#c792ea]/40 bg-[#1c1230]/90 text-[#c792ea] shadow-[0_0_26px_rgba(199,146,234,0.24)]">
                <Braces className="h-6 w-6" />
              </div>
              <div className="absolute bottom-[14%] left-[4%] grid h-14 w-14 place-items-center rounded-full border border-[#ffcb6b]/40 bg-[#30240f]/90 text-[#ffcb6b] shadow-[0_0_26px_rgba(255,203,107,0.24)]">
                <SquareTerminal className="h-6 w-6" />
              </div>
              <div className="absolute bottom-[14%] right-[4%] grid h-14 w-14 place-items-center rounded-full border border-[#c3e88d]/40 bg-[#182b18]/90 text-[#c3e88d] shadow-[0_0_26px_rgba(195,232,141,0.24)]">
                <FileCode2 className="h-6 w-6" />
              </div>
            </div>

            <motion.div
              dir="ltr"
              className="relative z-20 w-[560px] rounded-[22px] border border-[#1d3d58]/70 bg-[#051827]/90 p-4 shadow-[0_8px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(25,207,252,0.06)] backdrop-blur-md"
            >
              {/* title bar */}
              <div className="mb-4 flex items-center gap-2 px-1">
                {/* input-style file name tab */}
                <div className="ml-1 flex items-center gap-1.5 rounded-md border border-[#1d3d58]/60 bg-[#020d1d]/80 px-3 py-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]">
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#19CFFC] shadow-[0_0_5px_rgba(25,207,252,0.8)]" />
                  <span className="text-xs font-mono font-medium text-slate-300/80">
                    <TypewriterText text="techgear.com" delay={250} speed={40} />
                  </span>
                </div>
              </div>

              {/* code body */}
              <div className="rounded-[16px] border border-[#1f3d5d]/60 bg-[#020d1d]/92 p-5 font-mono">
                {codeLines.map((line, li) => (
                  <motion.div
                    key={li}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, delay: 0.5 + li * 0.18, ease }}
                    className="flex items-center gap-3 py-[3px] text-sm leading-relaxed"
                  >
                    <span className="w-5 select-none text-right text-xs text-[#4a7fa5]/70">
                      {li + 1}
                    </span>
                    <span className="flex flex-wrap gap-[2px]">
                      {line.map((part, partIndex) => {
                        return <TypeDelayText key={`${li}-${partIndex}`} text={part.text} color={part.color} />;
                      })}
                    </span>
                  </motion.div>
                ))}
                {/* blinking cursor */}
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>
    </main>
  );
}
