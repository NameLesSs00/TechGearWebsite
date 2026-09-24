"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ChevronDown, MessageSquareQuote } from "lucide-react";
import { useState } from "react";
import type { ProductDetail } from "@/services/productService";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

interface ProductDetailsProps {
  locale: string;
  product: ProductDetail;
}

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09 },
  },
};

function formatExternalLink(link?: string | null) {
  if (!link) return "#";
  if (link.startsWith("http://") || link.startsWith("https://")) return link;
  return `https://${link}`;
}

function ProductFaqRow({ faq, index }: { faq: ProductDetail["faqs"][number]; index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <motion.div variants={fadeUp} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex min-h-[72px] w-full items-center justify-between gap-5 px-5 text-left text-lg font-extrabold text-[#071a32] transition-colors hover:bg-slate-50"
      >
        <span>{faq.question}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-[#22D3EE] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease }}
          >
            {faq.answer ? <p className="px-5 pb-5 leading-7 text-slate-600">{faq.answer}</p> : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProductDetails({ locale, product }: ProductDetailsProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const hasFeatures = product.featureBlocks.length > 0;
  const hasReviews = product.reviews.length > 0;
  const hasFaqs = product.faqs.length > 0;
  const productHref = formatExternalLink(product.productLink);

  return (
    <main className="min-h-screen bg-[#000918] px-5 pb-20 pt-28 text-white sm:px-8 sm:pt-36 lg:px-12">
      <div className="mx-auto max-w-[1180px]">
        <nav aria-label="Breadcrumb" className="mb-10 text-sm text-slate-400">
          <Link href={`/${locale}`} className="transition-colors hover:text-[#22D3EE]">
            {t("nav_home")}
          </Link>
          <span className="mx-2 text-[#22D3EE]">{language === "ar" ? "<" : ">"}</span>
          <Link href={`/${locale}/products`} className="transition-colors hover:text-[#22D3EE]">
            {t("products_breadcrumb")}
          </Link>
          <span className="mx-2 text-[#22D3EE]">{language === "ar" ? "<" : ">"}</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <motion.section
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid overflow-hidden rounded-[24px] border border-[#22D3EE]/80 bg-[#1d3140] shadow-[0_24px_70px_rgba(0,0,0,0.32)] lg:grid-cols-[1.02fr_0.98fr]"
        >
          <div className="flex min-h-[430px] flex-col justify-center p-7 sm:p-10 lg:p-12">
            {product.iconImageUrl ? (
              <motion.div variants={fadeUp} className="mb-8 flex h-10 w-fit items-center justify-center rounded-full bg-white px-5">
                <Image
                  src={product.iconImageUrl}
                  alt={`${product.name} icon`}
                  width={128}
                  height={36}
                  className="max-h-7 w-auto object-contain"
                  unoptimized
                />
              </motion.div>
            ) : null}

            <motion.div variants={fadeUp}>
            <Link href={`/${locale}/products`} className="mb-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#22D3EE] transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to products
            </Link>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              {product.name}
            </motion.h1>

            {product.description ? (
              <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-base leading-8 text-white/90">
                {product.description}
              </motion.p>
            ) : null}

            {product.featuresSummary && product.featuresSummary.length > 0 ? (
              <motion.div variants={fadeUp} className="mt-7">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Key Features
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.featuresSummary.map((feature, index) => (
                    <span key={`${feature}-${index}`} className="rounded-full bg-slate-300/80 px-3 py-1.5 text-xs font-semibold text-[#011022]">
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : null}

            <motion.a
              variants={fadeUp}
              href={productHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-full bg-[#22D3EE] px-7 py-3.5 text-sm font-extrabold !text-[#011022] transition-colors hover:bg-[#1bb8d0]"
            >
              View Product
              <ArrowUpRight className="h-4 w-4" />
            </motion.a>
          </div>

          <motion.div variants={fadeUp} className="relative min-h-[340px] bg-[#0f1b29] lg:min-h-[560px]">
            {product.heroImageUrl ? (
              <Image
                src={product.heroImageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 590px"
                className="object-cover object-center"
                priority
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-lg font-bold text-slate-500">{product.name}</div>
            )}
          </motion.div>
        </motion.section>

        {hasFeatures ? (
          <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="mt-16">
            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#22D3EE]">Features</p>
              <h2 className="mt-3 text-3xl font-extrabold text-white">Built for daily operations</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {product.featureBlocks.map((feature) => (
                <motion.article variants={fadeUp} key={feature.id || feature.title} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                  {feature.image ? (
                    <div className="relative h-56 bg-[#101d2a]">
                      <Image src={feature.image} alt={feature.title || product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" unoptimized />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                    {feature.description ? <p className="mt-3 leading-7 text-slate-300">{feature.description}</p> : null}
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        ) : null}

        {hasReviews ? (
          <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="mt-16">
            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#22D3EE]">Reviews</p>
              <h2 className="mt-3 text-3xl font-extrabold text-white">What users say</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {product.reviews.map((review) => (
                <motion.article variants={fadeUp} key={review.id || review.quote} className="rounded-2xl border border-white/10 bg-[#000c24] p-6">
                  <MessageSquareQuote className="h-7 w-7 text-[#22D3EE]" />
                  {review.quote ? <p className="mt-4 leading-7 text-slate-200">"{review.quote}"</p> : null}
                  <div className="mt-5 flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white/10">
                      {review.authorAvatar ? <Image src={review.authorAvatar} alt={review.authorName || "Reviewer"} fill className="object-cover" unoptimized /> : null}
                    </div>
                    <div>
                      <p className="font-bold text-white">{review.authorName || "Client"}</p>
                      <p className="text-sm text-slate-400">{[review.authorRole, review.company].filter(Boolean).join(" - ")}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        ) : null}

        {hasFaqs ? (
          <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="mt-16 rounded-[28px] bg-white p-6 text-[#071a32] shadow-[0_24px_70px_rgba(0,0,0,0.16)] sm:p-8">
            <div className="mb-7 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#22D3EE]">FAQ</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#071a32]">Product questions</h2>
              <span className="mx-auto mt-4 block h-1.5 w-24 rounded-full bg-[#22D3EE]" />
            </div>
            <div className="space-y-3">
              {product.faqs.map((faq, index) => (
                <ProductFaqRow key={faq.id || faq.question} faq={faq} index={index} />
              ))}
            </div>
          </motion.section>
        ) : null}

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeUp} className="mt-16 rounded-2xl border border-[#22D3EE]/40 bg-[#22D3EE]/10 p-8 text-center">
          <h2 className="text-2xl font-extrabold text-white">Ready to explore {product.name}?</h2>
          <Link
            href={`/${locale}/contactus`}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#22D3EE] px-8 py-3.5 text-sm font-extrabold !text-[#011022] transition-colors hover:bg-[#1bb8d0]"
          >
            {product.ctaText || "Contact Us"}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.section>
      </div>
    </main>
  );
}
