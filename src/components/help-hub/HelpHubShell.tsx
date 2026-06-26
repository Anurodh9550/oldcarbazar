"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { helpHubNavGroups } from "@/data/helpHubPages";

type HelpHubShellProps = {
  badge: string;
  title: string;
  subtitle: string;
  backHref?: string;
  backLabel?: string;
  showLanguageToggle?: boolean;
  badgeHi?: string;
  titleHi?: string;
  subtitleHi?: string;
  children: React.ReactNode;
};

export default function HelpHubShell({
  badge,
  title,
  subtitle,
  backHref = "/",
  backLabel = "Back to Home",
  showLanguageToggle = false,
  badgeHi,
  titleHi,
  subtitleHi,
  children,
}: HelpHubShellProps) {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();

  const isHi = showLanguageToggle && language === "hi";
  const displayBadge = isHi && badgeHi ? badgeHi : badge;
  const displayTitle = isHi && titleHi ? titleHi : title;
  const displaySubtitle = isHi && subtitleHi ? subtitleHi : subtitle;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f0f2f5]">
      <div className="page-hero relative overflow-hidden border-b border-slate-700/50 bg-[#0f172a]">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=700&fit=crop')",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/95 via-[#1e293b]/80 to-[#0f172a]/95"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 45%), radial-gradient(circle at 20% 80%, #f75d34 0%, transparent 40%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-[#f75d34]/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex items-start justify-between gap-4">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
            >
              ← {backLabel}
            </Link>
            {showLanguageToggle && (
              <div
                role="group"
                aria-label="Language selector"
                className="flex shrink-0 items-center rounded-full border border-white/20 bg-white/10 p-0.5 text-xs font-semibold backdrop-blur-sm"
              >
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  aria-pressed={language === "en"}
                  className={`rounded-full px-3 py-1 transition ${
                    language === "en"
                      ? "bg-[#f75d34] text-white shadow"
                      : "text-slate-200 hover:text-white"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  aria-pressed={language === "hi"}
                  className={`rounded-full px-3 py-1 transition ${
                    language === "hi"
                      ? "bg-[#f75d34] text-white shadow"
                      : "text-slate-200 hover:text-white"
                  }`}
                >
                  हिं
                </button>
              </div>
            )}
          </div>
          <span className="mt-4 eyebrow-dark">{displayBadge}</span>
          <h1 className="shell-title">{displayTitle}</h1>
          <p className="shell-subtitle">{displaySubtitle}</p>
        </div>
      </div>

      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex gap-4 overflow-x-auto py-3 scrollbar-hide sm:gap-6">
            {helpHubNavGroups.map((group) => (
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
                        className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition sm:px-3 sm:text-sm ${
                          isActive
                            ? "bg-slate-900 text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <span aria-hidden>{link.icon}</span>
                        <span className="hidden sm:inline">{link.label}</span>
                        <span className="sm:hidden">{link.label.split(" ")[0]}</span>
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
