"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useListings } from "@/context/ListingsContext";
import { cities } from "@/data/locations";
import { BarChart } from "./Charts";
import { CitiesIcon, SearchIcon } from "./icons";

function priceToLakhs(price: string): number {
  const num = parseFloat(price.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(num)) return 0;
  if (price.toLowerCase().includes("cr")) return num * 100;
  return num;
}

export default function CitiesContent() {
  const { allListings } = useListings();
  const { inquiries } = useAdmin();

  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    return cities.map((c) => {
      const cityListings = allListings.filter((l) => l.location === c.name);
      const cityInquiries = inquiries.filter((i) => i.city === c.name);
      const prices = cityListings.map((l) => priceToLakhs(l.price)).filter(Boolean);
      const avg = prices.reduce((s, p) => s + p, 0) / Math.max(1, prices.length);
      return {
        name: c.name,
        state: c.state,
        carCount: c.carCount + cityListings.length,
        liveListings: cityListings.length,
        inquiries: cityInquiries.length,
        avgPrice: avg,
        popular: c.popular,
      };
    });
  }, [allListings, inquiries]);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q)
    );
  }, [rows, query]);

  const top = useMemo(
    () =>
      [...rows]
        .sort((a, b) => b.carCount - a.carCount)
        .slice(0, 10)
        .map((r) => ({ label: r.name, value: r.carCount })),
    [rows]
  );

  const totalListings = rows.reduce((s, r) => s + r.liveListings, 0);
  const totalReported = rows.reduce((s, r) => s + r.carCount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Cities live", value: rows.length },
          {
            label: "States",
            value: new Set(rows.map((r) => r.state)).size,
          },
          { label: "User listings", value: totalListings },
          { label: "Inventory (all)", value: totalReported },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {s.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {s.value.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Demand ranking
            </p>
            <h2 className="text-lg font-bold text-slate-900">Top 10 cities</h2>
          </div>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold text-[#f75d34]">
            <CitiesIcon className="mr-1 inline h-3 w-3" /> Live
          </span>
        </div>
        <BarChart data={top} className="mt-4" />
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-[#f75d34] focus-within:ring-2 focus-within:ring-[#f75d34]/20">
          <SearchIcon className="h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search city or state…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">State</th>
                <th className="px-4 py-3 text-right">Inventory</th>
                <th className="px-4 py-3 text-right">User listings</th>
                <th className="px-4 py-3 text-right">Inquiries</th>
                <th className="px-4 py-3 text-right">Avg. price</th>
                <th className="px-4 py-3 text-left">Tier</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.name}
                  className="border-t border-slate-100 transition hover:bg-orange-50/30"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/listings?city=${encodeURIComponent(r.name)}`}
                      className="font-semibold text-slate-900 hover:text-[#f75d34]"
                    >
                      {r.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{r.state}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    {r.carCount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">
                    {r.liveListings}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">
                    {r.inquiries}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-[#f75d34]">
                    {r.avgPrice > 0 ? `₹${r.avgPrice.toFixed(2)} L` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        r.popular
                          ? "bg-[#f75d34]/10 text-[#f75d34]"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {r.popular ? "Tier 1" : "Tier 2"}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                    No cities match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
