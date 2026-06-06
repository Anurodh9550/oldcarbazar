/**
 * Bank + loan-partner catalogue for the public "Apply for Car Loan" section.
 *
 * Each supported bank is mapped to one of our loan-assistance partners
 * (Paisabazaar / BankBazaar / IndiaLends). The selected bank and its partner
 * are auto-filled into the Loan Inquiry form so the lead lands in the admin
 * panel with full context.
 */

export type LoanPartnerId =
  | "Paisabazaar"
  | "BankBazaar"
  | "IndiaLends"
  | "MyLoanCare"
  | "CreditMantri"
  | "Banksathi";

export type LoanPartner = {
  id: LoanPartnerId;
  name: string;
  tagline: string;
  description: string;
  /** Tailwind classes for the partner badge tile. */
  accent: string;
};

export const loanPartners: Record<LoanPartnerId, LoanPartner> = {
  Paisabazaar: {
    id: "Paisabazaar",
    name: "Paisabazaar",
    tagline: "India's largest marketplace for loans",
    description:
      "Compare and apply for used car loans across 50+ lenders with instant eligibility and doorstep document pickup.",
    accent: "from-violet-500 to-indigo-600",
  },
  BankBazaar: {
    id: "BankBazaar",
    name: "BankBazaar",
    tagline: "Paperless loans, instant approval",
    description:
      "Get pre-qualified offers with a 100% online journey, e-KYC and quick disbursal — no impact on your credit score.",
    accent: "from-sky-500 to-blue-600",
  },
  IndiaLends: {
    id: "IndiaLends",
    name: "IndiaLends",
    tagline: "Smart lending, better rates",
    description:
      "Data-driven matching connects you to the lender most likely to approve your loan at the lowest interest rate.",
    accent: "from-emerald-500 to-green-600",
  },
  MyLoanCare: {
    id: "MyLoanCare",
    name: "MyLoanCare",
    tagline: "Lowest EMI, guaranteed",
    description:
      "Compare real-time rates from 40+ banks and NBFCs, check eligibility instantly and apply for the cheapest used car loan.",
    accent: "from-amber-500 to-orange-600",
  },
  CreditMantri: {
    id: "CreditMantri",
    name: "CreditMantri",
    tagline: "Loans matched to your credit profile",
    description:
      "Get loan options tailored to your credit score — even with a thin or low CIBIL history — from our lending partners.",
    accent: "from-rose-500 to-red-600",
  },
  Banksathi: {
    id: "Banksathi",
    name: "Banksathi",
    tagline: "Your personal loan assistant",
    description:
      "End-to-end assistance from a dedicated advisor who picks the right lender and handles your paperwork start to finish.",
    accent: "from-teal-500 to-cyan-600",
  },
};

export type LoanBankInfo = {
  /** Stable id used in URLs (?bank=…). */
  slug: string;
  name: string;
  /** Loan-assistance partner that processes this bank's applications. */
  partner: LoanPartnerId;
  /** Short initials shown on the branded logo tile. */
  logo: string;
  /** Tailwind gradient classes for the logo tile. */
  color: string;
  rate: string;
  processing: string;
  tenure: string;
  maxFunding: string;
  highlight: string;
};

