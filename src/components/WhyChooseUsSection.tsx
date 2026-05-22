"use client";

import { motion } from "framer-motion";
import { whyChooseUs } from "@/data/homeSections";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function WhyChooseUsSection() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center section-title"
        >
          Why Choose Old Car Bazar?
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {whyChooseUs.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="rounded-xl border border-gray-100 bg-gray-50 p-5 text-center"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f75d34]/10 text-xl font-bold text-[#f75d34]">
                {item.icon}
              </span>
              <h3 className="mt-3 font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-caption sm:text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
