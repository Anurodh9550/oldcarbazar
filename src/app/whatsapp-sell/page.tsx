import Header from "@/components/Header";
import WhatsAppSellContent from "@/components/whatsapp/WhatsAppSellContent";
import WhatsAppSellHero from "@/components/whatsapp/WhatsAppSellHero";

export const metadata = {
  title: "Sell or Buy on WhatsApp | Old Car Bazar",
  description:
    "List your used car, search listings, or apply for a loan via WhatsApp in Hindi or English. India's direct-owner used car marketplace.",
};

export default function WhatsAppSellPage() {
  return (
    <>
      <Header />
      <WhatsAppSellHero />
      <WhatsAppSellContent />
    </>
  );
}
