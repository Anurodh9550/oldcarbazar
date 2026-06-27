import type { FeatureIconName } from "@/components/ui/FeatureIcon";

export const quickActions: {
  title: string;
  desc: string;
  href: string;
  icon: FeatureIconName;
}[] = [
  {
    title: "Buy Used Cars",
    desc: "Browse verified listings",
    href: "/used-cars",
    icon: "car",
  },
  {
    title: "Sell Your Car",
    desc: "Post your ad in 2 minutes",
    href: "/sell-car",
    icon: "sell",
  },
  {
    title: "Car Valuation",
    desc: "Instant price estimate",
    href: "/valuation",
    icon: "chart",
  },
  {
    title: "Multi-Bank Loan",
    desc: "One form, many banks",
    href: "/loan-marketplace",
    icon: "bank",
  },
];

export const budgetRanges = [
  { label: "Under ₹2 Lakh", count: "400+", href: "/used-cars" },
  { label: "₹2 – ₹5 Lakh", count: "650+", href: "/used-cars" },
  { label: "₹5 – ₹10 Lakh", count: "380+", href: "/used-cars" },
  { label: "₹10 – ₹15 Lakh", count: "120+", href: "/used-cars" },
  { label: "Above ₹15 Lakh", count: "80+", href: "/used-cars" },
  { label: "Luxury Cars", count: "45+", href: "/used-cars" },
];

export const popularBrands = [
  "Maruti", "Hyundai", "Tata", "Honda", "Toyota",
  "Mahindra", "Kia", "Ford", "Volkswagen", "Renault",
  "Skoda", "MG", "Nissan", "Jeep", "Datsun",
  "Chevrolet", "Fiat", "Mercedes-Benz", "BMW", "Audi",
  "Volvo", "Citroen", "Land Rover", "Jaguar", "Mini",
  "Suzuki",
];

export const whyChooseUs: {
  title: string;
  desc: string;
  icon: FeatureIconName;
}[] = [
  {
    title: "Verified Listings",
    desc: "Every car is reviewed before it goes live on the marketplace.",
    icon: "shield",
  },
  {
    title: "Direct Owner Deals",
    desc: "Speak to sellers directly — no hidden broker commissions.",
    icon: "user",
  },
  {
    title: "Free to Sell",
    desc: "List your car at zero cost and reach buyers across India.",
    icon: "free",
  },
  {
    title: "City-wise Search",
    desc: "Find cars in Ahmedabad, Mumbai, Delhi and 12+ major cities.",
    icon: "map",
  },
];

export const howItWorksBuy = [
  { step: "1", title: "Search & Filter", desc: "Find cars by city, budget, brand or fuel type." },
  { step: "2", title: "Compare & Chat", desc: "Compare models and chat with sellers on WhatsApp." },
  { step: "3", title: "Inspect & Buy", desc: "Meet seller, test drive and close the deal." },
];

export const howItWorksSell = [
  { step: "1", title: "Post Your Ad", desc: "Add photos, price and car details in minutes." },
  { step: "2", title: "Get Enquiries", desc: "Buyers contact you directly via chat or call." },
  { step: "3", title: "Sell & Transfer", desc: "Finalize deal and complete RC transfer." },
];
