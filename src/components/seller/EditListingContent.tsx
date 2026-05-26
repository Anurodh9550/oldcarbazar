"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import SellCarForm from "@/components/SellCarForm";
import { useAuth } from "@/context/AuthContext";
import { useListings } from "@/context/ListingsContext";
import { initialSellForm, type SellCarFormData } from "@/data/sellCarForm";
import type { UserCarListing } from "@/types/listing";

type EditListingContentProps = {
  listingId: string;
};

/** Convert a stored `UserCarListing` back into the shape the multi-step
 * `SellCarForm` understands. Any missing raw field falls back to an empty
 * string so the form starts clean rather than throwing. */
function listingToFormData(
  listing: UserCarListing,
  fallbackContact: { sellerName: string; phone: string; email: string }
): SellCarFormData {
  return {
    ...initialSellForm,
    brand: listing.brand ?? "",
    model: listing.model ?? "",
    year: listing.year ? String(listing.year) : "",
    variant: listing.variant ?? "",
    bodyType: listing.bodyType ?? "",
    color: listing.color ?? "",
    fuel: listing.fuel ?? "",
    transmission: listing.transmission ?? "",
    kms: listing.kms ? String(listing.kms) : "",
    owners: listing.owners ?? initialSellForm.owners,
    seats: listing.seats ? String(listing.seats) : initialSellForm.seats,
    registrationMonth:
      listing.registrationMonth || initialSellForm.registrationMonth,
    engineCc: listing.engineCc ?? "",
    mileage: listing.mileage ?? "",
    insurance: listing.insurance ?? "",
    price: listing.priceLakh ?? "",
    city: listing.city ?? listing.location ?? "",
    area: listing.area ?? "",
    regNumber: listing.regNumber ?? "",
    description: listing.description ?? "",
    features: listing.features ?? [],
    sellerName: listing.sellerName || fallbackContact.sellerName,
    phone: listing.phone || fallbackContact.phone,
    email: listing.email ?? fallbackContact.email,
    whatsapp: listing.whatsapp ?? true,
  };
}

export default function EditListingContent({
  listingId,
}: EditListingContentProps) {
  const { user } = useAuth();
  const { userListings, loading, error } = useListings();

  const listing = useMemo(
    () => userListings.find((item) => item.id === listingId),
    [userListings, listingId]
  );

  if (loading && !listing) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-sm text-gray-500">
        Loading listing…
      </div>
    );
  }

  if (!listing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-dashed border-red-200 bg-red-50/40 py-16 text-center"
      >
        <span className="text-5xl">🔎</span>
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Listing not found
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
          {error ||
            "We couldn't find this ad in your account. It may have been deleted, or it belongs to another user."}
        </p>
        <Link
          href="/my-listings"
          className="mt-6 inline-flex rounded-full bg-[#f75d34] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#e54d24]"
        >
          Back to My Listings
        </Link>
      </motion.div>
    );
  }

  const initialData = listingToFormData(listing, {
    sellerName: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
  });

  const initialPhotos =
    listing.images && listing.images.length > 0
      ? listing.images
      : listing.image
        ? [listing.image]
        : [];

  return (
    <>
      <div className="mb-6 flex flex-col gap-2 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-caption">Editing listing</p>
          <h2 className="text-lg font-bold text-gray-900">{listing.title}</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {listing.price} • {listing.location}
          </p>
        </div>
        <Link
          href="/my-listings"
          className="self-start rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:border-[#f75d34] hover:text-[#f75d34] sm:self-auto"
        >
          ← Back to listings
        </Link>
      </div>
      <SellCarForm
        mode="edit"
        listingId={listing.id}
        embedded
        initialData={initialData}
        initialPhotos={initialPhotos}
        defaultContact={{
          sellerName: user?.name ?? "",
          phone: user?.phone ?? "",
          email: user?.email ?? "",
        }}
        successRedirect="/my-listings"
      />
    </>
  );
}
