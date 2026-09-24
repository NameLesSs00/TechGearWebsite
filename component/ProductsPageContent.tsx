"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { productService, type ProductApiItem } from "@/services/productService";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";
import { normalizeSlug } from "@/lib/apiClient";

interface ProductsPageContentProps {
  locale: string;
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
    transition: { staggerChildren: 0.1 },
  },
};

export default function ProductsPageContent({ locale }: ProductsPageContentProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [products, setProducts] = useState<ProductApiItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getProducts(locale, 1, 20);
        const detailedProducts = await Promise.all(
          data.map(async (product) => {
            const detail = await productService.getProductById(product.id, locale);
            return detail ?? product;
          }),
        );
        setProducts(detailedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [locale]);

  return (
    <main className="min-h-screen bg-[#000918] px-5 pb-20 pt-32 text-white sm:px-8 sm:pt-40 lg:px-12">
      <div className="mx-auto max-w-[1120px]">
        <nav aria-label="Breadcrumb" className="mb-14 text-center text-sm sm:mb-16 sm:text-base">
          <Link href={`/${locale}`} className="hover:text-[#22D3EE] transition-colors">{t("nav_home")}</Link>
          <span className="mx-2 text-[#22D3EE]">{language === "ar" ? "<" : ">"}</span>
          <span className="text-[#22D3EE]">{t("products_breadcrumb")}</span>
        </nav>

        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-12 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.45em] text-[#22D3EE]">Our Products</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Digital products built for real world impact.
          </h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#22D3EE]" />
        </motion.header>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22D3EE]/20 border-t-[#22D3EE]" />
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0a1627] p-8 text-center text-white/70">No products available.</div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {products.map((product) => (
              <motion.article
                variants={fadeUp}
                key={product.id}
                className="grid overflow-hidden rounded-[20px] border border-[#22D3EE] bg-[#1d3140] shadow-[0_20px_55px_rgba(0,0,0,0.28)] lg:grid-cols-[1.18fr_1fr]"
              >
                <div className="flex min-h-[360px] flex-col justify-center p-7 sm:p-9">
                  {product.iconImageUrl ? (
                    <div className="mb-7 flex h-9 w-fit items-center justify-center rounded-full bg-white px-4">
                      <Image
                        src={product.iconImageUrl}
                        alt={`${product.name || "Product"} icon`}
                        width={116}
                        height={32}
                        className="max-h-6 w-auto object-contain"
                        unoptimized
                      />
                    </div>
                  ) : null}

                  <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                    {product.name || "Untitled Product"}
                  </h2>

                  {product.description ? (
                    <p className="mt-5 max-w-xl text-sm leading-7 text-white/90 sm:text-base">
                      {product.description}
                    </p>
                  ) : null}

                  {product.featuresSummary && product.featuresSummary.length > 0 ? (
                    <div className="mt-5">
                      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                        Key Features
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.featuresSummary.map((feature, index) => (
                          <span
                            key={`${feature.id || index}`}
                            className="rounded-full bg-slate-300/75 px-3 py-1.5 text-xs font-medium text-[#011022]"
                          >
                            {feature.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <Link
                    href={`/${locale}/products/${normalizeSlug(product.name)}`}
                    className="mt-7 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-[#22D3EE] px-7 py-3 text-sm font-extrabold !text-[#011022] transition-colors hover:bg-[#1bb8d0]"
                  >
                    View Product
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="relative order-first min-h-[280px] bg-[#0f1b29] lg:order-last lg:min-h-[376px]">
                  {product.heroImageUrl ? (
                    <Image
                      src={product.heroImageUrl}
                      alt={product.name || "Product"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 560px"
                      className="object-cover object-center"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#101d2a] text-lg font-bold text-slate-500">
                      {product.name}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
