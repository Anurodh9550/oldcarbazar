"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { loanToolsNavGroups } from "@/data/loanToolsPages";

type LoanToolsHubShellProps = {
  badge: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function LoanToolsHubShell({
  badge,
  title,
  subtitle,
  children,
}: LoanToolsHubShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f0f2f5]">
      <div className="relative overflow-hidden border-b border-slate-700/40 bg-gradient-to-br from-[#0b1e3f] via-[#15294d] to-[#0b1e3f]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #f75d34 0%, transparent 45%), radial-gradient(circle at 80% 70%, #3b82f6 0%, transparent 45%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#f75d34]/25 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
          >
            ← Back to Home
          </Link>
          <span className="mt-4 eyebrow-dark">{badge}</span>
          <h1 className="shell-title">{title}</h1>
          <p className="shell-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex gap-4 overflow-x-auto py-3 scrollbar-hide sm:gap-6">
            {loanToolsNavGroups.map((group) => (
              <div className="flex shrink-0 items-center gap-2" key={group.title}>
                <span className="hidden text-[10px] font-bold uppercase tracking-wider text-gray-400 lg:inline">
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
                        <span aria-hidden>{link.icon}</span>
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
