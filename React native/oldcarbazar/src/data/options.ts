/** Shared option lists — ported from the Next.js website data files so the
 *  mobile app offers the exact same brands, filters and sell-form choices. */

export const carBrands = [
  "Maruti", "Hyundai", "Tata", "Honda", "Toyota", "Mahindra",
  "Kia", "Ford", "Volkswagen", "Renault", "Skoda", "MG",
  "Nissan", "BMW", "Mercedes", "Audi", "Other",
];

export const popularBrands = [
  "Maruti", "Hyundai", "Tata", "Honda", "Toyota",
  "Mahindra", "Kia", "Ford", "Volkswagen", "Renault",
];

export const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid", "LPG"];

export const transmissionTypes = ["Manual", "Automatic"];

export const ownerOptions = ["1st Owner", "2nd Owner", "3rd Owner", "4th+ Owner"];

export const bodyTypes = ["Hatchback", "SUV", "Sedan", "MUV", "Minivan", "Coupe"];

export const seatOptions = [
  { value: "5", label: "5 Seater" },
  { value: "7", label: "7 Seater" },
  { value: "8", label: "8 Seater" },
];

export const registrationMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const insuranceOptions = [
  { value: "comprehensive-valid", label: "Comprehensive — Valid" },
  { value: "third-party-valid", label: "Third Party — Valid" },
  { value: "expired", label: "Expired" },
  { value: "none", label: "Not Available" },
];

export const featureOptions = [
  "Automatic Climate Control",
  "Air Purifier",
  "Parking Sensors",
  "Cruise Control",
  "Touchscreen Infotainment",
  "ABS with EBD",
  "Dual Airbags",
  "Rear AC Vents",
  "Alloy Wheels",
  "Push Button Start",
  "Reverse Camera",
  "Bluetooth Connectivity",
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

export const cities = [
  "Ahmedabad", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune",
  "Chennai", "Kolkata", "Jaipur", "Surat", "Chandigarh", "Lucknow",
];

export const budgetRanges = [
  { id: "under-2", label: "Under ₹2 Lakh", min: 0, max: 2 },
  { id: "2-3", label: "₹2 - ₹3 Lakh", min: 2, max: 3 },
  { id: "3-5", label: "₹3 - ₹5 Lakh", min: 3, max: 5 },
  { id: "5-10", label: "₹5 - ₹10 Lakh", min: 5, max: 10 },
  { id: "10-15", label: "₹10 - ₹15 Lakh", min: 10, max: 15 },
  { id: "15-plus", label: "Above ₹15 Lakh", min: 15, max: Infinity },
];

export const kmRanges = [
  { id: "under-10k", label: "< 10,000 km", min: 0, max: 10000 },
  { id: "under-20k", label: "< 20,000 km", min: 0, max: 20000 },
  { id: "under-50k", label: "< 50,000 km", min: 0, max: 50000 },
  { id: "50k-1L", label: "50k - 1L km", min: 50000, max: 100000 },
  { id: "1L-2L", label: "1L - 2L km", min: 100000, max: 200000 },
];

export const sortOptions = [
  { id: "relevance", label: "Relevance" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "kms-asc", label: "Kms: Low to High" },
  { id: "newest", label: "Newest first" },
] as const;

export type SortId = (typeof sortOptions)[number]["id"];

export const currentYear = new Date().getFullYear();
export const carYears = Array.from({ length: 25 }, (_, i) => currentYear - i);

export const MIN_LISTING_PHOTOS = 3;
export const MAX_LISTING_PHOTOS = 12;
