"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";

/**
 * Geometric bear glyph — OUTLINE ONLY (no fill), built from hexagons
 * and soft curves. Art Nouveau–adjacent. NOT a copy of the official logo.
 *
 * The bear is rendered as stroked outlines with no fill color, so it
 * works on any background without contrast issues. The stroke color
 * is passed via `currentColor` (inherits from the parent's text color).
 *
 * Construction (viewBox 0 0 40 40):
 *  - Two rounded hexagonal ears with inner-ear crescents
 *  - A soft faceted face (rounded octagonal outline)
 *  - Two almond eye outlines
 *  - A rounded muzzle outline
 *  - A pentagonal nose and a gentle split-mouth (two soft curves meeting at center)
 */
export function BearMark({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  const SW = 1.8; // stroke width
  const stroke = "currentColor";

  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      role="img"
      aria-label="Ursa bear mark"
      className={cn("ursa-bear-mark", className)}
      fill="none"
    >
      {/* Ears — rounded hexagonal outlines, wider and softer */}
      <path
        d="M 7 3 Q 3 4 3 9 Q 3 12 6 12 Q 10 12 12 10 Q 13 7 12 4 Q 10 2 7 3 Z"
        fill="none" stroke={stroke} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round"
      />
      <path
        d="M 33 3 Q 37 4 37 9 Q 37 12 34 12 Q 30 12 28 10 Q 27 7 28 4 Q 30 2 33 3 Z"
        fill="none" stroke={stroke} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round"
      />
      {/* Inner ear — crescent shapes (soft, not geometric) */}
      <path
        d="M 8 6 Q 6 7 6.5 10 Q 8 10.5 9.5 9.5 Q 10 7.5 9 6 Q 8 5.5 8 6 Z"
        fill="none" stroke={stroke} strokeWidth={SW * 0.55} strokeLinejoin="round" strokeLinecap="round"
      />
      <path
        d="M 32 6 Q 34 7 33.5 10 Q 32 10.5 30.5 9.5 Q 30 7.5 31 6 Q 32 5.5 32 6 Z"
        fill="none" stroke={stroke} strokeWidth={SW * 0.55} strokeLinejoin="round" strokeLinecap="round"
      />

      {/* Face — soft rounded outline (not rigid octagon) */}
      <path
        d="M 11 11 Q 20 10 29 11 Q 34 14 34 19 Q 33 26 28 31 Q 20 34 12 31 Q 7 26 6 19 Q 6 14 11 11 Z"
        fill="none" stroke={stroke} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round"
      />

      {/* Eyes — almond-shaped outlines (gentler than hexagons) */}
      <path
        d="M 13 17 Q 15 16 17 17 Q 17 19 15.5 20 Q 13.5 19.5 13 18 Q 12.5 17 13 17 Z"
        fill="none" stroke={stroke} strokeWidth={SW * 0.65} strokeLinejoin="round" strokeLinecap="round"
      />
      <path
        d="M 23 17 Q 25 16 27 17 Q 27.5 17 27 18 Q 26.5 19.5 24.5 20 Q 23 19 23 17 Z"
        fill="none" stroke={stroke} strokeWidth={SW * 0.65} strokeLinejoin="round" strokeLinecap="round"
      />

      {/* Muzzle — soft rounded outline */}
      <path
        d="M 20 21 Q 25 22 26 26 Q 25 31 20 33 Q 15 31 14 26 Q 15 22 20 21 Z"
        fill="none" stroke={stroke} strokeWidth={SW * 0.75} strokeLinejoin="round" strokeLinecap="round"
      />

      {/* Nose — soft triangular outline (rounded) */}
      <path
        d="M 17.5 23 Q 20 22 22.5 23 Q 22 25.5 20 26 Q 18 25.5 17.5 23 Z"
        fill="none" stroke={stroke} strokeWidth={SW * 0.65} strokeLinejoin="round" strokeLinecap="round"
      />

      {/* Mouth — gentle split: two soft curves meeting at center bottom.
          Replaces the awkward "O" pentagon with a naturalistic w-shape. */}
      <path
        d="M 16 28 Q 18 29.5 20 28.5 Q 22 29.5 24 28"
        fill="none" stroke={stroke} strokeWidth={SW * 0.65} strokeLinejoin="round" strokeLinecap="round"
      />
      {/* Subtle chin line — gives the muzzle a finished base */}
      <path
        d="M 17 30.5 Q 20 31.5 23 30.5"
        fill="none" stroke={stroke} strokeWidth={SW * 0.4} strokeLinejoin="round" strokeLinecap="round" opacity="0.5"
      />
    </svg>
  );
}

/** Art Nouveau ornamental divider with a central flourish. */
export function ArtNouveauDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-ursa-gold-text my-8", className)} aria-hidden="true">
      <span className="flex-1 h-px bg-gradient-to-r from-transparent via-ursa-line to-transparent" />
      <svg width="48" height="16" viewBox="0 0 48 16" fill="none">
        <path d="M24 2 C20 6, 20 10, 24 14 C28 10, 28 6, 24 2 Z" fill="currentColor" opacity="0.7" />
        <path d="M4 8 Q12 4 20 8" stroke="currentColor" strokeWidth="0.8" fill="none" />
        <path d="M28 8 Q36 12 44 8" stroke="currentColor" strokeWidth="0.8" fill="none" />
        <circle cx="24" cy="8" r="1.6" fill="currentColor" />
      </svg>
      <span className="flex-1 h-px bg-gradient-to-r from-transparent via-ursa-line to-transparent" />
    </div>
  );
}

