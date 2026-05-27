"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useListings } from "@/context/ListingsContext";
import ListingImage from "@/components/ListingImage";
// CarDetailPage URLs are simple: /used-cars/<id>
const carDetailPath = (id: string) => `/used-cars/${encodeURIComponent(id)}`;
import { getRecentlyViewedIds } from "@/lib/recentlyViewed";

type Props = {
  /** When provided, this car is filtered out of the widget. */
  excludeId?: string;
  /** Limit how many cards are rendered (default 5). */
  limit?: number;
  className?: string;
};

export default function RecentlyViewedWidget({
  excludeId,
  limit = 5,
  className = "",
}: Props) {
  const { allListings } = useListings();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(getRecentlyViewedIds());
    const refresh = () => setIds(getRecentlyViewedIds());
    window.addEventListener("ocb-recent-changed", refresh);
    return () => window.removeEventListener("ocb-recent-changed", refresh);
  }, []);

  const cars = useMemo(() => {
    const lookup = new Map(allListings.map((l) => [l.id, l]));
    return ids
      .filter((id) => id !== excludeId)
      .map((id) => lookup.get(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .slice(0, limit);
  }, [ids, allListings, excludeId, limit]);

  if (cars.length === 0) return null;

  return (
    <aside
      className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
          Recently Viewed
        </h3>
        <span className="text-[10px] font-semibold text-gray-400">
          {cars.length}
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {cars.map((car) => (
          <li key={car.id}>
            <Link
              href={carDetailPath(car.id)}
              className="group flex items-center gap-3 rounded-xl border border-gray-100 p-2 transition hover:border-[#f75d34]/40 hover:bg-orange-50/40"
            >
              <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <ListingImage
                  src={car.image}
                  alt={car.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-gray-900 group-hover:text-[#f75d34]">
                  {car.title}
                </span>
                <span className="block truncate text-[11px] text-gray-500">
                  {car.specs}
                </span>
                <span className="mt-0.5 block text-xs font-bold text-[#f75d34]">
                  {car.price}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
