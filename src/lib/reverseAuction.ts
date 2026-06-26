import type { DealerBid, ReverseAuctionRequest } from "@/types/reverseAuction";

const STORAGE_KEY = "ocb_reverse_auctions";
export const AUCTION_CHANGED_EVENT = "ocb-auction-changed";

function readAll(): ReverseAuctionRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ReverseAuctionRequest[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(requests: ReverseAuctionRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUCTION_CHANGED_EVENT));
  }
}

export function listAuctions(): ReverseAuctionRequest[] {
  return readAll().sort((a, b) => b.createdAt - a.createdAt);
}

export function listOpenAuctions(): ReverseAuctionRequest[] {
  return listAuctions().filter((a) => a.status === "open");
}

export function getAuction(id: string): ReverseAuctionRequest | undefined {
  return readAll().find((a) => a.id === id);
}

export function createAuction(
  input: Omit<ReverseAuctionRequest, "id" | "createdAt" | "status" | "bids">
): ReverseAuctionRequest {
  const auction: ReverseAuctionRequest = {
    ...input,
    id: `auc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "open",
    createdAt: Date.now(),
    bids: [],
  };
  writeAll([auction, ...readAll()]);
  return auction;
}

export function addDealerBid(
  auctionId: string,
  bid: Omit<DealerBid, "id" | "createdAt">
): DealerBid | null {
  const list = readAll();
  const idx = list.findIndex((a) => a.id === auctionId);
  if (idx < 0 || list[idx].status !== "open") return null;
  const entry: DealerBid = {
    ...bid,
    id: `bid-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
  };
  list[idx] = {
    ...list[idx],
    bids: [entry, ...list[idx].bids].sort((a, b) => a.priceLakh - b.priceLakh),
  };
  writeAll(list);
  return entry;
}

export function closeAuction(auctionId: string): boolean {
  const list = readAll();
  const idx = list.findIndex((a) => a.id === auctionId);
  if (idx < 0) return false;
  list[idx] = { ...list[idx], status: "closed" };
  writeAll(list);
  return true;
}

export function getBuyerAuctions(phone: string): ReverseAuctionRequest[] {
  const digits = phone.replace(/\D/g, "").slice(-10);
  if (!digits) return [];
  return listAuctions().filter(
    (a) => a.buyerPhone.replace(/\D/g, "").slice(-10) === digits
  );
}
