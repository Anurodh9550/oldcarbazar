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
import { useAuth } from "@/context/AuthContext";
import { carListings, type CarListing } from "@/data/cars";
import type { SellCarFormData } from "@/data/sellCarForm";
import { ApiError, api, getAccessToken } from "@/lib/api";
import { DEFAULT_LISTING_IMAGE } from "@/lib/listingImages";
import type {
  ListingModeration,
  ListingStatus,
  UserCarListing,
} from "@/types/listing";

const STORAGE_KEY = "oldCarBazar_user_listings";

type ListingsContextValue = {
  allListings: CarListing[];
  userListings: UserCarListing[];
  loading: boolean;
  error: string;
  refreshListings: () => Promise<void>;
  addListing: (form: SellCarFormData, photos?: string[]) => Promise<UserCarListing>;
  updateListing: (
    id: string,
    form: SellCarFormData,
    photos?: string[]
  ) => Promise<UserCarListing>;
  removeListing: (id: string) => Promise<void>;
  updateListingStatus: (id: string, status: ListingStatus) => Promise<void>;
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

const DEFAULT_IMAGE = DEFAULT_LISTING_IMAGE;

const BROKEN_REMOTE_IMAGES = new Set([
  "https://images.unsplash.com/photo-1494976388531-d1058498beb8?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=600&h=400&fit=crop",
]);

function normalizeImageUrl(src: string | undefined) {
  if (!src || BROKEN_REMOTE_IMAGES.has(src)) return DEFAULT_IMAGE;
  return src;
}

function normalizeStoredListing(raw: UserCarListing): UserCarListing {
  return {
    ...raw,
    image: normalizeImageUrl(raw.image),
    images: raw.images?.map(normalizeImageUrl),
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
  const { isLoggedIn } = useAuth();
  const { admin } = useAdmin();
  const [apiListings, setApiListings] = useState<UserCarListing[]>([]);
  const [userListings, setUserListings] = useState<UserCarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const refreshListings = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const publicListings = await api.listListings();
      setApiListings(publicListings);
      if (admin) {
        const adminListings = await api.adminListings();
        setUserListings(adminListings);
      } else if (isLoggedIn) {
        const mine = await api.myListings();
        setUserListings(mine);
      } else {
        // Not signed in → never show seller-only rows from a previous session.
        setUserListings([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load listings.");
      setApiListings([]);
      if (
        err instanceof ApiError &&
        err.status === 401
      ) {
        setUserListings([]);
        localStorage.removeItem(STORAGE_KEY);
      } else if (!isLoggedIn) {
        setUserListings([]);
      }
    } finally {
      setLoading(false);
    }
  }, [admin, isLoggedIn]);

  // When the auth session is invalidated (event from api.ts on a 401),
  // drop the cached "my listings" immediately so the UI does not keep showing
  // stale rows that belong to a logged-out account.
  useEffect(() => {
    const onExpired = () => {
      setUserListings([]);
    };
    window.addEventListener("ocb-auth-expired", onExpired);
    return () => window.removeEventListener("ocb-auth-expired", onExpired);
  }, []);

  useEffect(() => {
    // Only restore cached rows when a JWT is present — otherwise stale listings
    // make the seller think they are logged in while DELETE returns 401.
    try {
      if (getAccessToken()) {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as UserCarListing[];
          setUserListings(parsed.map(normalizeStoredListing));
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    refreshListings();
  }, [refreshListings]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userListings));
  }, [userListings, hydrated]);

  const addListing = useCallback(
    async (form: SellCarFormData, photos?: string[]) => {
      const uploadedPhotos = await api.uploadListingPhotos(photos ?? []);
      const listing = await api.createListing(form, uploadedPhotos);
      setUserListings((prev) => [listing, ...prev]);
      setApiListings((prev) =>
        listing.moderation === "approved" && listing.status !== "draft"
          ? [listing, ...prev]
          : prev
      );
      return listing;
    },
    []
  );

  const updateListing = useCallback(
    async (id: string, form: SellCarFormData, photos?: string[]) => {
      const uploadedPhotos = await api.uploadListingPhotos(photos ?? []);
      const updated = await api.updateListing(id, form, uploadedPhotos);
      setUserListings((prev) =>
        prev.map((l) => (l.id === id ? updated : l))
      );
      setApiListings((prev) =>
        prev.map((l) => (l.id === id ? updated : l))
      );
      return updated;
    },
    []
  );

  const removeListing = useCallback(
    async (id: string): Promise<void> => {
      const prevUser = userListings;
      const prevApi = apiListings;
      setUserListings((prev) => prev.filter((l) => l.id !== id));
      setApiListings((prev) => prev.filter((l) => l.id !== id));
      try {
        if (admin) {
          await api.adminDeleteListing(id);
        } else {
          await api.deleteListing(id);
        }
      } catch (err) {
        setUserListings(prevUser);
        setApiListings(prevApi);
        const message =
          err instanceof Error ? err.message : "Could not delete listing.";
        setError(message);
        throw err instanceof Error ? err : new Error(message);
      }
    },
    [admin, userListings, apiListings]
  );

  const updateListingStatus = useCallback(
    async (id: string, status: ListingStatus): Promise<void> => {
      const prevUser = userListings;
      const prevApi = apiListings;
      setUserListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status } : l))
      );
      setApiListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status } : l))
      );
      if (admin) return;
      try {
        await api.updateListingStatus(id, status);
      } catch (err) {
        setUserListings(prevUser);
        setApiListings(prevApi);
        const message =
          err instanceof Error ? err.message : "Could not update listing.";
        setError(message);
        throw err instanceof Error ? err : new Error(message);
      }
    },
    [admin, userListings, apiListings]
  );

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
      if (admin) {
        api.adminModerateListing(id, moderation, reason ?? "").catch((err) => {
          setError(err instanceof Error ? err.message : "Could not moderate listing.");
          refreshListings();
        });
      }
    },
    [admin, refreshListings]
  );

  const toggleFeatured = useCallback((id: string, featured?: boolean) => {
    let nextFeatured = false;
    setUserListings((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        nextFeatured = typeof featured === "boolean" ? featured : !l.featured;
        return { ...l, featured: nextFeatured };
      })
    );
    setApiListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, featured: nextFeatured } : l))
    );
    if (admin) {
      api.adminFeatureListing(id, nextFeatured).catch((err) => {
        setError(err instanceof Error ? err.message : "Could not feature listing.");
        refreshListings();
      });
    }
  }, [admin, refreshListings]);

  const flagListing = useCallback((id: string, reason: string) => {
    setUserListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, flagged: true, flagReason: reason } : l
      )
    );
    if (admin) {
      api.adminFlagListing(id, reason).catch((err) => {
        setError(err instanceof Error ? err.message : "Could not flag listing.");
        refreshListings();
      });
    }
  }, [admin, refreshListings]);

  const clearFlag = useCallback((id: string) => {
    setUserListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, flagged: false, flagReason: undefined } : l
      )
    );
    if (admin) {
      api.adminClearFlag(id).catch((err) => {
        setError(err instanceof Error ? err.message : "Could not clear flag.");
        refreshListings();
      });
    }
  }, [admin, refreshListings]);

  const getMyListings = useCallback(
    (sellerId: string) => {
      // When a regular user is signed in, `userListings` is the result of
      // /listings/mine/, which is already scoped to their account. Returning it
      // directly avoids issues when the form's phone/email differ from the
      // logged-in user's record (which broke the previous string-match filter).
      if (!admin) return userListings;

      const key = sellerId.trim().toLowerCase();
      return userListings.filter(
        (l) =>
          l.sellerId === key ||
          l.sellerId === sellerId ||
          l.phone === sellerId ||
          (l.email && l.email.toLowerCase() === key)
      );
    },
    [admin, userListings]
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
    const publicUserIds = new Set(publicUserListings.map((listing) => listing.id));
    const publicApiListings = apiListings.filter(
      (listing) => !publicUserIds.has(listing.id)
    );
    return apiListings.length > 0
      ? [...publicUserListings, ...publicApiListings]
      : [...publicUserListings, ...carListings];
  }, [apiListings, userListings]);

  const value = useMemo(
    () => ({
      allListings,
      userListings,
      loading,
      error,
      refreshListings,
      addListing,
      updateListing,
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
      loading,
      error,
      refreshListings,
      addListing,
      updateListing,
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
