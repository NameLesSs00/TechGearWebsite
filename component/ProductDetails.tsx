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
  const hasProductLink = Boolean(
    product.productLink &&
    product.productLink.trim() &&
    product.productLink.trim() !== "#"
  );
  const productHref = hasProductLink ? formatExternalLink(product.productLink) : null;

  const nameParts = (product.name || "").split("|").map((s) => s.trim());
  const primaryTitle = nameParts[0] || "Untitled Product";
  const subtitle = nameParts.length > 1 ? nameParts.slice(1).join(" | ") : null;

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
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0c182b] via-[#081220] to-[#040913] p-6 sm:p-10 lg:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
        >
          {/* Top Bar Navigation & Badge */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-[#22D3EE] backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("product_back_to_products")}
            </Link>

            {product.iconImageUrl ? (
              <div className="flex h-8 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 backdrop-blur-md">
                <Image
                  src={product.iconImageUrl}
                  alt={`${product.name} icon`}
                  width={110}
                  height={26}
                  className="max-h-5 w-auto object-contain"
                  unoptimized
                />
              </div>
            ) : null}
          </div>

          {/* Large Hero Image on Top */}
          {product.heroImageUrl ? (
            <motion.div
              variants={fadeUp}
              className="group relative mb-10 flex w-full items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-b from-[#0a1628] to-[#03070f] p-3 sm:p-6 shadow-2xl ring-1 ring-white/5"
            >
              <Image
                src={product.heroImageUrl}
                alt={product.name}
                width={1600}
                height={1200}
                className="mx-auto block h-auto max-h-[650px] w-auto max-w-full rounded-xl object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]"
                priority
                unoptimized
              />
            </motion.div>
          ) : null}

          {/* Product Info & Copy */}
          <div className="space-y-6">
            <motion.div variants={fadeUp}>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {primaryTitle}
              </h1>

              {subtitle ? (
                <p className="mt-2 text-base font-semibold text-[#22D3EE] sm:text-lg">
                  {subtitle}
                </p>
              ) : null}
            </motion.div>

            {product.description ? (
              <motion.p variants={fadeUp} className="max-w-4xl text-base leading-relaxed text-slate-300/95 sm:text-lg">
                {product.description}
              </motion.p>
            ) : null}

            {product.featuresSummary && product.featuresSummary.length > 0 ? (
              <motion.div variants={fadeUp} className="pt-2">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#22D3EE]">
                  <CheckCircle2 className="h-4 w-4" />
                  {t("product_key_features")}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.featuresSummary.map((feature, index) => (
                    <span
                      key={`${feature.id || index}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#22D3EE]/25 bg-[#22D3EE]/10 px-3.5 py-1.5 text-xs font-medium text-[#22D3EE]"
                    >
                      {feature.text}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : null}

            <motion.div variants={fadeUp} className="pt-4 flex flex-wrap items-center gap-4">
              {hasProductLink && productHref ? (
                <a
                  href={productHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#22D3EE] px-8 py-3.5 text-sm font-extrabold !text-[#011022] transition-colors hover:bg-[#1bb8d0]"
                >
                  {t("product_view_product")}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}

              <Link
                href={`/${locale}/contactus`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10 hover:border-white/25"
              >
                {product.ctaText || "Request Consultation"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {hasFeatures ? (
          <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="mt-20 lg:mt-28">
            <div className="mb-14 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#22D3EE]">{t("product_deep_dive")}</p>
              <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">{t("product_feature_breakdown")}</h2>
              <span className="mx-auto mt-5 block h-1.5 w-28 rounded-full bg-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.5)]" aria-hidden="true" />
            </div>

            {/* Features with Images */}
            {product.featureBlocks.filter(f => !!f.image).length > 0 && (
              <div className="space-y-20 lg:space-y-28 mb-20 lg:mb-28">
                {product.featureBlocks.filter(f => !!f.image).map((feature) => (
                  <motion.article
                    key={feature.id || feature.title}
                    variants={fadeUp}
                    className="mx-auto max-w-4xl"
                  >
                    <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "16/9" }}>
                      <div className="absolute inset-0 z-10 rounded-2xl ring-1 ring-inset ring-white/10" />
                      <Image
                        src={feature.image!}
                        alt={feature.title || product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 896px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="mt-8">
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
            )}

            {/* Features without Images */}
            {product.featureBlocks.filter(f => !f.image).length > 0 && (
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {product.featureBlocks.filter(f => !f.image).map((feature) => (
                  <motion.div
                    key={feature.id || feature.title}
                    variants={fadeUp}
                    className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e1a2b] to-[#08111e] p-8 transition-all duration-300 hover:border-[#22D3EE]/30 hover:shadow-[0_8px_30px_rgba(34,211,238,0.06)]"
                  >
                    <div className="mb-6 h-1 w-12 rounded-full bg-gradient-to-r from-[#22D3EE] to-blue-600" />
                    <h3 className="text-xl font-bold text-white sm:text-2xl">
                      {feature.title}
                    </h3>
                    {feature.description ? (
                      <p className="mt-4 text-sm leading-relaxed text-slate-300/90 sm:text-base">
                        {feature.description}
                      </p>
                    ) : null}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        ) : null}


        {hasReviews ? (
          <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="mt-16">
            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#22D3EE]">{t("product_reviews")}</p>
              <h2 className="mt-3 text-3xl font-extrabold text-white">{t("product_reviews_heading")}</h2>
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
                <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl text-white">{t("product_questions")}</h2>
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
          <h2 className="text-2xl font-extrabold text-white">{t("product_ready_prefix")} {product.name}?</h2>
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
