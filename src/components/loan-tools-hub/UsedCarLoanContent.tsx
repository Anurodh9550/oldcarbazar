"use client";

import Link from "next/link";
import { useState } from "react";
import { loanBanks, loanBenefits, loanDocs } from "@/data/loanToolsPages";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20";

export default function UsedCarLoanContent() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [city, setCity] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !amount) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-12">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <h2 className="section-title-lg">Used Car Loan — Easy & Fast</h2>
          <p className="mt-2 text-body-muted">
            Top banks aur NBFCs ke saath partnered. Apni used car ke liye loan
            paayein lowest interest rates par. Minimum docs, paperless process
            aur quick disbursal.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {loanBenefits.map((b) => (
              <li
                key={b.title}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4"
              >
                <span className="text-2xl" aria-hidden>
                  {b.icon}
                </span>
                <p className="mt-2 font-semibold text-gray-900">{b.title}</p>
                <p className="mt-1 text-caption sm:text-sm">{b.desc}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 via-white to-white p-6 shadow-sm sm:p-7">
          {submitted ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <span className="text-5xl">✅</span>
              <h3 className="mt-3 text-lg font-bold text-gray-900">
                Application Received
              </h3>
              <p className="mt-2 max-w-xs text-body-muted">
                Hamari loan team {name} ko 24 hours ke andar call karegi with
                best offers from {amount ? `₹${amount} Lakh` : "selected"} loan
                partners.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setName("");
                  setPhone("");
                  setAmount("");
                  setCity("");
                }}
                className="mt-5 rounded-full border border-[#f75d34] px-5 py-2 text-sm font-semibold text-[#f75d34] hover:bg-orange-50"
              >
                Apply Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Get Pre-approved Offer
                </h3>
                <p className="mt-1 text-caption sm:text-sm">
                  2 minute mein apply karein — no obligation, no impact on CIBIL
                </p>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-600">
                  Full Name *
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="As per PAN card"
                  className={inputClass}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-600">
                  Mobile Number *
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit mobile"
                  maxLength={10}
                  className={inputClass}
                  required
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-gray-600">
                    Loan Amount (₹ Lakh) *
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 5"
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-gray-600">
                    City
                  </span>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className={inputClass}
                  />
                </label>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#f75d34] py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#e54d24]"
              >
                Check My Offers
              </button>
              <p className="text-center text-[11px] text-gray-500">
                By submitting, you agree to be contacted by our loan partners.
              </p>
            </form>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title-lg">Compare Top Lenders</h2>
            <p className="mt-1 text-body-muted">
              Live interest rates aur processing fee from leading banks &amp;
              NBFCs
            </p>
          </div>
          <Link
            href="/compare-loans"
            className="hidden text-sm font-semibold text-[#f75d34] hover:underline sm:inline"
          >
            View detailed comparison →
          </Link>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Lender</th>
                  <th className="px-4 py-3 font-semibold">Interest Rate</th>
                  <th className="px-4 py-3 font-semibold">Processing Fee</th>
                  <th className="px-4 py-3 font-semibold">Tenure</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {loanBanks.map((bank) => (
                  <tr key={bank.name} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">{bank.name}</p>
                      {bank.highlight && (
                        <p className="mt-0.5 text-[11px] font-medium text-green-700">
                          {bank.highlight}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-700">{bank.rate}</td>
                    <td className="px-4 py-4 text-gray-700">{bank.processing}</td>
                    <td className="px-4 py-4 text-gray-700">{bank.tenure}</td>
                    <td className="px-4 py-4">
                      <Link
                        href="/loan-eligibility"
                        className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#f75d34] hover:bg-orange-100"
                      >
                        Check eligibility
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-[#0f172a] p-6 text-white sm:p-8">
        <h2 className="text-xl font-bold sm:text-2xl">Documents Required</h2>
        <p className="mt-1 text-sm text-slate-300">
          Bas itne hi docs chahiye — fully digital submission
        </p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {loanDocs.map((d) => (
            <li
              key={d}
              className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2.5 text-sm text-slate-200"
            >
              <span className="mt-0.5 text-green-400">✓</span>
              {d}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
