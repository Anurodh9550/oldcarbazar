import type { CarListing } from "@/data/cars";

export type ListingStatus = "active" | "sold" | "draft";

/** Admin-controlled moderation state. Defaults to "approved" so existing
 * listings continue to render on public pages without manual approval. */
export type ListingModeration = "approved" | "pending" | "rejected" | "blocked";

/** Fields sellers fill — shown on buy/detail & used in search filters */
export type ListingSellerMeta = {
  bodyType?: string;
  color?: string;
  area?: string;
  regNumber?: string;
  ownership?: string;
  registrationMonth?: string;
  insurance?: string;
  seats?: number;
  engineCc?: string;
  mileage?: string;
  features?: string[];
  whatsapp?: boolean;
};

export type ListingAdminMeta = {
  moderation?: ListingModeration;
  featured?: boolean;
  flagged?: boolean;
  flagReason?: string;
  rejectedReason?: string;
};

export type UserCarListing = CarListing &
  ListingSellerMeta &
  ListingAdminMeta & {
    sellerId: string;
    sellerName: string;
    phone: string;
    email?: string;
    description?: string;
    status: ListingStatus;
    createdAt: number;
    views: number;
    inquiries: number;
  };

export function isUserListing(
  listing: CarListing
): listing is UserCarListing {
  return listing.id.startsWith("user-") || "sellerId" in listing;
}
