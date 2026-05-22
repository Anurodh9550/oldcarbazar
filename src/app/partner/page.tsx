import PartnerContent from "@/components/help-hub/PartnerContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/partner");

export default function PartnerPage() {
  return (
    <HelpHubPage path="/partner">
      <PartnerContent />
    </HelpHubPage>
  );
}
