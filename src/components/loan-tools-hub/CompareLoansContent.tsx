"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLoanToolsContent } from "@/hooks/useLoanToolsContent";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20";

function formatINR(num: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num);
}

function parseRateMid(rate: string) {
  const parts = rate.match(/\d+(\.\d+)?/g);
  if (!parts || parts.length === 0) return 11;
  if (parts.length === 1) return parseFloat(parts[0]);
  const lo = parseFloat(parts[0]);
  const hi = parseFloat(parts[1]);
  return (lo + hi) / 2;
}

function calcEMI(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12 / 100;
  if (r === 0 || months === 0) return principal / Math.max(months, 1);
  return (
    (principal * r * Math.pow(1 + r, months)) /
    (Math.pow(1 + r, months) - 1)
  );
}

export default function CompareLoansContent() {
  const { banks: loanBanks } = useLoanToolsContent();
  const [amount, setAmount] = useState(500000);
  const [tenure, setTenure] = useState(48);

  const rows = useMemo(
    () =>
      loanBanks.map((b) => {
        const rate = parseRateMid(b.rate);
        const emi = calcEMI(amount, rate, tenure);
        const total = emi * tenure;
        const interest = total - amount;
        return { ...b, rate, emi, total, interest };
      }),
    [amount, tenure, loanBanks]
  );

  const cheapest = useMemo(
    () => rows.slice().sort((a, b) => a.emi - b.emi)[0],
    [rows]
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:grid-cols-2 sm:p-6">
        <label className="block">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">
              Loan Amount
            </span>
            <span className="text-sm font-bold text-[#f75d34]">
              ₹{formatINR(amount)}
            </span>
          </div>
          <input
            type="range"
            min={50000}
            max={3000000}
            step={10000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-[#f75d34]"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className={`${inputClass} mt-2`}
          />
        </label>

        <label className="block">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">
              Tenure (months)
            </span>
            <span className="text-sm font-bold text-[#f75d34]">
              {tenure} mo ({(tenure / 12).toFixed(1)} yrs)
            </span>
          </div>
          <input
            type="range"
            min={6}
            max={84}
            step={6}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full accent-[#f75d34]"
          />
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value) || 0)}
            className={`${inputClass} mt-2`}
          />
        </label>
      </section>

      {cheapest && (
        <section className="rounded-2xl border-2 border-green-200 bg-green-50/60 p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-green-700">
            Best Deal For You
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{cheapest.name}</h3>
              <p className="text-caption sm:text-sm">
                At {cheapest.rate.toFixed(2)}% over {tenure} months
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-gray-500">
                Monthly EMI
              </p>
              <p className="text-2xl font-bold text-green-700">
                ₹{formatINR(Math.round(cheapest.emi))}
              </p>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="section-title-lg">All Lenders Side-by-Side</h2>
        <p className="mt-1 text-body-muted">
          Compare EMI, total interest and tenure to pick the best option.
        </p>
        <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Lender</th>
                  <th className="px-4 py-3 font-semibold">Rate</th>
                  <th className="px-4 py-3 font-semibold">EMI</th>
                  <th className="px-4 py-3 font-semibold">Total Interest</th>
                  <th className="px-4 py-3 font-semibold">Processing</th>
                  <th className="px-4 py-3 font-semibold">Apply</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map((row) => {
                  const isBest = cheapest && row.name === cheapest.name;
                  return (
                    <tr
                      key={row.name}
                      className={isBest ? "bg-green-50/60" : "hover:bg-gray-50"}
                    >
                      <td className="px-4 py-4">
                        <p className="font-semibold text-gray-900">{row.name}</p>
                        {row.highlight && (
                          <p className="mt-0.5 text-[11px] font-medium text-green-700">
                            {row.highlight}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        {row.rate.toFixed(2)}%
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-900">
                        ₹{formatINR(Math.round(row.emi))}
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        ₹{formatINR(Math.round(row.interest))}
                      </td>
                      <td className="px-4 py-4 text-gray-700">{row.processing}</td>
                      <td className="px-4 py-4">
                        <Link
                          href="/used-car-loan"
                          className="rounded-full bg-[#f75d34] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#e54d24]"
                        >
                          Apply
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-gray-500">
          *Rates are indicative. Final rate depends on credit score, income and
          lender policy.
        </p>
      </section>
    </div>
  );
}
