"use client";

import Link from "next/link";
import { useState } from "react";
import { sampleDealers } from "@/data/sellHubPages";
import { cities } from "@/data/locations";

export default function DealersListContent() {
  const [city, setCity] = useState("All");
  const filtered =
    city === "All" ? sampleDealers : sampleDealers.filter((d) => d.city === city);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-6">
        <button
          type="button"
          onClick={() => setCity("All")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            city === "All" ? "bg-[#f75d34] text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          All Cities
        </button>
        {cities.slice(0, 8).map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => setCity(c.name)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              city === c.name ? "bg-[#f75d34] text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.map((dealer) => (
          <li
            key={dealer.name}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#f75d34]/30 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{dealer.name}</h3>
                <p className="mt-1 text-caption sm:text-sm">📍 {dealer.city}</p>
              </div>
              {dealer.verified && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  VERIFIED
                </span>
              )}
            </div>
            <div className="mt-4 flex items-center gap-4 text-body-muted">
              <span>⭐ {dealer.rating}</span>
              <span>{dealer.cars}+ cars</span>
            </div>
            <Link
              href={`/used-cars/search?city=${encodeURIComponent(dealer.city)}`}
              className="mt-4 block w-full rounded-lg border border-[#f75d34] py-2 text-center text-sm font-semibold text-[#f75d34] hover:bg-orange-50"
            >
              View Inventory
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
