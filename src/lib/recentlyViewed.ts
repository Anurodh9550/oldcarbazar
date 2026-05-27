const RECENT_KEY = "oldCarBazar_recentlyViewed";
const MAX_RECENT = 10;

export function getRecentlyViewedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setRecentlyViewedIds(ids: string[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(ids));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ocb-recent-changed"));
  }
}

/**
 * Push a car id to the front of the recently-viewed list.
 * De-duplicates and caps at MAX_RECENT.
 */
export function trackRecentlyViewed(id: string): string[] {
  if (typeof window === "undefined") return [];
  const current = getRecentlyViewedIds().filter((x) => x !== id);
  const next = [id, ...current].slice(0, MAX_RECENT);
  setRecentlyViewedIds(next);
  return next;
}

export function clearRecentlyViewed(): void {
  setRecentlyViewedIds([]);
}

export const RECENT_LIMIT = MAX_RECENT;
