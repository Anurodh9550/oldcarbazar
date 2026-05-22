import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import InquiriesContent from "@/components/admin/InquiriesContent";

export const metadata = {
  title: "Inquiries | Old Car Bazar Admin",
  description: "All buyer ↔ seller messages.",
  robots: { index: false, follow: false },
};

export default function AdminInquiriesPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <InquiriesContent />
      </AdminShell>
    </AdminGuard>
  );
}
