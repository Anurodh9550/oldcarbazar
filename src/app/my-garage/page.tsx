import Header from "@/components/Header";
import MyGarageContent from "@/components/profile-hub/MyGarageContent";
import ProfileAuthGate from "@/components/profile-hub/ProfileAuthGate";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";

export const metadata = {
  title: "OCB Digital Garage | Old Car Bazar",
  description: "Your post-purchase car hub on Old Car Bazar.",
};

export default function MyGaragePage() {
  return (
    <>
      <Header />
      <ProfileHubShell pageKey="myGarage">
        <ProfileAuthGate gateKey="garage">
          <MyGarageContent />
        </ProfileAuthGate>
      </ProfileHubShell>
    </>
  );
}
