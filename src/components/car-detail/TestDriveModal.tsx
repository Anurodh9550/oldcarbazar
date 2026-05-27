"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";

type Props = {
  listingId: string;
  listingTitle: string;
  defaultLocation?: string;
  onClose: () => void;
  onSubmitted: () => void;
};

/** Round the next "good" test-drive slot — next half-hour, 24h ahead. */
function defaultScheduleValue(): string {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  d.setMinutes(d.getMinutes() < 30 ? 30 : 0);
  if (d.getMinutes() === 0) d.setHours(d.getHours() + 1);
  d.setSeconds(0, 0);
  // input[type=datetime-local] expects local-time without timezone suffix.
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TestDriveModal({
  listingId,
  listingTitle,
  defaultLocation = "",
  onClose,
  onSubmitted,
}: Props) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const initialSchedule = useMemo(defaultScheduleValue, []);
  const [scheduledAt, setScheduledAt] = useState(initialSchedule);
  const [locationNote, setLocationNote] = useState(defaultLocation);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(phone))
      return setError("Enter a 10-digit mobile number starting with 6-9.");
    if (!scheduledAt) return setError("Pick a date and time.");
    const when = new Date(scheduledAt);
    if (Number.isNaN(when.getTime()) || when.getTime() < Date.now())
      return setError("Pick a future date and time.");

    setError("");
    setSubmitting(true);
    try {
      await api.createTestDrive({
        listing: listingId,
        buyer_name: name,
        buyer_phone: phone,
        buyer_email: user?.email,
        scheduled_at: when.toISOString(),
        location_note: locationNote,
        message,
      });
      setSuccess(true);
      onSubmitted();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't book the test drive. Please try again."
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
      aria-labelledby="test-drive-title"
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
            <span className="text-5xl">🚗</span>
            <h2 className="mt-3 text-lg font-bold text-gray-900">
              Test drive requested
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {listingTitle} ke seller ko aapki request bhej di gayi hai.
              Confirm hone par WhatsApp/Call par confirmation milegi.
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
                  Test Drive
                </p>
                <h2
                  id="test-drive-title"
                  className="mt-0.5 text-lg font-bold text-gray-900"
                >
                  Book a slot for this car
                </h2>
                <p className="text-caption mt-0.5">{listingTitle}</p>
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
              <label className="block">
                <span className="text-label mb-1 block">
                  Preferred date &amp; time *
                </span>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  min={initialSchedule}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
                  required
                />
              </label>
              <label className="block">
                <span className="text-label mb-1 block">
                  Preferred location (optional)
                </span>
                <input
                  value={locationNote}
                  onChange={(e) => setLocationNote(e.target.value)}
                  placeholder="e.g. Seller's address, near a metro station"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
                />
              </label>
              <label className="block">
                <span className="text-label mb-1 block">
                  Message to seller (optional)
                </span>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any preference / questions for the seller"
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
                {submitting ? "Booking…" : "Request Test Drive"}
              </button>
              <p className="text-[10px] text-gray-500 text-center">
                Booking confirm hone par seller aapse WhatsApp ya phone par
                connect karega.
              </p>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
