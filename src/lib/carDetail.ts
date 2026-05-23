import type { CarListing } from "@/data/cars";
import { carListings } from "@/data/cars";
import {
  enrichCar,
  parseKms,
  parseTransmission,
  type EnrichedCar,
} from "@/lib/carMeta";
import {
  insuranceToDetailType,
  insuranceToOverviewLabel,
  seatsToLabel,
} from "@/data/sellCarForm";
import { isUserListing, type UserCarListing } from "@/types/listing";

export type CarDetailTab = "overview" | "specs" | "services" | "emi" | "reviews";

export type CarDetail = EnrichedCar & {
  variant: string;
  year: number;
  kms: number;
  transmission: string;
  ownership: string;
  images: string[];
  registrationMonth: string;
  insurance: string;
  seats: number;
  rto: string;
  engineCc: string;
  mileage: string;
  power: string;
  driveType: string;
  groundClearance: string;
  features: string[];
  specifications: { label: string; value: string }[];
  overview: { label: string; value: string; icon: string }[];
  emiMonthly: number;
  emiRate: number;
  discountPercent?: number;
  sellerName: string;
  sellerPhone: string;
  sellerAddress: string;
  distanceKm: string;
  description?: string;
};

const GALLERY_POOL = [
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&h=600&fit=crop",
];

const FEATURE_POOL = [
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

const REVIEW_SAMPLES = [
  {
    name: "Rahul M.",
    rating: 5,
    title: "Great value for money",
    text: "Smooth drive and well maintained. Seller was transparent about service history.",
    tag: "MILEAGE",
  },
  {
    name: "Priya S.",
    rating: 4,
    title: "Comfortable family car",
    text: "Spacious cabin and good ride quality in city traffic. Recommended for daily use.",
    tag: "COMFORT",
  },
  {
    name: "Amit K.",
    rating: 4,
    title: "Reliable daily driver",
    text: "Fuel economy is as expected. No major issues during test drive.",
    tag: "PERFORMANCE",
  },
];

function parseYear(title: string): number {
  const match = title.match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0], 10) : 2018;
}

function parseVariant(title: string): string {
  const parts = title.split(" ");
  if (parts.length <= 3) return "Standard";
  return parts.slice(3).join(" ");
}

function ownershipFromSpecs(specs: string): string | null {
  if (/1st|first/i.test(specs)) return "First Owner";
  if (/2nd|second/i.test(specs)) return "Second Owner";
  if (/3rd|third/i.test(specs)) return "Third Owner";
  if (/4th|fourth/i.test(specs)) return "Fourth Owner & above";
  return null;
}

const OWNERSHIP_DISPLAY: Record<string, string> = {
  "First owner": "First Owner",
  "Second owner": "Second Owner",
  "Third owner": "Third Owner",
  "Fourth owner & above": "Fourth Owner & above",
};

function ownershipFromUser(user: UserCarListing): string {
  if (user.ownership && OWNERSHIP_DISPLAY[user.ownership]) {
    return OWNERSHIP_DISPLAY[user.ownership];
  }
  return ownershipFromSpecs(user.specs) ?? "First Owner";
}

function calcEmi(priceLakh: number, years = 3, rate = 14.5): number {
  const principal = priceLakh * 100000 * 0.9;
  const r = rate / 12 / 100;
  const n = years * 12;
  if (r === 0) return Math.round(principal / n);
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
}

