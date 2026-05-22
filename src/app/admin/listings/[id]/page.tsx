import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import ListingDetail from "@/components/admin/ListingDetail";

export const metadata = {
  title: "Listing details | Old Car Bazar Admin",
  description: "Review and moderate an individual listing.",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <AdminGuard>
      <AdminShell>
        <ListingDetail listingId={id} />
      </AdminShell>
    </AdminGuard>
  );
}
