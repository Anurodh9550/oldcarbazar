import Header from "@/components/Header";
import DealersListContent from "@/components/sell-hub/DealersListContent";
import SellHubShell from "@/components/sell-hub/SellHubShell";
import { sellHubPageMeta } from "@/data/sellHubPages";

const meta = sellHubPageMeta.dealers;

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.description,
};

export default function DealersPage() {
  return (
    <>
      <Header />
      <SellHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <DealersListContent />
      </SellHubShell>
    </>
  );
}
