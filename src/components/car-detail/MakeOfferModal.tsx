"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";

type Props = {
  listingId: string;
  listingTitle: string;
  /** Asking price in INR (number form). Used to suggest sensible offers. */
  askingPriceInr: number;
  onClose: () => void;
  onSubmitted: () => void;
};

function formatINR(num: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.max(0, Math.round(num))
  );
}

export default function MakeOfferModal({
  listingId,
  listingTitle,
  askingPriceInr,
  onClose,
  onSubmitted,
}: Props) {
  const { user } = useAuth();
  // Default suggestion: 95% of asking price (typical "first offer" anchor).
  const defaultAmount = useMemo(
    () => Math.round(Math.max(askingPriceInr * 0.95, 50000)),
    [askingPriceInr]
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const discountPct =
    askingPriceInr > 0
      ? Math.round(((askingPriceInr - amount) / askingPriceInr) * 100)
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(phone))
      return setError("Enter a 10-digit mobile number starting with 6-9.");
    if (!amount || amount < 1000)
      return setError("Offer amount must be at least ₹1,000.");
    if (amount > askingPriceInr * 1.5)
      return setError("Offer is unusually high — please double-check.");

    setError("");
    setSubmitting(true);
    try {
      await api.createOffer({
        listing: listingId,
        buyer_name: name,
        buyer_phone: phone,
        buyer_email: user?.email,
        amount,
        message,
      });
      setSuccess(true);
      onSubmitted();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't send your offer. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const quickButtons = [
    { label: "5% less", value: Math.round(askingPriceInr * 0.95) },
    { label: "10% less", value: Math.round(askingPriceInr * 0.9) },
    { label: "15% less", value: Math.round(askingPriceInr * 0.85) },
  ];

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/55 sm:items-center sm:p-4"
      role="dialog"
      aria-modal
      aria-labelledby="make-offer-title"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-2xl"
      >
        {success ? (
          <div className="flex flex-col items-center text-center">
            <span className="text-5xl">💸</span>
            <h2 className="mt-3 text-lg font-bold text-gray-900">
              Offer sent to seller
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Aapka offer ₹{formatINR(amount)} seller ko bhej diya gaya hai.
              Accept / Reject / Counter response WhatsApp aur dashboard par
              milega.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-xl bg-[#f75d34] py-2.5 text-sm font-semibold text-white hover:bg-[#e54d24]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#f75d34]">
                  Make an Offer
                </p>
                <h2
                  id="make-offer-title"
                  className="mt-0.5 text-lg font-bold text-gray-900"
                >
                  Negotiate with the seller
                </h2>
                <p className="text-caption mt-0.5">{listingTitle}</p>
                {askingPriceInr > 0 && (
                  <p className="mt-1 text-[11px] text-gray-500">
                    Asking price: ₹{formatINR(askingPriceInr)}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <label className="block">
                <span className="text-label mb-1 block">Your name *</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="As per ID"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
                  required
                />
              </label>
              <label className="block">
                <span className="text-label mb-1 block">Mobile number *</span>
                <input
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit mobile"
                  maxLength={10}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
                  required
                />
              </label>

              <div>
                <span className="text-label mb-1 block">Your offer (₹) *</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1000}
                  value={amount}
                  onChange={(e) =>
                    setAmount(parseInt(e.target.value, 10) || 0)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base font-bold text-gray-900 outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
                  required
                />
                {askingPriceInr > 0 && (
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {quickButtons.map((q) => (
                        <button
                          key={q.label}
                          type="button"
                          onClick={() => setAmount(q.value)}
                          className="rounded-full border border-gray-200 px-3 py-1 text-[11px] font-semibold text-gray-700 hover:border-[#f75d34] hover:text-[#f75d34]"
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                    {amount > 0 && (
                      <span
                        className={`text-[11px] font-bold ${
                          discountPct >= 0
                            ? "text-green-700"
                            : "text-amber-700"
                        }`}
                      >
                        {discountPct >= 0 ? "↓" : "↑"} {Math.abs(discountPct)}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              <label className="block">
                <span className="text-label mb-1 block">
                  Note to seller (optional)
                </span>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Cash buyer / can do RC transfer this week / etc."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
                />
              </label>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f75d34] py-3 text-sm font-semibold text-white shadow hover:bg-[#e54d24] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <Spinner size="sm" tone="white" />}
                {submitting ? "Sending offer…" : "Send Offer"}
              </button>
              <p className="text-[10px] text-gray-500 text-center">
                Aapka offer seller ko dashboard par dikhega. Genuine offers
                hi bheje — repeated low-balls block kar diye jate hain.
              </p>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
