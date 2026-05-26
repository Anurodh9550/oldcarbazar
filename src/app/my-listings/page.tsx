import Header from "@/components/Header";
import AuthGate from "@/components/seller/AuthGate";
import MyListingsContent from "@/components/seller/MyListingsContent";
import SellerPageShell from "@/components/seller/SellerPageShell";

export const metadata = {
  title: "My Listings | Old Car Bazar",
  description: "Manage your posted car ads on Old Car Bazar.",
};

export default function MyListingsPage() {
  return (
    <>
      <Header />
      <SellerPageShell
        badge="Seller Hub"
        title="My Listings"
        subtitle="Manage all your posted cars in one place — update status, delete, or post a new ad."
      >
        <AuthGate
          title="Login to View Your Listings"
          description="Please log in to view and manage your posted cars."
          features={[
            "View all your active ads",
            "Mark cars as sold",
            "Track views & inquiries",
          ]}
        >
          <MyListingsContent />
        </AuthGate>
      </SellerPageShell>
    </>
  );
}
