"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useCountUp — animate a number from `from` (default 0) to `target` once
 * on mount.
 *
 * Uses requestAnimationFrame with an easeOutCubic curve so the count
 * decelerates as it approaches the target — feels natural, not robotic.
 *
 * Accessibility: if the user has `prefers-reduced-motion: reduce` set at
 * the OS level, the effective animation duration collapses to 0 — the
 * first RAF tick then snaps `value` straight to `target`. All setState
 * calls happen inside the RAF callback (never synchronously in the
 * effect body), so this hook does not trigger the
 * `react-hooks/set-state-in-effect` lint rule. This pairs with the
 * reduced-motion CSS override in globals.css that silences all
 * transitions and animations.
 *
 * @param target  final number to count up to
 * @param options optional config: { duration, from, startDelay }
 *                duration defaults to 700ms — short enough not to feel
 *                like a loading state, long enough to be perceived as
 *                motion.
 */
export function useCountUp(
  target: number,
  options?: { duration?: number; from?: number; startDelay?: number }
) {
  const { duration = 700, from = 0, startDelay = 0 } = options || {};
  const [value, setValue] = useState(from);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // For reduced-motion users, collapse the duration to 0 so the first
    // RAF tick snaps to target. All setValue calls stay inside the tick
    // callback (deferred), so no synchronous setState in the effect body.
    const dur = prefersReduced ? 0 : Math.max(0, duration);
    const start = performance.now() + startDelay;
    const tick = (now: number) => {
      // Wait out the start delay before counting.
      if (now < start) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const t = dur <= 0 ? 1 : Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, from, startDelay]);

  return value;
}

/**
 * Parse a StatBlock-style display string into its numeric core.
 *
 * Examples:
 *   "26"     → { prefix: "",     num: 26,  suffix: ""  }
 *   "8+"     → { prefix: "",     num: 8,   suffix: "+" }
 *   "S/.20"  → { prefix: "S/.",  num: 20,  suffix: ""  }
 *   "3.5x"   → { prefix: "",     num: 4,   suffix: "x" } (rounds)
 *   "Ursa"   → null  (no leading integer — caller should render as-is)
 *
 * The prefix and suffix are preserved so the count-up can render
 * "S/.20" → "S/.0" → "S/.7" → "S/.14" → "S/.20" without losing the
 * currency symbol or the "+" / "x" qualifier.
 */
export function parseNumericValue(
  raw: string
): { prefix: string; num: number; suffix: string } | null {
  if (typeof raw !== "string") return null;
  const match = raw.match(/^([^\d]*?)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const prefix = match[1] || "";
  const numStr = match[2];
  const suffix = match[3] || "";
  const num = Math.round(parseFloat(numStr));
  if (!Number.isFinite(num)) return null;
  return { prefix, num, suffix };
}

