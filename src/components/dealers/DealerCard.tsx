"use client";

import Link from "next/link";
import type { ApiDealerCard } from "@/lib/api";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function formatPriceRange(min: string | null, max: string | null): string {
  if (!min || !max) return "";
  const fmt = (raw: string) => {
    const n = Number(raw);
    if (Number.isNaN(n)) return raw;
    if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)} Cr`;
    if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
  };
  if (min === max) return fmt(min);
  return `${fmt(min)} – ${fmt(max)}`;
}

export default function DealerCard({ dealer }: { dealer: ApiDealerCard }) {
  const priceRange = formatPriceRange(dealer.min_price_inr, dealer.max_price_inr);
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#f75d34]/30 hover:shadow-lg">
      <Link
        href={`/dealers/${dealer.id}`}
        className="flex flex-1 flex-col gap-4 p-5"
      >
        <div className="flex items-start gap-4">
          {dealer.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dealer.avatar_url}
              alt={dealer.name}
              className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-orange-100"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f75d34] to-[#e54d24] text-lg font-bold text-white ring-2 ring-orange-100">
              {initials(dealer.name) || "D"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-bold text-gray-900 group-hover:text-[#f75d34]">
                {dealer.name}
              </h3>
              {dealer.is_pro && (
                <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Pro
                </span>
              )}
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
              <svg className="h-3.5 w-3.5 text-[#f75d34]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 22s-7-7.58-7-12a7 7 0 1 1 14 0c0 4.42-7 12-7 12z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {dealer.primary_city || "Across India"}
              {dealer.cities.length > 1 && (
                <span className="text-gray-400">
                  {" "}
                  +{dealer.cities.length - 1} more
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 px-3 py-3">
          <div>
            <p className="text-xl font-bold text-[#f75d34]">
              {dealer.active_listings_count}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-gray-500">
              Active listings
            </p>
          </div>
          {priceRange && (
            <div>
              <p className="truncate text-sm font-semibold text-gray-900">
                {priceRange}
              </p>
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Price range
              </p>
            </div>
          )}
        </div>

        {dealer.brands.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {dealer.brands.slice(0, 4).map((b) => (
              <span
                key={b}
                className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-gray-700"
              >
                {b}
              </span>
            ))}
            {dealer.brands.length > 4 && (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500">
                +{dealer.brands.length - 4}
              </span>
            )}
          </div>
        )}
      </Link>

      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-xs">
        <Link
          href={`/dealers/${dealer.id}/showroom`}
          className="font-semibold text-violet-600 hover:text-violet-800"
        >
          Showroom →
        </Link>
        <Link
          href={`/dealers/${dealer.id}`}
          className="font-semibold text-[#f75d34] hover:underline"
        >
          Profile
        </Link>
      </div>
    </div>
  );
}
