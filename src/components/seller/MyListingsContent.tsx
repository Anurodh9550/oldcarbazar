"use client";

import ListingImage from "@/components/ListingImage";
import Link from "next/link";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSellerIdFromUser, useListings } from "@/context/ListingsContext";
import type { ListingStatus } from "@/types/listing";

const statusStyles: Record<ListingStatus, string> = {
  active: "bg-green-100 text-green-700 ring-1 ring-green-200",
  sold: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
  draft: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
};

export default function MyListingsContent() {
  const { user } = useAuth();
  const { getMyListings, removeListing, updateListingStatus } = useListings();

  const sellerId = user ? getSellerIdFromUser(user) : "";
  const listings = useMemo(
    () => getMyListings(sellerId).sort((a, b) => b.createdAt - a.createdAt),
    [getMyListings, sellerId]
  );

  const activeCount = listings.filter((l) => l.status === "active").length;
  const soldCount = listings.filter((l) => l.status === "sold").length;

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Ads", value: listings.length, color: "text-[#f75d34]" },
          { label: "Active", value: activeCount, color: "text-green-600" },
          { label: "Sold", value: soldCount, color: "text-gray-600" },
          {
            label: "Total Views",
            value: listings.reduce((s, l) => s + l.views, 0),
            color: "text-blue-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-caption">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body-muted">
          Showing <span className="font-semibold text-gray-900">{listings.length}</span>{" "}
          listings
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/sell-car"
            className="rounded-lg bg-[#f75d34] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#e54d24]"
          >
            + Post New Ad
          </Link>
          <Link
            href="/seller"
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#f75d34] hover:text-[#f75d34]"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center">
          <span className="text-6xl">🚗</span>
          <h2 className="mt-4 text-xl font-bold text-gray-900">No listings yet</h2>
          <p className="mx-auto mt-2 max-w-md text-body-muted">
            Apni pehli car free mein list karo — sirf 2 minute mein ad live ho jayegi.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/sell-car"
              className="rounded-full bg-[#f75d34] px-8 py-3 text-sm font-semibold text-white hover:bg-[#e54d24]"
            >
              Sell Car Free
            </Link>
            <Link
              href="/post-ad"
              className="rounded-full border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-700 hover:border-[#f75d34]"
            >
              Post Ad in 2 Min
            </Link>
          </div>
        </div>
      ) : (
        <ul className="grid gap-5 lg:grid-cols-2">
          {listings.map((car) => (
            <li
              key={car.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-52 w-full shrink-0 bg-gray-100 sm:h-auto sm:w-56">
                  <ListingImage
                    src={car.image}
                    alt={car.title}
                    fill
                    className="object-cover"
                    sizes="224px"
                  />
                  {(car.images?.length ?? 0) > 1 && (
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
                      📷 {car.images!.length}
                    </span>
                  )}
                  <span
                    className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyles[car.status]}`}
                  >
                    {car.status}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{car.title}</h3>
                    <p className="mt-1 text-caption sm:text-sm">{car.specs}</p>
                    <p className="mt-3 text-xl font-bold text-[#f75d34]">{car.price}</p>
                    <p className="mt-2 text-caption">
                      📍 {car.location} •{" "}
                      {new Date(car.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <div className="mt-3 flex gap-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                      <span>👁 <strong>{car.views}</strong> views</span>
                      <span className="inline-flex items-center gap-1">
                        <WhatsAppIcon size={14} />
                        <strong>{car.inquiries}</strong> inquiries
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                    {car.status === "active" && (
                      <button
                        type="button"
                        onClick={() => updateListingStatus(car.id, "sold")}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                      >
                        Mark as Sold
                      </button>
                    )}
                    {car.status === "sold" && (
                      <button
                        type="button"
                        onClick={() => updateListingStatus(car.id, "active")}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Relist
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Delete this listing permanently?"))
                          removeListing(car.id);
                      }}
                      className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
