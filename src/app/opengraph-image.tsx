import { ImageResponse } from "next/og";
import {
  loadLogoDataUrl,
  OgCard,
  OG_CONTENT_TYPE,
  OG_SIZE,
} from "@/lib/ogTemplate";

export const alt = "Old Car Bazar — Buy & Sell Used Cars in India";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();

  return new ImageResponse(
    (
      <OgCard
        logoSrc={logoSrc}
        eyebrow="India's Used Car Marketplace"
        title="Buy & Sell Used Cars Across India"
        subtitle="Verified listings. Direct owner contact. Free valuation, car loan, and instant inquiry — all in one place."
        highlights={[
          "Verified Listings",
          "Free Valuation",
          "Car Loan",
          "Direct Seller Contact",
        ]}
      />
    ),
    { ...size }
  );
}
