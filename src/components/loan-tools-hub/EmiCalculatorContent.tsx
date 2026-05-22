"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20";

function formatINR(num: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num);
}

export default function EmiCalculatorContent() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(48);

  const result = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const n = tenure;
    if (monthlyRate === 0 || n === 0) {
      const emi = amount / Math.max(n, 1);
      return { emi, totalPayment: emi * n, totalInterest: 0 };
    }
    const emi =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - amount;
    return { emi, totalPayment, totalInterest };
  }, [amount, rate, tenure]);

  const principalPct = Math.round((amount / Math.max(result.totalPayment, 1)) * 100);
  const interestPct = 100 - principalPct;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <h2 className="section-title">Calculate Your Monthly EMI</h2>
        <p className="mt-1 text-caption sm:text-sm">
          Loan amount, interest rate aur tenure adjust karke apni EMI dekhein
        </p>

        <div className="mt-6 space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">Loan Amount</label>
              <span className="text-sm font-bold text-[#f75d34]">
                ₹{formatINR(amount)}
              </span>
            </div>
            <input
              type="number"
              value={amount}
              min={50000}
              max={5000000}
              step={10000}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className={inputClass}
            />
            <input
              type="range"
              min={50000}
              max={3000000}
              step={10000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-3 w-full accent-[#f75d34]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-gray-400">
              <span>₹50K</span>
              <span>₹30L</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">Interest Rate (p.a.)</label>
              <span className="text-sm font-bold text-[#f75d34]">{rate.toFixed(2)}%</span>
            </div>
            <input
              type="number"
              step={0.1}
              min={5}
              max={25}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value) || 0)}
              className={inputClass}
            />
            <input
              type="range"
              min={5}
              max={20}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="mt-3 w-full accent-[#f75d34]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-gray-400">
              <span>5%</span>
              <span>20%</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">Tenure (months)</label>
              <span className="text-sm font-bold text-[#f75d34]">
                {tenure} months ({(tenure / 12).toFixed(1)} yrs)
              </span>
            </div>
            <input
              type="number"
              min={6}
              max={96}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value) || 0)}
              className={inputClass}
            />
            <input
              type="range"
              min={6}
              max={84}
              step={6}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="mt-3 w-full accent-[#f75d34]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-gray-400">
              <span>6 mo</span>
              <span>84 mo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border-2 border-[#f75d34]/20 bg-gradient-to-br from-orange-50 to-white p-6 text-center sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#f75d34]">
            Monthly EMI
          </p>
          <p className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            ₹{formatINR(Math.round(result.emi))}
          </p>
          <p className="mt-1 text-caption">for {tenure} months</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
              Total Interest
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              ₹{formatINR(Math.round(result.totalInterest))}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
              Total Payment
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              ₹{formatINR(Math.round(result.totalPayment))}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Break-up
          </p>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="flex h-full">
              <div
                className="bg-[#f75d34]"
                style={{ width: `${principalPct}%` }}
                title={`Principal ${principalPct}%`}
              />
              <div
                className="bg-blue-500"
                style={{ width: `${interestPct}%` }}
                title={`Interest ${interestPct}%`}
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-gray-700">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f75d34]" /> Principal {principalPct}%
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-gray-700">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Interest {interestPct}%
            </span>
          </div>
        </div>

        <Link
          href="/used-car-loan"
          className="block w-full rounded-xl bg-[#f75d34] py-3.5 text-center text-sm font-bold text-white shadow-lg hover:bg-[#e54d24]"
        >
          Apply for Loan →
        </Link>
      </div>
    </div>
  );
}
