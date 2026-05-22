"use client";

import { motion } from "framer-motion";
import { budgetFilters, recommendedFilters } from "@/data/cars";
import { fadeInLeft, fadeInUp, staggerContainer } from "@/lib/motion";

export default function FiltersSidebar() {
  return (
    <motion.aside
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeInLeft}
      className="w-full shrink-0 lg:w-[280px]"
    >
      <motion.button
        type="button"
        whileHover={{ scale: 1.02, borderColor: "#f75d34", color: "#f75d34" }}
        whileTap={{ scale: 0.98 }}
        className="mb-4 w-full rounded border border-gray-300 bg-white py-2 text-xs font-semibold tracking-wide text-gray-700"
      >
        COLLAPSE ALL FILTERS
      </motion.button>

      <motion.section
        variants={fadeInUp}
        whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
        className="mb-6 rounded-lg border border-gray-200 bg-white p-4"
      >
        <h3 className="mb-3 text-sm font-bold text-gray-900">Recommended</h3>
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-2"
        >
          {recommendedFilters.map((filter) => (
            <motion.li key={filter.label} variants={fadeInUp}>
              <motion.button
                type="button"
                whileHover={{
                  scale: 1.04,
                  borderColor: "#f75d34",
                  backgroundColor: "#fff7ed",
                  color: "#f75d34",
                }}
                whileTap={{ scale: 0.96 }}
                className="flex w-full flex-col items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-3 text-center text-xs font-medium text-gray-700"
              >
                <span className="text-lg text-[#f75d34]">{filter.icon}</span>
                {filter.label}
              </motion.button>
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
        className="rounded-lg border border-gray-200 bg-white p-4"
      >
        <h3 className="mb-4 text-sm font-bold text-gray-900">Budget</h3>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-4 px-1"
        >
          <input
            type="range"
            min={0}
            max={100}
            defaultValue={50}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#f75d34]"
          />
          <p className="mt-2 flex justify-between text-caption">
            <span>₹0</span>
            <span>₹5 Crore</span>
          </p>
        </motion.div>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-2"
        >
          {budgetFilters.map((label) => (
            <motion.li
              key={label}
              variants={fadeInUp}
              whileHover={{ x: 4 }}
            >
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 hover:text-[#f75d34]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-[#f75d34]"
                />
                {label}
              </label>
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>
    </motion.aside>
  );
}
