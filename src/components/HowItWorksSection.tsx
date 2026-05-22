"use client";

import { motion } from "framer-motion";
import { howItWorksBuy, howItWorksSell } from "@/data/homeSections";
import { fadeInUp, staggerContainer } from "@/lib/motion";

function StepsColumn({
  title,
  steps,
  accent,
}: {
  title: string;
  steps: { step: string; title: string; desc: string }[];
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className={`text-base font-bold ${accent}`}>{title}</h3>
      <ul className="mt-5 space-y-5">
        {steps.map((item) => (
          <li key={item.step} className="flex gap-4">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${accent === "text-[#f75d34]" ? "bg-[#f75d34]" : "bg-gray-800"}`}
            >
              {item.step}
            </span>
            <motion.div>
              <p className="font-semibold text-gray-900">{item.title}</p>
              <p className="mt-0.5 text-caption sm:text-sm">{item.desc}</p>
            </motion.div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section className="bg-[#f5f5f5] py-12">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center section-title"
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-1 text-center text-caption sm:text-sm"
        >
          Simple steps to buy or sell on Old Car Bazar
        </motion.p>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 grid gap-6 lg:grid-cols-2"
        >
          <motion.div variants={fadeInUp}>
            <StepsColumn
              title="How to Buy a Used Car"
              steps={howItWorksBuy}
              accent="text-[#f75d34]"
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <StepsColumn
              title="How to Sell Your Car"
              steps={howItWorksSell}
              accent="text-gray-800"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
