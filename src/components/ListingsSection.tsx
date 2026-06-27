"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "@/context/LocationContext";
import { useLanguage } from "@/context/LanguageContext";
import CarListingGrid from "./CarListingGrid";
import FiltersSidebar from "./FiltersSidebar";
import MobileFiltersDrawer from "./ui/MobileFiltersDrawer";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function ListingsSection() {
  const { selectedCity, totalCarsInCity } = useLocation();
  const { copy, t } = useLanguage();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <motion.main
      id="listings"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f5f5f5]"
    >
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-[1280px] px-4 py-6 lg:px-6"
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="eyebrow"
        >
          {copy.listings.eyebrow}
        </motion.p>
        <motion.h2
          key={selectedCity}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 section-title-lg"
        >
          {t(copy.listings.title, {
            count: totalCarsInCity,
            city: selectedCity,
          })}
        </motion.h2>
        <motion.p
          key={`${selectedCity}-desc`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-2 max-w-4xl text-body-muted"
        >
          Find the best deals on second hand cars in {selectedCity}. Browse from
          a wide range of verified used cars with detailed specs, prices, and
          seller information.
        </motion.p>

        <motion.section
          variants={fadeInUp}
          className="mt-6 flex flex-col gap-6 lg:flex-row"
        >
          <div className="hidden lg:block">
            <FiltersSidebar />
          </div>

          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="mb-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:border-[#f75d34] hover:text-[#f75d34] lg:hidden"
              aria-label="Open filters"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
              </svg>
              Filters
            </button>
            <CarListingGrid />
          </div>
        </motion.section>
      </motion.section>

      <MobileFiltersDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
      >
        <FiltersSidebar />
      </MobileFiltersDrawer>
    </motion.main>
  );
}
