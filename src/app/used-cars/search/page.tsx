import { Suspense } from "react";
import Header from "@/components/Header";
import UsedCarsSearchPage from "@/components/search/UsedCarsSearchPage";

export const metadata = {
  title: "Search Used Cars | Old Car Bazar",
  description: "Filter used cars by fuel type, budget, transmission and more.",
};

function SearchFallback() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="mx-auto max-w-[1280px] px-4 py-12 text-center text-gray-500">
        Loading results…
      </div>
    </main>
  );
}

export default function UsedCarsSearchRoute() {
  return (
    <>
      <Header />
      <Suspense fallback={<SearchFallback />}>
        <UsedCarsSearchPage />
      </Suspense>
    </>
  );
}
