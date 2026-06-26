export type SellerResponseTier = "new" | "fast" | "good" | "slow";

const RESPONSE_META: Record<
  SellerResponseTier,
  { label: string; className: string }
> = {
  fast: {
    label: "⚡ Fast Responder",
    className: "bg-emerald-600 text-white",
  },
  good: {
    label: "✓ Good Responder",
    className: "bg-teal-600 text-white",
  },
  slow: {
    label: "Slow to reply",
    className: "bg-amber-100 text-amber-800",
  },
  new: {
    label: "New seller",
    className: "bg-slate-100 text-slate-600",
  },
};

type TrustBadgesProps = {
  hasVideoProof?: boolean;
  truthDeclared?: boolean;
  sellerResponseTier?: SellerResponseTier;
  compact?: boolean;
  className?: string;
};

export default function TrustBadges({
  hasVideoProof,
  truthDeclared,
  sellerResponseTier = "new",
  compact = false,
  className = "",
}: TrustBadgesProps) {
  const items: { key: string; label: string; className: string }[] = [];

  if (truthDeclared) {
    items.push({
      key: "truth",
      label: compact ? "✓ Sachchai" : "✓ Gaadi Ki Sachchai",
      className: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    });
  }
  if (hasVideoProof) {
    items.push({
      key: "video",
      label: compact ? "▶ Video" : "▶ Video Proof",
      className: "bg-violet-50 text-violet-800 ring-violet-200",
    });
  }
  if (sellerResponseTier && sellerResponseTier !== "new") {
    const meta = RESPONSE_META[sellerResponseTier];
    items.push({
      key: "response",
      label: meta.label,
      className: meta.className,
    });
  }

  if (items.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {items.map((item) => (
        <span
          key={item.key}
          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${item.className}`}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function getResponseTierLabel(tier?: SellerResponseTier): string {
  if (!tier) return RESPONSE_META.new.label;
  return RESPONSE_META[tier]?.label ?? RESPONSE_META.new.label;
}
