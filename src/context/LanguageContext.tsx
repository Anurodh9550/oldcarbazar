"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { extendedCopy, type ExtendedCopy } from "@/data/i18n/extended";
import {
  interpolate,
  siteCopy,
  type Language,
  type SiteCopy,
} from "@/data/i18n/translations";

export type { Language };

export type FullSiteCopy = SiteCopy & ExtendedCopy;

/** Always-English UI chrome: header, nav, menus, buttons, feature cards. */
export const ENGLISH_COPY: FullSiteCopy = {
  ...siteCopy.en,
  ...extendedCopy.en,
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  copy: FullSiteCopy;
  t: (template: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "ocb-language";
const LEGACY_STORAGE_KEY = "ocb-helphub-language";

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const saved =
      (window.localStorage.getItem(STORAGE_KEY) as Language | null) ||
      (window.localStorage.getItem(LEGACY_STORAGE_KEY) as Language | null);
    if (saved === "en" || saved === "hi") return saved;
  } catch {
    // ignore
  }
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    document.documentElement.lang = language === "hi" ? "hi-IN" : "en-IN";
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
      window.localStorage.setItem(LEGACY_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  const copy = useMemo(
    () => ({ ...siteCopy[language], ...extendedCopy[language] }),
    [language]
  );

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

/** Header, nav, profile menu, footer links, and action buttons — always English. */
export function useChromeCopy(): FullSiteCopy {
  return ENGLISH_COPY;
}
