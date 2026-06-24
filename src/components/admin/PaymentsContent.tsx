"use client";

import { useEffect, useMemo, useState } from "react";
import {
  api,
  type AdminBoostPayment,
  type AdminPaymentsResponse,
  type AdminSubscriptionPayment,
} from "@/lib/api";
import { openPrintableInvoice } from "@/lib/printInvoice";

type Tab = "subscriptions" | "boosts";

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  created: "bg-amber-50 text-amber-700 ring-amber-200",
  expired: "bg-slate-100 text-slate-600 ring-slate-200",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ${
        statusStyles[status] ?? "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      {status}
    </span>
  );
}

function TxnId({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  if (!value) return <span className="text-slate-400">—</span>;
  return (
    <button
      type="button"
      title="Copy transaction ID"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
    >
      <span className="max-w-[150px] truncate">{value}</span>
      <span className="text-[10px] text-[#f75d34]">{copied ? "✓" : "⧉"}</span>
    </button>
  );
}

export default function PaymentsContent() {
  const [data, setData] = useState<AdminPaymentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("subscriptions");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const next = await api.adminPayments();
        if (!cancelled) setData(next);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load payments."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const subscriptions = useMemo(() => {
    const list = data?.subscriptions ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (r) =>
        r.user_name.toLowerCase().includes(q) ||
        r.user_phone.includes(q) ||
        r.user_email.toLowerCase().includes(q) ||
        r.razorpay_payment_id.toLowerCase().includes(q) ||
        r.razorpay_order_id.toLowerCase().includes(q)
    );
  }, [data, query]);

  const boosts = useMemo(() => {
    const list = data?.boosts ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (r) =>
        r.user_name.toLowerCase().includes(q) ||
        r.user_phone.includes(q) ||
        r.listing_title.toLowerCase().includes(q) ||
        r.razorpay_payment_id.toLowerCase().includes(q) ||
        r.razorpay_order_id.toLowerCase().includes(q)
    );
  }, [data, query]);

  const printSubscription = (r: AdminSubscriptionPayment) =>
    openPrintableInvoice({
      title: "Subscription Invoice",
      invoiceNumber: r.invoice_number,
      customerName: r.user_name,
      customerPhone: r.user_phone,
      customerEmail: r.user_email,
      customerGstin: r.customer_gstin,
      sellerGstin: r.seller_gstin,
      itemLabel: `${r.plan_name} plan`,
      amountInr: r.amount_inr,
      baseInr: r.base_inr,
      gstInr: r.gst_inr,
      gstRate: r.gst_rate,
      status: r.status,
      orderId: r.razorpay_order_id,
      paymentId: r.razorpay_payment_id,
      receipt: r.receipt,
      date: formatDate(r.created_at),
      extra: [
        { label: "Started", value: formatDate(r.started_at) },
        { label: "Valid till", value: formatDate(r.expires_at) },
        { label: "Provider", value: r.provider },
      ],
    });

  const printBoost = (r: AdminBoostPayment) =>
    openPrintableInvoice({
      title: "Listing Boost Invoice",
      invoiceNumber: r.invoice_number,
      customerName: r.user_name,
      customerPhone: r.user_phone,
      customerEmail: r.user_email,
      customerGstin: r.customer_gstin,
      sellerGstin: r.seller_gstin,
      itemLabel: `Boost (${r.duration_days} days) · ${r.listing_title}`,
      amountInr: r.amount_inr,
      baseInr: r.base_inr,
      gstInr: r.gst_inr,
      gstRate: r.gst_rate,
      status: r.status,
      orderId: r.razorpay_order_id,
      paymentId: r.razorpay_payment_id,
      receipt: r.receipt,
      date: formatDate(r.created_at),
      extra: [{ label: "Boosted until", value: formatDate(r.boosted_until) }],
    });

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-[#f75d34]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  const summary = data?.summary;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total Revenue",
            value: formatINR(summary?.total_revenue ?? 0),
            color: "text-[#f75d34]",
          },
          {
            label: "Subscriptions",
            value: formatINR(summary?.subscriptions_revenue ?? 0),
            sub: `${summary?.subscriptions_count ?? 0} payments`,
            color: "text-emerald-600",
          },
          {
            label: "Boosts",
            value: formatINR(summary?.boosts_revenue ?? 0),
            sub: `${summary?.boosts_count ?? 0} paid`,
            color: "text-blue-600",
          },
          {
            label: "Records",
            value: String(
              (data?.subscriptions.length ?? 0) + (data?.boosts.length ?? 0)
            ),
            color: "text-slate-700",
          },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {c.label}
            </p>
            <p className={`mt-1 text-xl font-bold ${c.color}`}>{c.value}</p>
            {c.sub && <p className="text-[11px] text-slate-400">{c.sub}</p>}
          </div>
        ))}
      </div>

      {/* Tabs + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(
            [
              { id: "subscriptions", label: "Pro Subscriptions" },
              { id: "boosts", label: "Listing Boosts" },
            ] as { id: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                tab === t.id
                  ? "bg-[#f75d34] text-white shadow"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[#f75d34]/40 hover:text-[#f75d34]"
              }`}
            >
              {t.label}
              <span
                className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] ${
                  tab === t.id ? "bg-white/20" : "bg-slate-100 text-slate-600"
                }`}
              >
                {t.id === "subscriptions"
                  ? data?.subscriptions.length ?? 0
                  : data?.boosts.length ?? 0}
              </span>
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, phone, txn id…"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#f75d34] sm:w-72"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          {tab === "subscriptions" ? (
            <table className="min-w-[860px] w-full text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Payment ID</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-slate-400">
                      No subscription payments yet.
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100 hover:bg-orange-50/30">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{r.user_name}</p>
                        <p className="text-[11px] text-slate-500">
                          {r.user_phone}
                          {r.user_email ? ` · ${r.user_email}` : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {r.plan_name}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#f75d34]">
                        {formatINR(r.amount_inr)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3">
                        <TxnId value={r.razorpay_payment_id} />
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-500">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => printSubscription(r)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#f75d34] hover:text-[#f75d34]"
                        >
                          Invoice / PDF
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="min-w-[860px] w-full text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Listing</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Payment ID</th>
                  <th className="px-4 py-3 text-left">Boosted till</th>
                  <th className="px-4 py-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {boosts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-slate-400">
                      No boost payments yet.
                    </td>
                  </tr>
                ) : (
                  boosts.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100 hover:bg-orange-50/30">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{r.user_name}</p>
                        <p className="text-[11px] text-slate-500">{r.user_phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="max-w-[200px] truncate font-medium text-slate-700">
                          {r.listing_title}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {r.duration_days} days
                        </p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#f75d34]">
                        {formatINR(r.amount_inr)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3">
                        <TxnId value={r.razorpay_payment_id} />
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-500">
                        {formatDate(r.boosted_until)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => printBoost(r)}
                          disabled={r.status !== "paid"}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#f75d34] hover:text-[#f75d34] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Invoice / PDF
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
