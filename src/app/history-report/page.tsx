import Header from "@/components/Header";
import HistoryReportContent from "@/components/loan-tools-hub/HistoryReportContent";
import LoanToolsHubShell from "@/components/loan-tools-hub/LoanToolsHubShell";
import { loanToolsPageMeta } from "@/data/loanToolsPages";

const meta = loanToolsPageMeta["history-report"];

export const metadata = {
  title: `${meta.title} | Old Car Bazar`,
  description: meta.description,
};

export default function HistoryReportPage() {
  return (
    <>
      <Header />
      <LoanToolsHubShell badge={meta.badge} title={meta.title} subtitle={meta.subtitle}>
        <HistoryReportContent />
      </LoanToolsHubShell>
    </>
  );
}
