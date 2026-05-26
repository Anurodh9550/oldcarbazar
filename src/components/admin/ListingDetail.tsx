"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { useListings } from "@/context/ListingsContext";
import { carListings, type CarListing } from "@/data/cars";
import ListingImage from "@/components/ListingImage";
import { isUserListing, type ListingModeration } from "@/types/listing";
import {
  CheckIcon,
  EyeIcon,
  FlagIcon,
  InquiriesIcon,
  StarIcon,
  TrashIcon,
  XIcon,
} from "./icons";

const moderationCls: Record<ListingModeration, string> = {
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  blocked: "bg-slate-100 text-slate-700 ring-slate-200",
};

function stableViewsFromId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) % 250;
  return 50 + h;
}

export default function ListingDetail({ listingId }: { listingId: string }) {
  const router = useRouter();
  const {
    userListings,
    setListingModeration,
    toggleFeatured,
    flagListing,
    clearFlag,
    removeListing,
  } = useListings();
  const { logActivity, inquiries } = useAdmin();

  const userMatch = userListings.find((l) => l.id === listingId);
  const seedMatch = carListings.find((l) => l.id === listingId);
  const car: CarListing | undefined = userMatch ?? seedMatch;
  const [activeImage, setActiveImage] = useState(car?.image ?? "");

  if (!car) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Listing not found
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          The listing you tried to open does not exist or was deleted.
        </p>
        <Link
          href="/admin/listings"
          className="mt-6 inline-flex rounded-full bg-[#f75d34] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#e54d24]"
        >
          ← Back to listings
        </Link>
      </div>
    );
  }

  const isUser = isUserListing(car);
  const moderation: ListingModeration = isUser
    ? userMatch?.moderation ?? "approved"
    : "approved";
  const featured = isUser ? !!userMatch?.featured : car.badge === "FEATURED";
  const flagged = isUser ? !!userMatch?.flagged : false;
  const linkedInquiries = inquiries.filter((i) => i.listingId === car.id);

  const handleApprove = () => {
    setListingModeration(car.id, "approved");
    logActivity("listing-approved", `Approved "${car.title}"`, car.id);
  };
  const handleReject = () => {
    const reason = prompt("Reason for rejection?", "Listing does not meet quality bar");
    if (!reason) return;
    setListingModeration(car.id, "rejected", reason);
    logActivity("listing-rejected", `Rejected "${car.title}" — ${reason}`, car.id);
  };
  const handleBlock = () => {
    if (!confirm("Block this listing from public view?")) return;
    setListingModeration(car.id, "blocked", "Blocked from admin detail view");
    logActivity("listing-blocked", `Blocked "${car.title}"`, car.id);
  };
  const handleFeature = () => {
    toggleFeatured(car.id, !featured);
    logActivity(
      featured ? "listing-unfeatured" : "listing-featured",
      `${featured ? "Removed feature" : "Featured"} "${car.title}"`,
      car.id
    );
  };
  const handleFlag = () => {
    const reason = prompt("Flag reason?", "Suspicious content");
    if (!reason) return;
    flagListing(car.id, reason);
    logActivity("listing-blocked", `Flagged "${car.title}" — ${reason}`, car.id);
  };
  const handleClearFlag = () => {
    clearFlag(car.id);
    logActivity("listing-approved", `Cleared flag on "${car.title}"`, car.id);
  };
  const handleDelete = async () => {
    if (!confirm("Delete listing permanently?")) return;
    try {
      await removeListing(car.id);
      logActivity("listing-deleted", `Deleted "${car.title}"`, car.id);
      router.push("/admin/listings");
    } catch (err) {
      alert(
        err instanceof Error
          ? `Could not delete: ${err.message}`
          : "Could not delete listing."
      );
    }
  };

  const gallery = car.images && car.images.length > 0 ? car.images : [car.image];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs">
        <Link href="/admin/listings" className="text-slate-500 hover:text-[#f75d34]">
          ← All listings
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Left: gallery + info */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-[16/9] bg-slate-100">
              <ListingImage
                src={activeImage || car.image}
                alt={car.title}
                fill
                className="object-cover"
                sizes="800px"
              />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ring-1 ${moderationCls[moderation]}`}
                >
                  {moderation}
                </span>
                {featured && (
                  <span className="rounded-full bg-amber-200/90 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-900">
                    ★ Featured
                  </span>
                )}
                {flagged && (
                  <span className="rounded-full bg-red-200/90 px-2.5 py-1 text-[10px] font-bold uppercase text-red-900">
                    ⚑ Flagged
                  </span>
                )}
              </div>
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto bg-slate-50 p-3">
                {gallery.map((g, i) => (
                  <button
                    key={`${g}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(g)}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border ${
                      activeImage === g
                        ? "border-[#f75d34] ring-2 ring-[#f75d34]/30"
                        : "border-slate-200"
                    }`}
                  >
                    <ListingImage
                      src={g}
                      alt={`Photo ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="p-6">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Listing #{car.id}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {car.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{car.specs}</p>
              <p className="mt-3 text-2xl font-bold text-[#f75d34]">
                {car.price}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                📍 {car.location}
                {userMatch?.area ? ` • ${userMatch.area}` : ""}
              </p>
              {userMatch?.description && (
                <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Seller description
                  </p>
                  <p className="mt-2 leading-relaxed">{userMatch.description}</p>
                </div>
              )}
              {userMatch?.rejectedReason && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <p className="text-[11px] font-bold uppercase tracking-wider">
                    Rejection note
                  </p>
                  <p className="mt-1">{userMatch.rejectedReason}</p>
                </div>
              )}
              {userMatch?.flagReason && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <p className="text-[11px] font-bold uppercase tracking-wider">
                    Flag reason
                  </p>
                  <p className="mt-1">{userMatch.flagReason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Specs */}
          {userMatch && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">Specifications</h3>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                {[
                  ["Body type", userMatch.bodyType],
                  ["Color", userMatch.color],
                  ["Reg. month", userMatch.registrationMonth],
                  ["Reg. number", userMatch.regNumber],
                  ["Ownership", userMatch.ownership],
                  ["Insurance", userMatch.insurance],
                  ["Seats", userMatch.seats?.toString()],
                  ["Engine", userMatch.engineCc],
                  ["Mileage", userMatch.mileage],
                ]
                  .filter(([, v]) => !!v)
                  .map(([k, v]) => (
                    <div key={k as string}>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {k}
                      </dt>
                      <dd className="mt-1 font-medium text-slate-800">{v}</dd>
                    </div>
                  ))}
              </dl>
              {userMatch.features && userMatch.features.length > 0 && (
                <div className="mt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Features
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {userMatch.features.map((f) => (
                      <li
                        key={f}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Inquiries on this listing */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">
              Recent inquiries
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Buyer messages tied to this listing
            </p>
            {linkedInquiries.length === 0 ? (
              <p className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No inquiries yet.
              </p>
            ) : (
              <ul className="mt-5 space-y-3">
                {linkedInquiries.map((q) => (
                  <li
                    key={q.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {q.buyerName}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(q.createdAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{q.message}</p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                      <span>{q.buyerPhone}</span>
                      <span>•</span>
                      <span className="uppercase tracking-wider">
                        {q.channel}
                      </span>
                      <span>•</span>
                      <span className="uppercase tracking-wider">
                        {q.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right: actions + seller + stats */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Moderation</h3>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleApprove}
                disabled={moderation === "approved"}
                className="flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-500 disabled:opacity-50"
              >
                <CheckIcon className="h-3.5 w-3.5" /> Approve
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleReject}
                disabled={!isUser}
                className="flex items-center justify-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-50"
              >
                <XIcon className="h-3.5 w-3.5" /> Reject
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleFeature}
                disabled={!isUser}
                className="flex items-center justify-center gap-1 rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-200 disabled:opacity-50"
              >
                <StarIcon className="h-3.5 w-3.5" filled={featured} />{" "}
                {featured ? "Unfeature" : "Feature"}
              </motion.button>
              {flagged ? (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleClearFlag}
                  className="flex items-center justify-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  <FlagIcon className="h-3.5 w-3.5" filled /> Clear flag
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleFlag}
                  disabled={!isUser}
                  className="flex items-center justify-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  <FlagIcon className="h-3.5 w-3.5" /> Flag
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleBlock}
                disabled={!isUser}
                className="flex items-center justify-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                Block
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleDelete}
                disabled={!isUser}
                className="flex items-center justify-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-50"
              >
                <TrashIcon className="h-3.5 w-3.5" /> Delete
              </motion.button>
            </div>
            {!isUser && (
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
                This is a seed/sample listing. Some destructive actions are
                disabled.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Seller</h3>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f75d34] to-[#ffb199] text-base font-bold text-white">
                {(userMatch?.sellerName ?? "VD").slice(0, 1)}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">
                  {userMatch?.sellerName ?? "Verified Dealer"}
                </p>
                <p className="text-xs text-slate-500">
                  {userMatch?.email ?? "—"}
                </p>
                <p className="text-xs text-slate-500">
                  +91 {userMatch?.phone ?? "98765 43210"}
                </p>
              </div>
            </div>
            {userMatch?.sellerId && (
              <Link
                href={`/admin/users/${encodeURIComponent(userMatch.sellerId)}`}
                className="mt-4 inline-flex rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-[#f75d34] hover:text-[#f75d34]"
              >
                View seller profile →
              </Link>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Performance</h3>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {[
                {
                  label: "Views",
                  v: userMatch?.views ?? stableViewsFromId(car.id),
                  Icon: EyeIcon,
                  tint: "bg-blue-50 text-blue-600",
                },
                {
                  label: "Inquiries",
                  v: userMatch?.inquiries ?? linkedInquiries.length,
                  Icon: InquiriesIcon,
                  tint: "bg-emerald-50 text-emerald-600",
                },
              ].map(({ label, v, Icon, tint }) => (
                <li
                  key={label}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                >
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${tint}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {v.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-slate-500">{label}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
