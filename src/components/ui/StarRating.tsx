"use client";

import { useState } from "react";

type StarRatingProps = {
  /** Current value (1–5). For display mode this is the rating to show. */
  value: number;
  /** When set, stars become clickable and call this on select. */
  onChange?: (value: number) => void;
  /** Star size in px. */
  size?: number;
  className?: string;
  ariaLabel?: string;
};

function Star({ fill, size }: { fill: number; size: number }) {
  // fill: 0 (empty), 0.5 (half), 1 (full)
  const id = `star-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="#f59e0b" />
          <stop offset={`${fill * 100}%`} stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      <path
        d="M12 2 9.2 8.6 2 9.3l5.4 4.7L5.8 21 12 17.3 18.2 21l-1.6-7 5.4-4.7-7.2-.7z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}

/**
 * Star rating that works in display mode (read-only) or interactive mode
 * (pass `onChange`). Supports hover preview when interactive.
 */
export default function StarRating({
  value,
  onChange,
  size = 18,
  className = "",
  ariaLabel,
}: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === "function";
  const shown = interactive && hover ? hover : value;

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      role={interactive ? "radiogroup" : "img"}
      aria-label={ariaLabel ?? `${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, shown - (i - 1)));
        if (!interactive) {
          return <Star key={i} fill={fill} size={size} />;
        }
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === i}
            aria-label={`${i} star${i > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange?.(i)}
            className="transition-transform hover:scale-110"
          >
            <Star fill={fill >= 0.5 ? 1 : 0} size={size} />
          </button>
        );
      })}
    </div>
  );
}
