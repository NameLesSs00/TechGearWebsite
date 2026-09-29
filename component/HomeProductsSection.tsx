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
                className="grid overflow-hidden rounded-[24px] border border-[#22D3EE]/70 bg-[#1d3140] shadow-[0_24px_70px_rgba(0,0,0,0.32)] lg:grid-cols-[1.1fr_0.9fr]"
              >
                <div className="flex min-h-[400px] flex-col justify-center p-8 sm:p-10 lg:p-14">
                  {product.iconImageUrl ? (
                    <div className="mb-8 flex h-12 w-fit items-center justify-center rounded-full bg-white px-6 shadow-sm">
                      <Image
                        src={product.iconImageUrl}
                        alt={`${product.name || "Product"} icon`}
                        width={140}
                        height={40}
                        className="max-h-8 w-auto object-contain"
                        unoptimized
                      />
                    </div>
                  ) : null}

                  <h3 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">{product.name}</h3>
                  {product.description ? <p className="mt-6 line-clamp-4 text-base leading-8 text-white/90 lg:text-lg">{product.description}</p> : null}

                  {product.featuresSummary && product.featuresSummary.length > 0 ? (
                    <div className="mt-8">
                      <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        {t("product_key_features")}
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {product.featuresSummary.slice(0, 5).map((feature, index) => (
                          <span key={`${feature.id || index}`} className="rounded-full bg-slate-300/80 px-4 py-2 text-sm font-semibold text-[#011022]">
                            {feature.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <Link
                    href={`/${locale}/products/${buildPublicEntitySlug(product.name, product.id)}`}
                    className="mt-10 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-full bg-[#22D3EE] px-7 py-3.5 text-base font-extrabold !text-[#011022] transition-colors hover:bg-[#1bb8d0]"
                  >
                    {t("product_view_product")}
                    <ArrowUpRight className="h-5 w-5" />
                  </Link>
                </div>

                <Link href={`/${locale}/products/${buildPublicEntitySlug(product.name, product.id)}`} className="relative order-first min-h-[350px] bg-[#0f1b29] lg:order-last lg:min-h-[500px] cursor-pointer group block">
                  {product.heroImageUrl ? (
                    <Image
                      src={product.heroImageUrl}
                      alt={product.name || "Product"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 800px"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-6 text-center font-bold text-slate-500 transition-colors group-hover:bg-[#162738]">
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
