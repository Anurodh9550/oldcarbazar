"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { MenuColumn, MenuLink } from "@/data/navMenus";
import { ChevronDownIcon } from "./icons";

type NavMegaMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  columns: MenuColumn[];
  onItemClick?: (item: MenuLink) => void;
};

export default function NavMegaMenu({
  isOpen,
  onClose,
  columns,
  onItemClick,
}: NavMegaMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute left-0 right-0 top-full z-[80] border-t-2 border-[#f75d34]/30 bg-white shadow-2xl"
        >
          <div className="mx-auto max-w-[1280px] px-6 py-6 lg:px-8">
            <motion.div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
              {columns.map((column) => (
                <div key={column.title}>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#f75d34]">
                    {column.title}
                  </p>
                  <ul className="space-y-0.5">
                    {column.links.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          onClick={(e) => {
                            if (
                              onItemClick &&
                              (item.href === "#cities" ||
                                item.href === "#listings")
                            ) {
                              e.preventDefault();
                              onItemClick(item);
                            }
                            onClose();
                          }}
                          className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-[#f75d34]"
                        >
                          <span>{item.label}</span>
                          {item.hasSubmenu && (
                            <ChevronDownIcon className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#f75d34]" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
