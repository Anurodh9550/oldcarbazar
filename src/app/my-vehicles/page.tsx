import Header from "@/components/Header";
import MyVehiclesContent from "@/components/profile-hub/MyVehiclesContent";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";
import AuthGate from "@/components/seller/AuthGate";
import { profileHubPageMeta } from "@/data/profileHubPages";

const meta = profileHubPageMeta["my-vehicles"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.subtitle,
};

export default function MyVehiclesPage() {
  return (
    <>
      <Header />
      <ProfileHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <AuthGate title="Login required" description="Apni vehicles dekhne ke liye login karo.">
          <MyVehiclesContent />
        </AuthGate>
      </ProfileHubShell>
    </>
  );
}
