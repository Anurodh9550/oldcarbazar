import VideosContent from "@/components/help-hub/VideosContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/videos");

export default function VideosPage() {
  return (
    <HelpHubPage path="/videos">
      <VideosContent />
    </HelpHubPage>
  );
}
