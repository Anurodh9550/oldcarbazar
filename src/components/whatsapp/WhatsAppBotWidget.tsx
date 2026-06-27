"use client";

import { usePathname } from "next/navigation";
import { useLanguage, useSiteCopy } from "@/context/LanguageContext";
import { useLocation } from "@/context/LocationContext";
import { openWhatsAppBot } from "@/lib/whatsappBot";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function WhatsAppBotWidget() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const copy = useSiteCopy();
  const { selectedCity } = useLocation();

  if (pathname?.startsWith("/admin") || pathname === "/whatsapp-sell") {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-4 z-50 sm:bottom-6 sm:left-6">
      <button
        type="button"
        onClick={() =>
          openWhatsAppBot({ intent: "sell", language, city: selectedCity })
        }
        className="group flex items-center gap-2 rounded-full bg-emerald-600 py-2.5 pl-3 pr-4 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-500 hover:shadow-xl"
        title={copy.whatsapp.widgetTitle}
        aria-label={copy.whatsapp.widgetTitle}
      >
        <WhatsAppIcon size={22} variant="light" aria-hidden />
        <span className="hidden sm:inline">{copy.whatsapp.widgetLabel}</span>
      </button>
    </div>
  );
}
