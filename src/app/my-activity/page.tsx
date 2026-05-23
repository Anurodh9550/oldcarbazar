import Header from "@/components/Header";
import MyActivityContent from "@/components/profile-hub/MyActivityContent";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";
import AuthGate from "@/components/seller/AuthGate";
import { profileHubPageMeta } from "@/data/profileHubPages";

const meta = profileHubPageMeta["my-activity"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.subtitle,
};

export default function MyActivityPage() {
  return (
    <>
      <Header />
      <ProfileHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <AuthGate title="Login required" description="Activity history ke liye login karo.">
          <MyActivityContent />
        </AuthGate>
      </ProfileHubShell>
    </>
  );
}
