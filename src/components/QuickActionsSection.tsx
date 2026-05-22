"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { quickActions } from "@/data/homeSections";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function QuickActionsSection() {
  return (
    <section className="bg-[#f5f5f5] px-4 py-8 lg:px-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto grid max-w-[1280px] grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4"
      >
        {quickActions.map((action) => (
          <motion.div key={action.title} variants={fadeInUp}>
            <Link
              href={action.href}
              className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center shadow-md transition hover:border-[#f75d34] hover:shadow-lg sm:flex-row sm:gap-3 sm:p-4 sm:text-left"
            >
              <span className="text-2xl sm:text-3xl">{action.icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-900">{action.title}</p>
                <p className="mt-0.5 text-caption">{action.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
