import Image from "next/image";
import { PROMO_THEMES, type PromoOffer } from "@/lib/promoOffer";

type PromoCardProps = {
  offer: PromoOffer;
  onClose?: () => void;
  /** Render the CTA as a plain element (no navigation) for admin previews. */
  preview?: boolean;
  onCtaClick?: (e: React.MouseEvent) => void;
};

/**
 * The visual promo/offer card. Shared by the live popup and the admin preview
 * so what the operator edits is exactly what visitors see.
 */
export default function PromoCard({
  offer,
  onClose,
  preview = false,
  onCtaClick,
}: PromoCardProps) {
  const theme = PROMO_THEMES[offer.theme] ?? PROMO_THEMES.orange;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl shadow-2xl ${theme.card} ${theme.text}`}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close offer"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white transition hover:bg-black/40"
        >
          ✕
        </button>
      )}

      {offer.imageUrl && (
        <div className="relative h-36 w-full bg-black/10 sm:h-44">
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 480px"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      <div className="p-6 sm:p-7">
        {offer.badge && (
          <span
            className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${theme.badge}`}
          >
            {offer.badge}
          </span>
        )}
        <h2 className={`mt-3 text-2xl font-extrabold leading-tight ${theme.text}`}>
          {offer.title}
        </h2>
        {offer.subtitle && (
          <p className="mt-1 text-base font-semibold opacity-95">
            {offer.subtitle}
          </p>
        )}
        {offer.description && (
          <p className="mt-3 text-sm leading-relaxed opacity-90">
            {offer.description}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {preview ? (
            <button
              type="button"
              onClick={onCtaClick}
              className={`rounded-full px-6 py-2.5 text-sm font-bold shadow-sm ${theme.cta}`}
            >
              {offer.ctaLabel || "Learn more"}
            </button>
          ) : (
            <a
              href={offer.ctaHref || "#"}
              onClick={onCtaClick}
              className={`rounded-full px-6 py-2.5 text-sm font-bold shadow-sm ${theme.cta}`}
            >
              {offer.ctaLabel || "Learn more"}
            </a>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-white/80 underline-offset-2 hover:underline"
            >
              No thanks
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