export function buildCarDetail(car: CarListing): CarDetail {
  const enriched = enrichCar(car);
  const year = parseYear(car.title);
  const kms = parseKms(car.specs);
  const transmission = parseTransmission(car.specs);
  const numId = parseInt(car.id.replace(/\D/g, "") || "1", 10);
  const user = isUserListing(car) ? car : null;
  const ownership = user
    ? ownershipFromUser(user)
    : car.badge === "DIRECT OWNER" || numId % 3 === 0
      ? "First Owner"
      : numId % 3 === 1
        ? "Second Owner"
        : "Third Owner";

  const validRemote = (urls: string[]) =>
    urls.filter((u) => u && (u.startsWith("https://") || u.startsWith("data:")));

  let images =
    car.images && car.images.length > 0
      ? validRemote(car.images)
      : validRemote([
          car.image,
          GALLERY_POOL[numId % GALLERY_POOL.length],
          GALLERY_POOL[(numId + 1) % GALLERY_POOL.length],
          GALLERY_POOL[(numId + 2) % GALLERY_POOL.length],
          GALLERY_POOL[(numId + 3) % GALLERY_POOL.length],
        ]);

  if (images.length === 0) {
    images = [
      GALLERY_POOL[numId % GALLERY_POOL.length],
      GALLERY_POOL[(numId + 1) % GALLERY_POOL.length],
    ];
  }

  const features =
    user?.features && user.features.length > 0
      ? user.features
      : FEATURE_POOL.filter((_, i) => (numId + i) % 2 === 0).slice(0, 8);

  const regMonthShort = user?.registrationMonth
    ? user.registrationMonth.slice(0, 3)
    : "Oct";

  const engineCc =
    user?.engineCc?.trim() ||
    (enriched.fuel === "Electric"
      ? "—"
      : enriched.bodyType === "SUV"
        ? "1498 cc"
        : "1199 cc");

  const mileageValue =
    user?.mileage?.trim() ||
    (enriched.fuel === "Electric"
      ? "312 km/charge"
      : enriched.fuel === "Diesel"
        ? "21.5 kmpl"
        : "17.5 kmpl");

  const seatsLabel = user?.seats
    ? seatsToLabel(String(user.seats))
    : enriched.bodyType === "MUV"
      ? "7 Seats"
      : "5 Seats";

  const insuranceOverview = user?.insurance
    ? insuranceToOverviewLabel(user.insurance)
    : numId % 2 === 0
      ? "Valid till 2026"
      : "—";

  const insuranceDetail = user?.insurance
    ? insuranceToDetailType(user.insurance)
    : numId % 2 === 0
      ? "Comprehensive"
      : "Third Party";

  const overview = [
    { label: "Registration Year", value: `${regMonthShort} ${year}`, icon: "📅" },
    { label: "Fuel Type", value: enriched.fuel, icon: "⛽" },
    { label: "Kms Driven", value: `${kms.toLocaleString("en-IN")} Kms`, icon: "🛣" },
    { label: "Ownership", value: ownership, icon: "👤" },
    { label: "Transmission", value: transmission, icon: "⚙" },
    { label: "Insurance", value: insuranceOverview, icon: "🛡" },
    { label: "Seats", value: seatsLabel, icon: "💺" },
    { label: "RTO", value: car.location, icon: "📍" },
    { label: "Engine Displacement", value: engineCc, icon: "🔧" },
    { label: "Year of Manufacture", value: String(year), icon: "🏭" },
  ];

  if (user?.regNumber) {
    overview.push({ label: "Registration No.", value: user.regNumber, icon: "🔖" });
  }
  if (user?.color) {
    const colorLabel = user.color.charAt(0).toUpperCase() + user.color.slice(1);
    overview.push({ label: "Color", value: colorLabel, icon: "🎨" });
  }

  const specifications = [
    { label: "Engine", value: engineCc },
    { label: "Power", value: enriched.fuel === "Electric" ? "127 bhp" : "88.7 bhp" },
    { label: "Drive Type", value: "FWD" },
    { label: "Ground Clearance", value: enriched.bodyType === "SUV" ? "205 mm" : "188 mm" },
    { label: "Transmission", value: transmission },
    { label: "Mileage", value: mileageValue },
  ];

  return {
    ...enriched,
    variant: parseVariant(car.title),
    year,
    kms,
    transmission,
    ownership,
    images,
    registrationMonth: `${regMonthShort} ${year}`,
    insurance: insuranceDetail,
    seats: user?.seats ?? (enriched.bodyType === "MUV" ? 7 : 5),
    rto: car.location,
    engineCc,
    mileage: specifications[5].value,
    power: specifications[1].value,
    driveType: specifications[2].value,
    groundClearance: specifications[3].value,
    features,
    specifications,
    overview,
    emiMonthly: calcEmi(enriched.priceLakh),
    emiRate: 14.5,
    discountPercent: enriched.isDiscounted ? 12 + (numId % 8) : undefined,
    sellerName: user?.sellerName ?? `${enriched.brand} Motors — ${car.location}`,
    sellerPhone: user?.phone ?? "9876543210",
    sellerAddress: enriched.area,
    distanceKm: `${(800 + numId * 137).toLocaleString("en-IN", { maximumFractionDigits: 2 })} kms away`,
    description: user?.description,
  };
}

export function getCarDetailPath(id: string): string {
  return `/used-cars/${encodeURIComponent(id)}`;
}

export function findCarById(
  id: string,
  listings: CarListing[] = carListings
): CarListing | undefined {
  return listings.find((c) => c.id === id);
}

export function getSimilarCars(
  detail: CarDetail,
  listings: CarListing[],
  limit = 4
): EnrichedCar[] {
  return listings
    .filter((c) => c.id !== detail.id && c.location === detail.location)
    .slice(0, limit)
    .map((c) => enrichCar(c));
}

export { REVIEW_SAMPLES };
