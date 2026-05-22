import Header from "@/components/Header";
import CarDetailPage from "@/components/car-detail/CarDetailPage";
import { carListings } from "@/data/cars";
import { findCarById } from "@/lib/carDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return carListings.map((car) => ({ id: car.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const car = findCarById(id);
  if (!car) return { title: "Car Not Found | Old Car Bazar" };
  return {
    title: `${car.title} — ${car.price} | Old Car Bazar`,
    description: `Buy ${car.title} in ${car.location}. ${car.specs}. View photos, specs, features and contact seller.`,
  };
}

export default async function UsedCarDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <>
      <Header />
      <CarDetailPage carId={id} />
    </>
  );
}
