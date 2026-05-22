import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import DashboardContent from "@/components/admin/DashboardContent";

export const metadata = {
  title: "Dashboard | Old Car Bazar Admin",
  description: "Real-time pulse of your used-car marketplace.",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <DashboardContent />
      </AdminShell>
    </AdminGuard>
  );
}
