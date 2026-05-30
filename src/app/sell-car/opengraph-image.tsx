import { ImageResponse } from "next/og";
import {
  loadLogoDataUrl,
  OgCard,
  OG_CONTENT_TYPE,
  OG_SIZE,
} from "@/lib/ogTemplate";

export const alt = "Sell Your Car Free on Old Car Bazar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();

  return new ImageResponse(
    (
      <OgCard
        logoSrc={logoSrc}
        eyebrow="Sell Your Car — 100% Free"
        title="List Your Used Car in 3 Easy Steps"
        subtitle="Zero commission. Reach genuine buyers across India. Post your car free with photos and connect directly."
        highlights={[
          "100% Free",
          "Zero Commission",
          "Direct Buyers",
          "Quick Listing",
        ]}
      />
    ),
    { ...size }
  );
}
