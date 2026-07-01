import Header from "@/components/Header";
import DealerShowroomEditor from "@/components/dealers/showroom/DealerShowroomEditor";
import ProfileAuthGate from "@/components/profile-hub/ProfileAuthGate";
import ProfileHubShell from "@/components/profile-hub/ProfileHubShell";

export const metadata = {
  title: "Showroom | Old Car Bazar",
  description: "Build your dealer showroom on Old Car Bazar.",
};

export default function MyShowroomPage() {
  return (
    <>
      <Header />
      <ProfileHubShell pageKey="myShowroom">
        <ProfileAuthGate gateKey="showroom">
          <DealerShowroomEditor />
        </ProfileAuthGate>
      </ProfileHubShell>
    </>
  );
}
