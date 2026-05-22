import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import UserDetail from "@/components/admin/UserDetail";

export const metadata = {
  title: "User profile | Old Car Bazar Admin",
  description: "Detailed view of a buyer or seller.",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <AdminGuard>
      <AdminShell>
        <UserDetail userId={id} />
      </AdminShell>
    </AdminGuard>
  );
}
