"use client";

import { Camera, MapPin, MessageCircle, Music2, Phone, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../prompts/logo.png";
import CircleResponsive from "../prompts/Circle 3responsive (1).svg";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const { language, direction } = useLanguage();
  const { t } = useTranslation(language);

  const quickLinks = [
    { label: t("nav_home"), href: `/${locale}` },
    { label: t("nav_service"), href: `/${locale}/services` },
    { label: t("nav_work"), href: `/${locale}/work` },
    { label: t("nav_products"), href: `/${locale}/products` },
    { label: t("nav_about_us"), href: `/${locale}/aboutus` },
    { label: t("nav_contact_us"), href: `/${locale}/contactus` },
  ];

  const socialLinks = [
    { label: "Facebook", href: "#", icon: Share2 },
    { label: "Instagram", href: "#", icon: Camera },
    { label: "TikTok", href: "#", icon: Music2 },
    { label: "X", href: "#", icon: MessageCircle },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#000918] px-6 pt-24 text-white sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-x-0  top-0 h-[520px] overflow-hidden" aria-hidden="true">
        {/* Responsive Circle for sm and md screens */}
        <Image
          src={CircleResponsive}
          alt=""
          className="block h-auto w-full object-cover lg:hidden"
          style={{ transform: direction === "rtl" ? "rotateY(180deg)" : undefined }}
          priority
        />
        {/* Desktop equation path for lg and above */}
        <svg
          className="hidden h-full w-full lg:block"
          style={{ transform: direction === "rtl" ? "rotateY(180deg)" : undefined }}
          viewBox="0 0 1440 520"
          preserveAspectRatio="none"
        >
          <path
            fill="#202d3b"
            d="
              M0 0
              H1440
              L1400 0
           C1360 100 1320 250 1200 360
C1110 430 1030 440 940 380
             C820 290 710 190 590 140
C480 90 360 120 250 135
C150 155 70 110 0 50        Z
            "
          />
        </svg>
      </div>
<div
  className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
  aria-hidden="true"
>
  <div
    className="
      absolute left-1/2 top-[90%]
      h-[110%] w-[110%]
      -translate-x-1/2 -translate-y-1/2
      bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.10)_0%,rgba(34,211,238,0.07)_25%,rgba(34,211,238,0.035)_45%,rgba(34,211,238,0.015)_62%,transparent_80%)]
      blur-3xl
    "
  />
</div>
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col items-center mt-[-20px]  md:mt-[-50px] justify-center gap-7 text-center sm:flex-row sm:gap-14 sm:text-left ">
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{t("footer_have_project")}</h2>
          <Link href={`/${locale}/contactus`} className="inline-flex min-w-[190px] items-center justify-center rounded-full bg-[#22D3EE] px-8 py-3.5 text-sm font-bold text-[#00121F] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:ring-offset-2 focus:ring-offset-[#202d3b] md:mt-[0px] mt-[40px] sm:text-base">{t("footer_contact_us")}</Link>
        </div>

        <div className="mt-33   grid grid-cols-1 gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-[.17fr_.2fr_.2fr] lg:gap-20">
          <div className="max-w-[310px]">
            <Image src={Logo} alt="Tech Gear logo" width={95} height={80} className="h-auto w-[95px] object-contain" />
            <p className="mt-4 text-sm leading-[1.55] text-white/90">{t("footer_description")}</p>
            <h3 className="mt-8 text-lg font-bold text-[#22D3EE]">{t("footer_follow_us")}</h3>
            <div className="mt-6 flex items-center gap-6">
              {socialLinks.map(({ label, href, icon: Icon }) => <Link key={label} href={href} aria-label={label} className="text-white transition-colors hover:text-[#22D3EE]"><Icon size={21} strokeWidth={1.8} /></Link>)}
            </div>
          </div>

          <nav aria-label="Footer quick links">
            <h3 className="text-lg font-bold text-[#22D3EE]">{t("footer_quick_action")}</h3>
            <div className="mt-4 flex flex-col items-start gap-3.5 text-sm text-white/90 sm:text-base">
              {quickLinks.map((link) => <Link key={link.href} href={link.href} className="origin-left scale:0 hover:!text-[#22D3EE] transition-transform duration-200 hover:scale-115">{link.label}</Link>)}
            </div>
          </nav>

          <div className="max-w-[390px]">
            <h3 className="text-lg font-bold text-[#22D3EE]">{t("footer_contact_us_heading")}</h3>
            <div className="mt-5 flex md:flex-col gap-5 text-sm leading-6 text-white/90 sm:text-base">
              <Link href="tel:+202101164131" className="flex items-start gap-3 transition-colors hover:text-[#22D3EE]"><Phone className="mt-0.5 shrink-0" size={21} strokeWidth={1.8} /><span>{language === "ar" ? "٠١٠٢١١٦٤١٣١" : "+20 1021164131"}</span></Link>
              <div className="flex items-start gap-3"><MapPin className="mt-0.5 shrink-0" size={22} strokeWidth={1.8} /><span>{t("footer_location")}</span></div>
            </div>
          </div>
        </div>

        <div className=" py-5 text-center text-xs text-white/70">{t("footer_powered_by")}&nbsp;&nbsp; {t("footer_rights_reserved")}</div>
      </div>
    </footer>
  );
}
