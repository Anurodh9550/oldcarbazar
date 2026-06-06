/** Content ported from the Next.js website data files so the app mirrors it. */

export type LoanBank = {
  name: string;
  rate: string;
  processing: string;
  tenure: string;
  highlight?: string;
};

export const loanBanks: LoanBank[] = [
  { name: "HDFC Bank", rate: "9.50% – 13.75%", processing: "Up to 1%", tenure: "12 – 84 months", highlight: "Quick approval" },
  { name: "ICICI Bank", rate: "9.75% – 14.00%", processing: "Up to 2%", tenure: "12 – 84 months", highlight: "100% on-road funding" },
  { name: "Axis Bank", rate: "9.65% – 13.50%", processing: "₹3,500 onwards", tenure: "12 – 84 months" },
  { name: "SBI", rate: "10.05% – 12.65%", processing: "0.40% (min ₹500)", tenure: "12 – 84 months", highlight: "Lowest processing fee" },
  { name: "Kotak Mahindra", rate: "10.50% – 15.00%", processing: "Up to 2.5%", tenure: "12 – 60 months" },
  { name: "Mahindra Finance", rate: "11.00% – 16.50%", processing: "Up to 3%", tenure: "12 – 60 months", highlight: "Rural / semi-urban friendly" },
];

export const loanBenefits = [
  { title: "Quick Approval", desc: "Loan sanction within 24-48 hours after document verification." },
  { title: "Up to 100% Funding", desc: "Finance up to 90-100% of the on-road price." },
  { title: "Minimal Documentation", desc: "Only Aadhaar, PAN, salary slip and bank statement required." },
  { title: "Flexible Tenure", desc: "Tenure from 12 to 84 months — plan your EMI your way." },
];

export const loanDocs = [
  "Aadhaar Card / Voter ID (Identity proof)",
  "PAN Card (mandatory)",
  "Recent salary slips (3 months) / ITR for self-employed",
  "Bank statement (last 6 months)",
  "Address proof (utility bill / rental agreement)",
  "Car's RC, insurance copy & inspection report",
];

export const assuredFeatures = [
  { title: "200+ Point Inspection", desc: "Engine, transmission, electricals and body — everything checked." },
  { title: "6 Month Warranty", desc: "Included warranty on engine and gearbox — extendable up to 24 months." },
  { title: "5-Day Money Back", desc: "Didn't like the car? Return it within 5 days — no questions asked." },
  { title: "Clean Documentation", desc: "RC, insurance, NOC and service records — all verified & transferred." },
  { title: "Fair Fixed Price", desc: "No haggling — transparent on-road price, no hidden charges." },
  { title: "Free Home Test Drive", desc: "Test drive at your doorstep — convenient and safe." },
];

export const historyReportSections = [
  { title: "RC Details", desc: "Registration number, owner name, RTO and registration date." },
  { title: "Insurance Status", desc: "Active policy details, expiry date and insurer information." },
  { title: "Challan / E-Challan", desc: "Pending traffic violations and unpaid fines across India." },
  { title: "Ownership History", desc: "Number of previous owners and last transfer date." },
  { title: "Accident / Damage", desc: "Reported accidents, major repairs and structural damage (if any)." },
  { title: "PUC & Hypothecation", desc: "Pollution certificate validity and loan hypothecation status." },
];

export const compareTips = [
  "Comparing 2-3 cars at a time is best practice — don't overload yourself.",
  "Besides price, also check mileage, service cost and resale value.",
  "Always look at on-road price (RTO + insurance + accessories), not ex-showroom.",
  "When comparing used cars, year of manufacture and kilometres driven matter.",
];

export const faqs = [
  { q: "Is Old Car Bazar free to use?", a: "Yes — completely free for buyers. Sellers can post free listings as well." },
  { q: "How do I contact a seller?", a: "Use the Call / WhatsApp / Inquiry buttons on any listing page to connect directly with the seller." },
  { q: "Does Old Car Bazar verify cars?", a: "We display DIRECT OWNER and partner badges. Physical inspection is the buyer's responsibility." },
  { q: "How long does RC transfer take?", a: "Usually 7–15 working days, depending on the RTO. Check our RC guide for details." },
  { q: "Can I sell my car without visiting a dealer?", a: "Absolutely — post a listing from your phone and deal directly with buyers." },
  { q: "What payment methods are safe?", a: "Use bank transfer, cheque or UPI. Avoid cash for large amounts." },
];

