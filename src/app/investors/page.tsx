import InvestorsContent from "@/components/help-hub/InvestorsContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/investors");

export default function InvestorsPage() {
  return (
    <HelpHubPage path="/investors">
      <InvestorsContent />
    </HelpHubPage>
  );
}
