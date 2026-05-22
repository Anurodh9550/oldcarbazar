import Header from "@/components/Header";
import InsuranceContent from "@/components/sell-hub/InsuranceContent";
import SellHubShell from "@/components/sell-hub/SellHubShell";
import { sellHubPageMeta } from "@/data/sellHubPages";

const meta = sellHubPageMeta.insurance;

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.description,
};

export default function InsurancePage() {
  return (
    <>
      <Header />
      <SellHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <InsuranceContent />
      </SellHubShell>
    </>
  );
}
