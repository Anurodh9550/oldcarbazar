"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profileMenuItems } from "@/data/profileMenu";

type ProfileHubShellProps = {
  title: string;
  subtitle: string;
  badge?: string;
  children: React.ReactNode;
};

export default function ProfileHubShell({
  title,
  subtitle,
  badge = "My Account",
  children,
}: ProfileHubShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f0f2f5]">
      <div className="page-hero relative overflow-hidden border-b border-orange-200/30 bg-[#1a1a2e]">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1493238792000-8113da705763?w=1600&h=700&fit=crop')",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/95 via-[#2d2d44]/85 to-[#1a1a2e]/95"
        />
        <div
          aria-hidden
          className="absolute -top-16 right-0 h-64 w-64 rounded-full bg-[#f75d34]/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:py-12">
          <span className="eyebrow-sell">{badge}</span>
          <h1 className="shell-title">{title}</h1>
          <p className="shell-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {profileMenuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
                    isActive
                      ? "bg-[#f75d34] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
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
