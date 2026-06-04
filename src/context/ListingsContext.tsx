"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAdmin } from "@/context/AdminContext";
import { useAuth } from "@/context/AuthContext";
import type { CarListing } from "@/data/cars";
import type { SellCarFormData } from "@/data/sellCarForm";
import { ApiError, api, getAccessToken, getAdminAccessToken } from "@/lib/api";
import { DEFAULT_LISTING_IMAGE } from "@/lib/listingImages";
import type {
  ListingModeration,
  ListingStatus,
  UserCarListing,
} from "@/types/listing";

const STORAGE_KEY = "oldCarBazar_user_listings";
// Stale-while-revalidate cache for the public listings feed. We persist the
// last successful /listings/ response so a returning visitor sees cars
// INSTANTLY even when the Render free-tier backend is cold-starting (30-60s
// on first request after 15 min of idle). Fresh data is fetched in the
// background and replaces the cached entries when it arrives.
const API_LISTINGS_CACHE_KEY = "oldCarBazar_api_listings_cache";
type ApiListingsCache = {
  ts: number;
  listings: UserCarListing[];
};

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
  markListingBoosted: (id: string, boostedUntil: string | null) => void;
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

function isBoostedListing(item: CarListing): boolean {
  const meta = item as Partial<UserCarListing>;
  if (typeof meta.isBoosted === "boolean") return meta.isBoosted;
  if (meta.boostedUntil) {
    return new Date(meta.boostedUntil).getTime() > Date.now();
  }
  return false;
}

