"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useListings } from "@/context/ListingsContext";
import { useLocation } from "@/context/LocationContext";
import { cities, type CityName } from "@/data/locations";
import { getBrandNameFromSlug } from "@/data/explorePage";
import {
  FILTER_PARAM_KEYS,
  sortOptions,
  type SearchFilterParams,
  type SortOptionId,
} from "@/data/searchPage";
import ExploreCarCard from "@/components/explore/ExploreCarCard";
import { enrichCar, sortCars } from "@/lib/carMeta";
import {
  applySearchFilters,
  enrichCarForSearch,
  getFilterLabel,
} from "@/lib/searchFilters";
import SearchFiltersSidebar from "./SearchFiltersSidebar";

function ActiveFilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100"
    >
      {label}
      <span aria-hidden className="text-blue-500">
        ×
      </span>
    </button>
  );
}

function readFilters(searchParams: URLSearchParams): SearchFilterParams {
  const get = (key: keyof SearchFilterParams) => searchParams.get(key);
  return {
    city: get("city"),
    brand: get("brand"),
    fuel: get("fuel"),
    transmission: get("transmission"),
    budget: get("budget"),
    kms: get("kms"),
    ownership: get("ownership"),
    bodyType: get("bodyType"),
    sellerType: get("sellerType"),
    premium: get("premium"),
    rto: get("rto"),
    seats: get("seats"),
    discount: get("discount"),
    color: get("color"),
  };
}

export default function UsedCarsSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { allListings } = useListings();
  const { selectedCity, setSelectedCity } = useLocation();

  const filters = readFilters(searchParams);
  const sort = (searchParams.get("sort") as SortOptionId) || "relevance";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });
      router.push(`/used-cars/search?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const activeCity = (filters.city as CityName) || selectedCity;

  useEffect(() => {
    if (filters.city && cities.some((c) => c.name === filters.city)) {
      setSelectedCity(filters.city as CityName);
    }
  }, [filters.city, setSelectedCity]);

  const allEnriched = useMemo(
    () => allListings.map(enrichCar).map(enrichCarForSearch),
    [allListings]
  );

  const locationCounts = useMemo(
    () =>
      Object.fromEntries(
        cities.map((c) => [
          c.name,
          allEnriched.filter((car) => car.location === c.name).length,
        ])
      ),
    [allEnriched]
  );

  const cityCars = useMemo(
    () => allEnriched.filter((c) => c.location === activeCity),
    [allEnriched, activeCity]
  );

  const filteredCars = useMemo(() => {
    const list = applySearchFilters(cityCars, filters);
    return sortCars(list, sort);
  }, [cityCars, filters, sort]);

  const brandName = filters.brand ? getBrandNameFromSlug(filters.brand) : null;

  const pageTitle = brandName
    ? filters.fuel
      ? `Used ${brandName} ${filters.fuel} Cars in ${activeCity}`
      : `Used ${brandName} Cars in ${activeCity}`
    : filters.fuel
      ? `Used ${filters.fuel} Cars in ${activeCity}`
      : `Used Cars in ${activeCity}`;

  const activeChips = FILTER_PARAM_KEYS.filter((key) => filters[key]).map(
    (key) => ({
      key,
      label: getFilterLabel(key, filters[key]!),
      clear: () => updateParams({ [key]: null }),
    })
  );

  const handleFilterChange = (
    key: keyof SearchFilterParams,
    value: string | null
  ) => {
    if (key === "city" && value && cities.some((c) => c.name === value)) {
      setSelectedCity(value as CityName);
    }
    updateParams({ [key]: value });
  };

  const clearAllFilters = () => {
    const cleared = FILTER_PARAM_KEYS.reduce(
      (acc, key) => {
        acc[key] = null;
        return acc;
      },
      {} as Record<string, null>
    );
    updateParams(cleared);
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="mx-auto max-w-[1280px] px-4 py-6 lg:px-6">
        <nav className="mb-4 text-caption sm:text-sm">
          <Link href="/used-cars" className="hover:text-[#f75d34]">
            Used Cars
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{pageTitle}</span>
        </nav>

        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{pageTitle}</h1>
        <p className="mt-2 text-body-muted">
          {filteredCars.length}+ used{" "}
          {brandName ? `${brandName} ` : ""}
          {filters.fuel ? `${filters.fuel.toLowerCase()} ` : ""}
          cars for sale in {activeCity}. Apply filters to narrow your search.
        </p>

        <section className="mt-6 flex flex-col gap-6 lg:flex-row">
          <SearchFiltersSidebar
            filters={filters}
            baseCars={cityCars}
            locationCounts={locationCounts}
            onFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
          />

          <div className="flex-1">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <ActiveFilterChip
                    key={chip.key}
                    label={chip.label}
                    onRemove={chip.clear}
                  />
                ))}
                {activeChips.length === 0 && (
                  <span className="text-caption sm:text-sm">No filters applied</span>
                )}
              </div>
              <label className="flex items-center gap-2 text-body-muted">
                Sort by
                <select
                  value={sort}
                  onChange={(e) =>
                    updateParams({ sort: e.target.value as SortOptionId })
                  }
                  className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 outline-none focus:border-[#f75d34]"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className="mb-4 text-body-muted">
              Showing{" "}
              <span className="font-semibold text-[#f75d34]">
                {filteredCars.length}
              </span>{" "}
              cars in {activeCity}
            </p>

            {filteredCars.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
                <p className="text-lg font-semibold text-gray-800">No cars found</p>
                <p className="mt-2 text-caption sm:text-sm">
                  Try removing filters or change city from the header.
                </p>
                <Link
                  href="/used-cars"
                  className="mt-4 inline-block text-sm font-semibold text-[#f75d34] hover:underline"
                >
                  Browse all used cars
                </Link>
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredCars.map((car) => (
                  <li key={car.id}>
                    <ExploreCarCard
                      car={car}
                      layout="grid"
                      showDiscount
                      showActions
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
