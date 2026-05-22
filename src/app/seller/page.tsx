import Header from "@/components/Header";
import AuthGate from "@/components/seller/AuthGate";
import SellerDashboardContent from "@/components/seller/SellerDashboardContent";
import SellerPageShell from "@/components/seller/SellerPageShell";

export const metadata = {
  title: "Seller Dashboard | Old Car Bazar",
  description: "Track your listings, views and inquiries on Old Car Bazar.",
};

export default function SellerDashboardPage() {
  return (
    <>
      <Header />
      <SellerPageShell
        badge="Seller Hub"
        title="Seller Dashboard"
        subtitle="Apne ads ka performance track karo — views, inquiries aur active listings sab ek dashboard par."
      >
        <AuthGate
          title="Login to Access Seller Dashboard"
          description="Seller dashboard sirf logged-in users ke liye hai."
          features={[
            "Listing performance stats",
            "Views & inquiry tracking",
            "Quick post ad shortcuts",
          ]}
        >
          <SellerDashboardContent />
        </AuthGate>
      </SellerPageShell>
    </>
  );
}
