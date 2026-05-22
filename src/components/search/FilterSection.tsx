"use client";

import { useState } from "react";

type FilterOption = {
  id: string;
  label: string;
  count?: number;
  hex?: string;
};

type FilterSectionProps = {
  title: string;
  options: FilterOption[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  defaultOpen?: boolean;
  type?: "checkbox" | "radio";
};

export default function FilterSection({
  title,
  options,
  selected,
  onSelect,
  defaultOpen = false,
  type = "checkbox",
}: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border-b border-gray-200 bg-white last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-bold text-gray-900 hover:bg-gray-50"
      >
        {title}
        <span className="text-lg font-normal text-gray-400">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-2">
          <ul className="space-y-2">
            {options.map((opt) => (
              <li key={opt.id}>
                <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-gray-700 hover:text-[#f75d34]">
                  <span className="flex items-center gap-2">
                    <input
                      type={type}
                      name={type === "radio" ? title : undefined}
                      checked={selected === opt.id}
                      onChange={() =>
                        onSelect(selected === opt.id ? null : opt.id)
                      }
                      className="h-4 w-4 border-gray-300 accent-[#f75d34]"
                    />
                    {opt.hex && (
                      <span
                        className="inline-block h-4 w-4 rounded border border-gray-200"
                        style={{ backgroundColor: opt.hex }}
                      />
                    )}
                    {opt.label}
                  </span>
                  {opt.count !== undefined && (
                    <span className="text-caption">{opt.count}</span>
                  )}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
