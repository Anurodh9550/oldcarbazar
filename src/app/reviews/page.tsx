import ReviewsContent from "@/components/help-hub/ReviewsContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/reviews");

export default function ReviewsPage() {
  return (
    <HelpHubPage path="/reviews">
      <ReviewsContent />
    </HelpHubPage>
  );
}
