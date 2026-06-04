import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import PaymentsContent from "@/components/admin/PaymentsContent";

export const metadata = {
  title: "Payments | Old Car Bazar Admin",
  description: "Subscriptions and boosts with transaction IDs.",
  robots: { index: false, follow: false },
};

export default function AdminPaymentsPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <PaymentsContent />
      </AdminShell>
    </AdminGuard>
  );
}
