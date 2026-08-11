"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hash-based router that keeps the app on the single `/` route.
 * Routes look like: /#/brand, /#/calculator, etc.
 * Supports optional params after a colon: /#/calculator:lean
 */
export function useHashRoute(): [string, (route: string) => void] {
  const [route, setRoute] = useState<string>("");

  useEffect(() => {
    const read = () => {
      const hash = window.location.hash.replace(/^#\/?/, "");
      setRoute(hash || "");
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const navigate = useCallback((r: string) => {
    window.location.hash = `/${r}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return [route, navigate];
}

/** Parse route into [base, param] — e.g. "calculator:lean" => ["calculator", "lean"] */
export function parseRoute(route: string): [string, string | undefined] {
  const [base, param] = route.split(":");
  return [base || "", param];
}
