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
      "Apni car ki fair market price jaano — brand, model, year aur condition ke basis par instant estimate.",
    description: "Get free used car valuation in India on Old Car Bazar.",
  },
  "sell-guide": {
    badge: "Step by Step",
    title: "How Selling Works",
    subtitle:
      "Old Car Bazar par car bechna simple hai — 3 steps mein listing live, buyers se direct baat.",
    description: "Learn how to sell your used car on Old Car Bazar.",
  },
  "sell-tips": {
    badge: "Expert Advice",
    title: "Tips to Sell Faster",
    subtitle:
      "Pro tips se apni car jaldi aur achhi price par bechein — photos, pricing aur buyer response.",
    description: "Tips to sell your used car faster on Old Car Bazar.",
  },
  dealer: {
    badge: "Partner Program",
    title: "Dealer / Partner Login",
    subtitle:
      "Authorized dealers aur partners ke liye — bulk listings, leads aur verified seller badge.",
    description: "Dealer and partner login for Old Car Bazar.",
  },
  dealers: {
    badge: "Verified Network",
    title: "Find Dealers",
    subtitle:
      "Apne city ke trusted used car dealers dhundho — inspection, paperwork aur best deals.",
    description: "Find verified used car dealers near you.",
  },
  "rc-guide": {
    badge: "Legal & Paperwork",
    title: "RC Transfer Guide",
    subtitle:
      "Car bechne ke baad RC transfer ka complete process — documents, RTO steps aur timelines.",
    description: "RC transfer guide for selling your car in India.",
  },
  insurance: {
    badge: "Stay Protected",
    title: "Insurance Renewal",
    subtitle:
      "Nayi car ya transfer ke baad insurance renew karo — compare plans aur best rates paao.",
    description: "Insurance renewal guide after selling or buying a car.",
  },
  messages: {
    badge: "Buyer Connect",
    title: "Chat with Buyers",
    subtitle:
      "Interested buyers se directly chat karo — queries reply karo aur deal close karo faster.",
    description: "Chat with buyers on Old Car Bazar.",
  },
};

export const sellGuideSteps = [
  {
    step: 1,
    title: "Create Free Account",
    desc: "Login with mobile number. Seller dashboard access instantly milega.",
    icon: "👤",
  },
  {
    step: 2,
    title: "Post Your Listing",
    desc: "Car details, photos, price aur city add karo — 2 minute mein ad live.",
    icon: "📝",
  },
  {
    step: 3,
    title: "Get Buyer Inquiries",
    desc: "Buyers aapki listing dekhenge aur chat/call se contact karenge.",
    icon: "📩",
  },
  {
    step: 4,
    title: "Inspect & Negotiate",
    desc: "Test drive arrange karo, price finalize karo — transparent deal.",
    icon: "🤝",
  },
  {
    step: 5,
    title: "Complete Sale & RC",
    desc: "Payment lo, RC transfer karo — hamara guide follow karo for paperwork.",
    icon: "✅",
  },
];

export const sellTips = [
  {
    title: "Professional Photos",
    desc: "Daylight mein front, back, interior aur odometer ki clear photos upload karo.",
    tag: "2× more views",
  },
  {
    title: "Honest Description",
    desc: "Service history, accidents aur repairs clearly likho — trust badhta hai.",
    tag: "Faster deals",
  },
  {
    title: "Competitive Pricing",
    desc: "Pehle free valuation lo, phir market price se 2-3% kam rakho for quick sale.",
    tag: "Best price",
  },
  {
    title: "Quick Responses",
    desc: "Buyer messages ka 1 hour ke andar jawab do — serious buyers wait nahi karte.",
    tag: "More leads",
  },
  {
    title: "Keep Car Ready",
    desc: "Selling se pehle wash, minor repair aur PUC update karwa lo.",
    tag: "Better offers",
  },
  {
    title: "Complete Documents",
    desc: "RC, insurance, service records ready rakho — deal same day close ho sakti hai.",
    tag: "No delays",
  },
];

export const rcTransferSteps = [
  {
    title: "Sale Agreement",
    desc: "Buyer-seller ke beech sale agreement / Form 29 & 30 sign karo.",
  },
  {
    title: "Clear Pending Dues",
    desc: "Challan, loan (NOC) aur insurance transfer settle karo.",
  },
  {
    title: "Visit RTO",
    desc: "Dono parties ke documents ke saath local RTO mein application submit karo.",
  },
  {
    title: "New RC Issued",
    desc: "7–15 working days mein buyer ke naam par naya RC issue hota hai.",
  },
];

export const insurancePlans = [
  {
    name: "Comprehensive",
    desc: "Own damage + third party — full protection for new car.",
    from: "₹8,000/yr",
  },
  {
    name: "Third Party",
    desc: "Mandatory legal cover — budget-friendly option.",
    from: "₹2,100/yr",
  },
  {
    name: "Zero Depreciation",
    desc: "Claim par full parts value — premium cars ke liye best.",
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
