import HelpBuyContent from "@/components/help-hub/HelpBuyContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/help/buy");

export default function HelpBuyPage() {
  return (
    <HelpHubPage path="/help/buy">
      <HelpBuyContent />
    </HelpHubPage>
  );
}
