import Header from "@/components/Header";
import CompareLoansContent from "@/components/loan-tools-hub/CompareLoansContent";
import LoanToolsHubShell from "@/components/loan-tools-hub/LoanToolsHubShell";
import { loanToolsPageMeta } from "@/data/loanToolsPages";

const meta = loanToolsPageMeta["compare-loans"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.description,
};

export default function CompareLoansPage() {
  return (
    <>
      <Header />
      <LoanToolsHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <CompareLoansContent />
      </LoanToolsHubShell>
    </>
  );
}
