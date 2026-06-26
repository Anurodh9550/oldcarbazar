"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { SubscriptionStatus } from "@/lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  status: SubscriptionStatus | null;
};

export default function UpgradeRequiredModal({ open, onClose, status }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="dark-surface bg-gradient-to-br from-[#f75d34] to-[#e54d24] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold">You&apos;ve hit the free limit</h2>
                  <p className="text-sm text-white/85">
                    Upgrade to keep listing more cars
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4">
                <p className="text-sm font-semibold text-gray-800">
                  {status
                    ? `You are using ${status.listings_used} of ${status.listings_limit} free listings`
                    : "You are using all of your free listings"}
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Mark an existing car as <span className="font-medium">Sold</span>{" "}
                  to free up a slot, or upgrade to <span className="font-semibold text-[#f75d34]">Pro</span>{" "}
                  for unlimited listings.
                </p>
              </div>

              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  "Unlimited active listings",
                  "Pro badge on every listing",
                  "Priority placement in search",
                  "Email + WhatsApp lead alerts",
                ].map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#f75d34]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                      <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {perk}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:gap-3">
                <Link
                  href="/pricing"
                  onClick={onClose}
                  className="flex-1 rounded-full bg-[#f75d34] px-4 py-2.5 text-center text-sm font-semibold text-white shadow hover:bg-[#e54d24]"
                >
                  View plans
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300"
                >
                  Not now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
