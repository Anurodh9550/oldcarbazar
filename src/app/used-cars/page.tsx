import { Suspense } from "react";
import Header from "@/components/Header";
import UsedCarsExplorePage from "@/components/explore/UsedCarsExplorePage";

export const metadata = {
  title: "Explore Used Cars | Old Car Bazar",
  description:
    "Browse used cars by city, brand, budget, body type and fuel. Find your dream car in one click.",
};

export default function UsedCarsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <UsedCarsExplorePage />
      </Suspense>
    </>
  );
}
