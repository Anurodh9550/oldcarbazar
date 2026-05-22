import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import AnalyticsContent from "@/components/admin/AnalyticsContent";

export const metadata = {
  title: "Analytics | Old Car Bazar Admin",
  description: "Deep dive into listings, brands, fuel mix and inquiries.",
  robots: { index: false, follow: false },
};

export default function AdminAnalyticsPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <AnalyticsContent />
      </AdminShell>
    </AdminGuard>
  );
}
