"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  api,
  clearAdminTokens,
  getAdminAccessToken,
} from "@/lib/api";
import type { RegisteredUser } from "@/context/AuthContext";
import type {
  AdminActivity,
  AdminActivityType,
  AdminUser,
  Inquiry,
  InquiryStatus,
} from "@/types/admin";
import { carListings } from "@/data/cars";

const ADMIN_SESSION_KEY = "oldCarBazar_admin_session";
const ADMIN_ACTIVITY_KEY = "oldCarBazar_admin_activity";
const ADMIN_INQUIRIES_KEY = "oldCarBazar_admin_inquiries";
const ADMIN_SETTINGS_KEY = "oldCarBazar_admin_settings";

export type AdminSettings = {
  autoApproveListings: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappEnabled: boolean;
  maxPhotosPerListing: number;
  minListingPrice: number;
  maxListingPrice: number;
  blockedKeywords: string[];
  supportEmail: string;
  supportPhone: string;
  brandColor: string;
  maintenanceMode: boolean;
};

const defaultSettings: AdminSettings = {
  autoApproveListings: true,
  emailNotifications: true,
  smsNotifications: false,
  whatsappEnabled: true,
  maxPhotosPerListing: 12,
  minListingPrice: 50000,
  maxListingPrice: 50000000,
  blockedKeywords: ["scam", "stolen", "lottery"],
  supportEmail: "support@oldcarbazar.com",
  supportPhone: "+91 98765 43210",
  brandColor: "#f75d34",
  maintenanceMode: false,
};