/** Coffee cup with steam — decorative accent, faceted to match the geometric bear. */
export function CupGlyph({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <polygon points="6,11 22,11 21,17 20,25 12,26 8,25 7,17" fill="currentColor" />
      <polyline points="22,12 25,12 27,14 27,18 25,20 22,20" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M11 3 L11 5 L9.5 7 L9.5 9" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ animation: "ursa-steam 2.5s ease-out infinite" }} />
      <path d="M15 2 L15 4 L13.5 6 L13.5 8" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ animation: "ursa-steam 2.5s ease-out 0.6s infinite" }} />
    </svg>
  );
}

export function SectionBadge({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "forest" | "terracotta" }) {
  const tones = {
    gold: "border-ursa-gold text-ursa-gold-text bg-ursa-paper",
    forest: "border-ursa-forest-deep text-ursa-forest-deep bg-ursa-paper",
    terracotta: "border-ursa-terracotta text-ursa-terracotta-text bg-ursa-paper",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-label text-[0.66rem] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full border", tones[tone])}>
      {children}
    </span>
  );
}

export function EvidenceTag({ status }: { status: "verified" | "partial" | "unverified" | "gap" }) {
  const { t } = useI18n();
  const map = {
    verified: { label: t("common.verified"), cls: "bg-ursa-forest-deep/10 text-ursa-forest-deep border-ursa-forest-deep/30" },
    partial: { label: t("common.partial"), cls: "bg-ursa-gold/20 text-ursa-medium-roast border-ursa-gold" },
    unverified: { label: t("common.unverified"), cls: "bg-ursa-terracotta/15 text-ursa-terracotta border-ursa-terracotta/40" },
    gap: { label: t("common.gap"), cls: "bg-muted text-muted-foreground border-border" },
  };
  const m = map[status];
  return (
    <span className={cn("inline-block font-label text-[0.6rem] tracking-[0.14em] uppercase px-1.5 py-0.5 rounded border", m.cls)}>
      {m.label}
    </span>
  );
}

export function Pill({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "ok" | "warn" | "stop" | "forest" | "gold" | "terracotta";
  className?: string;
}) {
  const tones = {
    default: "bg-muted text-ursa-forest-deep border-ursa-line-soft",
    ok: "bg-ursa-dark-roast/10 text-ursa-forest-deep border-ursa-forest-deep/30",
    warn: "bg-ursa-gold/15 text-ursa-forest-deep border-ursa-gold",
    stop: "bg-ursa-terracotta/10 text-ursa-terracotta-text border-ursa-terracotta/30",
    forest: "bg-ursa-dark-roast/8 text-ursa-forest-deep border-ursa-forest-deep/25",
    gold: "bg-ursa-gold text-ursa-dark-roast border-ursa-gold",
    terracotta: "bg-ursa-terracotta/12 text-ursa-terracotta-text border-ursa-terracotta/30",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-label text-[0.66rem] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full border", tones[tone], className)}>
      {children}
    </span>
  );
}

/** Callout block with colored left border. */
export function Callout({
  children,
  tone = "gold",
  title,
}: {
  children: React.ReactNode;
  tone?: "gold" | "ok" | "warn" | "stop" | "forest";
  title?: string;
}) {
  const tones = {
    gold: "border-ursa-gold",
    ok: "border-ursa-forest-deep",
    warn: "border-ursa-gold",
    stop: "border-ursa-terracotta",
    forest: "border-ursa-forest-deep",
  };
  return (
    <div className={cn("border-l-4 bg-muted/60 px-5 py-4 rounded-r-lg my-5 overflow-hidden break-words", tones[tone])}>
      {title && <h4 className="font-display text-base font-semibold text-ursa-forest-deep mt-0 mb-1.5">{title}</h4>}
      <div className="text-[0.95rem] leading-relaxed break-words overflow-wrap-anywhere">{children}</div>
    </div>
  );
}

/** Stat block — big number + label. */
export function StatBlock({ value, label, tone = "forest" }: { value: string; label: string; tone?: "forest" | "gold" | "terracotta" }) {
  const tones = {
    forest: "text-ursa-forest-deep",
    gold: "text-ursa-gold-text",
    terracotta: "text-ursa-terracotta-text",
  };
  return (
    <div className="flex flex-col gap-1">
      <span className={cn("font-display text-3xl md:text-4xl font-semibold leading-none", tones[tone])}>{value}</span>
      <span className="font-label text-[0.7rem] tracking-[0.16em] uppercase text-muted-foreground max-w-[32ch]">{label}</span>
    </div>
  );
}

/** Progress bar. */
export function ProgressBar({ value, tone = "gold" }: { value: number; tone?: "gold" | "forest" | "terracotta" }) {
  const tones = {
    gold: "from-ursa-gold to-ursa-dark-roast",
    forest: "from-ursa-medium-roast to-ursa-dark-roast",
    terracotta: "from-ursa-terracotta to-ursa-gold",
  };
  return (
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div className={cn("h-full bg-gradient-to-r rounded-full transition-all duration-500", tones[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
