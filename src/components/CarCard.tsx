"use client";

import ListingImage from "@/components/ListingImage";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { CarListing } from "@/data/cars";
import { getCarDetailPath } from "@/lib/carDetail";
import { fadeInUp, viewportOnce } from "@/lib/motion";
import { isShortlisted, toggleShortlist } from "@/lib/shortlist";
import { HeartIcon } from "./icons";
import WhatsAppIcon from "./WhatsAppIcon";

type CarCardProps = {
  car: CarListing;
  index?: number;
};

export default function CarCard({ car, index = 0 }: CarCardProps) {
  const detailHref = getCarDetailPath(car.id);
  const whatsappHref = `https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I'm interested in ${car.title} on Old Car Bazar.`)}`;

  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSaved(isShortlisted(car.id));
    const onChange = () => setSaved(isShortlisted(car.id));
    window.addEventListener("ocb-shortlist-changed", onChange);
    return () => window.removeEventListener("ocb-shortlist-changed", onChange);
  }, [car.id]);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleShortlist(car.id);
    setSaved((prev) => !prev);
  };

  return (
    <motion.article
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6, boxShadow: "0 12px 24px rgba(0,0,0,0.12)" }}
      className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      <Link href={detailHref} className="block">
        <motion.div
          className="relative aspect-[4/3] bg-gray-100"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <ListingImage
            src={car.image}
            alt={car.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {car.badge && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white"
            >
              {car.badge}
            </motion.span>
          )}
        </motion.div>

        <div className="p-3">
          <h3 className="card-title line-clamp-1">{car.title}</h3>
          <p className="card-meta mt-1">{car.specs}</p>

          <motion.div className="mt-2 flex items-center justify-between">
            <p className="text-base font-bold text-gray-900">{car.price}</p>
            <button
              type="button"
              aria-pressed={saved}
              aria-label={saved ? "Remove from saved cars" : "Save this car"}
              onClick={handleSaveToggle}
              className={`flex items-center gap-1 text-caption transition ${
                saved
                  ? "text-[#f75d34]"
                  : "text-gray-500 hover:text-[#f75d34]"
              }`}
            >
              <HeartIcon
                className={`h-4 w-4 ${saved ? "fill-current" : ""}`}
              />
              {saved ? "Saved" : "Save"}
            </button>
          </motion.div>

          <p className="mt-2 text-caption">{car.location}</p>
        </div>
      </Link>

      <motion.div
        className="flex gap-2 px-3 pb-3"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ delay: 0.2 }}
      >
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1 rounded border border-green-600 py-2 text-xs font-semibold text-green-700 hover:bg-green-50"
        >
          <WhatsAppIcon size={16} aria-hidden />
          Chat
        </a>
        <Link
          href={detailHref}
          className="flex flex-[2] items-center justify-center rounded bg-[#f75d34] py-2 text-xs font-semibold text-white hover:bg-[#e54d24]"
        >
          View Details
        </Link>
      </motion.div>
    </motion.article>
  );
}
