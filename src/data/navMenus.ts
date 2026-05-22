export type MenuLink = {
  label: string;
  href: string;
  hasSubmenu?: boolean;
};

export type MenuColumn = {
  title: string;
  links: MenuLink[];
};

export const getBuyCarsMenu = (city: string): MenuColumn[] => [
  {
    title: "Buy Used Cars",
    links: [
      { label: "Explore All Cars", href: "/used-cars" },
      { label: `Cars in ${city}`, href: "/used-cars" },
      { label: "Assured / Verified Cars", href: "/assured" },
      { label: "New Arrivals", href: "/used-cars" },
    ],
  },
  {
    title: "Shop by Budget",
    links: [
      { label: "Under ₹2 Lakh", href: "/used-cars" },
      { label: "₹2 – ₹5 Lakh", href: "/used-cars" },
      { label: "₹5 – ₹10 Lakh", href: "/used-cars" },
      { label: "Luxury Cars", href: "/used-cars" },
    ],
  },
  {
    title: "Tools & Offers",
    links: [
      { label: "Compare Cars", href: "/compare" },
      { label: "Used Car Loan", href: "/used-car-loan" },
      { label: "EMI Calculator", href: "/emi-calculator" },
      { label: "Popular Cities", href: "#cities", hasSubmenu: true },
    ],
  },
];

export const sellCarMenu: MenuColumn[] = [
  {
    title: "Sell Your Car",
    links: [
      { label: "Sell Car Free", href: "/sell-car" },
      { label: "Post Ad in 2 Minutes", href: "/post-ad" },
      { label: "My Listings", href: "/my-listings" },
      { label: "Seller Dashboard", href: "/seller" },
    ],
  },
  {
    title: "Valuation & Help",
    links: [
      { label: "Free Car Valuation", href: "/valuation" },
      { label: "How Selling Works", href: "/sell-guide" },
      { label: "Tips to Sell Faster", href: "/sell-tips" },
      { label: "Dealer / Partner Login", href: "/dealer" },
    ],
  },
  {
    title: "After You Sell",
    links: [
      { label: "Find Dealers", href: "/dealers" },
      { label: "RC Transfer Guide", href: "/rc-guide" },
      { label: "Insurance Renewal", href: "/insurance" },
      { label: "Chat with Buyers", href: "/messages" },
    ],
  },
];

export const loanToolsMenu: MenuColumn[] = [
  {
    title: "Finance",
    links: [
      { label: "Used Car Loan", href: "/used-car-loan" },
      { label: "EMI Calculator", href: "/emi-calculator" },
      { label: "Loan Eligibility Check", href: "/loan-eligibility" },
      { label: "Compare Interest Rates", href: "/compare-loans" },
    ],
  },
  {
    title: "Car Tools",
    links: [
      { label: "Check Car Valuation", href: "/valuation" },
      { label: "Compare Cars", href: "/compare" },
      { label: "Vehicle History Report", href: "/history-report" },
      { label: "Insurance Quotes", href: "/insurance" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "Assured Cars", href: "/assured" },
      { label: "Find Dealers", href: "/dealers" },
      { label: "Popular Cities", href: "#cities", hasSubmenu: true },
      { label: "Best Deals Today", href: "/used-cars" },
    ],
  },
];

export const helpMenu: MenuColumn[] = [
  {
    title: "Help Center",
    links: [
      { label: "How to Buy", href: "/help/buy" },
      { label: "How to Sell", href: "/help/sell" },
      { label: "Safety Tips", href: "/help/safety" },
      { label: "FAQs", href: "/help/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Old Car Bazar", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Partner with Us", href: "/partner" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Car Reviews", href: "/reviews" },
      { label: "News & Updates", href: "/news" },
      { label: "Videos", href: "/videos" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
];
