import FaqContent from "@/components/help-hub/FaqContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/help/faq");

export default function HelpFaqPage() {
  return (
    <HelpHubPage path="/help/faq">
      <FaqContent />
    </HelpHubPage>
  );
}
