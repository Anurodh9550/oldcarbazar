"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

export default function SellCarBanner() {
  return (
    <section className="px-4 py-10 lg:px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-[#f75d34] to-[#e54d24] px-6 py-10 text-center sm:flex-row sm:text-left sm:px-10"
      >
        <div>
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Want to sell your old car?
          </h2>
          <p className="mt-2 max-w-md text-sm text-orange-100">
            Post a free ad, get instant valuation, and connect with genuine buyers
            in your city.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link
            href="/sell-car"
            className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[#f75d34] shadow hover:bg-orange-50"
          >
            Sell Car Free
          </Link>
          <Link
            href="/valuation"
            className="rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
          >
            Get Valuation
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
