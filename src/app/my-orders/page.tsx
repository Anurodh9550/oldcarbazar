import Header from "@/components/Header";
import MyOrdersContent from "@/components/profile-hub/MyOrdersContent";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";
import AuthGate from "@/components/seller/AuthGate";
import { profileHubPageMeta } from "@/data/profileHubPages";

const meta = profileHubPageMeta["my-orders"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.subtitle,
};

export default function MyOrdersPage() {
  return (
    <>
      <Header />
      <ProfileHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <AuthGate title="Login required" description="Please log in to view your orders.">
          <MyOrdersContent />
        </AuthGate>
      </ProfileHubShell>
    </>
  );
}
