import { useMemo } from "react";
import en from "./en.json";
import ar from "./ar.json";

const translations = {
  en,
  ar,
};

export type TranslationKey = keyof typeof translations.en;

export function useTranslation(language: "en" | "ar") {
  return useMemo(
    () => ({
      t: (key: TranslationKey): string => {
        return translations[language]?.[key] || translations.en[key] || key;
      },
      language,
    }),
    [language]
  );
}
