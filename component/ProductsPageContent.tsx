"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { productService, type ProductApiItem } from "@/services/productService";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";
import { buildPublicEntitySlug } from "@/lib/apiClient";

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
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.45em] text-[#22D3EE]">{t("products_label")}</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t("products_page_heading")}
          </h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#22D3EE]" />
        </motion.header>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22D3EE]/20 border-t-[#22D3EE]" />
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0a1627] p-8 text-center text-white/70">{t("products_no_data")}</div>
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
                className="grid overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0c182b] via-[#081220] to-[#040913] shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-300 hover:border-[#22D3EE]/40 hover:shadow-[0_24px_70px_rgba(34,211,238,0.1)] lg:grid-cols-[1.1fr_1fr]"
              >
                <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-11">
                  {product.iconImageUrl ? (
                    <div className="mb-6 flex h-8 w-fit items-center justify-center rounded-full border border-white/10 bg-white/5 px-3.5 backdrop-blur-md">
                      <Image
                        src={product.iconImageUrl}
                        alt={`${product.name || "Product"} icon`}
                        width={100}
                        height={24}
                        className="max-h-5 w-auto object-contain"
                        unoptimized
                      />
                    </div>
                  ) : null}

                  <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {product.name || "Untitled Product"}
                  </h2>

                  {product.description ? (
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-300/90 sm:text-base">
                      {product.description}
                    </p>
                  ) : null}

                  {product.featuresSummary && product.featuresSummary.length > 0 ? (
                    <div className="mt-6">
                      <div className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#22D3EE]">
                        <CheckCircle2 className="h-4 w-4" />
                        {t("product_key_features")}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.featuresSummary.slice(0, 5).map((feature, index) => (
                          <span
                            key={`${feature.id || index}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#22D3EE]/25 bg-[#22D3EE]/10 px-3 py-1 text-xs font-medium text-[#22D3EE]"
                          >
                            {feature.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <Link
                    href={`/${locale}/products/${buildPublicEntitySlug(product.name, product.id)}`}
                    className="mt-8 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#22D3EE] px-7 py-3 text-sm font-extrabold !text-[#011022] transition-colors hover:bg-[#1bb8d0]"
                  >
                    {t("product_view_product")}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                <Link
                  href={`/${locale}/products/${buildPublicEntitySlug(product.name, product.id)}`}
                  className="relative order-first min-h-[300px] sm:min-h-[360px] lg:order-last lg:min-h-full w-full overflow-hidden bg-[#070e1a] block group cursor-pointer"
                >
                  {product.heroImageUrl ? (
                    <>
                      <Image
                        src={product.heroImageUrl}
                        alt={product.name || "Product"}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#070e1a] p-6 text-center font-bold text-slate-500">
                      {product.name}
                    </div>
                  )}
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
