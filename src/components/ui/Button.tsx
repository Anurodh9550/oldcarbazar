import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-[#f75d34] text-white shadow-md shadow-orange-500/20 hover:bg-[#e54d24] active:scale-[0.98]",
  secondary:
    "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 active:scale-[0.98]",
  outline:
    "border border-gray-200 bg-white text-gray-800 hover:border-[#f75d34] hover:text-[#f75d34] active:scale-[0.98]",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "rounded-lg px-3 py-1.5 text-xs font-semibold",
  md: "rounded-xl px-5 py-2.5 text-sm font-semibold",
  lg: "rounded-xl px-8 py-3.5 text-sm font-bold",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f75d34] disabled:cursor-not-allowed disabled:opacity-60",
        variantClass[variant],
        sizeClass[size],
        className
      )}
      {...props}
    />
  );
}
