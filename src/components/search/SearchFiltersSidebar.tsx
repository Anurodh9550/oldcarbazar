"use client";

import { useState } from "react";
import { exploreBrands, fuelTypes } from "@/data/explorePage";
import {
  bodyTypeFilters,
  carColors,
  discountFilters,
  kmRanges,
  ownershipTypes,
  premiumSellers,
  rtoStates,
  searchBudgetRanges,
  seatOptions,
  sellerTypes,
  transmissionTypes,
  type SearchFilterParams,
} from "@/data/searchPage";
import type { SearchEnrichedCar } from "@/lib/searchFilters";
import { countForFilter } from "@/lib/searchFilters";
import BrandFilterSection from "./BrandFilterSection";
import FilterSection from "./FilterSection";
import LocationFilterSection from "./LocationFilterSection";

type SearchFiltersSidebarProps = {
  filters: SearchFilterParams;
  baseCars: SearchEnrichedCar[];
  locationCounts: Record<string, number>;
  onFilterChange: (key: keyof SearchFilterParams, value: string | null) => void;
  onClearAll: () => void;
};

function toOptions(
  items: { id: string; label: string; hex?: string }[],
  counts: Record<string, number>
) {
  return items.map((item) => ({
    id: item.id,
    label: item.label,
    hex: item.hex,
    count: counts[item.id] ?? 0,
  }));
}

export default function SearchFiltersSidebar({
  filters,
  baseCars,
  locationCounts,
  onFilterChange,
  onClearAll,
}: SearchFiltersSidebarProps) {
  const [collapseKey, setCollapseKey] = useState(0);

  const count = (key: keyof SearchFilterParams, value: string) =>
    countForFilter(baseCars, filters, key, value);

  const fuelOptions = fuelTypes.map((f) => ({
    id: f.id,
    label: f.label,
    count: count("fuel", f.id),
  }));

  const transmissionOptions = transmissionTypes.map((t) => ({
    id: t,
    label: t,
    count: count("transmission", t),
  }));

  const budgetOptions = searchBudgetRanges.map((r) => ({
    id: r.id,
    label: r.label,
    count: count("budget", r.id),
  }));

  const kmOptions = kmRanges.map((r) => ({
    id: r.id,
    label: r.label,
    count: count("kms", r.id),
  }));

  const ownershipOptions = ownershipTypes.map((o) => ({
    id: o,
    label: o,
    count: count("ownership", o),
  }));

  const bodyOptions = bodyTypeFilters.map((b) => ({
    id: b,
    label: b,
    count: count("bodyType", b),
  }));

  const sellerOptions = sellerTypes
    .filter((s) => s.id !== "all")
    .map((s) => ({
      id: s.id,
      label: s.label,
      count: count("sellerType", s.id),
    }));

  const premiumOptions = premiumSellers.map((p) => ({
    id: p.id,
    label: p.label,
    count: count("premium", p.id),
  }));

  const rtoOptions = rtoStates.map((r) => ({
    id: r,
    label: r,
    count: count("rto", r),
  }));

  const seatOpts = seatOptions.map((s) => ({
    id: s,
    label: s,
    count: count("seats", s),
  }));

  const discountOptions = discountFilters.map((d) => ({
    id: d.id,
    label: d.label,
    count: count("discount", d.id),
  }));

  const colorOptions = toOptions(
    carColors.map((c) => ({ id: c.id, label: c.label, hex: c.hex })),
    Object.fromEntries(carColors.map((c) => [c.id, count("color", c.id)]))
  );

  return (
    <aside className="w-full shrink-0 lg:w-[280px]">
      <button
        type="button"
        onClick={() => {
          onClearAll();
          setCollapseKey((k) => k + 1);
        }}
        className="mb-4 w-full rounded border border-gray-300 bg-white py-2 text-xs font-semibold tracking-wide text-gray-700 hover:border-[#f75d34] hover:text-[#f75d34]"
      >
        COLLAPSE ALL FILTERS
      </button>

      <div
        key={collapseKey}
        className="overflow-hidden rounded-lg border border-gray-200 bg-white"
      >
        <LocationFilterSection
          selected={filters.city}
          counts={locationCounts}
          onSelect={(v) => onFilterChange("city", v)}
          defaultOpen={!!filters.city}
        />
        <BrandFilterSection
          selected={filters.brand}
          counts={Object.fromEntries(
            exploreBrands.map((b) => [b.slug, count("brand", b.slug)])
          )}
          onSelect={(v) => onFilterChange("brand", v)}
          defaultOpen={!!filters.brand}
        />
        <FilterSection
          title="Fuel Type"
          options={fuelOptions}
          selected={filters.fuel}
          onSelect={(v) => onFilterChange("fuel", v)}
          defaultOpen
        />
        <FilterSection
          title="Transmission"
          options={transmissionOptions}
          selected={filters.transmission}
          onSelect={(v) => onFilterChange("transmission", v)}
          defaultOpen
        />
        <FilterSection
          title="Budget"
          options={budgetOptions}
          selected={filters.budget}
          onSelect={(v) => onFilterChange("budget", v)}
          defaultOpen
        />
        <FilterSection
          title="Kilometer Driven"
          options={kmOptions}
          selected={filters.kms}
          onSelect={(v) => onFilterChange("kms", v)}
        />
        <FilterSection
          title="Ownership"
          options={ownershipOptions}
          selected={filters.ownership}
          onSelect={(v) => onFilterChange("ownership", v)}
        />
        <FilterSection
          title="Body Type"
          options={bodyOptions}
          selected={filters.bodyType}
          onSelect={(v) => onFilterChange("bodyType", v)}
        />
        <FilterSection
          title="Seller Type"
          options={sellerOptions}
          selected={filters.sellerType}
          onSelect={(v) => onFilterChange("sellerType", v)}
          type="radio"
        />
        <FilterSection
          title="Premium Sellers"
          options={premiumOptions}
          selected={filters.premium}
          onSelect={(v) => onFilterChange("premium", v)}
        />
        <FilterSection
          title="RTO"
          options={rtoOptions}
          selected={filters.rto}
          onSelect={(v) => onFilterChange("rto", v)}
        />
        <FilterSection
          title="Seats"
          options={seatOpts}
          selected={filters.seats}
          onSelect={(v) => onFilterChange("seats", v)}
        />
        <FilterSection
          title="Discount"
          options={discountOptions}
          selected={filters.discount}
          onSelect={(v) => onFilterChange("discount", v)}
        />
        <FilterSection
          title="Colors"
          options={colorOptions}
          selected={filters.color}
          onSelect={(v) => onFilterChange("color", v)}
        />
      </div>
    </aside>
  );
}
