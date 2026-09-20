"use client";

import { motion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends Omit<ComponentProps<typeof motion.button>, "children" | "className"> {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-full border border-transparent px-6 py-3 text-sm font-bold transition-[box-shadow,opacity] ${variant === "primary" ? "bg-[#19CFFC] text-[#011022] hover:shadow-[0_0_20px_rgba(25,207,252,0.4)]" : "bg-white text-[#011022] hover:opacity-85"} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}