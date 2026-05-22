"use client";

import { useState } from "react";
import { exploreBrands } from "@/data/explorePage";

type BrandFilterSectionProps = {
  selected: string | null;
  counts: Record<string, number>;
  onSelect: (slug: string | null) => void;
  defaultOpen?: boolean;
};

export default function BrandFilterSection({
  selected,
  counts,
  onSelect,
  defaultOpen = true,
}: BrandFilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");

  const filtered = exploreBrands.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="border-b border-gray-200 bg-white last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-bold text-gray-900 hover:bg-gray-50"
      >
        Brand + Model
        <span className="text-lg font-normal text-gray-400">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brand or model"
            className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#f75d34]"
          />
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Popular
          </p>
          <ul className="max-h-52 space-y-2 overflow-y-auto">
            {filtered.map((brand) => (
              <li key={brand.slug}>
                <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-gray-700 hover:text-[#f75d34]">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected === brand.slug}
                      onChange={() =>
                        onSelect(selected === brand.slug ? null : brand.slug)
                      }
                      className="h-4 w-4 rounded border-gray-300 accent-[#f75d34]"
                    />
                    {brand.name}
                  </span>
                  <span className="text-caption">
                    {counts[brand.slug] ?? 0}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="py-2 text-caption">No brand found</p>
          )}
        </div>
      )}
    </section>
  );
}
