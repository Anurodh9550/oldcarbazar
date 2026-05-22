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
        subtitle="Apni saari posted cars ek jagah se manage karo — status update, delete, ya nayi ad post karo."
      >
        <AuthGate
          title="Login to View Your Listings"
          description="Apni posted cars dekhne aur manage karne ke liye login karo."
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
