const STORAGE_KEY = "oldCarBazar_promoOffer";
const DISMISS_KEY = "oldCarBazar_promoOffer_dismissed";
export const PROMO_CHANGED_EVENT = "ocb-promo-changed";

export type PromoTheme = "orange" | "dark" | "green" | "blue";

export const PROMO_THEMES: Record<
  PromoTheme,
  { label: string; card: string; badge: string; cta: string; text: string }
> = {
  orange: {
    label: "Orange",
    card: "bg-gradient-to-br from-[#f75d34] to-[#ff8a5c]",
    badge: "bg-white/25 text-white",
    cta: "bg-white text-[#f75d34] hover:bg-orange-50",
    text: "text-white",
  },
  dark: {
    label: "Dark",
    card: "bg-gradient-to-br from-[#0f172a] to-[#1e293b]",
    badge: "bg-[#f75d34]/20 text-orange-200",
    cta: "bg-[#f75d34] text-white hover:bg-[#e54d24]",
    text: "text-white",
  },
  green: {
    label: "Green",
    card: "bg-gradient-to-br from-emerald-600 to-teal-500",
    badge: "bg-white/25 text-white",
    cta: "bg-white text-emerald-700 hover:bg-emerald-50",
    text: "text-white",
  },
  blue: {
    label: "Blue",
    card: "bg-gradient-to-br from-blue-600 to-indigo-500",
    badge: "bg-white/25 text-white",
    cta: "bg-white text-blue-700 hover:bg-blue-50",
    text: "text-white",
  },
};

export type PromoOffer = {
  /** Master switch — when false the popup never shows. */
  enabled: boolean;
  /** Small pill label above the title, e.g. "LIMITED OFFER". */
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  /** Optional banner image URL shown at the top of the card. */
  imageUrl: string;
  theme: PromoTheme;
  /** Seconds to wait before showing the popup after page load. */
  delaySeconds: number;
  /** Days to keep the popup hidden after a user dismisses it. */
  dismissDays: number;
  /**
   * Bumped automatically on every admin save so an edited offer re-appears
   * even for users who previously dismissed an older version.
   */
  version: number;
};

export const defaultPromoOffer: PromoOffer = {
  enabled: true,
  badge: "LIMITED OFFER",
  title: "Festive Season Dhamaka! 🎉",
  subtitle: "Up to ₹50,000 off on assured cars",
  description:
    "Buy your dream used car this festive season with zero processing fee and free RC transfer. Limited period offer across all cities.",
  ctaLabel: "Explore Offers",
  ctaHref: "/used-cars",
  imageUrl: "",
  theme: "orange",
  delaySeconds: 2,
  dismissDays: 1,
  version: 1,
};

export function mergePromoOffer(partial: Partial<PromoOffer> | null): PromoOffer {
  return { ...defaultPromoOffer, ...(partial ?? {}) };
}

export function getPromoOffer(): PromoOffer {
  if (typeof window === "undefined") return defaultPromoOffer;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPromoOffer;
    return mergePromoOffer(JSON.parse(raw) as Partial<PromoOffer>);
  } catch {
    return defaultPromoOffer;
  }
}

export function savePromoOffer(offer: PromoOffer): PromoOffer {
  if (typeof window === "undefined") return offer;
  const next: PromoOffer = { ...offer, version: (offer.version ?? 0) + 1 };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(PROMO_CHANGED_EVENT));
  return next;
}

export function resetPromoOffer(): PromoOffer {
  if (typeof window === "undefined") return defaultPromoOffer;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(PROMO_CHANGED_EVENT));
  return defaultPromoOffer;
}

type DismissRecord = { version: number; at: number };

function readDismiss(): DismissRecord | null {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    return raw ? (JSON.parse(raw) as DismissRecord) : null;
  } catch {
    return null;
  }
}

/** Should the popup be shown for this offer right now? */
export function shouldShowPromo(offer: PromoOffer): boolean {
  if (!offer.enabled) return false;
  const record = readDismiss();
  if (!record) return true;
  // A newer offer version always re-shows.
  if (record.version !== offer.version) return true;
  const elapsedDays = (Date.now() - record.at) / (1000 * 60 * 60 * 24);
  return elapsedDays >= offer.dismissDays;
}

export function dismissPromo(offer: PromoOffer): void {
  if (typeof window === "undefined") return;
  const record: DismissRecord = { version: offer.version, at: Date.now() };
  localStorage.setItem(DISMISS_KEY, JSON.stringify(record));
}
