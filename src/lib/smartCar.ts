import type { EnrichedCar } from "./carMeta";
import { parseKms, parseTransmission } from "./carMeta";

/**
 * Smart, data-driven helpers for Old Car Bazar. These run entirely on the
 * listings we already have (no external AI/API) but give the site an
 * "intelligent" feel: fair-price detection, EMI maths and a quality score.
 */

export const EMI_DEFAULTS = {
  /** Annual interest rate (%) used across affordability + EMI widgets. */
  interestRate: 9.5,
  /** Default loan tenure in months. */
  tenureMonths: 60,
  /** Default down payment as a fraction of the on-road price. */
  downPaymentPct: 0.2,
};

export type DealRatingId = "great" | "good" | "fair" | "high";

export type DealRating = {
  id: DealRatingId;
  label: string;
  /** Tailwind classes for the badge pill. */
  badgeClass: string;
  /** How far the price sits from the segment median (e.g. -0.15 = 15% cheaper). */
  diffPercent: number;
};

const RATING_META: Record<
  DealRatingId,
  { label: string; badgeClass: string }
> = {
  great: {
    label: "Great Deal",
    badgeClass: "bg-emerald-600 text-white",
  },
  good: {
    label: "Good Price",
    badgeClass: "bg-teal-500 text-white",
  },
  fair: {
    label: "Fair Price",
    badgeClass: "bg-amber-500 text-white",
  },
  high: {
    label: "Priced High",
    badgeClass: "bg-rose-500 text-white",
  },
};

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Compare a car's price against similar cars (same brand + body type, falling
 * back to body type, then the whole peer list) and label how good the deal is.
 * Returns null when there isn't enough comparable data to be meaningful.
 */
export function getDealRating(
  car: EnrichedCar,
  peers: EnrichedCar[]
): DealRating | null {
  if (!car.priceLakh || car.priceLakh <= 0) return null;

  const byBrand = peers.filter(
    (p) => p.id !== car.id && p.brand === car.brand && p.bodyType === car.bodyType
  );
  const byBody = peers.filter((p) => p.id !== car.id && p.bodyType === car.bodyType);
  const group =
    byBrand.length >= 4 ? byBrand : byBody.length >= 4 ? byBody : peers;

  const prices = group
    .filter((p) => p.id !== car.id)
    .map((p) => p.priceLakh)
    .filter((p) => p > 0);

  if (prices.length < 3) return null;

  const mid = median(prices);
  if (mid <= 0) return null;

  const diff = (car.priceLakh - mid) / mid;

  let id: DealRatingId;
  if (diff <= -0.12) id = "great";
  else if (diff <= -0.04) id = "good";
  else if (diff <= 0.08) id = "fair";
  else id = "high";

  return { id, ...RATING_META[id], diffPercent: diff };
}

/** Standard reducing-balance EMI. Returns the monthly instalment in rupees. */
export function calculateEmi(
  principalRupees: number,
  annualRatePct: number,
  months: number
): number {
  if (principalRupees <= 0 || months <= 0) return 0;
  const r = annualRatePct / 12 / 100;
  if (r === 0) return Math.round(principalRupees / months);
  const pow = Math.pow(1 + r, months);
  return Math.round((principalRupees * r * pow) / (pow - 1));
}

/** Monthly EMI for a car at the given (or default) loan terms. */
export function getCarEmi(
  car: EnrichedCar,
  opts: {
    downPaymentPct?: number;
    interestRate?: number;
    tenureMonths?: number;
  } = {}
): number {
  const downPaymentPct = opts.downPaymentPct ?? EMI_DEFAULTS.downPaymentPct;
  const interestRate = opts.interestRate ?? EMI_DEFAULTS.interestRate;
  const tenureMonths = opts.tenureMonths ?? EMI_DEFAULTS.tenureMonths;
  const onRoad = car.priceLakh * 100000;
  const loan = onRoad * (1 - downPaymentPct);
  return calculateEmi(loan, interestRate, tenureMonths);
}

export function formatEmi(rupees: number): string {
  return `₹${Math.round(rupees).toLocaleString("en-IN")}/mo`;
}

export type SmartScore = {
  /** 0–100 overall quality score. */
  score: number;
  /** Short human label for the score band. */
  label: string;
  /** Tailwind text color class for the score. */
  colorClass: string;
  /** Stroke color (hex) for ring/gauge visuals. */
  stroke: string;
};

const OWNERSHIP_POINTS: Record<string, number> = {
  "First owner": 100,
  "Second owner": 75,
  "Third owner": 50,
  "Fourth owner & above": 25,
};

/**
 * A blended "OCB Smart Score" (0–100) using kilometres driven, ownership and
 * how the price compares to similar cars. Higher is better.
 */
export function getSmartScore(
  car: EnrichedCar,
  peers: EnrichedCar[],
  ownership?: string
): SmartScore {
  const kms = parseKms(car.specs);
  // Kms score: 0 km -> 100, 1.2L km -> ~0.
  const kmsScore = Math.max(0, Math.min(100, 100 - (kms / 120000) * 100));

  const ownershipScore = ownership ? OWNERSHIP_POINTS[ownership] ?? 60 : 70;

  const deal = getDealRating(car, peers);
  const dealScore = deal
    ? Math.max(0, Math.min(100, 60 - deal.diffPercent * 200))
    : 65;

  const transmissionBonus = parseTransmission(car.specs) === "Automatic" ? 4 : 0;

  const raw =
    kmsScore * 0.4 + ownershipScore * 0.3 + dealScore * 0.3 + transmissionBonus;
  const score = Math.max(1, Math.min(100, Math.round(raw)));

  let label: string;
  let colorClass: string;
  let stroke: string;
  if (score >= 80) {
    label = "Excellent";
    colorClass = "text-emerald-600";
    stroke = "#059669";
  } else if (score >= 65) {
    label = "Very Good";
    colorClass = "text-teal-600";
    stroke = "#0d9488";
  } else if (score >= 50) {
    label = "Good";
    colorClass = "text-amber-600";
    stroke = "#d97706";
  } else {
    label = "Fair";
    colorClass = "text-rose-600";
    stroke = "#e11d48";
  }

  return { score, label, colorClass, stroke };
}
