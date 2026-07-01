import Header from "@/components/Header";
import ConsentsContent from "@/components/profile-hub/ConsentsContent";
import ProfileAuthGate from "@/components/profile-hub/ProfileAuthGate";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";

export const metadata = {
  title: "Manage Consents | Old Car Bazar",
  description: "Control marketing, WhatsApp alerts and data-sharing preferences.",
};

export default function ConsentsPage() {
  return (
    <>
      <Header />
      <ProfileHubShell pageKey="consents">
        <ProfileAuthGate gateKey="consents">
          <ConsentsContent />
        </ProfileAuthGate>
      </ProfileHubShell>
    </>
  );
}
