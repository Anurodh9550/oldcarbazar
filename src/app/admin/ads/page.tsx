import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import AdsContent from "@/components/admin/AdsContent";

export const metadata = {
  title: "Ads Manager | Old Car Bazar Admin",
  description:
    "Create banner ads and target them to the home page or any selected page.",
  robots: { index: false, follow: false },
};

export default function AdminAdsPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <AdsContent />
      </AdminShell>
    </AdminGuard>
  );
}
