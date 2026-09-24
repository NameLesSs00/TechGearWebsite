"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useServices } from "@/hooks/useServices";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";
import { getLocaleFromPathname, switchLocaleInPathname } from "@/lib/localeRouting";
import Button from "./Button";
import NavLink from "./NavLink";
import { normalizeSlug } from "@/lib/apiClient";
const Logo = "/logo.svg";



interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setLanguage } = useLanguage();
  const currentLocale = getLocaleFromPathname(pathname) || locale;
  const language = currentLocale === "ar" ? "ar" : "en";
  const direction = language === "ar" ? "rtl" : "ltr";
  const { t } = useTranslation(language);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [isLanguageSwitching, setIsLanguageSwitching] = useState(false);

  const { data: fetchedServices = [] } = useServices(currentLocale);
  const servicesList = fetchedServices.map(s => ({ id: s.id, slug: s.title ? normalizeSlug(s.title) : s.id, name: s.title }));

  const headerRef = useRef<HTMLElement>(null);

  const navItems = [
    { name: t("nav_home"), href: `/${currentLocale}` },
    { name: t("nav_service"), href: "#", hasDropdown: true },
    { name: t("nav_work"), href: `/${currentLocale}/projects` },
    { name: t("nav_products"), href: `/${currentLocale}/products` },
    { name: t("nav_about_us"), href: `/${currentLocale}/aboutus` },
    { name: t("nav_contact_us"), href: `/${currentLocale}/contactus` },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setMobileServicesOpen(false);
    setLanguageDropdownOpen(false);
  }, [pathname]);

  // Close menus on outside click
  useEffect(() => {
    if (!menuOpen && !servicesDropdownOpen && !languageDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setServicesDropdownOpen(false);
        setLanguageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, servicesDropdownOpen, languageDropdownOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);



  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 20);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  const handleLanguageChange = async (newLanguage: "en" | "ar") => {
    if (isLanguageSwitching) return;
    
    setIsLanguageSwitching(true);
    setLanguage(newLanguage);
    setLanguageDropdownOpen(false);
    
    try {
      // Get the new URL with translated slug
      const newPath = await switchLocaleInPathname(pathname, newLanguage);
      router.push(newPath);
    } catch (error) {
      console.error("Error switching language:", error);
      // Fallback: simple locale replacement
      const newPath = pathname.replace(/^\/(en|ar)/, `/${newLanguage}`);
      router.push(newPath || `/${newLanguage}`);
    } finally {
      setIsLanguageSwitching(false);
    }
  };

  return (
    <motion.header
      ref={headerRef}
      dir={direction}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed left-0 top-0 z-50 w-full"
    >
      {/* ── Navbar pill ── */}
      <div
        className="mx-auto mt-4 w-[calc(100%-24px)] max-w-[1290px] rounded-[24px] border border-[#1d3d58] bg-[#020d1d]/85 px-4 py-3 backdrop-blur-xl transition-shadow duration-300 sm:mt-5 sm:w-[calc(100%-40px)] sm:px-6 lg:px-8 xl:px-10"
        style={{
          boxShadow: scrolled
            ? "0 0 0 1px rgba(25,207,252,0.13), 0 18px 48px rgba(0,0,0,0.32)"
            : "0 0 30px rgba(15,170,210,0.08)",
        }}
      >
        <div className="flex min-w-0 items-center justify-between gap-3">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="flex shrink-0 items-center gap-2.5" aria-label="Tech Gear home">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl sm:h-10 sm:w-10">
              <Image src={Logo} alt="Tech Gear logo" width={38} height={38} priority className="h-auto w-auto max-w-full object-contain" />
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden min-w-0 items-center justify-center gap-6 lg:flex xl:gap-10" aria-label="Main navigation">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.name}
                    className="relative"
                  >
                    <button
                      type="button"
                      onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                      className={`relative inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium transition-colors lg:text-base ${
                        pathname.includes("/services") ? "text-[#19CFFC]" : "text-white/90 hover:text-[#19CFFC]"
                      }`}
                    >
                      <span>{t("nav_service")}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${servicesDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {servicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18 }}
                          className="absolute start-0 top-[calc(100%+14px)] z-50 grid w-[min(42rem,calc(100vw-2rem))] grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-[#020d1d]/95 p-2 shadow-2xl backdrop-blur-xl"
                        >
                          {servicesList.map((service) => (
                            <Link
                              key={service.id}
                              href={`/${currentLocale}/services/${service.slug}`}
                              onClick={() => setServicesDropdownOpen(false)}
                              className="flex min-h-18 items-center rounded-xl px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-[#19CFFC]"
                            >
                              {service.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  active={pathname === item.href}
                  hasDropdown={item.hasDropdown}
                  className="whitespace-nowrap text-sm font-medium text-white/90 lg:text-base"
                >
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex xl:gap-4">
            {/* Language switcher */}
            <div
              className="relative"
            >
              <button
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-white/90 transition-colors hover:text-[#19CFFC]"
                type="button"
                aria-label={t("select_language")}
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              >
                {language === "en" ? (
                  <img src="https://flagcdn.com/w40/gb.png" alt="UK Flag" className="w-[22px] h-auto rounded-[2px]" />
                ) : (
                  <img src="https://flagcdn.com/w40/sa.png" alt="SA Flag" className="w-[22px] h-auto rounded-[2px]" />
                )}
                <span>{language === "en" ? "EN" : "AR"}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${languageDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {languageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute end-0 top-[calc(100%+10px)] z-50 w-36 rounded-2xl border border-white/10 bg-[#020d1d]/95 p-2 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="flex flex-col gap-1">
                      {(["en", "ar"] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => handleLanguageChange(lang)}
                          className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-2.5 text-start text-sm transition-colors hover:bg-white/10 hover:text-[#19CFFC] ${
                            language === lang ? "bg-white/10 font-semibold text-[#19CFFC]" : "text-white/80"
                          }`}
                        >
                          <span>{lang === "en" ? "English" : "العربية"}</span>
                          {lang === "en" ? (
                            <img src="https://flagcdn.com/w40/gb.png" alt="UK Flag" className="w-6 h-auto rounded-[2px]" />
                          ) : (
                            <img src="https://flagcdn.com/w40/sa.png" alt="SA Flag" className="w-6 h-auto rounded-[2px]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href={`/${currentLocale}/contactus`} className="inline-flex">
              <Button className="min-h-[44px] min-w-[150px] rounded-[999px] px-5 text-sm font-bold tracking-tight shadow-[0_0_24px_rgba(25,207,252,0.28)] xl:min-w-[170px] xl:text-base">
                {t("get_a_quote")}
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="grid place-items-center rounded-lg p-2 text-white transition-colors hover:bg-white/5 lg:hidden"
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? t("close_menu") : t("open_menu")}
            aria-expanded={menuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <X size={24} />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <Menu size={24} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── Mobile menu panel ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            dir={direction}
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mx-auto mt-2 max-h-[calc(100dvh-90px)] w-[calc(100%-24px)] max-w-[1300px] overflow-y-auto rounded-[22px] border border-white/10 bg-[#020d1d]/97 px-5 py-5 backdrop-blur-xl sm:w-[calc(100%-40px)] sm:px-7 sm:py-6 lg:hidden"
            aria-label="Mobile navigation"
          >
            {/* Nav links */}
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                if (item.hasDropdown) {
                  return (
                    <li key={item.name}>
                      <button
                        type="button"
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-[#19CFFC] sm:text-base"
                      >
                        <span>{t("nav_service")}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ms-4 mt-1 flex flex-col gap-1 overflow-hidden border-s border-white/10 ps-4"
                          >
                            {servicesList.map((service) => (
                              <li key={service.id}>
                                <Link
                                  href={`/${currentLocale}/services/${service.slug}`}
                                  onClick={() => { setMobileServicesOpen(false); setMenuOpen(false); }}
                                  className="block rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-[#19CFFC]"
                                >
                                  {service.name}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                        className={`block rounded-xl px-3 py-3 text-sm font-medium transition-colors sm:text-base ${
                        pathname === item.href ? "text-[#19CFFC]" : "text-white/90 hover:bg-white/5 hover:text-[#19CFFC]"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Divider */}
            <div className="my-4 h-px w-full bg-white/10" />

            {/* Language + CTA */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Language switcher */}
              <div className="flex flex-col gap-2">
                <p className="px-1 text-xs font-semibold uppercase tracking-widest text-white/40">
                  {t("select_language")}
                </p>
                <div className="flex gap-2">
                  {(["en", "ar"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { handleLanguageChange(lang); setMenuOpen(false); }}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none sm:min-w-[100px] ${
                        language === lang
                          ? "bg-[#19CFFC]/15 text-[#19CFFC] ring-1 ring-[#19CFFC]/40"
                          : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {lang === "en" ? (
                        <img src="https://flagcdn.com/w40/gb.png" alt="UK Flag" className="w-6 h-auto rounded-[2px]" />
                      ) : (
                        <img src="https://flagcdn.com/w40/sa.png" alt="SA Flag" className="w-6 h-auto rounded-[2px]" />
                      )}
                      <span>{lang === "en" ? "English" : "العربية"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA button */}
              <Link href={`/${currentLocale}/contactus`} onClick={() => setMenuOpen(false)} className="block sm:shrink-0">
                <Button className="min-h-[48px] w-full rounded-[999px] text-sm font-bold sm:w-auto sm:min-w-[160px] sm:text-base">
                  {t("get_a_quote")}
                </Button>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
