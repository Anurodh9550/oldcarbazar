import { cn } from "@/lib/cn";

export type FeatureIconName =
  | "car"
  | "sell"
  | "chart"
  | "bank"
  | "shield"
  | "user"
  | "free"
  | "map"
  | "auction"
  | "garage";

const paths: Record<FeatureIconName, React.ReactNode> = {
  car: (
    <path
      fill="currentColor"
      d="M5 11l1.5-4h11L19 11v5h-2v-2H7v2H5v-5zm2.2-2h9.6l-.8-2H8l-.8 2zM7 14.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
    />
  ),
  sell: (
    <path
      fill="currentColor"
      d="M12 2C9.8 2 8 3.8 8 6v1H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2V6c0-2.2-1.8-4-4-4zm0 2c1.1 0 2 .9 2 2v1h-4V6c0-1.1.9-2 2-2z"
    />
  ),
  chart: (
    <path
      fill="currentColor"
      d="M5 19V9h3v10H5zm5-6v6h3v-6h-3zm5-4v10h3V9h-3z"
    />
  ),
  bank: (
    <path
      fill="currentColor"
      d="M4 10v8h2v-3h12v3h2v-8l-8-5-8 5zm8 0l5 3.1V16h-2v-2H9v2H7v-2.9L12 10z"
    />
  ),
  shield: (
    <path
      fill="currentColor"
      d="M12 2l8 3v6c0 5-3.4 9.7-8 11-4.6-1.3-8-6-8-11V5l8-3zm0 2.2L6 6.3V11c0 3.8 2.5 7.4 6 8.7 3.5-1.3 6-4.9 6-8.7V6.3l-6-2.1z"
    />
  ),
  user: (
    <path
      fill="currentColor"
      d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0H5z"
    />
  ),
  free: (
    <path
      fill="currentColor"
      d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5v4h4v2h-6V7h2z"
    />
  ),
  map: (
    <path
      fill="currentColor"
      d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
    />
  ),
  auction: (
    <path
      fill="currentColor"
      d="M14 3l7 7-9 9H5v-7l9-9zm0 3.4L8 12.4V17h4.6l6-6-4.6-4.6zM4 19h16v2H4v-2z"
    />
  ),
  garage: (
    <path
      fill="currentColor"
      d="M4 10v10h6v-6h4v6h6V10L12 3 4 10zm8 0h8v2h-8v-2z"
    />
  ),
};

type FeatureIconProps = {
  name: FeatureIconName;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

export default function FeatureIcon({
  name,
  className,
  size = "md",
}: FeatureIconProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f75d34]/12 to-[#f75d34]/5 text-[#f75d34] ring-1 ring-[#f75d34]/15",
        sizeMap[size],
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-1/2 w-1/2">
        {paths[name]}
      </svg>
    </span>
  );
}
