"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fadeInDown } from "@/lib/motion";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import type { MenuLink } from "@/data/navMenus";
import {
  getBuyCarsMenu,
  helpMenu,
  loanToolsMenu,
  sellCarMenu,
} from "@/data/navMenus";
import AuthModal from "./AuthModal";
import LocationModal from "./LocationModal";
import NavMegaMenu from "./NavMegaMenu";
import ProfileDropdown from "./ProfileDropdown";
import {
  ChevronDownIcon,
  HeartIcon,
  PinIcon,
  SearchIcon,
  UserIcon,
} from "./icons";

type OpenMenu = "buy-cars" | "sell-car" | "loan-tools" | "help" | null;

const navItems: { id: OpenMenu; label: string }[] = [
  { id: "buy-cars", label: "BUY USED CARS" },
  { id: "sell-car", label: "SELL CAR" },
  { id: "loan-tools", label: "LOAN & TOOLS" },
  { id: "help", label: "HELP" },
];

export default function Header() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { selectedCity } = useLocation();
  const { isLoggedIn } = useAuth();

  const submitSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      router.push("/used-cars/search");
      return;
    }
    router.push(`/used-cars/search?q=${encodeURIComponent(q)}`);
  };

  const buyCarsMenu = useMemo(
    () => getBuyCarsMenu(selectedCity),
    [selectedCity]
  );

  const openMenuNow = (menu: OpenMenu) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpenMenu(menu);
  };

  const closeMenuDelayed = () => {
    closeTimerRef.current = setTimeout(() => setOpenMenu(null), 200);
  };

  const closeMenuNow = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpenMenu(null);
  };

  const toggleMenu = (menu: OpenMenu) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const handleMenuItemClick = (item: MenuLink) => {
    if (item.href === "#cities") {
      setLocationOpen(true);
    } else if (item.href === "#listings") {
      document.querySelector("#listings")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getMenuColumns = (menu: OpenMenu) => {
    switch (menu) {
      case "buy-cars":
        return buyCarsMenu;
      case "sell-car":
        return sellCarMenu;
      case "loan-tools":
        return loanToolsMenu;
      case "help":
        return helpMenu;
      default:
        return [];
    }
  };

  const navButtonClass = (active: boolean) =>
    `flex items-center gap-0.5 whitespace-nowrap rounded-md px-3 py-3 text-xs font-semibold tracking-wide sm:px-4 sm:text-[13px] ${
      active
        ? "bg-orange-50 text-[#f75d34]"
        : "text-gray-800 hover:bg-gray-50 hover:text-[#f75d34]"
    }`;

  return (
    <>
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeInDown}
        className="sticky top-0 z-[70] border-b border-gray-200 bg-white shadow-sm"
      >
        {/* Top bar */}
        <motion.div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-3 lg:gap-4 lg:px-6">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/" className="flex shrink-0 items-center">
              <Image
                src="/logocarr.png"
                alt="Old Car Bazar"
                width={220}
                height={60}
                className="h-12 w-auto object-contain sm:h-14"
                priority
              />
            </Link>
          </motion.div>

          {/* Search */}
          <motion.form
            className="hidden flex-1 md:flex"
            onSubmit={submitSearch}
            role="search"
          >
            <label className="flex w-full max-w-2xl items-center gap-2 overflow-hidden rounded-full border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:border-[#f75d34] focus-within:ring-2 focus-within:ring-[#f75d34]/20">
              <button
                type="submit"
                aria-label="Search cars"
                className="text-gray-400 hover:text-[#f75d34]"
              >
                <SearchIcon className="h-4 w-4 shrink-0" />
              </button>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search used cars — Swift, Creta, Maruti..."
                className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </label>
          </motion.form>

          {/* Right actions */}
          <motion.div className="ml-auto flex items-center gap-2 sm:gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setLocationOpen(true)}
              className="hidden items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-[#f75d34] hover:text-[#f75d34] sm:flex"
            >
              <PinIcon className="h-4 w-4 text-[#f75d34]" />
              {selectedCity}
              <ChevronDownIcon className="h-3 w-3" />
            </motion.button>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/sell-car"
                className="hidden rounded-full bg-[#f75d34] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e54d24] sm:inline-block"
              >
                Sell Car
              </Link>
            </motion.div>

            <motion.button
              type="button"
              aria-label="Saved cars"
              whileHover={{ scale: 1.1, color: "#f75d34" }}
              onClick={() => router.push("/shortlisted")}
              className="hidden text-gray-600 sm:block"
            >
              <HeartIcon className="h-5 w-5" />
            </motion.button>

            {isLoggedIn ? (
              <ProfileDropdown />
            ) : (
              <motion.button
                type="button"
                whileHover={{ x: 2, color: "#f75d34" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setAuthOpen(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-800"
              >
                <UserIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Login</span>
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        {/* Mobile search + sell */}
        <motion.div className="flex items-center gap-2 border-t border-gray-100 px-4 pb-3 md:hidden">
          <form
            className="flex flex-1 overflow-hidden rounded-full border border-gray-300"
            onSubmit={submitSearch}
            role="search"
          >
            <button
              type="submit"
              aria-label="Search cars"
              className="pl-3 text-gray-400 hover:text-[#f75d34]"
            >
              <SearchIcon className="h-4 w-4 self-center" />
            </button>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search used cars..."
              className="flex-1 px-2 py-2 text-sm outline-none"
            />
          </form>
          <Link
            href="/sell-car"
            className="shrink-0 rounded-full bg-[#f75d34] px-3 py-2 text-xs font-semibold text-white"
          >
            Sell
          </Link>
        </motion.div>

        {/* Bottom nav */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative border-t border-gray-100 bg-white"
          onMouseLeave={closeMenuDelayed}
        >
          <motion.div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 lg:px-6">
            <ul className="flex items-center overflow-visible">
              <motion.li
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
              >
                <Link
                  href="/"
                  className="rounded-md px-2.5 py-3 text-xs font-semibold tracking-wide text-gray-800 hover:bg-orange-50 hover:text-[#f75d34] sm:px-4 sm:text-[13px]"
                >
                  Home
                </Link>
              </motion.li>
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => item.id && openMenuNow(item.id)}
                    onClick={() => item.id && toggleMenu(item.id)}
                    aria-expanded={openMenu === item.id}
                    aria-haspopup="true"
                    className={navButtonClass(openMenu === item.id)}
                  >
                    {item.label}
                    <ChevronDownIcon
                      className={`h-3 w-3 transition-transform duration-200 ${
                        openMenu === item.id
                          ? "rotate-180 text-[#f75d34]"
                          : "text-gray-500"
                      }`}
                    />
                  </button>
                </motion.li>
              ))}
            </ul>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05, color: "#f75d34" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLocationOpen(true)}
              className="flex shrink-0 items-center gap-1 py-3 text-sm font-medium text-gray-800 md:hidden"
            >
              <PinIcon className="h-4 w-4 text-[#f75d34]" />
              {selectedCity}
            </motion.button>
          </motion.div>

          <div
            onMouseEnter={() => {
              if (openMenu) openMenuNow(openMenu);
            }}
          >
            {navItems.map((item) => (
              <NavMegaMenu
                key={item.id}
                isOpen={openMenu === item.id}
                onClose={closeMenuNow}
                columns={getMenuColumns(item.id)}
                onItemClick={handleMenuItemClick}
              />
            ))}
          </div>
        </motion.nav>
      </motion.header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <LocationModal
        isOpen={locationOpen}
        onClose={() => setLocationOpen(false)}
        mode="all-india"
        subtitle="Apni city search karein — pure India ke liye"
      />
    </>
  );
}
