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
import { useAuth } from "@/context/AuthContext";
import { api, type SubscriptionStatus } from "@/lib/api";

type SubscriptionContextValue = {
  status: SubscriptionStatus | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  // Two refresh()s firing back-to-back (e.g. modal opens and the create
  // page also retries) would otherwise double-call /status/. Bail out
  // when one is already in flight.
  const inFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (!isLoggedIn) {
      setStatus(null);
      return;
    }
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    try {
      const next = await api.subscriptionStatus();
      setStatus(next);
    } catch {
      // Backend may be cold-starting; keep last-known status so the
      // page doesn't flicker into an "unknown" upgrade state.
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      setStatus(null);
      return;
    }
    refresh();
  }, [authLoading, isLoggedIn, refresh]);

  // Any time a listing is created, deleted, or status-toggled the quota
  // changes — components broadcast `ocb-listings-changed` and we
  // re-fetch the subscription state.
  useEffect(() => {
    if (!isLoggedIn) return;
    const onChanged = () => {
      refresh();
    };
    window.addEventListener("ocb-listings-changed", onChanged);
    return () => window.removeEventListener("ocb-listings-changed", onChanged);
  }, [isLoggedIn, refresh]);

  const value = useMemo(
    () => ({ status, loading, refresh }),
    [status, loading, refresh]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return ctx;
}
