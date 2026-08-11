"use client";

import { useSyncExternalStore, useCallback, useEffect } from "react";
import {
  DEFAULT_LANGUAGE,
  I18N_STORAGE_KEY,
  translate,
  type Language,
} from "@/lib/i18n";

/**
 * Read the saved language from localStorage. Defaults to English when no
 * preference is stored — the strategic dossier ships in English first;
 * Spanish (Peru) is opt-in for the customer-facing copy.
 */
function readLanguage(): Language {
  try {
    const saved = localStorage.getItem(I18N_STORAGE_KEY) as Language | null;
    if (saved === "en" || saved === "es") return saved;
    return DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

/** Subscribe to language changes from other tabs and the toggle function. */
function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener("ursa-i18n-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ursa-i18n-change", callback);
  };
}

/** Client snapshot — reads the current language from localStorage. */
function getSnapshot(): Language {
  return readLanguage();
}

/**
 * Server snapshot — always returns the default language. This is also used
 * for the initial client render by useSyncExternalStore, preventing the
 * SSR/CSR hydration mismatch when the client's localStorage holds "es"
 * but the server rendered "en".
 */
function getServerSnapshot(): Language {
  return DEFAULT_LANGUAGE;
}

/**
 * Language hook with localStorage persistence. Returns:
 *  - `lang`      : the active language ("en" | "es")
 *  - `setLang`   : setter that also persists and updates <html lang>
 *  - `toggle`    : flips between en and es
 *  - `t(key)`    : resolves a dotted key (e.g. "nav.dashboard" or
 *                  "content.view.brand.title") for the active language,
 *                  with English as fallback.
 *
 * Uses `useSyncExternalStore` for hydration-safe reads: the server and the
 * initial client render both see the default language, then the client
 * switches to the real localStorage value after hydration.
 */
export function useI18n() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLang = useCallback((next: Language) => {
    try {
      localStorage.setItem(I18N_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("ursa-i18n-change"));
    }
  }, []);

  const toggle = useCallback(() => {
    setLang(readLanguage() === "es" ? "en" : "es");
  }, [setLang]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(lang, key, params),
    [lang],
  );

  // Keep <html lang="..."> in sync with the active language. This is a DOM
  // side effect (not state management) so it does not trigger the
  // set-state-in-effect lint rule.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return { lang, setLang, toggle, t, mounted: true };
}
