import Header from "@/components/Header";
import SellCarPageContent from "@/components/SellCarPageContent";
import SellerPageShell from "@/components/seller/SellerPageShell";

export const metadata = {
  title: "Post Ad in 2 Minutes | Old Car Bazar",
  description: "Quickly post your used car ad for free on Old Car Bazar.",
};

export default function PostAdPage() {
  return (
    <>
      <Header />
      <SellerPageShell
        badge="⚡ Fast listing"
        title="Post Ad in 2 Minutes"
        subtitle="Sirf 3 quick steps — car & contact, price & photos, review. Bilkul free, turant live."
        variant="sell"
      >
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#f75d34] to-[#e54d24] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-3xl font-bold">~2 min</p>
            <p className="text-sm text-orange-100">Average time to post an ad</p>
          </div>
          <ul className="flex flex-wrap gap-4 text-sm font-medium">
            <li>✓ 100% Free</li>
            <li>✓ Direct buyers</li>
            <li>✓ Instant live</li>
          </ul>
        </div>
        <div className="mb-8 grid grid-cols-3 gap-3">
          {["Car & Contact", "Price, Photos & More", "Review & Publish"].map(
            (step, i) => (
              <div
                className="rounded-xl border border-gray-100 bg-gray-50 py-3 text-center"
                key={step}
              >
                <span className="text-sm font-bold text-[#f75d34]">{i + 1}</span>
                <p className="mt-1 text-[10px] font-semibold text-gray-700 sm:text-xs">
                  {step}
                </p>
              </div>
            )
          )}
        </div>
        <SellCarPageContent embedded />
      </SellerPageShell>
    </>
  );
}
