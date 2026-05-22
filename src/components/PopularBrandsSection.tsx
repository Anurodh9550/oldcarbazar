"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getBrandSlugFromName } from "@/data/explorePage";
import { popularBrands } from "@/data/homeSections";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function PopularBrandsSection() {
  return (
    <section className="border-y border-gray-100 bg-[#fafafa] py-10">
      <motion.div
        className="mx-auto max-w-[1280px] px-4 lg:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeInUp} className="section-title">
          Popular Brands
        </motion.h2>
        <motion.p variants={fadeInUp} className="mt-1 text-caption sm:text-sm">
          Top brands buyers search on Old Car Bazar
        </motion.p>

        <motion.div
          variants={staggerContainer}
          className="mt-5 flex flex-wrap gap-2"
        >
          {popularBrands.map((brand) => (
            <motion.div key={brand} variants={fadeInUp}>
              <Link
                href={`/used-cars/search?brand=${getBrandSlugFromName(brand)}`}
                className="inline-block rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-[#f75d34] hover:bg-orange-50 hover:text-[#f75d34]"
              >
                {brand}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
