import AdSlot from "@/components/ads/AdSlot";
import BrowseByBudgetSection from "@/components/BrowseByBudgetSection";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HomeTrustStrip from "@/components/home/HomeTrustStrip";
import HowItWorksSection from "@/components/HowItWorksSection";
import ListingsSection from "@/components/ListingsSection";
import PopularBrandsSection from "@/components/PopularBrandsSection";
import QuickActionsSection from "@/components/QuickActionsSection";
import SellCarBanner from "@/components/SellCarBanner";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <HomeTrustStrip />
      <AdSlot page="home" placement="top" className="mt-6" />
      <ListingsSection />
      <AdSlot page="home" placement="inline" className="my-6" />
      <QuickActionsSection />
      <BrowseByBudgetSection />
      <PopularBrandsSection />
      <WhyChooseUsSection />
      <SellCarBanner />
      <HowItWorksSection />
      <AdSlot page="home" placement="footer" className="my-8" />
    </>
  );
}
