"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ADS_CHANGED_EVENT,
  getAds,
  getAdsForPage,
  type Ad,
  type AdPageKey,
  type AdPlacement,
} from "@/lib/ads";
import AdBanner from "./AdBanner";

type AdSlotProps = {
  /** Which page this slot lives on. */
  page: AdPageKey;
  /** Where on the page this slot sits. */
  placement: AdPlacement;
  className?: string;
};

/**
 * Renders any admin-configured ads that target this page + placement. Shows
 * nothing when there are no matching ads, and never renders on admin routes.
 */
export default function AdSlot({ page, placement, className = "" }: AdSlotProps) {
  const pathname = usePathname();
  const [ads, setAds] = useState<Ad[]>([]);

  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    const refresh = () => setAds(getAdsForPage(getAds(), page, placement));
    refresh();
    window.addEventListener(ADS_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(ADS_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [isAdmin, page, placement]);

  if (isAdmin || ads.length === 0) return null;

  return (
    <div className={`mx-auto w-full max-w-[1280px] px-4 lg:px-6 ${className}`}>
      <div className="space-y-3">
        {ads.map((ad) => (
          <AdBanner key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  );
}
