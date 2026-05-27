"use client";

type SpinnerSize = "xs" | "sm" | "md" | "lg";

const sizeClasses: Record<SpinnerSize, string> = {
  xs: "h-3.5 w-3.5 border-2",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-[3px]",
  lg: "h-10 w-10 border-4",
};

export type SpinnerProps = {
  size?: SpinnerSize;
  /** Tailwind text color (used for border-t). Defaults to brand orange. */
  tone?: "brand" | "white" | "muted";
  className?: string;
  label?: string;
};

const toneClasses: Record<NonNullable<SpinnerProps["tone"]>, string> = {
  brand: "border-orange-200 border-t-[#f75d34]",
  white: "border-white/40 border-t-white",
  muted: "border-gray-200 border-t-gray-500",
};

/**
 * Inline loading spinner. Use inside buttons, modals or beside text.
 *
 * For a full-section loader prefer `<PageLoader />`.
 */
export default function Spinner({
  size = "sm",
  tone = "brand",
  className = "",
  label,
}: SpinnerProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label}
      aria-live={label ? "polite" : undefined}
      className={`inline-block animate-spin rounded-full ${sizeClasses[size]} ${toneClasses[tone]} ${className}`}
    />
  );
}
