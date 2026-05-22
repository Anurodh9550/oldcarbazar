"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { seedBuyers } from "@/data/admin";

export type User = {
  name: string;
  email: string;
  phone: string;
};

export type UserRole = "buyer" | "seller" | "both";
export type UserAccountStatus = "active" | "blocked";

export type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserAccountStatus;
  city?: string;
  createdAt: number;
  lastLoginAt?: number;
  /** Number of times the user logged in (mock). */
  loginCount: number;
  /** Internal note from an admin (mock CRM field). */
  adminNote?: string;
};

type AuthContextValue = {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  registeredUsers: RegisteredUser[];
  /** Mark a registered user as seller (called when they post a listing). */
  promoteToSeller: (idOrEmail: string) => void;
  blockUser: (id: string) => void;
  unblockUser: (id: string) => void;
  setAdminNote: (id: string, note: string) => void;
  getUserById: (id: string) => RegisteredUser | undefined;
};

const STORAGE_KEY = "oldCarBazar_user";
const USERS_KEY = "oldCarBazar_users";

const AuthContext = createContext<AuthContextValue | null>(null);

function makeUserId(email: string, phone: string) {
  const base = (email || phone || "anon").trim().toLowerCase();
  return base.replace(/[^a-z0-9]/g, "-");
}

function buildSeedRegistry(): RegisteredUser[] {
  return seedBuyers.map((b) => ({
    id: b.id,
    name: b.name,
    email: b.email,
    phone: b.phone,
    role: "buyer",
    status: "active",
    city: b.city,
    createdAt: b.createdAt,
    loginCount: Math.floor(Math.random() * 6) + 1,
  }));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      /* ignore */
    }
    try {
      const savedUsers = localStorage.getItem(USERS_KEY);
      if (savedUsers) {
        setRegisteredUsers(JSON.parse(savedUsers));
      } else {
        setRegisteredUsers(buildSeedRegistry());
      }
    } catch {
      setRegisteredUsers(buildSeedRegistry());
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(USERS_KEY, JSON.stringify(registeredUsers));
  }, [registeredUsers, hydrated]);

  const upsertRegisteredUser = useCallback((data: User) => {
    const id = makeUserId(data.email, data.phone);
    setRegisteredUsers((prev) => {
      const existing = prev.find(
        (u) => u.id === id || u.email === data.email || u.phone === data.phone
      );
      if (existing) {
        return prev.map((u) =>
          u.id === existing.id
            ? {
                ...u,
                name: data.name || u.name,
                email: data.email || u.email,
                phone: data.phone || u.phone,
                lastLoginAt: Date.now(),
                loginCount: u.loginCount + 1,
              }
            : u
        );
      }
      const fresh: RegisteredUser = {
        id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: "buyer",
        status: "active",
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        loginCount: 1,
      };
      return [fresh, ...prev];
    });
  }, []);

  const login = useCallback(
    (data: User) => {
      setUser(data);
      upsertRegisteredUser(data);
    },
    [upsertRegisteredUser]
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const promoteToSeller = useCallback((idOrEmail: string) => {
    const key = idOrEmail.trim().toLowerCase();
    setRegisteredUsers((prev) =>
      prev.map((u) =>
        u.id === key || u.email === idOrEmail || u.phone === idOrEmail
          ? { ...u, role: u.role === "buyer" ? "seller" : "both" }
          : u
      )
    );
  }, []);

  const blockUser = useCallback((id: string) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "blocked" } : u))
    );
  }, []);

  const unblockUser = useCallback((id: string) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "active" } : u))
    );
  }, []);

  const setAdminNote = useCallback((id: string, note: string) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, adminNote: note } : u))
    );
  }, []);

  const getUserById = useCallback(
    (id: string) => registeredUsers.find((u) => u.id === id),
    [registeredUsers]
  );

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      login,
      logout,
      registeredUsers,
      promoteToSeller,
      blockUser,
      unblockUser,
      setAdminNote,
      getUserById,
    }),
    [
      user,
      login,
      logout,
      registeredUsers,
      promoteToSeller,
      blockUser,
      unblockUser,
      setAdminNote,
      getUserById,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
