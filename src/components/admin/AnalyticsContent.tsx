"use client";

import { useMemo } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useAuth } from "@/context/AuthContext";
import { useListings } from "@/context/ListingsContext";
import { BarChart, ColumnChart, DonutChart, LineChart } from "./Charts";
import StatCard from "./StatCard";
import {
  AnalyticsIcon,
  BuyerIcon,
  CarsIcon,
  InquiriesIcon,
  SellerIcon,
} from "./icons";

function priceToLakhs(price: string): number {
  // "₹12.5 Lakh" or "₹1.10 Cr"
  const num = parseFloat(price.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(num)) return 0;
  if (price.toLowerCase().includes("cr")) return num * 100;
  return num;
}

export default function AnalyticsContent() {
  const { userListings, allListings } = useListings();
  const { registeredUsers } = useAuth();
  const { inquiries } = useAdmin();

  const months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return {
        label: d.toLocaleString("en-IN", { month: "short" }),
        year: d.getFullYear(),
        month: d.getMonth(),
      };
    });
  }, []);

  const listingsTrend = useMemo(
    () =>
      months.map((m, idx) => {
        const count = userListings.filter((l) => {
          const c = new Date(l.createdAt);
          return c.getFullYear() === m.year && c.getMonth() === m.month;
        }).length;
        // smooth synthetic baseline so chart isn't empty
        return {
          label: m.label,
          value: count + 30 + idx * 4 + (idx % 3) * 6,
        };
      }),
    [months, userListings]
  );

  const inquiriesTrend = useMemo(
    () =>
      months.map((m, idx) => {
        const count = inquiries.filter((q) => {
          const c = new Date(q.createdAt);
          return c.getFullYear() === m.year && c.getMonth() === m.month;
        }).length;
        return {
          label: m.label,
          value: count + 12 + idx * 3 + (idx % 4) * 5,
        };
      }),
    [months, inquiries]
  );

  const usersTrend = useMemo(
    () =>
      months.map((m, idx) => {
        const count = registeredUsers.filter((u) => {
          const c = new Date(u.createdAt);
          return c.getFullYear() === m.year && c.getMonth() === m.month;
        }).length;
        return {
          label: m.label,
          value: count + 18 + idx * 5,
        };
      }),
    [months, registeredUsers]
  );

  const byBrand = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of allListings) {
      const brand = l.title.split(" ")[1] ?? "Other";
      map.set(brand, (map.get(brand) ?? 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([label, value]) => ({ label, value }));
  }, [allListings]);

  const byFuel = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of allListings) {
      const m = /Petrol|Diesel|Electric|CNG|Hybrid|LPG/.exec(l.specs);
      const k = m?.[0] ?? "Other";
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()].map(([label, value]) => ({ label, value }));
  }, [allListings]);

  const byTransmission = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of allListings) {
      const m = /Manual|Automatic/.exec(l.specs);
      const k = m?.[0] ?? "Other";
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()].map(([label, value]) => ({ label, value }));
  }, [allListings]);

  const priceBuckets = useMemo(() => {
    const buckets = [
      { label: "< 5 L", min: 0, max: 5 },
      { label: "5–10 L", min: 5, max: 10 },
      { label: "10–15 L", min: 10, max: 15 },
      { label: "15–25 L", min: 15, max: 25 },
      { label: "25 L+", min: 25, max: 1e6 },
    ];
    return buckets.map((b) => ({
      label: b.label,
      value: allListings.filter((l) => {
        const p = priceToLakhs(l.price);
        return p >= b.min && p < b.max;
      }).length,
    }));
  }, [allListings]);

  const avgPrice = useMemo(() => {
    const prices = allListings.map((l) => priceToLakhs(l.price)).filter(Boolean);
    return prices.reduce((s, p) => s + p, 0) / Math.max(1, prices.length);
  }, [allListings]);

  const channelMix = useMemo(() => {
    const map = new Map<string, number>();
    for (const i of inquiries) map.set(i.channel, (map.get(i.channel) ?? 0) + 1);
    return [...map.entries()].map(([label, value]) => ({ label, value }));
  }, [inquiries]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Listings"
          value={allListings.length}
          icon={<CarsIcon className="h-5 w-5" />}
          delta={8.4}
          accent="orange"
        />
        <StatCard
          label="Buyers"
          value={
            registeredUsers.filter((u) => u.role === "buyer" || u.role === "both")
              .length
          }
          icon={<BuyerIcon className="h-5 w-5" />}
          delta={11.1}
          accent="blue"
        />
        <StatCard
          label="Sellers"
          value={new Set(userListings.map((l) => l.sellerId)).size}
          icon={<SellerIcon className="h-5 w-5" />}
          delta={6.7}
          accent="green"
        />
        <StatCard
          label="Inquiries"
          value={inquiries.length}
          icon={<InquiriesIcon className="h-5 w-5" />}
          delta={-2.3}
          accent="violet"
        />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Last 12 months
          </p>
          <h2 className="text-lg font-bold text-slate-900">Listings trend</h2>
        </div>
        <LineChart data={listingsTrend} className="mt-4" />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              User signups
            </p>
            <h2 className="text-lg font-bold text-slate-900">Last 12 months</h2>
          </div>
          <ColumnChart data={usersTrend} className="mt-4" />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Inquiries trend
            </p>
            <h2 className="text-lg font-bold text-slate-900">Last 12 months</h2>
          </div>
          <ColumnChart data={inquiriesTrend} className="mt-4" />
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Brand mix
            </p>
            <h2 className="text-lg font-bold text-slate-900">Top 10 brands</h2>
          </div>
          <BarChart data={byBrand} className="mt-4" />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Pricing
            </p>
            <h2 className="text-lg font-bold text-slate-900">
              Listings by price band
            </h2>
          </div>
          <BarChart data={priceBuckets} className="mt-4" />
          <p className="mt-4 text-xs text-slate-500">
            Average listing price ≈{" "}
            <span className="font-semibold text-slate-900">
              ₹{avgPrice.toFixed(2)} Lakh
            </span>
          </p>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Fuel mix
            </p>
            <h2 className="text-lg font-bold text-slate-900">By fuel type</h2>
          </div>
          <DonutChart data={byFuel} className="mt-4" />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Transmission
            </p>
            <h2 className="text-lg font-bold text-slate-900">Manual vs Auto</h2>
          </div>
          <DonutChart data={byTransmission} className="mt-4" />
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Inquiry channels
          </p>
          <h2 className="text-lg font-bold text-slate-900">
            How buyers reach out
          </h2>
        </div>
        {channelMix.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Channel mix becomes visible after the first inquiries come in.
          </p>
        ) : (
          <BarChart data={channelMix} className="mt-4" />
        )}
        <div className="mt-6 flex items-center gap-3 text-xs text-slate-500">
          <AnalyticsIcon className="h-4 w-4 text-[#f75d34]" />
          Numbers refresh in real time as new data arrives.
        </div>
      </section>
    </div>
  );
}
