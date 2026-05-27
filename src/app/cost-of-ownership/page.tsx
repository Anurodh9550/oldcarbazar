import Header from "@/components/Header";
import LoanToolsHubShell from "@/components/loan-tools-hub/LoanToolsHubShell";
import CostOfOwnershipContent from "@/components/loan-tools-hub/CostOfOwnershipContent";

export const metadata = {
  title: "Cost of Ownership Calculator | Old Car Bazar",
  description:
    "Calculate the true 5-year cost of owning a used car — fuel, insurance, service, parking and depreciation in one place.",
};

export default function CostOfOwnershipPage() {
  return (
    <>
      <Header />
      <LoanToolsHubShell
        badge="True 5-year cost"
        title="Cost of Ownership Calculator"
        subtitle="See the real per-month cost of a car — fuel, insurance, service, parking and depreciation, all in one place."
      >
        <CostOfOwnershipContent />
      </LoanToolsHubShell>
    </>
  );
}
