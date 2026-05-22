import Header from "@/components/Header";
import SellHubShell from "@/components/sell-hub/SellHubShell";
import ValuationContent from "@/components/sell-hub/ValuationContent";
import { sellHubPageMeta } from "@/data/sellHubPages";

const meta = sellHubPageMeta.valuation;

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.description,
};

export default function ValuationPage() {
  return (
    <>
      <Header />
      <SellHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <ValuationContent />
      </SellHubShell>
    </>
  );
}
