export type LoanToolsPageId =
  | "used-car-loan"
  | "emi-calculator"
  | "loan-eligibility"
  | "compare-loans"
  | "compare"
  | "history-report"
  | "assured";

export const loanToolsNavGroups = [
  {
    title: "Finance",
    links: [
      { id: "used-car-loan" as const, href: "/used-car-loan", label: "Car Loan", icon: "💰" },
      { id: "emi-calculator" as const, href: "/emi-calculator", label: "EMI Calculator", icon: "🧮" },
      { id: "loan-eligibility" as const, href: "/loan-eligibility", label: "Eligibility", icon: "✅" },
      { id: "compare-loans" as const, href: "/compare-loans", label: "Compare Rates", icon: "📊" },
    ],
  },
  {
    title: "Car Tools",
    links: [
      { id: "compare" as const, href: "/compare", label: "Compare Cars", icon: "⚖" },
      { id: "history-report" as const, href: "/history-report", label: "History Report", icon: "📋" },
      { id: "assured" as const, href: "/assured", label: "Assured Cars", icon: "🏅" },
    ],
  },
];

export const loanToolsPageMeta: Record<
  LoanToolsPageId,
  { title: string; subtitle: string; badge: string; description: string }
> = {
  "used-car-loan": {
    badge: "Pre-approved Offers",
    title: "Used Car Loan",
    subtitle:
      "Easy car loan paayein 2 minute mein — top banks aur NBFCs ke best offers ek hi jagah par.",
    description:
      "Apply for used car loan online at best interest rates on Old Car Bazar.",
  },
  "emi-calculator": {
    badge: "Smart Planner",
    title: "EMI Calculator",
    subtitle:
      "Apni monthly EMI seconds mein calculate karein — loan amount, tenure aur interest rate ke hisaab se.",
    description:
      "Free EMI calculator for used car loan with interest, principal and tenure breakdown.",
  },
  "loan-eligibility": {
    badge: "Instant Check",
    title: "Loan Eligibility Check",
    subtitle:
      "Apni salary aur expenses ke basis par maximum loan amount turant pata karein — 100% free, no CIBIL impact.",
    description:
      "Check your used car loan eligibility based on salary and obligations.",
  },
  "compare-loans": {
    badge: "Best Deals",
    title: "Compare Interest Rates",
    subtitle:
      "India ke top banks aur NBFCs ki interest rates compare karein — lowest EMI ke saath best lender choose karein.",
    description:
      "Compare used car loan interest rates from top banks and NBFCs in India.",
  },
  compare: {
    badge: "Side-by-Side",
    title: "Compare Cars",
    subtitle:
      "Do ya teen used cars ko ek saath compare karein — price, specs, mileage aur features par.",
    description:
      "Compare used cars side-by-side on Old Car Bazar — price, mileage and specs.",
  },
  "history-report": {
    badge: "Verified Data",
    title: "Vehicle History Report",
    subtitle:
      "Registration number daalein aur car ki full history dekhein — RC, insurance, challan aur ownership.",
    description:
      "Get vehicle history report for used car — RC, insurance, challan and accident history.",
  },
  assured: {
    badge: "200-Point Inspection",
    title: "Assured Cars",
    subtitle:
      "Hand-picked, inspected aur warranty-backed used cars — no haggling, no surprises.",
    description:
      "Browse assured and certified used cars with warranty on Old Car Bazar.",
  },
};

export type LoanBank = {
  name: string;
  rate: string;
  processing: string;
  tenure: string;
  highlight?: string;
};

export const loanBanks: LoanBank[] = [
  {
    name: "HDFC Bank",
    rate: "9.50% – 13.75%",
    processing: "Up to 1%",
    tenure: "12 – 84 months",
    highlight: "Quick approval",
  },
  {
    name: "ICICI Bank",
    rate: "9.75% – 14.00%",
    processing: "Up to 2%",
    tenure: "12 – 84 months",
    highlight: "100% on-road funding",
  },
  {
    name: "Axis Bank",
    rate: "9.65% – 13.50%",
    processing: "₹3,500 onwards",
    tenure: "12 – 84 months",
  },
  {
    name: "SBI",
    rate: "10.05% – 12.65%",
    processing: "0.40% (min ₹500)",
    tenure: "12 – 84 months",
    highlight: "Lowest processing fee",
  },
  {
    name: "Kotak Mahindra",
    rate: "10.50% – 15.00%",
    processing: "Up to 2.5%",
    tenure: "12 – 60 months",
  },
  {
    name: "Mahindra Finance",
    rate: "11.00% – 16.50%",
    processing: "Up to 3%",
    tenure: "12 – 60 months",
    highlight: "Rural / semi-urban friendly",
  },
];

