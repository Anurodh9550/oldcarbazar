import Header from "@/components/Header";
import MyGarageContent from "@/components/profile-hub/MyGarageContent";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";
import AuthGate from "@/components/seller/AuthGate";
import { profileHubPageMeta } from "@/data/profileHubPages";

const meta = profileHubPageMeta["my-garage"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.subtitle,
};

export default function MyGaragePage() {
  return (
    <>
      <Header />
      <ProfileHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <AuthGate title="Login required" description="Garage access ke liye login karo.">
          <MyGarageContent />
        </AuthGate>
      </ProfileHubShell>
    </>
  );
}
