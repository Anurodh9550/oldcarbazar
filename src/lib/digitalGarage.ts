import type { GarageReminder, GarageVehicle } from "@/types/digitalGarage";

const STORAGE_KEY = "ocb_digital_garage";
export const GARAGE_CHANGED_EVENT = "ocb-garage-changed";

function readAll(): GarageVehicle[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as GarageVehicle[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(vehicles: GarageVehicle[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(GARAGE_CHANGED_EVENT));
  }
}

export function getGarageVehicles(): GarageVehicle[] {
  return readAll().sort((a, b) => b.addedAt - a.addedAt);
}

export function addGarageVehicle(
  input: Omit<GarageVehicle, "id" | "addedAt">
): GarageVehicle {
  const vehicle: GarageVehicle = {
    ...input,
    photos: input.photos ?? [],
    id: `gv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    addedAt: Date.now(),
  };
  writeAll([vehicle, ...readAll()]);
  return vehicle;
}

export function updateGarageVehicle(
  id: string,
  patch: Partial<Omit<GarageVehicle, "id" | "addedAt">>
): GarageVehicle | null {
  const list = readAll();
  const idx = list.findIndex((v) => v.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...patch };
  writeAll(list);
  return list[idx];
}

export function removeGarageVehicle(id: string): void {
  writeAll(readAll().filter((v) => v.id !== id));
}

function daysUntil(isoDate: string): number | null {
  if (!isoDate) return null;
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getGarageReminders(vehicles = getGarageVehicles()): GarageReminder[] {
  const reminders: GarageReminder[] = [];
  for (const v of vehicles) {
    const insDays = daysUntil(v.insuranceExpiry);
    if (insDays != null && insDays <= 60) {
      reminders.push({
        vehicleId: v.id,
        type: "insurance",
        label: `${v.year} ${v.make} ${v.model} — insurance`,
        dueDate: v.insuranceExpiry,
        daysLeft: insDays,
        urgent: insDays <= 14,
      });
    }
    const svcDays = daysUntil(v.serviceDueDate);
    if (svcDays != null && svcDays <= 45) {
      reminders.push({
        vehicleId: v.id,
        type: "service",
        label: `${v.year} ${v.make} ${v.model} — service`,
        dueDate: v.serviceDueDate,
        daysLeft: svcDays,
        urgent: svcDays <= 7,
      });
    }
  }
  return reminders.sort((a, b) => a.daysLeft - b.daysLeft);
}
