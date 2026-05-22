import Header from "@/components/Header";
import RcGuideContent from "@/components/sell-hub/RcGuideContent";
import SellHubShell from "@/components/sell-hub/SellHubShell";
import { sellHubPageMeta } from "@/data/sellHubPages";

const meta = sellHubPageMeta["rc-guide"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.description,
};

export default function RcGuidePage() {
  return (
    <>
      <Header />
      <SellHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <RcGuideContent />
      </SellHubShell>
    </>
  );
}
