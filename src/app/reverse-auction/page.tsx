import Header from "@/components/Header";
import ReverseAuctionContent from "@/components/auction/ReverseAuctionContent";

export const metadata = {
  title: "Reverse Auction — Dealers Compete for You | Old Car Bazar",
  description:
    "Post your car requirement once. Verified dealers submit competing offers — pick the lowest price. Reverse auction for used cars in India.",
};

export default function ReverseAuctionPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1280px] px-4 py-10 lg:px-6">
        <ReverseAuctionContent />
      </main>
    </>
  );
}
