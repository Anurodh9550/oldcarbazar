import Header from "@/components/Header";
import MyActivityContent from "@/components/profile-hub/MyActivityContent";
import ProfileAuthGate from "@/components/profile-hub/ProfileAuthGate";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";

export const metadata = {
  title: "My Activity | Old Car Bazar",
  description: "History of recent searches, viewed listings and inquiries.",
};

export default function MyActivityPage() {
  return (
    <>
      <Header />
      <ProfileHubShell pageKey="myActivity">
        <ProfileAuthGate gateKey="activity">
          <MyActivityContent />
        </ProfileAuthGate>
      </ProfileHubShell>
    </>
  );
}
