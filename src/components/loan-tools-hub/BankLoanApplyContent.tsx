"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import {
  employmentOptions,
  getBankBySlug,
  loanBankCatalogue,
  loanPartners,
  type LoanBankInfo,
  type LoanPartnerId,
} from "@/data/loanBanks";
import type { LoanEmploymentType } from "@/types/loanInquiry";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20";
const labelClass = "mb-1 block text-xs font-semibold text-gray-600";

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

function BankLogo({ bank, size = "lg" }: { bank: LoanBankInfo; size?: "lg" | "sm" }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${bank.color} font-black text-white shadow-sm ${
        size === "lg" ? "h-12 w-12 text-[11px]" : "h-9 w-9 text-[9px]"
      }`}
      aria-hidden
    >
      {bank.logo}
    </span>
  );
}

export default function BankLoanApplyContent() {
  const searchParams = useSearchParams();
  const [selectedBank, setSelectedBank] = useState<LoanBankInfo | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<LoanPartnerId | null>(
    null
  );
  const [partnerQuery, setPartnerQuery] = useState("");
  const [bankQuery, setBankQuery] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  // Pre-select a bank when arriving via ?bank=<slug> (e.g. from compare table).
  useEffect(() => {
    const slug = searchParams?.get("bank");
    const bank = getBankBySlug(slug);
    if (bank) {
      setSelectedBank(bank);
      setSubmitted(false);
    }
  }, [searchParams]);

  const partner = selectedBank ? loanPartners[selectedBank.partner] : null;

  const filteredPartners = useMemo(() => {
    const q = partnerQuery.trim().toLowerCase();
    return Object.values(loanPartners).filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
    );
  }, [partnerQuery]);

  const filteredBanks = useMemo(() => {
    const q = bankQuery.trim().toLowerCase();
    return loanBankCatalogue.filter((b) => {
      if (selectedPartner && b.partner !== selectedPartner) return false;
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        b.partner.toLowerCase().includes(q) ||
        b.highlight.toLowerCase().includes(q)
      );
    });
  }, [bankQuery, selectedPartner]);

  const handleSelectBank = (bank: LoanBankInfo) => {
    setSelectedBank(bank);
    setSubmitted(false);
    setError(null);
    // Scroll the form into view on mobile.
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const update = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isValid = useMemo(() => {
    return (
      form.fullName.trim().length >= 2 &&
      /^[6-9]\d{9}$/.test(form.mobile) &&
      /^\S+@\S+\.\S+$/.test(form.email) &&
      form.city.trim().length > 0 &&
      Number(form.monthlyIncome) > 0
    );
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank || !partner || !isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.createLoanInquiry({
        bank_name: selectedBank.name,
        loan_partner: partner.name,
        full_name: form.fullName,
        mobile: form.mobile,
        email: form.email,
        city: form.city,
        monthly_income: Number(form.monthlyIncome),
        employment_type: form.employmentType,
        car_budget: form.carBudget,
        message: form.message,
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setSubmitted(false);
    setForm(emptyForm);
    setError(null);
  };

  return (
    <div className="space-y-12">
      {/* Loan partners */}
      <section>
        <h2 className="section-title-lg">Our Trusted Loan Partners</h2>
        <p className="mt-1 text-body-muted">
          Select a loan partner to see only its banks — or search by name.
        </p>
        <label className="mt-4 flex max-w-md items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[#f75d34] focus-within:ring-2 focus-within:ring-[#f75d34]/20">
          <span className="text-gray-400" aria-hidden>
            🔍
          </span>
          <input
            type="search"
            value={partnerQuery}
            onChange={(e) => setPartnerQuery(e.target.value)}
            placeholder="Search loan partners…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </label>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {filteredPartners.length === 0 ? (
            <p className="col-span-full rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
              No loan partners match &ldquo;{partnerQuery}&rdquo;.
            </p>
          ) : (
            filteredPartners.map((p) => {
              const isActive = selectedPartner === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() =>
                    setSelectedPartner((prev) => (prev === p.id ? null : p.id))
                  }
                  className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition ${
                    isActive
                      ? "border-[#f75d34] ring-2 ring-[#f75d34]/20"
                      : "border-gray-200 hover:border-[#f75d34]/40 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center rounded-lg bg-gradient-to-r ${p.accent} px-3 py-1 text-sm font-bold text-white`}
                    >
                      {p.name}
                    </span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${
                        isActive
                          ? "border-[#f75d34] bg-[#f75d34] text-white"
                          : "border-gray-300 text-transparent"
                      }`}
                      aria-hidden
                    >
                      ✓
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-900">
                    {p.tagline}
                  </p>
                  <p className="mt-1 text-caption sm:text-sm">{p.description}</p>
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* Bank selection */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title-lg">Select a Bank</h2>
            <p className="mt-1 text-body-muted">
              Choose your preferred lender and click{" "}
              <strong>Check Eligibility</strong> to apply.
            </p>
          </div>
          {selectedPartner && (
            <button
              type="button"
              onClick={() => setSelectedPartner(null)}
              className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Showing {loanPartners[selectedPartner].name} banks · Clear ✕
            </button>
          )}
        </div>
        <label className="mt-4 flex max-w-md items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[#f75d34] focus-within:ring-2 focus-within:ring-[#f75d34]/20">
          <span className="text-gray-400" aria-hidden>
            🔍
          </span>
          <input
            type="search"
            value={bankQuery}
            onChange={(e) => setBankQuery(e.target.value)}
            placeholder="Search banks by name…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </label>
        {filteredBanks.length === 0 && (
          <p className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
            No banks found. Try a different search
            {selectedPartner ? " or clear the partner filter" : ""}.
          </p>
        )}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBanks.map((bank) => {
            const isActive = selectedBank?.slug === bank.slug;
            const bankPartner = loanPartners[bank.partner];
            return (
              <div
                key={bank.slug}
                className={`flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition ${
                  isActive
                    ? "border-[#f75d34] ring-2 ring-[#f75d34]/20"
                    : "border-gray-200 hover:border-[#f75d34]/40 hover:shadow-md"
                }`}
              >
                <div className="flex items-start gap-3">
                  <BankLogo bank={bank} />
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900">{bank.name}</p>
                    <p className="mt-0.5 text-[11px] font-medium text-green-700">
                      {bank.highlight}
                    </p>
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-y-2 text-[12px]">
                  <dt className="text-gray-500">Interest</dt>
                  <dd className="text-right font-semibold text-gray-900">
                    {bank.rate}
                  </dd>
                  <dt className="text-gray-500">Processing</dt>
                  <dd className="text-right font-semibold text-gray-900">
                    {bank.processing}
                  </dd>
                  <dt className="text-gray-500">Tenure</dt>
                  <dd className="text-right font-semibold text-gray-900">
                    {bank.tenure}
                  </dd>
                  <dt className="text-gray-500">Funding</dt>
                  <dd className="text-right font-semibold text-gray-900">
                    {bank.maxFunding}
                  </dd>
                </dl>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                  <span className="text-[11px] text-gray-500">
                    via{" "}
                    <span className="font-semibold text-gray-700">
                      {bankPartner.name}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectBank(bank)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      isActive
                        ? "bg-[#f75d34] text-white"
                        : "bg-orange-50 text-[#f75d34] hover:bg-orange-100"
                    }`}
                  >
                    {isActive ? "Selected ✓" : "Check Eligibility"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Loan inquiry form */}
      <section ref={formRef} className="scroll-mt-24">
        {!selectedBank ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <span className="text-4xl" aria-hidden>
              🏦
            </span>
            <p className="mt-3 font-semibold text-gray-900">
              Select a bank above to get started
            </p>
            <p className="mt-1 text-caption sm:text-sm">
              Your loan inquiry form will appear here with the bank and loan
              partner auto-filled.
            </p>
          </div>
        ) : submitted ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center sm:p-12">
            <span className="text-5xl" aria-hidden>
              ✅
            </span>
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Thank you for your interest.
            </h3>
            <p className="mx-auto mt-2 max-w-md text-body-muted">
              Your loan inquiry has been submitted successfully. Our loan
              partner <strong>{partner?.name}</strong> will contact you shortly.
            </p>
            <button
              type="button"
              onClick={resetAll}
              className="mt-6 rounded-full border border-[#f75d34] px-6 py-2.5 text-sm font-semibold text-[#f75d34] hover:bg-orange-50"
            >
              Submit another inquiry
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            {/* Auto-filled info card */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 via-white to-white p-5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f75d34]">
                  Selected Bank
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <BankLogo bank={selectedBank} />
                  <div>
                    <p className="font-bold text-gray-900">{selectedBank.name}</p>
                    <p className="text-[11px] font-medium text-green-700">
                      {selectedBank.highlight}
                    </p>
                  </div>
                </div>
                <dl className="mt-4 space-y-1.5 text-[12px]">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Interest Rate</dt>
                    <dd className="font-semibold text-gray-900">
                      {selectedBank.rate}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Tenure</dt>
                    <dd className="font-semibold text-gray-900">
                      {selectedBank.tenure}
                    </dd>
                  </div>
                </dl>
              </div>

              {partner && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                    Loan Partner
                  </p>
                  <span
                    className={`mt-3 inline-flex items-center rounded-lg bg-gradient-to-r ${partner.accent} px-3 py-1 text-sm font-bold text-white`}
                  >
                    {partner.name}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    {partner.tagline}
                  </p>
                  <p className="mt-1 text-caption sm:text-sm">
                    {partner.description}
                  </p>
                </div>
              )}
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7"
            >
              <h3 className="text-lg font-bold text-gray-900">
                Loan Inquiry Form
              </h3>
              <p className="mt-1 text-caption sm:text-sm">
                Fill in your details and our partner will reach out with the
                best offer.
              </p>

              {/* Auto-filled (read-only) */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={labelClass}>Selected Bank</span>
                  <input
                    value={selectedBank.name}
                    readOnly
                    className={`${inputClass} cursor-not-allowed bg-gray-100 font-semibold text-gray-700`}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Loan Partner</span>
                  <input
                    value={partner?.name ?? ""}
                    readOnly
                    className={`${inputClass} cursor-not-allowed bg-gray-100 font-semibold text-gray-700`}
                  />
                </label>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className={labelClass}>Full Name *</span>
                  <input
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder="As per PAN card"
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Mobile Number *</span>
                  <input
                    value={form.mobile}
                    onChange={(e) =>
                      update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit mobile"
                    inputMode="numeric"
                    maxLength={10}
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Email Address *</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>City *</span>
                  <input
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="e.g. Mumbai"
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Monthly Income (₹) *</span>
                  <input
                    type="number"
                    min={0}
                    value={form.monthlyIncome}
                    onChange={(e) => update("monthlyIncome", e.target.value)}
                    placeholder="e.g. 45000"
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Employment Type</span>
                  <select
                    value={form.employmentType}
                    onChange={(e) =>
                      update("employmentType", e.target.value as LoanEmploymentType)
                    }
                    className={inputClass}
                  >
                    {employmentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={labelClass}>Car Budget</span>
                  <input
                    value={form.carBudget}
                    onChange={(e) => update("carBudget", e.target.value)}
                    placeholder="e.g. ₹6 – 8 Lakh"
                    className={inputClass}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className={labelClass}>Message</span>
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Anything you'd like our loan partner to know…"
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </label>
              </div>

              {error && (
                <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!isValid || submitting}
                className="mt-5 w-full rounded-xl bg-[#f75d34] py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#e54d24] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit Loan Inquiry"}
              </button>

              <p className="mt-4 rounded-lg bg-gray-50 px-3 py-3 text-[11px] leading-relaxed text-gray-500">
                By submitting this form, you consent to Old Car Bazar sharing
                your details with our loan assistance partners and selected
                financial institutions for loan processing.
              </p>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
