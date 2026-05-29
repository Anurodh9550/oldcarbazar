"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type MobileFiltersDrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Optional CTA label shown at the bottom of the drawer. */
  ctaLabel?: string;
  children: React.ReactNode;
};

/**
 * Slide-in drawer used to host filter sidebars on small screens. Hidden by
 * default on `lg` and above — pages render the sidebar inline at that size.
 */
export default function MobileFiltersDrawer({
  open,
  onClose,
  title = "Filters",
  ctaLabel = "Show Results",
  children,
}: MobileFiltersDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="filter-drawer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[120] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <button
            type="button"
            aria-label="Close filters"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/50"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative flex h-full w-[88vw] max-w-[360px] flex-col bg-[#f5f5f5] shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
              <h2 className="text-sm font-bold text-gray-900">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4">{children}</div>

            <footer className="border-t border-gray-200 bg-white px-4 py-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-[#f75d34] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#e54d24]"
              >
                {ctaLabel}
              </button>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