export const safetyTips = [
  { title: "Meet in Public", desc: "Always meet and test drive in a public place — a dealer showroom is best." },
  { title: "Verify Documents", desc: "Check the RC, insurance, service history and seller ID." },
  { title: "Avoid Advance Payment", desc: "Don't pay anything before inspecting the car and verifying papers." },
  { title: "Keep Records", desc: "Keep a record of all chats and calls with the seller." },
  { title: "Professional Inspection", desc: "Get a pre-purchase inspection done by a trusted mechanic." },
  { title: "Report Suspicious Ads", desc: "Report any fake or scam listing immediately." },
];

export const buySteps = [
  { title: "Search & Filter", desc: "Find cars by city, budget, brand and fuel type." },
  { title: "Compare Listings", desc: "Compare photos, specs and prices — then shortlist your favourites." },
  { title: "Contact Seller", desc: "Talk to the seller via call/WhatsApp and schedule a test drive." },
  { title: "Inspect the Car", desc: "Inspect with a mechanic and verify all documents." },
  { title: "Close the Deal", desc: "Complete payment, RC transfer and insurance." },
];

export const sellSteps = [
  { title: "Free Login", desc: "Create an account and unlock the seller dashboard." },
  { title: "Post Listing", desc: "Upload car details and photos in 2 minutes." },
  { title: "Get Inquiries", desc: "Buyers will contact you directly." },
  { title: "Negotiate", desc: "Finalise the deal at a fair price." },
  { title: "Transfer RC", desc: "Follow our RC guide to complete the sale." },
];

export const rcSteps = [
  { title: "Collect Documents", desc: "Form 29 & 30, RC, insurance, PUC, both parties' ID & address proof." },
  { title: "Submit at RTO", desc: "Submit the transfer application at the RTO where the car is registered." },
  { title: "Pay Fees", desc: "Pay the transfer fee and any pending road tax / dues." },
  { title: "Verification", desc: "RTO verifies documents; inspection may be required." },
  { title: "New RC Issued", desc: "Updated RC is issued in the buyer's name in 7–15 working days." },
];

export const insurancePoints = [
  { title: "Comprehensive Cover", desc: "Covers own damage + third-party liability + theft & natural calamities." },
  { title: "Third-Party Only", desc: "Mandatory by law — covers damage to others, not your own car." },
  { title: "No Claim Bonus", desc: "Transfer the previous owner's NCB or start fresh on transfer." },
  { title: "Add-ons", desc: "Zero-dep, engine protect and roadside assistance worth considering." },
];

export const sampleReviews = [
  { car: "2021 Hyundai Creta", rating: 4.8, author: "Vikram P.", excerpt: "Smooth buying experience, honest seller." },
  { car: "2019 Maruti Swift", rating: 4.6, author: "Neha R.", excerpt: "Great value for money, quick RC transfer." },
  { car: "2020 Tata Nexon", rating: 4.7, author: "Arjun M.", excerpt: "Verified listing, exactly as described." },
  { car: "2018 Honda City", rating: 4.5, author: "Priya K.", excerpt: "Helpful platform, easy to compare cars." },
];

export const newsArticles = [
  { title: "Used Car Market Grows 12% in 2026", date: "May 10, 2026", tag: "Market" },
  { title: "Best SUVs Under ₹10 Lakh", date: "May 5, 2026", tag: "Buying Guide" },
  { title: "RC Transfer Rules Updated", date: "Apr 28, 2026", tag: "Legal" },
  { title: "Electric Used Cars: Worth It?", date: "Apr 20, 2026", tag: "EV" },
];

export const videoItems = [
  { title: "How to Buy Used Car Safely", duration: "8:24", views: "12K" },
  { title: "Sell Your Car in 2 Minutes", duration: "3:15", views: "28K" },
  { title: "RC Transfer Complete Guide", duration: "6:40", views: "9K" },
  { title: "Top 5 Cars Under 5 Lakh", duration: "10:02", views: "45K" },
];

export const SUPPORT_EMAIL = "support@oldcarbazar.com";
export const SUPPORT_PHONE = "+919876543210";

// --------------------------------------------------------------------------- //
// Static info pages — rendered by info/[slug].tsx
// --------------------------------------------------------------------------- //

export type InfoBlock =
  | { type: "text"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "steps"; items: { title: string; desc: string }[] }
  | { type: "features"; items: { title: string; desc: string }[] }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "reviews" }
  | { type: "news" }
  | { type: "videos" }
  | { type: "contact" };

