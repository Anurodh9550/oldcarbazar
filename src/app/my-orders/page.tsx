import Header from "@/components/Header";
import MyOrdersContent from "@/components/profile-hub/MyOrdersContent";
import ProfileAuthGate from "@/components/profile-hub/ProfileAuthGate";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";

export const metadata = {
  title: "My Orders | Old Car Bazar",
  description: "Track your car purchase orders.",
};

export default function MyOrdersPage() {
  return (
    <>
      <Header />
      <ProfileHubShell pageKey="myOrders">
        <ProfileAuthGate gateKey="orders">
          <MyOrdersContent />
        </ProfileAuthGate>
      </ProfileHubShell>
    </>
  );
}
