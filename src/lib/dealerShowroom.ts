import {
  api,
  apiShowroomToDealerShowroom,
  dealerShowroomToApiPayload,
  ApiError,
} from "@/lib/api";
import {
  DEFAULT_SHOWROOM,
  type DealerShowroom,
  type ShowroomReview,
  type ShowroomTeamMember,
} from "@/types/dealerShowroom";

const STORAGE_KEY = "ocb_dealer_showrooms";
export const SHOWROOM_CHANGED_EVENT = "ocb-showroom-changed";

function readAll(): Record<string, DealerShowroom> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, DealerShowroom>) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, DealerShowroom>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(SHOWROOM_CHANGED_EVENT));
}

export function getShowroom(dealerId: string): DealerShowroom | null {
  const room = readAll()[dealerId];
  return room?.enabled ? room : room ?? null;
}

export function getShowroomOrDefault(
  dealerId: string,
  dealerName: string
): DealerShowroom {
  const room = readAll()[dealerId];
  if (!room) return DEFAULT_SHOWROOM(dealerId, dealerName);
  return { ...room, gallery: room.gallery ?? [] };
}

export function saveShowroom(showroom: DealerShowroom): DealerShowroom {
  const next = { ...showroom, updatedAt: Date.now() };
  const all = readAll();
  all[showroom.dealerId] = next;
  writeAll(all);
  return next;
}

export async function fetchDealerShowroom(
  dealerId: string
): Promise<DealerShowroom | null> {
  try {
    const data = await api.getDealerShowroom(dealerId);
    const showroom = apiShowroomToDealerShowroom(data);
    saveShowroom(showroom);
    return showroom;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return getShowroom(dealerId);
    }
    return getShowroom(dealerId) ?? null;
  }
}

export async function fetchMyDealerShowroom(
  dealerId: string,
  dealerName: string
): Promise<DealerShowroom> {
  try {
    const data = await api.getMyDealerShowroom();
    const showroom = apiShowroomToDealerShowroom(data);
    saveShowroom(showroom);
    return showroom;
  } catch {
    return getShowroomOrDefault(dealerId, dealerName);
  }
}

export async function persistMyDealerShowroom(
  showroom: DealerShowroom
): Promise<DealerShowroom> {
  const local = saveShowroom(showroom);
  try {
    const data = await api.updateMyDealerShowroom(
      dealerShowroomToApiPayload(showroom)
    );
    const saved = apiShowroomToDealerShowroom(data);
    saveShowroom(saved);
    return saved;
  } catch {
    return local;
  }
}

export function hasPublishedShowroom(showroom: DealerShowroom | null): boolean {
  return Boolean(showroom?.enabled && showroom.about.trim());
}

export function addTeamMember(
  dealerId: string,
  member: Omit<ShowroomTeamMember, "id">
): ShowroomTeamMember | null {
  const all = readAll();
  const room = all[dealerId];
  if (!room) return null;
  const entry: ShowroomTeamMember = {
    ...member,
    id: `tm-${Date.now()}`,
  };
  room.team = [...room.team, entry];
  room.updatedAt = Date.now();
  writeAll(all);
  return entry;
}

export function removeTeamMember(dealerId: string, memberId: string): void {
  const all = readAll();
  const room = all[dealerId];
  if (!room) return;
  room.team = room.team.filter((m) => m.id !== memberId);
  room.updatedAt = Date.now();
  writeAll(all);
}

export function addReview(
  dealerId: string,
  review: Omit<ShowroomReview, "id">
): ShowroomReview | null {
  const all = readAll();
  const room = all[dealerId];
  if (!room) return null;
  const entry: ShowroomReview = { ...review, id: `rv-${Date.now()}` };
  room.reviews = [entry, ...room.reviews];
  room.updatedAt = Date.now();
  writeAll(all);
  return entry;
}

export function removeReview(dealerId: string, reviewId: string): void {
  const all = readAll();
  const room = all[dealerId];
  if (!room) return;
  room.reviews = room.reviews.filter((r) => r.id !== reviewId);
  room.updatedAt = Date.now();
  writeAll(all);
}
