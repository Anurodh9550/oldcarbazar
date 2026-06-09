const REVIEWS_KEY = "oldCarBazar_carReviews";
export const REVIEWS_CHANGED_EVENT = "ocb-reviews-changed";

export type UserReview = {
  id: string;
  carId: string;
  name: string;
  rating: number; // 1–5
  title: string;
  text: string;
  createdAt: number;
};

type ReviewStore = Record<string, UserReview[]>;

function readAll(): ReviewStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    const parsed = raw ? (JSON.parse(raw) as ReviewStore) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(store: ReviewStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(REVIEWS_CHANGED_EVENT));
}

export function getUserReviews(carId: string): UserReview[] {
  const all = readAll();
  const list = all[carId] ?? [];
  return [...list].sort((a, b) => b.createdAt - a.createdAt);
}

export function addUserReview(
  carId: string,
  input: { name: string; rating: number; title: string; text: string }
): UserReview[] {
  if (typeof window === "undefined") return [];
  const all = readAll();
  const review: UserReview = {
    id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    carId,
    name: input.name.trim() || "Anonymous",
    rating: Math.max(1, Math.min(5, Math.round(input.rating))),
    title: input.title.trim(),
    text: input.text.trim(),
    createdAt: Date.now(),
  };
  all[carId] = [review, ...(all[carId] ?? [])];
  writeAll(all);
  return getUserReviews(carId);
}

/**
 * Blend stored user reviews with a seed average/count (e.g. the static model
 * rating shown on the page) to produce a single combined rating + total.
 */
export function getCombinedRating(
  userReviews: UserReview[],
  seedAverage = 0,
  seedCount = 0
): { average: number; count: number } {
  const userSum = userReviews.reduce((acc, r) => acc + r.rating, 0);
  const totalCount = seedCount + userReviews.length;
  if (totalCount === 0) return { average: 0, count: 0 };
  const totalSum = seedAverage * seedCount + userSum;
  return {
    average: Math.round((totalSum / totalCount) * 10) / 10,
    count: totalCount,
  };
}
