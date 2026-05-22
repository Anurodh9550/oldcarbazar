"use client";

import { motion } from "framer-motion";
import { useLocation } from "@/context/LocationContext";
import CarListingGrid from "./CarListingGrid";
import FiltersSidebar from "./FiltersSidebar";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function ListingsSection() {
  const { selectedCity, totalCarsInCity } = useLocation();

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
          Featured Listings
        </motion.p>
        <motion.h2
          key={selectedCity}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 section-title-lg"
        >
          {totalCarsInCity}+ used cars for sale from ₹45,000 in {selectedCity}
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
          <FiltersSidebar />
          <CarListingGrid />
        </motion.section>
      </motion.section>
    </motion.main>
  );
}
