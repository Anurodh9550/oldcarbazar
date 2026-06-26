"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApiError, api, type InvoicePayload } from "@/lib/api";

function formatDate(value: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InvoicePage({
  subscriptionId,
}: {
  subscriptionId: string;
}) {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [invoice, setInvoice] = useState<InvoicePayload | null>(null);
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
        const data = await api.getInvoice(subscriptionId);
        if (!cancelled) setInvoice(data);
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiError && err.status === 404) {
            setError("This invoice does not exist.");
          } else {
            setError(
              err instanceof Error
                ? err.message
                : "Could not load this invoice."
            );
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authLoading, isLoggedIn, router, subscriptionId]);

  // Browser print dialog → user picks "Save as PDF" → invoice saved
  // locally. Avoids shipping a server-side PDF lib (ReportLab/WeasyPrint)
  // until we actually need GST-compliant output.
  const handleDownload = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f7f7] px-4 py-12 sm:px-8">
        <div className="mx-auto h-72 max-w-3xl animate-pulse rounded-2xl bg-white" />
      </main>
    );
  }

  if (error || !invoice) {
    return (
      <main className="min-h-screen bg-[#f7f7f7] px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
          <span className="text-5xl">🧾</span>
          <h2 className="mt-3 text-lg font-bold text-gray-900">
            Invoice not available
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            {error || "We couldn't find this invoice."}
          </p>
          <Link
            href="/my-subscriptions"
            className="mt-6 inline-block rounded-full bg-[#f75d34] px-6 py-2 text-sm font-semibold text-white hover:bg-[#e54d24]"
          >
            Back to billing
          </Link>
        </div>
      </main>
    );
  }

  const isPaid =
    invoice.status === "active" || invoice.razorpay_payment_id !== "";

  return (
    <main className="min-h-screen bg-[#f7f7f7] py-8 print:bg-white print:py-0">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/my-subscriptions"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-[#f75d34]"
          >
            <span>←</span> All invoices
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-full bg-[#f75d34] px-5 py-2 text-sm font-semibold text-white shadow hover:bg-[#e54d24]"
            >
              ⬇ Download PDF
            </button>
          </div>
        </div>

        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none">
          <header className="dark-surface flex flex-col gap-4 border-b border-gray-200 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] px-8 py-7 sm:flex-row sm:items-start sm:justify-between print:bg-white print:text-gray-900">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffb59a] print:text-[#f75d34]">
                Tax Invoice
              </p>
              <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                Old Car Bazar
              </h1>
              <p className="mt-1 text-xs text-gray-300 print:text-gray-600">
                {invoice.seller.address}
              </p>
              <p className="text-xs text-gray-300 print:text-gray-600">
                {invoice.seller.email} · {invoice.seller.website}
              </p>
              {invoice.seller.gstin && (
                <p className="mt-1 text-xs font-semibold text-gray-200 print:text-gray-700">
                  GSTIN: {invoice.seller.gstin}
                </p>
              )}
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 print:text-gray-500">
                Invoice number
              </p>
              <p className="font-mono text-sm font-bold">
                {invoice.invoice_number}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-wider text-gray-400 print:text-gray-500">
                Issued on
              </p>
              <p className="text-sm">
                {formatDate(invoice.issued_at)}{" "}
                <span className="text-gray-400 print:text-gray-500">
                  {formatTime(invoice.issued_at)}
                </span>
              </p>
            </div>
          </header>

          <section className="grid gap-6 px-8 py-6 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Billed to
              </p>
              <p className="mt-1 text-sm font-bold text-gray-900">
                {invoice.customer.name}
              </p>
              <p className="text-xs text-gray-600">
                {invoice.customer.phone}
              </p>
              {invoice.customer.email && (
                <p className="text-xs text-gray-600">
                  {invoice.customer.email}
                </p>
              )}
              {invoice.customer.city && (
                <p className="text-xs text-gray-600">{invoice.customer.city}</p>
              )}
              {invoice.customer.gstin && (
                <p className="mt-1 text-xs font-semibold text-gray-700">
                  GSTIN: {invoice.customer.gstin}
                </p>
              )}
            </div>
            <div className="sm:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Payment status
              </p>
              <span
                className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  isPaid
                    ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
                }`}
              >
                {isPaid ? "Paid" : invoice.status}
              </span>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Method
              </p>
              <p className="text-sm capitalize text-gray-800">
                {invoice.provider === "razorpay" ? "Razorpay" : invoice.provider}
              </p>
            </div>
          </section>

          <section className="px-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-gray-200 bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <th className="py-2 pl-3">Description</th>
                  <th className="py-2">Period</th>
                  <th className="py-2 pr-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 pl-3">
                    <p className="font-semibold text-gray-900">
                      {invoice.plan_name} Subscription
                    </p>
                    <p className="text-xs text-gray-500">
                      Unlimited listings · Pro badge · Priority placement
                    </p>
                  </td>
                  <td className="py-4 text-xs text-gray-700">
                    {formatDate(invoice.started_at)} —{" "}
                    {formatDate(invoice.expires_at)}
                  </td>
                  <td className="py-4 pr-3 text-right font-semibold text-gray-900">
                    ₹{invoice.base_inr.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="py-2 pl-3 text-xs text-gray-500" colSpan={2}>
                    Taxable value
                  </td>
                  <td className="py-2 pr-3 text-right text-sm text-gray-700">
                    ₹{invoice.base_inr.toLocaleString("en-IN")}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pl-3 text-xs text-gray-500" colSpan={2}>
                    GST ({invoice.gst_rate || 18}%)
                  </td>
                  <td className="py-2 pr-3 text-right text-sm text-gray-700">
                    ₹{invoice.gst_inr.toLocaleString("en-IN")}
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td
                    className="py-3 pl-3 text-sm font-bold text-gray-900"
                    colSpan={2}
                  >
                    Total
                  </td>
                  <td className="py-3 pr-3 text-right text-lg font-extrabold text-[#f75d34]">
                    ₹{invoice.amount_inr.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </section>

          <section className="mt-2 grid gap-4 border-t border-gray-100 bg-gray-50 px-8 py-5 text-xs sm:grid-cols-2">
            <div>
              <p className="font-semibold uppercase tracking-wider text-gray-500">
                Transaction ID
              </p>
              <p className="mt-1 break-all font-mono text-gray-800">
                {invoice.razorpay_payment_id || invoice.receipt || "—"}
              </p>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wider text-gray-500">
                Razorpay Order ID
              </p>
              <p className="mt-1 break-all font-mono text-gray-800">
                {invoice.razorpay_order_id || "—"}
              </p>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wider text-gray-500">
                Receipt
              </p>
              <p className="mt-1 break-all font-mono text-gray-800">
                {invoice.receipt}
              </p>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wider text-gray-500">
                Subscription ID
              </p>
              <p className="mt-1 break-all font-mono text-gray-800">
                {invoice.subscription_id}
              </p>
            </div>
          </section>

          <footer className="border-t border-gray-200 px-8 py-5 text-center text-[11px] text-gray-500">
            This is a computer-generated invoice and does not require a
            signature. For any payment queries, contact{" "}
            <span className="font-semibold text-gray-700">
              {invoice.seller.email}
            </span>
            .
          </footer>
        </article>
      </div>
    </main>
  );
}
