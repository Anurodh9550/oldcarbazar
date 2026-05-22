"use client";

import { useState } from "react";
import { cities } from "@/data/locations";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20";

export default function DealerLoginContent() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="py-16 text-center">
        <span className="text-5xl">✓</span>
        <h2 className="mt-4 text-xl font-bold text-gray-900">Application Received</h2>
        <p className="mx-auto mt-2 max-w-md text-body-muted">
          Our partner team will contact you within 24–48 hours for verification.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h2 className="section-title">Partner With Old Car Bazar</h2>
        <ul className="mt-6 space-y-4">
          {[
            { icon: "✓", title: "Verified Dealer Badge", desc: "Build trust with buyers instantly" },
            { icon: "📈", title: "Bulk Listing Tools", desc: "Upload multiple cars from dashboard" },
            { icon: "🎯", title: "Priority Leads", desc: "Get serious buyer inquiries first" },
            { icon: "📊", title: "Analytics Dashboard", desc: "Track views, calls and conversions" },
          ].map((item) => (
            <li key={item.title} className="flex gap-4 rounded-xl border border-gray-100 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f75d34]/10 text-lg">
                {item.icon}
              </span>
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-caption sm:text-sm">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="rounded-2xl border border-gray-200 bg-gray-50 p-6"
      >
        <h3 className="font-bold text-gray-900">Dealer Registration</h3>
        <div className="mt-4 space-y-3">
          <input required placeholder="Dealership name *" className={inputClass} />
          <input required placeholder="Contact person *" className={inputClass} />
          <input required type="email" placeholder="Business email *" className={inputClass} />
          <input required type="tel" placeholder="Mobile (10 digits) *" className={inputClass} maxLength={10} />
          <select required className={inputClass} defaultValue="">
            <option value="" disabled>City *</option>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
          <input placeholder="GST number (optional)" className={inputClass} />
        </div>
        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-[#f75d34] py-3.5 text-sm font-bold text-white hover:bg-[#e54d24]"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
