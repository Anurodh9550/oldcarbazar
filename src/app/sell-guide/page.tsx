import Header from "@/components/Header";
import SellGuideContent from "@/components/sell-hub/SellGuideContent";
import SellHubShell from "@/components/sell-hub/SellHubShell";
import { sellHubPageMeta } from "@/data/sellHubPages";

const meta = sellHubPageMeta["sell-guide"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.description,
};

export default function SellGuidePage() {
  return (
    <>
      <Header />
      <SellHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <SellGuideContent />
      </SellHubShell>
    </>
  );
}
