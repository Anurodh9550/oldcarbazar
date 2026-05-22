import CareersContent from "@/components/help-hub/CareersContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/careers");

export default function CareersPage() {
  return (
    <HelpHubPage path="/careers">
      <CareersContent />
    </HelpHubPage>
  );
}
