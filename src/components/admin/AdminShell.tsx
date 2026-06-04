"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { useListings } from "@/context/ListingsContext";
import { adminRoleColors, adminRoleLabels } from "@/data/admin";
import {
  AnalyticsIcon,
  ArrowUpRightIcon,
  BellIcon,
  BuyerIcon,
  CarsIcon,
  ChevronDownIcon,
  CitiesIcon,
  CloseIcon,
  DashboardIcon,
  InquiriesIcon,
  LoanToolsIcon,
  LogoutIcon,
  MenuIcon,
  PaymentsIcon,
  SearchIcon,
  SellerIcon,
  SettingsIcon,
  UsersIcon,
} from "./icons";

type NavItem = {
  href: string;
  label: string;
  Icon: (p: { className?: string }) => React.JSX.Element;
  badgeKey?: "pending" | "flagged" | "new-inquiries";
};

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", Icon: DashboardIcon },
  { href: "/admin/listings", label: "All Listings", Icon: CarsIcon, badgeKey: "pending" },
  { href: "/admin/users", label: "All Users", Icon: UsersIcon },
  { href: "/admin/buyers", label: "Buyers", Icon: BuyerIcon },
  { href: "/admin/sellers", label: "Sellers", Icon: SellerIcon },
  { href: "/admin/inquiries", label: "Inquiries", Icon: InquiriesIcon, badgeKey: "new-inquiries" },
  { href: "/admin/payments", label: "Payments", Icon: PaymentsIcon },
  { href: "/admin/loan-tools", label: "Loan & Tools", Icon: LoanToolsIcon },
  { href: "/admin/analytics", label: "Analytics", Icon: AnalyticsIcon },
  { href: "/admin/cities", label: "Cities", Icon: CitiesIcon },
  { href: "/admin/settings", label: "Settings", Icon: SettingsIcon },
];

const titleMap: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Overview",
    subtitle: "Real-time pulse of your marketplace",
  },
  "/admin/listings": {
    title: "Listings",
    subtitle: "Approve, feature, and moderate seller ads",
  },
  "/admin/users": {
    title: "Users",
    subtitle: "Every buyer, seller and dealer on the platform",
  },
  "/admin/buyers": {
    title: "Buyers",
    subtitle: "Demand side — interest, inquiries and activity",
  },
  "/admin/sellers": {
    title: "Sellers",
    subtitle: "Supply side — verified sellers and their listings",
  },
  "/admin/inquiries": {
    title: "Inquiries",
    subtitle: "All buyer ↔ seller messages",
  },
  "/admin/payments": {
    title: "Payments",
    subtitle: "Subscriptions & boosts — who paid, how much, transaction IDs",
  },
  "/admin/loan-tools": {
    title: "Loan & Tools — Option by Features",
    subtitle:
      "Manage loan pages, bank offers, eligibility copy and car-tool features",
  },
  "/admin/analytics": {
    title: "Analytics",
    subtitle: "Deep dive into listings, brands and inquiries",
  },
  "/admin/cities": {
    title: "Cities",
    subtitle: "City-level supply, demand and price stats",
  },
  "/admin/settings": {
    title: "Settings",
    subtitle: "Platform configuration and admin preferences",
  },
};

