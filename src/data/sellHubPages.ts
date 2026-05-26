export type SellHubPageId =
  | "valuation"
  | "sell-guide"
  | "sell-tips"
  | "dealer"
  | "dealers"
  | "rc-guide"
  | "insurance"
  | "messages";

export const sellHubNavGroups = [
  {
    title: "Valuation & Help",
    links: [
      { id: "valuation" as const, href: "/valuation", label: "Free Valuation", icon: "📊" },
      { id: "sell-guide" as const, href: "/sell-guide", label: "How It Works", icon: "📖" },
      { id: "sell-tips" as const, href: "/sell-tips", label: "Sell Faster", icon: "⚡" },
      { id: "dealer" as const, href: "/dealer", label: "Dealer Login", icon: "🏢" },
    ],
  },
  {
    title: "After You Sell",
    links: [
      { id: "dealers" as const, href: "/dealers", label: "Find Dealers", icon: "🔍" },
      { id: "rc-guide" as const, href: "/rc-guide", label: "RC Transfer", icon: "📄" },
      { id: "insurance" as const, href: "/insurance", label: "Insurance", icon: "🛡" },
      { id: "messages" as const, href: "/messages", label: "Chat Buyers", icon: "💬" },
    ],
  },
];

export const sellHubPageMeta: Record<
  SellHubPageId,
  { title: string; subtitle: string; badge: string; description: string }
> = {
  valuation: {
    badge: "Instant Estimate",
    title: "Free Car Valuation",
    subtitle:
      "Know your car's fair market price — an instant estimate based on brand, model, year and condition.",
    description: "Get free used car valuation in India on Old Car Bazar.",
  },
  "sell-guide": {
    badge: "Step by Step",
    title: "How Selling Works",
    subtitle:
      "Selling on Old Car Bazar is simple — your listing goes live in 3 steps and you talk to buyers directly.",
    description: "Learn how to sell your used car on Old Car Bazar.",
  },
  "sell-tips": {
    badge: "Expert Advice",
    title: "Tips to Sell Faster",
    subtitle:
      "Sell your car faster and at a better price with pro tips on photos, pricing and buyer response.",
    description: "Tips to sell your used car faster on Old Car Bazar.",
  },
  dealer: {
    badge: "Partner Program",
    title: "Dealer / Partner Login",
    subtitle:
      "For authorised dealers and partners — bulk listings, leads and a verified seller badge.",
    description: "Dealer and partner login for Old Car Bazar.",
  },
  dealers: {
    badge: "Verified Network",
    title: "Find Dealers",
    subtitle:
      "Find trusted used car dealers in your city — inspections, paperwork and the best deals.",
    description: "Find verified used car dealers near you.",
  },
  "rc-guide": {
    badge: "Legal & Paperwork",
    title: "RC Transfer Guide",
    subtitle:
      "The complete RC transfer process after selling your car — documents, RTO steps and timelines.",
    description: "RC transfer guide for selling your car in India.",
  },
  insurance: {
    badge: "Stay Protected",
    title: "Insurance Renewal",
    subtitle:
      "Renew your insurance after buying or transferring a car — compare plans and get the best rates.",
    description: "Insurance renewal guide after selling or buying a car.",
  },
  messages: {
    badge: "Buyer Connect",
    title: "Chat with Buyers",
    subtitle:
      "Chat directly with interested buyers — reply to queries and close deals faster.",
    description: "Chat with buyers on Old Car Bazar.",
  },
};

export const sellGuideSteps = [
  {
    step: 1,
    title: "Create Free Account",
    desc: "Log in with your mobile number and get instant access to the seller dashboard.",
    icon: "👤",
  },
  {
    step: 2,
    title: "Post Your Listing",
    desc: "Add car details, photos, price and city — your ad goes live in 2 minutes.",
    icon: "📝",
  },
  {
    step: 3,
    title: "Get Buyer Inquiries",
    desc: "Buyers browse your listing and reach out via chat or call.",
    icon: "📩",
  },
  {
    step: 4,
    title: "Inspect & Negotiate",
    desc: "Arrange a test drive and finalise the price — a transparent deal.",
    icon: "🤝",
  },
  {
    step: 5,
    title: "Complete Sale & RC",
    desc: "Collect payment and transfer the RC — follow our paperwork guide.",
    icon: "✅",
  },
];

export const sellTips = [
  {
    title: "Professional Photos",
    desc: "Upload clear daylight photos of the front, back, interior and odometer.",
    tag: "2× more views",
  },
  {
    title: "Honest Description",
    desc: "Write service history, accidents and repairs clearly — it builds trust.",
    tag: "Faster deals",
  },
  {
    title: "Competitive Pricing",
    desc: "Get a free valuation first, then price it 2-3% below market for a quick sale.",
    tag: "Best price",
  },
  {
    title: "Quick Responses",
    desc: "Reply to buyer messages within an hour — serious buyers don't wait.",
    tag: "More leads",
  },
  {
    title: "Keep Car Ready",
    desc: "Wash the car, fix minor issues and update the PUC before selling.",
    tag: "Better offers",
  },
  {
    title: "Complete Documents",
    desc: "Keep the RC, insurance and service records ready — deals can close the same day.",
    tag: "No delays",
  },
];

export const rcTransferSteps = [
  {
    title: "Sale Agreement",
    desc: "Buyer and seller sign the sale agreement / Form 29 & 30.",
  },
  {
    title: "Clear Pending Dues",
    desc: "Settle any challans, loan (NOC) and insurance transfer.",
  },
  {
    title: "Visit RTO",
    desc: "Submit the application at the local RTO with documents from both parties.",
  },
  {
    title: "New RC Issued",
    desc: "A new RC is issued in the buyer's name within 7–15 working days.",
  },
];

export const insurancePlans = [
  {
    name: "Comprehensive",
    desc: "Own damage + third party — full protection for a new car.",
    from: "₹8,000/yr",
  },
  {
    name: "Third Party",
    desc: "Mandatory legal cover — a budget-friendly option.",
    from: "₹2,100/yr",
  },
  {
    name: "Zero Depreciation",
    desc: "Full parts value on claims — best for premium cars.",
    from: "₹12,500/yr",
  },
];

export const sampleDealers = [
  { name: "AutoMax Motors", city: "Ahmedabad", rating: 4.8, cars: 120, verified: true },
  { name: "City Cars Hub", city: "Mumbai", rating: 4.6, cars: 85, verified: true },
  { name: "Prime Wheels", city: "Delhi", rating: 4.7, cars: 200, verified: true },
  { name: "DrivePoint", city: "Bangalore", rating: 4.5, cars: 95, verified: true },
  { name: "Reliable Motors", city: "Pune", rating: 4.4, cars: 60, verified: true },
  { name: "Trust Auto", city: "Hyderabad", rating: 4.6, cars: 78, verified: true },
];
