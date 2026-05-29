"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "@/context/LocationContext";
import { useListings } from "@/context/ListingsContext";
import { fadeInRight, staggerContainer } from "@/lib/motion";
import CarCard from "./CarCard";
import CarCardSkeleton from "./ui/CarCardSkeleton";
import { parseKms } from "@/lib/carMeta";

type SortKey = "relevance" | "price-asc" | "price-desc" | "kms-asc";

const sortOptions: { id: SortKey; label: string }[] = [
  { id: "relevance", label: "Relevance" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "kms-asc", label: "Kms: Low to High" },
];

function parsePriceToLakh(price: string): number {
  if (!price) return 0;
  const cleaned = price.replace(/[^\d.]/g, "");
  const num = parseFloat(cleaned);
  if (Number.isNaN(num)) return 0;
  if (/cr/i.test(price)) return num * 100;
  return num;
}

export default function CarListingGrid() {
  const { filteredCars, selectedCity } = useLocation();
  const { loading: listingsLoading } = useListings();
  const [sort, setSort] = useState<SortKey>("relevance");

  const sortedCars = useMemo(() => {
    const list = [...filteredCars];
    if (sort === "price-asc") {
      list.sort((a, b) => parsePriceToLakh(a.price) - parsePriceToLakh(b.price));
    } else if (sort === "price-desc") {
      list.sort((a, b) => parsePriceToLakh(b.price) - parsePriceToLakh(a.price));
    } else if (sort === "kms-asc") {
      list.sort((a, b) => parseKms(a.specs) - parseKms(b.specs));
    }
    return list;
  }, [filteredCars, sort]);

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
        className="mb-4 flex flex-wrap items-center justify-between gap-2"
      >
        <p className="text-body-muted">
          Showing{" "}
          <span className="font-semibold text-[#f75d34]">
            {sortedCars.length}
          </span>{" "}
          cars in {selectedCity}
        </p>
        <label className="ml-auto flex items-center gap-2 text-body-muted">
          <span className="hidden sm:inline">Sort by</span>
          <motion.select
            whileFocus={{ scale: 1.02 }}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 outline-none focus:border-[#f75d34]"
            aria-label="Sort by"
          >
            {sortOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </motion.select>
        </label>
      </motion.div>

      <AnimatePresence mode="wait">
        {listingsLoading && sortedCars.length === 0 ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CarCardSkeleton count={6} />
          </motion.div>
        ) : sortedCars.length === 0 ? (
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
            {sortedCars.map((car, index) => (
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
