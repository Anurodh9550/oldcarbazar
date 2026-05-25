"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

type BuyerInquiryModalProps = {
  listingId: string;
  listingTitle: string;
  /** Called with `true` once the inquiry is submitted successfully. */
  onSubmitted: () => void;
  onClose: () => void;
};

export default function BuyerInquiryModal({
  listingId,
  listingTitle,
  onSubmitted,
  onClose,
}: BuyerInquiryModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (user?.name && !name) setName(user.name);
    if (user?.phone && !phone) setPhone(user.phone);
  }, [user, name, phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!name.trim()) {
      setError("Apna naam likhein.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("10-digit mobile number daalein (6-9 se start).");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await api.createInquiry({
        listing: listingId,
        buyer_name: name,
        buyer_phone: phone,
        buyer_email: user?.email,
        channel: "form",
      });
      onSubmitted();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Inquiry bhejne mein dikkat aayi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/55 sm:items-center sm:p-4"
      role="dialog"
      aria-modal
      aria-labelledby="buyer-inquiry-title"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 id="buyer-inquiry-title" className="text-lg font-bold text-gray-900">
              Contact Seller
            </h2>
            <p className="mt-1 text-caption">
              <span className="font-semibold text-gray-700">{listingTitle}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <p className="rounded-lg bg-orange-50 px-3 py-2.5 text-sm text-gray-700">
            Apna naam aur phone bhejein — seller aapko 24 ghante mein contact
            karega. Aapki detail admin panel par save ho jayegi.
          </p>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">
              Full Name <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Rahul Sharma"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">
              Phone Number <span className="text-red-500">*</span>
            </span>
            <div className="flex w-full overflow-hidden rounded-lg border border-gray-300 transition focus-within:border-[#f75d34] focus-within:ring-2 focus-within:ring-[#f75d34]/20">
              <span className="flex items-center bg-gray-50 px-3 text-sm font-medium text-gray-500">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setError("");
                }}
                placeholder="10-digit mobile number"
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-gray-900 outline-none"
                required
              />
            </div>
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-lg bg-[#f75d34] py-3 text-sm font-semibold text-white shadow-md hover:bg-[#e54d24] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Sending..." : "Send & Get Seller Details"}
          </motion.button>

          <p className="text-center text-[11px] text-gray-400">
            Submit karke aap seller ko apna phone share kar rahe hain.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
