const COMPARE_KEY = "oldCarBazar_compareList";
const MAX_COMPARE = 4;

export function getCompareIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setCompareIds(ids: string[]) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ocb-compare-changed"));
  }
}

/** Remove a single car from the compare list (used by floating widget chips). */
export function removeFromCompare(id: string): string[] {
  const next = getCompareIds().filter((x) => x !== id);
  setCompareIds(next);
  return next;
}

/** Clear all cars from the compare list. */
export function clearCompare(): void {
  setCompareIds([]);
}

export function isInCompare(id: string): boolean {
  return getCompareIds().includes(id);
}

/**
 * Toggle a car in the compare list. Returns:
 *   { ids, added, full } — `full` is true when the user tried to add a
 *   new car but the list was already at MAX_COMPARE cars.
 */
export function toggleCompare(id: string): {
  ids: string[];
  added: boolean;
  full: boolean;
} {
  const current = getCompareIds();
  if (current.includes(id)) {
    const next = current.filter((x) => x !== id);
    setCompareIds(next);
    return { ids: next, added: false, full: false };
  }
  if (current.length >= MAX_COMPARE) {
    return { ids: current, added: false, full: true };
  }
  const next = [...current, id];
  setCompareIds(next);
  return { ids: next, added: true, full: false };
}

export const COMPARE_LIMIT = MAX_COMPARE;
