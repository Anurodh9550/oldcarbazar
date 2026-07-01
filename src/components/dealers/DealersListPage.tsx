"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChromeCopy, useLanguage } from "@/context/LanguageContext";
import { api, type ApiDealerCard } from "@/lib/api";
import PageLoader from "@/components/ui/PageLoader";
import PageHero from "@/components/ui/PageHero";
import DealerCard from "./DealerCard";

export default function DealersListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const copy = useChromeCopy();

  const sortOptions = useMemo(
    () =>
      [
        { value: "listings" as const, label: copy.dealers.sortMostListings },
        { value: "newest" as const, label: copy.dealers.sortNewest },
        { value: "name" as const, label: copy.dealers.sortName },
      ],
    [copy.dealers.sortMostListings, copy.dealers.sortNewest, copy.dealers.sortName]
  );

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
            err instanceof Error ? err.message : copy.dealers.loadError
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
      <PageHero
        badge={copy.dealers.pageBadge}
        title={copy.dealers.pageHeroTitle}
        subtitle={copy.dealers.pageHeroSubtitle}
        maxWidth="6xl"
      />

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
                placeholder={copy.dealers.searchPlaceholder}
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:border-[#f75d34] focus:outline-none"
            >
              <option value="">{copy.common.allCities}</option>
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
              {sortOptions.map((opt) => (
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
            <PageLoader
              message={copy.dealers.loadingDealers}
              compact
              className="mt-8 rounded-2xl border border-gray-100 bg-white"
            />
          ) : dealers.length === 0 ? (
            <div className="mt-12 rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
              <span className="text-5xl">🚘</span>
              <h2 className="mt-3 text-lg font-bold text-gray-900">
                {copy.dealers.noDealersTitle}
              </h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                {copy.dealers.noDealersSubtitle}
              </p>
            </div>
          ) : (
            <>
              <p className="mt-6 mb-3 text-sm text-gray-500">
                {t(copy.common.showingDealers, { count: dealers.length })}
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
