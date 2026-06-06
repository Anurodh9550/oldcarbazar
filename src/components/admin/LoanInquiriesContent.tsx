"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { LoanInquiry, LoanInquiryStatus } from "@/types/loanInquiry";
import { loanBankCatalogue, loanPartners } from "@/data/loanBanks";
import { ArrowDownIcon, CheckIcon, SearchIcon, TrashIcon } from "./icons";

const statusBadge: Record<LoanInquiryStatus, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  contacted: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
};

const statusOrder: LoanInquiryStatus[] = [
  "new",
  "contacted",
  "approved",
  "rejected",
];

const bankNames = loanBankCatalogue.map((b) => b.name);
const partnerNames = Object.values(loanPartners).map((p) => p.name);

function formatIncome(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function csvEscape(value: string | number) {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export default function LoanInquiriesContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<LoanInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState(searchParams?.get("q") ?? "");
  const [status, setStatus] = useState<"all" | LoanInquiryStatus>("all");
  const [bank, setBank] = useState<"all" | string>("all");
  const [partner, setPartner] = useState<"all" | string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.adminLoanInquiries();
      setItems(data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not load loan inquiries."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const q = searchParams?.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = items;
    if (status !== "all") list = list.filter((i) => i.status === status);
    if (bank !== "all") list = list.filter((i) => i.bankName === bank);
    if (partner !== "all") list = list.filter((i) => i.loanPartner === partner);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.fullName.toLowerCase().includes(q) ||
          i.mobile.includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.city.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, status, bank, partner, query]);

  const counts = useMemo(
    () => ({
      total: items.length,
      new: items.filter((i) => i.status === "new").length,
      contacted: items.filter((i) => i.status === "contacted").length,
      approved: items.filter((i) => i.status === "approved").length,
    }),
    [items]
  );

  const handleStatus = async (i: LoanInquiry, s: LoanInquiryStatus) => {
    setItems((prev) =>
      prev.map((x) => (x.id === i.id ? { ...x, status: s } : x))
    );
    try {
      await api.adminUpdateLoanInquiryStatus(i.id, s);
    } catch {
      load();
    }
  };

  const handleDelete = async (i: LoanInquiry) => {
    if (!confirm(`Delete loan inquiry from ${i.fullName}?`)) return;
    setItems((prev) => prev.filter((x) => x.id !== i.id));
    try {
      await api.adminDeleteLoanInquiry(i.id);
    } catch {
      load();
    }
  };

  const exportExcel = () => {
    const headers = [
      "Inquiry ID",
      "Bank",
      "Loan Partner",
      "Full Name",
      "Mobile",
      "Email",
      "City",
      "Monthly Income",
      "Employment Type",
      "Car Budget",
      "Message",
      "Status",
      "Created At",
    ];
    const rows = filtered.map((i) => [
      i.id,
      i.bankName,
      i.loanPartner,
      i.fullName,
      i.mobile,
      i.email,
      i.city,
      i.monthlyIncome,
      i.employmentTypeLabel,
      i.carBudget,
      i.message,
      i.statusLabel,
      new Date(i.createdAt).toLocaleString("en-IN"),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map(csvEscape).join(","))
      .join("\r\n");
    // Prepend BOM so Excel renders ₹ and other UTF-8 chars correctly.
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `loan-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Total" value={counts.total} />
        <Stat label="New" value={counts.new} tone="blue" />
        <Stat label="Contacted" value={counts.contacted} tone="amber" />
        <Stat label="Approved" value={counts.approved} tone="emerald" />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-[#f75d34] focus-within:ring-2 focus-within:ring-[#f75d34]/20">
            <SearchIcon className="h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search by name, mobile, email or city…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
          <button
            type="button"
            onClick={exportExcel}
            disabled={filtered.length === 0}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowDownIcon className="h-4 w-4" /> Export to Excel
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#f75d34]"
          >
            <option value="all">All statuses</option>
            {statusOrder.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#f75d34]"
          >
            <option value="all">All banks</option>
            {bankNames.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select
            value={partner}
            onChange={(e) => setPartner(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#f75d34]"
          >
            <option value="all">All partners</option>
            {partnerNames.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={load}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center text-sm text-slate-500 shadow-sm">
          Loading loan inquiries…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center text-sm text-slate-500 shadow-sm">
          No loan inquiries match your filters.
        </div>
      ) : (
        <ul className="grid gap-3">
          {filtered.map((i, idx) => (
            <motion.li
              key={i.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.3) }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${statusBadge[i.status]}`}
                    >
                      {i.statusLabel}
                    </span>
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {i.bankName}
                    </span>
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#f75d34]">
                      {i.loanPartner}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {i.fullName}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-600">
                    <span>+91 {i.mobile}</span>
                    <span>{i.email}</span>
                    <span>📍 {i.city}</span>
                  </p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-500">
                    <span>
                      Income:{" "}
                      <span className="font-semibold text-slate-700">
                        {formatIncome(i.monthlyIncome)}/mo
                      </span>
                    </span>
                    <span>• {i.employmentTypeLabel}</span>
                    {i.carBudget && <span>• Budget: {i.carBudget}</span>}
                  </p>
                  {i.message && (
                    <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-[12px] text-slate-600">
                      {i.message}
                    </p>
                  )}
                  <p className="mt-2 text-[11px] text-slate-400">
                    {new Date(i.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex flex-col items-stretch gap-2">
                  <select
                    value={i.status}
                    onChange={(e) =>
                      handleStatus(i, e.target.value as LoanInquiryStatus)
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 outline-none focus:border-[#f75d34]"
                  >
                    {statusOrder.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1.5">
                    {i.status !== "approved" && (
                      <button
                        type="button"
                        onClick={() => handleStatus(i, "approved")}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-500"
                      >
                        <CheckIcon className="h-3 w-3" /> Approve
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(i)}
                      title="Delete"
                      className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: number;
  tone?: "slate" | "blue" | "amber" | "emerald";
}) {
  const map = {
    slate: "text-slate-900",
    blue: "text-blue-600",
    amber: "text-amber-600",
    emerald: "text-emerald-600",
  } as const;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${map[tone]}`}>
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
