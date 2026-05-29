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
  title: "Old Car Bazar | Buy & Sell Used Cars in India",
  description:
    "Buy and sell used cars online. Explore verified listings, free valuation, car loan, and sell your car in minutes.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f75d34",
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
