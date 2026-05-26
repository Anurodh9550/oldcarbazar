/**
 * Brand logos in public/brands/
 * Only uploaded files are mapped here — other brands fall back to an initials avatar.
 */
export const brandLogoFiles: Record<string, string> = {
  maruti: "maruti-suzuki.avif",
  tata: "tata.avif",
  honda: "honda.avif",
  toyota: "toyota.avif",
  kia: "kia.avif",
  ford: "ford.avif",
  volkswagen: "volkswagen.avif",
  skoda: "skoda.avif",
  "mercedes-benz": "mercedes-benz.avif",
};

export function getBrandLogoSrc(slug: string): string | null {
  const file = brandLogoFiles[slug.toLowerCase()];
  return file ? `/brands/${file}` : null;
}
