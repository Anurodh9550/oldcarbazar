import type { DealRating } from "@/lib/smartCar";

type DealBadgeProps = {
  rating: DealRating;
  /** Show the % difference vs similar cars next to the label. */
  showDiff?: boolean;
  className?: string;
};

/**
 * Small "AI-style" price-fairness pill (Great Deal / Good Price / …) derived
 * from how a car is priced against similar listings.
 */
export default function DealBadge({
  rating,
  showDiff = false,
  className = "",
}: DealBadgeProps) {
  const pct = Math.round(Math.abs(rating.diffPercent) * 100);
  const cheaper = rating.diffPercent < 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm ${rating.badgeClass} ${className}`}
      title={
        cheaper
          ? `About ${pct}% cheaper than similar cars`
          : `About ${pct}% above similar cars`
      }
    >
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
        <path d="M12 2 9.2 8.6 2 9.3l5.4 4.7L5.8 21 12 17.3 18.2 21l-1.6-7 5.4-4.7-7.2-.7z" />
      </svg>
      {rating.label}
      {showDiff && pct > 0 && (
        <span className="font-semibold opacity-90">
          {cheaper ? `−${pct}%` : `+${pct}%`}
        </span>
      )}
    </span>
  );
}
