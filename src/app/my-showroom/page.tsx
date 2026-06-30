import Header from "@/components/Header";
import DealerShowroomEditor from "@/components/dealers/showroom/DealerShowroomEditor";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";
import AuthGate from "@/components/seller/AuthGate";
import { profileHubPageMeta } from "@/data/profileHubPages";

const meta = profileHubPageMeta["my-showroom"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.subtitle,
};

export default function MyShowroomPage() {
  return (
    <>
      <Header />
      <ProfileHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <AuthGate
          title="Login required"
          description="Log in as a seller to edit your Showroom — banner, about, team and reviews."
        >
          <DealerShowroomEditor />
        </AuthGate>
      </ProfileHubShell>
    </>
  );
}
