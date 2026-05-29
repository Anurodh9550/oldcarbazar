import type { MetadataRoute } from "next";

/**
 * Web App Manifest served at /manifest.webmanifest. Adds the "Add to Home
 * Screen" experience on mobile browsers and is read by Google for the PWA
 * signals it uses when ranking mobile results.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Old Car Bazar — Buy & Sell Used Cars in India",
    short_name: "Old Car Bazar",
    description:
      "Buy & sell used cars across India. Verified listings, free valuation, car loan, and instant seller contact.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f75d34",
    orientation: "portrait",
    categories: ["shopping", "business", "automotive"],
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "any",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
