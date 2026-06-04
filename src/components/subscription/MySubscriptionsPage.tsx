"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  api,
  type BoostInvoicePayload,
  type InvoicePayload,
} from "@/lib/api";

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function openBoostInvoiceWindow(inv: BoostInvoicePayload) {
  const win = window.open("", "_blank", "width=820,height=900");
  if (!win) return;
  const amount = `₹${inv.amount_inr.toLocaleString("en-IN")}`;
  win.document.write(`<!doctype html><html><head><meta charset="utf-8" />
  <title>${inv.invoice_number}</title>
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
    .total{margin-top:18px;text-align:right;font-size:20px;font-weight:800}
    .pill{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;text-transform:uppercase;background:#ecfdf5;color:#047857}
    .foot{margin-top:32px;color:#9ca3af;font-size:11px;text-align:center}
    @media print{body{padding:20px}}
  </style></head><body>
    <div class="brand">
      <div><h1>Old Car Bazar</h1><p class="muted">${inv.seller.address} · ${inv.seller.email}</p></div>
      <div style="text-align:right">
        <p class="muted">Invoice</p>
        <p style="font-weight:700;margin:2px 0">${inv.invoice_number}</p>
        <p class="muted">${formatDate(inv.issued_at)}</p>
      </div>
    </div>
    <h2>Listing Boost Invoice</h2>
    <table>
      <tr><td class="k">Billed to</td><td class="v">${inv.customer.name}</td></tr>
      <tr><td class="k">Phone</td><td class="v">${inv.customer.phone || "—"}</td></tr>
      <tr><td class="k">Email</td><td class="v">${inv.customer.email || "—"}</td></tr>
      <tr><td class="k">Item</td><td class="v">${inv.package_name} (${inv.duration_days} days)</td></tr>
      <tr><td class="k">Listing</td><td class="v">${inv.listing_title}</td></tr>
      <tr><td class="k">Boosted until</td><td class="v">${formatDate(inv.boosted_until)}</td></tr>
      <tr><td class="k">Status</td><td class="v"><span class="pill">${inv.status}</span></td></tr>
    </table>
    <h2>Payment / Transaction</h2>
    <table>
      <tr><td class="k">Razorpay Order ID</td><td class="v">${inv.razorpay_order_id || "—"}</td></tr>
      <tr><td class="k">Razorpay Payment ID</td><td class="v">${inv.razorpay_payment_id || "—"}</td></tr>
      <tr><td class="k">Receipt</td><td class="v">${inv.receipt || "—"}</td></tr>
    </table>
    <p class="total">Total Paid: ${amount}</p>
    <p class="foot">This is a system-generated invoice from Old Car Bazar.</p>
    <script>window.onload=function(){window.print();}</script>
  </body></html>`);
  win.document.close();
}

function statusStyle(status: string): string {
  if (status === "active")
    return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
  if (status === "expired")
    return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
  if (status === "cancelled")
    return "bg-red-100 text-red-700 ring-1 ring-red-200";
  return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
}

