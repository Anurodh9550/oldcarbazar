"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ListingImage from "@/components/ListingImage";
import { useAuth } from "@/context/AuthContext";
import {
  getSellerIdFromUser,
  useListings,
} from "@/context/ListingsContext";
import {
  AVAILABILITY_CHANGED_EVENT,
  fetchMyDealerAvailability,
  getAvailabilityCounts,
  getDealerAvailability,
  getEntriesForDate,
  persistListingAvailability,
} from "@/lib/dealerCarAvailability";
import {
  AVAILABILITY_STATUS_META,
  type CarAvailabilityStatus,
} from "@/types/dealerAvailability";
import { fieldClass } from "@/components/ui/Input";
import SectionHeader from "@/components/ui/SectionHeader";

const STATUS_OPTIONS: CarAvailabilityStatus[] = [
  "available",
  "reserved",
  "sold",
  "coming_soon",
];

function monthLabel(d: Date) {
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function toIsoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function DealerAvailabilityCalendar() {
  const { user, isLoggedIn } = useAuth();
  const { getMyListings } = useListings();
  const [month, setMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => toIsoDate(new Date()));
  const [tick, setTick] = useState(0);

  const dealerId = user?.id ?? (user ? getSellerIdFromUser(user) : "");
  const listings = dealerId ? getMyListings(dealerId) : [];

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!dealerId) return;
    let cancelled = false;
    (async () => {
      await fetchMyDealerAvailability(dealerId);
      if (!cancelled) refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [dealerId, refresh]);

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener(AVAILABILITY_CHANGED_EVENT, handler);
    return () => window.removeEventListener(AVAILABILITY_CHANGED_EVENT, handler);
  }, [refresh]);

  const counts = useMemo(
    () => (dealerId ? getAvailabilityCounts(dealerId) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dealerId, tick]
  );

  const availability = useMemo(
    () => (dealerId ? getDealerAvailability(dealerId) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dealerId, tick]
  );

  const calendarDays = useMemo(() => {
    const year = month.getFullYear();
    const m = month.getMonth();
    const first = new Date(year, m, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const cells: { date: string | null; count: number }[] = [];
    for (let i = 0; i < startPad; i++) cells.push({ date: null, count: 0 });
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = toIsoDate(new Date(year, m, d));
      const count = dealerId ? getEntriesForDate(dealerId, iso).length : 0;
      cells.push({ date: iso, count });
    }
    return cells;
  }, [month, dealerId]);

  const dayEntries = useMemo(
    () => (dealerId ? getEntriesForDate(dealerId, selectedDate) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dealerId, selectedDate, tick]
  );

  if (!isLoggedIn || !user) {
    return (
      <div className="card-surface p-8 text-center">
        <p className="text-sm text-gray-600">Log in to manage car availability.</p>
        <Link href="/seller" className="mt-4 inline-block text-sm font-semibold text-[#f75d34]">
          Go to seller dashboard →
        </Link>
      </div>
    );
  }

  const statusMap = new Map(availability.map((a) => [a.listingId, a]));

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-5">
        <SectionHeader
          eyebrow="Dealer tool"
          title="Car Availability Calendar"
          subtitle="Mark each car as Available, Reserved, Sold, or Coming Soon. Buyers see status on your Virtual Showroom."
        />
      </div>

      {counts && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATUS_OPTIONS.map((status) => {
            const meta = AVAILABILITY_STATUS_META[status];
            const val = counts[status];
            return (
              <div
                key={status}
                className={`rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm`}
              >
                <p className={`text-2xl font-bold ${meta.color}`}>{val}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {meta.label}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <div className="card-surface p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">{monthLabel(month)}</h3>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() =>
                  setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
                }
                className="rounded-lg border border-gray-200 px-2.5 py-1 text-sm hover:bg-gray-50"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => setMonth(new Date())}
                className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold hover:bg-gray-50"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() =>
                  setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
                }
                className="rounded-lg border border-gray-200 px-2.5 py-1 text-sm hover:bg-gray-50"
              >
                →
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-gray-400">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {calendarDays.map((cell, i) => {
              if (!cell.date) {
                return <div key={`pad-${i}`} className="aspect-square" />;
              }
              const isSelected = cell.date === selectedDate;
              const isToday = cell.date === toIsoDate(new Date());
              return (
                <button
                  key={cell.date}
                  type="button"
                  onClick={() => setSelectedDate(cell.date!)}
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition ${
                    isSelected
                      ? "bg-[#f75d34] font-bold text-white"
                      : isToday
                        ? "bg-orange-50 font-semibold text-[#f75d34]"
                        : "hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  {new Date(cell.date).getDate()}
                  {cell.count > 0 && (
                    <span
                      className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-white" : "bg-[#f75d34]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
          {dayEntries.length > 0 && (
            <div className="mt-4 rounded-xl bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-500">
                Updates on {selectedDate}
              </p>
              <ul className="mt-2 space-y-1">
                {dayEntries.map((e) => (
                  <li key={e.listingId} className="text-sm text-gray-700">
                    {e.title} — {AVAILABILITY_STATUS_META[e.status].label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* All cars list */}
        <div className="card-surface p-5 sm:p-6">
          <h3 className="text-base font-bold text-gray-900">All your cars</h3>
          <p className="mt-1 text-sm text-gray-500">
            Set status for each listing
          </p>
          {listings.length === 0 ? (
            <div className="mt-6 rounded-xl border-2 border-dashed border-gray-200 py-10 text-center text-sm text-gray-500">
              No listings yet.{" "}
              <Link href="/sell-car" className="font-semibold text-[#f75d34]">
                Post a car →
              </Link>
            </div>
          ) : (
            <ul className="mt-4 max-h-[480px] space-y-3 overflow-y-auto pr-1">
              {listings.map((car) => {
                const current = statusMap.get(car.id);
                const status = current?.status ?? "available";
                const meta = AVAILABILITY_STATUS_META[status];
                return (
                  <li
                    key={car.id}
                    className="flex gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                  >
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <ListingImage
                        src={car.image}
                        alt={car.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {car.title}
                      </p>
                      <p className="text-xs text-[#f75d34]">{car.price}</p>
                      <select
                        className={`mt-2 w-full rounded-lg border-0 px-2 py-1.5 text-xs font-bold ring-1 ${meta.bg} ${meta.color} ${meta.ring}`}
                        value={status}
                        onChange={async (e) => {
                          await persistListingAvailability(
                            dealerId,
                            car.id,
                            car.title,
                            e.target.value as CarAvailabilityStatus
                          );
                          refresh();
                        }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {AVAILABILITY_STATUS_META[s].label}
                          </option>
                        ))}
                      </select>
                      {status === "coming_soon" && (
                        <input
                          type="date"
                          className={`${fieldClass} mt-2 py-1.5 text-xs`}
                          value={current?.availableFrom?.slice(0, 10) ?? ""}
                          onChange={async (e) => {
                            await persistListingAvailability(
                              dealerId,
                              car.id,
                              car.title,
                              "coming_soon",
                              { availableFrom: e.target.value }
                            );
                            refresh();
                          }}
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {STATUS_OPTIONS.map((s) => {
          const meta = AVAILABILITY_STATUS_META[s];
          return (
            <span
              key={s}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${meta.bg} ${meta.color} ring-1 ${meta.ring}`}
            >
              {meta.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
