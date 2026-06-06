/**
 * Bank + loan-partner catalogue for the public "Apply for Car Loan" section.
 *
 * Each supported bank is mapped to one of our loan-assistance partners
 * (Paisabazaar / BankBazaar / IndiaLends). The selected bank and its partner
 * are auto-filled into the Loan Inquiry form so the lead lands in the admin
 * panel with full context.
 */

export type LoanPartnerId = "Paisabazaar" | "BankBazaar" | "IndiaLends";

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
