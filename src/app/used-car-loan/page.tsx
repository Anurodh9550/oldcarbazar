import Header from "@/components/Header";
import LoanToolsHubShell from "@/components/loan-tools-hub/LoanToolsHubShell";
import UsedCarLoanContent from "@/components/loan-tools-hub/UsedCarLoanContent";
import { loanToolsPageMeta } from "@/data/loanToolsPages";

const meta = loanToolsPageMeta["used-car-loan"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.description,
};

export default function UsedCarLoanPage() {
  return (
    <>
      <Header />
      <LoanToolsHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <UsedCarLoanContent />
      </LoanToolsHubShell>
    </>
  );
}
