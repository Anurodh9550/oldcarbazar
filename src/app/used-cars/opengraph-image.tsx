import { ImageResponse } from "next/og";
import {
  loadLogoDataUrl,
  OgCard,
  OG_CONTENT_TYPE,
  OG_SIZE,
} from "@/lib/ogTemplate";

export const alt = "Explore Used Cars on Old Car Bazar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();

  return new ImageResponse(
    (
      <OgCard
        logoSrc={logoSrc}
        eyebrow="Explore Used Cars"
        title="Browse Verified Used Cars in India"
        subtitle="Filter by city, brand, fuel, budget and body type. Find your perfect second-hand car in minutes."
        highlights={[
          "All Cities",
          "All Brands",
          "Best Prices",
          "Direct Owners",
        ]}
      />
    ),
    { ...size }
  );
}