type AdminContextValue = {
  admin: AdminUser | null;
  isAdmin: boolean;
  hydrated: boolean;
  users: RegisteredUser[];
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  refreshAdminData: () => Promise<void>;
  /** Activity log of admin operations. Newest first. */
  activity: AdminActivity[];
  logActivity: (type: AdminActivityType, message: string, target?: string) => void;
  clearActivity: () => void;
  inquiries: Inquiry[];
  setInquiryStatus: (id: string, status: InquiryStatus) => void;
  addInquiry: (inquiry: Omit<Inquiry, "id" | "createdAt" | "status">) => void;
  removeInquiry: (id: string) => void;
  settings: AdminSettings;
  updateSettings: (patch: Partial<AdminSettings>) => void;
  resetSettings: () => void;
  blockUser: (id: string) => void;
  unblockUser: (id: string) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

function buildSeedInquiries(): Inquiry[] {
  const names = [
    "Ankit Sharma",
    "Pooja Iyer",
    "Vikas Yadav",
    "Meera Pillai",
    "Sandeep Kumar",
    "Divya Nair",
    "Rajesh Khanna",
    "Shruti Banerjee",
  ];
  const messages = [
    "Is the car still available for inspection this weekend?",
    "Can you share the service history and insurance copy?",
    "Final price kya hai? Discount possible?",
    "Test drive can be arranged tomorrow at my place?",
    "Mileage and condition real-time kaisi hai?",
    "Loan facility available for this car?",
    "RC transfer same day ho jayega?",
    "Photos thodi aur clear mil sakti hain?",
  ];
  const statuses: InquiryStatus[] = ["new", "responded", "closed"];
  const channels: Inquiry["channel"][] = ["whatsapp", "call", "form", "chat"];

  return carListings.slice(0, 10).map((car, idx) => ({
    id: `inq-${car.id}`,
    listingId: car.id,
    listingTitle: car.title,
    buyerName: names[idx % names.length],
    buyerPhone: `9${String(100000000 + idx * 73453).slice(0, 9)}`,
    buyerEmail: `${names[idx % names.length].split(" ")[0].toLowerCase()}@gmail.com`,
    sellerId: `seed-seller-${idx + 1}`,
    sellerName: "Verified Dealer",
    message: messages[idx % messages.length],
    channel: channels[idx % channels.length],
    status: statuses[idx % statuses.length],
    createdAt: Date.now() - idx * 1000 * 60 * 60 * 6,
    city: car.location,
    price: car.price,
  }));
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [activity, setActivity] = useState<AdminActivity[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const refreshAdminData = useCallback(async () => {
    if (!getAdminAccessToken()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [me, remoteSettings, remoteActivity, remoteUsers] = await Promise.all([
        api.adminMe(),
        api.adminSettings(),
        api.adminActivity(),
        api.adminUsers(),
      ]);
      setAdmin(me);
      setSettings((prev) => ({ ...prev, ...remoteSettings }));
      setActivity(remoteActivity);
      setUsers(remoteUsers);
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(me));

      // Inquiries: best-effort load. Falls back to whatever was hydrated
      // from localStorage if the backend call fails.
      try {
        const remoteInquiries = await api.adminInquiries();
        setInquiries(remoteInquiries);
      } catch {
        /* keep cached inquiries */
      }
    } catch {
      clearAdminTokens();
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ADMIN_SESSION_KEY);
      if (saved) setAdmin(JSON.parse(saved));
    } catch {
      /* ignore */
    }
    try {
      const act = localStorage.getItem(ADMIN_ACTIVITY_KEY);
      if (act) setActivity(JSON.parse(act));
    } catch {
      /* ignore */
    }
    try {
      const inq = localStorage.getItem(ADMIN_INQUIRIES_KEY);
      if (inq) {
        setInquiries(JSON.parse(inq));
      } else {
        setInquiries(buildSeedInquiries());
      }
    } catch {
      setInquiries(buildSeedInquiries());
    }
    try {
      const s = localStorage.getItem(ADMIN_SETTINGS_KEY);
      if (s) setSettings({ ...defaultSettings, ...JSON.parse(s) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
    refreshAdminData();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (admin) {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }, [admin, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(ADMIN_ACTIVITY_KEY, JSON.stringify(activity));
  }, [activity, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(ADMIN_INQUIRIES_KEY, JSON.stringify(inquiries));
  }, [inquiries, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  const logActivity = useCallback(
    (type: AdminActivityType, message: string, target?: string) => {
      setActivity((prev) => {
        const entry: AdminActivity = {
          id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type,
          message,
          actor: "admin",
          target,
          createdAt: Date.now(),
        };
        return [entry, ...prev].slice(0, 200);
      });
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const next = await api.adminLogin(email, password);
        setAdmin(next);
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(next));
        await refreshAdminData();
        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : "Invalid email or password.",
        };
      }
    },
    [refreshAdminData]
  );

  const logout = useCallback(() => {
    clearAdminTokens();
    setAdmin(null);
  }, []);

  const clearActivity = useCallback(() => setActivity([]), []);

  const setInquiryStatus = useCallback((id: string, status: InquiryStatus) => {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    if (getAdminAccessToken()) {
      api.adminUpdateInquiryStatus(id, status).catch(() => {
        /* keep optimistic UI */
      });
    }
  }, []);

  const addInquiry = useCallback(
    (inquiry: Omit<Inquiry, "id" | "createdAt" | "status">) => {
      const fresh: Inquiry = {
        ...inquiry,
        id: `inq-${Date.now()}`,
        createdAt: Date.now(),
        status: "new",
      };
      setInquiries((prev) => [fresh, ...prev]);
    },
    []
  );

  const removeInquiry = useCallback((id: string) => {
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    if (getAdminAccessToken()) {
      api.adminDeleteInquiry(id).catch(() => {
        /* keep optimistic UI */
      });
    }
  }, []);

  const toApiSettings = (patch: Partial<AdminSettings>) => {
    const out: Record<string, unknown> = {};
    if ("autoApproveListings" in patch) out.auto_approve_listings = patch.autoApproveListings;
    if ("maintenanceMode" in patch) out.maintenance_mode = patch.maintenanceMode;
    if ("emailNotifications" in patch) out.email_notifications = patch.emailNotifications;
    if ("smsNotifications" in patch) out.sms_notifications = patch.smsNotifications;
    if ("whatsappEnabled" in patch) out.whatsapp_enabled = patch.whatsappEnabled;
    if ("maxPhotosPerListing" in patch) out.max_photos_per_listing = patch.maxPhotosPerListing;
    if ("minListingPrice" in patch) out.min_listing_price = patch.minListingPrice;
    if ("maxListingPrice" in patch) out.max_listing_price = patch.maxListingPrice;
    if ("blockedKeywords" in patch) out.blocked_keywords = patch.blockedKeywords;
    if ("supportEmail" in patch) out.support_email = patch.supportEmail;
    if ("supportPhone" in patch) out.support_phone = patch.supportPhone;
    if ("brandColor" in patch) out.brand_color = patch.brandColor;
    return out;
  };

  const updateSettings = useCallback((patch: Partial<AdminSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
    if (getAdminAccessToken()) {
      api.updateAdminSettings(toApiSettings(patch)).catch(() => {
        /* keep optimistic UI */
      });
    }
  }, []);

  const resetSettings = useCallback(() => setSettings(defaultSettings), []);

  const blockUser = useCallback((id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "blocked" } : u))
    );
    api.adminBlockUser(id, true).catch(() => refreshAdminData());
  }, [refreshAdminData]);

  const unblockUser = useCallback((id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "active" } : u))
    );
    api.adminBlockUser(id, false).catch(() => refreshAdminData());
  }, [refreshAdminData]);

  const value = useMemo(
    () => ({
      admin,
      isAdmin: !!admin,
      hydrated,
      users,
      loading,
      login,
      logout,
      refreshAdminData,
      activity,
      logActivity,
      clearActivity,
      inquiries,
      setInquiryStatus,
      addInquiry,
      removeInquiry,
      settings,
      updateSettings,
      resetSettings,
      blockUser,
      unblockUser,
    }),
    [
      admin,
      hydrated,
      users,
      loading,
      login,
      logout,
      refreshAdminData,
      activity,
      logActivity,
      clearActivity,
      inquiries,
      setInquiryStatus,
      addInquiry,
      removeInquiry,
      settings,
      updateSettings,
      resetSettings,
      blockUser,
      unblockUser,
    ]
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
