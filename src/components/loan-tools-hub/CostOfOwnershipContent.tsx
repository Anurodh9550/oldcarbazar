"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20";

function formatINR(num: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.max(0, Math.round(num))
  );
}

type FuelType = "petrol" | "diesel" | "cng" | "electric";

/** Indicative pump prices (INR/L or INR/kg) — used only as defaults. */
const FUEL_RATE: Record<FuelType, number> = {
  petrol: 105,
  diesel: 95,
  cng: 80,
  electric: 9, // ₹/kWh
};

/** Indicative real-world mileage (km/L for fuel, km/kWh for EV). */
const DEFAULT_MILEAGE: Record<FuelType, number> = {
  petrol: 16,
  diesel: 20,
  cng: 24,
  electric: 7,
};

export default function CostOfOwnershipContent() {
  const [carPrice, setCarPrice] = useState(800000); // ₹
  const [years, setYears] = useState(5);
  const [kmsPerYear, setKmsPerYear] = useState(12000);
  const [fuel, setFuel] = useState<FuelType>("petrol");
  const [fuelRate, setFuelRate] = useState(FUEL_RATE.petrol);
  const [mileage, setMileage] = useState(DEFAULT_MILEAGE.petrol);
  const [insurancePerYear, setInsurancePerYear] = useState(18000);
  const [servicePerYear, setServicePerYear] = useState(12000);
  const [parkingPerMonth, setParkingPerMonth] = useState(0);
  /** Approx. depreciation as a fraction of car price per year. */
  const [depreciationPct, setDepreciationPct] = useState(12);

  const handleFuelChange = (next: FuelType) => {
    setFuel(next);
    setFuelRate(FUEL_RATE[next]);
    setMileage(DEFAULT_MILEAGE[next]);
  };

  const breakdown = useMemo(() => {
    const safeMileage = Math.max(mileage, 0.1);
    const fuelPerYear = (kmsPerYear / safeMileage) * fuelRate;
    const insurance = insurancePerYear * years;
    const service = servicePerYear * years;
    const parking = parkingPerMonth * 12 * years;
    const fuelTotal = fuelPerYear * years;

    // Simple straight-line depreciation: fixed % of original price each year.
    const depreciation = (depreciationPct / 100) * carPrice * years;
    const total = insurance + service + parking + fuelTotal + depreciation;

    return {
      fuelPerYear,
      fuelTotal,
      insurance,
      service,
      parking,
      depreciation,
      total,
      perKm:
        years * kmsPerYear > 0 ? total / (years * kmsPerYear) : 0,
      perMonth: total / Math.max(years * 12, 1),
    };
  }, [
    carPrice,
    years,
    kmsPerYear,
    fuelRate,
    mileage,
    insurancePerYear,
    servicePerYear,
    parkingPerMonth,
    depreciationPct,
  ]);

  const segments: { label: string; value: number; color: string }[] = [
    { label: "Depreciation", value: breakdown.depreciation, color: "#f75d34" },
    { label: "Fuel / Energy", value: breakdown.fuelTotal, color: "#2563eb" },
    { label: "Insurance", value: breakdown.insurance, color: "#10b981" },
    { label: "Service", value: breakdown.service, color: "#f59e0b" },
    { label: "Parking", value: breakdown.parking, color: "#8b5cf6" },
  ];
  const totalForChart = segments.reduce((s, x) => s + x.value, 0) || 1;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <h2 className="section-title">5-Year Cost of Ownership</h2>
        <p className="mt-1 text-caption sm:text-sm">
          A used car&apos;s sticker price is only part of the story. This tool
          adds up fuel, insurance, service, parking and depreciation so you can
          plan the true monthly cost.
        </p>

        <div className="mt-6 space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              label="Car price (₹)"
              value={carPrice}
              onChange={setCarPrice}
              step={10000}
            />
            <SliderField
              label="Ownership years"
              suffix="years"
              value={years}
              min={1}
              max={10}
              onChange={setYears}
            />
            <NumberField
              label="Kilometres / year"
              value={kmsPerYear}
              onChange={setKmsPerYear}
              step={500}
            />
            <div>
              <label className="text-label mb-1.5 block">Fuel type</label>
              <div className="flex flex-wrap gap-1.5">
                {(["petrol", "diesel", "cng", "electric"] as FuelType[]).map(
                  (f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => handleFuelChange(f)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize ${
                        fuel === f
                          ? "bg-[#f75d34] text-white shadow"
                          : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {f}
                    </button>
                  )
                )}
              </div>
            </div>
            <NumberField
              label={
                fuel === "electric"
                  ? "Electricity rate (₹/kWh)"
                  : `${fuel[0].toUpperCase()}${fuel.slice(1)} price (₹/L)`
              }
              value={fuelRate}
              onChange={setFuelRate}
              step={0.5}
            />
            <NumberField
              label={
                fuel === "electric"
                  ? "Range (km / kWh)"
                  : "Mileage (km / L)"
              }
              value={mileage}
              onChange={setMileage}
              step={0.5}
            />
            <NumberField
              label="Insurance / year (₹)"
              value={insurancePerYear}
              onChange={setInsurancePerYear}
              step={500}
            />
            <NumberField
              label="Service / year (₹)"
              value={servicePerYear}
              onChange={setServicePerYear}
              step={500}
            />
            <NumberField
              label="Parking / month (₹)"
              value={parkingPerMonth}
              onChange={setParkingPerMonth}
              step={100}
            />
            <SliderField
              label="Depreciation / year"
              suffix="%"
              value={depreciationPct}
              min={5}
              max={20}
              onChange={setDepreciationPct}
            />
          </div>

          <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-4 text-xs text-orange-800">
            <p className="font-bold">Smart tip</p>
            <p className="mt-1">
              Diesel cars save fuel cost only if you drive 1,200+ km/month.
              Below that, petrol is cheaper after factoring in higher service
              cost.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 via-white to-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Total {years}-year cost
          </p>
          <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            ₹{formatINR(breakdown.total)}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-white/80 p-3 ring-1 ring-gray-100">
              <p className="text-[10px] uppercase tracking-wider text-gray-500">
                Per month
              </p>
              <p className="mt-0.5 text-base font-bold text-gray-900">
                ₹{formatINR(breakdown.perMonth)}
              </p>
            </div>
            <div className="rounded-xl bg-white/80 p-3 ring-1 ring-gray-100">
              <p className="text-[10px] uppercase tracking-wider text-gray-500">
                Per km
              </p>
              <p className="mt-0.5 text-base font-bold text-gray-900">
                ₹{breakdown.perKm.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Stacked horizontal bar */}
          <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-gray-100">
            {segments.map((s) => (
              <span
                key={s.label}
                style={{
                  width: `${(s.value / totalForChart) * 100}%`,
                  background: s.color,
                }}
              />
            ))}
          </div>

          <ul className="mt-5 space-y-2 text-sm">
            {segments.map((s) => (
              <li
                key={s.label}
                className="flex items-center justify-between gap-2"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: s.color }}
                    aria-hidden
                  />
                  <span className="font-medium text-gray-700">{s.label}</span>
                </span>
                <span className="font-semibold text-gray-900">
                  ₹{formatINR(s.value)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 grid grid-cols-2 gap-2 text-[11px] text-gray-500">
            <p>
              Fuel cost per year: <br />
              <span className="font-bold text-gray-800">
                ₹{formatINR(breakdown.fuelPerYear)}
              </span>
            </p>
            <p>
              Total kms driven: <br />
              <span className="font-bold text-gray-800">
                {formatINR(years * kmsPerYear)} km
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/used-car-loan"
            className="flex-1 rounded-xl bg-[#f75d34] py-3 text-center text-sm font-semibold text-white shadow hover:bg-[#e54d24]"
          >
            Get a loan offer
          </Link>
          <Link
            href="/emi-calculator"
            className="flex-1 rounded-xl border border-[#f75d34] py-3 text-center text-sm font-semibold text-[#f75d34] hover:bg-orange-50"
          >
            EMI Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="text-label mb-1 block">{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={0}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={inputClass}
      />
    </label>
  );
}

function SliderField({
  label,
  suffix,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-label">{label}</span>
        <span className="text-sm font-bold text-[#f75d34]">
          {value} {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#f75d34]"
      />
    </label>
  );
}
