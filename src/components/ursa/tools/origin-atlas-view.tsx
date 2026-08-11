"use client";

import { useState, useMemo } from "react";
import type { ComponentType } from "react";
import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import {
  BearMark,
  ArtNouveauDivider,
  Pill,
  Callout,
  StatBlock,
} from "../ursa-brand";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from "recharts";
import {
  MapPin,
  Mountain,
  Droplet,
  Coffee,
  Sparkles,
  ArrowRight,
  Compass,
  Beaker,
  Leaf,
  Sprout,
  BookOpen,
  Quote,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Process = "Washed" | "Natural" | "Honey";

type Origin = {
  id: string;
  name: string;
  department: string;
  altitude: number;
  process: Process;
  varietal: string;
  notes: string[];
  story: string;
  drink: string;
  harvestPeak: string;
  /** Map x/y coordinates inside the 320×480 SVG viewBox. */
  x: number;
  y: number;
  /** True if Ursa has publicly verified sourcing from this origin. */
  verified?: boolean;
};

const ORIGINS: Origin[] = [
  {
    id: "utcubamba",
    name: "Utcubamba",
    department: "Amazonas",
    altitude: 1750,
    process: "Washed",
    varietal: "Bourbon",
    notes: ["Stone fruit", "Floral", "Bright"],
    story:
      "Utcubamba sits in the cloud-forest ceja de selva of Amazonas — the transitional zone where Andean slopes meet the western Amazon basin. Consistent mist, sharp diurnal temperature shifts, and old Bourbon stock produce a cup that reads floral and stone-fruit forward, with the clean, bright acidity that filter-loyal customers keep coming back for. Ursa pours this as the Filtrado Lonya — a single-origin pour-over named after the river that runs through the region.",
    drink: "Filtrado Lonya",
    harvestPeak: "Jun–Aug",
    x: 87,
    y: 164,
    verified: true,
  },
  {
    id: "chirinos",
    name: "Chirinos",
    department: "Cajamarca",
    altitude: 1650,
    process: "Washed",
    varietal: "Caturra",
    notes: ["Caramel", "Citrus", "Clean"],
    story:
      "Chirinos is one of the southern Cajamarca micro-regions that has built a quiet reputation for clean, well-structured washed coffees. Caturra at 1650 m tends to deliver caramel sweetness and a clean citrus finish — approachable and crowd-pleasing. A natural candidate for Ursa's house espresso blend, or as a base for a breakfast-forward milk drink.",
    drink: "—",
    harvestPeak: "May–Jul",
    x: 68,
    y: 131,
  },
  {
    id: "la-coipa",
    name: "La Coipa",
    department: "Cajamarca",
    altitude: 1800,
    process: "Natural",
    varietal: "Bourbon",
    notes: ["Berry", "Chocolate", "Heavy body"],
    story:
      "La Coipa, also in Cajamarca, sits at the higher end of the department's coffee belt. Natural-processed Bourbon at this altitude pushes the cup toward ripe berry and chocolate with a heavy, syrupy body — perfect for a cold-brew base or a seasonal single-origin espresso. A natural complement to Ursa's coldbrew bar.",
    drink: "—",
    harvestPeak: "Jun–Aug",
    x: 59,
    y: 135,
  },
  {
    id: "satipo",
    name: "Satipo",
    department: "Junín",
    altitude: 1550,
    process: "Washed",
    varietal: "Catimor",
    notes: ["Nutty", "Smooth", "Mild"],
    story:
      "Satipo is the central-Junín coffee engine — broad, reliable, and the workhorse of many Peruvian espresso blends. Catimor at 1550 m produces a smooth, nutty, mild cup that holds up beautifully under milk. A sensible base layer for a house espresso and a forgiving origin for first-time filter drinkers.",
    drink: "—",
    harvestPeak: "May–Jul",
    x: 176,
    y: 292,
  },
  {
    id: "quillabamba",
    name: "Quillabamba",
    department: "Cusco",
    altitude: 1700,
    process: "Washed",
    varietal: "Typica",
    notes: ["Sweet", "Apple", "Balanced"],
    story:
      "Quillabamba in the Cusco cloud-forest belt is classic Typica territory — old-stock varietals at altitude yielding sweet, apple-tinged, beautifully balanced cups. Typica's refinement at 1700 m makes this a natural choice for a featured pour-over rotation or an educational cupping flight.",
    drink: "—",
    harvestPeak: "Jun–Aug",
    x: 215,
    y: 332,
  },
  {
    id: "rodriguez-de-mendoza",
    name: "Rodriguez de Mendoza",
    department: "Amazonas",
    altitude: 1900,
    process: "Honey",
    varietal: "Bourbon",
    notes: ["Honey", "Peach", "Syrupy"],
    story:
      "Rodriguez de Mendoza is one of the highest and most distinctive Amazonas micro-regions. Honey-processed Bourbon at 1900 m produces an intensely syrupy cup with honey and peach notes — a luxury-tier single origin that would suit a limited 'Gramo del Mes' feature or a cupping-night finale.",
    drink: "—",
    harvestPeak: "Jul–Sep",
    x: 100,
    y: 166,
  },
];

/** Tasting-note category map for the flavour wheel. */
const FLAVOUR_CATEGORIES: { name: string; notes: string[] }[] = [
  { name: "Fruit", notes: ["Stone fruit", "Citrus", "Berry", "Apple", "Peach"] },
  { name: "Floral", notes: ["Floral"] },
  { name: "Sweet", notes: ["Caramel", "Honey", "Sweet"] },
  { name: "Nutty", notes: ["Nutty"] },
  { name: "Chocolate", notes: ["Chocolate"] },
  { name: "Body / Balance", notes: ["Heavy body", "Syrupy", "Balanced", "Smooth", "Clean", "Mild", "Bright"] },
];

const ALTITUDE_DATA = ORIGINS.map((o) => ({
  name: o.name,
  altitude: o.altitude,
  verified: o.verified,
}));

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** 1-indexed active harvest months per origin. */
const HARVEST_WINDOWS: Record<string, number[]> = {
  utcubamba: [6, 7, 8],
  chirinos: [5, 6, 7],
  "la-coipa": [6, 7, 8],
  satipo: [5, 6, 7],
  quillabamba: [6, 7, 8],
  "rodriguez-de-mendoza": [7, 8, 9],
};

export function OriginAtlasView() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState<string>("utcubamba");

  const selected = useMemo(
    () => ORIGINS.find((o) => o.id === selectedId) ?? ORIGINS[0],
    [selectedId]
  );

  const wheelData = useMemo(
    () =>
      FLAVOUR_CATEGORIES.map((cat) => ({
        ...cat,
        origins: ORIGINS.filter((o) => o.notes.some((n) => cat.notes.includes(n))),
      })),
    []
  );

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.origin-atlas.eyebrow")}
        title={<>{t("content.view.origin-atlas.title")}</>}
        lede={<>{t("content.origin-atlas.hero.lede")}</>}
        meta={[
          { label: t("content.origin-atlas.meta.origins"), value: t("content.origin-atlas.meta.origins-value", { n: ORIGINS.length }) },
          { label: t("content.origin-atlas.meta.verified"), value: t("content.origin-atlas.meta.verified-value") },
          { label: t("content.origin-atlas.meta.snapshot"), value: t("content.origin-atlas.meta.snapshot-value") },
        ]}
        tone="forest"
      />

      {/* §1 — Stats + intro */}
      <ViewSection
        badge={t("content.origin-atlas.section.1.badge")}
        title={t("content.origin-atlas.section.1.title")}
        meta={t("content.origin-atlas.section.1.meta")}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatBlock value={String(ORIGINS.length)} label={t("content.origin-atlas.stat.origins")} tone="forest" />
          <StatBlock value="1,550–1,900 m" label={t("content.origin-atlas.stat.altitude")} tone="gold" />
          <StatBlock value="3" label={t("content.origin-atlas.stat.processes")} tone="forest" />
          <StatBlock value="4" label={t("content.origin-atlas.stat.varietals")} tone="gold" />
        </div>
        <p className="text-[0.95rem] text-muted-foreground max-w-[68ch] mb-5 m-0">
          {t("content.origin-atlas.section.1.intro")}
        </p>
        <Callout tone="forest" title={t("content.origin-atlas.section.1.callout-title")}>
          {t("content.origin-atlas.section.1.callout-body")}
        </Callout>
      </ViewSection>

      {/* §2 — Interactive map + detail panel */}
      <ViewSection
        badge={t("content.origin-atlas.section.2.badge")}
        title={t("content.origin-atlas.section.2.title")}
        meta={t("content.origin-atlas.section.2.meta")}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6">
          {/* Map card */}
          <Card className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Compass size={16} className="text-ursa-forest-deep" />
                <span className="font-label text-[0.72rem] tracking-[0.16em] uppercase text-ursa-forest-deep">
                  {t("content.origin-atlas.section.2.compass-label")}
                </span>
              </div>
              <Pill tone="gold">
                <MapPin size={11} /> {selected.name}
              </Pill>
            </div>
            <div className="relative w-full aspect-[2/3] max-w-[440px] mx-auto bg-ursa-cream/40 rounded-lg border border-ursa-line-soft p-2">
              <svg
                viewBox="0 0 320 480"
                className="w-full h-full"
                role="img"
                aria-label="Map of Peru with clickable coffee-origin dots"
              >
                {/* Stylized Peru outline */}
                <path
                  d="M 35 22 L 75 20 L 160 40 L 260 80 L 295 160 L 230 240 L 295 290 L 310 380 L 280 450 L 240 468 L 195 460 L 155 415 L 110 360 L 85 290 L 70 220 L 55 150 L 45 80 Z"
                  fill="#F4EBD9"
                  stroke="#8FA68B"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                {/* Country reference labels */}
                <text x="32" y="14" fontSize="7" fill="#8FA68B" fontFamily="Oswald, sans-serif" letterSpacing="1">
                  ECUADOR
                </text>
                <text x="225" y="64" fontSize="7" fill="#8FA68B" fontFamily="Oswald, sans-serif" letterSpacing="1">
                  COLOMBIA
                </text>
                <text x="282" y="252" fontSize="7" fill="#8FA68B" fontFamily="Oswald, sans-serif" letterSpacing="1">
                  BRAZIL
                </text>
                <text x="262" y="468" fontSize="7" fill="#8FA68B" fontFamily="Oswald, sans-serif" letterSpacing="1">
                  BOLIVIA
                </text>
                <text x="195" y="478" fontSize="6" fill="#8FA68B" fontFamily="Oswald, sans-serif" letterSpacing="1">
                  CHILE
                </text>
                <text x="2" y="240" fontSize="6" fill="#B7C9A8" fontFamily="Oswald, sans-serif" letterSpacing="1">
                  PACIFIC
                </text>
                <text x="2" y="250" fontSize="6" fill="#B7C9A8" fontFamily="Oswald, sans-serif" letterSpacing="1">
                  OCEAN
                </text>

                {/* City reference markers */}
                <circle cx="111" cy="312" r="1.6" fill="#8FA68B" />
                <text x="116" y="314" fontSize="6.5" fill="#6F4A2E" fontFamily="Inter, sans-serif">
                  Lima
                </text>
                <circle cx="234" cy="350" r="1.4" fill="#8FA68B" />
                <text x="239" y="352" fontSize="6.5" fill="#6F4A2E" fontFamily="Inter, sans-serif">
                  Cusco
                </text>

                {/* Origin dots */}
                {ORIGINS.map((o) => {
                  const isSelected = o.id === selectedId;
                  const radius = isSelected ? 9 : 6;
                  return (
                    <g
                      key={o.id}
                      onClick={() => setSelectedId(o.id)}
                      className="cursor-pointer"
                      role="button"
                      aria-label={`${o.name}, ${o.department}`}
                    >
                      {o.verified && (
                        <circle
                          cx={o.x}
                          cy={o.y}
                          r="14"
                          fill="none"
                          stroke="#B8924A"
                          strokeWidth="1.4"
                          opacity="0.7"
                        />
                      )}
                      {isSelected && (
                        <circle
                          cx={o.x}
                          cy={o.y}
                          r="12"
                          fill="none"
                          stroke="#2D4A36"
                          strokeWidth="1.4"
                          strokeDasharray="2 2"
                        />
                      )}
                      <circle
                        cx={o.x}
                        cy={o.y}
                        r={radius}
                        fill={o.verified ? "#B8924A" : isSelected ? "#2D4A36" : "#3E6149"}
                        stroke="#F4EBD9"
                        strokeWidth="1.4"
                        style={{ transition: "all 0.2s ease" }}
                      />
                      <text
                        x={o.x + radius + 3}
                        y={o.y + 3}
                        fontSize="7"
                        fill="#3B2417"
                        fontFamily="Inter, sans-serif"
                        fontWeight={isSelected ? 700 : 500}
                        pointerEvents="none"
                      >
                        {o.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Origin selector fallback (accessibility / mobile-friendly list) */}
            <div className="mt-3">
              <div className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-muted-foreground mb-2">
                {t("content.origin-atlas.section.2.list-label")}
              </div>
              <div className="flex flex-wrap gap-2">
                {ORIGINS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSelectedId(o.id)}
                    className={cn(
                      "font-label text-[0.7rem] tracking-[0.08em] uppercase px-2.5 py-1.5 rounded-md border transition",
                      o.id === selectedId
                        ? "bg-ursa-dark-roast text-ursa-cream border-ursa-forest-deep"
                        : "bg-ursa-paper text-ursa-dark-roast border-ursa-line-soft hover:border-ursa-gold"
                    )}
                  >
                    {o.verified && <span className="text-ursa-gold-text mr-1">●</span>}
                    {o.name}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Detail panel */}
          <Card highlight className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-label text-[0.66rem] tracking-[0.16em] uppercase text-ursa-gold-text">
                    {selected.department}
                  </span>
                  {selected.verified && (
                    <Pill tone="gold">{t("content.origin-atlas.section.2.verified-pill")}</Pill>
                  )}
                </div>
                <h3 className="font-display text-2xl font-semibold text-ursa-dark-roast m-0 leading-tight">
                  {selected.name}
                </h3>
              </div>
              <BearMark size={36} className="text-ursa-forest-deep shrink-0" />
            </div>

            <ArtNouveauDivider className="my-1" />

            {/* Spec grid */}
            <div className="grid grid-cols-2 gap-3 text-[0.86rem]">
              <div className="bg-ursa-dark-roast/8 border border-ursa-forest-deep/20 rounded-md px-3 py-2">
                <div className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-ursa-forest-deep flex items-center gap-1">
                  <Mountain size={10} /> {t("content.origin-atlas.section.2.detail.altitude-label")}
                </div>
                <div className="font-display text-lg font-semibold text-ursa-dark-roast">{selected.altitude} m</div>
              </div>
              <div className="bg-ursa-gold/10 border border-ursa-gold/30 rounded-md px-3 py-2">
                <div className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-ursa-medium-roast flex items-center gap-1">
                  <Droplet size={10} /> {t("content.origin-atlas.section.2.detail.process-label")}
                </div>
                <div className="font-display text-lg font-semibold text-ursa-dark-roast">{selected.process}</div>
              </div>
              <div className="bg-ursa-terracotta/10 border border-ursa-terracotta/30 rounded-md px-3 py-2">
                <div className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-ursa-terracotta-text flex items-center gap-1">
                  <Sparkles size={10} /> {t("content.origin-atlas.section.2.detail.varietal-label")}
                </div>
                <div className="font-display text-lg font-semibold text-ursa-dark-roast">{selected.varietal}</div>
              </div>
              <div className="bg-ursa-dark-roast/8 border border-ursa-forest-deep/20 rounded-md px-3 py-2">
                <div className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-ursa-forest-deep flex items-center gap-1">
                  <Coffee size={10} /> {t("content.origin-atlas.section.2.detail.drink-label")}
                </div>
                <div className="font-display text-lg font-semibold text-ursa-dark-roast">{selected.drink}</div>
              </div>
            </div>

            {/* Tasting notes */}
            <div>
              <div className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-muted-foreground mb-2">
                {t("content.origin-atlas.section.2.detail.notes-label")}
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.notes.map((n) => (
                  <span
                    key={n}
                    className="font-label text-[0.72rem] tracking-[0.06em] uppercase px-2.5 py-1 rounded-full bg-ursa-gold/15 text-ursa-medium-roast border border-ursa-gold/40"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* Story */}
            <div>
              <div className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-muted-foreground mb-1.5">
                {t("content.origin-atlas.section.2.detail.story-label")}
              </div>
              <p className="m-0 text-[0.9rem] text-foreground/85 leading-relaxed">{selected.story}</p>
            </div>

            <div className="mt-auto pt-1">
              <Callout tone="forest" title={t("content.origin-atlas.section.2.detail.process-callout-title", { process: selected.process })}>
                {t(`content.origin-atlas.process-meta.${selected.process.toLowerCase()}`)}
              </Callout>
            </div>
          </Card>
        </div>
      </ViewSection>

      {/* §3 — Flavour wheel */}
      <ViewSection
        badge={t("content.origin-atlas.section.3.badge")}
        title={t("content.origin-atlas.section.3.title")}
        meta={t("content.origin-atlas.section.3.meta")}
      >
        <Card className="flex flex-col gap-4">
          <p className="text-[0.92rem] text-foreground/85 m-0">
            {t("content.origin-atlas.section.3.intro")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {wheelData.map((cat) => (
              <div
                key={cat.name}
                className="flex flex-col gap-2 bg-ursa-cream/40 border border-ursa-line-soft rounded-lg p-3"
              >
                <div className="font-display text-base font-semibold text-ursa-forest-deep text-center">
                  {cat.name}
                </div>
                <div className="h-px bg-ursa-line" />
                <div className="flex flex-col gap-1.5 items-center min-h-[80px] justify-center">
                  {cat.origins.length === 0 ? (
                    <span className="font-label text-[0.62rem] tracking-[0.1em] uppercase text-muted-foreground">—</span>
                  ) : (
                    cat.origins.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => setSelectedId(o.id)}
                        className={cn(
                          "font-label text-[0.62rem] tracking-[0.06em] uppercase px-2 py-1 rounded-full border transition",
                          o.verified
                            ? "bg-ursa-gold text-ursa-dark-roast border-ursa-gold hover:brightness-105"
                            : o.id === selectedId
                            ? "bg-ursa-dark-roast text-ursa-cream border-ursa-forest-deep"
                            : "bg-ursa-dark-roast/10 text-ursa-forest-deep border-ursa-forest-deep/30 hover:border-ursa-gold"
                        )}
                      >
                        {o.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </ViewSection>

      {/* §4 — Seasonality */}
      <ViewSection
        badge={t("content.origin-atlas.section.4.badge")}
        title={t("content.origin-atlas.section.4.title")}
        meta={t("content.origin-atlas.section.4.meta")}
      >
        <Card className="flex flex-col gap-4">
          <p className="text-[0.92rem] text-foreground/85 m-0">
            {t("content.origin-atlas.section.4.intro")}
          </p>

          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-[140px_repeat(12,1fr)] gap-1 mb-1">
                <div />
                {MONTHS.map((m) => (
                  <div
                    key={m}
                    className="font-label text-[0.6rem] tracking-[0.1em] uppercase text-muted-foreground text-center"
                  >
                    {m}
                  </div>
                ))}
              </div>
              {ORIGINS.map((o) => {
                const active = HARVEST_WINDOWS[o.id] ?? [];
                return (
                  <div
                    key={o.id}
                    className="grid grid-cols-[140px_repeat(12,1fr)] gap-1 mb-1 items-center"
                  >
                    <button
                      onClick={() => setSelectedId(o.id)}
                      className={cn(
                        "font-label text-[0.66rem] tracking-[0.06em] uppercase text-left pr-2 truncate transition hover:text-ursa-gold-text",
                        o.id === selectedId
                          ? "text-ursa-forest-deep font-semibold"
                          : "text-ursa-dark-roast"
                      )}
                    >
                      {o.verified && <span className="text-ursa-gold-text mr-1">●</span>}
                      {o.name}
                    </button>
                    {MONTHS.map((_, i) => {
                      const month = i + 1;
                      const isActive = active.includes(month);
                      return (
                        <div
                          key={month}
                          className={cn(
                            "h-5 rounded-sm border",
                            isActive
                              ? o.verified
                                ? "bg-ursa-gold border-ursa-gold"
                                : "bg-ursa-forest-deep border-ursa-forest-deep"
                              : "bg-ursa-cream/40 border-ursa-line-soft"
                          )}
                          title={isActive ? `${o.name} harvest (month ${month})` : ""}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-label text-[0.66rem] tracking-[0.12em] uppercase text-muted-foreground flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 bg-ursa-forest-deep rounded-sm" /> {t("content.origin-atlas.section.4.legend-harvest")}
            </span>
            <span className="font-label text-[0.66rem] tracking-[0.12em] uppercase text-muted-foreground flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 bg-ursa-gold rounded-sm" /> {t("content.origin-atlas.section.4.legend-verified")}
            </span>
          </div>
        </Card>
      </ViewSection>

      {/* §5 — Altitude comparison */}
      <ViewSection
        badge={t("content.origin-atlas.section.5.badge")}
        title={t("content.origin-atlas.section.5.title")}
        meta={t("content.origin-atlas.section.5.meta")}
      >
        <Card className="flex flex-col gap-3">
          <p className="text-[0.92rem] text-foreground/85 m-0">
            {t("content.origin-atlas.section.5.intro")}
          </p>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ALTITUDE_DATA}
                layout="vertical"
                margin={{ top: 10, right: 40, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2D4B0" />
                <XAxis
                  type="number"
                  domain={[1400, 2000]}
                  tick={{ fill: "#6F4A2E", fontSize: 11 }}
                  stroke="#C9B68C"
                  label={{
                    value: t("content.origin-atlas.section.5.axis-label"),
                    position: "insideBottom",
                    offset: -2,
                    fill: "#6F4A2E",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#3B2417", fontSize: 11 }}
                  stroke="#C9B68C"
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FAF5EC",
                    border: "1px solid #C9B68C",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value) => `${value} m`}
                />
                <Bar dataKey="altitude" radius={[0, 6, 6, 0]}>
                  {ALTITUDE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.verified ? "#B8924A" : "#3E6149"} />
                  ))}
                  <LabelList
                    dataKey="altitude"
                    position="right"
                    style={{ fill: "#3B2417", fontSize: 11, fontWeight: 600 }}
                    formatter={(v: number) => `${v}m`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Callout tone="gold" title={t("content.origin-atlas.section.5.callout-title")}>
            {t("content.origin-atlas.section.5.callout-body")}
          </Callout>
        </Card>
      </ViewSection>

      {/* §6 — Educational note */}
      <ViewSection
        badge={t("content.origin-atlas.section.6.badge")}
        title={t("content.origin-atlas.section.6.title")}
        meta={t("content.origin-atlas.section.6.meta")}
      >
        <Grid cols={3}>
          <Card className="flex flex-col gap-2 h-full">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-ursa-dark-roast/10 text-ursa-forest-deep border border-ursa-forest-deep/25">
                <Mountain size={18} />
              </span>
              <h4 className="font-display text-lg font-semibold text-ursa-dark-roast m-0">{t("content.origin-atlas.section.6.altitude-title")}</h4>
            </div>
            <p className="m-0 text-[0.88rem] text-foreground/85 leading-relaxed">
              {t("content.origin-atlas.section.6.altitude-body")}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone="forest">{t("content.origin-atlas.section.6.pill-acidity")}</Pill>
              <Pill tone="forest">{t("content.origin-atlas.section.6.pill-aromatics")}</Pill>
              <Pill tone="forest">{t("content.origin-atlas.section.6.pill-density")}</Pill>
            </div>
          </Card>
          <Card className="flex flex-col gap-2 h-full">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-ursa-gold/15 text-ursa-medium-roast border border-ursa-gold/40">
                <Droplet size={18} />
              </span>
              <h4 className="font-display text-lg font-semibold text-ursa-dark-roast m-0">{t("content.origin-atlas.section.6.process-title")}</h4>
            </div>
            <p className="m-0 text-[0.88rem] text-foreground/85 leading-relaxed">
              {t("content.origin-atlas.section.6.process-body")}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone="forest">{t("content.origin-atlas.section.6.pill-washed")}</Pill>
              <Pill tone="stop">{t("content.origin-atlas.section.6.pill-natural")}</Pill>
              <Pill tone="gold">{t("content.origin-atlas.section.6.pill-honey")}</Pill>
            </div>
          </Card>
          <Card className="flex flex-col gap-2 h-full">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-ursa-terracotta/10 text-ursa-terracotta-text border border-ursa-terracotta/30">
                <Sparkles size={18} />
              </span>
              <h4 className="font-display text-lg font-semibold text-ursa-dark-roast m-0">{t("content.origin-atlas.section.6.varietal-title")}</h4>
            </div>
            <p className="m-0 text-[0.88rem] text-foreground/85 leading-relaxed">
              {t("content.origin-atlas.section.6.varietal-body")}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone="gold">{t("content.origin-atlas.section.6.pill-bourbon")}</Pill>
              <Pill tone="forest">{t("content.origin-atlas.section.6.pill-typica")}</Pill>
              <Pill tone="default">{t("content.origin-atlas.section.6.pill-catimor")}</Pill>
            </div>
          </Card>
        </Grid>
        <Callout tone="forest" title={t("content.origin-atlas.section.6.callout-title")}>
          {t("content.origin-atlas.section.6.callout-body")}
        </Callout>
      </ViewSection>

      {/* ============================================================
          §7 — SCIENCE — the research behind the atlas
         ============================================================ */}
      <ViewSection
        badge={t("content.origin-atlas.science.badge")}
        title={t("content.origin-atlas.science.title")}
        meta={t("content.origin-atlas.science.meta")}
      >
        <p className="text-[0.92rem] text-muted-foreground max-w-[78ch] m-0 mb-6">
          {t("content.origin-atlas.science.intro")}
        </p>

        {/* Group 1 — Coffee origin science */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Beaker size={16} className="text-ursa-gold-text" />
          {t("content.origin-atlas.science.group.origin")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {ORIGIN_SCIENCE.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} group="origin-atlas" />
          ))}
        </div>

        {/* Group 2 — Single-origin vs. blend research */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-ursa-gold-text" />
          {t("content.origin-atlas.science.group.terroir")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {TERROIR_SCIENCE.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} group="origin-atlas" />
          ))}
        </div>

        {/* Group 3 — Sustainability and traceability */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Leaf size={16} className="text-ursa-gold-text" />
          {t("content.origin-atlas.science.group.traceability")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
          {TRACEABILITY_SCIENCE.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} group="origin-atlas" />
          ))}
        </div>

        <Callout tone="gold" title={t("content.origin-atlas.science.synthesis.title")}>
          {t("content.origin-atlas.science.synthesis.body")}
        </Callout>
      </ViewSection>

      {/* §8 — Dossier link + onward nav */}
      <ViewSection>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
          <DossierLinkBanner moduleId="03-menu-and-product-development" />
          <div className="flex items-center gap-3 flex-wrap">
            <Pill tone="forest">
              <Compass size={11} /> {t("content.origin-atlas.section.7.atlas-complete")}
            </Pill>
            <button
              onClick={() => navigate("menu")}
              className="font-label text-[0.72rem] tracking-[0.14em] uppercase text-ursa-forest-deep hover:text-ursa-gold-text transition inline-flex items-center gap-1.5"
            >
              {t("content.origin-atlas.section.7.menu-link")} <ArrowRight size={12} />
            </button>
            <button
              onClick={() => navigate("menu-studio")}
              className="font-label text-[0.72rem] tracking-[0.14em] uppercase text-ursa-forest-deep hover:text-ursa-gold-text transition inline-flex items-center gap-1.5"
            >
              {t("content.origin-atlas.section.7.studio-link")} <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </ViewSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Science cards — research that backs the origin atlas.
// Strings live under content.origin-atlas.science.card.{id}.{field} in i18n.ts.
// ---------------------------------------------------------------------------

type ScienceTone = "gold" | "forest" | "terracotta";

type ScienceEntry = {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone: ScienceTone;
};

const ORIGIN_SCIENCE: ScienceEntry[] = [
  { id: "sca-cupping", icon: Beaker, tone: "gold" },
  { id: "altitude-quality", icon: Mountain, tone: "forest" },
  { id: "processing-chemistry", icon: Droplet, tone: "gold" },
  { id: "peru-regions", icon: MapPin, tone: "forest" },
];

const TERROIR_SCIENCE: ScienceEntry[] = [
  { id: "terroir-cross", icon: BookOpen, tone: "gold" },
  { id: "single-origin-perception", icon: Sparkles, tone: "forest" },
  { id: "filtrado-lonya-terroir", icon: Coffee, tone: "gold" },
];

const TRACEABILITY_SCIENCE: ScienceEntry[] = [
  { id: "fair-vs-direct", icon: Sprout, tone: "forest" },
  { id: "wtp-traceability", icon: Quote, tone: "gold" },
  { id: "named-farmer", icon: Users, tone: "terracotta" },
];

function ScienceCard({
  id,
  icon: Icon,
  tone,
  group,
}: {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone: ScienceTone;
  group: "origin-atlas";
}) {
  const { t } = useI18n();
  const toneClasses: Record<ScienceTone, string> = {
    gold: "bg-ursa-gold/10 text-ursa-gold-text border-ursa-gold/30",
    forest: "bg-ursa-dark-roast/10 text-ursa-forest-deep border-ursa-forest-deep/25",
    terracotta: "bg-ursa-terracotta/10 text-ursa-terracotta-text border-ursa-terracotta/30",
  };
  const accentBorder: Record<ScienceTone, string> = {
    gold: "border-ursa-gold/40",
    forest: "border-ursa-forest-deep/35",
    terracotta: "border-ursa-terracotta/40",
  };
  return (
    <Card className="flex flex-col gap-2 p-4 h-full">
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "w-8 h-8 rounded-lg grid place-items-center shrink-0 border",
            toneClasses[tone],
          )}
        >
          <Icon size={16} />
        </span>
        <div className="min-w-0">
          <h4 className="font-display text-[0.98rem] font-semibold text-ursa-dark-roast m-0 leading-tight">
            {t(`content.${group}.science.card.${id}.name`)}
          </h4>
          <p className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-muted-foreground m-0 mt-0.5">
            {t(`content.${group}.science.card.${id}.source`)}
          </p>
        </div>
      </div>
      <div className={cn("border-l-2 pl-2.5 py-1", accentBorder[tone])}>
        <p className="text-[0.82rem] italic text-ursa-dark-roast m-0 leading-snug">
          {t(`content.${group}.science.card.${id}.finding`)}
        </p>
      </div>
      <p className="text-[0.84rem] leading-relaxed text-foreground/85 m-0">
        {t(`content.${group}.science.card.${id}.apply`)}
      </p>
    </Card>
  );
}
