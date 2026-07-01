import Header from "@/components/Header";
import ProfileSettingsContent from "@/components/profile-hub/ProfileSettingsContent";
import ProfileAuthGate from "@/components/profile-hub/ProfileAuthGate";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";

export const metadata = {
  title: "Profile Settings | Old Car Bazar",
  description: "Update your name, email, phone and account details.",
};

export default function ProfileSettingsPage() {
  return (
    <>
      <Header />
      <ProfileHubShell pageKey="profileSettings">
        <ProfileAuthGate gateKey="settings">
          <ProfileSettingsContent />
        </ProfileAuthGate>
      </ProfileHubShell>
    </>
  );
}
