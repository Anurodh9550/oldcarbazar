const SHORTLIST_KEY = "oldCarBazar_shortlisted";

export function getShortlistedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SHORTLIST_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setShortlistedIds(ids: string[]) {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(ids));
}

export function toggleShortlist(id: string): string[] {
  const current = getShortlistedIds();
  const next = current.includes(id)
    ? current.filter((x) => x !== id)
    : [...current, id];
  setShortlistedIds(next);
  return next;
}

export function isShortlisted(id: string): boolean {
  return getShortlistedIds().includes(id);
}
