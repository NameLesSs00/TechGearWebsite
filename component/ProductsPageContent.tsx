"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { productService, type ProductApiItem } from "@/services/productService";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

interface ProductsPageContentProps {
  locale: string;
}

export default function ProductsPageContent({ locale }: ProductsPageContentProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [products, setProducts] = useState<ProductApiItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getProducts(locale, 1, 20);
        setProducts(data);
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
      <div className="mx-auto max-w-[1280px]">
        <nav aria-label="Breadcrumb" className="mb-20 text-center text-sm sm:mb-24 sm:text-base">
          <Link href={`/${locale}`} className="hover:text-[#22D3EE]">{t("nav_home")}</Link>
          <span className="mx-1.5 text-[#22D3EE]">{language === "ar" ? "<" : ">"}</span>
          <span className="text-[#22D3EE]">{t("products_breadcrumb")}</span>
        </nav>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22D3EE]/20 border-t-[#22D3EE]" />
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0a1627] p-8 text-center text-white/70">No products available.</div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {products.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-[28px] border border-white/10 bg-[#f4f7fb] shadow-[0_20px_60px_rgba(15,23,42,0.35)]">
                <div className="relative aspect-[1.42] overflow-hidden border-b border-black/5 bg-[#eef3f8]">
                  {product.photoUrl ? (
                    <Image
                      src={product.photoUrl}
                      alt={product.title || "Product image"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-top"
                      priority={false}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0d2333] to-[#1a4059] text-lg font-bold text-white/80">
                      {product.title}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
                  <h2 className="max-w-[58%] text-xl font-bold leading-tight tracking-tight text-[#03111c] sm:text-2xl lg:text-3xl">
                    {product.title}
                  </h2>
                  <Link
                    href={`/${locale}/products/${product.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-[#22D3EE] px-6 py-3 text-sm font-bold text-[#00121F] transition-transform duration-200 hover:scale-[1.02]"
                  >
                    View Product
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
