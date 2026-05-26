import type { CityName } from "@/data/locations";

/**
 * Map city logos by file name here.
 * Files folder: public/cities/
 * Like Delhi: 80×80, round/circular icon (SVG or PNG, both work).
 */
export const cityLogoFiles: Partial<Record<CityName, string>> = {
  Ahmedabad: "ahmedabad.svg",
  Mumbai: "mumbai.svg",
  Delhi: "delhi.svg",
  Bangalore: "bangalore.svg",
  Hyderabad: "hyderabad.svg",
  Chennai: "chennai.svg",
  Pune: "pune.svg",
  Surat: "surat.svg",
  Jaipur: "jaipur.svg",
  Kolkata: "kolkata.svg",
  Lucknow: "lucknow.svg",
  Chandigarh: "chandigarh.svg",
};

export function getCityLogoSrc(cityName: string): string {
  const file = cityLogoFiles[cityName as CityName];
  return file ? `/cities/${file}` : "/cities/default.svg";
}
