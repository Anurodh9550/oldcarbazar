"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { profileMenuItems, type ProfileMenuItem } from "@/data/profileMenu";
import { ChevronDownIcon, UserIcon } from "./icons";

function MenuIcon({ type }: { type: ProfileMenuItem["icon"] }) {
  const className = "h-4 w-4 shrink-0 text-gray-500";
  switch (type) {
    case "orders":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M4 7h16v12H4zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" />
        </svg>
      );
    case "heart":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M12 21s-7-4.35-9.33-8.1C.5 9.5 2.5 5 6.5 5c2.1 0 3.4 1.2 4.5 2.5C12.1 6.2 13.4 5 15.5 5 19.5 5 21.5 9.5 21.33 12.9 19 16.65 12 21 12 21z" />
        </svg>
      );
    case "activity":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" strokeLinecap="round" />
        </svg>
      );
    case "car":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M4 16l1-4h14l1 4M6 16v2M18 16v2M7 12h10" strokeLinecap="round" />
          <circle cx="7" cy="18" r="1.5" fill="currentColor" />
          <circle cx="17" cy="18" r="1.5" fill="currentColor" />
        </svg>
      );
    case "garage":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M3 10h18v10H3zM5 10V7l7-4 7 4v3" strokeLinejoin="round" />
        </svg>
      );
    case "consent":
    case "settings":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const firstName = user?.name.split(" ")[0] ?? "User";

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1.5 rounded-full border px-2 py-1.5 text-sm font-medium transition sm:px-3 ${
          open
            ? "border-[#f75d34] bg-orange-50 text-[#f75d34]"
            : "border-gray-200 text-gray-800 hover:border-[#f75d34] hover:text-[#f75d34]"
        }`}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f75d34]/10 text-[#f75d34]">
          <UserIcon className="h-4 w-4" />
        </span>
        <span className="hidden max-w-[120px] truncate sm:inline">
          Hello, {firstName}
        </span>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-[90] mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl sm:w-60"
          >
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user?.name}
              </p>
              <p className="truncate text-caption">{user?.email}</p>
              <p className="text-caption">+91 {user?.phone}</p>
            </div>

            <ul className="py-1">
              {profileMenuItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-[#f75d34]"
                  >
                    <MenuIcon type={item.icon} />
                    {item.label}
                  </Link>
                  {item.dividerAfter && (
                    <hr className="my-1 border-gray-100" />
                  )}
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 pt-1">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
