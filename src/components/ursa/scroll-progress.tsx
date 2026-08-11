"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/** A thin scroll-progress bar fixed under the header + a back-to-top button. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(pct);
      setShowTop(scrollTop > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Progress bar */}
      <div className="no-print fixed top-0 left-0 right-0 h-[3px] z-[55] pointer-events-none" aria-hidden="true">
        <div
          className="h-full bg-gradient-to-r from-ursa-gold via-ursa-terracotta to-ursa-dark-roast transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "no-print fixed bottom-5 left-5 z-40 w-11 h-11 rounded-full bg-ursa-dark-roast text-ursa-cream border border-ursa-gold/40 shadow-lg flex items-center justify-center hover:bg-ursa-espresso hover:border-ursa-gold transition-all duration-300",
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
}
