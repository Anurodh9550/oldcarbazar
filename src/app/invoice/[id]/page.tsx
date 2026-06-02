import InvoicePage from "@/components/subscription/InvoicePage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Invoice — Old Car Bazar",
  description: "View and download your Old Car Bazar payment invoice.",
};

export default async function InvoiceRoute({ params }: PageProps) {
  const { id } = await params;
  return <InvoicePage subscriptionId={id} />;
}
