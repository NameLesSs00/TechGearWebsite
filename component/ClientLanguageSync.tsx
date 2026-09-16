"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { setApiLanguage } from "@/lib/apiClient";

export default function ClientLanguageSync({ children }: { children: React.ReactNode }) {
  const { language, direction } = useLanguage();

  useEffect(() => {
    setApiLanguage(language);
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  return <>{children}</>;
}
