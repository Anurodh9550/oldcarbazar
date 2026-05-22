"use client";

import Link from "next/link";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { usePathname } from "next/navigation";
import { sellHubNavGroups } from "@/data/sellHubPages";

type SellHubShellProps = {
  badge: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function SellHubShell({
  badge,
  title,
  subtitle,
  children,
}: SellHubShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f0f2f5]">
      <div className="relative overflow-hidden border-b border-orange-900/20 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #f75d34 0%, transparent 50%), radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:py-16">
          <Link
            href="/sell-car"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#ffb199]"
          >
            ← Back to Sell Car
          </Link>
          <span className="mt-4 eyebrow-sell">{badge}</span>
          <h1 className="shell-title">{title}</h1>
          <p className="shell-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex gap-6 overflow-x-auto py-3 scrollbar-hide">
            {sellHubNavGroups.map((group) => (
              <div className="flex shrink-0 items-center gap-2" key={group.title}>
                <span className="hidden text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:inline">
                  {group.title}
                </span>
                <nav className="flex gap-1">
                  {group.links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                          isActive
                            ? "bg-[#f75d34] text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {link.icon === "💬" ? (
                          <WhatsAppIcon size={16} />
                        ) : (
                          <span aria-hidden>{link.icon}</span>
                        )}
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:py-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
