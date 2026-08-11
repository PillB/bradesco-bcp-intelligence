"use client";

import { useSyncExternalStore, useCallback } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "ursa-theme";

/**
 * Read the saved theme from localStorage only. The user explicitly chose
 * light mode as the project default, so we never fall back to the OS
 * prefers-color-scheme media query — if no preference is stored, we ship
 * light. A returning user who flipped to dark keeps their choice.
 */
function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === "dark" || saved === "light") return saved;
    return "light";
  } catch {
    return "light";
  }
}

/** Subscribe to theme changes from other tabs and the toggle function. */
function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener("ursa-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ursa-theme-change", callback);
  };
}

/** Client snapshot — reads the current theme from localStorage. */
function getSnapshot(): Theme {
  return readTheme();
}

/**
 * Server snapshot — always returns "light" (the project default). This is
 * also used for the initial client render by useSyncExternalStore, which
 * prevents the SSR/CSR hydration mismatch that occurs when the client's
 * localStorage holds "dark" but the server rendered "light".
 */
function getServerSnapshot(): Theme {
  return "light";
}

/**
 * Theme hook with localStorage persistence. Light is the project default;
 * dark is opt-in only.
 *
 * Uses `useSyncExternalStore` for hydration-safe reads: the server and the
 * initial client render both see "light" (from getServerSnapshot), then the
 * client switches to the real localStorage value after hydration. The
 * inline script in layout.tsx applies the `.dark` class before hydration
 * so there is no visual flash.
 *
 * The toggle function writes to localStorage, updates the `.dark` class on
 * <html> directly, and dispatches a custom event so all subscribed
 * components re-render.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const current = readTheme();
    const next: Theme = current === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    if (next === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.dispatchEvent(new Event("ursa-theme-change"));
  }, []);

  // mounted: true on client (useSyncExternalStore already handles the
  // server/client difference; ThemeToggle uses a stable placeholder
  // when the snapshot is the server default "light")
  return { theme, toggle, mounted: true };
}
