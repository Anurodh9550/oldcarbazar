import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import SettingsContent from "@/components/admin/SettingsContent";

export const metadata = {
  title: "Settings | Old Car Bazar Admin",
  description: "Platform configuration and admin preferences.",
  robots: { index: false, follow: false },
};

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <SettingsContent />
      </AdminShell>
    </AdminGuard>
  );
}
