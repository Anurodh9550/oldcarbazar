"use client";

import { motion } from "framer-motion";
import { useChromeCopy } from "@/context/LanguageContext";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureIcon from "@/components/ui/FeatureIcon";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function WhyChooseUsSection() {
  const copy = useChromeCopy();

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
        <SectionHeader
          eyebrow={copy.whyChoose.eyebrow}
          title={copy.whyChoose.title}
          subtitle={copy.whyChoose.subtitle}
          align="center"
          className="mx-auto max-w-2xl"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {copy.whyChoose.items.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="card-surface p-6 text-center"
            >
              <FeatureIcon name={item.icon} size="lg" className="mx-auto" />
              <h3 className="mt-4 text-base font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
