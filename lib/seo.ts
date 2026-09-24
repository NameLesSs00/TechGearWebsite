import type { Metadata } from "next";

export const SITE_CONFIG = {
  name: "Tech Gear Solutions",
  titleTemplate: "%s | Tech Gear Solutions - Software Development Company",
  defaultTitle: "Tech Gear Solutions | Software & Web Development Company",
  defaultDescription:
    "Tech Gear Solutions is a premier technology and software development company in Hurghada, Egypt. We build custom web apps, mobile applications, software systems, UI/UX designs, and digital growth strategies.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://techgearsolutions.com",
  logo: "https://techgearsolutions.com/prompts/home.png", // Company logo fallback
  address: {
    streetAddress: "Metro ST, next to Abdeen pharmacy, El Kawther",
    addressLocality: "Hurghada",
    addressRegion: "Red Sea",
    addressCountry: "EG",
  },
  contact: {
    phone: "+201021164131",
    email: "info@example.com",
  },
  social: {
    facebook: "https://facebook.com/techgearsolutions",
    instagram: "https://instagram.com/techgearsolutions",
    tiktok: "https://tiktok.com/@techgearsolutions",
    twitter: "https://x.com/techgearsolutions",
  },
  keywords: [
    "Software Development Company",
    "Web Development Company",
    "Mobile App Development",
    "Custom Software Development",
    "Website Development",
    "Business Software Solutions",
    "Digital Solutions",
    "Software Development Services",
    "UI/UX Design",
    "SEO Services",
    "Digital Marketing",
    "Hurghada Tech Company",
    "Egypt Software House",
  ],
};

export function getFullUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_CONFIG.siteUrl}${cleanPath === "/" ? "" : cleanPath}`;
}

export function constructMetadata({
  title,
  description,
  path = "",
  image,
  keywords = [],
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
} = {}): Metadata {
  const url = getFullUrl(path);
  const pageTitle = title || SITE_CONFIG.defaultTitle;
  const pageDescription = description || SITE_CONFIG.defaultDescription;
  const ogImage = image || getFullUrl("/prompts/home.png");
  const allKeywords = Array.from(new Set([...SITE_CONFIG.keywords, ...keywords]));

  return {
    metadataBase: new URL(SITE_CONFIG.siteUrl),
    title: title ? { default: title, template: SITE_CONFIG.titleTemplate } : SITE_CONFIG.defaultTitle,
    description: pageDescription,
    keywords: allKeywords,
    authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.siteUrl }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    alternates: {
      canonical: url,
      languages: {
        en: `${url}?lang=en`,
        ar: `${url}?lang=ar`,
        "x-default": url,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: "en_US",
      alternateLocale: ["ar_EG"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
      creator: "@techgearsolutions",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
  };
}

/** JSON-LD Schema Generators **/

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.siteUrl,
    logo: SITE_CONFIG.logo,
    description: SITE_CONFIG.defaultDescription,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_CONFIG.contact.phone,
      contactType: "customer service",
      email: SITE_CONFIG.contact.email,
      availableLanguage: ["English", "Arabic"],
    },
    sameAs: Object.values(SITE_CONFIG.social),
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareHouse",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.siteUrl,
    logo: SITE_CONFIG.logo,
    image: SITE_CONFIG.logo,
    description: SITE_CONFIG.defaultDescription,
    telephone: SITE_CONFIG.contact.phone,
    email: SITE_CONFIG.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "27.1970",
      longitude: "33.8279",
    },
    sameAs: Object.values(SITE_CONFIG.social),
    priceRange: "$$",
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_CONFIG.siteUrl}/projects?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateServiceSchema({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    provider: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.siteUrl,
    },
    url,
    ...(image && { image }),
  };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item.startsWith("http") ? crumb.item : getFullUrl(crumb.item),
    })),
  };
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateProjectSchema({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url,
    ...(image && { image }),
    creator: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
    },
  };
}
