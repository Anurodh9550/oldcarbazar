import { Suspense } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import LoanInquiriesContent from "@/components/admin/LoanInquiriesContent";

export const metadata = {
  title: "Loan Inquiries | Old Car Bazar Admin",
  description: "Used-car loan leads from the public loan section.",
  robots: { index: false, follow: false },
};

export default function AdminLoanInquiriesPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <Suspense fallback={null}>
          <LoanInquiriesContent />
        </Suspense>
      </AdminShell>
    </AdminGuard>
  );
}
