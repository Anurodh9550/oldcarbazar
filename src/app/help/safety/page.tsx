import SafetyTipsContent from "@/components/help-hub/SafetyTipsContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/help/safety");

export default function HelpSafetyPage() {
  return (
    <HelpHubPage path="/help/safety">
      <SafetyTipsContent />
    </HelpHubPage>
  );
}
