"use client";

import Link from "next/link";
import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20";

const partnerTypes = [
  { icon: "🏪", title: "Dealers", desc: "Showroom listings, verified badge, lead dashboard." },
  { icon: "🛡", title: "Insurance", desc: "Used car insurance offers for our buyers." },
  { icon: "🔧", title: "Service Partners", desc: "Inspection, servicing aur warranty tie-ups." },
];

export default function PartnerContent() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="py-16 text-center">
        <span className="text-5xl">🤝</span>
        <h2 className="mt-4 text-xl font-bold">Application Received!</h2>
        <p className="mt-2 text-body-muted">Our partnerships team will contact you soon.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <ul className="space-y-4">
          {partnerTypes.map((p) => (
            <li key={p.title} className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50 p-5">
              <span className="text-2xl">{p.icon}</span>
              <div>
                <h3 className="font-bold text-gray-900">{p.title}</h3>
                <p className="mt-1 text-body-muted">{p.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <Link
          href="/dealer"
          className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800"
        >
          Dealer Login →
        </Link>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="rounded-2xl border border-gray-200 bg-gray-50 p-6"
      >
        <h3 className="font-bold text-gray-900">Partnership Inquiry</h3>
        <div className="mt-4 space-y-3">
          <input required placeholder="Business name *" className={inputClass} />
          <input required placeholder="Contact person *" className={inputClass} />
          <input required type="email" placeholder="Email *" className={inputClass} />
          <input required type="tel" placeholder="Phone *" className={inputClass} />
          <select required className={inputClass} defaultValue="">
            <option value="" disabled>
              Partnership type *
            </option>
            <option>Dealer / Showroom</option>
            <option>Insurance</option>
            <option>Service / Inspection</option>
            <option>Other</option>
          </select>
          <textarea
            required
            rows={3}
            placeholder="Tell us about your business *"
            className={inputClass}
          />
        </div>
        <button type="submit" className="mt-4 w-full rounded-xl bg-[#f75d34] py-3 font-bold text-white">
          Submit Application
        </button>
      </form>
    </div>
  );
}
