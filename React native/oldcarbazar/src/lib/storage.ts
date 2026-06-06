import AsyncStorage from "@react-native-async-storage/async-storage";

import type { CarListing } from "@/types/listing";

const SHORTLIST_KEY = "ocb_shortlist";
const COMPARE_KEY = "ocb_compare";
const RECENT_KEY = "ocb_recent";

export const MAX_COMPARE = 3;
const MAX_RECENT = 12;

async function readList(key: string): Promise<CarListing[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as CarListing[]) : [];
  } catch {
    return [];
  }
}

async function writeList(key: string, list: CarListing[]) {
  await AsyncStorage.setItem(key, JSON.stringify(list));
}

// ---- Shortlist (favorites) ----
export const shortlist = {
  get: () => readList(SHORTLIST_KEY),
  async toggle(car: CarListing): Promise<boolean> {
    const list = await readList(SHORTLIST_KEY);
    const exists = list.some((c) => c.id === car.id);
    const next = exists ? list.filter((c) => c.id !== car.id) : [car, ...list];
    await writeList(SHORTLIST_KEY, next);
    return !exists;
  },
  async has(id: string) {
    const list = await readList(SHORTLIST_KEY);
    return list.some((c) => c.id === id);
  },
  async ids() {
    const list = await readList(SHORTLIST_KEY);
    return list.map((c) => c.id);
  },
};

// ---- Compare ----
export const compare = {
  get: () => readList(COMPARE_KEY),
  async toggle(car: CarListing): Promise<{ added: boolean; full: boolean }> {
    const list = await readList(COMPARE_KEY);
    const exists = list.some((c) => c.id === car.id);
    if (exists) {
      await writeList(COMPARE_KEY, list.filter((c) => c.id !== car.id));
      return { added: false, full: false };
    }
    if (list.length >= MAX_COMPARE) return { added: false, full: true };
    await writeList(COMPARE_KEY, [...list, car]);
    return { added: true, full: false };
  },
  async remove(id: string) {
    const list = await readList(COMPARE_KEY);
    await writeList(COMPARE_KEY, list.filter((c) => c.id !== id));
  },
  async clear() {
    await AsyncStorage.removeItem(COMPARE_KEY);
  },
};

// ---- Recently viewed ----
export const recentlyViewed = {
  get: () => readList(RECENT_KEY),
  async add(car: CarListing) {
    const list = await readList(RECENT_KEY);
    const next = [car, ...list.filter((c) => c.id !== car.id)].slice(0, MAX_RECENT);
    await writeList(RECENT_KEY, next);
  },
};
