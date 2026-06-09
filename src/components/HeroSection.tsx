"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

const heroImages = ["/hero-cars.png", "/hero-cars-2.png", "/hero-cars-3.png"];

export default function HeroSection() {
  const router = useRouter();
  const { selectedCity } = useLocation();
  const [brand, setBrand] = useState("");
  const [budget, setBudget] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brand.trim()) params.set("q", brand.trim());
    if (budget) params.set("budget", budget);
    if (selectedCity) params.set("city", selectedCity);
    const qs = params.toString();
    router.push(qs ? `/used-cars/search?${qs}` : "/used-cars/search");
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.2 }, scale: { duration: 4.5 } }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[activeSlide]}
              alt="Used cars"
              fill
              priority
              className="object-cover opacity-70"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"
      />

      <motion.div
        variants={staggerContainerSlow}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-[1280px] px-4 py-24 sm:py-32 lg:px-6 lg:py-40"
      >
        <motion.div variants={fadeInUp} className="max-w-2xl">
          <motion.h1
            variants={fadeInUp}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl"
          >
            Find Your Perfect{" "}
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-gradient-to-r from-[#f75d34] to-[#ff8c42] bg-clip-text text-transparent"
            >
              Used Car
            </motion.span>{" "}
            Today
          </motion.h1>

          <motion.form
            variants={fadeInUp}
            whileHover={{ scale: 1.01 }}
            onSubmit={handleSearch}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2"
          >
            <label className="flex-1">
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Search Swift, Creta, Harrier…"
                className="w-full rounded-lg border border-white/20 bg-white/95 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/30"
              />
            </label>
            <label className="flex-1">
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
              className="w-full rounded-lg bg-[#f75d34] px-8 py-3 text-sm font-semibold text-white sm:w-auto sm:py-2.5"
            >
              Search Cars
            </motion.button>
          </motion.form>

          <motion.div
            variants={staggerContainer}
            className="mt-4 flex flex-wrap items-center gap-2"
          >
            <span className="text-xs font-medium text-white/70">Popular:</span>
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
      </motion.div>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setActiveSlide(i)}
            className={`h-2 rounded-full transition-all ${
              i === activeSlide ? "w-6 bg-[#f75d34]" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </motion.section>
  );
}
