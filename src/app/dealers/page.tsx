import { Suspense } from "react";
import AdSlot from "@/components/ads/AdSlot";
import Header from "@/components/Header";
import DealersListPage from "@/components/dealers/DealersListPage";

export const metadata = {
  title: "Trusted Car Dealers — Old Car Bazar",
  description:
    "Browse verified car dealers across India. Compare inventory, locations and pricing — then contact the dealer directly.",
};

export default function DealersRoute() {
  return (
    <>
      <Header />
      <AdSlot page="dealers" placement="top" className="mt-4" />
      <Suspense fallback={null}>
        <DealersListPage />
      </Suspense>
    </>
  );
}
