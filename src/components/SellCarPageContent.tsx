"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";
import SellCarForm from "./SellCarForm";

export default function SellCarPageContent({ embedded }: { embedded?: boolean }) {
  const { user, isLoggedIn } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setAuthOpen(true);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-dashed border-[#f75d34]/40 bg-white p-8 text-center shadow-sm sm:p-12"
        >
          <span className="text-5xl">🔒</span>
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Login Required to Sell Your Car
          </h2>
          <p className="mx-auto mt-2 max-w-md text-body-muted">
            Pehle account banao ya login karo. Uske baad hi aap free listing post
            kar sakte ho Old Car Bazar par.
          </p>
          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-body-muted">
            <li className="flex gap-2">
              <span className="text-[#f75d34]">✓</span> Free car listing
            </li>
            <li className="flex gap-2">
              <span className="text-[#f75d34]">✓</span> Direct buyer messages
            </li>
            <li className="flex gap-2">
              <span className="text-[#f75d34]">✓</span> Manage your ads anytime
            </li>
          </ul>
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="mt-8 rounded-full bg-[#f75d34] px-8 py-3 text-sm font-semibold text-white hover:bg-[#e54d24]"
          >
            Login / Register
          </button>
        </motion.div>

        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    );
  }

  return (
  <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-4 flex items-center justify-between rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm"
      >
        <p className="text-green-800">
          Logged in as <span className="font-semibold">{user?.name}</span>
        </p>
        <span className="text-green-600 text-xs">✓ Ready to list</span>
      </motion.div>
      <SellCarForm
        embedded={embedded}
        defaultContact={{
          sellerName: user?.name ?? "",
          phone: user?.phone ?? "",
          email: user?.email ?? "",
        }}
      />
    </>
  );
}
