"use client";

import ListingImage from "@/components/ListingImage";
import ProfileEmptyState from "@/components/profile-hub/ProfileEmptyState";
import { useAuth } from "@/context/AuthContext";
import { getSellerIdFromUser, useListings } from "@/context/ListingsContext";
import Link from "next/link";
import { useMemo } from "react";

export default function MyVehiclesContent() {
  const { user } = useAuth();
  const { getMyListings } = useListings();
  const sellerId = user ? getSellerIdFromUser(user) : "";
  const listings = useMemo(
    () => getMyListings(sellerId).sort((a, b) => b.createdAt - a.createdAt),
    [getMyListings, sellerId]
  );

  if (listings.length === 0) {
    return (
      <ProfileEmptyState
        icon="🚗"
        title="No vehicles listed"
        description="Want to sell your car? Post a free ad — buyers will contact you directly."
        actionLabel="Sell your car"
        actionHref="/sell-car"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <p className="text-body-muted">
          <span className="font-semibold text-gray-900">{listings.length}</span> vehicle
          {listings.length !== 1 ? "s" : ""} posted
        </p>
        <Link
          href="/my-listings"
          className="text-sm font-semibold text-[#f75d34] hover:underline"
        >
          Manage in Seller Hub →
        </Link>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {listings.map((listing) => (
          <li
            key={listing.id}
            className="flex gap-4 rounded-xl border border-gray-200 p-4"
          >
            <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <ListingImage
                src={listing.image}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-gray-900">{listing.title}</h3>
              <p className="text-sm font-bold text-[#f75d34]">{listing.price}</p>
              <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize text-gray-600">
                {listing.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
