import type { CityName } from "@/data/locations";

/**
 * Apne city logos yahan file naam se map karo.
 * Files folder: public/cities/
 * Delhi jaisa: 80×80, round/circular icon (SVG ya PNG dono chalega).
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
