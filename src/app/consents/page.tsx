import Header from "@/components/Header";
import ConsentsContent from "@/components/profile-hub/ConsentsContent";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";
import AuthGate from "@/components/seller/AuthGate";
import { profileHubPageMeta } from "@/data/profileHubPages";

const meta = profileHubPageMeta.consents;

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.subtitle,
};

export default function ConsentsPage() {
  return (
    <>
      <Header />
      <ProfileHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <AuthGate title="Login required" description="Consent settings ke liye login karo.">
          <ConsentsContent />
        </AuthGate>
      </ProfileHubShell>
    </>
  );
}
