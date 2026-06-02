import { Suspense } from "react";
import Header from "@/components/Header";
import DealerDetailPage from "@/components/dealers/DealerDetailPage";

export const metadata = {
  title: "Dealer Profile — Old Car Bazar",
  description:
    "View this dealer's full inventory, location and contact details.",
};

export default async function DealerDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <DealerDetailPage dealerId={id} />
      </Suspense>
    </>
  );
}
