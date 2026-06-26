import type { ReactNode } from "react";

type PageHeroProps = {
  badge: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  maxWidth?: "5xl" | "6xl";
  children?: ReactNode;
  className?: string;
};

export default function PageHero({
  badge,
  title,
  subtitle,
  align = "left",
  maxWidth = "5xl",
  children,
  className = "",
}: PageHeroProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const widthClass = maxWidth === "6xl" ? "max-w-6xl" : "max-w-5xl";

  return (
    <section
      className={`page-hero relative overflow-hidden border-b border-orange-500/10 px-4 pb-12 pt-10 sm:px-8 lg:px-12 ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=700&fit=crop')",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-[#0f0f14] via-[#1a1a2e]/95 to-[#12121a]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(247, 93, 52, 0.45) 0%, transparent 42%), radial-gradient(circle at 10% 85%, rgba(247, 93, 52, 0.25) 0%, transparent 38%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        aria-hidden
        className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-[#f75d34]/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[#f75d34]/15 blur-3xl"
      />

      <div
        className={`relative mx-auto ${widthClass} ${alignClass}`}
      >
        <span className="eyebrow-sell">{badge}</span>
        <h1 className="shell-title">{title}</h1>
        {subtitle && (
          <p
            className={`shell-subtitle ${align === "center" ? "mx-auto" : ""}`}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
