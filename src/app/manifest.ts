import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Old Car Bazar | Buy & Sell Used Cars",
    short_name: "Old Car Bazar",
    description:
      "India's trusted marketplace for used cars. Buy, sell, compare prices and connect with verified sellers.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#f75d34",
    lang: "en-IN",
    categories: ["shopping", "business", "automotive"],
    icons: [
      {
        src: "/logocar.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logocar.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logocar.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Browse used cars",
        short_name: "Browse",
        url: "/used-cars",
      },
      {
        name: "Sell your car",
        short_name: "Sell",
        url: "/sell-car",
      },
    ],
  };
}
