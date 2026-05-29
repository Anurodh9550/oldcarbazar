import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://oldcarbazar.com";

/**
 * Served at /robots.txt. We allow everything under the public site and block
 * admin, profile, and authentication-gated routes so they never show up in
 * search results (they're useless to non-signed-in visitors anyway).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/seller",
          "/seller/",
          "/messages",
          "/profile-settings",
          "/my-listings",
          "/my-orders",
          "/my-activity",
          "/my-vehicles",
          "/my-garage",
          "/consents",
          "/shortlisted",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
