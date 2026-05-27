"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useListings } from "@/context/ListingsContext";
import ListingImage from "@/components/ListingImage";
import {
  clearCompare,
  COMPARE_LIMIT,
  getCompareIds,
  removeFromCompare,
} from "@/lib/compareList";

/**
 * Persistent floating widget that shows the user's compare cart anywhere on the
 * site. Hides itself on the `/compare` page (where the full layout is in view)
 * and on admin routes.
 */
export default function FloatingCompareWidget() {
  const pathname = usePathname() ?? "";
  const { allListings } = useListings();
  const [ids, setIds] = useState<string[]>([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setIds(getCompareIds());
    const refresh = () => setIds(getCompareIds());
    window.addEventListener("ocb-compare-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("ocb-compare-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const cars = useMemo(() => {
    const lookup = new Map(allListings.map((l) => [l.id, l]));
    return ids
      .map((id) => lookup.get(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
  }, [ids, allListings]);

  const shouldHide =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/compare") ||
    cars.length === 0;

  if (shouldHide) return null;

  const compareUrl = `/compare?ids=${cars.map((c) => c.id).join(",")}`;

  return (
    <AnimatePresence>
      <motion.div
        key="compare-fab"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-[640px] -translate-x-1/2"
      >
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 via-white to-orange-50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f75d34] text-[11px] font-bold text-white">
                {cars.length}
              </span>
              <p className="text-sm font-bold text-gray-900">
                Compare ({cars.length}/{COMPARE_LIMIT})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  clearCompare();
                  setIds([]);
                }}
                className="rounded-md px-2 py-1 text-[11px] font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                Clear
              </button>
              <button
                type="button"
                aria-label={open ? "Minimise compare" : "Expand compare"}
                onClick={() => setOpen((v) => !v)}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 transition-transform ${
                    open ? "" : "rotate-180"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path
                    d="M19 15l-7-7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {open && (
            <div className="flex flex-wrap items-stretch gap-2 px-3 py-3 sm:flex-nowrap">
              <ul className="flex flex-1 flex-wrap gap-2 sm:flex-nowrap sm:overflow-x-auto">
                {cars.map((car) => (
                  <li
                    key={car.id}
                    className="group relative flex w-[140px] shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white p-1.5 pr-2 sm:w-[150px]"
                  >
                    <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                      <ListingImage
                        src={car.image}
                        alt={car.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-semibold text-gray-900">
                        {car.title}
                      </span>
                      <span className="block truncate text-[10px] font-bold text-[#f75d34]">
                        {car.price}
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${car.title} from compare`}
                      onClick={() => {
                        const next = removeFromCompare(car.id);
                        setIds(next);
                      }}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white shadow hover:bg-red-600"
                    >
                      ×
                    </button>
                  </li>
                ))}
                {cars.length < COMPARE_LIMIT && (
                  <li className="flex w-[140px] shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-[11px] font-medium text-gray-400 sm:w-[150px]">
                    + Add more
                  </li>
                )}
              </ul>
              <Link
                href={compareUrl}
                className="flex items-center justify-center rounded-xl bg-[#f75d34] px-4 py-2 text-sm font-bold text-white shadow hover:bg-[#e54d24] sm:shrink-0"
              >
                Compare →
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
