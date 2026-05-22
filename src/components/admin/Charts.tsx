"use client";

import { motion } from "framer-motion";

type Datum = { label: string; value: number; color?: string };

const palette = [
  "#f75d34",
  "#0ea5e9",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
  "#22c55e",
  "#f43f5e",
  "#3b82f6",
];

/** Horizontal bar chart. Clean, dependency-free SVG. */
export function BarChart({
  data,
  unit = "",
  className = "",
}: {
  data: Datum[];
  unit?: string;
  className?: string;
}) {
  if (!data.length) {
    return <EmptyChart className={className} />;
  }
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className={`space-y-3 ${className}`}>
      {data.map((d, i) => {
        const w = (d.value / max) * 100;
        const c = d.color ?? palette[i % palette.length];
        return (
          <li key={d.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">{d.label}</span>
              <span className="font-semibold text-slate-900">
                {d.value.toLocaleString("en-IN")}
                {unit && <span className="ml-1 text-slate-400">{unit}</span>}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${w}%` }}
                transition={{ duration: 0.7, delay: i * 0.05 }}
                className="h-full rounded-full"
                style={{ backgroundColor: c }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Vertical sparkline-style bar chart for time series. */
export function ColumnChart({
  data,
  height = 180,
  className = "",
}: {
  data: Datum[];
  height?: number;
  className?: string;
}) {
  if (!data.length) {
    return <EmptyChart className={className} />;
  }
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className={className}>
      <div
        className="flex items-end gap-2 px-2"
        style={{ height }}
        aria-hidden
      >
        {data.map((d, i) => {
          const h = Math.max(4, (d.value / max) * (height - 30));
          return (
            <div
              key={d.label}
              className="group relative flex flex-1 flex-col items-center"
            >
              <span className="mb-1 text-[10px] font-semibold text-slate-500 opacity-0 transition group-hover:opacity-100">
                {d.value}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: h }}
                transition={{ duration: 0.55, delay: i * 0.04 }}
                className="w-full rounded-t-md bg-gradient-to-t from-[#f75d34] to-[#fb8b6c]"
                style={{ minHeight: 4 }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2 px-2">
        {data.map((d) => (
          <span
            key={d.label}
            className="flex-1 text-center text-[10px] font-medium text-slate-500"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Smooth line chart with area gradient. */
export function LineChart({
  data,
  height = 200,
  className = "",
}: {
  data: Datum[];
  height?: number;
  className?: string;
}) {
  if (data.length < 2) {
    return <EmptyChart className={className} />;
  }
  const width = 600;
  const padding = 24;
  const max = Math.max(1, ...data.map((d) => d.value));
  const stepX = (width - padding * 2) / (data.length - 1);

  const points = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (d.value / max) * (height - padding * 2);
    return { x, y, ...d };
  });

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${path} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ocb-line-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f75d34" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f75d34" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={padding}
            x2={width - padding}
            y1={padding + (i * (height - padding * 2)) / 3}
            y2={padding + (i * (height - padding * 2)) / 3}
            stroke="#e2e8f0"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
        ))}
        <path d={areaPath} fill="url(#ocb-line-fill)" />
        <path
          d={path}
          fill="none"
          stroke="#f75d34"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke="#f75d34" strokeWidth="2" />
          </g>
        ))}
      </svg>
      <div className="mt-2 flex gap-1 px-1">
        {data.map((d) => (
          <span
            key={d.label}
            className="flex-1 text-center text-[10px] font-medium text-slate-500"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Donut chart with center label. */
export function DonutChart({
  data,
  label,
  total,
  className = "",
}: {
  data: Datum[];
  label?: string;
  total?: number;
  className?: string;
}) {
  const sum = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = 60;
  const stroke = 18;
  const circumference = 2 * Math.PI * radius;

  const segments = data.reduce<
    { label: string; color: string; dash: string; offset: number }[]
  >((acc, d, i) => {
    const ratio = d.value / sum;
    const length = ratio * circumference;
    const prevOffset = acc.length
      ? acc[acc.length - 1].offset +
        parseFloat(acc[acc.length - 1].dash.split(" ")[0])
      : 0;
    acc.push({
      label: d.label,
      color: d.color ?? palette[i % palette.length],
      dash: `${length} ${circumference - length}`,
      offset: prevOffset,
    });
    return acc;
  }, []);

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <svg viewBox="-80 -80 160 160" className="h-40 w-40 -rotate-90">
        <circle
          r={radius}
          fill="transparent"
          stroke="#f1f5f9"
          strokeWidth={stroke}
        />
        {segments.map((seg) => (
          <circle
            key={seg.label}
            r={radius}
            fill="transparent"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={seg.dash}
            strokeDashoffset={-seg.offset}
            strokeLinecap="butt"
          />
        ))}
        <text
          x="0"
          y="-2"
          textAnchor="middle"
          className="rotate-90 fill-slate-900 text-[14px] font-bold"
          transform="rotate(90)"
        >
          {(total ?? sum).toLocaleString("en-IN")}
        </text>
        <text
          x="0"
          y="14"
          textAnchor="middle"
          className="rotate-90 fill-slate-500 text-[9px] font-medium uppercase tracking-wider"
          transform="rotate(90)"
        >
          {label ?? "Total"}
        </text>
      </svg>
      <ul className="flex-1 space-y-2">
        {data.map((d, i) => {
          const color = d.color ?? palette[i % palette.length];
          const pct = ((d.value / sum) * 100).toFixed(0);
          return (
            <li key={d.label} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-700">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {d.label}
              </span>
              <span className="font-semibold text-slate-900">
                {d.value.toLocaleString("en-IN")}{" "}
                <span className="text-slate-400">({pct}%)</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function EmptyChart({ className }: { className?: string }) {
  return (
    <div
      className={`flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400 ${className}`}
    >
      Not enough data yet
    </div>
  );
}
