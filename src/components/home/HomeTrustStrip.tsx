"use client";

import { useSiteCopy } from "@/context/LanguageContext";

export default function HomeTrustStrip() {
  const copy = useSiteCopy();

  return (
    <section className="border-y border-gray-200/80 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4 lg:px-6">
        {copy.trustStrip.map((item) => (
          <div key={item.label} className="text-center sm:text-left">
            <p className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              {item.value}
            </p>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-gray-500 sm:text-sm sm:normal-case sm:tracking-normal">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
