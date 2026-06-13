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

export type AdStyle = "image" | "banner" | "video";

/** Where the ad runs: the website, the mobile app, or both. */
export type AdPlatform = "web" | "app" | "both";

export type Ad = {
  id: string;
  enabled: boolean;
  /** Internal name to identify the ad in the admin list. */
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  /** Video URL (mp4/webm) shown when style = "video". */
  videoUrl: string;
  ctaLabel: string;
  ctaHref: string;
  /** Pages this ad shows on. */
  pages: AdPageKey[];
  placement: AdPlacement;
  style: AdStyle;
  /** Run on website, mobile app, or both. Defaults to "both". */
  platform: AdPlatform;
};

/** Read an ad's platform safely (older saved ads may not have the field). */
export function adPlatform(ad: Ad): AdPlatform {
  return ad.platform ?? "both";
}

/** Does this ad run on the given platform? ("both" matches everything.) */
export function adMatchesPlatform(ad: Ad, platform: "web" | "app"): boolean {
  const p = adPlatform(ad);
  return p === platform || p === "both";
}

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
  { key: "video", label: "Video banner" },
];

export const AD_PLATFORMS: { key: AdPlatform; label: string }[] = [
  { key: "both", label: "Website + App" },
  { key: "web", label: "Website only" },
  { key: "app", label: "Mobile app only" },
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
    videoUrl: "",
    ctaLabel: "Learn more",
    ctaHref: "/used-cars",
    pages: ["home"],
    placement: "top",
    style: "banner",
    platform: "both",
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
    videoUrl: "",
    ctaLabel: "Sell Now",
    ctaHref: "/sell-car",
    pages: ["home", "used-cars"],
    placement: "top",
    style: "banner",
    platform: "both",
  },
];

/** Ensure every ad has the newer fields, even if it was saved before they existed. */
export function normalizeAd(ad: Partial<Ad>): Ad {
  return {
    ...makeEmptyAd(),
    ...ad,
    platform: (ad.platform as AdPlatform) ?? "both",
  };
}

export function normalizeAds(ads: Partial<Ad>[]): Ad[] {
  return Array.isArray(ads) ? ads.map(normalizeAd) : [];
}

export function getAds(): Ad[] {
  if (typeof window === "undefined") return defaultAds;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAds;
    const parsed = JSON.parse(raw) as Ad[];
    return Array.isArray(parsed) ? normalizeAds(parsed) : defaultAds;
  } catch {
    return defaultAds;
  }
}

/** Overwrite the local ad cache (used after loading from the backend). */
export function setLocalAds(ads: Ad[]): Ad[] {
  if (typeof window === "undefined") return ads;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
  window.dispatchEvent(new Event(ADS_CHANGED_EVENT));
  return ads;
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

/** Enabled ads that target the given page + placement on the given platform. */
export function getAdsForPage(
  ads: Ad[],
  page: AdPageKey,
  placement: AdPlacement,
  platform: "web" | "app" = "web"
): Ad[] {
  return ads.filter(
    (ad) =>
      ad.enabled &&
      ad.placement === placement &&
      adMatchesPlatform(ad, platform) &&
      (ad.pages.includes(page) || ad.pages.includes("all"))
  );
}
