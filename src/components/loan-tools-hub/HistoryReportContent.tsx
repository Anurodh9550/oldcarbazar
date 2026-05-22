"use client";

import Link from "next/link";
import { useState } from "react";
import { historyReportSections } from "@/data/loanToolsPages";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm uppercase outline-none tracking-wider focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20";

type Report = {
  reg: string;
  owner: string;
  rto: string;
  registered: string;
  insurance: string;
  insuranceExpiry: string;
  pucExpiry: string;
  ownersCount: number;
  fuelType: string;
  challanCount: number;
  hypothecation: string;
};

const sampleReport: Report = {
  reg: "",
  owner: "RAJESH KUMAR",
  rto: "GJ 01 — Ahmedabad East",
  registered: "12 Aug 2019",
  insurance: "ICICI Lombard — Comprehensive",
  insuranceExpiry: "21 Nov 2026",
  pucExpiry: "05 Sep 2026",
  ownersCount: 2,
  fuelType: "Petrol",
  challanCount: 1,
  hypothecation: "No active loan",
};

export default function HistoryReportContent() {
  const [reg, setReg] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reg.trim()) return;
    setLoading(true);
    setReport(null);
    setTimeout(() => {
      setReport({ ...sampleReport, reg: reg.toUpperCase().trim() });
      setLoading(false);
    }, 700);
  };

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="section-title-lg">Get Instant Vehicle Report</h2>
          <p className="mt-2 text-body-muted">
            Used car khareedne se pehle uski full history check karein. Hum
            VAHAN, IRDAI aur insurer ke data se report banate hain.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-700">
                Vehicle Registration Number *
              </span>
              <input
                value={reg}
                onChange={(e) =>
                  setReg(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())
                }
                placeholder="e.g. GJ01AB1234"
                maxLength={12}
                className={inputClass}
                required
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#f75d34] py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#e54d24]"
            >
              {loading ? "Fetching Report..." : "Get Report (Free)"}
            </button>
            <p className="text-center text-[11px] text-gray-500">
              Data is sourced from public registries — for informational use only.
            </p>
          </form>
        </div>

        <div>
          {report ? (
            <div className="rounded-2xl border-2 border-[#f75d34]/20 bg-gradient-to-br from-orange-50 to-white p-6 sm:p-7">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#f75d34]">
                    Report For
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-wider text-gray-900">
                    {report.reg}
                  </p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  ✓ Verified
                </span>
              </div>

              <dl className="mt-5 grid gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] uppercase text-gray-500">Owner Name</dt>
                  <dd className="font-semibold text-gray-900">{report.owner}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase text-gray-500">RTO</dt>
                  <dd className="font-semibold text-gray-900">{report.rto}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase text-gray-500">Registered</dt>
                  <dd className="font-semibold text-gray-900">{report.registered}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase text-gray-500">Fuel Type</dt>
                  <dd className="font-semibold text-gray-900">{report.fuelType}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[11px] uppercase text-gray-500">Insurance</dt>
                  <dd className="font-semibold text-gray-900">{report.insurance}</dd>
                  <dd className="text-caption">Valid till {report.insuranceExpiry}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase text-gray-500">PUC Expiry</dt>
                  <dd className="font-semibold text-gray-900">{report.pucExpiry}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase text-gray-500">Total Owners</dt>
                  <dd className="font-semibold text-gray-900">{report.ownersCount}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase text-gray-500">Open Challans</dt>
                  <dd
                    className={`font-semibold ${
                      report.challanCount > 0 ? "text-amber-600" : "text-green-700"
                    }`}
                  >
                    {report.challanCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase text-gray-500">Hypothecation</dt>
                  <dd className="font-semibold text-green-700">
                    {report.hypothecation}
                  </dd>
                </div>
              </dl>

              <p className="mt-6 text-[11px] text-gray-500">
                *Demo report shown for illustration. Real report fetches live
                data via VAHAN.
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <span className="text-5xl">📋</span>
              <p className="mt-4 font-semibold text-gray-800">
                Your report will appear here
              </p>
              <p className="mt-2 max-w-xs text-caption sm:text-sm">
                Vehicle registration number daalein aur instant report paayein
              </p>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="section-title-lg">What&apos;s Included in the Report</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {historyReportSections.map((s) => (
            <li
              key={s.title}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <span className="text-2xl" aria-hidden>
                {s.icon}
              </span>
              <p className="mt-2 font-semibold text-gray-900">{s.title}</p>
              <p className="mt-1 text-body-muted">{s.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#0f172a] p-6 text-white sm:flex-row sm:items-center sm:p-7">
        <div>
          <h3 className="text-lg font-bold">Buying a car? Pair with Assured</h3>
          <p className="mt-1 text-sm text-slate-300">
            History + 200-point inspection + warranty — complete peace of mind.
          </p>
        </div>
        <Link
          href="/assured"
          className="shrink-0 rounded-full bg-[#f75d34] px-5 py-2.5 text-sm font-semibold hover:bg-[#e54d24]"
        >
          Explore Assured Cars →
        </Link>
      </section>
    </div>
  );
}
