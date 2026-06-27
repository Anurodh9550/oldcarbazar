"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSiteCopy } from "@/context/LanguageContext";
import FeatureIcon from "@/components/ui/FeatureIcon";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function QuickActionsSection() {
  const copy = useSiteCopy();

  return (
    <section className="px-4 py-10 lg:px-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto grid max-w-[1280px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {copy.quickActions.map((action) => (
          <motion.div key={action.href} variants={fadeInUp}>
            <Link
              href={action.href}
              className="card-surface card-surface-hover group flex h-full items-start gap-4 p-5"
            >
              <FeatureIcon
                name={action.icon}
                className="transition group-hover:scale-105 group-hover:ring-[#f75d34]/30"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 group-hover:text-[#f75d34]">
                  {action.title}
                </p>
                <p className="mt-1 text-sm text-gray-600">{action.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
