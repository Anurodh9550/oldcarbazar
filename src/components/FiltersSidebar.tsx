"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInLeft, fadeInUp, staggerContainer } from "@/lib/motion";

const recommendedFilters: {
  label: string;
  icon: string;
  href: string;
}[] = [
  { label: "Certified Cars", icon: "✓", href: "/assured" },
  {
    label: "Price Drop",
    icon: "↓",
    href: "/used-cars/search?discount=discounted",
  },
  {
    label: "Under ₹5 Lakh",
    icon: "₹",
    href: "/used-cars/search?budget=3-5",
  },
  {
    label: "Luxury Cars",
    icon: "★",
    href: "/used-cars/search?budget=15-plus",
  },
];

const budgetFilters: { label: string; href: string }[] = [
  { label: "Under ₹2 Lakh", href: "/used-cars/search?budget=under-2" },
  { label: "₹2 - ₹3 Lakh", href: "/used-cars/search?budget=2-3" },
  { label: "₹3 - ₹5 Lakh", href: "/used-cars/search?budget=3-5" },
  { label: "₹5 - ₹10 Lakh", href: "/used-cars/search?budget=5-10" },
  { label: "₹10 - ₹15 Lakh", href: "/used-cars/search?budget=10-15" },
  { label: "Above ₹15 Lakh", href: "/used-cars/search?budget=15-plus" },
];

export default function FiltersSidebar() {
  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={fadeInLeft}
      className="w-full shrink-0 lg:w-[280px]"
    >
      <Link
        href="/used-cars/search"
        className="mb-4 block w-full rounded border border-gray-300 bg-white py-2 text-center text-xs font-semibold tracking-wide text-gray-700 transition hover:border-[#f75d34] hover:text-[#f75d34]"
      >
        OPEN ALL FILTERS
      </Link>

      <motion.section
        variants={fadeInUp}
        whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
        className="mb-6 rounded-lg border border-gray-200 bg-white p-4"
      >
        <h3 className="mb-3 text-sm font-bold text-gray-900">Recommended</h3>
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-2"
        >
          {recommendedFilters.map((filter) => (
            <motion.li key={filter.label} variants={fadeInUp}>
              <Link
                href={filter.href}
                className="flex w-full flex-col items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-3 text-center text-xs font-medium text-gray-700 transition hover:border-[#f75d34] hover:bg-orange-50 hover:text-[#f75d34]"
              >
                <span className="text-lg text-[#f75d34]">{filter.icon}</span>
                {filter.label}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.15 }}
        whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
        className="rounded-lg border border-gray-200 bg-white p-4"
      >
        <h3 className="mb-4 text-sm font-bold text-gray-900">Budget</h3>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-1"
        >
          {budgetFilters.map((opt) => (
            <motion.li key={opt.label} variants={fadeInUp} whileHover={{ x: 4 }}>
              <Link
                href={opt.href}
                className="block rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f75d34]"
              >
                {opt.label}
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        <Link
          href="/used-cars/search"
          className="mt-4 block w-full rounded-lg border border-[#f75d34] bg-white py-2 text-center text-xs font-semibold text-[#f75d34] transition hover:bg-[#f75d34] hover:text-white"
        >
          Advanced Filters →
        </Link>
      </motion.section>
    </motion.aside>
  );
}
