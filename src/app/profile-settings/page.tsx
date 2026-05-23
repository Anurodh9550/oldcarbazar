import Header from "@/components/Header";
import ProfileSettingsContent from "@/components/profile-hub/ProfileSettingsContent";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";
import AuthGate from "@/components/seller/AuthGate";
import { profileHubPageMeta } from "@/data/profileHubPages";

const meta = profileHubPageMeta["profile-settings"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.subtitle,
};

export default function ProfileSettingsPage() {
  return (
    <>
      <Header />
      <ProfileHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <AuthGate title="Login required" description="Profile edit karne ke liye login karo.">
          <ProfileSettingsContent />
        </AuthGate>
      </ProfileHubShell>
    </>
  );
}
