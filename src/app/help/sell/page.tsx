import HelpSellContent from "@/components/help-hub/HelpSellContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/help/sell");

export default function HelpSellPage() {
  return (
    <HelpHubPage path="/help/sell">
      <HelpSellContent />
    </HelpHubPage>
  );
}
