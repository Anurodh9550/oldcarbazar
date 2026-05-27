export type LoanToolsPageId =
  | "used-car-loan"
  | "emi-calculator"
  | "loan-eligibility"
  | "compare-loans"
  | "cost-of-ownership"
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
      { id: "cost-of-ownership" as const, href: "/cost-of-ownership", label: "Cost of Ownership", icon: "🧾" },
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
      "Get an easy car loan in 2 minutes — best offers from top banks and NBFCs, all in one place.",
    description:
      "Apply for used car loan online at best interest rates on Old Car Bazar.",
  },
  "emi-calculator": {
    badge: "Smart Planner",
    title: "EMI Calculator",
    subtitle:
      "Calculate your monthly EMI in seconds — based on loan amount, tenure and interest rate.",
    description:
      "Free EMI calculator for used car loan with interest, principal and tenure breakdown.",
  },
  "loan-eligibility": {
    badge: "Instant Check",
    title: "Loan Eligibility Check",
    subtitle:
      "Instantly find out your maximum loan amount based on your salary and expenses — 100% free, no CIBIL impact.",
    description:
      "Check your used car loan eligibility based on salary and obligations.",
  },
  "compare-loans": {
    badge: "Best Deals",
    title: "Compare Interest Rates",
    subtitle:
      "Compare interest rates from India's top banks and NBFCs — pick the best lender with the lowest EMI.",
    description:
      "Compare used car loan interest rates from top banks and NBFCs in India.",
  },
  "cost-of-ownership": {
    badge: "True 5-year cost",
    title: "Cost of Ownership Calculator",
    subtitle:
      "See the real per-month cost of a car — fuel, insurance, service, parking and depreciation, all in one place.",
    description:
      "Calculate the true cost of owning a used car over 5 years — fuel, insurance, service, depreciation.",
  },
  compare: {
    badge: "Side-by-Side",
    title: "Compare Cars",
    subtitle:
      "Compare two or three used cars side by side — on price, specs, mileage and features.",
    description:
      "Compare used cars side-by-side on Old Car Bazar — price, mileage and specs.",
  },
  "history-report": {
    badge: "Verified Data",
    title: "Vehicle History Report",
    subtitle:
      "Enter the registration number and view the car's full history — RC, insurance, challans and ownership.",
    description:
      "Get vehicle history report for used car — RC, insurance, challan and accident history.",
  },
  assured: {
    badge: "200-Point Inspection",
    title: "Assured Cars",
    subtitle:
      "Hand-picked, inspected and warranty-backed used cars — no haggling, no surprises.",
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
  { icon: "⚡", title: "Quick Approval", desc: "Loan sanction within 24-48 hours after document verification." },
  { icon: "💯", title: "Up to 100% Funding", desc: "Finance up to 90-100% of the on-road price." },
  { icon: "🧾", title: "Minimal Documentation", desc: "Only Aadhaar, PAN, salary slip and bank statement required." },
  { icon: "📈", title: "Flexible Tenure", desc: "Tenure from 12 to 84 months — plan your EMI your way." },
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
  { icon: "🔧", title: "200+ Point Inspection", desc: "Engine, transmission, electricals and body — everything checked." },
  { icon: "🛡", title: "6 Month Warranty", desc: "Included warranty on engine and gearbox — extendable up to 24 months." },
  { icon: "🔁", title: "5-Day Money Back", desc: "Didn't like the car? Return it within 5 days — no questions asked." },
  { icon: "📄", title: "Clean Documentation", desc: "RC, insurance, NOC and service records — all verified & transferred." },
  { icon: "💰", title: "Fair Fixed Price", desc: "No haggling — transparent on-road price, no hidden charges." },
  { icon: "🚗", title: "Free Home Test Drive", desc: "Test drive at your doorstep — convenient and safe." },
];

export const historyReportSections = [
  { icon: "📄", title: "RC Details", desc: "Registration number, owner name, RTO and registration date." },
  { icon: "🛡", title: "Insurance Status", desc: "Active policy details, expiry date and insurer information." },
  { icon: "⚠️", title: "Challan / E-Challan", desc: "Pending traffic violations and unpaid fines across India." },
  { icon: "👥", title: "Ownership History", desc: "Number of previous owners and last transfer date." },
  { icon: "🛠", title: "Accident / Damage", desc: "Reported accidents, major repairs and structural damage (if any)." },
  { icon: "✅", title: "PUC & Hypothecation", desc: "Pollution certificate validity and loan hypothecation status." },
];

export const compareTips = [
  "Comparing 2-3 cars at a time is best practice — don't overload yourself.",
  "Besides price, also check mileage, service cost and resale value.",
  "Always look at on-road price (RTO + insurance + accessories), not ex-showroom.",
  "When comparing used cars, year of manufacture and kilometres driven matter.",
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
