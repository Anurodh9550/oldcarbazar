"use client";

import LogoLoader from "./LogoLoader";

type PageLoaderProps = {
  /** Short message shown under the logo. */
  message?: string;
  /** Tighter padding for inside cards/modals. */
  compact?: boolean;
  className?: string;
};

/**
 * Centered block-level loading indicator showing the Old Car Bazar logo. Use as
 * the placeholder content of a section/page while initial data is being fetched.
 */
export default function PageLoader({
  message = "Loading…",
  compact = false,
  className = "",
}: PageLoaderProps) {
  return (
    <LogoLoader message={message} compact={compact} className={className} />
  );
}
