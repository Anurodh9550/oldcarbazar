export type AdminRole = "super-admin" | "moderator" | "support";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  createdAt: number;
  lastLoginAt?: number;
};

export type AdminActivityType =
  | "listing-approved"
  | "listing-rejected"
  | "listing-featured"
  | "listing-unfeatured"
  | "listing-blocked"
  | "listing-deleted"
  | "user-blocked"
  | "user-unblocked"
  | "user-verified"
  | "admin-login"
  | "settings-updated";

export type AdminActivity = {
  id: string;
  type: AdminActivityType;
  message: string;
  actor: string;
  target?: string;
  createdAt: number;
};

export type InquiryStatus = "new" | "responded" | "closed" | "spam";

export type Inquiry = {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  sellerId: string;
  sellerName: string;
  message: string;
  channel: "whatsapp" | "call" | "form" | "chat";
  status: InquiryStatus;
  createdAt: number;
  city?: string;
  price?: string;
};