export default function MySubscriptionsPage() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [invoices, setInvoices] = useState<InvoicePayload[]>([]);
  const [boostInvoices, setBoostInvoices] = useState<BoostInvoicePayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      router.replace("/");
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await api.mySubscriptions();
        if (!cancelled) {
          setInvoices(data.invoices);
          setBoostInvoices(data.boost_invoices ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load your billing history."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authLoading, isLoggedIn, router]);

  return (
    <main className="bg-[#f7f7f7]">
      <section className="bg-gradient-to-br from-[#1a1a1a] via-[#222] to-[#0f0f0f] px-4 pb-12 pt-10 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="inline-block rounded-full border border-[#f75d34]/40 bg-[#f75d34]/10 px-4 py-1 text-xs font-semibold tracking-wider text-[#ffb59a] uppercase">
            Billing
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your subscriptions &amp; invoices
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-300 sm:text-base">
            Every payment with full transaction ID. Click a row to view or
            download the invoice as a PDF.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500 shadow-sm">
              Loading your billing history…
            </div>
          ) : error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : invoices.length === 0 && boostInvoices.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
              <span className="text-5xl">🧾</span>
              <h2 className="mt-3 text-lg font-bold text-gray-900">
                No invoices yet
              </h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                You are currently on the Free plan. Upgrade to Pro or boost a
                listing to see invoices here.
              </p>
              <Link
                href="/pricing"
                className="mt-6 inline-block rounded-full bg-[#f75d34] px-6 py-2 text-sm font-semibold text-white hover:bg-[#e54d24]"
              >
                View pricing
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
            {invoices.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="hidden grid-cols-[1.4fr_1fr_1fr_1.4fr_0.8fr] gap-3 border-b border-gray-100 bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 md:grid">
                <span>Invoice</span>
                <span>Plan</span>
                <span>Amount</span>
                <span>Transaction ID</span>
                <span className="text-right">Action</span>
              </div>

              <ul>
                {invoices.map((inv) => (
                  <li
                    key={inv.subscription_id}
                    className="grid grid-cols-1 gap-3 border-b border-gray-100 px-4 py-4 last:border-0 md:grid-cols-[1.4fr_1fr_1fr_1.4fr_0.8fr] md:items-center md:px-6"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {inv.invoice_number}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(inv.issued_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">
                        {inv.plan_name}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyle(inv.status)}`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#f75d34]">
                        ₹{inv.amount_inr.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {inv.currency} · {inv.provider}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p
                        className="truncate font-mono text-xs text-gray-700"
                        title={inv.razorpay_payment_id || inv.receipt}
                      >
                        {inv.razorpay_payment_id || inv.receipt || "—"}
                      </p>
                      {inv.razorpay_order_id && (
                        <p
                          className="truncate font-mono text-[10px] text-gray-400"
                          title={inv.razorpay_order_id}
                        >
                          Order: {inv.razorpay_order_id}
                        </p>
                      )}
                    </div>
                    <div className="flex md:justify-end">
                      <Link
                        href={`/invoice/${inv.subscription_id}`}
                        className="rounded-full bg-[#f75d34] px-4 py-2 text-xs font-semibold text-white shadow hover:bg-[#e54d24]"
                      >
                        View / Download
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            )}

            {boostInvoices.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 bg-[#f75d34]/5 px-6 py-3">
                <span className="text-sm">🚀</span>
                <h2 className="text-sm font-bold text-gray-900">
                  Listing boost payments
                </h2>
              </div>
              <div className="hidden grid-cols-[1.4fr_1fr_1fr_1.4fr_0.8fr] gap-3 border-b border-gray-100 bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 md:grid">
                <span>Invoice</span>
                <span>Boost</span>
                <span>Amount</span>
                <span>Transaction ID</span>
                <span className="text-right">Action</span>
              </div>

              <ul>
                {boostInvoices.map((inv) => (
                  <li
                    key={inv.boost_order_id}
                    className="grid grid-cols-1 gap-3 border-b border-gray-100 px-4 py-4 last:border-0 md:grid-cols-[1.4fr_1fr_1fr_1.4fr_0.8fr] md:items-center md:px-6"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {inv.invoice_number}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(inv.issued_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {inv.package_name}
                      </p>
                      <p
                        className="truncate text-xs text-gray-500"
                        title={inv.listing_title}
                      >
                        {inv.listing_title}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#f75d34]">
                        ₹{inv.amount_inr.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {inv.duration_days} days · {inv.provider}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p
                        className="truncate font-mono text-xs text-gray-700"
                        title={inv.razorpay_payment_id || inv.receipt}
                      >
                        {inv.razorpay_payment_id || inv.receipt || "—"}
                      </p>
                      {inv.razorpay_order_id && (
                        <p
                          className="truncate font-mono text-[10px] text-gray-400"
                          title={inv.razorpay_order_id}
                        >
                          Order: {inv.razorpay_order_id}
                        </p>
                      )}
                    </div>
                    <div className="flex md:justify-end">
                      <button
                        type="button"
                        onClick={() => openBoostInvoiceWindow(inv)}
                        className="rounded-full bg-[#f75d34] px-4 py-2 text-xs font-semibold text-white shadow hover:bg-[#e54d24]"
                      >
                        View / Download
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
