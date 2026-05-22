"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { seedAdmins } from "@/data/admin";
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
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
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
  const [hydrated, setHydrated] = useState(false);

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
    (email: string, password: string) => {
      const match = seedAdmins.find(
        (a) =>
          a.email.toLowerCase() === email.trim().toLowerCase() &&
          a.password === password
      );
      if (!match) {
        return { ok: false, error: "Invalid email or password." };
      }
      const next: AdminUser = {
        id: match.id,
        name: match.name,
        email: match.email,
        role: match.role,
        avatar: match.avatar,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };
      setAdmin(next);
      logActivity("admin-login", `${next.name} signed in`, next.email);
      return { ok: true };
    },
    [logActivity]
  );

  const logout = useCallback(() => {
    setAdmin(null);
  }, []);

  const clearActivity = useCallback(() => setActivity([]), []);

  const setInquiryStatus = useCallback((id: string, status: InquiryStatus) => {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
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
  }, []);

  const updateSettings = useCallback((patch: Partial<AdminSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetSettings = useCallback(() => setSettings(defaultSettings), []);

  const value = useMemo(
    () => ({
      admin,
      isAdmin: !!admin,
      hydrated,
      login,
      logout,
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
    }),
    [
      admin,
      hydrated,
      login,
      logout,
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
