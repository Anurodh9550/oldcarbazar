"use client";

import { useState } from "react";
import { insurancePlans } from "@/data/sellHubPages";

export default function InsuranceContent() {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <p className="text-body-muted">
        Car bechne ya kharidne ke baad insurance renew karna zaroori hai. Compare
        plans and choose the best cover.
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
            placeholder="Car registration number"
            className="flex-1 rounded-lg border-0 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-400"
          />
          <button
            type="button"
            className="rounded-lg bg-[#f75d34] px-6 py-3 text-sm font-bold hover:bg-[#e54d24]"
          >
            Get Quote
          </button>
        </div>
      </div>
    </div>
  );
}
