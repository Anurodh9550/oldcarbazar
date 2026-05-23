"use client";

import { useEffect, useState } from "react";

const CONSENTS_KEY = "oldCarBazar_consents";

type Consents = {
  marketingEmail: boolean;
  whatsappAlerts: boolean;
  priceDropAlerts: boolean;
  shareWithPartners: boolean;
};

const defaults: Consents = {
  marketingEmail: true,
  whatsappAlerts: true,
  priceDropAlerts: true,
  shareWithPartners: false,
};

function loadConsents(): Consents {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(CONSENTS_KEY);
    return raw ? { ...defaults, ...(JSON.parse(raw) as Consents) } : defaults;
  } catch {
    return defaults;
  }
}

const rows: { key: keyof Consents; title: string; desc: string }[] = [
  {
    key: "marketingEmail",
    title: "Email updates",
    desc: "New listings, offers, aur platform news.",
  },
  {
    key: "whatsappAlerts",
    title: "WhatsApp alerts",
    desc: "Buyer/seller messages aur inquiry replies.",
  },
  {
    key: "priceDropAlerts",
    title: "Price drop alerts",
    desc: "Shortlisted cars par price kam hone par notify.",
  },
  {
    key: "shareWithPartners",
    title: "Partner offers",
    desc: "Loan, insurance, aur RC services ke partner offers.",
  },
];

export default function ConsentsContent() {
  const [consents, setConsents] = useState<Consents>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setConsents(loadConsents());
  }, []);

  const toggle = (key: keyof Consents) => {
    setConsents((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(CONSENTS_KEY, JSON.stringify(next));
      return next;
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <p className="mb-6 text-body-muted">
        Apni privacy control karo. Changes turant save hoti hain (browser mein).
      </p>
      <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
        {rows.map((row) => (
          <li
            key={row.key}
            className="flex items-start justify-between gap-4 px-4 py-4 sm:items-center"
          >
            <div>
              <p className="font-medium text-gray-900">{row.title}</p>
              <p className="text-caption">{row.desc}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={consents[row.key]}
              onClick={() => toggle(row.key)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                consents[row.key] ? "bg-[#f75d34]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                  consents[row.key] ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
      {saved && (
        <p className="mt-4 text-sm font-medium text-green-600">Preferences saved.</p>
      )}
    </div>
  );
}
