import { Suspense } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import ListingsContent from "@/components/admin/ListingsContent";

export const metadata = {
  title: "Listings | Old Car Bazar Admin",
  description: "Approve, moderate and curate all listings.",
  robots: { index: false, follow: false },
};

export default function AdminListingsPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <Suspense fallback={null}>
          <ListingsContent />
        </Suspense>
      </AdminShell>
    </AdminGuard>
  );
}
