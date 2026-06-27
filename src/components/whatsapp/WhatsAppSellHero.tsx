"use client";

import { useSiteCopy } from "@/context/LanguageContext";

export default function WhatsAppSellHero() {
  const copy = useSiteCopy();

  return (
    <div className="page-hero relative overflow-hidden bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-gray-900 to-gray-900" />
      <div className="relative mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:py-14">
        <p className="eyebrow-dark">{copy.whatsapp.pageBadge}</p>
        <h1 className="hero-title max-w-2xl">{copy.whatsapp.pageTitle}</h1>
        <p className="hero-lead mt-3 max-w-xl">{copy.whatsapp.pageSubtitle}</p>
      </div>
    </div>
  );
}
