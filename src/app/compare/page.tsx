import Header from "@/components/Header";
import CompareCarsContent from "@/components/loan-tools-hub/CompareCarsContent";
import LoanToolsHubShell from "@/components/loan-tools-hub/LoanToolsHubShell";
import { loanToolsPageMeta } from "@/data/loanToolsPages";

const meta = loanToolsPageMeta["compare"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.description,
};

export default function CompareCarsPage() {
  return (
    <>
      <Header />
      <LoanToolsHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <CompareCarsContent />
      </LoanToolsHubShell>
    </>
  );
}
