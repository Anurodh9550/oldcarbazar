"use client";

import { AdminProvider } from "@/context/AdminContext";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ListingsProvider } from "@/context/ListingsContext";
import { LocationProvider } from "@/context/LocationContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AdminProvider>
          <ListingsProvider>
            <LocationProvider>{children}</LocationProvider>
          </ListingsProvider>
        </AdminProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
