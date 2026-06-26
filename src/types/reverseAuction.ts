export type AuctionStatus = "open" | "closed";

export type DealerBid = {
  id: string;
  dealerName: string;
  dealerPhone: string;
  carTitle: string;
  priceLakh: number;
  year: number;
  kms: number;
  message: string;
  createdAt: number;
};

export type ReverseAuctionRequest = {
  id: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  city: string;
  budgetMinLakh: number;
  budgetMaxLakh: number;
  brand: string;
  bodyType: string;
  fuel: string;
  transmission: string;
  notes: string;
  status: AuctionStatus;
  createdAt: number;
  bids: DealerBid[];
};
