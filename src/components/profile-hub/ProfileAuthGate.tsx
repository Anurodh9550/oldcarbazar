"use client";

import AuthGate from "@/components/seller/AuthGate";
import { useChromeCopy } from "@/context/LanguageContext";
import type { ExtendedCopy } from "@/data/i18n/extended";

type AuthGateKey = keyof ExtendedCopy["authGates"];

type ProfileAuthGateProps = {
  gateKey: AuthGateKey;
  children: React.ReactNode;
};

export default function ProfileAuthGate({
  gateKey,
  children,
}: ProfileAuthGateProps) {
  const copy = useChromeCopy();
  const gate = copy.authGates[gateKey];
  return (
    <AuthGate title={gate.title} description={gate.description}>
      {children}
    </AuthGate>
  );
}
