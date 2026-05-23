"use client";

import ListingImage from "@/components/ListingImage";
import ProfileEmptyState from "@/components/profile-hub/ProfileEmptyState";
import { carListings } from "@/data/cars";
import { getCarDetailPath } from "@/lib/carDetail";
import { getShortlistedIds, toggleShortlist } from "@/lib/shortlist";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ShortlistedContent() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(getShortlistedIds());
  }, []);

  const cars = useMemo(
    () => carListings.filter((c) => ids.includes(c.id)),
    [ids]
  );

  if (cars.length === 0) {
    return (
      <ProfileEmptyState
        icon="❤️"
        title="Shortlist is empty"
        description="Explore page par heart icon dabakar cars save karo — woh yahan dikhengi."
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
