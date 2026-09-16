"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { faqService, FaqItem } from "@/services/faqService";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

const defaultFaqItems: FaqItem[] = [
  {
    id: "default-1",
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    question: "What services do you offer?",
    answer: "We provide complete digital solutions, including web and mobile development, custom software, UI/UX design, SEO, digital marketing, and graphic design.",
    resolvedLanguage: "en",
  },
  {
    id: "default-2",
    displayOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    question: "How do you start a new project?",
    answer: "We start with a conversation about your goals, audience, and challenges. From there, we define the right scope, timeline, and next steps together.",
    resolvedLanguage: "en",
  },
  {
    id: "default-3",
    displayOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    question: "How long does a project take?",
    answer: "Every project is different, but we provide a clear delivery plan before work begins and keep you updated throughout each phase.",
    resolvedLanguage: "en",
  },
  {
    id: "default-4",
    displayOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    question: "Can you work with an existing website or application?",
    answer: "Yes. We can improve, redesign, extend, or maintain an existing website or application while preserving the parts that already work well.",
    resolvedLanguage: "en",
  },
];

interface FaqSectionProps {
  locale?: string;
}

interface FaqRowProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqRow({ item, isOpen, onToggle }: FaqRowProps) {
  return (
    <div className={`overflow-hidden bg-white text-[#071a32] ${isOpen ? "rounded-2xl" : "rounded-none"}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex min-h-[72px] w-full cursor-pointer items-center justify-between gap-5 px-4 text-left text-lg font-bold leading-snug transition-colors hover:bg-slate-50 sm:min-h-[82px] sm:px-5 sm:text-xl lg:text-2xl"
      >
        <span>{item.question}</span>
        <ChevronDown size={22} className={`shrink-0 text-[#071a32] transition-transform duration-300 ${isOpen ? "rotate-180 !text-[#10EDFD] " : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className="px-4 pb-5 text-base leading-relaxed text-slate-600 sm:px-5 sm:text-lg">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection(_props: FaqSectionProps = {}) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  
  const [faqItems, setFaqItems] = useState<FaqItem[]>(defaultFaqItems);
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        setError(null);
        const faqs = await faqService.getFaqs(language, 1, 20);
        if (faqs && faqs.length > 0) {
          setFaqItems(faqs);
        }
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
        setError(t("faq_error"));
        // Keep default FAQs visible
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [language, t]);

  return (
    <section className="relative overflow-hidden bg-[#000918] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-28" aria-labelledby="faq-heading">
      <div className="absolute bottom-0 left-1/2 -z-0 h-52 w-[min(700px,90vw)] -translate-x-1/2 rounded-full bg-[#22D3EE]/[0.06] blur-3xl" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-[1175px]">
        <header className="mb-14 text-center sm:mb-16">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.42em] text-[#22D3EE]">{t("faq_label")}</p>
          <h2 id="faq-heading" className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{t("faq_heading")}</h2>
          <span className="mx-auto mt-5 block h-1.5 w-28 rounded-full bg-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.6)]" aria-hidden="true" />
        </header>
        {error && (
          <div className="mb-6 rounded-lg bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300 border border-yellow-500/20">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22D3EE]/20 border-t-[#22D3EE] mx-auto mb-4" />
              <p className="text-slate-400">{t("faq_loading")}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {faqItems.map((item, index) => (
              <FaqRow
                key={item.id}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
