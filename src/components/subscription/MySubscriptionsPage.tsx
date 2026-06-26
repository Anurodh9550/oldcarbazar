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
import { openPrintableInvoice } from "@/lib/printInvoice";
import PageHero from "@/components/ui/PageHero";

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
  openPrintableInvoice({
    title: "Listing Boost Invoice",
    invoiceNumber: inv.invoice_number,
    date: formatDate(inv.issued_at),
    customerName: inv.customer.name,
    customerPhone: inv.customer.phone,
    customerEmail: inv.customer.email,
    customerGstin: inv.customer.gstin,
    sellerName: inv.seller.name,
    sellerAddress: inv.seller.address,
    sellerEmail: inv.seller.email,
    sellerGstin: inv.seller.gstin,
    itemLabel: `${inv.package_name} (${inv.duration_days} days) · ${inv.listing_title}`,
    status: inv.status,
    orderId: inv.razorpay_order_id,
    paymentId: inv.razorpay_payment_id,
    receipt: inv.receipt,
    amountInr: inv.amount_inr,
    baseInr: inv.base_inr,
    gstInr: inv.gst_inr,
    gstRate: inv.gst_rate,
    extra: [{ label: "Boosted until", value: formatDate(inv.boosted_until) }],
  });
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
      <PageHero
        badge="Billing"
        title="Your subscriptions & invoices"
        subtitle="Every payment with full transaction ID. Click a row to view or download the invoice as a PDF."
      />

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
