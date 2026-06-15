"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sellerNav = [
  { href: "/sell-car", label: "Sell Car Free", icon: "🚗" },
  { href: "/post-ad", label: "Post Ad", icon: "⚡" },
  { href: "/my-listings", label: "My Listings", icon: "📋" },
  { href: "/leads", label: "Leads", icon: "🔔" },
  { href: "/seller", label: "Dashboard", icon: "📊" },
];

type SellerPageShellProps = {
  title: string;
  subtitle: string;
  badge?: string;
  children: React.ReactNode;
  variant?: "default" | "sell";
};

export default function SellerPageShell({
  title,
  subtitle,
  badge,
  children,
  variant = "default",
}: SellerPageShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f0f2f5]">
      <div className="relative overflow-hidden border-b border-orange-200/30 bg-[#1a1a2e]">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=700&fit=crop')",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/95 via-[#2d2d44]/85 to-[#1a1a2e]/95"
        />
        <div
          aria-hidden
          className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-[#f75d34]/25 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#f75d34]/15 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:py-14">
          {badge && (
            <span className="eyebrow-sell">{badge}</span>
          )}
          <h1 className="shell-title">{title}</h1>
          <p className="shell-subtitle">{subtitle}</p>
          <ul className="mt-6 flex flex-wrap gap-4 text-sm text-gray-300">
            <li className="flex items-center gap-1.5">
              <span className="text-[#f75d34]">✓</span> 100% Free listing
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-[#f75d34]">✓</span> Direct buyer contact
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-[#f75d34]">✓</span> No commission
            </li>
          </ul>
        </div>
      </div>

      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {sellerNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#f75d34] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span aria-hidden>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:py-10">
        <div className={variant === "sell" ? "grid gap-8 lg:grid-cols-[300px_1fr]" : ""}>
          {variant === "sell" && (
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-gray-900">Why sell here?</h2>
                  <ul className="mt-4 space-y-3 text-body-muted">
                    {[
                      "Reach thousands of buyers in your city",
                      "List in under 2 minutes",
                      "Chat directly — no middleman",
                      "Manage ads from your dashboard",
                    ].map((text) => (
                      <li key={text} className="flex gap-2">
                        <span className="mt-0.5 shrink-0 text-[#f75d34]">●</span>
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-[#f75d34] to-[#e54d24] p-6 text-white shadow-lg">
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-100">
                    Seller support
                  </p>
                  <p className="mt-2 text-sm">Mon–Sat, 9am–8pm</p>
                  <p className="mt-1 text-xl font-bold">support@oldcarbazar.com</p>
                </div>
              </div>
            </aside>
          )}

          <div
            className={
              variant === "sell"
                ? "min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                : "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
            }
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
