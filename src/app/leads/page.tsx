import Header from "@/components/Header";
import AuthGate from "@/components/seller/AuthGate";
import LeadsContent from "@/components/seller/LeadsContent";
import SellerPageShell from "@/components/seller/SellerPageShell";

export const metadata = {
  title: "Leads & Inquiries | Old Car Bazar",
  description:
    "See who viewed, inquired, offered or booked a test drive on your listed cars.",
};

export default function LeadsPage() {
  return (
    <>
      <Header />
      <SellerPageShell
        badge="Seller Hub"
        title="Leads & Inquiries"
        subtitle="Dekhein kis customer ne aapki kaunsi car dekhi ya inquiry ki — naam, number aur direct call/WhatsApp."
      >
        <AuthGate
          title="Login to view your leads"
          description="Please log in to see who is interested in your cars."
          features={[
            "See viewers & inquiries per car",
            "Buyer name & phone number",
            "Direct call & WhatsApp follow-up",
          ]}
        >
          <LeadsContent />
        </AuthGate>
      </SellerPageShell>
    </>
  );
}
