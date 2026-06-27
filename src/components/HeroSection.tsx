"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "@/context/LocationContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  fadeIn,
  fadeInUp,
  staggerContainer,
  staggerContainerSlow,
} from "@/lib/motion";

const heroFieldClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-none outline-none transition placeholder:text-gray-400 focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/15 focus:shadow-none";

const heroImages = ["/hero-cars.png", "/hero-cars-2.png", "/hero-cars-3.png"];

export default function HeroSection() {
  const router = useRouter();
  const { selectedCity } = useLocation();
  const { copy } = useLanguage();
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
        className="relative mx-auto max-w-[1280px] px-4 py-12 sm:py-16 lg:px-6 lg:py-20"
      >
        <motion.div variants={fadeInUp} className="max-w-2xl">
          <p className="eyebrow-dark mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white/90 backdrop-blur-sm">
            {copy.hero.eyebrow}
          </p>
          <motion.h1
            variants={fadeInUp}
            className="hero-title"
          >
            {copy.hero.titleBefore}{" "}
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-gradient-to-r from-[#ff8c42] to-[#f75d34] bg-clip-text text-transparent"
            >
              {copy.hero.titleHighlight}
            </motion.span>{" "}
            {copy.hero.titleAfter}
          </motion.h1>

          <div className="mt-5 md:hidden">
            <Link
              href="/used-cars/search"
              className="inline-flex rounded-xl bg-[#f75d34] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e54d24]"
            >
              {copy.hero.browseCars}
            </Link>
          </div>

          <motion.form
            variants={fadeInUp}
            onSubmit={handleSearch}
            className="mt-6 hidden md:block"
          >
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <label className="flex-1">
              <span className="sr-only">{copy.hero.searchCarsSr}</span>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder={copy.hero.searchPlaceholder}
                className={heroFieldClass}
              />
            </label>
            <label className="flex-1">
              <span className="sr-only">{copy.hero.budgetSr}</span>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className={heroFieldClass}
              >
                {copy.budgetOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#f75d34] px-8 py-3.5 text-sm font-bold text-white shadow-none transition hover:bg-[#e54d24] lg:w-auto"
            >
              {copy.hero.searchCars}
            </button>
            </div>
          </motion.form>

          <motion.div
            variants={staggerContainer}
            className="mt-4 hidden flex-wrap items-center gap-2 md:mt-5 md:flex"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
              {copy.hero.popular}
            </span>
            {copy.quickLinks.map((car) => (
              <motion.div key={car.label} variants={fadeInUp}>
                <Link
                  href={`/used-cars/search?${car.query}`}
                  className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:border-[#f75d34] hover:bg-[#f75d34]/25"
                >
                  {car.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-4">
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
