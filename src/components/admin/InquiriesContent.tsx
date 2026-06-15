"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import type { Inquiry, InquiryStatus } from "@/types/admin";
import { CheckIcon, SearchIcon, TrashIcon, XIcon } from "./icons";

const statusBadge: Record<InquiryStatus, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  responded: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  closed: "bg-slate-100 text-slate-700 ring-slate-200",
  spam: "bg-red-50 text-red-700 ring-red-200",
};

const channelLabel: Record<Inquiry["channel"], string> = {
  whatsapp: "WhatsApp",
  call: "Phone call",
  form: "Inquiry form",
  chat: "Live chat",
};

export default function InquiriesContent() {
  const { inquiries, setInquiryStatus, removeInquiry, logActivity, addInquiry } =
    useAdmin();

  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<"all" | InquiryStatus>("all");
  const [channel, setChannel] = useState<"all" | Inquiry["channel"]>("all");

  useEffect(() => {
    const q = searchParams?.get("q") ?? "";
    if (q) setQuery(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = inquiries;
    if (status !== "all") list = list.filter((i) => i.status === status);
    if (channel !== "all") list = list.filter((i) => i.channel === channel);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.listingTitle.toLowerCase().includes(q) ||
          i.buyerName.toLowerCase().includes(q) ||
          (i.sellerName ?? "").toLowerCase().includes(q) ||
          i.message.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => b.createdAt - a.createdAt);
  }, [inquiries, status, channel, query]);

  const counts = useMemo(
    () => ({
      total: inquiries.length,
      new: inquiries.filter((i) => i.status === "new").length,
      responded: inquiries.filter((i) => i.status === "responded").length,
      closed: inquiries.filter((i) => i.status === "closed").length,
    }),
    [inquiries]
  );

  const handleSetStatus = (i: Inquiry, s: InquiryStatus) => {
    setInquiryStatus(i.id, s);
    logActivity("settings-updated", `Inquiry → ${s} (${i.buyerName})`, i.id);
  };

  const handleRemove = (i: Inquiry) => {
    if (!confirm("Delete this inquiry?")) return;
    removeInquiry(i.id);
    logActivity("settings-updated", `Deleted inquiry from ${i.buyerName}`, i.id);
  };

  const seedDemo = () => {
    addInquiry({
      listingId: "demo",
      listingTitle: "Demo inquiry — buyer interest",
      buyerName: "Demo Buyer",
      buyerPhone: "9999999999",
      buyerEmail: "demo@buyer.in",
      sellerId: "demo-seller",
      sellerName: "Demo Seller",
      message: "Hi, is the car still available?",
      channel: "form",
      city: "Mumbai",
      price: "₹6.5 Lakh",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Total" value={counts.total} />
        <Stat label="New" value={counts.new} tone="blue" />
        <Stat label="Responded" value={counts.responded} tone="emerald" />
        <Stat label="Closed" value={counts.closed} tone="slate" />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-[#f75d34] focus-within:ring-2 focus-within:ring-[#f75d34]/20">
          <SearchIcon className="h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search by listing, dealer, buyer or message…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#f75d34]"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="responded">Responded</option>
          <option value="closed">Closed</option>
          <option value="spam">Spam</option>
        </select>
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value as typeof channel)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#f75d34]"
        >
          <option value="all">All channels</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="call">Phone call</option>
          <option value="form">Inquiry form</option>
          <option value="chat">Live chat</option>
        </select>
        <button
          type="button"
          onClick={seedDemo}
          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
        >
          + Test inquiry
        </button>
      </div>

      <ul className="grid gap-3">
        {filtered.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center text-sm text-slate-500 shadow-sm">
            No inquiries match your filters.
          </li>
        ) : (
          filtered.map((q, idx) => (
            <motion.li
              key={q.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.3) }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${statusBadge[q.status]}`}
                    >
                      {q.status}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                      {channelLabel[q.channel]}
                    </span>
                    {q.price && (
                      <span className="text-[11px] font-semibold text-[#f75d34]">
                        {q.price}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/admin/listings/${q.listingId}`}
                    className="mt-2 block truncate text-sm font-bold text-slate-900 hover:text-[#f75d34]"
                  >
                    {q.listingTitle}
                  </Link>
                  {q.sellerName && (
                    <p className="mt-1 text-[11px] font-medium text-slate-500">
                      Dealer / Seller:{" "}
                      <span className="font-semibold text-slate-700">
                        {q.sellerName}
                      </span>
                    </p>
                  )}
                  <p className="mt-2 text-sm text-slate-700">{q.message}</p>
                  <p className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">
                      {q.buyerName}
                    </span>
                    <span>+91 {q.buyerPhone}</span>
                    {q.buyerEmail && <span>{q.buyerEmail}</span>}
                    {q.city && <span>📍 {q.city}</span>}
                    <span>•</span>
                    <span>
                      {new Date(q.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {q.status !== "responded" && (
                    <button
                      type="button"
                      onClick={() => handleSetStatus(q, "responded")}
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-500"
                    >
                      <CheckIcon className="h-3 w-3" /> Mark responded
                    </button>
                  )}
                  {q.status !== "closed" && (
                    <button
                      type="button"
                      onClick={() => handleSetStatus(q, "closed")}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Close
                    </button>
                  )}
                  {q.status !== "spam" && (
                    <button
                      type="button"
                      onClick={() => handleSetStatus(q, "spam")}
                      className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                    >
                      <XIcon className="h-3 w-3" /> Spam
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(q)}
                    title="Delete"
                    className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.li>
          ))
        )}
      </ul>
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
  tone?: "slate" | "blue" | "emerald";
}) {
  const map = {
    slate: "text-slate-900",
    blue: "text-blue-600",
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
