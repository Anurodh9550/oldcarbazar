"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import type { RegisteredUser } from "@/context/AuthContext";
import { useListings } from "@/context/ListingsContext";
import { SearchIcon } from "./icons";

type Mode = "all" | "buyers" | "sellers";

const roleColors: Record<string, string> = {
  buyer: "bg-blue-50 text-blue-700 ring-blue-200",
  seller: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  both: "bg-violet-50 text-violet-700 ring-violet-200",
  lead: "bg-amber-50 text-amber-700 ring-amber-200",
};

export default function UsersContent({ mode = "all" }: { mode?: Mode }) {
  const { userListings } = useListings();
  const { logActivity, inquiries, users, blockUser, unblockUser } = useAdmin();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "blocked">("all");
  const [sort, setSort] = useState<"newest" | "name" | "activity">("newest");

  // Build enriched user list: pull seller IDs from listings, and lead
  // buyers from inquiry submissions (Name + Phone form on car detail page).
  const enriched = useMemo(() => {
    const map = new Map<string, RegisteredUser>();
    for (const u of users) map.set(u.id, u);

    for (const l of userListings) {
      const id = l.sellerId;
      if (!id) continue;
      const existing = map.get(id);
      if (existing) {
        existing.role =
          existing.role === "buyer" || existing.role === "both"
            ? "both"
            : "seller";
        if (!existing.email && l.email) existing.email = l.email;
        if (!existing.phone) existing.phone = l.phone;
        if (!existing.city) existing.city = l.location;
      } else {
        map.set(id, {
          id,
          name: l.sellerName,
          email: l.email ?? "",
          phone: l.phone,
          role: "seller",
          status: "active",
          city: l.location,
          createdAt: l.createdAt,
          loginCount: 0,
        });
      }
    }

    // Inquiry-only leads — buyers who used the Name+Phone form without
    // creating a full account. We dedupe by phone (the only field we always
    // collect) and skip anyone already in the registry by phone or email.
    const knownPhones = new Set(
      [...map.values()].map((u) => u.phone).filter(Boolean)
    );
    const knownEmails = new Set(
      [...map.values()]
        .map((u) => u.email.toLowerCase())
        .filter(Boolean)
    );
    const leadByPhone = new Map<string, RegisteredUser>();
    for (const inq of inquiries) {
      if (!inq.buyerPhone) continue;
      if (knownPhones.has(inq.buyerPhone)) continue;
      if (
        inq.buyerEmail &&
        knownEmails.has(inq.buyerEmail.toLowerCase())
      ) {
        continue;
      }
      const existing = leadByPhone.get(inq.buyerPhone);
      if (existing) {
        if (inq.createdAt > existing.createdAt) {
          existing.createdAt = inq.createdAt;
        }
        continue;
      }
      leadByPhone.set(inq.buyerPhone, {
        id: `lead-${inq.buyerPhone}`,
        name: inq.buyerName || "Unknown",
        email: inq.buyerEmail ?? "",
        phone: inq.buyerPhone,
        role: "buyer",
        status: "active",
        city: inq.city ?? "",
        createdAt: inq.createdAt,
        loginCount: 0,
      });
    }
    for (const lead of leadByPhone.values()) {
      map.set(lead.id, lead);
    }

    return [...map.values()];
  }, [users, userListings, inquiries]);

  const filtered = useMemo(() => {
    let list = enriched;
    if (mode === "buyers") {
      list = list.filter((u) => u.role === "buyer" || u.role === "both");
    }
    if (mode === "sellers") {
      list = list.filter((u) => u.role === "seller" || u.role === "both");
    }
    if (status !== "all") list = list.filter((u) => u.status === status);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q) ||
          (u.city ?? "").toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    if (sort === "newest") sorted.sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "activity")
      sorted.sort((a, b) => (b.lastLoginAt ?? 0) - (a.lastLoginAt ?? 0));
    return sorted;
  }, [enriched, mode, query, status, sort]);

  const sellerStats = (id: string) => {
    const listings = userListings.filter((l) => l.sellerId === id);
    return {
      total: listings.length,
      active: listings.filter((l) => l.status === "active").length,
      sold: listings.filter((l) => l.status === "sold").length,
      views: listings.reduce((s, l) => s + l.views, 0),
    };
  };

  const buyerStats = (u: RegisteredUser) => {
    const ourInquiries = inquiries.filter(
      (i) =>
        (u.phone && i.buyerPhone === u.phone) ||
        (u.email && i.buyerEmail === u.email)
    );
    return { inquiries: ourInquiries.length };
  };

  const isLead = (u: RegisteredUser) => u.id.startsWith("lead-");

  const counts = useMemo(
    () => ({
      total: enriched.length,
      buyers: enriched.filter((u) => u.role === "buyer" || u.role === "both")
        .length,
      sellers: enriched.filter(
        (u) => u.role === "seller" || u.role === "both"
      ).length,
      blocked: enriched.filter((u) => u.status === "blocked").length,
    }),
    [enriched]
  );

  const handleBlock = (u: RegisteredUser) => {
    blockUser(u.id);
    logActivity("user-blocked", `Blocked user ${u.name}`, u.id);
  };
  const handleUnblock = (u: RegisteredUser) => {
    unblockUser(u.id);
    logActivity("user-unblocked", `Unblocked user ${u.name}`, u.id);
  };

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard label="Total" value={counts.total} />
        <SummaryCard label="Buyers" value={counts.buyers} tone="blue" />
        <SummaryCard label="Sellers" value={counts.sellers} tone="emerald" />
        <SummaryCard label="Blocked" value={counts.blocked} tone="red" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-[#f75d34] focus-within:ring-2 focus-within:ring-[#f75d34]/20">
          <SearchIcon className="h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search by name, email, phone or city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#f75d34]"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#f75d34]"
        >
          <option value="newest">Newest</option>
          <option value="name">A → Z</option>
          <option value="activity">Last active</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Activity</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-16 text-center text-sm text-slate-400"
                  >
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((u, idx) => {
                  const sStats = sellerStats(u.id);
                  const bStats = buyerStats(u);
                  return (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.015, 0.3) }}
                      className="border-t border-slate-100 transition hover:bg-orange-50/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f75d34] to-[#ffb199] text-sm font-bold text-white">
                            {u.name.slice(0, 1).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/users/${encodeURIComponent(u.id)}`}
                              className="block truncate text-sm font-semibold text-slate-900 hover:text-[#f75d34]"
                            >
                              {u.name}
                            </Link>
                            <p className="text-[11px] text-slate-500">
                              Joined{" "}
                              {new Date(u.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <p className="truncate text-slate-700">
                          {u.email || "—"}
                        </p>
                        <p className="text-slate-500">
                          {u.phone ? `+91 ${u.phone}` : "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ring-1 ${
                            isLead(u) ? roleColors.lead : roleColors[u.role]
                          }`}
                        >
                          {isLead(u) ? "lead" : u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {u.city ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-600">
                        {u.role === "seller" || u.role === "both" ? (
                          <span>
                            {sStats.total} listings • {sStats.active} active •{" "}
                            {sStats.sold} sold
                          </span>
                        ) : (
                          <span>
                            {bStats.inquiries} inquir{bStats.inquiries === 1 ? "y" : "ies"} •{" "}
                            {u.loginCount} login{u.loginCount === 1 ? "" : "s"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ring-1 ${
                            u.status === "active"
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                              : "bg-red-50 text-red-700 ring-red-200"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {isLead(u) ? (
                            <Link
                              href="/admin/inquiries"
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-[#f75d34] hover:text-[#f75d34]"
                            >
                              View inquiries
                            </Link>
                          ) : (
                            <>
                              <Link
                                href={`/admin/users/${encodeURIComponent(u.id)}`}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-[#f75d34] hover:text-[#f75d34]"
                              >
                                Open
                              </Link>
                              {u.status === "active" ? (
                                <button
                                  type="button"
                                  onClick={() => handleBlock(u)}
                                  className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                                >
                                  Block
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleUnblock(u)}
                                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-500"
                                >
                                  Unblock
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: number;
  tone?: "slate" | "blue" | "emerald" | "red";
}) {
  const map: Record<typeof tone, string> = {
    slate: "text-slate-900",
    blue: "text-blue-700",
    emerald: "text-emerald-700",
    red: "text-red-700",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${map[tone]}`}>
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
