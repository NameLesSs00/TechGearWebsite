import { LanguageProvider } from "../../context/LanguageContext";

import "../globals.css";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <LanguageProvider initialLocale={locale === "ar" ? "ar" : "en"}>
      {children}
    </LanguageProvider>
  );
}
