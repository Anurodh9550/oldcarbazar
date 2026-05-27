import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import LoanToolsContent from "@/components/admin/LoanToolsContent";

export const metadata = {
  title: "Loan & Tools (Option by Features) | Old Car Bazar Admin",
  description:
    "Manage the Loan & Tools options shown on the public site — banks, EMI, eligibility, compare cars, history report, assured cars and more.",
  robots: { index: false, follow: false },
};

export default function AdminLoanToolsPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <LoanToolsContent />
      </AdminShell>
    </AdminGuard>
  );
}
