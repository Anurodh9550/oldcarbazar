"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { useAuth } from "@/context/AuthContext";
import { useListings } from "@/context/ListingsContext";
import DealerGrantPanel from "@/components/admin/DealerGrantPanel";
import ListingImage from "@/components/ListingImage";
import { MailIcon, PhoneIcon, ShieldIcon } from "./icons";

export default function UserDetail({ userId }: { userId: string }) {
  const decodedId = decodeURIComponent(userId);
  const { registeredUsers, blockUser, unblockUser, setAdminNote } = useAuth();
  const { userListings } = useListings();
  const { inquiries, logActivity } = useAdmin();

  const derivedFromListings = useMemo(() => {
    const sellerListings = userListings.filter(
      (l) => l.sellerId === decodedId
    );
    if (sellerListings.length === 0) return null;
    const first = sellerListings[0];
    return {
      id: decodedId,
      name: first.sellerName,
      email: first.email ?? "",
      phone: first.phone,
      city: first.location,
      createdAt: first.createdAt,
      role: "seller" as const,
      status: "active" as const,
      loginCount: 0,
    };
  }, [userListings, decodedId]);

  const fromRegistry = registeredUsers.find((u) => u.id === decodedId);
  const user = fromRegistry ?? derivedFromListings;

  const listings = userListings.filter((l) => l.sellerId === decodedId);
  const ourInquiries = inquiries.filter(
    (i) =>
      (user && i.buyerEmail && user.email && i.buyerEmail === user.email) ||
      (user && i.buyerPhone === user.phone) ||
      (user && i.buyerName === user.name) ||
      i.sellerId === decodedId
  );

  const [note, setNote] = useState(fromRegistry?.adminNote ?? "");

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">User not found</h2>
        <p className="mt-2 text-sm text-slate-500">
          We couldn&apos;t locate this user in the registry.
        </p>
        <Link
          href="/admin/users"
          className="mt-6 inline-flex rounded-full bg-[#f75d34] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#e54d24]"
        >
          ← Back to users
        </Link>
      </div>
    );
  }

  const stats = {
    listings: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    sold: listings.filter((l) => l.status === "sold").length,
    views: listings.reduce((s, l) => s + l.views, 0),
    inquiries: ourInquiries.length,
  };

  const isBlocked = user.status === "blocked";

  const toggleBlock = () => {
    if (isBlocked) {
      unblockUser(user.id);
      logActivity("user-unblocked", `Unblocked ${user.name}`, user.id);
    } else {
      if (!confirm(`Block ${user.name}? They won't be able to interact further.`))
        return;
      blockUser(user.id);
      logActivity("user-blocked", `Blocked ${user.name}`, user.id);
    }
  };

  const saveNote = () => {
    setAdminNote(user.id, note);
    logActivity("settings-updated", `Updated admin note for ${user.name}`, user.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs">
        <Link href="/admin/users" className="text-slate-500 hover:text-[#f75d34]">
          ← All users
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_2fr]">
        {/* Profile column */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-28 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#f75d34]/60" />
            <div className="px-6 pb-6">
              <span className="relative -mt-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f75d34] to-[#ffb199] text-2xl font-bold text-white ring-4 ring-white">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {user.name}
              </h2>
              <p className="text-sm text-slate-500">{user.email || "—"}</p>

              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2 text-slate-700">
                  <PhoneIcon className="h-4 w-4 text-slate-400" /> +91 {user.phone}
                </li>
                {user.email && (
                  <li className="flex items-center gap-2 text-slate-700">
                    <MailIcon className="h-4 w-4 text-slate-400" /> {user.email}
                  </li>
                )}
                {user.city && (
                  <li className="flex items-center gap-2 text-slate-700">
                    📍 {user.city}
                  </li>
                )}
                <li className="flex items-center gap-2 text-slate-700">
                  <ShieldIcon className="h-4 w-4 text-slate-400" /> Role:{" "}
                  <span className="font-semibold">{user.role}</span>
                </li>
              </ul>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center">
                <Mini label="Listings" value={stats.listings} />
                <Mini label="Sold" value={stats.sold} />
                <Mini label="Inquiries" value={stats.inquiries} />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={toggleBlock}
                className={`mt-5 flex w-full items-center justify-center gap-1 rounded-xl py-2.5 text-sm font-semibold shadow ${
                  isBlocked
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "bg-red-50 text-red-700 ring-1 ring-red-200 hover:bg-red-100"
                }`}
              >
                {isBlocked ? "Unblock user" : "Block user"}
              </motion.button>
            </div>
          </div>

          <DealerGrantPanel userId={user.id} userName={user.name} />

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Admin note</h3>
            <p className="mt-1 text-xs text-slate-500">
              Private CRM note — not visible to the user.
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="e.g. Verified ID. Repeated buyer in Mumbai."
              className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
            />
            <button
              type="button"
              onClick={saveNote}
              className="mt-3 rounded-lg bg-[#f75d34] px-4 py-2 text-xs font-semibold text-white hover:bg-[#e54d24]"
            >
              Save note
            </button>
          </div>
        </div>

        {/* Activity column */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Listings", value: stats.listings, tone: "text-[#f75d34]" },
              { label: "Active", value: stats.active, tone: "text-emerald-600" },
              { label: "Total views", value: stats.views, tone: "text-blue-600" },
              { label: "Inquiries", value: stats.inquiries, tone: "text-violet-600" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {s.label}
                </p>
                <p className={`mt-1 text-2xl font-bold ${s.tone}`}>
                  {s.value.toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">
              Listings posted
            </h3>
            {listings.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                This user hasn&apos;t posted any listings yet.
              </p>
            ) : (
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {listings.map((car) => (
                  <li
                    key={car.id}
                    className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                  >
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <ListingImage
                        src={car.image}
                        alt={car.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/listings/${car.id}`}
                        className="block truncate text-sm font-semibold text-slate-900 hover:text-[#f75d34]"
                      >
                        {car.title}
                      </Link>
                      <p className="text-[11px] text-slate-500">
                        {car.price} • {car.location}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase text-slate-400">
                        {car.moderation ?? "approved"} • {car.status}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">
              Inquiries from this user
            </h3>
            {ourInquiries.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No inquiries yet.
              </p>
            ) : (
              <ul className="mt-5 space-y-3">
                {ourInquiries.slice(0, 6).map((q) => (
                  <li
                    key={q.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/admin/listings/${q.listingId}`}
                        className="truncate text-sm font-semibold text-slate-900 hover:text-[#f75d34]"
                      >
                        {q.listingTitle}
                      </Link>
                      <span className="text-[10px] text-slate-400">
                        {new Date(q.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{q.message}</p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
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
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-lg font-bold text-slate-900">
        {value.toLocaleString("en-IN")}
      </p>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
    </div>
  );
}
