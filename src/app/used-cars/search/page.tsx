import { Suspense } from "react";
import AdSlot from "@/components/ads/AdSlot";
import Header from "@/components/Header";
import UsedCarsSearchPage from "@/components/search/UsedCarsSearchPage";
import LogoLoader from "@/components/ui/LogoLoader";

export const metadata = {
  title: "Search Used Cars | Old Car Bazar",
  description: "Filter used cars by fuel type, budget, transmission and more.",
};

function SearchFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
      <LogoLoader message="Searching cars…" />
    </main>
  );
}

export default function UsedCarsSearchRoute() {
  return (
    <>
      <Header />
      <AdSlot page="search" placement="top" className="mt-4" />
      <Suspense fallback={<SearchFallback />}>
        <UsedCarsSearchPage />
      </Suspense>
    </>
  );
}
