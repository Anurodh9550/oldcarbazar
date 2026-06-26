"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { EnrichedCar } from "@/lib/carMeta";
import { filterRecentByBudget } from "@/lib/carMeta";
import { recentBudgetTabs, sellCarCities } from "@/data/explorePage";
import CarCarousel from "./CarCarousel";
import ExploreCarCard from "./ExploreCarCard";

type UsedCarsBottomSectionsProps = {
  cityCars: EnrichedCar[];
  enriched: EnrichedCar[];
  selectedCity: string;
};

export default function UsedCarsBottomSections({
  cityCars,
  enriched,
  selectedCity,
}: UsedCarsBottomSectionsProps) {
  const [recentBudget, setRecentBudget] = useState("0-3");

  const recentCars = useMemo(() => {
    const sorted = [...cityCars].sort(
      (a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0)
    );
    const filtered = filterRecentByBudget(sorted, recentBudget);
    return filtered.length ? filtered : filterRecentByBudget(enriched, recentBudget);
  }, [cityCars, enriched, recentBudget]);

  const discountedCars = useMemo(
    () =>
      (cityCars.length ? cityCars : enriched)
        .filter((c) => c.isDiscounted)
        .slice(0, 8),
    [cityCars, enriched]
  );

  const freshCount = cityCars.length || enriched.length;

  return (
    <>
      {/* Recommended with discount styling */}
      <section className="mb-14">
        <h2 className="section-title">Recommended Cars</h2>
        <div className="mt-6">
          <CarCarousel
            cars={cityCars.length ? cityCars.slice(0, 10) : enriched.slice(0, 10)}
            showDiscount
            showActions
            partnerLabel="Old Car Bazar"
            viewAllLabel={`View All Cars in ${selectedCity}`}
            viewAllHref={`/used-cars/search?city=${encodeURIComponent(selectedCity)}`}
          />
        </div>
      </section>

      {/* Recently added */}
      <section className="mb-14 rounded-2xl bg-[#fff5f0] px-4 py-8 sm:px-6">
        <h2 className="section-title">Recently Added Cars</h2>
        <p className="mt-1 text-body-muted">
          {freshCount} Fresh Cars Options Await You!
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {recentBudgetTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRecentBudget(tab.id)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                recentBudget === tab.id
                  ? "border-[#f75d34] bg-white text-[#f75d34] shadow-sm"
                  : "border-transparent bg-white text-gray-700 hover:border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-6">
          <CarCarousel
            cars={recentCars.slice(0, 10)}
            showDiscount
            viewAllLabel="View All Recently Added"
            viewAllHref="/used-cars/search?sort=newest"
          />
        </div>
      </section>

      {/* Discounted grid */}
      <section className="mb-14">
        <h2 className="section-title">Discounted Cars</h2>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(discountedCars.length ? discountedCars : enriched.slice(0, 4)).map((car) => (
            <li key={car.id}>
              <ExploreCarCard car={car} showDiscount layout="grid" />
            </li>
          ))}
        </ul>
        <Link
          href="/used-cars"
          className="mt-4 inline-block text-sm font-semibold text-[#f75d34] hover:underline"
        >
          View All Discounted Cars
        </Link>
      </section>

      {/* SEO intro */}
      <section className="mb-14 border-t border-gray-100 pt-10">
        <h2 className="section-title-lg">Second hand cars</h2>
        <p className="mt-3 max-w-3xl text-body-muted">
          Find a complete list of certified used cars in India. You can select second-hand
          cars by applying filters such as by location, price, body type, brand etc. &amp;
          also get info of used car dealers &amp; Old Car Bazar verified stores in{" "}
          {selectedCity} and across India.
        </p>
      </section>

      {/* Sell in cities */}
      <section className="mb-14">
        <h2 className="section-title">Sell Your Car in Cities</h2>
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
          {sellCarCities.map((city) => (
            <li key={city}>
              <Link
                href="/sell-car"
                className="text-body-muted hover:text-[#f75d34] hover:underline"
              >
                Sell car in {city}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Partner banner */}
      <section className="dark-surface mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-600 px-6 py-8 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
              Old Car Bazar Assured
            </p>
            <h3 className="mt-1 text-2xl font-bold sm:text-3xl">
              Choose from 10,000+ quality cars
            </h3>
            <ul className="mt-4 flex flex-wrap gap-6 text-sm font-medium">
              <li className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  ↺
                </span>
                30 DAY RETURN GUARANTEE
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  🛡
                </span>
                LIFETIME WARRANTY
              </li>
            </ul>
          </div>
          <Link
            href="/used-cars#explore-listings"
            className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-bold text-indigo-700 hover:bg-gray-100"
          >
            Browse Cars
          </Link>
        </div>
      </section>
    </>
  );
}
