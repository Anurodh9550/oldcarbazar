import ContactContent from "@/components/help-hub/ContactContent";
import { buildHelpHubMetadata, HelpHubPage } from "@/lib/helpHubPage";

export const metadata = buildHelpHubMetadata("/contact");

export default function ContactPage() {
  return (
    <HelpHubPage path="/contact">
      <ContactContent />
    </HelpHubPage>
  );
}
