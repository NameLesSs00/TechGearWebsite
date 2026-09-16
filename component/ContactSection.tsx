"use client";

import { Camera, Mail, MapPin, MessageCircle, Music2, Phone, Share2 } from "lucide-react";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { contactService } from "@/services/contactService";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation, TranslationKey } from "@/translations";

const contactItems = [
  { title: "Location", icon: MapPin, content: "Hurghada, El Kawther, Metro ST, next to Abdeen pharmacy." },
  { title: "Call Us", icon: Phone, content: "+20 1021164131", href: "tel:+201021164131" },
  { title: "Email", icon: Mail, content: "info@example.com", href: "mailto:info@example.com" },
];

const socialLinks = [
  { label: "Facebook", icon: Share2 },
  { label: "Instagram", icon: Camera },
  { label: "TikTok", icon: Music2 },
  { label: "X", icon: MessageCircle },
];

export default function ContactSection(_props?: { locale?: string }) {
  const { language } = useLanguage();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

  return (
    <main className="min-h-screen bg-[#000918] px-5 pb-20 pt-32 text-white sm:px-8 sm:pt-40 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-32 text-center text-sm text-white/90 sm:mb-36 sm:text-base">
          <Link href="/" className="transition-colors hover:text-[#22D3EE]">{t("nav_home")}</Link>
          <span className="mx-1.5">{language === "ar" ? "<" : ">"}</span>
          <span className="font-semibold text-[#22D3EE]">{t("contact_breadcrumb")}</span>
        </nav>

        <section className="mx-auto max-w-[710px] rounded-2xl border border-[#22D3EE] bg-[#000918] px-7 py-8 shadow-[0_0_18px_rgba(34,211,238,0.1)] sm:px-10 sm:py-10 lg:px-10 lg:py-12" aria-labelledby="contact-heading">
          <h1 id="contact-heading" className="max-w-[530px] text-3xl font-bold leading-[1.15] text-[#22D3EE] sm:text-4xl">{t("contact_heading")}</h1>
          <p className="mt-5 max-w-[590px] text-sm leading-relaxed text-white sm:text-base lg:text-lg">{t("contact_description")}</p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 border border-red-500/20">
                {error}
              </div>
            )}
            <label className="block text-sm font-semibold sm:text-base">{t("contact_your_name")}<input name="name" type="text" placeholder={t("contact_name_placeholder")} value={formData.name} onChange={handleInputChange} required className="mt-2.5 block h-14 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal text-[#000918] outline-none placeholder:text-slate-400 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/30" /></label>
            <label className="block text-sm font-semibold sm:text-base">{t("contact_email")}<input name="email" type="email" placeholder={t("contact_email_placeholder")} value={formData.email} onChange={handleInputChange} required className="mt-2.5 block h-14 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal text-[#000918] outline-none placeholder:text-slate-400 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/30" /></label>
            <label className="block text-sm font-semibold sm:text-base">{t("contact_phone")}<input name="phone" type="tel" placeholder={t("contact_phone_placeholder")} value={formData.phone} onChange={handleInputChange} required className="mt-2.5 block h-14 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal text-[#000918] outline-none placeholder:text-slate-400 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/30" /></label>
            <label className="block text-sm font-semibold sm:text-base">{t("contact_subject")}<input name="subject" type="text" placeholder={t("contact_subject_placeholder")} value={formData.subject} onChange={handleInputChange} required className="mt-2.5 block h-14 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal text-[#000918] outline-none placeholder:text-slate-400 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/30" /></label>
            <label className="block text-sm font-semibold sm:text-base">{t("contact_message")}<textarea name="message" placeholder={t("contact_message_placeholder")} value={formData.message} onChange={handleInputChange} required rows={4} className="mt-2.5 block min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm font-normal text-[#000918] outline-none placeholder:text-slate-400 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/30" /></label>
            <button type="submit" disabled={loading} className="mx-auto block min-h-12 w-full max-w-[405px] rounded-full bg-[#22D3EE] px-7 py-3 text-sm font-bold text-[#00121F] transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:ring-offset-2 focus:ring-offset-[#000918] disabled:opacity-50 disabled:cursor-not-allowed">{loading ? t("contact_sending") : submitted ? t("contact_message_sent") : t("contact_send_button")}</button>
            {submitted && <p className="text-center text-sm text-[#67E8F9]" role="status">{t("contact_success_message")}</p>}
          </form>
        </section>

        <section className="mt-0 grid rounded-2xl bg-white px-5 py-7 text-[#062857] shadow-xl sm:px-8 lg:-mt-1 lg:grid-cols-[1.35fr_1fr_1fr_1.2fr] lg:items-center lg:px-6 lg:py-8" aria-label="Contact details">
          {contactItems.map(({ title, icon: Icon, content, href }) => {
            const detail = <span>{content}</span>;
            const key = `contact_${title.toLowerCase().replace(/ /g, "_")}_title` as TranslationKey;
            const translatedTitle = t(key);
            return <div key={title} className="flex items-start gap-3 border-b border-[#062857]/10 py-4 last:border-0 lg:border-b-0 lg:border-r lg:px-6 lg:py-0 lg:last:border-0"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#edf7ed] text-[#064078]"><Icon size={20} strokeWidth={2} /></span><div><h2 className="text-xl font-bold">{translatedTitle}</h2><p className="mt-2 text-base leading-6 text-[#0b1e38]/90">{href ? <Link href={href} className="hover:text-[#22AFC5]">{detail}</Link> : detail}</p></div></div>;
          })}
          <div className="flex items-start gap-3 py-4 lg:px-6 lg:py-0"><div><h2 className="text-xl font-bold">{t("contact_follow_us_title")}</h2><div className="mt-5 flex gap-6 text-[#22D3EE]">{socialLinks.map(({ label, icon: Icon }) => <Link key={label} href="#" aria-label={label} className="transition-colors hover:text-[#062857]"><Icon size={20} strokeWidth={1.8} /></Link>)}</div></div></div>
        </section>
      </div>
    </main>
  );
}