export const loanBankCatalogue: LoanBankInfo[] = [
  {
    slug: "hdfc-bank",
    name: "HDFC Bank",
    partner: "Paisabazaar",
    logo: "HDFC",
    color: "from-blue-600 to-blue-800",
    rate: "9.50% – 13.75%",
    processing: "Up to 1%",
    tenure: "12 – 84 months",
    maxFunding: "Up to 100% on-road",
    highlight: "Quick approval",
  },
  {
    slug: "icici-bank",
    name: "ICICI Bank",
    partner: "BankBazaar",
    logo: "ICICI",
    color: "from-orange-500 to-orange-700",
    rate: "9.75% – 14.00%",
    processing: "Up to 2%",
    tenure: "12 – 84 months",
    maxFunding: "Up to 100% on-road",
    highlight: "100% on-road funding",
  },
  {
    slug: "axis-bank",
    name: "Axis Bank",
    partner: "Paisabazaar",
    logo: "AXIS",
    color: "from-rose-600 to-pink-700",
    rate: "9.65% – 13.50%",
    processing: "₹3,500 onwards",
    tenure: "12 – 84 months",
    maxFunding: "Up to 95% on-road",
    highlight: "Flexible tenure",
  },
  {
    slug: "sbi-bank",
    name: "SBI Bank",
    partner: "IndiaLends",
    logo: "SBI",
    color: "from-sky-600 to-blue-700",
    rate: "10.05% – 12.65%",
    processing: "0.40% (min ₹500)",
    tenure: "12 – 84 months",
    maxFunding: "Up to 85% on-road",
    highlight: "Lowest processing fee",
  },
  {
    slug: "kotak-mahindra-bank",
    name: "Kotak Mahindra Bank",
    partner: "BankBazaar",
    logo: "KOTAK",
    color: "from-red-600 to-rose-800",
    rate: "10.50% – 15.00%",
    processing: "Up to 2.5%",
    tenure: "12 – 60 months",
    maxFunding: "Up to 90% on-road",
    highlight: "Fast disbursal",
  },
  {
    slug: "mahindra-finance",
    name: "Mahindra Finance",
    partner: "IndiaLends",
    logo: "MMFS",
    color: "from-red-500 to-red-700",
    rate: "11.00% – 16.50%",
    processing: "Up to 3%",
    tenure: "12 – 60 months",
    maxFunding: "Up to 90% on-road",
    highlight: "Rural / semi-urban friendly",
  },
  {
    slug: "bank-of-baroda",
    name: "Bank of Baroda",
    partner: "Paisabazaar",
    logo: "BOB",
    color: "from-orange-600 to-amber-700",
    rate: "9.15% – 12.40%",
    processing: "Up to 1%",
    tenure: "12 – 84 months",
    maxFunding: "Up to 90% on-road",
    highlight: "Low interest rates",
  },
  {
    slug: "idfc-first-bank",
    name: "IDFC First Bank",
    partner: "Paisabazaar",
    logo: "IDFC",
    color: "from-fuchsia-600 to-purple-700",
    rate: "9.50% – 14.50%",
    processing: "Up to 2%",
    tenure: "12 – 84 months",
    maxFunding: "Up to 100% on-road",
    highlight: "Digital-first journey",
  },
  {
    slug: "bajaj-finserv",
    name: "Bajaj Finserv",
    partner: "Paisabazaar",
    logo: "BAJAJ",
    color: "from-blue-700 to-indigo-800",
    rate: "10.00% – 16.00%",
    processing: "Up to 3%",
    tenure: "12 – 84 months",
    maxFunding: "Up to 90% value",
    highlight: "Instant approval",
  },
  {
    slug: "punjab-national-bank",
    name: "Punjab National Bank",
    partner: "BankBazaar",
    logo: "PNB",
    color: "from-amber-600 to-yellow-700",
    rate: "9.40% – 12.75%",
    processing: "0.50% (min ₹1,000)",
    tenure: "12 – 84 months",
    maxFunding: "Up to 85% on-road",
    highlight: "Wide branch network",
  },
  {
    slug: "yes-bank",
    name: "Yes Bank",
    partner: "BankBazaar",
    logo: "YES",
    color: "from-blue-600 to-sky-700",
    rate: "10.25% – 15.00%",
    processing: "Up to 2%",
    tenure: "12 – 72 months",
    maxFunding: "Up to 90% on-road",
    highlight: "Quick processing",
  },
  {
    slug: "federal-bank",
    name: "Federal Bank",
    partner: "BankBazaar",
    logo: "FED",
    color: "from-amber-500 to-orange-600",
    rate: "9.90% – 14.00%",
    processing: "Up to 1.5%",
    tenure: "12 – 84 months",
    maxFunding: "Up to 90% on-road",
    highlight: "Minimal documents",
  },
  {
    slug: "canara-bank",
    name: "Canara Bank",
    partner: "IndiaLends",
    logo: "CANARA",
    color: "from-blue-600 to-blue-800",
    rate: "9.25% – 12.50%",
    processing: "0.25% onwards",
    tenure: "12 – 84 months",
    maxFunding: "Up to 85% on-road",
    highlight: "Affordable EMIs",
  },
  {
    slug: "union-bank-of-india",
    name: "Union Bank of India",
    partner: "IndiaLends",
    logo: "UBI",
    color: "from-red-600 to-rose-700",
    rate: "9.30% – 12.90%",
    processing: "0.50% onwards",
    tenure: "12 – 84 months",
    maxFunding: "Up to 85% on-road",
    highlight: "Govt. bank trust",
  },
  {
    slug: "indusind-bank",
    name: "IndusInd Bank",
    partner: "IndiaLends",
    logo: "INDUS",
    color: "from-rose-600 to-red-800",
    rate: "10.40% – 15.50%",
    processing: "Up to 2.5%",
    tenure: "12 – 72 months",
    maxFunding: "Up to 90% on-road",
    highlight: "Premium service",
  },
  {
    slug: "tata-capital",
    name: "Tata Capital",
    partner: "MyLoanCare",
    logo: "TATA",
    color: "from-blue-700 to-slate-800",
    rate: "10.00% – 15.75%",
    processing: "Up to 3%",
    tenure: "12 – 84 months",
    maxFunding: "Up to 95% value",
    highlight: "Trusted Tata brand",
  },
  {
    slug: "cholamandalam-finance",
    name: "Cholamandalam Finance",
    partner: "MyLoanCare",
    logo: "CHOLA",
    color: "from-sky-600 to-indigo-700",
    rate: "11.00% – 17.00%",
    processing: "Up to 3%",
    tenure: "12 – 60 months",
    maxFunding: "Up to 90% value",
    highlight: "Tier 2/3 city friendly",
  },
  {
    slug: "sundaram-finance",
    name: "Sundaram Finance",
    partner: "MyLoanCare",
    logo: "SUND",
    color: "from-emerald-600 to-teal-700",
    rate: "10.75% – 16.00%",
    processing: "Up to 2.5%",
    tenure: "12 – 60 months",
    maxFunding: "Up to 90% value",
    highlight: "Decades of trust",
  },
  {
    slug: "lt-finance",
    name: "L&T Finance",
    partner: "MyLoanCare",
    logo: "L&T",
    color: "from-yellow-600 to-amber-700",
    rate: "11.25% – 17.50%",
    processing: "Up to 3%",
    tenure: "12 – 60 months",
    maxFunding: "Up to 85% value",
    highlight: "Fast doorstep service",
  },
  {
    slug: "shriram-finance",
    name: "Shriram Finance",
    partner: "MyLoanCare",
    logo: "SHRI",
    color: "from-rose-600 to-pink-700",
    rate: "11.50% – 18.00%",
    processing: "Up to 3%",
    tenure: "12 – 60 months",
    maxFunding: "Up to 90% value",
    highlight: "Older cars welcome",
  },
  {
    slug: "hdb-financial-services",
    name: "HDB Financial Services",
    partner: "CreditMantri",
    logo: "HDB",
    color: "from-blue-600 to-indigo-700",
    rate: "11.00% – 17.00%",
    processing: "Up to 3%",
    tenure: "12 – 72 months",
    maxFunding: "Up to 90% value",
    highlight: "Low credit score OK",
  },
  {
    slug: "au-small-finance-bank",
    name: "AU Small Finance Bank",
    partner: "CreditMantri",
    logo: "AU",
    color: "from-fuchsia-600 to-pink-700",
    rate: "10.50% – 16.00%",
    processing: "Up to 2.5%",
    tenure: "12 – 72 months",
    maxFunding: "Up to 90% on-road",
    highlight: "Flexible eligibility",
  },
  {
    slug: "rbl-bank",
    name: "RBL Bank",
    partner: "CreditMantri",
    logo: "RBL",
    color: "from-red-600 to-rose-700",
    rate: "10.75% – 16.50%",
    processing: "Up to 2.5%",
    tenure: "12 – 72 months",
    maxFunding: "Up to 90% on-road",
    highlight: "Quick eligibility check",
  },
  {
    slug: "indian-bank",
    name: "Indian Bank",
    partner: "CreditMantri",
    logo: "IND",
    color: "from-indigo-600 to-blue-800",
    rate: "9.40% – 12.95%",
    processing: "0.50% onwards",
    tenure: "12 – 84 months",
    maxFunding: "Up to 85% on-road",
    highlight: "Govt. bank security",
  },
  {
    slug: "bank-of-india",
    name: "Bank of India",
    partner: "CreditMantri",
    logo: "BOI",
    color: "from-orange-600 to-red-700",
    rate: "9.35% – 12.85%",
    processing: "0.25% onwards",
    tenure: "12 – 84 months",
    maxFunding: "Up to 85% on-road",
    highlight: "Pan-India reach",
  },
  {
    slug: "central-bank-of-india",
    name: "Central Bank of India",
    partner: "Banksathi",
    logo: "CBI",
    color: "from-sky-700 to-blue-900",
    rate: "9.45% – 13.00%",
    processing: "0.50% onwards",
    tenure: "12 – 84 months",
    maxFunding: "Up to 85% on-road",
    highlight: "Low documentation",
  },
  {
    slug: "karur-vysya-bank",
    name: "Karur Vysya Bank",
    partner: "Banksathi",
    logo: "KVB",
    color: "from-teal-600 to-cyan-700",
    rate: "10.00% – 14.50%",
    processing: "Up to 1.5%",
    tenure: "12 – 72 months",
    maxFunding: "Up to 85% on-road",
    highlight: "South India favourite",
  },
  {
    slug: "south-indian-bank",
    name: "South Indian Bank",
    partner: "Banksathi",
    logo: "SIB",
    color: "from-emerald-600 to-green-700",
    rate: "10.20% – 14.75%",
    processing: "Up to 1.5%",
    tenure: "12 – 72 months",
    maxFunding: "Up to 85% on-road",
    highlight: "Personalised service",
  },
  {
    slug: "muthoot-capital",
    name: "Muthoot Capital",
    partner: "Banksathi",
    logo: "MUTH",
    color: "from-red-600 to-rose-800",
    rate: "12.00% – 18.50%",
    processing: "Up to 3%",
    tenure: "12 – 48 months",
    maxFunding: "Up to 85% value",
    highlight: "Easy for first-time buyers",
  },
  {
    slug: "hero-fincorp",
    name: "Hero FinCorp",
    partner: "Banksathi",
    logo: "HERO",
    color: "from-red-500 to-orange-600",
    rate: "11.50% – 18.00%",
    processing: "Up to 3%",
    tenure: "12 – 60 months",
    maxFunding: "Up to 90% value",
    highlight: "Minimal paperwork",
  },
];

export function getBankBySlug(slug: string | null | undefined) {
  if (!slug) return undefined;
  return loanBankCatalogue.find((b) => b.slug === slug);
}

/** Loose match a free-text bank name (e.g. from editable copy) to a slug. */
export function findBankSlugByName(name: string | null | undefined) {
  if (!name) return undefined;
  const key = name.toLowerCase().replace(/[^a-z]/g, "");
  const match = loanBankCatalogue.find((b) => {
    const bankKey = b.name.toLowerCase().replace(/[^a-z]/g, "");
    return bankKey.startsWith(key) || key.startsWith(bankKey.slice(0, 4));
  });
  return match?.slug;
}

export const employmentOptions = [
  { value: "salaried", label: "Salaried" },
  { value: "self_employed", label: "Self-Employed" },
] as const;
