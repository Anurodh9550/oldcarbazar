import { Suspense } from "react";
import Header from "@/components/Header";
import PricingPage from "@/components/subscription/PricingPage";

export const metadata = {
  title: "Pricing — Old Car Bazar",
  description:
    "Free and Pro plans for sellers. Post up to 3 cars free, or upgrade to Pro for unlimited listings.",
};

export default function PricingRoute() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <PricingPage />
      </Suspense>
    </>
  );
}
