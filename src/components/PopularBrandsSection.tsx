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
        <motion.div
          variants={fadeInUp}
          className="flex items-start justify-between gap-3"
        >
          <div>
            <h2 className="section-title">Popular Brands</h2>
            <p className="mt-1 text-caption sm:text-sm">
              Top brands buyers search on Old Car Bazar
            </p>
          </div>
          <Link
            href="/used-cars"
            className="mt-1 shrink-0 whitespace-nowrap text-sm font-semibold text-[#f75d34] hover:underline"
          >
            View all →
          </Link>
        </motion.div>

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