export type InfoPage = {
  badge: string;
  title: string;
  subtitle: string;
  icon: string;
  blocks: InfoBlock[];
};

export const infoPages: Record<string, InfoPage> = {
  about: {
    badge: "Our Story",
    title: "About Old Car Bazar",
    subtitle: "India's trusted used car marketplace — connecting buyers and sellers directly.",
    icon: "information-circle-outline",
    blocks: [
      { type: "text", text: "Old Car Bazar is India's growing destination for buying and selling pre-owned cars. We connect genuine buyers with verified sellers directly — no middlemen, no hidden broker fees." },
      { type: "features", items: [
        { title: "Direct Owner Deals", desc: "Chat directly with owners and save on broker commissions." },
        { title: "Verified Listings", desc: "Every listing is checked for basic details before going live." },
        { title: "Free to Sell", desc: "Post your car ad at zero cost and reach thousands of buyers." },
        { title: "City-wise Search", desc: "Find cars in 12+ Indian cities with smart filters." },
      ]},
    ],
  },
  contact: {
    badge: "Get in Touch",
    title: "Contact Us",
    subtitle: "Questions, feedback or support — we're here to help.",
    icon: "call-outline",
    blocks: [
      { type: "text", text: "Reach the Old Car Bazar support team for any help with buying, selling or your account." },
      { type: "contact" },
    ],
  },
  "help-buy": {
    badge: "Buyer Guide",
    title: "How to Buy",
    subtitle: "A complete step-by-step guide to buying a used car — safe, smart and stress-free.",
    icon: "cart-outline",
    blocks: [{ type: "steps", items: buySteps }],
  },
  "help-sell": {
    badge: "Seller Guide",
    title: "How to Sell",
    subtitle: "Sell your car online — the entire process from free listing to deal.",
    icon: "cash-outline",
    blocks: [{ type: "steps", items: sellSteps }],
  },
  safety: {
    badge: "Stay Safe",
    title: "Safety Tips",
    subtitle: "Avoid scams and close secure deals while buying and selling.",
    icon: "shield-checkmark-outline",
    blocks: [{ type: "features", items: safetyTips }],
  },
  faq: {
    badge: "Help Center",
    title: "Frequently Asked Questions",
    subtitle: "Answers to common questions — buying, selling, payments and paperwork.",
    icon: "help-circle-outline",
    blocks: [{ type: "faq", items: faqs }],
  },
  "rc-guide": {
    badge: "Paperwork",
    title: "RC Transfer Guide",
    subtitle: "Transfer the car's registration certificate into your name — step by step.",
    icon: "document-text-outline",
    blocks: [
      { type: "steps", items: rcSteps },
      { type: "text", text: "Tip: Always complete RC transfer within 14 days of sale to avoid liability for the previous owner's challans." },
    ],
  },
  "sell-guide": {
    badge: "Seller Guide",
    title: "Selling Guide",
    subtitle: "Get the best price for your car with these proven tips.",
    icon: "trending-up-outline",
    blocks: [
      { type: "bullets", items: [
        "Clean and detail your car before clicking photos.",
        "Take clear photos in daylight from multiple angles.",
        "Price it right — check our free valuation tool.",
        "Keep all documents ready: RC, insurance, service records.",
        "Respond quickly to buyer inquiries to close faster.",
      ]},
    ],
  },
  "sell-tips": {
    badge: "Pro Tips",
    title: "Selling Tips",
    subtitle: "Small things that help your car sell faster and for more.",
    icon: "bulb-outline",
    blocks: [
      { type: "bullets", items: [
        "Write an honest, detailed description — builds trust.",
        "Mention recent service, new tyres or battery.",
        "Be available on WhatsApp for quick replies.",
        "Offer a test drive in a safe, public location.",
        "Keep your asking price slightly negotiable.",
      ]},
    ],
  },
  insurance: {
    badge: "Protect Your Car",
    title: "Car Insurance",
    subtitle: "Understand used car insurance before you buy.",
    icon: "umbrella-outline",
    blocks: [
      { type: "features", items: insurancePoints },
      { type: "text", text: "On transfer, get the insurance policy moved to your name within 14 days to keep the cover valid." },
    ],
  },
  reviews: {
    badge: "Community",
    title: "Car Reviews",
    subtitle: "Real buyer reviews — honest feedback on popular used cars.",
    icon: "star-outline",
    blocks: [{ type: "reviews" }],
  },
  news: {
    badge: "Latest",
    title: "News & Updates",
    subtitle: "Used car market news, buying guides and industry updates.",
    icon: "newspaper-outline",
    blocks: [{ type: "news" }],
  },
  videos: {
    badge: "Watch & Learn",
    title: "Videos",
    subtitle: "Buying, selling and maintenance tips — watch our video guides.",
    icon: "play-circle-outline",
    blocks: [{ type: "videos" }],
  },
  careers: {
    badge: "Join Us",
    title: "Careers With Us",
    subtitle: "Join the Old Car Bazar team — exciting roles for passionate people.",
    icon: "briefcase-outline",
    blocks: [
      { type: "text", text: "We're building India's most trusted used car marketplace. If you love cars and technology, we'd love to hear from you." },
      { type: "bullets", items: ["Frontend / Mobile Engineers", "Backend Engineers (Django)", "City Operations Managers", "Customer Support Associates"] },
      { type: "contact" },
    ],
  },
  partner: {
    badge: "Grow Together",
    title: "Partner with Us",
    subtitle: "Dealers, insurers and service partners — let's grow together.",
    icon: "people-outline",
    blocks: [
      { type: "text", text: "Become a partner dealer and list unlimited inventory, get a verified PRO badge and reach more buyers." },
      { type: "features", items: [
        { title: "PRO Dealer Badge", desc: "Stand out with a verified badge on all your listings." },
        { title: "Bulk Listings", desc: "Upload and manage your entire inventory easily." },
        { title: "Priority Support", desc: "Dedicated account manager for partner dealers." },
      ]},
      { type: "contact" },
    ],
  },
  advertise: {
    badge: "Reach Buyers",
    title: "Advertise with Us",
    subtitle: "Targeted advertising for dealers and brands — reach the right buyers.",
    icon: "megaphone-outline",
    blocks: [
      { type: "text", text: "Promote your brand to thousands of active car buyers across India with banner, listing and featured-placement ads." },
      { type: "contact" },
    ],
  },
  investors: {
    badge: "Investor Relations",
    title: "Investors",
    subtitle: "Old Car Bazar's growth, financials and leadership.",
    icon: "stats-chart-outline",
    blocks: [
      { type: "text", text: "India's used car market is growing fast. Old Car Bazar is expanding city coverage, listings and revenue. For investor decks and updates, get in touch." },
      { type: "contact" },
    ],
  },
  feedback: {
    badge: "We're Listening",
    title: "Feedback",
    subtitle: "Got a suggestion or complaint? Let us know.",
    icon: "chatbox-ellipses-outline",
    blocks: [
      { type: "text", text: "Your feedback helps us improve. Reach out anytime." },
      { type: "contact" },
    ],
  },
  terms: {
    badge: "Legal",
    title: "Terms & Conditions",
    subtitle: "Terms for using Old Car Bazar — for buyers and sellers.",
    icon: "reader-outline",
    blocks: [
      { type: "bullets", items: [
        "Old Car Bazar is a marketplace platform — we do not own or sell the listed cars.",
        "Listing accuracy is the seller's responsibility; buyers must verify before purchase.",
        "Users must not post fraudulent, duplicate or illegal listings.",
        "Physical inspection and document verification are the buyer's responsibility.",
        "We may remove listings that violate our policies without notice.",
      ]},
    ],
  },
  privacy: {
    badge: "Privacy",
    title: "Privacy Policy",
    subtitle: "How we collect, use and protect your data.",
    icon: "lock-closed-outline",
    blocks: [
      { type: "bullets", items: [
        "We collect your name, phone, email and city to enable buying/selling.",
        "Your contact details are shared with sellers/buyers only when you engage a listing.",
        "We never sell your personal data to third parties.",
        "You can request deletion of your account and data anytime.",
        "We use secure storage and encrypted connections to protect your data.",
      ]},
    ],
  },
  policies: {
    badge: "Compliance",
    title: "Corporate Policies",
    subtitle: "Anti-fraud, refund, content and dealer policies.",
    icon: "shield-outline",
    blocks: [
      { type: "features", items: [
        { title: "Anti-Fraud", desc: "Zero tolerance for fake listings and scams. Offenders are banned." },
        { title: "Content Policy", desc: "Listings must be genuine, legal and non-offensive." },
        { title: "Refund Policy", desc: "Paid plan refunds are handled per the plan terms on the website." },
        { title: "Dealer Policy", desc: "Partner dealers must maintain accurate inventory and fair pricing." },
      ]},
    ],
  },
};

export const infoSlugs = Object.keys(infoPages);
