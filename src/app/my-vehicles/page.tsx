import Header from "@/components/Header";
import MyVehiclesContent from "@/components/profile-hub/MyVehiclesContent";
import ProfileAuthGate from "@/components/profile-hub/ProfileAuthGate";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";

export const metadata = {
  title: "My Vehicles | Old Car Bazar",
  description: "Your owned cars and posted listings in one dashboard.",
};

export default function MyVehiclesPage() {
  return (
    <>
      <Header />
      <ProfileHubShell pageKey="myVehicles">
        <ProfileAuthGate gateKey="vehicles">
          <MyVehiclesContent />
        </ProfileAuthGate>
      </ProfileHubShell>
    </>
  );
}
