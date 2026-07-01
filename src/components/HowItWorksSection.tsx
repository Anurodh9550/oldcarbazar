"use client";

import { motion } from "framer-motion";
import { useChromeCopy } from "@/context/LanguageContext";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeInUp, staggerContainer } from "@/lib/motion";

function StepsColumn({
  title,
  steps,
  accent,
}: {
  title: string;
  steps: { step: string; title: string; desc: string }[];
  accent: "orange" | "slate";
}) {
  const stepBg = accent === "orange" ? "bg-[#f75d34]" : "bg-gray-800";
  const titleClass = accent === "orange" ? "text-[#f75d34]" : "text-gray-900";

  return (
    <div className="card-surface p-6 lg:p-8">
      <h3 className={`text-lg font-bold ${titleClass}`}>{title}</h3>
      <ul className="mt-6 space-y-6">
        {steps.map((item) => (
          <li key={item.step} className="flex gap-4">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${stepBg}`}
            >
              {item.step}
            </span>
            <motion.div>
              <p className="font-semibold text-gray-900">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.desc}</p>
            </motion.div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HowItWorksSection() {
  const copy = useChromeCopy();

  return (
    <section className="py-14">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
        <SectionHeader
          eyebrow={copy.howItWorks.eyebrow}
          title={copy.howItWorks.title}
          subtitle={copy.howItWorks.subtitle}
          align="center"
          className="mx-auto max-w-2xl"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 grid gap-6 lg:grid-cols-2"
        >
          <motion.div variants={fadeInUp}>
            <StepsColumn
              title={copy.howItWorks.buyersTitle}
              steps={copy.howItWorks.buySteps}
              accent="orange"
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <StepsColumn
              title={copy.howItWorks.sellersTitle}
              steps={copy.howItWorks.sellSteps}
              accent="slate"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
