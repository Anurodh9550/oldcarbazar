import Header from "@/components/Header";
import DealerAvailabilityCalendar from "@/components/dealers/availability/DealerAvailabilityCalendar";
import PageHero from "@/components/ui/PageHero";

export const metadata = {
  title: "Car Availability Calendar | Old Car Bazar",
  description:
    "Mark your cars as Available, Reserved, Sold, or Coming Soon on Old Car Bazar.",
};

export default function DealerAvailabilityPage() {
  return (
    <>
      <Header />
      <PageHero
        badge="Dealer tools"
        title="Car Availability Calendar"
        subtitle="Track and update stock status — buyers see it on your Showroom."
      />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <DealerAvailabilityCalendar />
      </main>
    </>
  );
}
