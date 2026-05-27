export type TestDriveStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export type TestDriveBooking = {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerId: string | null;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string | null;
  sellerId: string | null;
  scheduledAt: string;
  locationNote: string;
  message: string;
  status: TestDriveStatus;
  sellerResponse: string;
  createdAt: string;
  updatedAt: string;
};

export type OfferStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "countered"
  | "withdrawn"
  | "expired";

export type Offer = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPriceInr: string | null;
  buyerId: string | null;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string | null;
  sellerId: string | null;
  amount: string;
  counterAmount: string | null;
  message: string;
  sellerResponse: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
};
