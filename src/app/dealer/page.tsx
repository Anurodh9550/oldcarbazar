import Header from "@/components/Header";
import DealerLoginContent from "@/components/sell-hub/DealerLoginContent";
import SellHubShell from "@/components/sell-hub/SellHubShell";
import { sellHubPageMeta } from "@/data/sellHubPages";

const meta = sellHubPageMeta.dealer;

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.description,
};

export default function DealerPage() {
  return (
    <>
      <Header />
      <SellHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <DealerLoginContent />
      </SellHubShell>
    </>
  );
}
