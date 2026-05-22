import type { CarListing } from "@/data/cars";
import { isUserListing } from "@/types/listing";

export type EnrichedCar = CarListing & {
  brand: string;
  fuel: string;
  bodyType: string;
  priceLakh: number;
  area: string;
  isDiscounted?: boolean;
  originalPriceLakh?: number;
  savingsLabel?: string;
  addedAt?: number;
};

export function parsePriceLakh(price: string): number {
  const num = parseFloat(price.replace(/[^\d.]/g, ""));
  if (price.toLowerCase().includes("cr")) return num * 100;
  return num || 0;
}

export function parseFuel(specs: string): string {
  const fuels = ["Electric", "Hybrid", "Diesel", "Petrol", "CNG", "LPG"];
  return fuels.find((f) => specs.includes(f)) ?? "Petrol";
}

export function parseBrand(title: string): string {
  const parts = title.split(" ");
  return parts.length >= 2 ? parts[1] : "Other";
}

export function inferBodyType(title: string): string {
  const t = title.toLowerCase();
  if (
    /suv|creta|seltos|harrier|thar|duster|hector|kushaq|fortuner|ecosport|nexon/.test(
      t
    )
  )
    return "SUV";
  if (/innova|ertiga|crysta/.test(t)) return "MUV";
  if (/city|amaze|verna|ciaz/.test(t)) return "Sedan";
  if (/swift|i20|polo|baleno|santro|wagon/.test(t)) return "Hatchback";
  return "Sedan";
}

const areas: Record<string, string[]> = {
  Ahmedabad: ["Shela", "Satellite", "Maninagar", "Naranpura", "Vastrapur"],
  Mumbai: ["Andheri", "Bandra", "Thane", "Powai"],
  Delhi: ["Dwarka", "Rohini", "Saket", "Noida"],
  default: ["Central", "West", "East"],
};

export function enrichCar(car: CarListing): EnrichedCar {
  const user = isUserListing(car) ? car : null;
  const cityAreas = areas[car.location] ?? areas.default;
  const numId = parseInt(car.id.replace(/\D/g, "") || "0", 10);
  const fallbackArea = cityAreas[numId % cityAreas.length];
  const areaLabel = user?.area?.trim() || fallbackArea;
  const priceLakh = parsePriceLakh(car.price);
  const isDiscounted = car.badge === "FEATURED" || numId % 4 === 0;
  const originalPriceLakh = isDiscounted
    ? Math.round(priceLakh * 1.08 * 100) / 100
    : undefined;
  const savingsLakh =
    isDiscounted && originalPriceLakh
      ? Math.round((originalPriceLakh - priceLakh) * 100) / 100
      : 0;
  const savingsRupees = Math.round(savingsLakh * 100000);

  return {
    ...car,
    brand: parseBrand(car.title),
    fuel: parseFuel(car.specs),
    bodyType: user?.bodyType || inferBodyType(car.title),
    priceLakh,
    area: `${areaLabel}, ${car.location}`,
    isDiscounted,
    originalPriceLakh,
    savingsLabel:
      savingsRupees > 0
        ? `Save ₹${savingsRupees.toLocaleString("en-IN")}`
        : undefined,
    addedAt: car.id.startsWith("user-")
      ? parseInt(car.id.replace("user-", ""), 10)
      : 1000000 - numId * 10000,
  };
}

export function filterRecentByBudget(cars: EnrichedCar[], range: string): EnrichedCar[] {
  switch (range) {
    case "0-3":
      return cars.filter((c) => c.priceLakh <= 3);
    case "3-5":
      return cars.filter((c) => c.priceLakh > 3 && c.priceLakh <= 5);
    case "5-10":
      return cars.filter((c) => c.priceLakh > 5 && c.priceLakh <= 10);
    case "10+":
      return cars.filter((c) => c.priceLakh > 10);
    default:
      return cars;
  }
}

export function parseTransmission(specs: string): string {
  return specs.includes("Automatic") ? "Automatic" : "Manual";
}

export function parseKms(specs: string): number {
  const match = specs.match(/([\d,]+)\s*kms/i);
  return match ? parseInt(match[1].replace(/,/g, ""), 10) : 0;
}

export function filterByFuel(cars: EnrichedCar[], fuel: string | null): EnrichedCar[] {
  if (!fuel) return cars;
  return cars.filter((c) => c.fuel === fuel);
}

export function filterByTransmission(
  cars: EnrichedCar[],
  transmission: string | null
): EnrichedCar[] {
  if (!transmission) return cars;
  return cars.filter((c) => parseTransmission(c.specs) === transmission);
}

export function filterByBudgetRange(
  cars: EnrichedCar[],
  rangeId: string | null
): EnrichedCar[] {
  if (!rangeId) return cars;
  const ranges: Record<string, [number, number]> = {
    "under-2": [0, 2],
    "2-3": [2, 3],
    "3-5": [3, 5],
    "5-10": [5, 10],
    "10-15": [10, 15],
    "15-plus": [15, Infinity],
  };
  const range = ranges[rangeId];
  if (!range) return cars;
  const [min, max] = range;
  return cars.filter((c) => c.priceLakh > min && c.priceLakh <= max);
}

export function countByField<T extends string>(
  cars: EnrichedCar[],
  getField: (car: EnrichedCar) => T,
  values: T[]
): Record<T, number> {
  return values.reduce(
    (acc, value) => {
      acc[value] = cars.filter((c) => getField(c) === value).length;
      return acc;
    },
    {} as Record<T, number>
  );
}

export function sortCars(cars: EnrichedCar[], sort: string): EnrichedCar[] {
  const list = [...cars];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.priceLakh - b.priceLakh);
    case "price-desc":
      return list.sort((a, b) => b.priceLakh - a.priceLakh);
    case "kms-asc":
      return list.sort((a, b) => parseKms(a.specs) - parseKms(b.specs));
    default:
      return list;
  }
}

export function filterByBudget(cars: EnrichedCar[], range: string): EnrichedCar[] {
  switch (range) {
    case "0-5":
      return cars.filter((c) => c.priceLakh <= 5);
    case "5-10":
      return cars.filter((c) => c.priceLakh > 5 && c.priceLakh <= 10);
    case "10-15":
      return cars.filter((c) => c.priceLakh > 10 && c.priceLakh <= 15);
    case "15-20":
      return cars.filter((c) => c.priceLakh > 15 && c.priceLakh <= 20);
    default:
      return cars;
  }
}
