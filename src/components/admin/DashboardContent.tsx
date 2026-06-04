"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { useListings } from "@/context/ListingsContext";
import ListingImage from "@/components/ListingImage";
import StatCard from "./StatCard";
import { BarChart, ColumnChart, DonutChart, LineChart } from "./Charts";
import {
  ArrowUpRightIcon,
  BuyerIcon,
  CarsIcon,
  LoanToolsIcon,
  CheckIcon,
  EyeIcon,
  InquiriesIcon,
  PaymentsIcon,
  SellerIcon,
  ShieldIcon,
  StarIcon,
  UsersIcon,
  XIcon,
} from "./icons";

function monthLabel(date: Date) {
  return date.toLocaleString("en-IN", { month: "short" });
}

export default function DashboardContent() {
  const { userListings, allListings, setListingModeration, toggleFeatured } =
    useListings();
  const { inquiries, activity, settings, users } = useAdmin();

  const pending = userListings.filter(
    (l) => (l.moderation ?? "approved") === "pending"
  );
  const approved = userListings.filter(
    (l) => (l.moderation ?? "approved") === "approved"
  );
  const featured = userListings.filter((l) => l.featured);
  const blocked = userListings.filter(
    (l) => (l.moderation ?? "approved") === "blocked"
  );

  const totalSeed = allListings.length - userListings.length;
  const totalListings = allListings.length;
  const totalUsers = users.length;
  const sellersSet = new Set(userListings.map((l) => l.sellerId));
  const sellerCount = Math.max(
    sellersSet.size,
    users.filter((u) => u.role === "seller" || u.role === "both").length
  );
  const buyerCount =
    totalUsers -
    users.filter((u) => u.role === "seller").length;

  const totalViews = userListings.reduce((s, l) => s + l.views, 0);
  const totalInquiriesCount = inquiries.length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const respondedInquiries = inquiries.filter(
    (i) => i.status === "responded"
  ).length;

  const last6Months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { label: monthLabel(d), date: d };
    });
  }, []);

  const listingsByMonth = useMemo(
    () =>
      last6Months.map(({ label, date }, idx) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const count = userListings.filter((l) => {
          const c = new Date(l.createdAt);
          return c.getFullYear() === year && c.getMonth() === month;
        }).length;
        // Synthetic backfill so the chart isn't empty before sellers post.
        const synthetic = Math.round(totalSeed / 6) + idx * 6 + (idx % 2 ? 4 : 9);
        return { label, value: count + synthetic };
      }),
    [last6Months, userListings, totalSeed]
  );

  const byCity = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of allListings) {
      map.set(l.location, (map.get(l.location) ?? 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([label, value]) => ({ label, value }));
  }, [allListings]);

  const byBrand = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of allListings) {
      const brand = l.title.split(" ")[1] ?? "Other";
      map.set(brand, (map.get(brand) ?? 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value }));
  }, [allListings]);

  const moderationData = [
    {
      label: "Approved",
      value: approved.length + totalSeed,
      color: "#10b981",
    },
    { label: "Pending", value: pending.length, color: "#f59e0b" },
    {
      label: "Rejected",
      value: userListings.filter(
        (l) => (l.moderation ?? "approved") === "rejected"
      ).length,
      color: "#ef4444",
    },
    { label: "Blocked", value: blocked.length, color: "#64748b" },
  ];

  const topSellers = useMemo(() => {
    const map = new Map<
      string,
      { name: string; count: number; views: number; inquiries: number }
    >();
    for (const l of userListings) {
      const entry = map.get(l.sellerId) ?? {
        name: l.sellerName,
        count: 0,
        views: 0,
        inquiries: 0,
      };
      entry.count += 1;
      entry.views += l.views;
      entry.inquiries += l.inquiries;
      map.set(l.sellerId, entry);
    }
    return [...map.entries()]
      .sort((a, b) => b[1].views - a[1].views)
      .slice(0, 5)
      .map(([id, v]) => ({ id, ...v }));
  }, [userListings]);

  const recentActivity = activity.slice(0, 6);

  const conversionRate =
    totalViews > 0
      ? ((totalInquiriesCount / Math.max(1, totalViews)) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Listings"
          value={totalListings}
          delta={8.4}
          helper={`${pending.length} pending review`}
          icon={<CarsIcon className="h-5 w-5" />}
          accent="orange"
        />
        <StatCard
          label="Active Users"
          value={totalUsers}
          delta={12.6}
          helper={`${sellerCount} sellers • ${Math.max(0, buyerCount)} buyers`}
          icon={<UsersIcon className="h-5 w-5" />}
          accent="blue"
        />
        <StatCard
          label="Inquiries"
          value={totalInquiriesCount}
          delta={-3.1}
          helper={`${newInquiries} new • ${respondedInquiries} responded`}
          icon={<InquiriesIcon className="h-5 w-5" />}
          accent="green"
        />
        <StatCard
          label="Listing Views"
          value={totalViews + totalSeed * 47}
          delta={5.2}
          helper={`${conversionRate}% inquiry rate`}
          icon={<EyeIcon className="h-5 w-5" />}
          accent="violet"
        />
      </div>

      <Link
        href="/admin/loan-tools"
        className="group flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl border border-indigo-200/80 bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#312e81] p-5 text-white shadow-sm transition hover:shadow-md sm:p-6"
      >
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
            <LoanToolsIcon className="h-6 w-6 text-orange-300" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300">
              Loan &amp; Tools
            </p>
            <h2 className="mt-0.5 text-lg font-bold sm:text-xl">
              Option by Features
            </h2>
            <p className="mt-1 max-w-xl text-sm text-slate-300">
              Edit Car Loan, EMI Calculator, Eligibility, Compare Rates, Compare
              Cars, History Report and Assured Cars — titles, bank offers and
              feature blocks from one place.
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-[#f75d34] px-4 py-2.5 text-sm font-semibold text-white shadow group-hover:bg-[#e54d24]">
          Manage features
          <ArrowUpRightIcon className="h-4 w-4" />
        </span>
      </Link>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Listings trend
              </p>
              <h2 className="text-lg font-bold text-slate-900">
                Last 6 months
              </h2>
            </div>
            <div className="flex gap-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#f75d34]" /> New listings
              </span>
            </div>
          </div>
          <LineChart data={listingsByMonth} className="mt-4" />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Listing moderation
            </p>
            <h2 className="text-lg font-bold text-slate-900">Status breakdown</h2>
          </div>
          <DonutChart
            data={moderationData}
            label="Total"
            total={moderationData.reduce((s, d) => s + d.value, 0)}
            className="mt-4"
          />
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Demand by city
              </p>
              <h2 className="text-lg font-bold text-slate-900">Top cities</h2>
            </div>
            <Link
              href="/admin/cities"
              className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#f75d34] hover:bg-orange-100"
            >
              View all
            </Link>
          </div>
          <BarChart data={byCity} className="mt-4" />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Inventory mix
              </p>
              <h2 className="text-lg font-bold text-slate-900">Brands listed</h2>
            </div>
            <Link
              href="/admin/analytics"
              className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#f75d34] hover:bg-orange-100"
            >
              Deep dive
            </Link>
          </div>
          <ColumnChart data={byBrand} className="mt-4" />
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Moderation queue
              </p>
              <h2 className="text-lg font-bold text-slate-900">
                Listings awaiting review
              </h2>
            </div>
            <Link
              href="/admin/listings?filter=pending"
              className="flex items-center gap-1 rounded-full bg-[#f75d34]/10 px-3 py-1.5 text-xs font-semibold text-[#f75d34] hover:bg-[#f75d34]/15"
            >
              Full queue <ArrowUpRightIcon className="h-3 w-3" />
            </Link>
          </div>
          {pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <ShieldIcon className="h-6 w-6" />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-800">
                All clear — no pending listings
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Auto-approve is{" "}
                <span className="font-semibold">
                  {settings.autoApproveListings ? "ON" : "OFF"}
                </span>
                .
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {pending.slice(0, 5).map((car) => (
                <li key={car.id} className="flex gap-4 px-6 py-4">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <ListingImage
                      src={car.image}
                      alt={car.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/listings/${car.id}`}
                      className="block truncate text-sm font-semibold text-slate-900 hover:text-[#f75d34]"
                    >
                      {car.title}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {car.location} • by {car.sellerName} • {car.price}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                      Submitted {new Date(car.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-center">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setListingModeration(car.id, "approved")}
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500"
                    >
                      <CheckIcon className="h-3.5 w-3.5" /> Approve
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setListingModeration(car.id, "rejected", "Doesn't meet quality bar")
                      }
                      className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <XIcon className="h-3.5 w-3.5" /> Reject
                    </motion.button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Top sellers
              </p>
              <h2 className="text-lg font-bold text-slate-900">By engagement</h2>
            </div>
            <Link
              href="/admin/sellers"
              className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#f75d34] hover:bg-orange-100"
            >
              View all
            </Link>
          </div>
          {topSellers.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center py-10 text-center">
              <SellerIcon className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No sellers yet</p>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {topSellers.map((s, i) => (
                <li
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f75d34] to-[#ffb199] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {s.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {s.count} listings • {s.views.toLocaleString("en-IN")} views
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    {s.inquiries} inq
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Featured listings
              </p>
              <h2 className="text-lg font-bold text-slate-900">
                Curated for buyers
              </h2>
            </div>
            <Link
              href="/admin/listings?filter=featured"
              className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#f75d34] hover:bg-orange-100"
            >
              Manage
            </Link>
          </div>
          {featured.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center">
              <StarIcon className="mx-auto h-8 w-8 text-amber-400" />
              <p className="mt-3 text-sm font-semibold text-slate-800">
                No featured listings yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Mark high-quality listings as featured to surface them on the
                homepage.
              </p>
            </div>
          ) : (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {featured.slice(0, 4).map((car) => (
                <li
                  key={car.id}
                  className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50/50 p-3"
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
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-900">
                      {car.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {car.location} • {car.price}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleFeatured(car.id, false)}
                      className="mt-1 text-[10px] font-semibold text-amber-700 hover:underline"
                    >
                      Remove featured
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Activity log
              </p>
              <h2 className="text-lg font-bold text-slate-900">Recent actions</h2>
            </div>
          </div>
          {recentActivity.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">
              Your admin actions will appear here.
            </p>
          ) : (
            <ul className="mt-5 space-y-3">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex gap-3">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#f75d34]/10 text-[10px] text-[#f75d34]">
                    •
                  </span>
                  <div>
                    <p className="text-sm text-slate-800">{a.message}</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(a.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-[#0f172a] to-[#1e1b4b] p-6 text-white shadow-sm sm:p-8">
        <div className="grid items-center gap-6 sm:grid-cols-[2fr_1fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-300">
              Quick links
            </p>
            <h3 className="mt-2 text-xl font-bold sm:text-2xl">
              Power up your operations
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              Jump straight to your most-used admin workflows.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { href: "/admin/listings", label: "Listings", Icon: CarsIcon },
                { href: "/admin/payments", label: "Payments", Icon: PaymentsIcon },
                { href: "/admin/sellers", label: "Sellers", Icon: SellerIcon },
                { href: "/admin/buyers", label: "Buyers", Icon: BuyerIcon },
              ].map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-[#f75d34]/40 hover:bg-white/10"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f75d34]/20 text-[#ffb199]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold">{label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-5 text-xs">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-200">
              Health snapshot
            </p>
            <Row label="Auto approve" value={settings.autoApproveListings ? "ON" : "OFF"} />
            <Row label="Maintenance mode" value={settings.maintenanceMode ? "ENABLED" : "Off"} />
            <Row label="Blocked users" value={`${users.filter((u) => u.status === "blocked").length}`} />
            <Row label="Flagged listings" value={`${userListings.filter((l) => l.flagged).length}`} />
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
      <span className="text-slate-300">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
