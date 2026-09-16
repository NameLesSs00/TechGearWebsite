import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  active?: boolean;
  hasDropdown?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function NavLink({
  href,
  children,
  active = false,
  hasDropdown = false,
  onClick,
  className = "",
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-white/90 transition-colors hover:text-[#10EDFD] ${active ? "text-[#10EDFD] after:absolute after:-bottom-2.5 after:left-0 after:h-0.5 after:w-full after:bg-[#19CFFC] after:shadow-[0_0_10px_rgba(25,207,252,0.65)]" : ""} ${className}`}
    >
      {children}
      {hasDropdown && <ChevronDown className="nav-chevron" size={16} strokeWidth={2.2} />}
    </Link>
  );
}