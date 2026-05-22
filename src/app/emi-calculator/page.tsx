import Header from "@/components/Header";
import EmiCalculatorContent from "@/components/loan-tools-hub/EmiCalculatorContent";
import LoanToolsHubShell from "@/components/loan-tools-hub/LoanToolsHubShell";
import { loanToolsPageMeta } from "@/data/loanToolsPages";

const meta = loanToolsPageMeta["emi-calculator"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.description,
};

export default function EmiCalculatorPage() {
  return (
    <>
      <Header />
      <LoanToolsHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <EmiCalculatorContent />
      </LoanToolsHubShell>
    </>
  );
}
