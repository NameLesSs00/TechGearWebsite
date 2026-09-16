"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumb() {
  const pathname = usePathname();

  // Determine breadcrumb items based on current path
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    if (pathname.includes("/work")) {
      return [
        { label: "الرئيسية", href: "/" },
        { label: "أعمالنا", href: "/work" },
      ];
    }
    if (pathname.includes("/aboutus")) {
      return [
        { label: "الرئيسية", href: "/" },
        { label: "من نحن", href: "/aboutus" },
      ];
    }
    if (pathname.includes("/contactus")) {
      return [
        { label: "الرئيسية", href: "/" },
        { label: "اتصل بنا", href: "/contactus" },
      ];
    }
    if (pathname.includes("/products")) {
      return [
        { label: "الرئيسية", href: "/" },
        { label: "المنتجات", href: "/products" },
      ];
    }
    if (pathname.includes("/services")) {
      return [
        { label: "الرئيسية", href: "/" },
        { label: "الخدمات", href: "#" },
      ];
    }
    return [];
  };

  const items = getBreadcrumbItems();

  if (items.length === 0) return null;

  return (
    <nav 
      className="fixed left-5 top-24 z-40 flex flex-col gap-2 sm:left-0 sm:top-28 md:left-0 md:top-32"
      aria-label="Breadcrumb"
    >
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        {items.map((item, index) => (
          <div key={item.href} className="flex items-center gap-2">
            <Link
              href={item.href}
              className={`transition-colors ${
                index === items.length - 1
                  ? "text-[#22D3EE] font-semibold"
                  : "text-[#94A3B8] hover:text-[#22D3EE]"
              }`}
            >
              {item.label}
            </Link>
            {index < items.length - 1 && (
              <span className="text-[#64748B]">/</span>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
