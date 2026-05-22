import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import UsersContent from "@/components/admin/UsersContent";

export const metadata = {
  title: "Sellers | Old Car Bazar Admin",
  description: "Supply side — verified sellers and their listings.",
  robots: { index: false, follow: false },
};

export default function AdminSellersPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <UsersContent mode="sellers" />
      </AdminShell>
    </AdminGuard>
  );
}
