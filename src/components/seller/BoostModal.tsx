"use client";

import { useEffect, useState } from "react";
import { ApiError, api, type BoostPackage } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email?: string | null; contact: string };
  notes?: Record<string, string>;
  theme?: { color: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay can only run in the browser."));
  }
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Could not load Razorpay checkout.")),
        { once: true }
      );
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay checkout."));
    document.body.appendChild(script);
  });
}

type Props = {
  listingId: string;
  listingTitle: string;
  onClose: () => void;
  onBoosted: (boostedUntil: string | null) => void;
};

export default function BoostModal({
  listingId,
  listingTitle,
  onClose,
  onBoosted,
}: Props) {
  const [packages, setPackages] = useState<BoostPackage[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [gstin, setGstin] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const next = await api.listBoostPackages();
        if (cancelled) return;
        setPackages(next);
        if (next.length > 0) setSelected(next[Math.min(1, next.length - 1)].code);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load boost plans."
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

  const handlePay = async () => {
    if (!selected) return;
    const cleanGstin = gstin.trim().toUpperCase();
    if (cleanGstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(cleanGstin)) {
      setError("Please enter a valid 15-character GST number, or leave it blank.");
      return;
    }
    setError("");
    setPaying(true);
    try {
      const order = await api.createBoostOrder(listingId, selected, cleanGstin);
      await loadRazorpayScript();
      if (!window.Razorpay) {
        throw new Error("Razorpay checkout could not start.");
      }

      const checkout = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Old Car Bazar",
        description: `${order.package.name} — ${listingTitle}`,
        order_id: order.order_id,
        prefill: {
          name: order.name,
          email: order.email,
          contact: order.contact,
        },
        notes: {
          package: order.package.code,
          listing_id: order.listing_id,
          product: "old-car-bazar-boost",
        },
        theme: { color: "#f75d34" },
        handler: async (response) => {
          try {
            const updated = await api.verifyBoostPayment(listingId, response);
            onBoosted(updated.boostedUntil ?? null);
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Payment verification failed."
            );
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });
      checkout.open();
    } catch (err) {
      if (err instanceof ApiError && err.status === 503) {
        setError(
          "Payments are not configured yet. Add Razorpay keys and redeploy."
        );
      } else {
        setError(err instanceof Error ? err.message : "Payment could not start.");
      }
      setPaying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal
      aria-labelledby="boost-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !paying) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="boost-title" className="text-lg font-bold text-gray-900">
              🚀 Boost this listing
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Get top placement for{" "}
              <span className="font-semibold text-gray-900">{listingTitle}</span>{" "}
              and reach more buyers.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={paying}
            aria-label="Close"
            className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-lg font-bold text-gray-500 hover:bg-gray-200 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner size="md" tone="muted" />
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {packages.map((pkg) => {
              const active = selected === pkg.code;
              return (
                <button
                  key={pkg.code}
                  type="button"
                  onClick={() => setSelected(pkg.code)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-[#f75d34] bg-orange-50 ring-2 ring-[#f75d34]/20"
                      : "border-gray-200 hover:border-[#f75d34]/40"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {pkg.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {pkg.perks[0] ?? `Top placement for ${pkg.duration_days} days`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-base font-bold text-[#f75d34]">
                      ₹{Math.round(pkg.price_inr * 1.18).toLocaleString("en-IN")}
                    </span>
                    <span className="block text-[10px] text-gray-400">
                      incl. 18% GST
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!loading && (
          <div className="mt-4">
            <label
              htmlFor="boost-gstin"
              className="block text-xs font-semibold text-gray-700"
            >
              GST number{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              id="boost-gstin"
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              placeholder="e.g. 09ABCDE1234F1Z5"
              maxLength={15}
              autoComplete="off"
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono uppercase tracking-wide text-gray-900 outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
            />
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handlePay}
          disabled={paying || loading || !selected}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#f75d34] px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#e54d24] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {paying && <Spinner size="sm" tone="white" />}
          {paying ? "Opening payment…" : "Pay & Boost"}
        </button>
        <p className="mt-3 text-center text-[11px] text-gray-400">
          Secured by Razorpay · UPI, cards, net banking
        </p>
      </div>
    </div>
  );
}
