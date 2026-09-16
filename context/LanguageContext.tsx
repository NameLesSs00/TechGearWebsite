"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "ar";
export type Direction = "ltr" | "rtl";

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "techgear_language";

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale?: Language;
}

export function LanguageProvider({ children, initialLocale }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLocale || "en");
  const [direction, setDirection] = useState<Direction>(initialLocale === "ar" ? "rtl" : "ltr");
  const [mounted, setMounted] = useState(false);

  // Initialize language from URL locale or localStorage on mount
  useEffect(() => {
    if (initialLocale) {
      // Use the locale from the URL
      setLanguageState(initialLocale);
      setDirection(initialLocale === "ar" ? "rtl" : "ltr");
    } else {
      // Fallback to localStorage
      const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      
      if (storedLanguage === "en" || storedLanguage === "ar") {
        setLanguageState(storedLanguage);
        setDirection(storedLanguage === "ar" ? "rtl" : "ltr");
      }
    }
    
    setMounted(true);
  }, [initialLocale]);

  // Update document attributes and localStorage when language changes
  useEffect(() => {
    if (!mounted) return;

    const newDirection = language === "ar" ? "rtl" : "ltr";
    setDirection(newDirection);

    // Update HTML attributes
    document.documentElement.lang = language;
    document.documentElement.dir = newDirection;

    // Persist to localStorage
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language, mounted]);

  const setLanguage = (newLanguage: Language) => {
    if (newLanguage === "en" || newLanguage === "ar") {
      setLanguageState(newLanguage);
    }
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "en" ? "ar" : "en"));
  };

  const value: LanguageContextType = {
    language,
    direction,
    setLanguage,
    toggleLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  
  return context;
}
