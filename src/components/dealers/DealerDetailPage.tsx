"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useChromeCopy, useLanguage } from "@/context/LanguageContext";
import { ApiError, api, apiListingToCarListing, type ApiDealerDetail } from "@/lib/api";
import { enrichCar } from "@/lib/carMeta";
import ExploreCarCard from "@/components/explore/ExploreCarCard";
import PageLoader from "@/components/ui/PageLoader";

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

function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DealerDetailPage({ dealerId }: { dealerId: string }) {
  const { t } = useLanguage();
  const copy = useChromeCopy();
  const [dealer, setDealer] = useState<ApiDealerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.getDealer(dealerId);
        if (!cancelled) setDealer(data);
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiError && err.status === 404) {
            setError(copy.dealers.dealerUnavailable);
          } else {
            setError(
              err instanceof Error ? err.message : copy.dealers.loadError
            );
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dealerId, copy.dealers.dealerUnavailable, copy.dealers.loadError]);

  const enrichedListings = useMemo(() => {
    if (!dealer) return [];
    return dealer.listings.map((apiL) => enrichCar(apiListingToCarListing(apiL)));
  }, [dealer]);

  if (loading) {
    return (
      <main className="bg-[#f7f7f7] px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white">
          <PageLoader message={copy.dealers.loadingDealer} />
        </div>
      </main>
    );
  }

  if (error || !dealer) {
    return (
      <main className="bg-[#f7f7f7] px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
          <span className="text-5xl">🚘</span>
          <h2 className="mt-3 text-lg font-bold text-gray-900">
            {copy.dealers.notFoundTitle}
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            {error || copy.dealers.notFoundDefault}
          </p>
          <Link
            href="/dealers"
            className="mt-6 inline-block rounded-full bg-[#f75d34] px-6 py-2 text-sm font-semibold text-white hover:bg-[#e54d24]"
          >
            {copy.dealers.backToDealers}
          </Link>
        </div>
      </main>
    );
  }

  const priceRange = formatPriceRange(
    dealer.min_price_inr,
    dealer.max_price_inr
  );
  const whatsappHref = `https://wa.me/91${dealer.phone}?text=${encodeURIComponent(
    `Hi ${dealer.name}, I found your dealership on Old Car Bazar.`
  )}`;
  const memberSince = formatDate(dealer.member_since);

  return (
    <main className="bg-[#f7f7f7]">
      <section className="relative overflow-hidden px-4 pb-10 pt-8 text-white sm:px-8 lg:px-12">
        <Image
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=800&fit=crop"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-[#1a1a1a]/90"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#f75d34]/20 via-transparent to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          <Link
            href="/dealers"
            className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-white"
          >
            <span>←</span> {copy.dealers.allDealers}
          </Link>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
            {dealer.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dealer.avatar_url}
                alt={dealer.name}
                className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-white/15"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f75d34] to-[#e54d24] text-2xl font-bold text-white ring-4 ring-white/15">
                {initials(dealer.name) || "D"}
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
                  {dealer.name}
                </h1>
                {dealer.is_pro && (
                  <span className="rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {copy.dealers.proDealer}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-300">
                {dealer.primary_city || copy.dealers.acrossIndia}
                {dealer.cities.length > 1 && (
                  <span>
                    {" "}
                    {t(copy.dealers.operatesInCities, {
                      count: dealer.cities.length,
                    })}
                  </span>
                )}
                {memberSince && (
                  <span className="text-gray-400">
                    {" "}
                    {t(copy.dealers.joined, { date: memberSince })}
                  </span>
                )}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/dealers/${dealer.id}/showroom`}
                  className="rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white ring-1 ring-white/25 hover:bg-white/25"
                >
                  {copy.dealers.showroom}
                </Link>
                <a
                  href={`tel:+91${dealer.phone}`}
                  className="rounded-full bg-[#f75d34] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e54d24]"
                >
                  {copy.dealers.callDealer}
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label={copy.dealers.activeListings} value={dealer.active_listings_count} />
            <Stat
              label={copy.dealers.totalEverListed}
              value={dealer.total_listings_count}
            />
            {priceRange && <Stat label={copy.dealers.priceRange} value={priceRange} />}
            <Stat label={copy.dealers.cities} value={dealer.cities.length || 1} />
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          {dealer.brands.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {copy.dealers.brandsAvailable}
              </span>
              {dealer.brands.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-900">
            {t(copy.dealers.carsFrom, { name: dealer.name })}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {t(copy.dealers.carsAvailable, { count: enrichedListings.length })}
          </p>

          {enrichedListings.length === 0 ? (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-gray-200 bg-white py-12 text-center">
              <p className="text-sm text-gray-500">
                {copy.dealers.noActiveListings}
              </p>
            </div>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {enrichedListings.map((car) => (
                <li key={car.id}>
                  <ExploreCarCard car={car} layout="grid" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 backdrop-blur-sm">
      <p className="text-lg font-bold text-white sm:text-xl">{value}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-wider text-gray-400">
        {label}
      </p>
    </div>
  );
}
