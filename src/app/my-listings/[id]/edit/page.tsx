import Header from "@/components/Header";
import AuthGate from "@/components/seller/AuthGate";
import EditListingContent from "@/components/seller/EditListingContent";
import SellerPageShell from "@/components/seller/SellerPageShell";

export const metadata = {
  title: "Edit Listing | Old Car Bazar",
  description: "Update the details of your posted car on Old Car Bazar.",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <>
      <Header />
      <SellerPageShell
        badge="Seller Hub"
        title="Edit Listing"
        subtitle="Update photos, price, description or contact details — buyers see your changes immediately."
      >
        <AuthGate
          title="Login to Edit Your Listing"
          description="Please log in to edit your posted cars."
          features={[
            "Update price or description",
            "Replace or add photos",
            "Fix typos and reach more buyers",
          ]}
        >
          <EditListingContent listingId={id} />
        </AuthGate>
      </SellerPageShell>
    </>
  );
}
