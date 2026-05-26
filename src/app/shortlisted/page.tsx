import Header from "@/components/Header";
import ShortlistedContent from "@/components/profile-hub/ShortlistedContent";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";
import AuthGate from "@/components/seller/AuthGate";
import { profileHubPageMeta } from "@/data/profileHubPages";

const meta = profileHubPageMeta.shortlisted;

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.subtitle,
};

export default function ShortlistedPage() {
  return (
    <>
      <Header />
      <ProfileHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <AuthGate title="Login required" description="Please log in to view your shortlist.">
          <ShortlistedContent />
        </AuthGate>
      </ProfileHubShell>
    </>
  );
}
