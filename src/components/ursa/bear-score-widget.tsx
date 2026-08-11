"use client";

import { useEffect, useState } from "react";
import { BearMark, Pill } from "./ursa-brand";
import { cn } from "@/lib/utils";

/**
 * Bear Score — a brand-health widget that rates how consistently Ursa's
 * verified identity markers appear across its customer-facing surfaces.
 * Scores are derived from the brand audit (Module 01) findings, not invented.
 */
type SurfaceScore = {
  surface: string;
  score: number; // 0–100
  status: "verified" | "partial" | "gap";
  note: string;
};

const SURFACES: SurfaceScore[] = [
  { surface: "Instagram bio & tagline", score: 92, status: "verified", note: "“Un gramo a la vez” is consistent; bear present in avatar." },
  { surface: "Post & Reel covers", score: 68, status: "partial", note: "Bear appears inconsistently; palette drifts toward neutral." },
  { surface: "Caption language", score: 78, status: "partial", note: "Warm Spanish voice present; CTAs vary in clarity." },
  { surface: "Packaging (bean bags)", score: 85, status: "verified", note: "Art Nouveau label + roast date; origin callouts strong." },
  { surface: "Cups & in-store collateral", score: 72, status: "partial", note: "Bear mark on cups; table signs underused." },
  { surface: "Storefront & interior", score: 88, status: "verified", note: "Two-bar theatre is distinctive; atmosphere matches identity." },
  { surface: "Google Business Profile", score: 18, status: "gap", note: "Unclaimed / sparse — the single biggest visibility gap." },
  { surface: "TripAdvisor presence", score: 12, status: "gap", note: "Listing exists but ~0 reviews; review channel dormant." },
  { surface: "Rappi / delivery menu", score: 64, status: "partial", note: "Active but imagery weak; no bundles or story cards." },
  { surface: "Website", score: 8, status: "gap", note: "Not found in public sources — all 5 main competitors have one." },
];

const PILLAR_SCORES = [
  { pillar: "Bear motif", score: 76, color: "var(--color-ursa-dark-roast)" },
  { pillar: "Art Nouveau language", score: 82, color: "var(--color-ursa-gold)" },
  { pillar: "Browns + greens palette", score: 84, color: "var(--color-ursa-forest-deep)" },
  { pillar: "Roastery credibility", score: 90, color: "var(--color-ursa-terracotta)" },
];

function avg(arr: { score: number }[]) {
  return Math.round(arr.reduce((s, x) => s + x.score, 0) / arr.length);
}

