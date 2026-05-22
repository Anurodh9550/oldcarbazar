import AdvertiseContent from "@/components/help-hub/AdvertiseContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/advertise");

export default function AdvertisePage() {
  return (
    <HelpHubPage path="/advertise">
      <AdvertiseContent />
    </HelpHubPage>
  );
}
