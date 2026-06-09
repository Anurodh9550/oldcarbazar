import Image from "next/image";
import type { Ad } from "@/lib/ads";

type AdBannerProps = {
  ad: Ad;
  /** Disable navigation (used in admin preview). */
  preview?: boolean;
};

/**
 * Visual for a single ad. Shared by the live ad slots and the admin preview so
 * the operator sees exactly what visitors get. Always labelled "Ad".
 */
export default function AdBanner({ ad, preview = false }: AdBannerProps) {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    preview ? (
      <div className="block">{children}</div>
    ) : (
      <a
        href={ad.ctaHref || "#"}
        className="block"
        aria-label={ad.title}
        target={ad.ctaHref?.startsWith("http") ? "_blank" : undefined}
        rel={ad.ctaHref?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );

  if (ad.style === "image" && ad.imageUrl) {
    return (
      <Wrapper>
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
          <span className="absolute right-2 top-2 z-10 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            Ad
          </span>
          <div className="relative h-32 w-full sm:h-40">
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-cover transition group-hover:scale-[1.02]"
              sizes="(max-width: 1280px) 100vw, 1280px"
              unoptimized
            />
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-r from-[#fff4ef] via-white to-[#fff4ef] p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:p-5">
        <span className="absolute right-2 top-2 rounded bg-gray-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-500">
          Ad
        </span>
        {ad.imageUrl && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={ad.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="64px"
              unoptimized
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-gray-900">{ad.title}</p>
          {ad.description && (
            <p className="mt-0.5 text-sm text-gray-600">{ad.description}</p>
          )}
        </div>
        {ad.ctaLabel && (
          <span className="shrink-0 rounded-full bg-[#f75d34] px-5 py-2 text-sm font-semibold text-white">
            {ad.ctaLabel}
          </span>
        )}
      </div>
    </Wrapper>
  );
}
