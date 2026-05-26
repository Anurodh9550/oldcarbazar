import { getBrandNameFromSlug } from "@/data/explorePage";
import { cities } from "@/data/locations";
import {
  carColors,
  discountFilters,
  kmRanges,
  ownershipTypes,
  premiumSellers,
  searchBudgetRanges,
  type SearchFilterParams,
} from "@/data/searchPage";
import type { EnrichedCar } from "./carMeta";
import { parseKms, parseTransmission } from "./carMeta";
import { isUserListing } from "@/types/listing";

const colorIds = carColors.map((c) => c.id);
const ownershipList = [...ownershipTypes];
const premiumIds = premiumSellers.map((p) => p.id);

export type SearchEnrichedCar = EnrichedCar & {
  ownership: string;
  sellerType: string;
  premiumSeller: string;
  rto: string;
  seats: string;
  color: string;
};

const cityToRto: Record<string, string> = Object.fromEntries(
  cities.map((c) => [c.name, c.state])
);

function inferOwnership(numId: number): string {
  return ownershipList[numId % ownershipList.length];
}

function inferColor(numId: number): string {
  return colorIds[numId % colorIds.length];
}

function inferSeats(bodyType: string): string {
  if (bodyType === "MUV") return "7 Seater";
  if (bodyType === "Minivan") return "8 Seater";
  return "5 Seater";
}

function inferSellerType(car: EnrichedCar): string {
  if (car.badge === "DIRECT OWNER") return "direct";
  if (car.badge === "FEATURED") return "partner";
  return "all";
}

function inferPremiumSeller(numId: number): string {
  return premiumIds[numId % premiumIds.length];
}

export function enrichCarForSearch(car: EnrichedCar): SearchEnrichedCar {
  const numId = parseInt(car.id.replace(/\D/g, "") || "0", 10);
  const user = isUserListing(car) ? car : null;
  const seatCount = user?.seats;
  const seatsFromUser =
    seatCount === 7 ? "7 Seater" : seatCount === 8 ? "8 Seater" : seatCount === 5 ? "5 Seater" : null;

  return {
    ...car,
    ownership: user?.ownership ?? inferOwnership(numId),
    sellerType: inferSellerType(car),
    premiumSeller: inferPremiumSeller(numId),
    rto: cityToRto[car.location] ?? "Maharashtra",
    seats: seatsFromUser ?? inferSeats(car.bodyType),
    color: user?.color ?? inferColor(numId),
  };
}

function filterByKms(cars: SearchEnrichedCar[], kmsId: string | null): SearchEnrichedCar[] {
  if (!kmsId) return cars;
  const range = kmRanges.find((r) => r.id === kmsId);
  if (!range) return cars;
  return cars.filter((c) => {
    const kms = parseKms(c.specs);
    if (range.min !== undefined && range.max !== undefined) {
      return kms >= range.min && kms <= range.max;
    }
    if (range.max !== undefined) return kms < range.max;
    return true;
  });
}

function filterByOwnership(
  cars: SearchEnrichedCar[],
  ownership: string | null
): SearchEnrichedCar[] {
  if (!ownership) return cars;
  return cars.filter((c) => c.ownership === ownership);
}

function filterByBodyType(
  cars: SearchEnrichedCar[],
  bodyType: string | null
): SearchEnrichedCar[] {
  if (!bodyType) return cars;
  return cars.filter((c) => c.bodyType === bodyType);
}

function filterBySellerType(
  cars: SearchEnrichedCar[],
  sellerType: string | null
): SearchEnrichedCar[] {
  if (!sellerType || sellerType === "all") return cars;
  return cars.filter((c) => c.sellerType === sellerType);
}

function filterByPremium(
  cars: SearchEnrichedCar[],
  premium: string | null
): SearchEnrichedCar[] {
  if (!premium) return cars;
  return cars.filter((c) => c.premiumSeller === premium);
}

function filterByRto(cars: SearchEnrichedCar[], rto: string | null): SearchEnrichedCar[] {
  if (!rto) return cars;
  return cars.filter((c) => c.rto === rto);
}

function filterBySeats(cars: SearchEnrichedCar[], seats: string | null): SearchEnrichedCar[] {
  if (!seats) return cars;
  return cars.filter((c) => c.seats === seats);
}

