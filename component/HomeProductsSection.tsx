"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { productService, type ProductApiItem } from "@/services/productService";
import { buildPublicEntitySlug } from "@/lib/apiClient";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

interface HomeProductsSectionProps {
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

export default function HomeProductsSection({ locale }: HomeProductsSectionProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [products, setProducts] = useState<ProductApiItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const list = await productService.getProducts(locale, 1, 2);
        const detailed = await Promise.all(
          list.map(async (product) => {
            const detail = await productService.getProductById(product.id, locale);
            return detail ?? product;
          }),
        );
        setProducts(detailed);
      } catch (error) {
        console.error("Failed to fetch homepage products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [locale]);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-[#000918] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12" aria-labelledby="home-products-heading">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="mx-auto max-w-[1175px]"
      >
        <motion.header variants={fadeUp} className="relative mb-12 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.42em] text-[#22D3EE]">{t("products_label")}</p>
            <h2 id="home-products-heading" className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {t("products_page_heading")}
            </h2>
            <span className="mx-auto mt-5 block h-1.5 w-24 rounded-full bg-[#22D3EE] shadow-[0_0_16px_rgba(34,211,238,0.6)]" aria-hidden="true" />
          </div>
          <Link href={`/${locale}/products`} className="mt-7 inline-flex w-fit items-center gap-2 border-b border-[#22D3EE] pb-1 text-sm font-semibold text-[#22D3EE] transition-colors hover:text-white md:absolute md:bottom-0 md:right-0 md:mt-0">
            {t("view_all")}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.header>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22D3EE]/20 border-t-[#22D3EE]" />
          </div>
        ) : (
          <motion.div 
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid gap-12 lg:grid-cols-1"
          >
            {products.map((product) => (
              <motion.article
                variants={fadeUp}
                key={product.id}
                className="grid overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0c182b] via-[#081220] to-[#040913] shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-300 hover:border-[#22D3EE]/40 hover:shadow-[0_24px_70px_rgba(34,211,238,0.1)] lg:grid-cols-[1.1fr_1fr]"
              >
                <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-12">
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

                  <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">{product.name}</h3>
                  {product.description ? <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-300/90 sm:text-base">{product.description}</p> : null}

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
                    <ArrowUpRight className="h-5 w-5" />
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
      </motion.div>
    </section>
  );
}
