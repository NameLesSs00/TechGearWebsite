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
    <motion.div variants={fadeUp} className="overflow-hidden bg-white text-[#071a32] rounded-2xl">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex min-h-[72px] w-full cursor-pointer items-center justify-between gap-5 px-4 text-left text-lg font-bold leading-snug transition-colors hover:bg-slate-50 sm:min-h-[82px] sm:px-5 sm:text-xl lg:text-2xl"
      >
        <span>{faq.question}</span>
        <ChevronDown size={22} className={`shrink-0 text-[#071a32] transition-transform duration-300 ${isOpen ? "rotate-180 !text-[#10EDFD] " : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {faq.answer ? <p className="px-4 pb-5 text-base leading-relaxed text-slate-600 sm:px-5 sm:text-lg">{faq.answer}</p> : null}
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
                    <span key={`${feature.id || index}`} className="rounded-full bg-slate-300/80 px-3 py-1.5 text-xs font-semibold text-[#011022]">
                      {feature.text}
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

          <motion.div variants={fadeUp} className="relative order-first min-h-[280px] bg-[#0f1b29] lg:order-last lg:min-h-[560px]">
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
          <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="mt-20 lg:mt-28">
            <div className="mb-14 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#22D3EE]">Deep Dive</p>
              <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Feature Breakdown</h2>
              <span className="mx-auto mt-5 block h-1.5 w-28 rounded-full bg-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.5)]" aria-hidden="true" />
            </div>

            <div className="space-y-20 lg:space-y-28">
              {product.featureBlocks.map((feature, index) => (
                <motion.article
                  key={feature.id || feature.title}
                  variants={fadeUp}
                  className="mx-auto max-w-4xl"
                >
                  {feature.image ? (
                    <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "16/9" }}>
                      <div className="absolute inset-0 z-10 rounded-2xl ring-1 ring-inset ring-white/10" />
                      <Image
                        src={feature.image}
                        alt={feature.title || product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 896px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : null}

                  <div className={`${feature.image ? "mt-8" : ""}`}>
                    <div className="mb-4 h-0.5 w-10 bg-gradient-to-r from-[#22D3EE] to-transparent" />
                    <h3 className="text-2xl font-extrabold leading-snug text-white sm:text-3xl lg:text-4xl">
                      {feature.title}
                    </h3>
                    {feature.description ? (
                      <p className="mt-5 text-base leading-8 text-slate-300 lg:text-lg">
                        {feature.description}
                      </p>
                    ) : null}
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
          <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="mt-20 lg:mt-28 relative z-10">
            <div className="absolute bottom-0 left-1/2 z-0 h-52 w-[min(700px,90vw)] -translate-x-1/2 translate-y-1/2 rounded-full bg-[#22D3EE]/[0.06] blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="relative z-20">
              <header className="mb-14 text-center sm:mb-16">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.42em] text-[#22D3EE]">FAQ</p>
                <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl text-white">Product questions</h2>
                <span className="mx-auto mt-5 block h-1.5 w-28 rounded-full bg-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.6)]" aria-hidden="true" />
              </header>
              <div className="space-y-5">
                {product.faqs.map((faq, index) => (
                  <ProductFaqRow key={faq.id || faq.question} faq={faq} index={index} />
                ))}
              </div>
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
