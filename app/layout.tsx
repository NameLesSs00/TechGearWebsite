import { Rubik } from "next/font/google";
import Header from "../component/header";
import Footer from "../component/Footer";
import WhatsAppButton from "../component/WhatsAppButton";
import { LanguageProvider } from "../context/LanguageContext";
import ClientLanguageSync from "../component/ClientLanguageSync";
import {
  constructMetadata,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateLocalBusinessSchema,
} from "@/lib/seo";

import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["arabic", "latin"],
});

export const metadata = constructMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html
      lang="en"
      dir="ltr"
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
        <LanguageProvider>
          <ClientLanguageSync>
            <Header locale="en" />
            {children}
            <Footer locale="en" />
            <WhatsAppButton />
          </ClientLanguageSync>
        </LanguageProvider>
      </body>
    </html>
  );
}
