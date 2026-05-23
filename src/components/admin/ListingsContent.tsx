"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { useListings } from "@/context/ListingsContext";
import { carListings, type CarListing } from "@/data/cars";
import ListingImage from "@/components/ListingImage";
import type {
  ListingModeration,
  UserCarListing,
} from "@/types/listing";
import { isUserListing } from "@/types/listing";
import {
  CarsIcon,
  CheckIcon,
  EyeIcon,
  FlagIcon,
  SearchIcon,
  StarIcon,
  TrashIcon,
  XIcon,
} from "./icons";

type FilterValue = "all" | "approved" | "pending" | "rejected" | "blocked" | "featured" | "flagged";

const moderationBadge: Record<
  ListingModeration,
  { label: string; cls: string }
> = {
  approved: {
    label: "Approved",
    cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  pending: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-50 text-red-700 ring-1 ring-red-200",
  },
  blocked: {
    label: "Blocked",
    cls: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  },
};

type EnrichedListing = (UserCarListing | CarListing) & {
  isUser: boolean;
  moderationStatus: ListingModeration;
  featured: boolean;
  flagged: boolean;
  flagReason?: string;
  rejectedReason?: string;
  views: number;
  inquiries: number;
  createdAt: number;
  sellerName: string;
  sellerId?: string;
};

function stableMetric(id: string, salt: number) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * salt) % 300;
  return h;
}

function enrich(list: CarListing): EnrichedListing {
  if (isUserListing(list)) {
    return {
      ...list,
      isUser: true,
      moderationStatus: list.moderation ?? "approved",
      featured: !!list.featured,
      flagged: !!list.flagged,
      flagReason: list.flagReason,
      rejectedReason: list.rejectedReason,
      views: list.views,
      inquiries: list.inquiries,
      createdAt: list.createdAt,
      sellerName: list.sellerName,
      sellerId: list.sellerId,
    };
  }
  return {
    ...list,
    isUser: false,
    moderationStatus: "approved",
    featured: list.badge === "FEATURED",
    flagged: false,
    views: stableMetric(list.id, 7) + 20,
    inquiries: stableMetric(list.id, 13) % 30,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * (parseInt(list.id, 10) % 30 + 1),
    sellerName: "Verified Dealer",
    sellerId: `seed-${list.id}`,
  };
}

