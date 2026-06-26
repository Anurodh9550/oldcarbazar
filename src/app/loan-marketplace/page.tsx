import LoanToolsHubShell from "@/components/loan-tools-hub/LoanToolsHubShell";
import MultiBankLoanContent from "@/components/loan-tools-hub/MultiBankLoanContent";

export const metadata = {
  title: "Multi-Bank Loan Marketplace | Old Car Bazar",
  description:
    "One loan application sent to multiple banks and NBFCs. Compare used car loan offers and pick the lowest EMI — HDFC, ICICI, SBI, Axis and more.",
};

export default function LoanMarketplacePage() {
  return (
    <LoanToolsHubShell
      badge="One form · Many banks"
      title="Multi-Bank Loan Marketplace"
      subtitle="Fill your details once. Select the banks you want — we submit your application to all of them so you can compare the best offer."
    >
      <MultiBankLoanContent />
    </LoanToolsHubShell>
  );
}
