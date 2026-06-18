import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import DealerOffersContent from "@/components/admin/DealerOffersContent";

export const metadata = {
  title: "Dealer Offers | Old Car Bazar Admin",
  description: "Manage 15/20 day unlimited listing offers for dealers.",
  robots: { index: false, follow: false },
};

export default function AdminDealerOffersPage() {
  return (
    <AdminGuard>
      <AdminShell>
        <DealerOffersContent />
      </AdminShell>
    </AdminGuard>
  );
}
