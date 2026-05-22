import Link from "next/link";
import { sellTips } from "@/data/sellHubPages";

export default function SellTipsContent() {
  return (
    <div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sellTips.map((tip, i) => (
          <li
            key={tip.title}
            className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-[#f75d34]/40 hover:shadow-lg"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f75d34]/10 text-sm font-bold text-[#f75d34]">
              {i + 1}
            </span>
            <span className="mt-4 inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-green-700">
              {tip.tag}
            </span>
            <h3 className="mt-3 font-bold text-gray-900">{tip.title}</h3>
            <p className="mt-2 text-body-muted">{tip.desc}</p>
          </li>
        ))}
      </ul>
      <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
        <p className="font-semibold text-gray-900">Apply these tips on your listing today</p>
        <Link
          href="/post-ad"
          className="mt-4 inline-block rounded-lg bg-[#f75d34] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#e54d24]"
        >
          Post Ad Now
        </Link>
      </div>
    </div>
  );
}
