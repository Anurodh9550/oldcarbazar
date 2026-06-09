"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useListings } from "@/context/ListingsContext";
import { useLocation } from "@/context/LocationContext";
import { enrichCar } from "@/lib/carMeta";
import {
  applySearchFilters,
  enrichCarForSearch,
} from "@/lib/searchFilters";
import type { SearchFilterParams } from "@/data/searchPage";

type Choice = { id: string; label: string; emoji?: string };

const BUDGET_CHOICES: Choice[] = [
  { id: "under-2", label: "Under ₹2 Lakh", emoji: "🪙" },
  { id: "2-3", label: "₹2 – ₹3 Lakh", emoji: "💵" },
  { id: "3-5", label: "₹3 – ₹5 Lakh", emoji: "💰" },
  { id: "5-10", label: "₹5 – ₹10 Lakh", emoji: "🏦" },
  { id: "10-15", label: "₹10 – ₹15 Lakh", emoji: "✨" },
  { id: "15-plus", label: "Above ₹15 Lakh", emoji: "👑" },
];

const USE_CHOICES: Choice[] = [
  { id: "Hatchback", label: "City / Compact", emoji: "🏙️" },
  { id: "Sedan", label: "Comfort / Sedan", emoji: "🚗" },
  { id: "SUV", label: "Adventure / SUV", emoji: "🏔️" },
  { id: "MUV", label: "Family / 7-Seater", emoji: "👨‍👩‍👧‍👦" },
  { id: "", label: "No preference", emoji: "🤷" },
];

const FUEL_CHOICES: Choice[] = [
  { id: "Petrol", label: "Petrol", emoji: "⛽" },
  { id: "Diesel", label: "Diesel", emoji: "🛢️" },
  { id: "CNG", label: "CNG", emoji: "🌿" },
  { id: "Electric", label: "Electric", emoji: "🔋" },
  { id: "", label: "No preference", emoji: "🤷" },
];

const TRANSMISSION_CHOICES: Choice[] = [
  { id: "Manual", label: "Manual", emoji: "🕹️" },
  { id: "Automatic", label: "Automatic", emoji: "⚙️" },
  { id: "", label: "No preference", emoji: "🤷" },
];

const STEPS = [
  { key: "budget", title: "What's your budget?", choices: BUDGET_CHOICES },
  { key: "use", title: "How will you use it?", choices: USE_CHOICES },
  { key: "fuel", title: "Preferred fuel type?", choices: FUEL_CHOICES },
  {
    key: "transmission",
    title: "Manual or automatic?",
    choices: TRANSMISSION_CHOICES,
  },
] as const;

type Answers = {
  budget: string | null;
  use: string | null;
  fuel: string | null;
  transmission: string | null;
};

const EMPTY: Answers = {
  budget: null,
  use: null,
  fuel: null,
  transmission: null,
};

export default function FindMyCarWizard({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { allListings } = useListings();
  const { selectedCity } = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);

  const params: SearchFilterParams = useMemo(
    () => ({
      q: null,
      city: selectedCity,
      brand: null,
      fuel: answers.fuel || null,
      transmission: answers.transmission || null,
      budget: answers.budget || null,
      kms: null,
      ownership: null,
      bodyType: answers.use || null,
      sellerType: null,
      premium: null,
      rto: null,
      seats: null,
      discount: null,
      color: null,
    }),
    [answers, selectedCity]
  );

  const matchCount = useMemo(() => {
    const enriched = allListings.map(enrichCar).map(enrichCarForSearch);
    return applySearchFilters(enriched, params).length;
  }, [allListings, params]);

  if (!open) return null;

  const current = STEPS[step];
  const selectedValue = answers[current.key as keyof Answers];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  const choose = (id: string) => {
    setAnswers((prev) => ({ ...prev, [current.key]: id }));
    if (!isLast) setStep((s) => s + 1);
  };

  const showResults = () => {
    const sp = new URLSearchParams();
    if (params.city) sp.set("city", params.city);
    if (params.budget) sp.set("budget", params.budget);
    if (params.bodyType) sp.set("bodyType", params.bodyType);
    if (params.fuel) sp.set("fuel", params.fuel);
    if (params.transmission) sp.set("transmission", params.transmission);
    onClose();
    router.push(`/used-cars/search?${sp.toString()}`);
  };

  const reset = () => {
    setAnswers(EMPTY);
    setStep(0);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Find my car"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-r from-[#f75d34] to-[#ff8a5c] px-5 py-4 text-white">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            ✕
          </button>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
            Find My Car · Step {step + 1} of {STEPS.length}
          </p>
          <h2 className="mt-1 text-lg font-bold">{current.title}</h2>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 p-5 sm:grid-cols-3">
          {current.choices.map((choice) => {
            const active = selectedValue === choice.id;
            return (
              <button
                key={choice.id || "any"}
                type="button"
                onClick={() => choose(choice.id)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-4 text-center text-xs font-semibold transition ${
                  active
                    ? "border-[#f75d34] bg-orange-50 text-[#f75d34]"
                    : "border-gray-200 bg-white text-gray-700 hover:border-[#f75d34]/50 hover:bg-orange-50/40"
                }`}
              >
                <span className="text-2xl">{choice.emoji}</span>
                {choice.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="text-sm font-semibold text-gray-500 hover:text-gray-800"
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              onClick={reset}
              className="text-xs font-medium text-gray-400 hover:text-gray-600"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              <span className="font-bold text-[#f75d34]">{matchCount}</span>{" "}
              cars in {selectedCity}
            </span>
            {isLast ? (
              <button
                type="button"
                onClick={showResults}
                className="rounded-full bg-[#f75d34] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e54d24]"
              >
                See {matchCount} cars →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[#f75d34] hover:text-[#f75d34]"
              >
                Skip
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
