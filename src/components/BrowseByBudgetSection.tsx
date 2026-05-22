"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { budgetRanges } from "@/data/homeSections";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function BrowseByBudgetSection() {
  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-title"
        >
          Browse by Budget
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-1 text-caption sm:text-sm"
        >
          Find used cars that fit your pocket
        </motion.p>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        >
          {budgetRanges.map((item) => (
            <motion.div key={item.label} variants={fadeInUp}>
              <Link
                href={item.href}
                className="block rounded-xl border border-gray-200 bg-gray-50 px-3 py-4 text-center transition hover:border-[#f75d34] hover:bg-orange-50"
              >
                <p className="text-xs font-semibold text-gray-900 sm:text-sm">
                  {item.label}
                </p>
                <p className="mt-1 text-xs font-bold text-[#f75d34]">
                  {item.count} cars
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
