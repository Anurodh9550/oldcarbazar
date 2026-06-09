const STORAGE_KEY = "oldCarBazar_ads";
export const ADS_CHANGED_EVENT = "ocb-ads-changed";

export type AdPlacement = "top" | "inline" | "footer";

/** Pages where an ad can be targeted. "all" = every supported page. */
export type AdPageKey =
  | "all"
  | "home"
  | "used-cars"
  | "search"
  | "car-detail"
  | "dealers";

export type AdStyle = "image" | "banner";

export type Ad = {
  id: string;
  enabled: boolean;
  /** Internal name to identify the ad in the admin list. */
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
  /** Pages this ad shows on. */
  pages: AdPageKey[];
  placement: AdPlacement;
  style: AdStyle;
};

export const AD_PAGES: { key: AdPageKey; label: string }[] = [
  { key: "all", label: "All pages" },
  { key: "home", label: "Home page" },
  { key: "used-cars", label: "Used cars (explore)" },
  { key: "search", label: "Search results" },
  { key: "car-detail", label: "Car detail" },
  { key: "dealers", label: "Dealers" },
];

export const AD_PLACEMENTS: { key: AdPlacement; label: string }[] = [
  { key: "top", label: "Top of page" },
  { key: "inline", label: "Inline (within content)" },
  { key: "footer", label: "Above footer" },
];

export const AD_STYLES: { key: AdStyle; label: string }[] = [
  { key: "banner", label: "Text banner" },
  { key: "image", label: "Image banner" },
];

function makeId(): string {
  return `ad-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function makeEmptyAd(): Ad {
  return {
    id: makeId(),
    enabled: true,
    name: "New ad",
    title: "Your ad headline here",
    description: "Short supporting line for the ad.",
    imageUrl: "",
    ctaLabel: "Learn more",
    ctaHref: "/used-cars",
    pages: ["home"],
    placement: "top",
    style: "banner",
  };
}

export const defaultAds: Ad[] = [
  {
    id: "ad-sample-1",
    enabled: false,
    name: "Sample — Sell your car",
    title: "Sell your car at the best price 🚗",
    description: "List for free and reach thousands of verified buyers near you.",
    imageUrl: "",
    ctaLabel: "Sell Now",
    ctaHref: "/sell-car",
    pages: ["home", "used-cars"],
    placement: "top",
    style: "banner",
  },
];

export function getAds(): Ad[] {
  if (typeof window === "undefined") return defaultAds;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAds;
    const parsed = JSON.parse(raw) as Ad[];
    return Array.isArray(parsed) ? parsed : defaultAds;
  } catch {
    return defaultAds;
  }
}

export function saveAds(ads: Ad[]): Ad[] {
  if (typeof window === "undefined") return ads;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
  window.dispatchEvent(new Event(ADS_CHANGED_EVENT));
  return ads;
}

export function resetAds(): Ad[] {
  if (typeof window === "undefined") return defaultAds;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(ADS_CHANGED_EVENT));
  return defaultAds;
}

/** Enabled ads that target the given page + placement. */
export function getAdsForPage(
  ads: Ad[],
  page: AdPageKey,
  placement: AdPlacement
): Ad[] {
  return ads.filter(
    (ad) =>
      ad.enabled &&
      ad.placement === placement &&
      (ad.pages.includes(page) || ad.pages.includes("all"))
  );
}
