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
  interpolate,
  siteCopy,
  type Language,
  type SiteCopy,
} from "@/data/i18n/translations";

export type { Language };

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  copy: SiteCopy;
  t: (template: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "ocb-language";
const LEGACY_STORAGE_KEY = "ocb-helphub-language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved =
        (window.localStorage.getItem(STORAGE_KEY) as Language | null) ||
        (window.localStorage.getItem(LEGACY_STORAGE_KEY) as Language | null);
      if (saved === "en" || saved === "hi") setLanguageState(saved);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "hi" ? "hi-IN" : "en-IN";
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  const copy = siteCopy[language];

  const t = useCallback(
    (template: string, vars?: Record<string, string | number>) =>
      vars ? interpolate(template, vars) : template,
    []
  );

  const value = useMemo(
    () => ({ language, setLanguage, copy, t }),
    [language, setLanguage, copy, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}

export function useSiteCopy() {
  return useLanguage().copy;
}
