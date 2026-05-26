"use client";

import { useState } from "react";
import { insurancePlans } from "@/data/sellHubPages";

export default function InsuranceContent() {
  const [selected, setSelected] = useState(0);
  const [regNumber, setRegNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleGetQuote = () => {
    const cleaned = regNumber.trim().toUpperCase();
    if (cleaned.length < 4) {
      setError("Enter a valid car registration number (e.g. DL10AB1234).");
      return;
    }
    setError("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div>
      <p className="text-body-muted">
        Renewing your insurance after buying or selling a car is essential.
        Compare plans and choose the best cover.
      </p>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {insurancePlans.map((plan, i) => (
          <li key={plan.name}>
            <button
              type="button"
              onClick={() => setSelected(i)}
              className={`w-full rounded-2xl border p-6 text-left transition ${
                selected === i
                  ? "border-[#f75d34] bg-orange-50 ring-2 ring-[#f75d34]/20"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <h3 className="font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-2 text-body-muted">{plan.desc}</p>
              <p className="mt-4 text-lg font-bold text-[#f75d34]">From {plan.from}</p>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-8 rounded-2xl bg-gray-900 p-6 text-white sm:p-8">
        <h3 className="font-bold">Get Insurance Quote</h3>
        <p className="mt-2 text-sm text-gray-300">
          Enter your details — we&apos;ll connect you with top insurers
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={regNumber}
            onChange={(e) => {
              setRegNumber(e.target.value.toUpperCase());
              setError("");
            }}
            placeholder="Car registration number (e.g. DL10AB1234)"
            className="flex-1 rounded-lg border-0 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:bg-white/20 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleGetQuote}
            className="rounded-lg bg-[#f75d34] px-6 py-3 text-sm font-bold hover:bg-[#e54d24]"
          >
            Get Quote
          </button>
        </div>
        {error && (
          <p className="mt-3 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}
        {submitted && (
          <p className="mt-3 rounded-lg bg-emerald-500/20 px-3 py-2 text-sm text-emerald-100">
            Thanks! We&apos;ll reach out shortly with the best quote for{" "}
            <span className="font-semibold">{regNumber}</span> ({
              insurancePlans[selected].name
            }).
          </p>
        )}
      </div>
    </div>
  );
}
