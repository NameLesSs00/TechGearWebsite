"use client";

import { ArrowUpRight, Check, Monitor, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { productService, type ProductApiItem } from "@/services/productService";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

interface ProductDetailsData {
  title: string;
  eyebrow: string;
  description: string;
  points: string[];
  image: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  liveDemoUrl?: string;
}

const defaultProductDetails: Record<string, ProductDetailsData> = {
  "hotel-property-management-system": {
    title: "Hotel Property Management System",
    eyebrow: "Operational clarity for modern hospitality teams",
    description: "A complete management experience built to simplify daily operations, improve guest service, and centralize bookings, reporting, and room performance in one place.",
    points: [
      "Live room and booking management",
      "Automated payments and invoice controls",
      "Guest communication and service tracking",
      "Performance dashboards and reporting",
    ],
    image: "",
    icon: Monitor,
    liveDemoUrl: "",
  },
  "restaurant-management-system": {
    title: "Restaurant Management System",
    eyebrow: "Faster service, better insights, better control",
    description: "A smart operations system that helps restaurants manage orders, staff, stock, and customer experience with more accuracy and less manual effort.",
    points: [
      "Order and kitchen workflow management",
      "Inventory and supplier tracking",
      "Table and reservation visibility",
      "Sales analytics and performance trends",
    ],
    image: "",
    icon: Smartphone,
    liveDemoUrl: "",
  },
};

export default function ProductDetails({ locale, productSlug }: { locale: string; productSlug: string }) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [productData, setProductData] = useState<ProductDetailsData>(defaultProductDetails[productSlug] ?? defaultProductDetails["hotel-property-management-system"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await productService.getProductBySlug(productSlug, locale);

        if (product) {
          const icon = product.title.toLowerCase().includes("hotel") || product.title.toLowerCase().includes("property") ? Monitor : Smartphone;
          const mapped: ProductDetailsData = {
            title: product.title || "Product",
            eyebrow: product.title || "Product",
            description: product.description || "A modern product built to simplify daily work and empower your team.",
            points: product.productDetails?.map((item) => item.description) || [],
            image: product.photoUrl || product.productImages?.find((image) => image.imageUrl)?.imageUrl || "",
            icon,
            liveDemoUrl: product.liveDemoUrl || "",
          };

          setProductData(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productSlug, locale]);

  const Icon = productData.icon;
  const productImage = useMemo(() => productData.image, [productData.image]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#000918] px-5 pb-24 pt-32 text-white sm:px-8 sm:pt-40 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <nav aria-label="Breadcrumb" className="mb-20 text-center text-sm sm:mb-28 sm:text-base">
          <Link href={`/${locale}`} className="hover:text-[#22D3EE]">{t("nav_home")}</Link>
          <span className="mx-1 text-white/70">{language === "ar" ? "<" : ">"}</span>
          <Link href={`/${locale}/products`} className="hover:text-[#22D3EE]">{t("products_breadcrumb")}</Link>
          <span className="mx-1 text-white/70">{language === "ar" ? "<" : ">"}</span>
          <span className="text-[#22D3EE]">{productData.title}</span>
        </nav>

        <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <div className="mb-7 flex items-center gap-3 text-[#22D3EE]">
              <Icon size={28} strokeWidth={1.6} />
              <span className="text-xs font-semibold uppercase tracking-[0.25em]">Product</span>
            </div>

            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{productData.eyebrow}</h1>
            <p className="mt-7 max-w-[640px] text-sm leading-relaxed text-white/85 sm:text-base lg:text-lg">{productData.description}</p>

      

            {productData.points.length > 0 && (
              <>
                <h2 className="mt-12 text-2xl font-bold sm:text-3xl">What this product includes</h2>
                <ul className="mt-6 space-y-4">
                  {productData.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm text-white/90 sm:text-base lg:text-lg">
                      <Check size={22} className="text-[#86EFAC]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {productImage ? (
            <div className="relative mx-auto w-full max-w-[620px] overflow-hidden rounded-[28px] border border-white/10 bg-[#eef3f8] shadow-[0_25px_70px_rgba(34,211,238,0.15)]">
              <div className="relative aspect-[1.34]">
                <Image src={productImage} alt={productData.title} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover object-top" />
              </div>
            </div>
          ) : null}
        </section>

        <div className="mt-16 flex justify-center">
          <Link
            href={productData.liveDemoUrl || `/${locale}/contactus`}
            className="inline-flex items-center gap-2 rounded-full bg-[#22D3EE] px-8 py-3.5 text-sm font-bold text-[#00121F] transition-transform hover:scale-105"
          >
            Start a project
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {loading && (
          <div className="mt-10 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22D3EE]/20 border-t-[#22D3EE]" />
          </div>
        )}
      </div>
    </main>
  );
}

