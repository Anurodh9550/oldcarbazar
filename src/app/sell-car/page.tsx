import Header from "@/components/Header";
import SellCarPageContent from "@/components/SellCarPageContent";
import SellerPageShell from "@/components/seller/SellerPageShell";

export const metadata = {
  title: "Sell Your Car Free | Old Car Bazar",
  description: "Post your used car listing for free. Reach buyers in your city.",
};

const steps = [
  { n: "1", t: "Car & Contact", d: "Specs + your info" },
  { n: "2", t: "Price, Photos & More", d: "Price, city & photos" },
  { n: "3", t: "Review & Publish", d: "Go live" },
];

export default function SellCarPage() {
  return (
    <>
      <Header />
      <SellerPageShell
        badge="100% Free"
        title="Sell Your Car Free"
        subtitle="List your car in 3 simple steps. Zero commission — connect with buyers directly."
        variant="sell"
      >
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.n}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center transition hover:border-[#f75d34]/30 hover:bg-orange-50/50"
            >
              <span className="flex h-8 w-8 mx-auto items-center justify-center rounded-full bg-[#f75d34] text-sm font-bold text-white">
                {item.n}
              </span>
              <p className="mt-2 text-xs font-semibold text-gray-800">{item.t}</p>
              <p className="mt-0.5 text-[10px] text-gray-400">{item.d}</p>
            </div>
          ))}
        </div>
        <SellCarPageContent embedded />
      </SellerPageShell>
    </>
  );
}
