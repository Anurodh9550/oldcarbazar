import TermsContent from "@/components/help-hub/TermsContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/help/terms");

export default function TermsPage() {
  return (
    <HelpHubPage path="/help/terms">
      <TermsContent />
    </HelpHubPage>
  );
}
