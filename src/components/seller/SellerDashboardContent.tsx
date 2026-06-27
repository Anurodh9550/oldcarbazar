"use client";

import ListingImage from "@/components/ListingImage";
import Link from "next/link";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSellerIdFromUser, useListings } from "@/context/ListingsContext";

export default function SellerDashboardContent() {
  const { user } = useAuth();
  const { getMyListings, getSellerStats } = useListings();

  const sellerId = user ? getSellerIdFromUser(user) : "";
  const stats = getSellerStats(sellerId);
  const recent = useMemo(
    () => getMyListings(sellerId).slice(0, 6),
    [getMyListings, sellerId]
  );

  const statCards = [
    {
      label: "Total Listings",
      value: stats.total,
      icon: "🚗",
      bg: "from-orange-500 to-[#f75d34]",
      text: "text-white",
    },
    {
      label: "Active Ads",
      value: stats.active,
      icon: "✓",
      bg: "from-emerald-500 to-green-600",
      text: "text-white",
    },
    {
      label: "Sold",
      value: stats.sold,
      icon: "🏷",
      bg: "from-gray-600 to-gray-800",
      text: "text-white",
    },
    {
      label: "Total Views",
      value: stats.views,
      icon: "👁",
      bg: "from-blue-500 to-indigo-600",
      text: "text-white",
    },
    {
      label: "Inquiries",
      value: stats.inquiries,
      icon: "💬",
      bg: "from-violet-500 to-purple-600",
      text: "text-white",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
            Welcome back
          </p>
          <p className="mt-1 section-title">{user?.name}</p>
          <p className="text-body-muted">{user?.phone}</p>
        </div>
        <Link
          href="/sell-car"
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#f75d34] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#e54d24]"
        >
          + New Listing
        </Link>
      </div>

      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {statCards.map((card) => (
          <li
            key={card.label}
            className={`overflow-hidden rounded-2xl bg-gradient-to-br ${card.bg} p-5 shadow-md ${card.text}`}
          >
            {card.label === "Inquiries" ? (
              <WhatsAppIcon size={28} variant="light" />
            ) : (
              <span className="text-2xl">{card.icon}</span>
            )}
            <p className="mt-4 text-3xl font-bold">{card.value}</p>
            <p className="mt-1 text-xs font-medium opacity-90">{card.label}</p>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6 xl:col-span-1">
          <h2 className="text-base font-bold text-gray-900">Quick Actions</h2>
          <p className="mt-1 text-caption">Manage your seller account</p>
          <ul className="mt-5 space-y-2">
            {[
              { href: "/sell-car", label: "Sell Car Free", icon: "➕", primary: true },
              { href: "/leads", label: "Leads & Inquiries", icon: "🔔", primary: false },
              { href: "/post-ad", label: "Post Ad in 2 Minutes", icon: "⚡", primary: false },
              { href: "/my-listings", label: "My Listings", icon: "📋", primary: false },
              { href: "/used-cars/search", label: "Browse Market", icon: "🔍", primary: false },
            ].map((action) => (
              <li key={action.href}>
                <Link
                  href={action.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                    action.primary
                      ? "bg-[#f75d34] text-white shadow hover:bg-[#e54d24]"
                      : "border border-gray-200 bg-white text-gray-800 hover:border-[#f75d34] hover:text-[#f75d34]"
                  }`}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Recent Listings</h2>
              <p className="text-caption">Your latest posted cars</p>
            </div>
            <Link
              href="/my-listings"
              className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#f75d34] hover:bg-orange-100"
            >
              View all →
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <span className="text-5xl">📭</span>
              <p className="mt-4 text-sm font-medium text-gray-700">No listings yet</p>
              <Link
                href="/sell-car"
                className="mt-4 text-sm font-semibold text-[#f75d34] hover:underline"
              >
                Post your first ad →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recent.map((car) => (
                <li
                  key={car.id}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0 transition hover:bg-gray-50/80"
                >
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <ListingImage
                      src={car.image}
                      alt={car.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">{car.title}</p>
                    <p className="text-sm text-[#f75d34]">{car.price}</p>
                    <p className="mt-0.5 text-caption">
                      {car.location} • {car.views} views • {car.inquiries} inquiries
                    </p>
                  </div>
                  <span
                    className={`shrink-0 self-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      car.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {car.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900">Seller Tips</h2>
        <p className="mt-1 text-caption">Sell faster with these best practices</p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "Clear photos",
              d: "Upload bright front & side shots for 2× more views.",
              icon: "📸",
            },
            {
              t: "Fair pricing",
              d: "Check similar cars on Old Car Bazar before setting price.",
              icon: "💰",
            },
            {
              t: "Quick replies",
              d: "Reply to buyers within 1 hour to close deals faster.",
              icon: "⚡",
            },
          ].map((tip) => (
            <li
              key={tip.t}
              className="rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-5"
            >
              <span className="text-2xl">{tip.icon}</span>
              <p className="mt-3 font-semibold text-gray-900">{tip.t}</p>
              <p className="mt-1 text-body-muted">{tip.d}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
