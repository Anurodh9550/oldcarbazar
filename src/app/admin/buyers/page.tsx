import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import UsersContent from "@/components/admin/UsersContent";

export const metadata = {
  title: "Buyers | Old Car Bazar Admin",
  description: "Demand side — interest, inquiries and activity.",
  robots: { index: false, follow: false },
};

export default function AdminBuyersPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <UsersContent mode="buyers" />
      </AdminShell>
    </AdminGuard>
  );
}
