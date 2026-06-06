export type ListingStatus = "published" | "draft" | "sold" | "inactive";
export type ListingModeration = "pending" | "approved" | "rejected" | "all";

export type CarListing = {
  id: string;
  title: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  price: string;
  priceInr?: string;
  specs: string;
  location: string;
  area?: string;
  image: string;
  images?: string[];
  phone: string;
  sellerName: string;
  sellerEmail?: string;
  description?: string;
  features?: string[];
  bodyType?: string;
  color?: string;
  seats?: number;
  engineCc?: string;
  mileage?: string;
  ownership?: string;
  registrationMonth?: string;
  regNumber?: string;
  insurance?: string;
  whatsapp?: boolean;
  featured?: boolean;
  isBoosted?: boolean;
  boostedUntil?: string | null;
  status?: ListingStatus;
  moderation?: ListingModeration;
  rejectedReason?: string;
  kms: number;
  fuel: string;
  transmission: string;
  owners: string;
  views: number;
  inquiries: number;
  createdAt?: number;
};

export type SellForm = {
  brand: string;
  model: string;
  year: string;
  variant: string;
  bodyType: string;
  color: string;
  fuel: string;
  transmission: string;
  kms: string;
  owners: string;
  seats: string;
  registrationMonth: string;
  engineCc: string;
  mileage: string;
  insurance: string;
  price: string;
  city: string;
  area: string;
  regNumber: string;
  description: string;
  features: string[];
  sellerName: string;
  phone: string;
  email: string;
  whatsapp: boolean;
};

export const initialSellForm: SellForm = {
  brand: "",
  model: "",
  year: "",
  variant: "",
  bodyType: "",
  color: "",
  fuel: "",
  transmission: "",
  kms: "",
  owners: "1st Owner",
  seats: "5",
  registrationMonth: "January",
  engineCc: "",
  mileage: "",
  insurance: "",
  price: "",
  city: "",
  area: "",
  regNumber: "",
  description: "",
  features: [],
  sellerName: "",
  phone: "",
  email: "",
  whatsapp: true,
};
