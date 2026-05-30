import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ConditionalFooter from "@/components/ConditionalFooter";
import FloatingCompareWidget from "@/components/FloatingCompareWidget";
import Providers from "@/components/Providers";
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

export const metadata: Metadata = {
  title: "Old Car Bazar | India's Trusted Marketplace for Used Cars",
  description:
    "Discover verified used cars across India. Buy, sell, compare prices, connect with genuine sellers, and find the perfect second-hand car with Old Car Bazar.",

  applicationName: "Old Car Bazar",
  metadataBase: new URL("https://oldcarbazar.com"),
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Old Car Bazar | India's Trusted Marketplace for Used Cars",
    description:
      "Browse thousands of verified used car listings, compare prices, and sell your car quickly. India's growing destination for buying and selling pre-owned vehicles.",
    siteName: "Old Car Bazar",
    type: "website",
    url: "https://oldcarbazar.com",
    locale: "en_IN",
    images: [
      {
        url: "/ocb-logo-icon.png",
        width: 1024,
        height: 1024,
        alt: "Old Car Bazar — Buy, Sell, Drive Better",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Old Car Bazar | India's Trusted Marketplace for Used Cars",
    description:
      "Buy & sell used cars across India. Verified listings, free valuation, instant seller contact.",
    images: ["/ocb-logo-icon.png"],
  },

  verification: {
    google: "o4oLSWNyxwTMFdFjBXWzk7qVR14aHtDZyj8-L6rdpNw",
    other: {
      "msvalidate.01": "B5E7088003E5CA117D9FB3C6C62D4AFB",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f75d34",
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://oldcarbazar.com";

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Old Car Bazar",
  alternateName: "OldCarBazar",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/ocb-logo-icon.png`,
    width: 1024,
    height: 1024,
    caption: "Old Car Bazar",
  },
  image: `${SITE_URL}/ocb-logo-icon.png`,
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
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Old Car Bazar",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/used-cars/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full font-sans antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <Providers>
          <div className="flex-1">{children}</div>
          <FloatingCompareWidget />
          <ConditionalFooter>
            <SiteFooter />
          </ConditionalFooter>
        </Providers>
      </body>
    </html>
  );
}
