"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { carListings } from "@/data/cars";
import { compareTips } from "@/data/loanToolsPages";

const MAX_SLOTS = 3;

type Slot = { id: string | null };

function priceToNumber(price: string) {
  const m = price.match(/(\d+(\.\d+)?)/);
  if (!m) return 0;
  const value = parseFloat(m[0]);
  return /lakh/i.test(price) ? value : value / 100000;
}

export default function CompareCarsContent() {
  const [slots, setSlots] = useState<Slot[]>([
    { id: "3" },
    { id: "7" },
    { id: null },
  ]);
  const [openPicker, setOpenPicker] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const selectedCars = useMemo(
    () =>
      slots.map((s) =>
        s.id ? carListings.find((c) => c.id === s.id) ?? null : null
      ),
    [slots]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return carListings.filter((c) =>
      q ? c.title.toLowerCase().includes(q) : true
    );
  }, [query]);

  const setSlot = (idx: number, id: string | null) => {
    setSlots((prev) => {
      const next = prev.slice();
      next[idx] = { id };
      return next;
    });
    setOpenPicker(null);
  };

  const rows: { label: string; getValue: (car: (typeof carListings)[number] | null) => React.ReactNode }[] = [
    {
      label: "Price",
      getValue: (car) =>
        car ? (
          <span className="font-bold text-[#f75d34]">{car.price}</span>
        ) : (
          "—"
        ),
    },
    {
      label: "Approx Lakh",
      getValue: (car) =>
        car ? `₹${priceToNumber(car.price).toFixed(2)} L` : "—",
    },
    {
      label: "Specs",
      getValue: (car) => (car ? car.specs : "—"),
    },
    {
      label: "Location",
      getValue: (car) => (car ? car.location : "—"),
    },
    {
      label: "Type",
      getValue: (car) =>
        car ? (car.badge ?? "Standard listing") : "—",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot, idx) => {
          const car = selectedCars[idx];
          return (
            <div
              key={idx}
              className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              {car ? (
                <>
                  <div className="relative h-36 w-full overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={car.image}
                      alt={car.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-gray-900">
                    {car.title}
                  </h3>
                  <p className="mt-0.5 text-caption">{car.specs}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base font-bold text-[#f75d34]">
                      {car.price}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSlot(idx, null)}
                      className="text-xs font-semibold text-gray-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenPicker(openPicker === idx ? null : idx)
                    }
                    className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:border-[#f75d34] hover:text-[#f75d34]"
                  >
                    Change Car
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setOpenPicker(openPicker === idx ? null : idx)
                  }
                  className="flex h-full min-h-[220px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 text-center hover:border-[#f75d34] hover:bg-orange-50/50"
                >
                  <span className="text-3xl">＋</span>
                  <p className="mt-2 text-sm font-semibold text-gray-700">
                    Add Car {idx + 1}
                  </p>
                  <p className="mt-1 text-caption">
                    Choose from listings to compare
                  </p>
                </button>
              )}

              {openPicker === idx && (
                <div className="absolute inset-x-0 top-full z-10 mt-2 max-h-80 overflow-y-auto rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search car..."
                    className="mb-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none focus:border-[#f75d34]"
                  />
                  <ul className="space-y-1">
                    {filtered.slice(0, MAX_SLOTS === 3 ? 30 : 50).map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => setSlot(idx, c.id)}
                          className="flex w-full items-center gap-2 rounded-lg p-2 text-left text-xs hover:bg-orange-50"
                        >
                          <span className="font-medium text-gray-900">
                            {c.title}
                          </span>
                          <span className="ml-auto text-[#f75d34]">
                            {c.price}
                          </span>
                        </button>
                      </li>
                    ))}
                    {filtered.length === 0 && (
                      <li className="px-2 py-3 text-center text-xs text-gray-500">
                        No matches
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Feature</th>
                {selectedCars.map((c, i) => (
                  <th key={i} className="px-4 py-3 font-semibold">
                    {c ? c.title : `Car ${i + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {rows.map((row) => (
                <tr key={row.label} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    {row.label}
                  </td>
                  {selectedCars.map((c, i) => (
                    <td key={i} className="px-4 py-3 text-gray-700">
                      {row.getValue(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl bg-[#0f172a] p-6 text-white sm:p-7">
        <h3 className="text-lg font-bold">Smart Comparison Tips</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {compareTips.map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2.5 text-sm text-slate-200"
            >
              <span className="mt-0.5 text-amber-300">★</span>
              {tip}
            </li>
          ))}
        </ul>
        <Link
          href="/used-cars"
          className="mt-5 inline-block rounded-full bg-[#f75d34] px-5 py-2.5 text-sm font-semibold hover:bg-[#e54d24]"
        >
          Browse More Cars →
        </Link>
      </div>
    </div>
  );
}
