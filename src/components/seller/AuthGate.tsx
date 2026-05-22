"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

type AuthGateProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  features?: string[];
};

export default function AuthGate({
  children,
  title,
  description,
  features = [],
}: AuthGateProps) {
  const { isLoggedIn } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) setAuthOpen(true);
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <>
        <div className="rounded-2xl border-2 border-dashed border-[#f75d34]/30 bg-gradient-to-br from-orange-50/50 to-white py-20 text-center sm:py-24">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f75d34]/10 text-3xl">
            🔒
          </span>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mx-auto mt-2 max-w-md text-body-muted">{description}</p>
          {features.length > 0 && (
            <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-body-muted">
              {features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-[#f75d34]">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="mt-8 rounded-full bg-[#f75d34] px-8 py-3 text-sm font-semibold text-white hover:bg-[#e54d24]"
          >
            Login / Register
          </button>
        </div>
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    );
  }

  return <>{children}</>;
}