export function BearScoreWidget() {
  const overall = avg(SURFACES);
  const pillarAvg = avg(PILLAR_SCORES);
  const composite = Math.round(overall * 0.6 + pillarAvg * 0.4);

  const [animatedOverall, setAnimatedOverall] = useState(0);
  const [animatedComposite, setAnimatedComposite] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setAnimatedOverall(Math.round(overall * eased));
      setAnimatedComposite(Math.round(composite * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [overall, composite]);

  // Note: grade.color drives both the ring stroke AND the numeric label.
  // For text on a light card surface we use the darker *-text token so the
  // 44px score passes WCAG AA contrast (the bright --color-ursa-gold /
  // --color-ursa-terracotta tokens are for fills, not text).
  const grade =
    composite >= 80 ? { label: "Strong", tone: "ok" as const, color: "var(--color-ursa-forest-deep)" } :
    composite >= 60 ? { label: "Developing", tone: "warn" as const, color: "var(--color-ursa-gold-text)" } :
    { label: "At risk", tone: "stop" as const, color: "var(--color-ursa-terracotta-text)" };

  // Find the biggest gap and top strength for the left column
  const sorted = [...SURFACES].sort((a, b) => a.score - b.score);
  const biggestGap = sorted[0];
  const topStrength = sorted[sorted.length - 1];

  return (
    <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6 items-start [grid-template-columns:minmax(0,1fr)]">
      {/* Composite score ring */}
      <div className="bg-card border border-ursa-line-soft rounded-2xl p-6 flex flex-col items-center text-center shadow-[0_1px_0_rgba(59,36,23,0.06),0_8px_24px_-12px_rgba(59,36,23,0.18)]">
        <ScoreRing value={animatedComposite} color={grade.color} />
        <h3 className="font-display text-xl font-semibold text-ursa-dark-roast mt-4 mb-1 m-0">
          Bear Score
        </h3>
        <Pill tone={grade.tone} className="mb-3">{grade.label} · composite</Pill>
        <p className="text-[0.85rem] text-muted-foreground m-0 max-w-[34ch] leading-relaxed">
          A composite of identity consistency across {SURFACES.length} customer-facing surfaces and {PILLAR_SCORES.length} brand pillars. The score is honest: it drops where distribution gaps exist, not where the craft is weak.
        </p>
        <div className="w-full mt-5 pt-5 border-t border-ursa-line-soft grid grid-cols-2 gap-4">
          <div>
            <div className="font-display text-2xl font-semibold text-ursa-dark-roast leading-none">{animatedOverall}</div>
            <div className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground mt-1">Surfaces avg</div>
          </div>
          <div>
            <div className="font-display text-2xl font-semibold text-ursa-dark-roast leading-none">{animatedComposite}</div>
            <div className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground mt-1">Composite</div>
          </div>
        </div>
        {/* Top strength + biggest gap — fills the lower left column */}
        <div className="w-full mt-4 grid grid-cols-2 gap-3 text-left">
          <div className="rounded-lg bg-ursa-dark-roast/8 border border-ursa-forest-deep/20 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4.5L11 5L8.5 7.5L9.2 11L6 9.3L2.8 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill="var(--color-ursa-gold)"/></svg>
              <span className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-ursa-forest-deep">Top strength</span>
            </div>
            <p className="font-display text-[0.82rem] font-semibold text-ursa-dark-roast m-0 leading-tight">{topStrength.surface}</p>
            <p className="font-label text-[0.7rem] text-ursa-forest-deep m-0 mt-0.5">{topStrength.score}/100</p>
          </div>
          <div className="rounded-lg bg-ursa-terracotta/8 border border-ursa-terracotta/25 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 11C8.76 11 11 8.76 11 6C11 3.24 8.76 1 6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11ZM6 3.5V6.5M6 8V8.5" stroke="var(--color-ursa-terracotta)" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <span className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-ursa-terracotta-text">Biggest gap</span>
            </div>
            <p className="font-display text-[0.82rem] font-semibold text-ursa-dark-roast m-0 leading-tight">{biggestGap.surface}</p>
            <p className="font-label text-[0.7rem] text-ursa-terracotta-text m-0 mt-0.5">{biggestGap.score}/100</p>
          </div>
        </div>
      </div>

      {/* Surface breakdown */}
      <div className="space-y-5">
        {/* Pillars */}
        <div className="bg-card border border-ursa-line-soft rounded-2xl p-5 shadow-[0_1px_0_rgba(59,36,23,0.06),0_8px_24px_-12px_rgba(59,36,23,0.18)]">
          <h4 className="font-label text-[0.7rem] tracking-[0.16em] uppercase text-ursa-gold-text m-0 mb-3">Brand pillars</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PILLAR_SCORES.map((p) => (
              <div key={p.pillar} className="text-center">
                <div className="relative w-14 h-14 mx-auto">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-ursa-bg-alt)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.5" fill="none" stroke={p.color} strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={`${(p.score / 100) * 97.4} 97.4`}
                      style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1)" }}
                    />
                  </svg>
                  <span className="absolute inset-0 grid place-items-center font-display text-sm font-semibold text-ursa-dark-roast">{p.score}</span>
                </div>
                <p className="font-label text-[0.6rem] tracking-[0.08em] uppercase text-muted-foreground m-0 mt-1.5 leading-tight">{p.pillar}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Surface scores list */}
        <div className="bg-card border border-ursa-line-soft rounded-2xl p-5 shadow-[0_1px_0_rgba(59,36,23,0.06),0_8px_24px_-12px_rgba(59,36,23,0.18)]">
          <h4 className="font-label text-[0.7rem] tracking-[0.16em] uppercase text-ursa-gold-text m-0 mb-3">Surface consistency</h4>
          <ul className="m-0 p-0 list-none space-y-2.5 max-h-[280px] overflow-y-auto ursa-scroll pr-1">
            {SURFACES.map((s) => {
              const barColor =
                s.status === "verified" ? "var(--color-ursa-forest-deep)" :
                s.status === "partial" ? "var(--color-ursa-gold)" :
                "var(--color-ursa-terracotta)";
              // Text color must pass WCAG — use the darker text variants
              const textColor =
                s.status === "verified" ? "var(--color-ursa-forest-deep)" :
                s.status === "partial" ? "var(--color-ursa-gold-text)" :
                "var(--color-ursa-terracotta-text)";
              return (
                <li key={s.surface} className="group">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="font-display text-[0.92rem] font-semibold text-ursa-dark-roast">{s.surface}</span>
                    <span className="font-label text-[0.78rem] font-semibold tabular-nums" style={{ color: textColor }}>{s.score}</span>
                  </div>
                  <div className="h-2 bg-ursa-bg-alt rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${s.score}%`, background: barColor }}
                    />
                  </div>
                  <p className="text-[0.78rem] text-muted-foreground m-0 leading-snug">{s.note}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ScoreRing({ value, color }: { value: number; color: string }) {
  const r = 50;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative w-36 h-36">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-ursa-bg-alt)" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.08))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[2.75rem] font-semibold leading-none tabular-nums" style={{ color }}>{value}</span>
        <span className="font-label text-[0.58rem] tracking-[0.2em] uppercase text-muted-foreground mt-1.5">/ 100</span>
      </div>
      <BearMark size={20} className="absolute -top-1 -right-1 text-ursa-dark-roast bg-card rounded-full p-0.5 border border-ursa-gold/40" />
    </div>
  );
}
