"use client";

import Link from "next/link";
import { useState } from "react";
import { carBrands, carYears } from "@/data/sellCarForm";
import { cities } from "@/data/locations";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20";

export default function ValuationContent() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [kms, setKms] = useState("");
  const [city, setCity] = useState("");
  const [result, setResult] = useState<{ min: number; max: number } | null>(null);

  const estimate = () => {
    if (!brand || !year || !kms) return;
    const base = parseInt(year, 10) >= 2020 ? 8 : parseInt(year, 10) >= 2015 ? 5 : 3;
    const kmFactor = Math.max(0.5, 1 - parseInt(kms, 10) / 200000);
    const min = Math.round(base * kmFactor * 0.9 * 10) / 10;
    const max = Math.round(base * kmFactor * 1.15 * 10) / 10;
    setResult({ min, max });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h2 className="section-title">Get Instant Estimate</h2>
        <p className="mt-1 text-caption sm:text-sm">
          Fill details below — fair market range in seconds
        </p>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">Brand *</span>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass}>
              <option value="">Select brand</option>
              {carBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">Model *</span>
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Swift, Creta"
              className={inputClass}
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-600">Year *</span>
              <select value={year} onChange={(e) => setYear(e.target.value)} className={inputClass}>
                <option value="">Year</option>
                {carYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-600">KMs *</span>
              <input
                type="number"
                value={kms}
                onChange={(e) => setKms(e.target.value)}
                placeholder="45000"
                className={inputClass}
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">City</span>
            <select value={city} onChange={(e) => setCity(e.target.value)} className={inputClass}>
              <option value="">Select city</option>
              {cities.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={estimate}
            className="w-full rounded-xl bg-[#f75d34] py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#e54d24]"
          >
            Get Free Valuation
          </button>
        </div>
      </div>

      <div>
        {result ? (
          <div className="rounded-2xl border-2 border-[#f75d34]/20 bg-gradient-to-br from-orange-50 to-white p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#f75d34]">
              Estimated Range
            </p>
            <p className="mt-4 text-4xl font-bold text-gray-900">
              ₹{result.min} – ₹{result.max} Lakh
            </p>
            <p className="mt-2 text-body-muted">
              {year} {brand} {model} • {city || "Your city"}
            </p>
            <p className="mt-4 text-caption">
              *Indicative price based on market data. Actual price may vary.
            </p>
            <Link
              href="/sell-car"
              className="mt-6 inline-block rounded-full bg-[#f75d34] px-8 py-3 text-sm font-semibold text-white hover:bg-[#e54d24]"
            >
              List at This Price →
            </Link>
          </div>
        ) : (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
            <span className="text-5xl">📊</span>
            <p className="mt-4 font-semibold text-gray-800">Your valuation appears here</p>
            <p className="mt-2 max-w-xs text-caption sm:text-sm">
              Enter car details and tap Get Free Valuation for instant estimate
            </p>
          </div>
        )}
        <ul className="mt-6 space-y-3">
          {["AI-powered market data", "Updated weekly", "100% free, no signup"].map((t) => (
            <li key={t} className="flex items-center gap-2 text-body-muted">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs text-green-700">✓</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
