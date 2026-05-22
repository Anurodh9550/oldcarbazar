export const searchBudgetRanges = [
  { id: "under-2", label: "Under ₹2 Lakh", min: 0, max: 2 },
  { id: "2-3", label: "₹2 - ₹3 Lakh", min: 2, max: 3 },
  { id: "3-5", label: "₹3 - ₹5 Lakh", min: 3, max: 5 },
  { id: "5-10", label: "₹5 - ₹10 Lakh", min: 5, max: 10 },
  { id: "10-15", label: "₹10 - ₹15 Lakh", min: 10, max: 15 },
  { id: "15-plus", label: "Above ₹15 Lakh", min: 15, max: Infinity },
];

export const transmissionTypes = ["Manual", "Automatic"];

export const kmRanges = [
  { id: "under-5k", label: "< 5,000 km", max: 5000 },
  { id: "under-10k", label: "< 10,000 km", max: 10000 },
  { id: "under-20k", label: "< 20,000 km", max: 20000 },
  { id: "under-50k", label: "< 50,000 km", max: 50000 },
  { id: "50k-1L", label: "50,000 - 1,00,000 km", min: 50000, max: 100000 },
  { id: "1L-2L", label: "1,00,000 - 2,00,000 km", min: 100000, max: 200000 },
];

export const ownershipTypes = [
  "First owner",
  "Second owner",
  "Third owner",
  "Fourth owner & above",
];

export const bodyTypeFilters = [
  "Hatchback",
  "SUV",
  "Sedan",
  "MUV",
  "Minivan",
  "Coupe",
];

export const sellerTypes = [
  { id: "all", label: "All Cars" },
  { id: "partner", label: "Partner Cars" },
  { id: "direct", label: "Direct Owner" },
];

export const premiumSellers = [
  { id: "old-car-bazar", label: "Old Car Bazar Assured" },
  { id: "cars24", label: "Cars24" },
  { id: "spinny", label: "Spinny" },
];

export const rtoStates = [
  "Maharashtra",
  "Gujarat",
  "Delhi NCR",
  "Karnataka",
  "Telangana",
  "Tamil Nadu",
  "Rajasthan",
  "West Bengal",
  "Uttar Pradesh",
  "Punjab",
];

export const seatOptions = ["5 Seater", "7 Seater", "8 Seater"];

export const discountFilters = [
  { id: "discounted", label: "Discounted Cars" },
  { id: "upto-20k", label: "Upto ₹20,000 off" },
  { id: "upto-50k", label: "Upto ₹50,000 off" },
  { id: "upto-1L", label: "Upto ₹1 Lakh off" },
];

export const carColors = [
  { id: "white", label: "White", hex: "#f5f5f5" },
  { id: "grey", label: "Grey", hex: "#9ca3af" },
  { id: "silver", label: "Silver", hex: "#d1d5db" },
  { id: "black", label: "Black", hex: "#1f2937" },
  { id: "blue", label: "Blue", hex: "#3b82f6" },
  { id: "red", label: "Red", hex: "#ef4444" },
  { id: "brown", label: "Brown", hex: "#92400e" },
];

export const sortOptions = [
  { id: "relevance", label: "Relevance" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "kms-asc", label: "Kms: Low to High" },
] as const;

export type SortOptionId = (typeof sortOptions)[number]["id"];

export type SearchFilterParams = {
  city: string | null;
  brand: string | null;
  fuel: string | null;
  transmission: string | null;
  budget: string | null;
  kms: string | null;
  ownership: string | null;
  bodyType: string | null;
  sellerType: string | null;
  premium: string | null;
  rto: string | null;
  seats: string | null;
  discount: string | null;
  color: string | null;
};

export const FILTER_PARAM_KEYS = [
  "city",
  "brand",
  "fuel",
  "transmission",
  "budget",
  "kms",
  "ownership",
  "bodyType",
  "sellerType",
  "premium",
  "rto",
  "seats",
  "discount",
  "color",
] as const;