function resolveTitle(pathname: string) {
  if (pathname.startsWith("/admin/listings/")) {
    return { title: "Listing details", subtitle: "Detailed listing view" };
  }
  if (pathname.startsWith("/admin/users/")) {
    return { title: "User profile", subtitle: "Detailed user information" };
  }
  return (
    titleMap[pathname] ?? { title: "Admin", subtitle: "Manage your marketplace" }
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/admin";
  const router = useRouter();
  const { admin, logout, inquiries, activity, users } = useAdmin();
  const { userListings } = useListings();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");

  const handleGlobalSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = globalQuery.trim();
    if (!q) return;
    // Route to whichever admin section the operator is in (or All Listings
    // as a sensible default), with the query carried as `?q=`.
    let target = "/admin/listings";
    if (pathname.startsWith("/admin/users")) target = "/admin/users";
    else if (pathname.startsWith("/admin/buyers")) target = "/admin/buyers";
    else if (pathname.startsWith("/admin/sellers")) target = "/admin/sellers";
    else if (pathname.startsWith("/admin/inquiries"))
      target = "/admin/inquiries";
    router.push(`${target}?q=${encodeURIComponent(q)}`);
  };

  const pendingCount = userListings.filter(
    (l) => (l.moderation ?? "approved") === "pending"
  ).length;
  const flaggedCount = userListings.filter((l) => l.flagged).length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const blockedUsers = users.filter((u) => u.status === "blocked").length;

  const badges: Record<string, number> = useMemo(
    () => ({
      pending: pendingCount,
      flagged: flaggedCount,
      "new-inquiries": newInquiries,
    }),
    [pendingCount, flaggedCount, newInquiries]
  );

  const { title, subtitle } = resolveTitle(pathname);

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-[#f4f6fb] text-slate-900">
      {/* Sidebar overlay (mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            aria-label="Close menu"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        key={pathname}
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200/60 bg-[#0f172a] text-slate-200 transition-transform duration-300 lg:sticky lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-5">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f75d34] text-base font-black text-white">
              OB
            </span>
            <div>
              <p className="text-sm font-bold leading-tight text-white">
                Old Car Bazar
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">
                Admin Panel
              </p>
            </div>
          </Link>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-300 hover:bg-white/5 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Main
          </p>
          <ul className="space-y-1">
            {navItems.map(({ href, label, Icon, badgeKey }) => {
              const active = isActive(href);
              const badge = badgeKey ? badges[badgeKey] : 0;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => {
                      setSidebarOpen(false);
                      setNotifOpen(false);
                      setProfileOpen(false);
                    }}
                    className={`group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-[#f75d34]/15 text-orange-100 ring-1 ring-[#f75d34]/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        className={`h-[18px] w-[18px] ${
                          active ? "text-[#f75d34]" : "text-slate-400 group-hover:text-white"
                        }`}
                      />
                      {label}
                    </span>
                    {badge > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          active
                            ? "bg-[#f75d34] text-white"
                            : "bg-white/10 text-orange-200"
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/5 px-3 py-4">
          <div className="rounded-xl bg-gradient-to-br from-[#f75d34]/20 to-[#1d2640] p-4 ring-1 ring-white/5">
            <div className="flex items-center gap-3">
              {admin?.avatar ? (
                <Image
                  src={admin.avatar}
                  alt={admin.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-[#f75d34]/30"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f75d34] text-sm font-bold text-white">
                  {(admin?.name ?? "A").slice(0, 1)}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {admin?.name ?? "Admin"}
                </p>
                <p className="truncate text-[10px] text-slate-400">
                  {admin?.email}
                </p>
              </div>
            </div>
            {admin && (
              <span
                className={`mt-3 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${adminRoleColors[admin.role]}`}
              >
                {adminRoleLabels[admin.role]}
              </span>
            )}
            <div className="mt-4 flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-center text-[11px] font-semibold text-white hover:bg-white/15"
              >
                <span className="inline-flex items-center justify-center gap-1">
                  Visit site <ArrowUpRightIcon className="h-3 w-3" />
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="rounded-lg bg-white/10 p-2 text-slate-200 hover:bg-red-500 hover:text-white"
              >
                <LogoutIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <MenuIcon className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f75d34]">
                {pathname.startsWith("/admin/") && pathname !== "/admin"
                  ? "Admin"
                  : "Welcome back"}
              </p>
              <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                {title}
              </h1>
              <p className="hidden truncate text-xs text-slate-500 sm:block">
                {subtitle}
              </p>
            </div>

            <form
              onSubmit={handleGlobalSearch}
              role="search"
              className="hidden flex-1 max-w-md md:block"
            >
              <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm focus-within:border-[#f75d34] focus-within:ring-2 focus-within:ring-[#f75d34]/20">
                <button
                  type="submit"
                  aria-label="Search admin records"
                  className="text-slate-400 hover:text-[#f75d34]"
                >
                  <SearchIcon className="h-4 w-4" />
                </button>
                <input
                  type="search"
                  value={globalQuery}
                  onChange={(e) => setGlobalQuery(e.target.value)}
                  placeholder="Search listings, users, inquiries…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
                <span className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 sm:inline">
                  ↵
                </span>
              </label>
            </form>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen((o) => !o);
                    setProfileOpen(false);
                  }}
                  className="relative rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-[#f75d34] hover:text-[#f75d34]"
                  aria-label="Notifications"
                >
                  <BellIcon className="h-4 w-4" />
                  {(pendingCount + newInquiries + flaggedCount + blockedUsers) > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#f75d34] px-1 text-[9px] font-bold text-white">
                      {pendingCount + newInquiries + flaggedCount + blockedUsers}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-40 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                    >
                      <div className="border-b border-slate-100 px-4 py-3">
                        <p className="text-sm font-bold text-slate-900">
                          Notifications
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Latest activity in your admin panel
                        </p>
                      </div>
                      <ul className="max-h-80 divide-y divide-slate-50 overflow-y-auto">
                        {pendingCount > 0 && (
                          <li>
                            <Link
                              href="/admin/listings?filter=pending"
                              className="flex items-start gap-3 px-4 py-3 hover:bg-orange-50/60"
                            >
                              <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                                <CarsIcon className="h-4 w-4" />
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {pendingCount} listing{pendingCount === 1 ? "" : "s"} awaiting approval
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  Review and approve new ads
                                </p>
                              </div>
                            </Link>
                          </li>
                        )}
                        {newInquiries > 0 && (
                          <li>
                            <Link
                              href="/admin/inquiries"
                              className="flex items-start gap-3 px-4 py-3 hover:bg-orange-50/60"
                            >
                              <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                <InquiriesIcon className="h-4 w-4" />
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {newInquiries} new inquir{newInquiries === 1 ? "y" : "ies"}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  Buyers waiting for response
                                </p>
                              </div>
                            </Link>
                          </li>
                        )}
                        {flaggedCount > 0 && (
                          <li>
                            <Link
                              href="/admin/listings?filter=flagged"
                              className="flex items-start gap-3 px-4 py-3 hover:bg-red-50"
                            >
                              <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700">
                                <CarsIcon className="h-4 w-4" />
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {flaggedCount} flagged listing{flaggedCount === 1 ? "" : "s"}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  Needs your attention
                                </p>
                              </div>
                            </Link>
                          </li>
                        )}
                        {activity.slice(0, 5).map((a) => (
                          <li key={a.id} className="px-4 py-3">
                            <p className="text-xs text-slate-700">{a.message}</p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(a.createdAt).toLocaleString("en-IN")}
                            </p>
                          </li>
                        ))}
                        {pendingCount === 0 &&
                          newInquiries === 0 &&
                          flaggedCount === 0 &&
                          activity.length === 0 && (
                            <li className="px-4 py-10 text-center text-sm text-slate-400">
                              You&apos;re all caught up.
                            </li>
                          )}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen((o) => !o);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium text-slate-700 transition hover:border-[#f75d34] hover:text-[#f75d34]"
                >
                  {admin?.avatar ? (
                    <Image
                      src={admin.avatar}
                      alt={admin.name}
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f75d34] text-xs font-bold text-white">
                      {(admin?.name ?? "A").slice(0, 1)}
                    </span>
                  )}
                  <span className="hidden max-w-[120px] truncate sm:inline">
                    {admin?.name?.split(" ")[0] ?? "Admin"}
                  </span>
                  <ChevronDownIcon
                    className={`h-3 w-3 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-40 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                    >
                      <div className="border-b border-slate-100 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {admin?.name}
                        </p>
                        <p className="truncate text-[11px] text-slate-500">
                          {admin?.email}
                        </p>
                        {admin && (
                          <span
                            className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${adminRoleColors[admin.role]}`}
                          >
                            {adminRoleLabels[admin.role]}
                          </span>
                        )}
                      </div>
                      <ul className="py-1 text-sm">
                        <li>
                          <Link
                            href="/admin/settings"
                            className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                          >
                            Account settings
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/"
                            target="_blank"
                            className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                          >
                            Visit storefront
                          </Link>
                        </li>
                      </ul>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        <LogoutIcon className="h-4 w-4" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
