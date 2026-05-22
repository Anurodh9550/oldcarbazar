import Link from "next/link";
import { buySteps } from "@/data/helpHubPages";

export default function HelpBuyContent() {
  return (
    <div>
      <ul className="space-y-6">
        {buySteps.map((item) => (
          <li key={item.step} className="flex gap-5 rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg text-white">
              {item.icon}
            </span>
            <div>
              <span className="text-xs font-bold text-[#f75d34]">Step {item.step}</span>
              <h3 className="mt-1 section-title">{item.title}</h3>
              <p className="mt-2 text-body-muted">{item.desc}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 sm:flex-row sm:p-8">
        <p className="text-center text-white sm:text-left">
          <span className="font-bold">Ready to find your car?</span>
          <span className="mt-1 block text-sm text-slate-300">Browse thousands of listings</span>
        </p>
        <Link href="/used-cars" className="rounded-full bg-[#f75d34] px-8 py-3 text-sm font-bold text-white">
          Browse Cars
        </Link>
      </div>
    </div>
  );
}
