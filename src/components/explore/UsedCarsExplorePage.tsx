"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useListings } from "@/context/ListingsContext";
import { useLocation } from "@/context/LocationContext";
import { cities } from "@/data/locations";
import {
  bodyTypes,
  budgetTabs,
  exploreBrands,
  fuelTypes,
  nearbyCities,
} from "@/data/explorePage";
import { enrichCar, filterByBudget } from "@/lib/carMeta";
import type { CityName } from "@/data/locations";
import BrandLogo from "@/components/BrandLogo";
import CityLogo from "@/components/CityLogo";
import CarCarousel from "./CarCarousel";
import UsedCarsBottomSections from "./UsedCarsBottomSections";
import { PinIcon, SearchIcon } from "@/components/icons";
import { uniqueIndianCities } from "@/data/indianCities";

const POPULAR_CITY_ROWS_VISIBLE = 12;

export default function UsedCarsExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { allListings } = useListings();
  const { selectedCity, setSelectedCity } = useLocation();
  const [bodyType, setBodyType] = useState("Hatchback");
  const [budget, setBudget] = useState("0-5");
  const [showAllNearby, setShowAllNearby] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [showAllCities, setShowAllCities] = useState(false);

  useEffect(() => {
    const brand = searchParams.get("brand");
    if (brand) {
      router.replace(`/used-cars/search?brand=${encodeURIComponent(brand)}`);
    }
  }, [searchParams, router]);

  const enriched = useMemo(
    () => allListings.map(enrichCar),
    [allListings]
  );

  const cityCars = useMemo(
    () => enriched.filter((c) => c.location === selectedCity),
    [enriched, selectedCity]
  );

  const bodyCars = useMemo(
    () => cityCars.filter((c) => c.bodyType === bodyType),
    [cityCars, bodyType]
  );

  const budgetCars = useMemo(
    () => filterByBudget(cityCars, budget),
    [cityCars, budget]
  );

  const fuelCars = (fuel: string) =>
    cityCars.filter((c) => c.fuel === fuel).slice(0, 8);

  const visibleNearby = showAllNearby ? nearbyCities : nearbyCities.slice(0, 12);

  const filteredPopularCities = useMemo(() => {
    const q = citySearch.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q)
    );
  }, [citySearch]);

  const allIndiaMatches = useMemo(() => {
    const q = citySearch.trim().toLowerCase();
    if (!q) return [];
    const popularNames = new Set(cities.map((c) => c.name.toLowerCase()));
    return uniqueIndianCities
      .filter(
        (c) =>
          !popularNames.has(c.name.toLowerCase()) &&
          (c.name.toLowerCase().includes(q) ||
            c.state.toLowerCase().includes(q))
      )
      .slice(0, 60);
  }, [citySearch]);

  const isSearching = citySearch.trim().length > 0;
  const visiblePopularCities =
    isSearching || showAllCities
      ? filteredPopularCities
      : filteredPopularCities.slice(0, POPULAR_CITY_ROWS_VISIBLE);
  const remainingCityCount =
    filteredPopularCities.length - POPULAR_CITY_ROWS_VISIBLE;

  const selectCity = (city: string) => {
    const match = cities.find((c) => c.name === city);
    if (match) setSelectedCity(match.name as CityName);
  };

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1400&h=500&fit=crop"
          alt="Family with car"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col items-start gap-6 px-4 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-20">
          <div className="max-w-lg">
            <h1 className="hero-title text-3xl sm:text-4xl lg:text-5xl !text-white">
              Your Dream Car Just One Click Away!
            </h1>
            <p className="mt-3 text-base !text-white">
              Find the right car from our extensive collection in {selectedCity}
            </p>
            <Link
              href="#explore-listings"
              className="mt-6 inline-block rounded-lg bg-[#f75d34] px-8 py-3 text-sm font-semibold text-white hover:bg-[#e54d24]"
            >
              Buy Used Cars
            </Link>
          </div>
          <div className="hidden lg:block lg:w-1/2" />
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 py-10 lg:px-6">
        {/* Nearby cities */}
        <section className="mb-12">
          <h2 className="section-title">
            Buy Second-Hand Cars in Nearby Cities
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
            {visibleNearby.map((city) => (
              <li key={city}>
                <button
                  type="button"
                  onClick={() => selectCity(city)}
                  className="text-left text-body-muted hover:text-[#f75d34] hover:underline"
                >
                  Buy car in {city}
                </button>
              </li>
            ))}
          </ul>
          {!showAllNearby && (
            <button
              type="button"
              onClick={() => setShowAllNearby(true)}
              className="mt-3 text-sm font-semibold text-[#f75d34] hover:underline"
            >
              View More
            </button>
          )}
        </section>

        {/* Popular cities */}
        <section className="mb-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="section-title">Used Cars by Popular Cities</h2>
            <label className="relative block w-full max-w-sm">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="Search city or state..."
                className="w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
              />
            </label>
          </div>

          {visiblePopularCities.length > 0 && (
            <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {visiblePopularCities.map((city) => (
                <li key={city.name}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity(city.name);
                      router.push(
                        `/used-cars/search?city=${encodeURIComponent(city.name)}`
                      );
                    }}
                    className={`flex w-full flex-col items-center rounded-xl border bg-white p-4 transition hover:border-[#f75d34] hover:shadow-md ${
                      selectedCity === city.name
                        ? "border-[#f75d34] ring-2 ring-[#f75d34]/20"
                        : "border-gray-200"
                    }`}
                  >
                    <CityLogo cityName={city.name} size={64} />
                    <p className="mt-3 text-center text-caption">Used cars in</p>
                    <p className="card-title text-center">{city.name}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {isSearching && allIndiaMatches.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                All India matches ({allIndiaMatches.length}
                {allIndiaMatches.length === 60 ? "+" : ""})
              </p>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {allIndiaMatches.map((city) => (
                  <li key={`${city.name}-${city.state}`}>
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/used-cars/search?city=${encodeURIComponent(city.name)}`
                        )
                      }
                      className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left hover:border-[#f75d34] hover:bg-orange-50"
                    >
                      <PinIcon className="h-4 w-4 shrink-0 text-[#f75d34]" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {city.name}
                        </p>
                        <p className="truncate text-[10px] text-gray-500">
                          {city.state}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isSearching &&
            visiblePopularCities.length === 0 &&
            allIndiaMatches.length === 0 && (
              <p className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center text-body-muted">
                No city found for &quot;{citySearch}&quot;.{" "}
                <button
                  type="button"
                  onClick={() => setCitySearch("")}
                  className="font-semibold text-[#f75d34] hover:underline"
                >
                  Clear
                </button>
              </p>
            )}

          {!isSearching && remainingCityCount > 0 && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setShowAllCities((v) => !v)}
                className="rounded-full border border-[#f75d34]/40 bg-white px-6 py-2 text-sm font-semibold text-[#f75d34] transition hover:bg-[#f75d34] hover:text-white"
              >
                {showAllCities
                  ? "Show Less"
                  : `View More (${remainingCityCount} cities)`}
              </button>
            </div>
          )}
        </section>

        <div id="explore-listings" className="space-y-14">
          {/* Body type */}
          <section>
            <h2 className="section-title">
              Used Cars by Body Type
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {bodyTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setBodyType(type)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    bodyType === type
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-[#f75d34]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <CarCarousel
                cars={bodyCars.length ? bodyCars : enriched.slice(0, 6)}
                viewAllLabel={`View All ${bodyType} Cars`}
                viewAllHref={`/used-cars/search?bodyType=${encodeURIComponent(bodyType)}`}
              />
            </div>
          </section>

          {/* Brands */}
          <section>
            <h2 className="section-title">
              Used Cars by Brand
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
              {exploreBrands.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/used-cars/search?brand=${brand.slug}`}
                    className="flex min-h-[128px] flex-col items-center justify-between rounded-2xl border border-gray-200 bg-white px-3 py-4 shadow-sm sm:px-4 sm:py-5"
                  >
                    <BrandLogo slug={brand.slug} name={brand.name} />
                    <span className="card-title mt-3 line-clamp-2 min-h-[2rem] text-center leading-snug">
                      {brand.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/used-cars/search"
              className="mt-4 inline-block text-sm font-semibold text-[#f75d34] hover:underline"
            >
              View All Brands
            </Link>
          </section>

          {/* Budget */}
          <section>
            <h2 className="section-title">
              Used Cars by Budget
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {budgetTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBudget(tab.id)}
                  className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                    budget === tab.id
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-[#f75d34]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <CarCarousel
                cars={budgetCars.length ? budgetCars : cityCars.slice(0, 6)}
                viewAllLabel={`View All Used Cars ${budgetTabs.find((b) => b.id === budget)?.label}`}
                viewAllHref={`/used-cars/search?budget=${encodeURIComponent(budget)}`}
              />
            </div>
          </section>

          {/* Fuel type */}
          <section>
            <h2 className="section-title">
              Used Cars by Fuel Type
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {fuelTypes.map((fuel) => (
                <li key={fuel.id}>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/used-cars/search?fuel=${encodeURIComponent(fuel.id)}`
                      )
                    }
                    className="flex w-full flex-col items-center rounded-xl border border-gray-200 bg-white p-5 transition hover:border-[#f75d34] hover:shadow-sm"
                  >
                    <span className="text-3xl">{fuel.icon}</span>
                    <span className="mt-2 text-sm font-semibold text-gray-800">
                      {fuel.label}
                    </span>
                    <span className="mt-1 text-caption">
                      {fuelCars(fuel.id).length} cars
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <UsedCarsBottomSections
            cityCars={cityCars}
            enriched={enriched}
            selectedCity={selectedCity}
          />
        </div>
      </div>
    </main>
  );
}
