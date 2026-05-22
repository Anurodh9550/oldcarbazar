import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import UsersContent from "@/components/admin/UsersContent";

export const metadata = {
  title: "Users | Old Car Bazar Admin",
  description: "Every buyer, seller and dealer on the platform.",
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <UsersContent mode="all" />
      </AdminShell>
    </AdminGuard>
  );
}
