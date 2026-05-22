import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import CitiesContent from "@/components/admin/CitiesContent";

export const metadata = {
  title: "Cities | Old Car Bazar Admin",
  description: "City-level supply, demand and price stats.",
  robots: { index: false, follow: false },
};

export default function AdminCitiesPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <CitiesContent />
      </AdminShell>
    </AdminGuard>
  );
}
