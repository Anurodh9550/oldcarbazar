import Header from "@/components/Header";
import SellHubShell from "@/components/sell-hub/SellHubShell";
import SellTipsContent from "@/components/sell-hub/SellTipsContent";
import { sellHubPageMeta } from "@/data/sellHubPages";

const meta = sellHubPageMeta["sell-tips"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.description,
};

export default function SellTipsPage() {
  return (
    <>
      <Header />
      <SellHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <SellTipsContent />
      </SellHubShell>
    </>
  );
}
