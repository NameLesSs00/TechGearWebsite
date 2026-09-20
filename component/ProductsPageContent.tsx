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

  const formatLink = (link: string | null) => {
    if (!link) return "#";
    if (link.startsWith("http://") || link.startsWith("https://")) return link;
    return `https://${link}`;
  };

  return (
    <main className="min-h-screen bg-[#000918] px-5 pb-20 pt-32 text-white sm:px-8 sm:pt-40 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <nav aria-label="Breadcrumb" className="mb-20 text-center text-sm sm:mb-24 sm:text-base">
          <Link href={`/${locale}`} className="hover:text-[#22D3EE] transition-colors">{t("nav_home")}</Link>
          <span className="mx-2 text-[#22D3EE]">{language === "ar" ? "<" : ">"}</span>
          <span className="text-[#22D3EE]">{t("products_breadcrumb")}</span>
        </nav>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22D3EE]/20 border-t-[#22D3EE]" />
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0a1627] p-8 text-center text-white/70">No products available.</div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-2">
            {products.map((product) => (
              <article key={product.id} className="relative flex flex-col overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                {/* Hero Image Section */}
                <div className="relative aspect-[16/10] w-full bg-[#f8fafc]">
                  {product.heroImageUrl ? (
                    <Image
                      src={product.heroImageUrl}
                      alt={product.name || "Product"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-top"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#e2e8f0] to-[#cbd5e1] text-lg font-bold text-slate-500">
                      {product.name}
                    </div>
                  )}
                  
                  {/* Floating Icon Pill */}
                  <div className="absolute right-6 top-6 flex h-[64px] items-center justify-center rounded-[20px] bg-white px-7 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                    <Image 
                      src={product.iconImageUrl || "/logo.svg"} 
                      alt="Product Icon" 
                      width={120} 
                      height={36} 
                      className="h-9 w-auto object-contain" 
                      unoptimized
                    />
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-wrap items-center justify-between gap-5 p-6 sm:flex-nowrap sm:px-9 sm:py-8">
                  <h2 className="flex-1 min-w-[200px] text-[22px] font-bold leading-[1.25] tracking-tight text-[#011022] sm:text-3xl lg:text-[28px]">
                    {product.name}
                  </h2>
                  <a
                    href={formatLink(product.productLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#22D3EE] px-7 py-3.5 sm:px-8 sm:py-3.5 text-[15px] font-bold !text-[#011022] shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 hover:scale-[1.03] hover:bg-[#1bb8d0] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
                  >
                    View Product
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
