"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { cities, type CityName } from "@/data/locations";
import { uniqueIndianCities, type IndianCity } from "@/data/indianCities";
import { useLocation } from "@/context/LocationContext";
import { scaleIn, staggerContainer, fadeInUp } from "@/lib/motion";
import { PinIcon, SearchIcon } from "./icons";

type LocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Override what happens on city select. If omitted, updates global selected city. */
  onSelect?: (city: string) => void;
  /** Override currently-selected highlight. Defaults to global selected city. */
  currentValue?: string;
  title?: string;
  subtitle?: string;
  /**
   * "popular" — show only popular cities with car counts (default)
   * "all-india" — search across full Indian cities database + custom entry fallback
   */
  mode?: "popular" | "all-india";
};

type DetectStatus = "idle" | "loading" | "error";

export default function LocationModal({
  isOpen,
  onClose,
  onSelect,
  currentValue,
  title = "Select Your City",
  subtitle = "Search or pick a city to see available used cars",
  mode = "popular",
}: LocationModalProps) {
  const { selectedCity, setSelectedCity } = useLocation();
  const activeValue = currentValue ?? selectedCity;
  const [search, setSearch] = useState("");
  const [detect, setDetect] = useState<DetectStatus>("idle");
  const [detectMsg, setDetectMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setDetect("idle");
      setDetectMsg("");
    }
  }, [isOpen]);

  const filteredCities = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q)
    );
  }, [search]);

  const popularCities = useMemo(
    () => filteredCities.filter((c) => c.popular),
    [filteredCities]
  );
  const otherCities = useMemo(
    () => filteredCities.filter((c) => !c.popular),
    [filteredCities]
  );

  const handleSelect = (cityName: string) => {
    if (onSelect) {
      onSelect(cityName);
    } else {
      setSelectedCity(cityName as CityName);
    }
    onClose();
  };

  const detectLocation = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setDetect("error");
      setDetectMsg("Geolocation not supported in this browser.");
      return;
    }
    setDetect("loading");
    setDetectMsg("Detecting…");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            { headers: { Accept: "application/json" } }
          );
          if (!res.ok) throw new Error("reverse-geocode failed");
          const data = (await res.json()) as {
            address?: {
              city?: string;
              town?: string;
              village?: string;
              state_district?: string;
              county?: string;
              state?: string;
            };
          };
          const detected =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.state_district ||
            data.address?.county ||
            "";

          const match = cities.find(
            (c) =>
              detected &&
              (c.name.toLowerCase() === detected.toLowerCase() ||
                detected.toLowerCase().includes(c.name.toLowerCase()))
          );

          if (match) {
            handleSelect(match.name);
            setDetect("idle");
          } else if (mode === "all-india" && detected) {
            handleSelect(detected);
            setDetect("idle");
          } else {
            setSearch(detected || "");
            setDetect("error");
            setDetectMsg(
              detected
                ? `${detected} not available — search nearby city.`
                : "Could not match your area to a listed city."
            );
          }
        } catch {
          setDetect("error");
          setDetectMsg("Could not detect your city. Try searching manually.");
        }
      },
      () => {
        setDetect("error");
        setDetectMsg("Location permission denied. Search city manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const renderCity = (city: (typeof cities)[number]) => {
    const isSelected = activeValue === city.name;
    return (
      <motion.li key={city.name} variants={fadeInUp}>
        <motion.button
          type="button"
          onClick={() => handleSelect(city.name)}
          whileHover={{ scale: 1.01, x: 4 }}
          whileTap={{ scale: 0.98 }}
          className={`mb-2 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
            isSelected
              ? "border-[#f75d34] bg-orange-50"
              : "border-gray-200 bg-white hover:border-[#f75d34]/50 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                isSelected
                  ? "bg-[#f75d34] text-white"
                  : "bg-gray-100 text-[#f75d34]"
              }`}
            >
              <PinIcon className="h-4 w-4" />
            </span>
            <div>
              <p className="font-semibold text-gray-900">{city.name}</p>
              <p className="text-caption">{city.state}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-[#f75d34]">{city.carCount}+</p>
            <p className="text-[10px] text-gray-400">cars</p>
          </div>
        </motion.button>
      </motion.li>
    );
  };

  const renderIndianCity = (city: IndianCity, idx: number) => {
    const isSelected = activeValue === city.name;
    return (
      <motion.li key={`${city.name}-${city.state}-${idx}`} variants={fadeInUp}>
        <motion.button
          type="button"
          onClick={() => handleSelect(city.name)}
          whileHover={{ scale: 1.01, x: 4 }}
          whileTap={{ scale: 0.98 }}
          className={`mb-2 flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
            isSelected
              ? "border-[#f75d34] bg-orange-50"
              : "border-gray-200 bg-white hover:border-[#f75d34]/50 hover:bg-gray-50"
          }`}
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              isSelected
                ? "bg-[#f75d34] text-white"
                : "bg-gray-100 text-[#f75d34]"
            }`}
          >
            <PinIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-gray-900">{city.name}</p>
            <p className="text-caption">{city.state}</p>
          </div>
        </motion.button>
      </motion.li>
    );
  };

  const allIndiaMatches = useMemo(() => {
    if (mode !== "all-india") return [];
    const q = search.trim().toLowerCase();
    if (!q) return [];
    const popularNames = new Set(cities.map((c) => c.name.toLowerCase()));
    return uniqueIndianCities
      .filter(
        (c) =>
          !popularNames.has(c.name.toLowerCase()) &&
          (c.name.toLowerCase().includes(q) ||
            c.state.toLowerCase().includes(q))
      )
      .slice(0, 80);
  }, [search, mode]);

  const trimmedQuery = search.trim();
  const showCustomEntry =
    mode === "all-india" &&
    trimmedQuery.length >= 2 &&
    filteredCities.length === 0 &&
    allIndiaMatches.length === 0;
  const noResultsAtAll =
    filteredCities.length === 0 &&
    (mode !== "all-india" || allIndiaMatches.length === 0) &&
    !showCustomEntry;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <motion.button
            type="button"
            aria-label="Close overlay"
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-modal-title"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="border-b border-gray-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 id="location-modal-title" className="section-title">
                    {title}
                  </h2>
                  <p className="mt-0.5 text-caption sm:text-sm">{subtitle}</p>
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                  aria-label="Close"
                >
                  ✕
                </motion.button>
              </div>

              <div className="relative mt-4">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search city or state..."
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
                />
              </div>

              <button
                type="button"
                onClick={detectLocation}
                disabled={detect === "loading"}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#f75d34]/30 bg-[#f75d34]/5 px-4 py-2 text-sm font-semibold text-[#f75d34] transition hover:bg-[#f75d34]/10 disabled:opacity-60"
              >
                <PinIcon className="h-4 w-4" />
                {detect === "loading"
                  ? "Detecting your location…"
                  : "Detect my current location"}
              </button>
              {detect === "error" && detectMsg && (
                <p className="mt-2 rounded-lg bg-red-50 px-3 py-1.5 text-caption text-red-600">
                  {detectMsg}
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {noResultsAtAll && (
                <p className="py-8 text-center text-caption sm:text-sm">
                  No city found for &quot;{search}&quot;
                </p>
              )}

              {popularCities.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    Popular Cities
                  </p>
                  <motion.ul
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {popularCities.map(renderCity)}
                  </motion.ul>
                </div>
              )}

              {otherCities.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    Other Cities
                  </p>
                  <motion.ul
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {otherCities.map(renderCity)}
                  </motion.ul>
                </div>
              )}

              {allIndiaMatches.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    All India ({allIndiaMatches.length}
                    {allIndiaMatches.length === 80 ? "+" : ""})
                  </p>
                  <motion.ul
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {allIndiaMatches.map(renderIndianCity)}
                  </motion.ul>
                </div>
              )}

              {showCustomEntry && (
                <div className="rounded-xl border border-dashed border-[#f75d34]/40 bg-[#f75d34]/5 p-4 text-center">
                  <p className="text-sm text-gray-700">
                    &quot;{trimmedQuery}&quot; isn't in our list yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelect(trimmedQuery)}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#f75d34] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e54d24]"
                  >
                    <PinIcon className="h-4 w-4" />
                    Use &quot;{trimmedQuery}&quot; as my city
                  </button>
                </div>
              )}
            </div>

            {!onSelect && (
              <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 text-center text-caption">
                Currently viewing cars in{" "}
                <span className="font-semibold text-[#f75d34]">
                  {selectedCity}
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
