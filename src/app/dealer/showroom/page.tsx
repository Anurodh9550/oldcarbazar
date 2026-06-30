import Header from "@/components/Header";
import DealerShowroomEditor from "@/components/dealers/showroom/DealerShowroomEditor";
import PageHero from "@/components/ui/PageHero";

export const metadata = {
  title: "Showroom Builder | Old Car Bazar",
  description: "Create your dealer showroom with banner, logo, team, and reviews.",
};

export default function DealerShowroomBuilderPage() {
  return (
    <>
      <Header />
      <PageHero
        badge="Dealer tools"
        title="Showroom"
        subtitle="Build a mini website for your dealership — banner, logo, about, team, all cars, and customer reviews."
      />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <DealerShowroomEditor />
      </main>
    </>
  );
}