function compareRankedListings(a: CarListing, b: CarListing) {
  const aFeatured = "featured" in a ? Boolean(a.featured) : a.badge === "FEATURED";
  const bFeatured = "featured" in b ? Boolean(b.featured) : b.badge === "FEATURED";
  if (aFeatured !== bFeatured) return bFeatured ? 1 : -1;

  const aBoosted = isBoostedListing(a);
  const bBoosted = isBoostedListing(b);
  if (aBoosted !== bBoosted) return bBoosted ? 1 : -1;

  const aInquiries = Number("inquiries" in a ? a.inquiries ?? 0 : 0);
  const bInquiries = Number("inquiries" in b ? b.inquiries ?? 0 : 0);
  if (aInquiries !== bInquiries) return bInquiries - aInquiries;

  const aViews = Number("views" in a ? a.views ?? 0 : 0);
  const bViews = Number("views" in b ? b.views ?? 0 : 0);
  if (aViews !== bViews) return bViews - aViews;

  const aCreatedAt = Number("createdAt" in a ? a.createdAt ?? 0 : 0);
  const bCreatedAt = Number("createdAt" in b ? b.createdAt ?? 0 : 0);
  return bCreatedAt - aCreatedAt;
}

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { admin } = useAdmin();
  const hasAdminSession = Boolean(admin && getAdminAccessToken());
  const [apiListings, setApiListings] = useState<UserCarListing[]>([]);
  const [userListings, setUserListings] = useState<UserCarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  // Mirror of apiListings used inside refreshListings without putting the
  // listings array itself into the callback's deps (would cause the function
  // to be recreated on every fetch and ripple through every consumer).
  const apiListingsRef = useRef<UserCarListing[]>([]);
  apiListingsRef.current = apiListings;

  const refreshListings = useCallback(async () => {
    setError("");
    // If we already have cached/previous listings, keep showing them while we
    // silently fetch fresh data. Only flip into the global "loading" state on
    // a truly empty first paint, otherwise the whole page would flash to a
    // spinner on every navigation while the Render backend warms up.
    if (apiListingsRef.current.length === 0) {
      setLoading(true);
    }
    try {
      const publicListings = await api.listListings();
      setApiListings(publicListings);
      try {
        const cache: ApiListingsCache = {
          ts: Date.now(),
          listings: publicListings,
        };
        localStorage.setItem(API_LISTINGS_CACHE_KEY, JSON.stringify(cache));
      } catch {
        /* localStorage quota / private mode — fine to skip */
      }
      if (hasAdminSession) {
        const adminListings = await api.adminListings();
        setUserListings(adminListings);
      } else if (authLoading) {
        // Wait until AuthProvider finishes token refresh + /auth/me.
        return;
      } else if (isLoggedIn) {
        const mine = await api.myListings();
        setUserListings(mine);
      } else {
        // Not signed in → never show seller-only rows from a previous session.
        setUserListings([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load listings.");
      // IMPORTANT: do NOT wipe `apiListings` on error. If the user already
      // saw cached cars (cold start, network blip), keep those visible
      // instead of flashing to an empty state.
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
  }, [hasAdminSession, isLoggedIn, authLoading]);

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
      // Hydrate the public listings cache so returning visitors see cars
      // immediately while the backend (Render free tier) cold-starts.
      const cachedApi = localStorage.getItem(API_LISTINGS_CACHE_KEY);
      if (cachedApi) {
        const parsed = JSON.parse(cachedApi) as ApiListingsCache;
        if (
          parsed &&
          Array.isArray(parsed.listings) &&
          parsed.listings.length > 0
        ) {
          const normalized = parsed.listings.map(normalizeStoredListing);
          setApiListings(normalized);
          // We have content to render — skip the page-wide spinner; the
          // background refresh in `refreshListings` will quietly update it.
          setLoading(false);
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
      // Quota changed → tell SubscriptionContext to re-fetch.
      window.dispatchEvent(new Event("ocb-listings-changed"));
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
      // Pessimistic: only mutate local state after the backend confirms.
      // Previously we removed optimistically and rolled back on error — that
      // made silent failures look like the listing was deleted and then
      // "magically came back" after refresh, which is exactly the confusion
      // sellers reported.
      try {
        if (hasAdminSession) {
          await api.adminDeleteListing(id);
        } else {
          await api.deleteListing(id);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not delete listing.";
        setError(message);
        throw err instanceof Error ? err : new Error(message);
      }
      setUserListings((prev) => prev.filter((l) => l.id !== id));
      setApiListings((prev) => prev.filter((l) => l.id !== id));
      window.dispatchEvent(new Event("ocb-listings-changed"));
      // Defensive sync so two tabs / cached localStorage can't resurrect it.
      refreshListings().catch(() => undefined);
    },
    [hasAdminSession, refreshListings]
  );

  const updateListingStatus = useCallback(
    async (id: string, status: ListingStatus): Promise<void> => {
      if (hasAdminSession) {
        // Admin tokens don't have a per-seller status endpoint; just reflect
        // the change locally so the moderation UI updates instantly.
        setUserListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status } : l))
        );
        setApiListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status } : l))
        );
        return;
      }

      let updated: UserCarListing;
      try {
        updated = await api.updateListingStatus(id, status);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not update listing.";
        setError(message);
        throw err instanceof Error ? err : new Error(message);
      }
      setUserListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updated } : l))
      );
      setApiListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updated } : l))
      );
      // Active ↔ sold toggle changes the quota usage too.
      window.dispatchEvent(new Event("ocb-listings-changed"));
      // Sync against the server so other tabs / stale caches pick up the
      // new status immediately.
      refreshListings().catch(() => undefined);
    },
    [hasAdminSession, refreshListings]
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
      if (hasAdminSession) {
        api.adminModerateListing(id, moderation, reason ?? "").catch((err) => {
          setError(err instanceof Error ? err.message : "Could not moderate listing.");
          refreshListings();
        });
      }
    },
    [hasAdminSession, refreshListings]
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
    if (hasAdminSession) {
      api.adminFeatureListing(id, nextFeatured).catch((err) => {
        setError(err instanceof Error ? err.message : "Could not feature listing.");
        refreshListings();
      });
    }
  }, [hasAdminSession, refreshListings]);

  const markListingBoosted = useCallback(
    (id: string, boostedUntil: string | null) => {
      const isBoosted = boostedUntil
        ? new Date(boostedUntil).getTime() > Date.now()
        : false;
      const patch = { boostedUntil, isBoosted } as Partial<UserCarListing>;
      setUserListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...patch } : l))
      );
      setApiListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...patch } : l))
      );
    },
    []
  );

  const flagListing = useCallback((id: string, reason: string) => {
    setUserListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, flagged: true, flagReason: reason } : l
      )
    );
    if (hasAdminSession) {
      api.adminFlagListing(id, reason).catch((err) => {
        setError(err instanceof Error ? err.message : "Could not flag listing.");
        refreshListings();
      });
    }
  }, [hasAdminSession, refreshListings]);

  const clearFlag = useCallback((id: string) => {
    setUserListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, flagged: false, flagReason: undefined } : l
      )
    );
    if (hasAdminSession) {
      api.adminClearFlag(id).catch((err) => {
        setError(err instanceof Error ? err.message : "Could not clear flag.");
        refreshListings();
      });
    }
  }, [hasAdminSession, refreshListings]);

  const getMyListings = useCallback(
    (sellerId: string) => {
      // When a regular user is signed in, `userListings` is the result of
      // /listings/mine/, which is already scoped to their account. Returning it
      // directly avoids issues when the form's phone/email differ from the
      // logged-in user's record (which broke the previous string-match filter).
      if (!hasAdminSession) return userListings;

      const key = sellerId.trim().toLowerCase();
      return userListings.filter(
        (l) =>
          l.sellerId === key ||
          l.sellerId === sellerId ||
          l.phone === sellerId ||
          (l.email && l.email.toLowerCase() === key)
      );
    },
    [hasAdminSession, userListings]
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
    // No seed/demo fallback: while the backend fetch is in flight the list
    // is empty (consumers use `loading` to render skeletons). This is what
    // stops the "demo cars flash before real cars" bug on production.
    return [...publicUserListings, ...publicApiListings].sort(compareRankedListings);
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
      markListingBoosted,
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
      markListingBoosted,
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
