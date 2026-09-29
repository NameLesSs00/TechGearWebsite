"use client";

import { Toaster } from "sonner";

export default function AdminToastViewport() {
  return (
    <Toaster
      closeButton
      richColors
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "border-white/10 bg-[#001432] text-white shadow-2xl shadow-black/30",
          title: "text-sm font-semibold",
          description: "text-sm text-slate-300",
          closeButton: "bg-[#000918] text-white border-white/10",
        },
      }}
    />
  );
}