export const loanBenefits = [
  { icon: "⚡", title: "Quick Approval", desc: "Loan sanction within 24-48 hours after docs verification." },
  { icon: "💯", title: "Up to 100% Funding", desc: "On-road price ka 90-100% tak finance available." },
  { icon: "🧾", title: "Minimal Documentation", desc: "Sirf Aadhaar, PAN, salary slip aur bank statement chahiye." },
  { icon: "📈", title: "Flexible Tenure", desc: "12 se 84 months tak ka tenure — apni EMI plan karein." },
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
  { icon: "🔧", title: "200+ Point Inspection", desc: "Engine, transmission, electricals aur body — sab kuch check." },
  { icon: "🛡", title: "6 Month Warranty", desc: "Engine aur gearbox par included warranty — extendable up to 24 months." },
  { icon: "🔁", title: "5-Day Money Back", desc: "Pasand nahi aayi? 5 din mein return karo — no questions asked." },
  { icon: "📄", title: "Clean Documentation", desc: "RC, insurance, NOC aur service records — all verified & transferred." },
  { icon: "💰", title: "Fair Fixed Price", desc: "No haggling — transparent on-road price, no hidden charges." },
  { icon: "🚗", title: "Free Home Test Drive", desc: "Apne ghar par test drive — convenient aur safe." },
];

export const historyReportSections = [
  { icon: "📄", title: "RC Details", desc: "Registration number, owner name, RTO aur registration date." },
  { icon: "🛡", title: "Insurance Status", desc: "Active policy details, expiry date aur insurer information." },
  { icon: "⚠️", title: "Challan / E-Challan", desc: "Pending traffic violations aur unpaid fines across India." },
  { icon: "👥", title: "Ownership History", desc: "Pichhle owners ka count aur last transfer date." },
  { icon: "🛠", title: "Accident / Damage", desc: "Reported accidents, major repairs aur structural damage (if any)." },
  { icon: "✅", title: "PUC & Hypothecation", desc: "Pollution certificate validity aur loan hypothecation status." },
];

export const compareTips = [
  "2-3 cars ko ek saath compare karna best practice hai — overload mat karo.",
  "Price ke alawa mileage, service cost aur resale value bhi check karein.",
  "Always look at on-road price (RTO + insurance + accessories) not ex-showroom.",
  "Used car compare karte waqt year of manufacture aur KMs important hain.",
];

export const sampleAssuredCars = [
  {
    id: "a1",
    title: "2021 Hyundai Creta SX",
    specs: "32,000 kms • Petrol • Automatic",
    price: "₹14.2 Lakh",
    city: "Mumbai",
    inspection: "215 points checked",
    warranty: "6 months",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop",
  },
  {
    id: "a2",
    title: "2020 Maruti Baleno Zeta",
    specs: "28,000 kms • Petrol • Manual",
    price: "₹6.9 Lakh",
    city: "Ahmedabad",
    inspection: "210 points checked",
    warranty: "6 months",
    image:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?w=600&h=400&fit=crop",
  },
  {
    id: "a3",
    title: "2022 Kia Sonet HTX",
    specs: "18,500 kms • Petrol • Automatic",
    price: "₹11.5 Lakh",
    city: "Pune",
    inspection: "220 points checked",
    warranty: "12 months",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
  },
  {
    id: "a4",
    title: "2019 Honda City VX CVT",
    specs: "46,000 kms • Petrol • Automatic",
    price: "₹9.4 Lakh",
    city: "Delhi",
    inspection: "200 points checked",
    warranty: "6 months",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop",
  },
];
