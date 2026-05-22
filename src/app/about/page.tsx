import AboutContent from "@/components/help-hub/AboutContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/about");

export default function AboutPage() {
  return (
    <HelpHubPage path="/about">
      <AboutContent />
    </HelpHubPage>
  );
}
