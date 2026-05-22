import PoliciesContent from "@/components/help-hub/PoliciesContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/help/policies");

export default function PoliciesPage() {
  return (
    <HelpHubPage path="/help/policies">
      <PoliciesContent />
    </HelpHubPage>
  );
}
