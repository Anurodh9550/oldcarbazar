"use client";

import Image from "next/image";

type LogoLoaderProps = {
  /** Short message shown under the logo. */
  message?: string;
  /** Cover the whole viewport with a backdrop (use while a page is processing). */
  fullScreen?: boolean;
  /** Tighter padding for inside cards/sections. */
  compact?: boolean;
  className?: string;
};

/**
 * Branded loading indicator that shows the Old Car Bazar logo with an animated
 * progress bar. Use it whenever the site is processing or searching.
 */
export default function LogoLoader({
  message = "Loading…",
  fullScreen = false,
  compact = false,
  className = "",
}: LogoLoaderProps) {
  const content = (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`flex w-full flex-col items-center justify-center gap-4 ${
        fullScreen ? "py-0" : compact ? "py-8" : "py-16"
      } ${className}`}
    >
      <Image
        src="/logocarr-trans.png"
        alt="Old Car Bazar"
        width={220}
        height={60}
        priority
        className="ocb-logo-pulse h-10 w-auto object-contain sm:h-12"
      />
      <div className="ocb-loader-bar h-1.5 w-40 rounded-full bg-orange-100" />
      <p className="text-sm font-medium text-gray-600">{message}</p>
    </div>
  );

  if (!fullScreen) return content;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/85 backdrop-blur-sm">
      {content}
    </div>
  );
}
