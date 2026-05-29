import Header from "@/components/Header";
import CarDetailPage from "@/components/car-detail/CarDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

// Listings are loaded dynamically from the backend on the client. We don't
// pre-render specific IDs at build time anymore — the demo seed list is gone.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Used Car Details | Old Car Bazar",
  description:
    "View photos, specs, features and contact the seller of this used car listing on Old Car Bazar.",
};

export default async function UsedCarDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <>
      <Header />
      <CarDetailPage carId={id} />
    </>
  );
}
