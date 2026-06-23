/**
 * Brand logos in public/brands/
 * Maps brand slug → filename (.avif or .svg).
 */
export const brandLogoFiles: Record<string, string> = {
  maruti: "maruti-suzuki.avif",
  hyundai: "hyundai.svg",
  tata: "tata.avif",
  honda: "honda.avif",
  toyota: "toyota.avif",
  mahindra: "mahindra.svg",
  kia: "kia.avif",
  ford: "ford.avif",
  renault: "renault.svg",
  volkswagen: "volkswagen.avif",
  mg: "mg.svg",
  skoda: "skoda.avif",
  nissan: "nissan.svg",
  jeep: "jeep.svg",
  datsun: "datsun.svg",
  chevrolet: "chevrolet.svg",
  fiat: "fiat.svg",
  "mercedes-benz": "mercedes-benz.avif",
  bmw: "bmw.svg",
  audi: "audi.svg",
  volvo: "volvo.svg",
  citroen: "citroen.svg",
  "land-rover": "land-rover.svg",
  jaguar: "jaguar.svg",
  mini: "mini.svg",
  suzuki: "suzuki.svg",
};

export function getBrandLogoSrc(slug: string): string | null {
  const file = brandLogoFiles[slug.toLowerCase()];
  return file ? `/brands/${file}` : null;
}
