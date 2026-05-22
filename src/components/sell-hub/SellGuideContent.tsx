"use client";

import Link from "next/link";
import { sellGuideSteps } from "@/data/sellHubPages";

export default function SellGuideContent() {
  return (
    <div>
      <div className="relative">
        <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-gradient-to-b from-[#f75d34] to-gray-200 lg:block" />
        <ul className="space-y-8">
          {sellGuideSteps.map((item) => (
            <li key={item.step} className="relative flex gap-6 lg:pl-16">
              <span className="absolute left-0 hidden h-12 w-12 items-center justify-center rounded-full bg-[#f75d34] text-lg font-bold text-white shadow-lg lg:flex">
                {item.step}
              </span>
              <div className="flex-1 rounded-2xl border border-gray-100 bg-gray-50 p-6 transition hover:border-[#f75d34]/30 hover:shadow-md">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow-sm lg:hidden">
                  {item.icon}
                </span>
                <span className="mt-2 inline-block text-xs font-bold text-[#f75d34] lg:hidden">
                  Step {item.step}
                </span>
                <h3 className="mt-2 section-title">{item.title}</h3>
                <p className="mt-2 text-body-muted">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#f75d34] to-[#e54d24] p-6 sm:flex-row sm:p-8">
        <div className="text-center text-white sm:text-left">
          <p className="text-lg font-bold">Ready to sell?</p>
          <p className="mt-1 text-sm text-orange-100">Start your free listing in 2 minutes</p>
        </div>
        <Link
          href="/sell-car"
          className="shrink-0 rounded-full bg-white px-8 py-3 text-sm font-bold text-[#f75d34] hover:bg-orange-50"
        >
          Sell Car Free
        </Link>
      </div>
    </div>
  );
}
