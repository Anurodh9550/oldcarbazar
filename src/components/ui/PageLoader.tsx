"use client";

import Spinner from "./Spinner";

type PageLoaderProps = {
  /** Short message shown under the spinner. */
  message?: string;
  /** Tighter padding for inside cards/modals. */
  compact?: boolean;
  className?: string;
};

/**
 * Centered block-level loading indicator. Use as the placeholder content of a
 * section/page while the initial data is being fetched.
 */
export default function PageLoader({
  message = "Loading…",
  compact = false,
  className = "",
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex w-full flex-col items-center justify-center gap-3 ${
        compact ? "py-8" : "py-16"
      } ${className}`}
    >
      <Spinner size="lg" />
      <p className="text-sm font-medium text-gray-600">{message}</p>
    </div>
  );
}
