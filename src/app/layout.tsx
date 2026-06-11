import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ConditionalFooter from "@/components/ConditionalFooter";
import FloatingCompareWidget from "@/components/FloatingCompareWidget";
import Providers from "@/components/Providers";
import PromoPopup from "@/components/promo/PromoPopup";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://oldcarbazar.com";

// Single source of truth so the brand name stays identical everywhere Google
// looks for it (metadata, og:site_name, and structured data).
const SITE_NAME = "Old Car Bazar";
const ALT_NAME = "OldCarBazar";
const LOGO_URL = `${SITE_URL}/logocar.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // Root/home title is absolute on purpose: child routes already supply their
  // own "<Page> | Old Car Bazar" titles, so we avoid a title.template here to
  // prevent a duplicated " | Old Car Bazar | Old Car Bazar" suffix.
  title: "Old Car Bazar | India's Trusted Marketplace for Used Cars",
  description:
    "Discover verified used cars across India. Buy, sell, compare prices, connect with genuine sellers, and find the perfect second-hand car with Old Car Bazar.",

  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Automotive",
  referrer: "origin-when-cross-origin",
  keywords: [
    "old car bazar",
    "oldcarbazar",
    "used cars",
    "second hand cars",
    "buy used cars India",
    "sell used car",
    "pre-owned cars",
    "used car marketplace",
    "used car price",
    "car valuation",
    "used car loan",
  ],

  alternates: {
    canonical: "/",
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Old Car Bazar | India's Trusted Marketplace for Used Cars",
    description:
      "Browse thousands of verified used car listings, compare prices, and sell your car quickly. India's growing destination for buying and selling pre-owned vehicles.",
    url: SITE_URL,
    locale: "en_IN",
    // og:image is supplied automatically by src/app/opengraph-image.tsx.
  },

  twitter: {
    card: "summary_large_image",
    site: "@oldcarbazar",
    creator: "@oldcarbazar",
    title: "Old Car Bazar | India's Trusted Marketplace for Used Cars",
    description:
      "Buy & sell used cars across India. Verified listings, free valuation, instant seller contact.",
    // twitter:image is supplied automatically by src/app/opengraph-image.tsx.
  },

  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  verification: {
    google: "o4oLSWNyxwTMFdFjBXWzk7qVR14aHtDZyj8-L6rdpNw",
    other: {
      "msvalidate.01": "B5E7088003E5CA117D9FB3C6C62D4AFB",
    },
  },

  // NOTE: favicon/apple-icon and the web manifest are intentionally NOT set
  // here. Next.js 16 detects src/app/icon.png, src/app/apple-icon.png and
  // src/app/manifest.ts as file conventions and injects the corresponding
  // <link rel="icon" | "apple-touch-icon" | "manifest"> tags automatically.
  // File conventions take precedence over the config `icons`/`manifest`
  // fields, so re-declaring them here would be redundant (and risks
  // duplicate/conflicting tags).
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f75d34",
};

// One JSON-LD @graph so Google can resolve a single, connected entity.
// The Organization is the publisher of the WebSite, and the AutoDealer is a
// child of the Organization — all wired together with @id references. The
// WebSite node (with name + alternateName) is the primary signal Google uses
// to show "Old Car Bazar" as the site name instead of the bare domain.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: ALT_NAME,
      legalName: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: LOGO_URL,
        contentUrl: LOGO_URL,
        width: 1024,
        height: 1024,
        caption: SITE_NAME,
      },
      image: { "@id": `${SITE_URL}/#logo` },
      description:
        "India's marketplace for buying & selling used cars with direct owner contact, free valuation, car loan, and verified listings.",
      slogan: "Buy. Sell. Drive Better.",
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: ["English", "Hindi"],
        areaServed: "IN",
      },
      sameAs: [
        "https://www.facebook.com/oldcarbazar",
        "https://www.instagram.com/oldcarbazar",
        "https://twitter.com/oldcarbazar",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: ALT_NAME,
      url: SITE_URL,
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/used-cars/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "AutoDealer",
      "@id": `${SITE_URL}/#autodealer`,
      name: SITE_NAME,
      alternateName: ALT_NAME,
      url: SITE_URL,
      image: LOGO_URL,
      logo: { "@id": `${SITE_URL}/#logo` },
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
      priceRange: "₹₹",
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      // For full LocalBusiness/AutoDealer rich-result eligibility, add a real
      // physical `address` (PostalAddress) and `telephone` below.
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
      sameAs: [
        "https://www.facebook.com/oldcarbazar",
        "https://www.instagram.com/oldcarbazar",
        "https://twitter.com/oldcarbazar",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full font-sans antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <Providers>
          <div className="flex-1">{children}</div>
          <PromoPopup />
          <FloatingCompareWidget />
          <ConditionalFooter>
            <SiteFooter />
          </ConditionalFooter>
        </Providers>
      </body>
    </html>
  );
}
