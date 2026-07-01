import Header from "@/components/Header";
import ShortlistedContent from "@/components/profile-hub/ShortlistedContent";
import ProfileAuthGate from "@/components/profile-hub/ProfileAuthGate";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";

export const metadata = {
  title: "Shortlisted Vehicles | Old Car Bazar",
  description: "Compare and contact the cars you've saved.",
};

export default function ShortlistedPage() {
  return (
    <>
      <Header />
      <ProfileHubShell pageKey="shortlisted">
        <ProfileAuthGate gateKey="shortlisted">
          <ShortlistedContent />
        </ProfileAuthGate>
      </ProfileHubShell>
    </>
  );
}
