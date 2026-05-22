import BrowseByBudgetSection from "@/components/BrowseByBudgetSection";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
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
      <ListingsSection />
      <QuickActionsSection />
      <BrowseByBudgetSection />
      <PopularBrandsSection />
      <WhyChooseUsSection />
      <SellCarBanner />
      <HowItWorksSection />
    </>
  );
}
