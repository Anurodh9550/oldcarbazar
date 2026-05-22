"use client";

import ListingImage from "@/components/ListingImage";
import Link from "next/link";
import type { EnrichedCar } from "@/lib/carMeta";
import { getCarDetailPath } from "@/lib/carDetail";
import { HeartIcon } from "../icons";
import WhatsAppIcon from "../WhatsAppIcon";

function formatOriginalPrice(lakh: number) {
  return lakh >= 100
    ? `₹${(lakh / 100).toFixed(2)} Cr`
    : `₹${lakh.toFixed(2)} Lakh`;
}

type ExploreCarCardProps = {
  car: EnrichedCar;
  showDiscount?: boolean;
  showActions?: boolean;
  partnerLabel?: string;
  layout?: "carousel" | "grid";
};

export default function ExploreCarCard({
  car,
  showDiscount = false,
  showActions = false,
  partnerLabel,
  layout = "carousel",
}: ExploreCarCardProps) {
  const showDeal = showDiscount && car.isDiscounted && car.originalPriceLakh;
  const detailHref = getCarDetailPath(car.id);
  const whatsappHref = `https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I'm interested in ${car.title} on Old Car Bazar.`)}`;

  return (
    <article
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md ${
        layout === "carousel" ? "w-[260px] shrink-0 sm:w-[280px]" : "w-full"
      }`}
    >
      <Link href={detailHref} className="block">
        <div className="relative aspect-[4/3] bg-gray-100">
          <ListingImage src={car.image} alt={car.title} fill className="object-cover" sizes="280px" />
          {showDeal && (
            <span className="absolute left-2 top-2 rounded bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white">
              Discounted
            </span>
          )}
          {!showDeal && car.badge && (
            <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
              {car.badge}
            </span>
          )}
          {partnerLabel && (
            <span className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-gray-800">
              {partnerLabel}
            </span>
          )}
        </div>

        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="card-title line-clamp-2 flex-1 leading-snug">{car.title}</h3>
            <span
              role="button"
              tabIndex={0}
              aria-label="Add to wishlist"
              onClick={(e) => {
                e.preventDefault();
              }}
              className="shrink-0 text-gray-400 hover:text-[#f75d34]"
            >
              <HeartIcon className="h-4 w-4" />
            </span>
          </div>

          <p className="mt-1 text-caption">{car.specs}</p>

          <div className="mt-2">
            <p className="text-base font-bold text-gray-900">{car.price}</p>
            {showDeal && car.originalPriceLakh && (
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-400 line-through">
                  {formatOriginalPrice(car.originalPriceLakh)}
                </span>
                {car.savingsLabel && (
                  <span className="font-semibold text-green-600">{car.savingsLabel}</span>
                )}
              </div>
            )}
          </div>

          <p className="mt-2 flex items-center gap-1 text-caption">
            <span aria-hidden>📍</span>
            {car.area}
          </p>
        </div>
      </Link>

      {showActions && (
        <div className="flex gap-2 px-3 pb-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50"
          >
            <WhatsAppIcon size={16} />
            Chat
          </a>
          <Link
            href={detailHref}
            className="flex flex-1 items-center justify-center rounded-lg bg-[#f75d34] py-2 text-xs font-semibold text-white hover:bg-[#e54d24]"
          >
            View Details
          </Link>
        </div>
      )}
    </article>
  );
}
