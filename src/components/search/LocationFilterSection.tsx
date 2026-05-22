"use client";

import { useState } from "react";
import { cities } from "@/data/locations";

type LocationFilterSectionProps = {
  selected: string | null;
  counts: Record<string, number>;
  onSelect: (city: string | null) => void;
  defaultOpen?: boolean;
};

export default function LocationFilterSection({
  selected,
  counts,
  onSelect,
  defaultOpen = true,
}: LocationFilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");

  const filtered = cities.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="border-b border-gray-200 bg-white last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-bold text-gray-900 hover:bg-gray-50"
      >
        Location
        <span className="text-lg font-normal text-gray-400">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city"
            className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#f75d34]"
          />
          <ul className="max-h-52 space-y-2 overflow-y-auto">
            {filtered.map((city) => (
              <li key={city.name}>
                <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-gray-700 hover:text-[#f75d34]">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected === city.name}
                      onChange={() =>
                        onSelect(selected === city.name ? null : city.name)
                      }
                      className="h-4 w-4 rounded border-gray-300 accent-[#f75d34]"
                    />
                    {city.name}
                  </span>
                  <span className="text-caption">
                    {counts[city.name] ?? 0}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="py-2 text-caption">No city found</p>
          )}
        </div>
      )}
    </section>
  );
}
