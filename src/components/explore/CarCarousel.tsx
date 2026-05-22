"use client";

import { useRef } from "react";
import type { EnrichedCar } from "@/lib/carMeta";
import ExploreCarCard from "./ExploreCarCard";

type CarCarouselProps = {
  cars: EnrichedCar[];
  viewAllLabel?: string;
  onViewAll?: () => void;
  showDiscount?: boolean;
  showActions?: boolean;
  partnerLabel?: string;
};

export default function CarCarousel({
  cars,
  viewAllLabel,
  onViewAll,
  showDiscount,
  showActions,
  partnerLabel,
}: CarCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  if (cars.length === 0) {
    return (
      <p className="py-8 text-center text-caption sm:text-sm">
        No cars found in this category.
      </p>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md hover:bg-gray-50 lg:flex"
        aria-label="Scroll left"
      >
        ‹
      </button>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
      >
        {cars.map((car) => (
          <ExploreCarCard
            key={car.id}
            car={car}
            showDiscount={showDiscount}
            showActions={showActions}
            partnerLabel={partnerLabel}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md hover:bg-gray-50"
        aria-label="Scroll right"
      >
        ›
      </button>
      {viewAllLabel && (
        <button
          type="button"
          onClick={onViewAll}
          className="mt-4 text-sm font-semibold text-[#f75d34] hover:underline"
        >
          {viewAllLabel}
        </button>
      )}
    </div>
  );
}
