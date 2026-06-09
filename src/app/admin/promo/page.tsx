import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import PromoOffersContent from "@/components/admin/PromoOffersContent";

export const metadata = {
  title: "Promo & Offers | Old Car Bazar Admin",
  description:
    "Edit the offers / new-feature popup card shown to visitors across the site.",
  robots: { index: false, follow: false },
};

export default function AdminPromoPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <PromoOffersContent />
      </AdminShell>
    </AdminGuard>
  );
}
