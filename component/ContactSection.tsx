"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { contactService } from "@/services/contactService";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation, TranslationKey } from "@/translations";
import { FacebookIcon, InstagramIcon, TikTokIcon, LinkedInIcon } from "./SocialIcons";
import { motion, Variants } from "framer-motion";

const contactItems = [
  { 
    title: "Location", 
    icon: MapPin, 
    content: "Hurghada, El Kawther, Metro ST, next to Abdeen pharmacy.",
    href: "https://maps.app.goo.gl/TA4ysi9akUnysXB86" 
  },
  { 
    title: "Call Us", 
    icon: Phone, 
    content: "+20 1021164131", 
    href: "https://wa.me/201021164131" 
  },
  { 
    title: "Email", 
    icon: Mail, 
    content: "info@tech-gear-solutions.com", 
    href: "mailto:info@tech-gear-solutions.com" 
  },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/p/Tech-Gear-Solutions-100085832594929/", icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/tech_gear_solutions?stkn=MXF2YTBqa2trZjY4NQ==", icon: InstagramIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@techgearsolutions?_r=1&_t=ZS-99t1GnNQ6KO", icon: TikTokIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/tech-gear-solutions/", icon: LinkedInIcon },
];

export default function ContactSection(_props?: { locale?: string }) {
  const { language, direction } = useLanguage();
  const { t } = useTranslation(language);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRtl = direction === "rtl";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      return "Please enter a valid phone number (10-15 digits).";
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await contactService.submitContactMessage(formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const leftColumnVariants: Variants = {
    hidden: { opacity: 0, x: isRtl ? 30 : -30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.15 } 
    },
  };

  const rightColumnVariants: Variants = {
    hidden: { opacity: 0, x: isRtl ? -30 : 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <main className="min-h-screen bg-[#000918] px-5 pb-20 pt-28 text-white sm:px-8 sm:pt-32 lg:px-12 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#22D3EE]/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-label="Breadcrumb" 
          className="mb-16 text-center text-sm text-white/90 sm:mb-20 sm:text-base lg:text-left"
        >
          <Link href="/" className="transition-colors hover:text-[#22D3EE]">{t("nav_home")}</Link>
          <span className="mx-1.5">{isRtl ? "<" : ">"}</span>
          <span className="font-semibold text-[#22D3EE]">{t("contact_breadcrumb")}</span>
        </motion.nav>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          
          {/* Left Column: Info */}
          <motion.div 
            className="flex flex-col"
            variants={leftColumnVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={itemVariants} id="contact-heading" className="text-4xl font-bold leading-[1.15] text-[#22D3EE] sm:text-5xl lg:text-6xl">
              {t("contact_heading")}
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-6 text-base leading-relaxed text-slate-300 sm:text-lg">
              {t("contact_description")}
            </motion.p>

            <div className="mt-12 flex flex-col gap-8">
              {contactItems.map(({ title, icon: Icon, content, href }) => {
                const key = `contact_${title.toLowerCase().replace(/ /g, "_")}_title` as TranslationKey;
                const translatedTitle = t(key);
                return (
                  <motion.div variants={itemVariants} key={title} className="flex items-start gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#22D3EE]/10 text-[#22D3EE] ring-1 ring-[#22D3EE]/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                      <Icon size={22} strokeWidth={2} />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-white">{translatedTitle}</h2>
                      <p className="mt-1.5 text-base text-slate-400">
                        {href ? (
                          <Link href={href} target={href.startsWith("http") ? "_blank" : "_self"} rel="noopener noreferrer" className="transition-colors hover:text-[#22D3EE]">
                            {content}
                          </Link>
                        ) : (
                          content
                        )}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div variants={itemVariants} className="mt-14">
              <h2 className="text-xl font-bold text-white mb-6">{t("contact_follow_us_title")}</h2>
              <div className="flex gap-5">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <motion.a 
                    key={label} 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label={label} 
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22D3EE]/10 text-[#22D3EE] ring-1 ring-[#22D3EE]/20 transition-colors hover:bg-[#22D3EE] hover:text-[#011022]"
                    whileHover={{ scale: 1.15, rotate: isRtl ? -5 : 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={20} className="w-[20px] h-[20px]" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.section 
            variants={rightColumnVariants}
            initial="hidden"
            animate="visible"
            className="rounded-3xl border border-[#22D3EE]/20 bg-[#001224]/80 backdrop-blur-xl px-7 py-10 shadow-[0_0_30px_rgba(34,211,238,0.05)] sm:px-10 sm:py-12" 
            aria-labelledby="contact-form"
          >
            <h2 id="contact-form" className="sr-only">Contact Form</h2>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  className="rounded-xl bg-red-500/10 px-5 py-4 text-sm font-medium text-red-400 border border-red-500/20"
                >
                  {error}
                </motion.div>
              )}
              <div className="space-y-5">
                <label className="block text-sm font-medium text-slate-300">
                  {t("contact_your_name")}
                  <input name="name" type="text" placeholder={t("contact_name_placeholder")} value={formData.name} onChange={handleInputChange} required className="mt-2.5 block h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-normal text-[#011022] outline-none transition-all placeholder:text-slate-400 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/30" />
                </label>
                <label className="block text-sm font-medium text-slate-300">
                  {t("contact_email")}
                  <input name="email" type="email" placeholder={t("contact_email_placeholder")} value={formData.email} onChange={handleInputChange} required className="mt-2.5 block h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-normal text-[#011022] outline-none transition-all placeholder:text-slate-400 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/30" />
                </label>
                <label className="block text-sm font-medium text-slate-300">
                  {t("contact_phone")}
                  <input name="phone" type="tel" placeholder={t("contact_phone_placeholder")} value={formData.phone} onChange={handleInputChange} required className="mt-2.5 block h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-normal text-[#011022] outline-none transition-all placeholder:text-slate-400 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/30" />
                </label>
                <label className="block text-sm font-medium text-slate-300">
                  {t("contact_subject")}
                  <input name="subject" type="text" placeholder={t("contact_subject_placeholder")} value={formData.subject} onChange={handleInputChange} required className="mt-2.5 block h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-normal text-[#011022] outline-none transition-all placeholder:text-slate-400 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/30" />
                </label>
                <label className="block text-sm font-medium text-slate-300">
                  {t("contact_message")}
                  <textarea name="message" placeholder={t("contact_message_placeholder")} value={formData.message} onChange={handleInputChange} required rows={4} className="mt-2.5 block min-h-[140px] w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm font-normal text-[#011022] outline-none transition-all placeholder:text-slate-400 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/30" />
                </label>
              </div>
              <motion.button 
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading} 
                className="mt-8 block h-14 w-full rounded-xl bg-[#22D3EE] px-7 text-base font-bold text-[#011022] shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-colors hover:bg-[#1bb8d0] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:ring-offset-2 focus:ring-offset-[#001224] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("contact_sending") : submitted ? t("contact_message_sent") : t("contact_send_button")}
              </motion.button>
              {submitted && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="mt-4 text-center text-sm font-medium text-[#22D3EE]" 
                  role="status"
                >
                  {t("contact_success_message")}
                </motion.p>
              )}
            </form>
          </motion.section>

        </div>
      </div>
    </main>
  );
}
