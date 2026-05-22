import NewsContent from "@/components/help-hub/NewsContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/news");

export default function NewsPage() {
  return (
    <HelpHubPage path="/news">
      <NewsContent />
    </HelpHubPage>
  );
}
