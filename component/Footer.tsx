"use client";

import { useState } from "react";
import { MapPin, Phone, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const Logo = "/logo.svg";
import CircleResponsive from "../prompts/Circle 3responsive (1).svg";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";
import { FacebookIcon, InstagramIcon, TikTokIcon, LinkedInIcon } from "./SocialIcons";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useServices } from "@/hooks/useServices";
import { normalizeSlug } from "@/lib/apiClient";

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const { language, direction } = useLanguage();
  const { t } = useTranslation(language);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { data: services = [] } = useServices(locale);

  const quickLinks = [
    { label: t("nav_home"), href: `/${locale}` },
    { label: t("nav_service"), isDropdown: true },
    { label: t("nav_work"), href: `/${locale}/projects` },
    { label: t("nav_products"), href: `/${locale}/products` },
    { label: t("nav_about_us"), href: `/${locale}/aboutus` },
    { label: t("nav_contact_us"), href: `/${locale}/contactus` },
    { label: t("faq_label"), href: `/${locale}/faq` },
  ];

  const socialLinks = [
    { label: "Facebook", href: "https://www.facebook.com/p/Tech-Gear-Solutions-100085832594929/", icon: FacebookIcon },
    { label: "Instagram", href: "https://www.instagram.com/tech_gear_solutions?stkn=MXF2YTBqa2trZjY4NQ==", icon: InstagramIcon },
    { label: "TikTok", href: "https://www.tiktok.com/@techgearsolutions?_r=1&_t=ZS-99t1GnNQ6KO", icon: TikTokIcon },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/tech-gear-solutions/", icon: LinkedInIcon },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const isRtl = direction === "rtl";

  return (
    <footer className="relative overflow-hidden bg-[#000918] px-6 pt-24 text-white sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden" aria-hidden="true">
        {/* Responsive Circle for sm and md screens */}
        <Image
          src={CircleResponsive}
          alt=""
          className="block h-auto w-full object-cover lg:hidden"
          style={{ transform: isRtl ? "rotateY(180deg)" : undefined }}
          priority
        />
        {/* Desktop equation path for lg and above */}
        <svg
          className="hidden h-full w-full lg:block"
          style={{ transform: isRtl ? "rotateY(180deg)" : undefined }}
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
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center mt-[-20px] md:mt-[-50px] justify-center gap-7 text-center sm:flex-row sm:gap-14 sm:text-left"
        >
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{t("footer_have_project")}</h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href={`/${locale}/contactus`} className="inline-flex min-w-[190px] items-center justify-center rounded-full bg-[#22D3EE] px-8 py-3.5 text-sm font-bold !text-[#011022] shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-shadow hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:ring-offset-2 focus:ring-offset-[#202d3b] md:mt-[0px] mt-[40px] sm:text-base">
              {t("footer_contact_us")}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-33 grid grid-cols-1 gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-[.17fr_.2fr_.2fr] lg:gap-20"
        >
          <motion.div variants={itemVariants} className="max-w-[310px]">
            <Image src={Logo} alt="Tech Gear logo" width={95} height={80} className="h-auto w-[95px] object-contain" />
            <p className="mt-4 text-sm leading-[1.55] text-white/90">{t("footer_description")}</p>
            <h3 className="mt-8 text-lg font-bold text-[#22D3EE]">{t("footer_follow_us")}</h3>
            <div className="mt-6 flex items-center gap-6">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <motion.a 
                  key={label} 
                  href={href} 
                  aria-label={label} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-[#22D3EE]"
                  whileHover={{ scale: 1.15, rotate: isRtl ? -5 : 5, color: "#22D3EE" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={21} className="w-[21px] h-[21px]" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.nav variants={itemVariants} aria-label="Footer quick links">
            <h3 className="text-lg font-bold text-[#22D3EE]">{t("footer_quick_action")}</h3>
            <div className="mt-4 flex flex-col items-start gap-3.5 text-sm text-white/90 sm:text-base">
              {quickLinks.map((link) => (
                link.isDropdown ? (
                  <div key="services-dropdown" className="w-full">
                    <button 
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className="flex w-fit items-center gap-2 text-left transition-colors hover:text-[#22D3EE]"
                    >
                      <motion.span whileHover={{ x: isRtl ? -6 : 6 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                        {link.label}
                      </motion.span>
                      <ChevronDown size={15} className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden ps-2 pt-2"
                        >
                          <div className="flex flex-col gap-2 border-s border-white/10 ps-3">
                            {services.map(service => {
                              const slug = service.title
                                ? normalizeSlug(service.title)
                                : service.id;
                              return (
                                <Link 
                                  key={service.id} 
                                  href={`/${locale}/services/${slug}`}
                                  className="text-[13px] text-white/70 hover:text-[#22D3EE] transition-colors"
                                >
                                  {service.title}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div 
                    key={link.href}
                    whileHover={{ x: isRtl ? -6 : 6 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Link href={link.href!} className="block transition-colors hover:text-[#22D3EE]">
                      {link.label}
                    </Link>
                  </motion.div>
                )
              ))}
            </div>
          </motion.nav>

          <motion.div variants={itemVariants} className="max-w-[390px]">
            <h3 className="text-lg font-bold text-[#22D3EE]">{t("footer_contact_us_heading")}</h3>
            <div className="mt-5 flex md:flex-col gap-5 text-sm leading-6 text-white/90 sm:text-base">
              <motion.div whileHover={{ x: isRtl ? -6 : 6 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                <Link href="https://wa.me/201021164131" target="_blank" rel="noopener noreferrer" className="flex w-fit items-start gap-3 transition-colors hover:text-[#22D3EE]">
                  <Phone className="mt-0.5 shrink-0" size={21} strokeWidth={1.8} />
                  <span>{isRtl ? "٠١٠٢١١٦٤١٣١" : "+20 1021164131"}</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: isRtl ? -6 : 6 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                <Link href="https://maps.app.goo.gl/TA4ysi9akUnysXB86" target="_blank" rel="noopener noreferrer" className="flex w-fit items-start gap-3 transition-colors hover:text-[#22D3EE]">
                  <MapPin className="mt-0.5 shrink-0" size={22} strokeWidth={1.8} />
                  <span>{t("footer_location")}</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="py-5 text-center text-xs text-white/70"
        >
          {t("footer_powered_by")}&nbsp;&nbsp; {t("footer_rights_reserved")}
        </motion.div>
      </div>
    </footer>
  );
}
