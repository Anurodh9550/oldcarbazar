"use client";

import ListingImage from "@/components/ListingImage";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CarDetail } from "@/lib/carDetail";
import { getCarDetailPath } from "@/lib/carDetail";
import type { EnrichedCar } from "@/lib/carMeta";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { HeartIcon } from "@/components/icons";
import {
  getShortlistedIds,
  toggleShortlist,
} from "@/lib/shortlist";

type SellerDetailsModalProps = {
  detail: CarDetail;
  recommended: EnrichedCar[];
  whatsappHref: string;
  onClose: () => void;
};

function shortTitle(title: string) {
  const parts = title.split(" ");
  if (parts.length >= 3) return `${parts[1]} ${parts.slice(2, 4).join(" ")}`;
  return title;
}

export default function SellerDetailsModal({
  detail,
  recommended,
  whatsappHref,
  onClose,
}: SellerDetailsModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const specLine = `${detail.kms.toLocaleString("en-IN")} km • ${detail.fuel} • ${detail.transmission} • ${detail.ownership}`;

  const allIds = useMemo(() => recommended.map((c) => c.id), [recommended]);
  const allSelected = recommended.length > 0 && selected.size === recommended.length;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setSavedIds(new Set(getShortlistedIds()));
    const refresh = () => setSavedIds(new Set(getShortlistedIds()));
    window.addEventListener("ocb-shortlist-changed", refresh);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("ocb-shortlist-changed", refresh);
    };
  }, []);

  const toggleRecommendedSave = (id: string) => {
    toggleShortlist(id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleReportAd = () => {
    const subject = encodeURIComponent(`Report listing — ${detail.title}`);
    const body = encodeURIComponent(
      `Hi Old Car Bazar team,\n\nI'd like to report a problem with this listing:\n${
        typeof window !== "undefined" ? window.location.href : ""
      }\n\nReason:\n\n— Sent from Old Car Bazar`
    );
    window.location.href = `mailto:support@oldcarbazar.com?subject=${subject}&body=${body}`;
  };

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal
      aria-labelledby="seller-details-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 id="seller-details-title" className="text-lg font-bold text-gray-900">
            Seller Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Car summary */}
          <div className="flex gap-3 border-b border-gray-100 px-5 py-4">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <ListingImage
                src={detail.image}
                alt={detail.title}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-gray-900">{shortTitle(detail.title)}</h3>
                <button
                  type="button"
                  onClick={() => toggleRecommendedSave(detail.id)}
                  aria-label={
                    savedIds.has(detail.id) ? "Remove from saved" : "Save"
                  }
                  aria-pressed={savedIds.has(detail.id)}
                  className={
                    savedIds.has(detail.id)
                      ? "text-[#f75d34]"
                      : "text-gray-400 hover:text-[#f75d34]"
                  }
                >
                  <HeartIcon
                    className={`h-5 w-5 ${
                      savedIds.has(detail.id) ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>
              <p className="text-caption mt-0.5">{specLine}</p>
              <p className="mt-2 text-xl font-bold text-gray-900">{detail.price}</p>
            </div>
          </div>

          {/* Thank you banner */}
          <div className="mx-5 mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs text-white">
              ✓
            </span>
            <p className="text-sm font-medium text-green-800">
              Thank you. Contact seller for a quick response.
            </p>
          </div>

          {/* Seller info */}
          <div className="px-5 py-5">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-[#f75d34]" aria-hidden>
                📍
              </span>
              <div>
                <p className="font-bold text-gray-900">{detail.sellerName}</p>
                <p className="text-caption mt-1 leading-relaxed">
                  {detail.sellerAddress} | {detail.distanceKm}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-gray-800">
              <span aria-hidden>📞</span>
              <a href={`tel:${detail.sellerPhone}`} className="font-semibold hover:text-[#f75d34]">
                {detail.sellerPhone}
              </a>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              <WhatsAppIcon size={22} />
              Whatsapp
            </a>
          </div>

          {/* Report */}
          <div className="border-y border-gray-100 bg-gray-50 px-5 py-3 text-center text-sm text-gray-600">
            Have issues with this listing?{" "}
            <button
              type="button"
              onClick={handleReportAd}
              className="font-semibold text-gray-900 underline hover:text-[#f75d34]"
            >
              Report Ad
            </button>
          </div>

          {/* Recommended */}
          {recommended.length > 0 && (
            <div className="px-5 py-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Recommended Cars</h3>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 accent-[#2563eb]"
                  />
                  Select All
                </label>
              </div>
              <ul className="mt-4 space-y-3">
                {recommended.slice(0, 4).map((car) => (
                  <li
                    key={car.id}
                    className="flex gap-3 rounded-xl border border-gray-100 p-2 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(car.id)}
                      onChange={() => toggleOne(car.id)}
                      className="mt-4 h-4 w-4 shrink-0 accent-[#2563eb]"
                    />
                    <Link
                      href={getCarDetailPath(car.id)}
                      onClick={onClose}
                      className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100"
                    >
                      <ListingImage src={car.image} alt={car.title} fill className="object-cover" sizes="80px" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={getCarDetailPath(car.id)}
                        onClick={onClose}
                        className="line-clamp-1 text-sm font-semibold text-gray-900 hover:text-[#f75d34]"
                      >
                        {car.title}
                      </Link>
                      <p className="text-caption mt-0.5">{car.specs}</p>
                      <p className="mt-1 text-sm font-bold text-gray-900">{car.price}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={
                        savedIds.has(car.id) ? "Remove from saved" : "Save"
                      }
                      aria-pressed={savedIds.has(car.id)}
                      onClick={() => toggleRecommendedSave(car.id)}
                      className={`shrink-0 transition ${
                        savedIds.has(car.id)
                          ? "text-[#f75d34]"
                          : "text-gray-300 hover:text-[#f75d34]"
                      }`}
                    >
                      <HeartIcon
                        className={`h-4 w-4 ${
                          savedIds.has(car.id) ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-gray-100 p-4">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-btn flex w-full items-center justify-center rounded-xl bg-[#f75d34] py-4 text-base font-bold uppercase tracking-wide text-white hover:bg-[#e54d24]"
          >
            Interested
          </a>
        </div>
      </div>
    </div>
  );
}
