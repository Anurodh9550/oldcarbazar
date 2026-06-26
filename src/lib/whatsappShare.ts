import { getCarDetailPath } from "@/lib/carDetail";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://oldcarbazar.com";

export type WhatsAppShareInput = {
  id: string;
  title: string;
  price: string;
  location: string;
  area?: string;
  kms?: number;
  fuel?: string;
  transmission?: string;
  sellerPhone?: string;
};

export function buildListingShareUrl(listingId: string): string {
  return `${SITE_URL}${getCarDetailPath(listingId)}`;
}

export function buildWhatsAppShareMessage(car: WhatsAppShareInput): string {
  const url = buildListingShareUrl(car.id);
  const place = car.area ? `${car.area}, ${car.location}` : car.location;
  const specs = [
    car.kms != null ? `${Number(car.kms).toLocaleString("en-IN")} km` : null,
    car.fuel,
    car.transmission,
  ]
    .filter(Boolean)
    .join(" • ");

  return [
    "🚗 *Old Car Bazar — Used Car*",
    "",
    `*${car.title}*`,
    `💰 ${car.price}`,
    specs ? `📍 ${place} | ${specs}` : `📍 ${place}`,
    "",
    "Dekhiye aur seedha owner se baat karein:",
    url,
    "",
    "_India ka direct-owner used car marketplace_",
  ].join("\n");
}

export function openWhatsAppShare(car: WhatsAppShareInput) {
  const text = encodeURIComponent(buildWhatsAppShareMessage(car));
  const phone = (car.sellerPhone || "").replace(/\D/g, "");
  const waPhone =
    phone.length === 10 ? `91${phone}` : phone.length > 10 ? phone : "";
  const base = waPhone
    ? `https://wa.me/${waPhone}?text=${text}`
    : `https://wa.me/?text=${text}`;
  window.open(base, "_blank", "noopener,noreferrer");
}

export async function copyListingShareLink(listingId: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(buildListingShareUrl(listingId));
    return true;
  } catch {
    return false;
  }
}
