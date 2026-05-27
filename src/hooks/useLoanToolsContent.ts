"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  defaultLoanToolsContent,
  mergeLoanToolsContent,
  type LoanToolsContent,
} from "@/data/loanToolsAdmin";

const STORAGE_KEY = "oldCarBazar_admin_loan_tools";

function readFromStorage(): LoanToolsContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return mergeLoanToolsContent(JSON.parse(raw));
  } catch {
    return null;
  }
}

/**
 * Loan & Tools copy for public pages. Server is the source of truth when
 * available; localStorage is used as a fast cache / offline fallback.
 */
export function useLoanToolsContent(): LoanToolsContent {
  const [content, setContent] = useState<LoanToolsContent>(
    () => defaultLoanToolsContent
  );

  useEffect(() => {
    let cancelled = false;

    const apply = (next: LoanToolsContent) => {
      if (!cancelled) setContent(next);
    };

    const load = async () => {
      try {
        const remote = await api.fetchLoanToolsContent();
        if (cancelled) return;
        if (remote) {
          apply(mergeLoanToolsContent(remote));
          return;
        }
      } catch {
        /* API unavailable — fall through to cache / defaults */
      }
      const cached = readFromStorage();
      apply(cached ?? defaultLoanToolsContent);
    };

    load();

    const onCustom = () => {
      const cached = readFromStorage();
      if (cached) apply(cached);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) onCustom();
    };

    window.addEventListener("oldCarBazar:loanToolsContentChanged", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener(
        "oldCarBazar:loanToolsContentChanged",
        onCustom
      );
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return content;
}
