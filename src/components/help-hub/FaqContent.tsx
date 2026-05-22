"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { faqs, faqsHi } from "@/data/helpHubPages";

export default function FaqContent() {
  const [open, setOpen] = useState<number | null>(0);
  const { language } = useLanguage();
  const list = language === "hi" ? faqsHi : faqs;

  return (
    <ul className="space-y-3">
      {list.map((faq, i) => (
        <li key={faq.q} className="overflow-hidden rounded-xl border border-gray-200">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 bg-white px-5 py-4 text-left hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-900">{faq.q}</span>
            <span className="shrink-0 text-xl text-gray-400">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 text-body-muted">
              {faq.a}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