function filterByColor(cars: SearchEnrichedCar[], color: string | null): SearchEnrichedCar[] {
  if (!color) return cars;
  return cars.filter((c) => c.color === color);
}

function filterByDiscount(
  cars: SearchEnrichedCar[],
  discount: string | null
): SearchEnrichedCar[] {
  if (!discount) return cars;
  if (discount === "discounted") return cars.filter((c) => c.isDiscounted);
  const thresholds: Record<string, number> = {
    "upto-20k": 20000,
    "upto-50k": 50000,
    "upto-1L": 100000,
  };
  const min = thresholds[discount];
  if (!min) return cars;
  return cars.filter((c) => {
    if (!c.savingsLabel) return false;
    const match = c.savingsLabel.match(/[\d,]+/);
    const saved = match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
    return saved <= min;
  });
}

function filterByBudgetRange(
  cars: SearchEnrichedCar[],
  rangeId: string | null
): SearchEnrichedCar[] {
  if (!rangeId) return cars;
  const range = searchBudgetRanges.find((r) => r.id === rangeId);
  if (!range) return cars;
  return cars.filter((c) => c.priceLakh > range.min && c.priceLakh <= range.max);
}

export function carMatchesBrand(car: SearchEnrichedCar, brandSlug: string): boolean {
  const name = getBrandNameFromSlug(brandSlug);
  const lower = name.toLowerCase();
  return (
    car.brand.toLowerCase() === lower ||
    car.title.toLowerCase().includes(lower)
  );
}

function filterByBrand(
  cars: SearchEnrichedCar[],
  brandSlug: string | null
): SearchEnrichedCar[] {
  if (!brandSlug) return cars;
  return cars.filter((c) => carMatchesBrand(c, brandSlug));
}

function filterByCity(
  cars: SearchEnrichedCar[],
  city: string | null
): SearchEnrichedCar[] {
  if (!city) return cars;
  return cars.filter((c) => c.location === city);
}

function filterByQuery(
  cars: SearchEnrichedCar[],
  q: string | null
): SearchEnrichedCar[] {
  if (!q) return cars;
  const needle = q.trim().toLowerCase();
  if (!needle) return cars;
  return cars.filter((c) => {
    const haystack = [c.title, c.brand, c.location, c.fuel, c.bodyType]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export function applySearchFilters(
  cars: SearchEnrichedCar[],
  params: SearchFilterParams
): SearchEnrichedCar[] {
  let list = cars;
  list = filterByQuery(list, params.q);
  list = filterByCity(list, params.city);
  list = filterByBrand(list, params.brand);
  if (params.fuel) list = list.filter((c) => c.fuel === params.fuel);
  if (params.transmission) {
    list = list.filter((c) => parseTransmission(c.specs) === params.transmission);
  }
  list = filterByBudgetRange(list, params.budget);
  list = filterByKms(list, params.kms);
  list = filterByOwnership(list, params.ownership);
  list = filterByBodyType(list, params.bodyType);
  list = filterBySellerType(list, params.sellerType);
  list = filterByPremium(list, params.premium);
  list = filterByRto(list, params.rto);
  list = filterBySeats(list, params.seats);
  list = filterByDiscount(list, params.discount);
  list = filterByColor(list, params.color);
  return list;
}

export function countForFilter(
  cars: SearchEnrichedCar[],
  params: SearchFilterParams,
  field: keyof SearchFilterParams,
  value: string
): number {
  const trial = { ...params, [field]: value };
  return applySearchFilters(cars, trial).length;
}

export function getFilterLabel(
  key: keyof SearchFilterParams,
  value: string
): string {
  switch (key) {
    case "city":
      return value;
    case "brand":
      return getBrandNameFromSlug(value);
    case "budget":
      return searchBudgetRanges.find((b) => b.id === value)?.label ?? value;
    case "kms":
      return kmRanges.find((k) => k.id === value)?.label ?? value;
    case "sellerType":
      return value === "direct"
        ? "Direct Owner"
        : value === "partner"
          ? "Partner Cars"
          : value;
    case "premium":
      return premiumSellers.find((p) => p.id === value)?.label ?? value;
    case "discount":
      return discountFilters.find((d) => d.id === value)?.label ?? value;
    case "color":
      return carColors.find((c) => c.id === value)?.label ?? value;
    default:
      return value;
  }
}
