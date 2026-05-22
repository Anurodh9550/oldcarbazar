import PrivacyContent from "@/components/help-hub/PrivacyContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/help/privacy");

export default function PrivacyPage() {
  return (
    <HelpHubPage path="/help/privacy">
      <PrivacyContent />
    </HelpHubPage>
  );
}
