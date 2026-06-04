"use client";

import { useEffect, useMemo, useState } from "react";
import {
  api,
  type AdminBoostPayment,
  type AdminPaymentsResponse,
  type AdminSubscriptionPayment,
} from "@/lib/api";

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

type InvoiceData = {
  title: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  itemLabel: string;
  amount: number;
  status: string;
  orderId: string;
  paymentId: string;
  receipt: string;
  date: string;
  extra?: { label: string; value: string }[];
};

function openInvoiceWindow(data: InvoiceData) {
  const win = window.open("", "_blank", "width=820,height=900");
  if (!win) return;
  const rows = (data.extra ?? [])
    .map(
      (e) =>
        `<tr><td class="k">${e.label}</td><td class="v">${e.value}</td></tr>`
    )
    .join("");
  win.document.write(`<!doctype html><html><head><meta charset="utf-8" />
  <title>${data.invoiceNumber}</title>
  <style>
    *{box-sizing:border-box;font-family:Arial,Helvetica,sans-serif}
    body{margin:0;padding:40px;color:#111827}
    .brand{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #f75d34;padding-bottom:16px}
    .brand h1{margin:0;color:#f75d34;font-size:24px}
    .muted{color:#6b7280;font-size:12px}
    h2{font-size:15px;margin:24px 0 8px}
    table{width:100%;border-collapse:collapse;margin-top:8px}
    td{padding:8px 10px;border-bottom:1px solid #eee;font-size:13px;vertical-align:top}
    td.k{color:#6b7280;width:200px}
    td.v{font-weight:600}
    .total{margin-top:18px;text-align:right;font-size:20px;font-weight:800;color:#111827}
    .pill{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;text-transform:uppercase;background:#ecfdf5;color:#047857}
    .foot{margin-top:32px;color:#9ca3af;font-size:11px;text-align:center}
    @media print{body{padding:20px}}
  </style></head><body>
    <div class="brand">
      <div><h1>Old Car Bazar</h1><p class="muted">Old Car Bazar, India · support@oldcarbazar.com</p></div>
      <div style="text-align:right">
        <p class="muted">Invoice</p>
        <p style="font-weight:700;margin:2px 0">${data.invoiceNumber}</p>
        <p class="muted">${data.date}</p>
      </div>
    </div>
    <h2>${data.title}</h2>
    <table>
      <tr><td class="k">Billed to</td><td class="v">${data.customerName}</td></tr>
      <tr><td class="k">Phone</td><td class="v">${data.customerPhone || "—"}</td></tr>
      <tr><td class="k">Email</td><td class="v">${data.customerEmail || "—"}</td></tr>
      <tr><td class="k">Item</td><td class="v">${data.itemLabel}</td></tr>
      <tr><td class="k">Status</td><td class="v"><span class="pill">${data.status}</span></td></tr>
      ${rows}
    </table>
    <h2>Payment / Transaction</h2>
    <table>
      <tr><td class="k">Razorpay Order ID</td><td class="v">${data.orderId || "—"}</td></tr>
      <tr><td class="k">Razorpay Payment ID</td><td class="v">${data.paymentId || "—"}</td></tr>
      <tr><td class="k">Receipt</td><td class="v">${data.receipt || "—"}</td></tr>
    </table>
    <p class="total">Total Paid: ${formatINR(data.amount)}</p>
    <p class="foot">This is a system-generated invoice from Old Car Bazar.</p>
    <script>window.onload=function(){window.print();}</script>
  </body></html>`);
  win.document.close();
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
    openInvoiceWindow({
      title: "Subscription Invoice",
      invoiceNumber: r.invoice_number,
      customerName: r.user_name,
      customerPhone: r.user_phone,
      customerEmail: r.user_email,
      itemLabel: `${r.plan_name} plan`,
      amount: r.amount_inr,
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
    openInvoiceWindow({
      title: "Listing Boost Invoice",
      invoiceNumber: r.invoice_number,
      customerName: r.user_name,
      customerPhone: r.user_phone,
      customerEmail: r.user_email,
      itemLabel: `Boost (${r.duration_days} days) · ${r.listing_title}`,
      amount: r.amount_inr,
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
