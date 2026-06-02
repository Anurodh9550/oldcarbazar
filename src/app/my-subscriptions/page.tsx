import Header from "@/components/Header";
import MySubscriptionsPage from "@/components/subscription/MySubscriptionsPage";

export const metadata = {
  title: "Billing & Invoices — Old Car Bazar",
  description:
    "View all your Old Car Bazar subscription payments, transaction IDs and download invoices.",
};

export default function MySubscriptionsRoute() {
  return (
    <>
      <Header />
      <MySubscriptionsPage />
    </>
  );
}
