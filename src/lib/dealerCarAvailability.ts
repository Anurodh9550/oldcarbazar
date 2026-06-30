import {
  api,
  apiAvailabilityToEntry,
  ApiError,
} from "@/lib/api";
import type {
  CarAvailabilityEntry,
  CarAvailabilityStatus,
} from "@/types/dealerAvailability";

const STORAGE_KEY = "ocb_dealer_car_availability";
export const AVAILABILITY_CHANGED_EVENT = "ocb-availability-changed";

function readAll(): CarAvailabilityEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CarAvailabilityEntry[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(entries: CarAvailabilityEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event(AVAILABILITY_CHANGED_EVENT));
}

function upsertLocal(entry: CarAvailabilityEntry) {
  const list = readAll();
  const idx = list.findIndex(
    (e) => e.dealerId === entry.dealerId && e.listingId === entry.listingId
  );
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  writeAll(list);
  return entry;
}

export function getDealerAvailability(dealerId: string): CarAvailabilityEntry[] {
  return readAll().filter((e) => e.dealerId === dealerId);
}

export function getListingAvailability(
  dealerId: string,
  listingId: string
): CarAvailabilityEntry | null {
  return (
    readAll().find(
      (e) => e.dealerId === dealerId && e.listingId === listingId
    ) ?? null
  );
}

export async function fetchDealerAvailability(
  dealerId: string
): Promise<CarAvailabilityEntry[]> {
  try {
    const rows = await api.getDealerAvailabilityPublic(dealerId);
    const entries = rows.map((r) => apiAvailabilityToEntry(r, dealerId));
    const others = readAll().filter((e) => e.dealerId !== dealerId);
    writeAll([...others, ...entries]);
    return entries;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return getDealerAvailability(dealerId);
    }
    return getDealerAvailability(dealerId);
  }
}

export async function fetchMyDealerAvailability(
  dealerId: string
): Promise<CarAvailabilityEntry[]> {
  try {
    const rows = await api.getMyListingAvailability();
    const entries = rows.map((r) => apiAvailabilityToEntry(r, dealerId));
    const others = readAll().filter((e) => e.dealerId !== dealerId);
    writeAll([...others, ...entries]);
    return entries;
  } catch {
    return getDealerAvailability(dealerId);
  }
}

export function setListingAvailability(
  dealerId: string,
  listingId: string,
  title: string,
  status: CarAvailabilityStatus,
  extras?: { note?: string; availableFrom?: string }
): CarAvailabilityEntry {
  return upsertLocal({
    listingId,
    dealerId,
    title,
    status,
    note: extras?.note,
    availableFrom: extras?.availableFrom,
    updatedAt: Date.now(),
  });
}

export async function persistListingAvailability(
  dealerId: string,
  listingId: string,
  title: string,
  status: CarAvailabilityStatus,
  extras?: { note?: string; availableFrom?: string }
): Promise<CarAvailabilityEntry> {
  const local = setListingAvailability(
    dealerId,
    listingId,
    title,
    status,
    extras
  );
  try {
    const row = await api.patchListingAvailability(listingId, {
      status,
      note: extras?.note ?? "",
      available_from: extras?.availableFrom ?? null,
    });
    return upsertLocal(apiAvailabilityToEntry(row, dealerId));
  } catch {
    return local;
  }
}

export function getAvailabilityCounts(dealerId: string) {
  const entries = getDealerAvailability(dealerId);
  return {
    available: entries.filter((e) => e.status === "available").length,
    reserved: entries.filter((e) => e.status === "reserved").length,
    sold: entries.filter((e) => e.status === "sold").length,
    coming_soon: entries.filter((e) => e.status === "coming_soon").length,
    total: entries.length,
  };
}

export function getEntriesForDate(
  dealerId: string,
  dateIso: string
): CarAvailabilityEntry[] {
  return getDealerAvailability(dealerId).filter((e) => {
    if (e.status === "coming_soon" && e.availableFrom) {
      return e.availableFrom.slice(0, 10) === dateIso.slice(0, 10);
    }
    const updated = new Date(e.updatedAt).toISOString().slice(0, 10);
    return updated === dateIso.slice(0, 10);
  });
}
