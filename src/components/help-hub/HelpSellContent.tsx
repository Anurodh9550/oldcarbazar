import Link from "next/link";
import { helpSellSteps } from "@/data/helpHubPages";

export default function HelpSellContent() {
  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {helpSellSteps.map((item) => (
          <li key={item.step} className="rounded-2xl border border-gray-100 p-5 hover:border-[#f75d34]/30 hover:shadow-md">
            <span className="text-2xl">{item.icon}</span>
            <span className="mt-3 block text-xs font-bold text-[#f75d34]">Step {item.step}</span>
            <h3 className="mt-1 font-bold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-body-muted">{item.desc}</p>
          </li>
        ))}
      </ul>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link href="/sell-car" className="rounded-xl bg-[#f75d34] p-5 text-center text-white hover:bg-[#e54d24]">
          <p className="font-bold">Sell Car Free</p>
          <p className="mt-1 text-sm text-orange-100">Start listing now</p>
        </Link>
        <Link href="/sell-guide" className="rounded-xl border border-gray-200 p-5 text-center hover:border-[#f75d34]">
          <p className="font-bold text-gray-900">Detailed Sell Guide</p>
          <p className="mt-1 text-caption sm:text-sm">Step-by-step walkthrough</p>
        </Link>
      </div>
    </div>
  );
}
