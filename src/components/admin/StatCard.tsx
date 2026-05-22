"use client";

import { motion } from "framer-motion";
import { ArrowUpRightIcon, ArrowDownIcon } from "./icons";

export type StatCardProps = {
  label: string;
  value: string | number;
  delta?: number;
  helper?: string;
  icon?: React.ReactNode;
  accent?: "orange" | "blue" | "green" | "violet" | "rose" | "slate";
  href?: string;
};

const accentMap: Record<NonNullable<StatCardProps["accent"]>, string> = {
  orange: "from-[#fff1ec] to-white text-[#f75d34]",
  blue: "from-blue-50 to-white text-blue-600",
  green: "from-emerald-50 to-white text-emerald-600",
  violet: "from-violet-50 to-white text-violet-600",
  rose: "from-rose-50 to-white text-rose-600",
  slate: "from-slate-100 to-white text-slate-700",
};

export default function StatCard({
  label,
  value,
  delta,
  helper,
  icon,
  accent = "orange",
}: StatCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div
        aria-hidden
        className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${accentMap[accent]} opacity-40`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold leading-tight text-slate-900">
            {typeof value === "number" ? value.toLocaleString("en-IN") : value}
          </p>
          {helper && (
            <p className="mt-1 truncate text-[11px] text-slate-500">{helper}</p>
          )}
        </div>
        {icon && (
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accentMap[accent]} shadow-sm`}
          >
            {icon}
          </span>
        )}
      </div>
      {typeof delta === "number" && (
        <div className="relative mt-4 flex items-center gap-1">
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
              positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {positive ? (
              <ArrowUpRightIcon className="h-3 w-3" />
            ) : (
              <ArrowDownIcon className="h-3 w-3" />
            )}
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-[11px] text-slate-500">vs last 30 days</span>
        </div>
      )}
    </motion.div>
  );
}
