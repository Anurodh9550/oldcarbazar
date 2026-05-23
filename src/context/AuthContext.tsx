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
import {
  api,
  apiUserToRegisteredUser,
  apiUserToUser,
  clearTokens,
  getAccessToken,
} from "@/lib/api";

export type User = {
  id?: string;
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
  loading: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  register: (data: User & { password: string; city?: string }) => Promise<User>;
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
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let alive = true;

    async function hydrateSession() {
      try {
        if (!getAccessToken()) {
          if (!alive) return;
          setUser(null);
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        const apiUser = await api.me();
        if (!alive) return;
        const nextUser = apiUserToUser(apiUser);
        setUser(nextUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        setRegisteredUsers((prev) => {
          const apiRegistered = apiUserToRegisteredUser(apiUser);
          const existing = prev.find((u) => u.id === apiRegistered.id);
          return existing
            ? prev.map((u) => (u.id === apiRegistered.id ? apiRegistered : u))
            : [apiRegistered, ...prev];
        });
      } catch {
        clearTokens();
        if (alive) {
          setUser(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      } finally {
        if (alive) setLoading(false);
      }
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
    hydrateSession();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const onSessionExpired = () => {
      clearTokens();
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    };
    window.addEventListener("ocb-auth-expired", onSessionExpired);
    return () => window.removeEventListener("ocb-auth-expired", onSessionExpired);
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

  const upsertRegisteredUser = useCallback((data: User, role: UserRole = "buyer") => {
    const id = data.id ?? makeUserId(data.email, data.phone);
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
        role,
        status: "active",
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        loginCount: 1,
      };
      return [fresh, ...prev];
    });
  }, []);

  const login = useCallback(
    async (identifier: string, password: string) => {
      const data = await api.login(identifier.trim(), password);
      const nextUser = apiUserToUser(data.user);
      setUser(nextUser);
      upsertRegisteredUser(nextUser, data.user.role);
      return nextUser;
    },
    [upsertRegisteredUser]
  );

  const register = useCallback(
    async (payload: User & { password: string; city?: string }) => {
      const data = await api.register({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
        city: payload.city,
      });
      const nextUser = apiUserToUser(data.user);
      setUser(nextUser);
      upsertRegisteredUser(nextUser, data.user.role);
      return nextUser;
    },
    [upsertRegisteredUser]
  );

  const logout = useCallback(() => {
    clearTokens();
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
      isLoggedIn: Boolean(user) && Boolean(getAccessToken()),
      loading,
      login,
      register,
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
      loading,
      login,
      register,
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
