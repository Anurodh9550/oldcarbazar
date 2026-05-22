"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAdmin } from "@/context/AdminContext";
import { carListings, type CarListing } from "@/data/cars";
import {
  ownerToSearchLabel,
  type SellCarFormData,
} from "@/data/sellCarForm";
import type {
  ListingModeration,
  ListingStatus,
  UserCarListing,
} from "@/types/listing";

const STORAGE_KEY = "oldCarBazar_user_listings";

type ListingsContextValue = {
  allListings: CarListing[];
  userListings: UserCarListing[];
  addListing: (form: SellCarFormData, photos?: string[]) => UserCarListing;
  removeListing: (id: string) => void;
  updateListingStatus: (id: string, status: ListingStatus) => void;
  setListingModeration: (
    id: string,
    moderation: ListingModeration,
    reason?: string
  ) => void;
  toggleFeatured: (id: string, featured?: boolean) => void;
  flagListing: (id: string, reason: string) => void;
  clearFlag: (id: string) => void;
  getMyListings: (sellerId: string) => UserCarListing[];
  getSellerStats: (sellerId: string) => {
    total: number;
    active: number;
    sold: number;
    views: number;
    inquiries: number;
  };
};

const ListingsContext = createContext<ListingsContextValue | null>(null);

function formatPrice(lakhs: string) {
  const n = parseFloat(lakhs);
  if (Number.isNaN(n)) return lakhs;
  return n >= 100 ? `₹${(n / 100).toFixed(2)} Cr` : `₹${n} Lakh`;
}

function sellerIdFromForm(form: SellCarFormData) {
  return (form.email || form.phone).trim().toLowerCase();
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop";

function formToListing(
  form: SellCarFormData,
  photos: string[] | undefined,
  autoApprove: boolean
): UserCarListing {
  const title = `${form.year} ${form.brand} ${form.model}${form.variant ? ` ${form.variant}` : ""}`.trim();
  const numId = Date.now();
  const gallery = photos?.filter(Boolean) ?? [];
  const cover = gallery[0] ?? DEFAULT_IMAGE;

  return {
    id: `user-${numId}`,
    title,
    specs: `${Number(form.kms).toLocaleString("en-IN")} kms • ${form.fuel} • ${form.transmission} • ${form.owners}`,
    price: formatPrice(form.price),
    location: form.city,
    badge: "DIRECT OWNER",
    image: cover,
    images: gallery.length > 0 ? gallery : undefined,
    bodyType: form.bodyType,
    color: form.color,
    area: form.area.trim() || undefined,
    regNumber: form.regNumber.trim() || undefined,
    ownership: ownerToSearchLabel[form.owners] ?? "First owner",
    registrationMonth: form.registrationMonth,
    insurance: form.insurance,
    seats: parseInt(form.seats, 10) || 5,
    engineCc: form.engineCc.trim() || undefined,
    mileage: form.mileage.trim() || undefined,
    features: form.features.length > 0 ? form.features : undefined,
    whatsapp: form.whatsapp,
    sellerId: sellerIdFromForm(form),
    sellerName: form.sellerName,
    phone: form.phone,
    email: form.email || undefined,
    description: form.description,
    status: "active",
    createdAt: numId,
    views: Math.floor(Math.random() * 40) + 5,
    inquiries: Math.floor(Math.random() * 8),
    moderation: autoApprove ? "approved" : "pending",
    featured: false,
  };
}

function normalizeStoredListing(raw: UserCarListing): UserCarListing {
  return {
    ...raw,
    sellerId: raw.sellerId ?? raw.phone ?? "",
    status: raw.status ?? "active",
    createdAt: raw.createdAt ?? Date.now(),
    views: raw.views ?? 0,
    inquiries: raw.inquiries ?? 0,
    moderation: raw.moderation ?? "approved",
    featured: raw.featured ?? false,
  };
}

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useAdmin();
  const [userListings, setUserListings] = useState<UserCarListing[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as UserCarListing[];
        setUserListings(parsed.map(normalizeStoredListing));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userListings));
  }, [userListings, hydrated]);

  const addListing = useCallback(
    (form: SellCarFormData, photos?: string[]) => {
      const listing = formToListing(form, photos, settings.autoApproveListings);
      setUserListings((prev) => [listing, ...prev]);
      return listing;
    },
    [settings.autoApproveListings]
  );

  const removeListing = useCallback((id: string) => {
    setUserListings((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateListingStatus = useCallback((id: string, status: ListingStatus) => {
    setUserListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
  }, []);

  const setListingModeration = useCallback(
    (id: string, moderation: ListingModeration, reason?: string) => {
      setUserListings((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                moderation,
                rejectedReason:
                  moderation === "rejected" || moderation === "blocked"
                    ? reason ?? l.rejectedReason
                    : undefined,
              }
            : l
        )
      );
    },
    []
  );

  const toggleFeatured = useCallback((id: string, featured?: boolean) => {
    setUserListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, featured: typeof featured === "boolean" ? featured : !l.featured }
          : l
      )
    );
  }, []);

  const flagListing = useCallback((id: string, reason: string) => {
    setUserListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, flagged: true, flagReason: reason } : l
      )
    );
  }, []);

  const clearFlag = useCallback((id: string) => {
    setUserListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, flagged: false, flagReason: undefined } : l
      )
    );
  }, []);

  const getMyListings = useCallback(
    (sellerId: string) => {
      const key = sellerId.trim().toLowerCase();
      return userListings.filter(
        (l) => l.sellerId === key || l.phone === sellerId || l.email === sellerId
      );
    },
    [userListings]
  );

  const getSellerStats = useCallback(
    (sellerId: string) => {
      const mine = getMyListings(sellerId);
      return {
        total: mine.length,
        active: mine.filter((l) => l.status === "active").length,
        sold: mine.filter((l) => l.status === "sold").length,
        views: mine.reduce((s, l) => s + l.views, 0),
        inquiries: mine.reduce((s, l) => s + l.inquiries, 0),
      };
    },
    [getMyListings]
  );

  const allListings = useMemo(() => {
    // Only listings approved by moderation are surfaced publicly. Pending /
    // rejected listings remain visible to the seller via getMyListings but
    // are filtered out of the public-facing list.
    const publicUserListings = userListings.filter(
      (l) =>
        (l.moderation ?? "approved") === "approved" && l.status !== "draft"
    );
    return [...publicUserListings, ...carListings];
  }, [userListings]);

  const value = useMemo(
    () => ({
      allListings,
      userListings,
      addListing,
      removeListing,
      updateListingStatus,
      setListingModeration,
      toggleFeatured,
      flagListing,
      clearFlag,
      getMyListings,
      getSellerStats,
    }),
    [
      allListings,
      userListings,
      addListing,
      removeListing,
      updateListingStatus,
      setListingModeration,
      toggleFeatured,
      flagListing,
      clearFlag,
      getMyListings,
      getSellerStats,
    ]
  );

  return (
    <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>
  );
}

export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error("useListings must be used within ListingsProvider");
  return ctx;
}

export function getSellerIdFromUser(user: {
  email: string;
  phone: string;
}): string {
  return (user.email || user.phone).trim().toLowerCase();
}
