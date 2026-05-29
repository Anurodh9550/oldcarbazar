export type CarListing = {
  id: string;
  title: string;
  specs: string;
  price: string;
  location: string;
  badge?: "DIRECT OWNER" | "FEATURED";
  image: string;
  /** All uploaded photos; first image is cover (image) */
  images?: string[];
};

/**
 * Real listings come from the backend (`api.listListings`) via
 * `ListingsContext`. The local seed/demo array is intentionally empty so the
 * UI never flashes hard-coded sample cars before the live database response.
 *
 * If you ever need a quick offline list for local development, hydrate this
 * array temporarily — but do NOT commit data here, otherwise production users
 * will see those demo cars before the API call resolves.
 */
export const carListings: CarListing[] = [];

export const budgetFilters = [
  "Under ₹2 Lakh",
  "₹2 - ₹4 Lakh",
  "₹4 - ₹6 Lakh",
  "₹6 - ₹10 Lakh",
  "₹10 - ₹15 Lakh",
  "Above ₹15 Lakh",
];

export const recommendedFilters = [
  { label: "Certified Cars", icon: "✓" },
  { label: "Price Drop", icon: "↓" },
  { label: "Under ₹5 Lakh", icon: "₹" },
  { label: "Luxury Cars", icon: "★" },
];
