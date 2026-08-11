"use client";
import * as React from "react";

export function useHashRoute() {
  const [hash, setHash] = React.useState<string>(
    typeof window !== "undefined" ? window.location.hash.replace("#/", "") || "exec" : "exec"
  );
  React.useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace("#/", "") || "exec";
      setHash(h);
      // Smooth scroll to top instead of instant jump
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", onHash);
    if (!window.location.hash) window.location.hash = "#/exec";
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const navigate = React.useCallback((id: string) => {
    window.location.hash = `#/${id}`;
  }, []);
  return { route: hash, navigate };
}
