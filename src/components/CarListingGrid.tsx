"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "@/context/LocationContext";
import { fadeInRight, staggerContainer } from "@/lib/motion";
import CarCard from "./CarCard";

export default function CarListingGrid() {
  const { filteredCars, selectedCity } = useLocation();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeInRight}
      className="flex-1"
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-4 flex items-center justify-between"
      >
        <p className="text-body-muted">
          Showing{" "}
          <span className="font-semibold text-[#f75d34]">
            {filteredCars.length}
          </span>{" "}
          cars in {selectedCity}
        </p>
        <label className="flex items-center gap-2 text-body-muted">
          Sort by
          <motion.select
            whileFocus={{ scale: 1.02 }}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 outline-none focus:border-[#f75d34]"
          >
            <option>Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Kms: Low to High</option>
          </motion.select>
        </label>
      </motion.div>

      <AnimatePresence mode="wait">
        {filteredCars.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center"
          >
            <p className="text-lg font-semibold text-gray-800">
              No cars found in {selectedCity}
            </p>
            <p className="mt-2 text-caption sm:text-sm">
              Try selecting another city from the header.
            </p>
          </motion.div>
        ) : (
          <motion.ul
            key={selectedCity}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {filteredCars.map((car, index) => (
              <motion.li key={car.id} variants={fadeInRight}>
                <CarCard car={car} index={index} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
