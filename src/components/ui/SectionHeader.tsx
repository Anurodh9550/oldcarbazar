import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={cn("section-title-lg", eyebrow && "mt-2")}>{title}</h2>
      {subtitle && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
