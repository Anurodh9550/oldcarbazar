"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20";

function formatINR(num: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num);
}

const employmentTypes = ["Salaried", "Self-Employed", "Business Owner"];

export default function LoanEligibilityContent() {
  const [employment, setEmployment] = useState("Salaried");
  const [income, setIncome] = useState(50000);
  const [obligations, setObligations] = useState(5000);
  const [age, setAge] = useState(28);
  const [tenure, setTenure] = useState(60);
  const [rate, setRate] = useState(10.5);

  const eligibility = useMemo(() => {
    const disposable = Math.max(income - obligations, 0);
    const foir = employment === "Salaried" ? 0.55 : 0.5;
    const eligibleEmi = disposable * foir;
    const monthlyRate = rate / 12 / 100;
    const n = tenure;
    let loan = 0;
    if (monthlyRate > 0 && n > 0 && eligibleEmi > 0) {
      loan =
        (eligibleEmi * (Math.pow(1 + monthlyRate, n) - 1)) /
        (monthlyRate * Math.pow(1 + monthlyRate, n));
    }
    const maxAgeAllowed = 65;
    const tenureCapByAge = Math.max((maxAgeAllowed - age) * 12, 0);
    const ageOk = age >= 21 && age <= 65 && tenure <= tenureCapByAge;
    return {
      loan,
      eligibleEmi,
      foir: foir * 100,
      ageOk,
      tenureCapByAge,
    };
  }, [employment, income, obligations, age, tenure, rate]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <h2 className="section-title">Check Your Loan Eligibility</h2>
        <p className="mt-1 text-caption sm:text-sm">
          Apni details fill karein — instant eligibility check, no documents
          needed, no CIBIL impact
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <span className="mb-2 block text-xs font-semibold text-gray-700">
              Employment Type
            </span>
            <div className="grid grid-cols-3 gap-2">
              {employmentTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEmployment(type)}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                    employment === type
                      ? "border-[#f75d34] bg-orange-50 text-[#f75d34]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">
                Monthly Net Income (₹)
              </span>
              <span className="text-xs font-bold text-[#f75d34]">
                ₹{formatINR(income)}
              </span>
            </div>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>

          <label className="block">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">
                Existing EMI Obligations (₹)
              </span>
              <span className="text-xs font-bold text-[#f75d34]">
                ₹{formatINR(obligations)}
              </span>
            </div>
            <input
              type="number"
              value={obligations}
              onChange={(e) => setObligations(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>

          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-700">
                Age
              </span>
              <input
                type="number"
                value={age}
                min={18}
                max={70}
                onChange={(e) => setAge(Number(e.target.value) || 0)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-700">
                Tenure (mo)
              </span>
              <input
                type="number"
                value={tenure}
                min={6}
                max={96}
                onChange={(e) => setTenure(Number(e.target.value) || 0)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-700">
                Rate (%)
              </span>
              <input
                type="number"
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value) || 0)}
                className={inputClass}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border-2 border-[#f75d34]/20 bg-gradient-to-br from-orange-50 to-white p-6 text-center sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#f75d34]">
            Maximum Eligible Loan
          </p>
          <p className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            ₹{formatINR(Math.round(eligibility.loan))}
          </p>
          <p className="mt-1 text-caption">
            Based on FOIR {eligibility.foir.toFixed(0)}% & tenure {tenure} months
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
              Eligible EMI
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              ₹{formatINR(Math.round(eligibility.eligibleEmi))}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-500">per month</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
              Age Check
            </p>
            <p
              className={`mt-1 text-lg font-bold ${
                eligibility.ageOk ? "text-green-600" : "text-amber-600"
              }`}
            >
              {eligibility.ageOk ? "Eligible" : "Adjust tenure"}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-500">
              Max tenure: {Math.min(eligibility.tenureCapByAge, 84)} mo
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Tips to Increase Eligibility
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-600">✓</span>
              Existing loans / credit card dues clear karein
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-600">✓</span>
              Co-applicant (spouse / parent) add karein
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-600">✓</span>
              Longer tenure choose karke EMI kam karein
            </li>
          </ul>
        </div>

        <Link
          href="/used-car-loan"
          className="block w-full rounded-xl bg-[#f75d34] py-3.5 text-center text-sm font-bold text-white shadow-lg hover:bg-[#e54d24]"
        >
          Apply for This Loan →
        </Link>
      </div>
    </div>
  );
}
