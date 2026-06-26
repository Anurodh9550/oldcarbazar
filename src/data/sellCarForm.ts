import { bodyTypes } from "@/data/explorePage";
import { carColors } from "@/data/searchPage";
import {
  initialTruthDeclaration,
  type TruthDeclaration,
} from "@/data/truthDeclaration";

export const carBrands = [
  "Maruti", "Hyundai", "Tata", "Honda", "Toyota", "Mahindra",
  "Kia", "Ford", "Volkswagen", "Renault", "Skoda", "MG",
  "Nissan", "Jeep", "Datsun", "Chevrolet", "Fiat",
  "Mercedes-Benz", "BMW", "Audi", "Volvo", "Citroen",
  "Land Rover", "Jaguar", "Mini", "Suzuki", "Other",
];

export const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid", "LPG"];

export const transmissionTypes = ["Manual", "Automatic"];

export const ownerOptions = ["1st Owner", "2nd Owner", "3rd Owner", "4th+ Owner"];

/** Maps sell-form owner label → search filter label (buy side) */
export const ownerToSearchLabel: Record<string, string> = {
  "1st Owner": "First owner",
  "2nd Owner": "Second owner",
  "3rd Owner": "Third owner",
  "4th+ Owner": "Fourth owner & above",
};

export const sellBodyTypes = bodyTypes;

export const sellColors = carColors.map((c) => ({ id: c.id, label: c.label }));

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

/** Same pool as detail page specs tab — seller picks what car has */
export const sellFeatureOptions = [
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

export const currentYear = new Date().getFullYear();
export const carYears = Array.from({ length: 25 }, (_, i) => currentYear - i);

export type SellCarFormData = {
  brand: string;
  model: string;
  year: string;
  variant: string;
  bodyType: string;
  color: string;
  fuel: string;
  transmission: string;
  kms: string;
  owners: string;
  seats: string;
  registrationMonth: string;
  engineCc: string;
  mileage: string;
  insurance: string;
  price: string;
  city: string;
  area: string;
  regNumber: string;
  description: string;
  features: string[];
  sellerName: string;
  phone: string;
  email: string;
  whatsapp: boolean;
  videoUrl: string;
  truthDeclaration: TruthDeclaration;
};

export const initialSellForm: SellCarFormData = {
  brand: "",
  model: "",
  year: "",
  variant: "",
  bodyType: "",
  color: "",
  fuel: "",
  transmission: "",
  kms: "",
  owners: "1st Owner",
  seats: "5",
  registrationMonth: "January",
  engineCc: "",
  mileage: "",
  insurance: "",
  price: "",
  city: "",
  area: "",
  regNumber: "",
  description: "",
  features: [],
  sellerName: "",
  phone: "",
  email: "",
  whatsapp: true,
  videoUrl: "",
  truthDeclaration: { ...initialTruthDeclaration },
};

export const MIN_LISTING_PHOTOS = 3;
export const MAX_LISTING_PHOTOS = 12;
export const MAX_LISTING_PHOTO_BYTES = 2 * 1024 * 1024;

export const sellSteps = [
  { id: 1, title: "Car & Contact", desc: "Car specs + your contact info" },
  { id: 2, title: "Price, Photos & More", desc: "Price, city, photos & features" },
  { id: 3, title: "Honest Car Declaration", desc: "Optional — declaration & video" },
  { id: 4, title: "Review", desc: "Check & publish listing" },
];

export function insuranceToOverviewLabel(insurance: string): string {
  switch (insurance) {
    case "comprehensive-valid":
      return `Valid till ${currentYear + 1}`;
    case "third-party-valid":
      return `Third Party — Valid till ${currentYear + 1}`;
    case "expired":
      return "Expired";
    default:
      return "—";
  }
}

export function insuranceToDetailType(insurance: string): string {
  switch (insurance) {
    case "comprehensive-valid":
      return "Comprehensive";
    case "third-party-valid":
      return "Third Party";
    case "expired":
      return "Expired";
    default:
      return "Not Available";
  }
}

export function seatsToLabel(seats: string): string {
  const n = parseInt(seats, 10);
  if (n === 7) return "7 Seater";
  if (n === 8) return "8 Seater";
  return "5 Seater";
}
