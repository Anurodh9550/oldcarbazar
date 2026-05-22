import Header from "@/components/Header";
import AssuredCarsContent from "@/components/loan-tools-hub/AssuredCarsContent";
import LoanToolsHubShell from "@/components/loan-tools-hub/LoanToolsHubShell";
import { loanToolsPageMeta } from "@/data/loanToolsPages";

const meta = loanToolsPageMeta["assured"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.description,
};

export default function AssuredCarsPage() {
  return (
    <>
      <Header />
      <LoanToolsHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <AssuredCarsContent />
      </LoanToolsHubShell>
    </>
  );
}
