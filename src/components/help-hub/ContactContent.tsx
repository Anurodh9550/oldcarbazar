"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20";

export default function ContactContent() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="py-16 text-center">
        <span className="text-5xl">✉</span>
        <h2 className="mt-4 text-xl font-bold">Message Sent!</h2>
        <p className="mt-2 text-body-muted">We&apos;ll reply within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h2 className="section-title">Get in Touch</h2>
        <ul className="mt-6 space-y-4">
          {[
            { icon: "📧", label: "Email", value: "support@oldcarbazar.com" },
            { icon: "📞", label: "Phone", value: "1800-XXX-XXXX (Mon–Sat)" },
            { icon: "📍", label: "Office", value: "Ahmedabad, Gujarat, India" },
            { icon: "⏰", label: "Hours", value: "9:00 AM – 8:00 PM IST" },
          ].map((item) => (
            <li key={item.label} className="flex gap-4 rounded-xl border border-gray-100 p-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">{item.label}</p>
                <p className="font-medium text-gray-900">{item.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="rounded-2xl border border-gray-200 bg-gray-50 p-6"
      >
        <h3 className="font-bold text-gray-900">Send a Message</h3>
        <div className="mt-4 space-y-3">
          <input required placeholder="Your name *" className={inputClass} />
          <input required type="email" placeholder="Email *" className={inputClass} />
          <select required className={inputClass} defaultValue="">
            <option value="" disabled>Topic *</option>
            <option>Buying a car</option>
            <option>Selling a car</option>
            <option>Technical issue</option>
            <option>Partnership</option>
            <option>Other</option>
          </select>
          <textarea required rows={4} placeholder="Your message *" className={inputClass} />
        </div>
        <button type="submit" className="mt-4 w-full rounded-xl bg-[#f75d34] py-3 font-bold text-white">
          Send Message
        </button>
      </form>
    </div>
  );
}
