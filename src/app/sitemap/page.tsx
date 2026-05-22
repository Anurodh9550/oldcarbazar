import SitemapContent from "@/components/help-hub/SitemapContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/sitemap");

export default function SitemapPage() {
  return (
    <HelpHubPage path="/sitemap">
      <SitemapContent />
    </HelpHubPage>
  );
}