export default function ListingsContent() {
  const search = useSearchParams();
  const presetFilter = (search?.get("filter") as FilterValue | null) ?? "all";

  const {
    userListings,
    setListingModeration,
    toggleFeatured,
    flagListing,
    clearFlag,
    removeListing,
  } = useListings();
  const { logActivity } = useAdmin();

  const [filter, setFilter] = useState<FilterValue>(presetFilter);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string>("");
  const [sort, setSort] = useState<"newest" | "oldest" | "views" | "inquiries">(
    "newest"
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rejectModal, setRejectModal] = useState<{ id: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const combined: EnrichedListing[] = useMemo(() => {
    return userListings.length > 0
      ? userListings.map(enrich)
      : carListings.map(enrich);
  }, [userListings]);

  const cities = useMemo(() => {
    const s = new Set(combined.map((c) => c.location));
    return [...s].sort();
  }, [combined]);

  const filtered = useMemo(() => {
    let list = combined;
    if (filter === "approved") list = list.filter((l) => l.moderationStatus === "approved");
    else if (filter === "pending") list = list.filter((l) => l.moderationStatus === "pending");
    else if (filter === "rejected") list = list.filter((l) => l.moderationStatus === "rejected");
    else if (filter === "blocked") list = list.filter((l) => l.moderationStatus === "blocked");
    else if (filter === "featured") list = list.filter((l) => l.featured);
    else if (filter === "flagged") list = list.filter((l) => l.flagged);

    if (city) list = list.filter((l) => l.location === city);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          (l.sellerName ?? "").toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    if (sort === "newest") sorted.sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "oldest") sorted.sort((a, b) => a.createdAt - b.createdAt);
    if (sort === "views") sorted.sort((a, b) => b.views - a.views);
    if (sort === "inquiries") sorted.sort((a, b) => b.inquiries - a.inquiries);
    return sorted;
  }, [combined, filter, city, query, sort]);

  const counts = useMemo(() => {
    const c = {
      all: combined.length,
      approved: combined.filter((l) => l.moderationStatus === "approved").length,
      pending: combined.filter((l) => l.moderationStatus === "pending").length,
      rejected: combined.filter((l) => l.moderationStatus === "rejected").length,
      blocked: combined.filter((l) => l.moderationStatus === "blocked").length,
      featured: combined.filter((l) => l.featured).length,
      flagged: combined.filter((l) => l.flagged).length,
    };
    return c;
  }, [combined]);

  const allSelected =
    filtered.length > 0 && filtered.every((l) => selected.has(l.id));
  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((l) => l.id)));
    }
  };
  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkApprove = () => {
    selected.forEach((id) => {
      const l = userListings.find((u) => u.id === id);
      if (l) setListingModeration(id, "approved");
    });
    logActivity(
      "listing-approved",
      `Approved ${selected.size} listing(s) in bulk`
    );
    setSelected(new Set());
  };
  const bulkReject = () => {
    selected.forEach((id) => {
      const l = userListings.find((u) => u.id === id);
      if (l)
        setListingModeration(id, "rejected", "Rejected via bulk moderation");
    });
    logActivity(
      "listing-rejected",
      `Rejected ${selected.size} listing(s) in bulk`
    );
    setSelected(new Set());
  };
  const bulkBlock = () => {
    selected.forEach((id) => {
      const l = userListings.find((u) => u.id === id);
      if (l) setListingModeration(id, "blocked", "Blocked via bulk moderation");
    });
    logActivity("listing-blocked", `Blocked ${selected.size} listing(s)`);
    setSelected(new Set());
  };
  const bulkFeature = () => {
    selected.forEach((id) => {
      const l = userListings.find((u) => u.id === id);
      if (l) toggleFeatured(id, true);
    });
    logActivity("listing-featured", `Featured ${selected.size} listing(s)`);
    setSelected(new Set());
  };
  const bulkDelete = () => {
    if (
      !confirm(
        `Delete ${selected.size} seller listing(s) permanently? Seed listings are skipped.`
      )
    )
      return;
    selected.forEach((id) => {
      const l = userListings.find((u) => u.id === id);
      if (l) removeListing(id);
    });
    logActivity("listing-deleted", `Deleted ${selected.size} listing(s)`);
    setSelected(new Set());
  };

  const handleApprove = (id: string, title: string) => {
    setListingModeration(id, "approved");
    logActivity("listing-approved", `Approved listing "${title}"`, id);
  };
  const handleReject = (id: string, title: string) => {
    setRejectModal({ id });
    setRejectReason(`Rejected: "${title}"`);
  };
  const submitReject = () => {
    if (!rejectModal) return;
    setListingModeration(rejectModal.id, "rejected", rejectReason);
    logActivity("listing-rejected", `Rejected listing — ${rejectReason}`, rejectModal.id);
    setRejectModal(null);
    setRejectReason("");
  };
  const handleBlock = (id: string, title: string) => {
    setListingModeration(id, "blocked", "Blocked by admin");
    logActivity("listing-blocked", `Blocked listing "${title}"`, id);
  };
  const handleFeature = (id: string, title: string, on: boolean) => {
    toggleFeatured(id, on);
    logActivity(
      on ? "listing-featured" : "listing-unfeatured",
      `${on ? "Featured" : "Removed feature"} — ${title}`,
      id
    );
  };
  const handleFlag = (id: string, title: string) => {
    const reason = prompt("Why are you flagging this listing?", "Suspicious content");
    if (!reason) return;
    flagListing(id, reason);
    logActivity("listing-blocked", `Flagged "${title}" — ${reason}`, id);
  };
  const handleClearFlag = (id: string, title: string) => {
    clearFlag(id);
    logActivity("listing-approved", `Cleared flag on "${title}"`, id);
  };
  const handleDelete = (id: string, title: string) => {
    if (!confirm("Delete this listing permanently?")) return;
    removeListing(id);
    logActivity("listing-deleted", `Deleted "${title}"`, id);
  };

  return (
    <div className="space-y-6">
      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { id: "all", label: "All" },
            { id: "approved", label: "Approved" },
            { id: "pending", label: "Pending" },
            { id: "rejected", label: "Rejected" },
            { id: "blocked", label: "Blocked" },
            { id: "featured", label: "Featured" },
            { id: "flagged", label: "Flagged" },
          ] as { id: FilterValue; label: string }[]
        ).map((c) => {
          const active = filter === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-[#f75d34] text-white shadow"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[#f75d34]/40 hover:text-[#f75d34]"
              }`}
            >
              {c.label}
              <span
                className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] ${
                  active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {counts[c.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-[#f75d34] focus-within:ring-2 focus-within:ring-[#f75d34]/20">
          <SearchIcon className="h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search by title, seller or city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#f75d34]"
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#f75d34]"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="views">Most viewed</option>
          <option value="inquiries">Most inquired</option>
        </select>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#f75d34]/30 bg-orange-50 px-4 py-3 text-sm"
        >
          <span className="font-semibold text-[#f75d34]">
            {selected.size} selected
          </span>
          <span className="flex-1" />
          <button
            type="button"
            onClick={bulkApprove}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
          >
            <CheckIcon className="mr-1 inline h-3 w-3" /> Approve
          </button>
          <button
            type="button"
            onClick={bulkReject}
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50"
          >
            <XIcon className="mr-1 inline h-3 w-3" /> Reject
          </button>
          <button
            type="button"
            onClick={bulkFeature}
            className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-200"
          >
            <StarIcon className="mr-1 inline h-3 w-3" filled /> Feature
          </button>
          <button
            type="button"
            onClick={bulkBlock}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Block
          </button>
          <button
            type="button"
            onClick={bulkDelete}
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
          >
            <TrashIcon className="mr-1 inline h-3 w-3" /> Delete
          </button>
        </motion.div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-slate-300 text-[#f75d34] focus:ring-[#f75d34]"
                  />
                </th>
                <th className="px-4 py-3 text-left">Listing</th>
                <th className="px-4 py-3 text-left">Seller</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Performance</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <CarsIcon className="h-10 w-10" />
                      <p className="text-sm font-medium">
                        No listings match the current filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((car) => {
                  const isSelected = selected.has(car.id);
                  const badge = moderationBadge[car.moderationStatus];
                  return (
                    <tr
                      key={car.id}
                      className={`border-t border-slate-100 transition hover:bg-orange-50/30 ${
                        isSelected ? "bg-orange-50/60" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(car.id)}
                          className="h-4 w-4 rounded border-slate-300 text-[#f75d34] focus:ring-[#f75d34]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <ListingImage
                              src={car.image}
                              alt={car.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/listings/${car.id}`}
                                className="truncate text-sm font-semibold text-slate-900 hover:text-[#f75d34]"
                              >
                                {car.title}
                              </Link>
                              {car.featured && (
                                <span
                                  title="Featured"
                                  className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700"
                                >
                                  ★ FEATURED
                                </span>
                              )}
                              {car.flagged && (
                                <span
                                  title={car.flagReason}
                                  className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700"
                                >
                                  ⚑ FLAGGED
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {car.specs} • {car.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <p className="font-semibold text-slate-800">
                          {car.sellerName ?? "—"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {car.isUser ? "User listing" : "Seed inventory"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-[#f75d34]">
                        {car.price}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${badge.cls}`}
                        >
                          {badge.label}
                        </span>
                        {car.rejectedReason && (
                          <p
                            title={car.rejectedReason}
                            className="mt-1 max-w-[180px] truncate text-[10px] text-red-600"
                          >
                            {car.rejectedReason}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 text-[11px] text-slate-600">
                          <span className="flex items-center gap-1">
                            <EyeIcon className="h-3.5 w-3.5" />{" "}
                            {car.views.toLocaleString("en-IN")}
                          </span>
                          <span className="flex items-center gap-1">
                            <InquiriesIconMini />
                            {car.inquiries}
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {new Date(car.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          {car.isUser && car.moderationStatus !== "approved" && (
                            <IconButton
                              title="Approve"
                              tone="emerald"
                              onClick={() => handleApprove(car.id, car.title)}
                            >
                              <CheckIcon className="h-3.5 w-3.5" />
                            </IconButton>
                          )}
                          {car.isUser && car.moderationStatus !== "rejected" && (
                            <IconButton
                              title="Reject"
                              tone="red"
                              onClick={() => handleReject(car.id, car.title)}
                            >
                              <XIcon className="h-3.5 w-3.5" />
                            </IconButton>
                          )}
                          {car.isUser && (
                            <IconButton
                              title={car.featured ? "Unfeature" : "Mark featured"}
                              tone="amber"
                              onClick={() =>
                                handleFeature(car.id, car.title, !car.featured)
                              }
                            >
                              <StarIcon
                                className="h-3.5 w-3.5"
                                filled={car.featured}
                              />
                            </IconButton>
                          )}
                          {car.isUser && (
                            car.flagged ? (
                              <IconButton
                                title="Clear flag"
                                tone="slate"
                                onClick={() => handleClearFlag(car.id, car.title)}
                              >
                                <FlagIcon className="h-3.5 w-3.5" filled />
                              </IconButton>
                            ) : (
                              <IconButton
                                title="Flag"
                                tone="slate"
                                onClick={() => handleFlag(car.id, car.title)}
                              >
                                <FlagIcon className="h-3.5 w-3.5" />
                              </IconButton>
                            )
                          )}
                          {car.isUser && car.moderationStatus !== "blocked" && (
                            <IconButton
                              title="Block"
                              tone="dark"
                              onClick={() => handleBlock(car.id, car.title)}
                            >
                              <span className="px-1 text-[10px] font-bold">
                                B
                              </span>
                            </IconButton>
                          )}
                          <Link
                            href={`/admin/listings/${car.id}`}
                            title="Open"
                            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:border-[#f75d34] hover:text-[#f75d34]"
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                          </Link>
                          {car.isUser && (
                            <IconButton
                              title="Delete"
                              tone="redLight"
                              onClick={() => handleDelete(car.id, car.title)}
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </IconButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setRejectModal(null)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            aria-label="Close"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-slate-900">Reject listing</h3>
            <p className="mt-1 text-sm text-slate-600">
              Provide a clear reason — this is shared with the seller in their
              dashboard.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
              placeholder="e.g. Photos are unclear, price seems incorrect…"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectModal(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReject}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                Reject listing
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function InquiriesIconMini() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path d="M21 12a8 8 0 11-3.2-6.4L21 4l-1 4h-4" />
    </svg>
  );
}

type Tone = "emerald" | "red" | "amber" | "slate" | "dark" | "redLight";

function IconButton({
  title,
  tone,
  onClick,
  children,
}: {
  title: string;
  tone: Tone;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const map: Record<Tone, string> = {
    emerald:
      "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-1 ring-emerald-200",
    red: "bg-red-50 text-red-600 hover:bg-red-100 ring-1 ring-red-200",
    amber:
      "bg-amber-50 text-amber-700 hover:bg-amber-100 ring-1 ring-amber-200",
    slate: "bg-slate-50 text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200",
    dark: "bg-slate-900 text-white hover:bg-slate-800",
    redLight: "bg-white text-red-600 hover:bg-red-50 ring-1 ring-red-200",
  };
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold transition ${map[tone]}`}
    >
      {children}
    </button>
  );
}
