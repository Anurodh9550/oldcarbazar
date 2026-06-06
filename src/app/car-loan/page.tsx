import { Suspense } from "react";
import LoanToolsHubShell from "@/components/loan-tools-hub/LoanToolsHubShell";
import BankLoanApplyContent from "@/components/loan-tools-hub/BankLoanApplyContent";

export const metadata = {
  title: "Apply for a Used Car Loan | Old Car Bazar",
  description:
    "Choose your preferred bank and check your used car loan eligibility. Apply online with our trusted loan partners — Paisabazaar, BankBazaar and IndiaLends.",
};

export default function CarLoanPage() {
  return (
    <LoanToolsHubShell
      badge="Apply in 2 minutes"
      title="Used Car Loan — Choose Your Bank"
      subtitle="Pick a bank, check your eligibility and apply online. Our loan partners will get you the best offer at the lowest interest rate."
    >
      <Suspense fallback={null}>
        <BankLoanApplyContent />
      </Suspense>
    </LoanToolsHubShell>
  );
}
