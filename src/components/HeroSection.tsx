"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "@/context/LocationContext";
import {
  fadeIn,
  fadeInUp,
  staggerContainer,
  staggerContainerSlow,
} from "@/lib/motion";

const quickLinks: { label: string; query: string }[] = [
  { label: "Swift", query: "q=swift" },
  { label: "Creta", query: "q=creta" },
  { label: "Harrier", query: "q=harrier" },
  { label: "Innova", query: "q=innova" },
  { label: "Thar", query: "q=thar" },
  { label: "City", query: "q=city" },
];

const budgetOptions: { label: string; value: string }[] = [
  { label: "Any Budget", value: "" },
  { label: "Under ₹2 Lakh", value: "under-2" },
  { label: "₹2 - ₹5 Lakh", value: "3-5" },
  { label: "₹5 - ₹10 Lakh", value: "5-10" },
  { label: "Above ₹10 Lakh", value: "10-15" },
];

export default function HeroSection() {
  const router = useRouter();
  const { selectedCity, totalCarsInCity } = useLocation();
  const [brand, setBrand] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brand.trim()) params.set("q", brand.trim());
    if (budget) params.set("budget", budget);
    if (selectedCity) params.set("city", selectedCity);
    const qs = params.toString();
    router.push(qs ? `/used-cars/search?${qs}` : "/used-cars/search");
  };

  const stats = [
    { value: `${totalCarsInCity}+`, label: "Used Cars" },
    { value: "₹45K", label: "Starting Price" },
    { value: "500+", label: "Verified Sellers" },
  ];

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      <Image
        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=700&fit=crop"
        alt="Used cars"
        fill
        priority
        className="object-cover opacity-30"
        sizes="100vw"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"
      />

      <motion.div
        variants={staggerContainerSlow}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-[1280px] px-4 py-14 lg:px-6 lg:py-20"
      >
        <motion.div variants={fadeInUp} className="max-w-2xl">
          <motion.span
            variants={fadeInUp}
            className="eyebrow-sell mt-0 ring-1 ring-[#f75d34]/40"
          >
            {selectedCity}&apos;s #1 Used Car Marketplace
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="hero-title mt-4"
          >
            Find Your Perfect{" "}
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-[#f75d34]"
            >
              Used Car
            </motion.span>{" "}
            Today
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="hero-lead mt-4"
          >
            Browse {totalCarsInCity}+ verified second-hand cars in {selectedCity}{" "}
            from ₹45,000. Compare prices,
            chat with sellers, and drive home your dream car.
          </motion.p>

          <motion.form
            variants={fadeInUp}
            whileHover={{ scale: 1.01 }}
            onSubmit={handleSearch}
            className="mt-8 flex flex-col gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm sm:flex-row sm:items-end sm:gap-2 sm:p-3"
          >
            <label className="flex-1">
              <span className="mb-1 block text-xs font-medium text-gray-300">
                Brand or Model
              </span>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Swift, Creta, Harrier"
                className="w-full rounded-lg border border-white/20 bg-white/95 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/30"
              />
            </label>
            <label className="flex-1">
              <span className="mb-1 block text-xs font-medium text-gray-300">
                Budget
              </span>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/95 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/30"
              >
                {budgetOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, backgroundColor: "#e54d24" }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-[#f75d34] px-8 py-2.5 text-sm font-semibold text-white sm:py-3"
            >
              Search Cars
            </motion.button>
          </motion.form>

          <motion.div
            variants={staggerContainer}
            className="mt-4 flex flex-wrap items-center gap-2"
          >
            <span className="text-caption">Popular:</span>
            {quickLinks.map((car) => (
              <motion.div key={car.label} variants={fadeInUp}>
                <Link
                  href={`/used-cars/search?${car.query}`}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:border-[#f75d34] hover:bg-[#f75d34]/20"
                >
                  {car.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 sm:max-w-lg"
        >
          {stats.map((stat) => (
            <motion.li
              key={stat.label}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              className="text-center sm:text-left"
            >
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
                className="text-2xl font-bold text-[#f75d34] sm:text-3xl"
              >
                {stat.value}
              </motion.p>
              <p className="mt-1 text-caption sm:text-sm">
                {stat.label}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </motion.section>
  );
}
