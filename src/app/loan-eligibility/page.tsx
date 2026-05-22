import Header from "@/components/Header";
import LoanEligibilityContent from "@/components/loan-tools-hub/LoanEligibilityContent";
import LoanToolsHubShell from "@/components/loan-tools-hub/LoanToolsHubShell";
import { loanToolsPageMeta } from "@/data/loanToolsPages";

const meta = loanToolsPageMeta["loan-eligibility"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.description,
};

export default function LoanEligibilityPage() {
  return (
    <>
      <Header />
      <LoanToolsHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <LoanEligibilityContent />
      </LoanToolsHubShell>
    </>
  );
}
