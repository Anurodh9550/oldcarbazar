"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, type ApiDealerCard } from "@/lib/api";
import DealerCard from "./DealerCard";

const SORT_OPTIONS: {
  value: "listings" | "newest" | "name";
  label: string;
}[] = [
  { value: "listings", label: "Most listings" },
  { value: "newest", label: "Newest listings" },
  { value: "name", label: "Name (A–Z)" },
];

export default function DealersListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQ = searchParams.get("q") ?? "";
  const initialCity = searchParams.get("city") ?? "";
  const initialSort =
    (searchParams.get("sort") as "listings" | "newest" | "name") || "listings";

  const [q, setQ] = useState(initialQ);
  const [city, setCity] = useState(initialCity);
  const [sort, setSort] =
    useState<"listings" | "newest" | "name">(initialSort);

  const [dealers, setDealers] = useState<ApiDealerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce the search input so we don't fire a request on every
  // keystroke; 350ms feels snappy without spamming the backend.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQ, setDebouncedQ] = useState(initialQ);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQ(q), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q]);

  const syncUrl = useCallback(
    (next: { q?: string; city?: string; sort?: string }) => {
      const params = new URLSearchParams();
      if (next.q) params.set("q", next.q);
      if (next.city) params.set("city", next.city);
      if (next.sort && next.sort !== "listings") params.set("sort", next.sort);
      const qs = params.toString();
      router.replace(qs ? `/dealers?${qs}` : "/dealers", { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.listDealers({
          q: debouncedQ || undefined,
          city: city || undefined,
          sort,
        });
        if (!cancelled) setDealers(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load dealers."
          );
          setDealers([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    syncUrl({ q: debouncedQ, city, sort });
    return () => {
      cancelled = true;
    };
  }, [debouncedQ, city, sort, syncUrl]);

  const cityOptions = useMemo(() => {
    const set = new Set<string>();
    dealers.forEach((d) => {
      if (d.primary_city) set.add(d.primary_city);
      d.cities.forEach((c) => c && set.add(c));
    });
    return Array.from(set).sort();
  }, [dealers]);

  return (
    <main className="bg-[#f7f7f7]">
      <section className="bg-gradient-to-br from-[#1a1a1a] via-[#222] to-[#0f0f0f] px-4 pb-12 pt-10 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="inline-block rounded-full border border-[#f75d34]/40 bg-[#f75d34]/10 px-4 py-1 text-xs font-semibold tracking-wider text-[#ffb59a] uppercase">
            Dealer Directory
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Trusted used-car dealers
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-300 sm:text-base">
            Browse verified dealers across India. Filter by city, sort by
            inventory size, and contact the right dealer directly.
          </p>
        </div>
      </section>

      <section className="-mt-6 px-4 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <label className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 focus-within:border-[#f75d34] focus-within:bg-white">
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search dealer name or city..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:border-[#f75d34] focus:outline-none"
            >
              <option value="">All cities</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as "listings" | "newest" | "name")
              }
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:border-[#f75d34] focus:outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {loading ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-2xl border border-gray-100 bg-white"
                />
              ))}
            </div>
          ) : dealers.length === 0 ? (
            <div className="mt-12 rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
              <span className="text-5xl">🚘</span>
              <h2 className="mt-3 text-lg font-bold text-gray-900">
                No dealers found
              </h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                Try a different city or clear your filters.
              </p>
            </div>
          ) : (
            <>
              <p className="mt-6 mb-3 text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {dealers.length}
                </span>{" "}
                {dealers.length === 1 ? "dealer" : "dealers"}
              </p>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dealers.map((d) => (
                  <li key={d.id}>
                    <DealerCard dealer={d} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
