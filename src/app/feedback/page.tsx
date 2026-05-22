import FeedbackContent from "@/components/help-hub/FeedbackContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/feedback");

export default function FeedbackPage() {
  return (
    <HelpHubPage path="/feedback">
      <FeedbackContent />
    </HelpHubPage>
  );
}
