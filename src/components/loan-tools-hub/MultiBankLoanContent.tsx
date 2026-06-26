"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  employmentOptions,
  loanBankCatalogue,
  loanPartners,
  type LoanBankInfo,
} from "@/data/loanBanks";
import type { LoanEmploymentType } from "@/types/loanInquiry";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20";

type FormState = {
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  monthlyIncome: string;
  employmentType: LoanEmploymentType;
  carBudget: string;
  message: string;
};

const emptyForm: FormState = {
  fullName: "",
  mobile: "",
  email: "",
  city: "",
  monthlyIncome: "",
  employmentType: "salaried",
  carBudget: "",
  message: "",
};

const DEFAULT_SLUGS = [
  "hdfc-bank",
  "icici-bank",
  "axis-bank",
  "sbi-bank",
  "kotak-mahindra-bank",
  "bajaj-finserv",
];

function BankTile({
  bank,
  selected,
  onToggle,
}: {
  bank: LoanBankInfo;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
        selected
          ? "border-[#f75d34] bg-orange-50 ring-2 ring-[#f75d34]/20"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="accent-[#f75d34]"
      />
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${bank.color} text-[9px] font-black text-white`}
      >
        {bank.logo}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-gray-900">{bank.name}</span>
        <span className="block text-[11px] text-gray-500">{bank.rate}</span>
      </span>
    </label>
  );
}

export default function MultiBankLoanContent() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(
    () => new Set(DEFAULT_SLUGS)
  );
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    succeeded: string[];
    failed: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedBanks = useMemo(
    () => loanBankCatalogue.filter((b) => selectedSlugs.has(b.slug)),
    [selectedSlugs]
  );

  const isValid = useMemo(
    () =>
      form.fullName.trim().length >= 2 &&
      /^[6-9]\d{9}$/.test(form.mobile) &&
      /^\S+@\S+\.\S+$/.test(form.email) &&
      form.city.trim().length > 0 &&
      Number(form.monthlyIncome) > 0 &&
      selectedBanks.length > 0,
    [form, selectedBanks.length]
  );

  const toggleBank = (slug: string) => {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const selectAll = () =>
    setSelectedSlugs(new Set(loanBankCatalogue.map((b) => b.slug)));
  const selectTop = () => setSelectedSlugs(new Set(DEFAULT_SLUGS));
  const clearAll = () => setSelectedSlugs(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.createMultiBankLoanInquiries(
        selectedBanks.map((b) => ({
          bank_name: b.name,
          loan_partner: loanPartners[b.partner].name,
        })),
        {
          full_name: form.fullName.trim(),
          mobile: form.mobile,
          email: form.email.trim(),
          city: form.city.trim(),
          monthly_income: Number(form.monthlyIncome),
          employment_type: form.employmentType,
          car_budget: form.carBudget.trim(),
          message:
            form.message.trim() ||
            "Multi-bank marketplace application — compare best offer.",
        }
      );
      setResult(res);
      if (res.failed.length > 0 && res.succeeded.length === 0) {
        setError("Could not submit to any bank. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-sky-700">
          Multi-Bank Loan Marketplace
        </p>
        <h2 className="mt-1 text-xl font-bold text-gray-900">
          One application → multiple banks
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Fill the form once. We route your application to every bank you select
          — compare approvals and pick the lowest EMI. No repeated paperwork.
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Prefer a single bank?{" "}
          <Link href="/car-loan" className="font-semibold text-[#f75d34] hover:underline">
            Apply to one bank →
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-gray-900">
              Select banks ({selectedBanks.length})
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={selectTop}
                className="font-semibold text-[#f75d34] hover:underline"
              >
                Top 6
              </button>
              <button
                type="button"
                onClick={selectAll}
                className="font-semibold text-gray-600 hover:underline"
              >
                All banks
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="font-semibold text-gray-400 hover:underline"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {loanBankCatalogue.map((bank) => (
              <BankTile
                key={bank.slug}
                bank={bank}
                selected={selectedSlugs.has(bank.slug)}
                onToggle={() => toggleBank(bank.slug)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-bold text-gray-900">Your details (fill once)</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Full name *
              </span>
              <input
                required
                value={form.fullName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fullName: e.target.value }))
                }
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Mobile *
              </span>
              <input
                required
                value={form.mobile}
                onChange={(e) =>
                  setForm((f) => ({ ...f, mobile: e.target.value }))
                }
                className={inputClass}
                maxLength={10}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Email *
              </span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                City *
              </span>
              <input
                required
                value={form.city}
                onChange={(e) =>
                  setForm((f) => ({ ...f, city: e.target.value }))
                }
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Monthly income (₹) *
              </span>
              <input
                required
                type="number"
                value={form.monthlyIncome}
                onChange={(e) =>
                  setForm((f) => ({ ...f, monthlyIncome: e.target.value }))
                }
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Employment
              </span>
              <select
                value={form.employmentType}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    employmentType: e.target.value as LoanEmploymentType,
                  }))
                }
                className={inputClass}
              >
                {employmentOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Car budget
              </span>
              <input
                value={form.carBudget}
                onChange={(e) =>
                  setForm((f) => ({ ...f, carBudget: e.target.value }))
                }
                className={inputClass}
                placeholder="e.g. ₹8 Lakh"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Notes
              </span>
              <textarea
                rows={2}
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                className={inputClass}
              />
            </label>
          </div>
        </section>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {result && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
            <p className="font-bold text-emerald-900">Application submitted</p>
            {result.succeeded.length > 0 && (
              <p className="mt-2 text-emerald-800">
                Sent to {result.succeeded.length} bank
                {result.succeeded.length !== 1 ? "s" : ""}:{" "}
                {result.succeeded.join(", ")}
              </p>
            )}
            {result.failed.length > 0 && (
              <p className="mt-1 text-amber-800">
                Could not reach: {result.failed.join(", ")}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-600">
              Our loan partners will contact you with competing offers within
              24–48 hours.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || submitting}
          className="w-full rounded-xl bg-[#f75d34] py-3.5 text-sm font-bold text-white hover:bg-[#e54d24] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? `Submitting to ${selectedBanks.length} banks…`
            : `Apply to ${selectedBanks.length} selected bank${selectedBanks.length !== 1 ? "s" : ""}`}
        </button>
      </form>
    </div>
  );
}
