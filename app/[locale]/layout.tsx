import { Rubik } from "next/font/google";
import Header from "../../component/header";
import Footer from "../../component/Footer";
import WhatsAppButton from "../../component/WhatsAppButton";
import { LanguageProvider } from "../../context/LanguageContext";
import ClientLanguageSync from "../../component/ClientLanguageSync";
import {
  constructMetadata,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateLocalBusinessSchema,
} from "@/lib/seo";
import ReactQueryProvider from "@/lib/react-query-provider";

import "../globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["arabic", "latin"],
});

export const metadata = constructMetadata();

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";
  
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      className={`${rubik.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-rubik bg-[#000918]">
        <LanguageProvider initialLocale={isArabic ? "ar" : "en"}>
          <ReactQueryProvider>
            <ClientLanguageSync>
              <Header locale={locale} />
              {children}
              <Footer locale={locale} />
              <WhatsAppButton />
            </ClientLanguageSync>
          </ReactQueryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
