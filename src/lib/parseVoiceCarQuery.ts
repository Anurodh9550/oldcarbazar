import { carBrands } from "@/data/sellCarForm";
import { searchBudgetRanges } from "@/data/searchPage";

export type VoiceSearchParams = {
  q?: string;
  city?: string;
  budget?: string;
  bodyType?: string;
  fuel?: string;
  transmission?: string;
  brand?: string;
};

const BRAND_ALIASES: Record<string, string> = {
  maruti: "Maruti",
  suzuki: "Maruti",
  swift: "Maruti",
  hyundai: "Hyundai",
  i20: "Hyundai",
  creta: "Hyundai",
  tata: "Tata",
  nexon: "Tata",
  honda: "Honda",
  city: "Honda",
  toyota: "Toyota",
  innova: "Toyota",
  mahindra: "Mahindra",
  thar: "Mahindra",
  kia: "Kia",
  seltos: "Kia",
  renault: "Renault",
  ford: "Ford",
  volkswagen: "Volkswagen",
  vw: "Volkswagen",
  skoda: "Skoda",
};

function normalize(text: string) {
  return text.toLowerCase().replace(/[^\w\s₹.]/g, " ");
}

/** Parse Hindi/English voice text into search URL params. */
export function parseVoiceCarQuery(
  transcript: string,
  defaultCity?: string
): VoiceSearchParams {
  const raw = transcript.trim();
  const t = normalize(raw);
  const params: VoiceSearchParams = { q: raw };

  if (defaultCity) params.city = defaultCity;

  for (const range of searchBudgetRanges) {
    const min = range.min;
    const max = range.max === Infinity ? 999 : range.max;
    if (
      t.includes(range.id.replace(/-/g, " ")) ||
      (min === 0 && /under\s*2|2\s*lakh\s*se\s*kam|do\s*lakh/.test(t)) ||
      (min === 5 && max === 10 && /5\s*se\s*10|5.*10\s*lakh|panch.*das/.test(t)) ||
      (min === 3 && max === 5 && /3\s*se\s*5|teen.*paanch/.test(t)) ||
      (min === 15 && /15\s*lakh\s*se|above\s*15|pandrah/.test(t))
    ) {
      params.budget = range.id;
      break;
    }
  }

  const lakhMatch = t.match(/(\d+(?:\.\d+)?)\s*lakh/);
  if (lakhMatch && !params.budget) {
    const n = parseFloat(lakhMatch[1]);
    if (n < 2) params.budget = "under-2";
    else if (n < 3) params.budget = "2-3";
    else if (n < 5) params.budget = "3-5";
    else if (n < 10) params.budget = "5-10";
    else if (n < 15) params.budget = "10-15";
    else params.budget = "15-plus";
  }

  if (/suv|compact suv|mahindra thar|creta|seltos|fortuner/.test(t)) {
    params.bodyType = "SUV";
  } else if (/sedan|city|verna|amaze/.test(t)) {
    params.bodyType = "Sedan";
  } else if (/hatchback|swift|i20|polo|baleno/.test(t)) {
    params.bodyType = "Hatchback";
  } else if (/muv|7 seater|innova|ertiga|family/.test(t)) {
    params.bodyType = "MUV";
  }

  if (/diesel/.test(t)) params.fuel = "Diesel";
  else if (/petrol|gasoline/.test(t)) params.fuel = "Petrol";
  else if (/cng/.test(t)) params.fuel = "CNG";
  else if (/electric|ev/.test(t)) params.fuel = "Electric";

  if (/automatic|auto\b|amt|cvt/.test(t)) params.transmission = "Automatic";
  else if (/manual/.test(t)) params.transmission = "Manual";

  for (const [alias, brand] of Object.entries(BRAND_ALIASES)) {
    if (t.includes(alias)) {
      params.brand = brand;
      break;
    }
  }
  if (!params.brand) {
    for (const brand of carBrands) {
      if (t.includes(brand.toLowerCase())) {
        params.brand = brand;
        break;
      }
    }
  }

  const cities = [
    "ahmedabad",
    "mumbai",
    "delhi",
    "bangalore",
    "bengaluru",
    "pune",
    "hyderabad",
    "chennai",
    "kolkata",
    "surat",
    "jaipur",
    "lucknow",
  ];
  for (const city of cities) {
    if (t.includes(city)) {
      params.city =
        city === "bengaluru"
          ? "Bangalore"
          : city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  return params;
}

export function voiceParamsToSearchUrl(params: VoiceSearchParams): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.city) sp.set("city", params.city);
  if (params.budget) sp.set("budget", params.budget);
  if (params.bodyType) sp.set("bodyType", params.bodyType);
  if (params.fuel) sp.set("fuel", params.fuel);
  if (params.transmission) sp.set("transmission", params.transmission);
  if (params.brand) sp.set("brand", params.brand);
  const qs = sp.toString();
  return qs ? `/used-cars/search?${qs}` : "/used-cars/search";
}
