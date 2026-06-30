import Header from "@/components/Header";
import DealerShowroomPage from "@/components/dealers/showroom/DealerShowroomPage";

export const metadata = {
  title: "Virtual Showroom | Old Car Bazar",
  description: "Explore this dealer's virtual showroom — cars, team, and reviews.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Header />
      <DealerShowroomPage dealerId={id} />
    </>
  );
}
