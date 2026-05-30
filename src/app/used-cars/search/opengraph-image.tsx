import { ImageResponse } from "next/og";
import {
  loadLogoDataUrl,
  OgCard,
  OG_CONTENT_TYPE,
  OG_SIZE,
} from "@/lib/ogTemplate";

export const alt = "Search Used Cars on Old Car Bazar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();

  return new ImageResponse(
    (
      <OgCard
        logoSrc={logoSrc}
        eyebrow="Smart Search"
        title="Search & Filter Used Cars Instantly"
        subtitle="Find used cars by make, model, fuel type, transmission, owner and budget — narrow down in seconds."
        highlights={[
          "Advanced Filters",
          "Save Search",
          "Real-time Listings",
        ]}
      />
    ),
    { ...size }
  );
}
