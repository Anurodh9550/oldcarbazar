"use client";

import ListingImage from "@/components/ListingImage";
import ProfileEmptyState from "@/components/profile-hub/ProfileEmptyState";
import { useListings } from "@/context/ListingsContext";
import { getCarDetailPath } from "@/lib/carDetail";
import { getShortlistedIds, toggleShortlist } from "@/lib/shortlist";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ShortlistedContent() {
  const { allListings, loading } = useListings();
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(getShortlistedIds());
    setHydrated(true);
  }, []);

  const cars = useMemo(
    () => allListings.filter((c) => ids.includes(c.id)),
    [allListings, ids]
  );

  if (!hydrated || (loading && cars.length === 0)) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center text-sm text-gray-500">
        Loading your shortlist…
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <ProfileEmptyState
        icon="❤️"
        title="Shortlist is empty"
        description="Tap the heart icon on any car on the Explore page to save it — they'll show up here."
        actionLabel="Explore cars"
        actionHref="/used-cars"
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <article
          key={car.id}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <Link href={getCarDetailPath(car.id)} className="block">
            <div className="relative aspect-[4/3] bg-gray-100">
              <ListingImage src={car.image} alt={car.title} fill className="object-cover" sizes="320px" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{car.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{car.specs}</p>
              <p className="mt-2 font-bold text-[#f75d34]">{car.price}</p>
            </div>
          </Link>
          <div className="border-t border-gray-100 px-4 py-3">
            <button
              type="button"
              onClick={() => setIds(toggleShortlist(car.id))}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Remove from shortlist
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
