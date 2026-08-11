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
  SectionBadge,
} from "../ursa-brand";
import { COMPETITORS } from "@/lib/ursa-data";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import {
  Search,
  Globe,
  MapPin,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trophy,
  Scale,
  Target,
  Compass,
  Filter,
  Layers,
  Microscope,
  Network,
  Star,
  MessageSquare,
  BookOpen,
  MapPinned,
  TrendingUp,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Competitor = (typeof COMPETITORS)[number];

/** Ursa's own profile for side-by-side comparison. */
const URSA_PROFILE: Competitor & { isUrsa?: boolean } = {
  id: "URSA",
  name: "Ursa Coffee Roasters",
  area: "Miraflores (single site)",
  address: "Alcanfores 183, Miraflores, Lima 15074",
  street: "Alcanfores",
  distanceMeters: 0,
  distanceBand: "same-street",
  type: "Café de especialidad independiente (tostador de un solo local)",
  subtype: "Tostador de especialidad + teatro de dos barras",
  googleRating: 4.5,
  googleReviewCount: 56,
  tripAdvisorRating: null,
  tripAdvisorReviewCount: 0,
  status: "operating",
  positioning:
    "Tostador de especialidad de un solo local en Alcanfores. Marca liderada por el oso, lenguaje craft Art Nouveau, teatro de dos barras (espresso + coldbrew), bebidas con nombre (Ursagroni, Maracumango), ethos «Un gramo a la vez». Top-5 CAM Café 2025.",
  strength: "Bear + Art Nouveau craft; in-house roastery; two bars; named drinks (Ursagroni, Maracumango); Aeropress champion (Paulo Sierra); CAM Café 2025 top-5",
  weakness: "No website yet; single-site; smaller retail reach than chains; TripAdvisor footprint near-zero",
  ursaImplication: "Baseline — protect the bear, close the website gap, scale craft without diluting identity.",
  hasWebsite: false,
  isUrsa: true,
  reviewThemes: {
    praise: [
      "mejor espresso de Lima (@flying__espresso, Instagram)",
      "campeón de Aeropress — Paulo Sierra (@rutadelcafeperuano)",
      "top-5 CAM Café 2025",
      "acogedor y centrado en craft (editorial Corner.inc)",
      "alta calidad, de especialidad; personal amable (NovaCircle)",
    ],
    complaints: [
      "pocos asientos en hora pico (NovaCircle)",
      "precios ligeramente más altos que el promedio (NovaCircle)",
      "huella en TripAdvisor ~0 reseñas",
    ],
    sampleSizeNote:
      "Reseñas específicas de Ursa: 8 menciones reales encontradas entre Instagram + editorial. Agregado de Google 4.5/5 (56 reseñas vía addagio.io). Muestra pequeña pero no cero — ver CUSTOMER_REVIEWS en ursa-data.ts.",
  },
};

/** Combined list with Ursa prepended for the table & matrix. */
const ALL_ROWS = [URSA_PROFILE, ...COMPETITORS];

/**
 * Build the i18n key for a per-competitor data field. The competitor's display
 * name (including spaces and accents) is the key suffix — this keeps the
 * lookup unambiguous even for near-duplicate names like «Milenaria Cafe»
 * versus «Milenaria Café». The English source-of-truth lives in ursa-data.ts;
 * the bilingual values live under `content.competitors.data.{name}.{field}`
 * in i18n.ts.
 */
const dataKey = (name: string, field: string): string =>
  `content.competitors.data.${name}.${field}`;

/** Filter options — value drives filter logic; keySuffix drives the display label. */
const AREA_OPTIONS = [
  { value: "All", keySuffix: "all" },
  { value: "Miraflores", keySuffix: "miraflores" },
  { value: "Barranco", keySuffix: "barranco" },
  { value: "Multiple Lima", keySuffix: "multiple-lima" },
  { value: "Lima", keySuffix: "lima" },
] as const;
type AreaFilter = (typeof AREA_OPTIONS)[number]["value"];

const SITE_OPTIONS = [
  { value: "All", keySuffix: "all" },
  { value: "Yes", keySuffix: "yes" },
  { value: "No", keySuffix: "no" },
] as const;
type SiteFilter = (typeof SITE_OPTIONS)[number]["value"];

/** Sort keys. */
type SortKey = "name" | "area" | "site" | null;
type SortDir = "asc" | "desc";

/** Head-to-head verdict per competitor (qualitative assessment from the implication text). */
const VERDICT: Record<string, "lead" | "match" | "trail"> = {
  "Punto Café": "lead",
  "Neira Café Lab": "trail",
  "Bisetti": "match",
  "Puku Puku": "trail",
  "Terrua": "match",
  "True Artisan": "lead",
  "Café Verde": "lead",
  "Puku Puku / Urqu / Origen / Cate / Arabica": "lead",
  "Ciclos": "lead",
  "RAIZ": "match",
  "Milimetrica Coffee Co": "trail",
  "Milenaria Café": "match",
  "Dulce Ciudad": "lead",
  "Caficulto": "match",
};

/** Matrix positions (scale 0–100, craft 0–100). Scale = retail reach; Craft = distinctiveness of identity. */
const MATRIX_POSITIONS: Record<string, { scale: number; craft: number }> = {
  "Ursa Coffee Roasters": { scale: 12, craft: 95 },
  // Same-street & in-catchment direct competitors
  "Milenaria Cafe": { scale: 20, craft: 40 },
  "Coffee Notes": { scale: 8, craft: 35 },
  "Estación 329": { scale: 25, craft: 65 },
  "Neira Café Lab": { scale: 82, craft: 48 },
  "Arabica Espresso Bar": { scale: 18, craft: 45 },
  "Punto Café": { scale: 38, craft: 55 },
  "Terrua": { scale: 30, craft: 85 },
  "Cate Tasting Room": { scale: 28, craft: 60 },
  "Café Verde": { scale: 22, craft: 38 },
  "El Pan de la Chola": { scale: 45, craft: 50 },
  "Puku Puku": { scale: 75, craft: 50 },
  "True Artisan Cafe": { scale: 22, craft: 52 },
  "OK Café": { scale: 10, craft: 40 },
  "Amauta Coffee": { scale: 15, craft: 42 },
  // Lima-wide benchmark competitors
  "Bisetti": { scale: 28, craft: 80 },
  "Ciclos": { scale: 18, craft: 48 },
  "RAIZ": { scale: 22, craft: 70 },
  "Milimetrica Coffee Co": { scale: 18, craft: 42 },
  "Milenaria Café": { scale: 25, craft: 48 },
  "Dulce Ciudad": { scale: 12, craft: 32 },
  "Caficulto": { scale: 20, craft: 42 },
};

/** Verdict label & styling. */
const VERDICT_META = {
  lead: {
    labelKey: "content.competitors.head-to-head.verdict.lead.label",
    descKey: "content.competitors.head-to-head.verdict.lead.desc",
    pill: "ok" as const,
    text: "text-ursa-forest-deep",
    bg: "bg-ursa-dark-roast/8",
    border: "border-ursa-forest-deep/25",
    dot: "bg-ursa-forest-deep",
  },
  match: {
    labelKey: "content.competitors.head-to-head.verdict.match.label",
    descKey: "content.competitors.head-to-head.verdict.match.desc",
    pill: "warn" as const,
    text: "text-ursa-medium-roast",
    bg: "bg-ursa-gold/12",
    border: "border-ursa-gold/40",
    dot: "bg-ursa-gold",
  },
  trail: {
    labelKey: "content.competitors.head-to-head.verdict.trail.label",
    descKey: "content.competitors.head-to-head.verdict.trail.desc",
    pill: "stop" as const,
    text: "text-ursa-terracotta-text",
    bg: "bg-ursa-terracotta/10",
    border: "border-ursa-terracotta/30",
    dot: "bg-ursa-terracotta",
  },
};

/** Sort indicator icon (defined outside render to satisfy static-component rule). */
function SortIcon({
  k,
  sortKey,
  sortDir,
}: {
  k: Exclude<SortKey, null>;
  sortKey: SortKey;
  sortDir: SortDir;
}) {
  if (sortKey !== k) return <ArrowUpDown size={12} className="opacity-40" />;
  return sortDir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
}

export function CompetitorsView() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const [areaFilter, setAreaFilter] = useState<AreaFilter>("All");
  const [siteFilter, setSiteFilter] = useState<SiteFilter>("All");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  /** Area normalization for the filter. */
  const matchesArea = (area: string, filter: AreaFilter): boolean => {
    if (filter === "All") return true;
    if (filter === "Miraflores") return area.toLowerCase().includes("miraflores");
    if (filter === "Barranco") return area === "Barranco";
    if (filter === "Multiple Lima") return area === "Multiple Lima";
    if (filter === "Lima") return area === "Lima";
    return true;
  };

  /** Filtered + sorted rows (Ursa always shown at the top regardless of filters). */
  const filtered = useMemo(() => {
    const searchLower = search.trim().toLowerCase();
    const competitorsOnly = COMPETITORS.filter((c) => {
      if (!matchesArea(c.area, areaFilter)) return false;
      if (siteFilter === "Yes" && !c.hasWebsite) return false;
      if (siteFilter === "No" && c.hasWebsite) return false;
      if (searchLower && !c.name.toLowerCase().includes(searchLower)) return false;
      return true;
    });

    // Always include Ursa at top, unless search explicitly filters her out.
    const ursaIncluded =
      !searchLower || URSA_PROFILE.name.toLowerCase().includes(searchLower);
    const rows = ursaIncluded ? [URSA_PROFILE, ...competitorsOnly] : competitorsOnly;

    if (!sortKey) return rows;
    const sorted = [...rows].sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortKey === "name") {
        av = a.name.toLowerCase();
        bv = b.name.toLowerCase();
      } else if (sortKey === "area") {
        av = a.area.toLowerCase();
        bv = b.area.toLowerCase();
      } else {
        av = a.hasWebsite ? 1 : 0;
        bv = b.hasWebsite ? 1 : 0;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    // Keep Ursa pinned to the top after sort.
    const ursaIdx = sorted.findIndex((r) => r === URSA_PROFILE);
    if (ursaIdx > 0) {
      const [ursa] = sorted.splice(ursaIdx, 1);
      sorted.unshift(ursa);
    }
    return sorted;
  }, [areaFilter, siteFilter, search, sortKey, sortDir]);

  const visibleCompetitors = filtered.filter((r) => r !== URSA_PROFILE);

  const toggleSort = (key: Exclude<SortKey, null>) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Summary stats
  const totalCompetitors = COMPETITORS.length;
  const withWebsite = COMPETITORS.filter((c) => c.hasWebsite).length;
  const inMiraflores = COMPETITORS.filter((c) =>
    c.area.toLowerCase().includes("miraflores")
  ).length;
  const leadsCount = Object.values(VERDICT).filter((v) => v === "lead").length;
  const distinctivenessScore = Math.round((leadsCount / totalCompetitors) * 100);

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.competitors.eyebrow")}
        title={<>{t("content.view.competitors.title")}</>}
        lede={<>{t("content.competitors.lede")}</>}
        meta={[
          { label: t("content.competitors.meta.rows"), value: t("content.competitors.meta.rows-value", { n: COMPETITORS.length + 1 }) },
          { label: t("content.competitors.meta.filterable"), value: t("content.competitors.meta.filterable-value") },
          { label: t("content.competitors.meta.source"), value: t("content.competitors.meta.source-value") },
        ]}
      />

      {/* Summary stats */}
      <ViewSection className="py-8">
        <Grid cols={4}>
          <StatBlock value={`${totalCompetitors}`} label={t("content.competitors.stat.tracked")} tone="forest" />
          <StatBlock value={`${withWebsite}`} label={t("content.competitors.stat.website")} tone="gold" />
          <StatBlock value={`${inMiraflores}`} label={t("content.competitors.stat.miraflores")} tone="terracotta" />
          <StatBlock value={`${distinctivenessScore}%`} label={t("content.competitors.stat.distinctiveness")} tone="forest" />
        </Grid>
        <p className="text-[0.85rem] text-muted-foreground mt-5 mb-0 max-w-[80ch]">
          {t("content.competitors.summary.caption")}
        </p>
      </ViewSection>

      {/* Filter controls */}
      <ViewSection
        badge={t("content.competitors.section.filter.badge")}
        title={t("content.competitors.section.filter.title")}
        meta={t("content.competitors.section.filter.meta")}
      >
        <Card className="bg-ursa-foam">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="font-label text-[0.68rem] tracking-[0.14em] uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                <Search size={12} /> {t("content.competitors.filter.search-label")}
              </label>
              <Input
                placeholder={t("content.competitors.filter.search-placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-ursa-paper"
              />
            </div>
            <div>
              <label className="font-label text-[0.68rem] tracking-[0.14em] uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                <MapPin size={12} /> {t("content.competitors.filter.area-label")}
              </label>
              <Select value={areaFilter} onValueChange={(v) => setAreaFilter(v as AreaFilter)}>
                <SelectTrigger className="w-full bg-ursa-paper">
                  <SelectValue placeholder={t("content.competitors.filter.area-label")} />
                </SelectTrigger>
                <SelectContent>
                  {AREA_OPTIONS.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {t(`content.competitors.filter.area.${a.keySuffix}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-label text-[0.68rem] tracking-[0.14em] uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                <Globe size={12} /> {t("content.competitors.filter.website-label")}
              </label>
              <Select value={siteFilter} onValueChange={(v) => setSiteFilter(v as SiteFilter)}>
                <SelectTrigger className="w-full bg-ursa-paper">
                  <SelectValue placeholder={t("content.competitors.filter.website-label")} />
                </SelectTrigger>
                <SelectContent>
                  {SITE_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {t(`content.competitors.filter.website.${s.keySuffix}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-ursa-line-soft">
            <Filter size={13} className="text-ursa-gold-text" />
            <span className="font-label text-[0.7rem] tracking-[0.1em] uppercase text-muted-foreground">
              {t("content.competitors.filter.showing-label")}
            </span>
            <Pill tone="forest">{t("content.competitors.filter.pill-competitors", { n: visibleCompetitors.length })}</Pill>
            <Pill tone={siteFilter === "All" ? "default" : siteFilter === "Yes" ? "ok" : "stop"}>
              {t("content.competitors.filter.pill-website", {
                value: t(`content.competitors.filter.website.${SITE_OPTIONS.find((s) => s.value === siteFilter)?.keySuffix ?? "all"}`),
              })}
            </Pill>
            <Pill tone={areaFilter === "All" ? "default" : "gold"}>
              {t("content.competitors.filter.pill-area", {
                value: t(`content.competitors.filter.area.${AREA_OPTIONS.find((a) => a.value === areaFilter)?.keySuffix ?? "all"}`),
              })}
            </Pill>
            {search && <Pill tone="default">{t("content.competitors.filter.pill-search", { value: search })}</Pill>}
            <button
              onClick={() => {
                setAreaFilter("All");
                setSiteFilter("All");
                setSearch("");
                setSortKey("name");
                setSortDir("asc");
              }}
              className="ml-auto font-label text-[0.7rem] tracking-[0.1em] uppercase text-ursa-terracotta-text hover:text-ursa-dark-roast transition"
            >
              {t("content.competitors.filter.reset")}
            </button>
          </div>
        </Card>
      </ViewSection>

      {/* Comparison table */}
      <ViewSection
        badge={t("content.competitors.section.table.badge")}
        title={t("content.competitors.section.table.title")}
        meta={t("content.competitors.section.table.meta")}
      >
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-ursa-paper border-ursa-line-soft hover:bg-ursa-paper">
                  <TableHead className="pl-4">
                    <button
                      onClick={() => toggleSort("name")}
                      className="inline-flex items-center gap-1.5 font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-dark-roast hover:text-ursa-gold-text transition"
                    >
                      {t("content.competitors.table.col.name")} <SortIcon k="name" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort("area")}
                      className="inline-flex items-center gap-1.5 font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-dark-roast hover:text-ursa-gold-text transition"
                    >
                      {t("content.competitors.table.col.area")} <SortIcon k="area" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </TableHead>
                  <TableHead className="min-w-[16rem]">{t("content.competitors.table.col.strength")}</TableHead>
                  <TableHead className="min-w-[14rem]">{t("content.competitors.table.col.weakness")}</TableHead>
                  <TableHead className="min-w-[18rem]">{t("content.competitors.table.col.implication")}</TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort("site")}
                      className="inline-flex items-center gap-1.5 font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-dark-roast hover:text-ursa-gold-text transition"
                    >
                      {t("content.competitors.table.col.website")} <SortIcon k="site" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => {
                  const isUrsa = c === URSA_PROFILE;
                  return (
                    <TableRow
                      key={c.name}
                      className={cn(
                        "border-ursa-line-soft",
                        isUrsa
                          ? "bg-ursa-gold/12 border-ursa-gold/40"
                          : "hover:bg-ursa-paper/60"
                      )}
                    >
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-2">
                          {isUrsa ? (
                            <BearMark size={18} className="text-ursa-dark-roast shrink-0" />
                          ) : (
                            <span className="w-[18px] h-[18px] rounded-full bg-ursa-line-soft shrink-0 flex items-center justify-center">
                              <Coffee size={10} className="text-ursa-medium-roast" />
                            </span>
                          )}
                          <span className={cn("font-medium", isUrsa ? "text-ursa-dark-roast" : "text-ursa-dark-roast")}>
                            {c.name}
                          </span>
                          {isUrsa && (
                            <Pill tone="gold" className="ml-1">
                              <BearMark size={9} className="text-ursa-dark-roast" /> Ursa
                            </Pill>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-[0.85rem] text-muted-foreground whitespace-nowrap">{t(dataKey(c.name, "area"))}</span>
                      </TableCell>
                      <TableCell className="max-w-[20rem]">
                        <span className="text-[0.85rem] text-foreground/85">{t(dataKey(c.name, "strength"))}</span>
                      </TableCell>
                      <TableCell className="max-w-[18rem]">
                        <span className="text-[0.85rem] text-foreground/85">{t(dataKey(c.name, "weakness"))}</span>
                      </TableCell>
                      <TableCell className="max-w-[22rem]">
                        <span className={cn("text-[0.85rem]", isUrsa ? "text-ursa-dark-roast font-medium" : "text-ursa-forest-deep font-medium")}>
                          {t(dataKey(c.name, "ursaImplication"))}
                        </span>
                      </TableCell>
                      <TableCell>
                        {c.hasWebsite ? (
                          <Pill tone="ok"><Globe size={11} /> {t("content.competitors.table.website-yes")}</Pill>
                        ) : (
                          <Pill tone="stop"><Globe size={11} /> {t("content.competitors.table.website-no")}</Pill>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {t("content.competitors.table.empty")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
        <p className="text-[0.82rem] text-muted-foreground mt-3 mb-0">
          {t("content.competitors.table.note")}
        </p>
      </ViewSection>

      {/* Ursa positioning matrix */}
      <ViewSection
        badge={t("content.competitors.section.matrix.badge")}
        title={t("content.competitors.section.matrix.title")}
        meta={t("content.competitors.section.matrix.meta")}
      >
        <Grid cols={3}>
          <div className="md:col-span-2">
            <Card className="p-4 md:p-6 bg-ursa-foam">
              <div
                className="relative w-full bg-ursa-paper rounded-lg border border-ursa-line-soft"
                style={{ aspectRatio: "1 / 1", maxHeight: "560px" }}
              >
                {/* Quadrant background tint */}
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(143,166,139,0.18) 0%, rgba(143,166,139,0.05) 35%, transparent 50%), linear-gradient(315deg, rgba(184,146,74,0.14) 0%, rgba(184,146,74,0.04) 35%, transparent 50%)",
                  }}
                />
                {/* Crosshair axes */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-ursa-line" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-ursa-line" />

                {/* Quadrant labels */}
                <div className="absolute top-2 left-2 font-label text-[0.6rem] tracking-[0.14em] uppercase text-ursa-forest-deep/70 max-w-[10rem] leading-tight">
                  {t("content.competitors.matrix.quadrant.top-left")}
                </div>
                <div className="absolute top-2 right-2 font-label text-[0.6rem] tracking-[0.14em] uppercase text-ursa-gold-text/80 text-right max-w-[11rem] leading-tight">
                  {t("content.competitors.matrix.quadrant.top-right")}
                </div>
                <div className="absolute bottom-2 left-2 font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground max-w-[11rem] leading-tight">
                  {t("content.competitors.matrix.quadrant.bottom-left")}
                </div>
                <div className="absolute bottom-2 right-2 font-label text-[0.6rem] tracking-[0.14em] uppercase text-ursa-terracotta-text/80 text-right max-w-[11rem] leading-tight">
                  {t("content.competitors.matrix.quadrant.bottom-right")}
                </div>

                {/* Axis titles */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-label text-[0.66rem] tracking-[0.18em] uppercase text-ursa-dark-roast whitespace-nowrap">
                  {t("content.competitors.matrix.axis.scale")}
                </div>
                <div
                  className="font-label text-[0.66rem] tracking-[0.18em] uppercase text-ursa-dark-roast"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "-1.5rem",
                    transform: "rotate(-90deg) translateX(50%)",
                    transformOrigin: "left center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("content.competitors.matrix.axis.craft")}
                </div>

                {/* Dots */}
                {ALL_ROWS.map((c) => {
                  const pos = MATRIX_POSITIONS[c.name];
                  if (!pos) return null;
                  const isUrsa = c === URSA_PROFILE;
                  // Invert scale so 0 = left, 100 = right; craft: 0 = bottom, 100 = top
                  const left = `${pos.scale}%`;
                  const top = `${100 - pos.craft}%`;
                  const shortName = c.name.length > 20 ? c.name.split(" ")[0] + "…" : c.name;
                  return (
                    <div
                      key={c.name}
                      className="absolute"
                      style={{ left, top, transform: "translate(-50%, -50%)" }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {isUrsa && (
                          <BearMark size={22} className="text-ursa-dark-roast" />
                        )}
                        <span
                          className={cn(
                            "rounded-full border-2 flex items-center justify-center",
                            isUrsa
                              ? "w-4 h-4 bg-ursa-gold border-ursa-dark-roast shadow-[0_0_0_4px_rgba(184,146,74,0.3)]"
                              : "w-3 h-3 bg-ursa-forest-deep border-ursa-cream"
                          )}
                        />
                        <span
                          className={cn(
                            "font-label text-[0.62rem] tracking-[0.04em] uppercase px-1.5 py-0.5 rounded whitespace-nowrap",
                            isUrsa
                              ? "bg-ursa-dark-roast text-ursa-cream font-semibold"
                              : "bg-ursa-paper/90 text-ursa-dark-roast border border-ursa-line-soft"
                          )}
                        >
                          {shortName}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[0.8rem] text-muted-foreground mt-8 mb-0">
                {t("content.competitors.matrix.note")}
              </p>
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="bg-ursa-foam">
              <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-3 flex items-center gap-2">
                <Target size={16} className="text-ursa-gold-text" /> {t("content.competitors.matrix.guide.heading")}
              </h3>
              <ul className="space-y-2.5 m-0 p-0 list-none text-[0.88rem]">
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ursa-forest-deep shrink-0" />
                  <span>{t("content.competitors.matrix.guide.scale")}</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ursa-forest-deep shrink-0" />
                  <span>{t("content.competitors.matrix.guide.craft")}</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ursa-gold shrink-0" />
                  <span>{t("content.competitors.matrix.guide.ursa")}</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ursa-terracotta shrink-0" />
                  <span>{t("content.competitors.matrix.guide.move")}</span>
                </li>
              </ul>
            </Card>
            <Callout tone="forest" title={t("content.competitors.matrix.open-quadrant.title")}>
              {t("content.competitors.matrix.open-quadrant.body")}
            </Callout>
          </div>
        </Grid>
      </ViewSection>

      {/* Head-to-head cards */}
      <ViewSection
        badge={t("content.competitors.section.head-to-head.badge")}
        title={t("content.competitors.section.head-to-head.title")}
        meta={t("content.competitors.section.head-to-head.meta")}
      >
        <Grid cols={3}>
          {COMPETITORS.map((c) => {
            const verdict = VERDICT[c.name] ?? "match";
            const meta = VERDICT_META[verdict];
            return (
              <Card key={c.name} className="flex flex-col gap-3 h-full">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-1">{c.name}</h3>
                    <div className="flex items-center gap-1.5 text-[0.74rem] text-muted-foreground">
                      <MapPin size={11} className="text-ursa-gold-text" />
                      <span className="font-label tracking-[0.06em] uppercase">{t(dataKey(c.name, "area"))}</span>
                    </div>
                  </div>
                  <Pill tone={meta.pill}>
                    {verdict === "lead" ? <Trophy size={11} /> : verdict === "match" ? <Scale size={11} /> : <Layers size={11} />}
                    {t(meta.labelKey)}
                  </Pill>
                </div>
                <div className={cn("rounded-md px-3 py-2.5 border", meta.bg, meta.border)}>
                  <div className={cn("font-label text-[0.62rem] tracking-[0.16em] uppercase mb-1", meta.text)}>
                    {t("content.competitors.head-to-head.implication-label")}
                  </div>
                  <p className="m-0 text-[0.88rem] text-ursa-dark-roast font-medium leading-snug">{t(dataKey(c.name, "ursaImplication"))}</p>
                </div>
                <div className="text-[0.82rem] text-muted-foreground leading-snug">{t(meta.descKey)}</div>
              </Card>
            );
          })}
        </Grid>
      </ViewSection>

      {/* Synthesis */}
      <ViewSection
        badge={t("content.competitors.section.synthesis.badge")}
        title={t("content.competitors.section.synthesis.title")}
      >
        <Grid cols={2}>
          <Callout tone="stop" title={t("content.competitors.synthesis.website.title")}>
            <p className="mb-0">
              {t("content.competitors.synthesis.website.body")}
            </p>
          </Callout>
          <Callout tone="forest" title={t("content.competitors.synthesis.bear.title")}>
            <p className="mb-0">
              {t("content.competitors.synthesis.bear.body", {
                leads: leadsCount,
                total: totalCompetitors,
                matches: Object.values(VERDICT).filter((v) => v === "match").length,
                trails: Object.values(VERDICT).filter((v) => v === "trail").length,
              })}
            </p>
          </Callout>
        </Grid>
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            onClick={() => navigate("market")}
            className="inline-flex items-center gap-2 bg-ursa-dark-roast text-ursa-cream font-label text-[0.74rem] tracking-[0.14em] uppercase px-4 py-2.5 rounded-md hover:bg-ursa-espresso transition"
          >
            <Compass size={14} /> {t("content.competitors.synthesis.button-market")}
          </button>
          <button
            onClick={() => navigate("brand")}
            className="inline-flex items-center gap-2 border border-ursa-gold text-ursa-gold-text font-label text-[0.74rem] tracking-[0.14em] uppercase px-4 py-2.5 rounded-md hover:bg-ursa-gold hover:text-ursa-dark-roast transition"
          >
            <BearMark size={14} className="text-current" /> {t("content.competitors.synthesis.button-brand")}
          </button>
        </div>
      </ViewSection>

      {/* ============================================================
          SCIENCE — the research behind the intelligence dashboard
         ============================================================ */}
      <ViewSection
        badge={t("content.competitors.science.badge")}
        title={t("content.competitors.science.title")}
        meta={t("content.competitors.science.meta")}
      >
        <p className="text-[0.92rem] text-muted-foreground max-w-[78ch] m-0 mb-6">
          {t("content.competitors.science.intro")}
        </p>

        {/* Group 1 — Competitive intelligence methodology */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Microscope size={16} className="text-ursa-gold-text" />
          {t("content.competitors.science.group.methodology")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {COMP_METHOD.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} group="competitors" />
          ))}
        </div>

        {/* Group 2 — Coffee shop competitive dynamics */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Network size={16} className="text-ursa-gold-text" />
          {t("content.competitors.science.group.dynamics")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {COMP_DYNAMICS.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} group="competitors" />
          ))}
        </div>

        {/* Group 3 — Review and rating science */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Star size={16} className="text-ursa-gold-text" />
          {t("content.competitors.science.group.reviews")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
          {COMP_REVIEWS.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} group="competitors" />
          ))}
        </div>

        <Callout tone="gold" title={t("content.competitors.science.synthesis.title")}>
          {t("content.competitors.science.synthesis.body")}
        </Callout>
      </ViewSection>

      {/* Dossier link */}
      <ViewSection className="py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionBadge tone="forest">{t("content.competitors.section.dossier.badge")}</SectionBadge>
          <DossierLinkBanner moduleId="02-market-competitors-and-customer-voice" />
        </div>
      </ViewSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Science cards — research that backs the competitor intelligence dashboard.
// Strings live under content.competitors.science.card.{id}.{field} in i18n.ts.
// ---------------------------------------------------------------------------

type ScienceTone = "gold" | "forest" | "terracotta";

type ScienceEntry = {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone: ScienceTone;
};

const COMP_METHOD: ScienceEntry[] = [
  { id: "porter-1980", icon: BookOpen, tone: "forest" },
  { id: "fahey-randall-1997", icon: Microscope, tone: "gold" },
  { id: "reilly-1931", icon: MapPinned, tone: "forest" },
  { id: "osm-overpass", icon: Globe, tone: "gold" },
];

const COMP_DYNAMICS: ScienceEntry[] = [
  { id: "specialty-structure", icon: Network, tone: "gold" },
  { id: "independent-survival", icon: TrendingUp, tone: "terracotta" },
  { id: "cluster-effect", icon: Users, tone: "forest" },
];

const COMP_REVIEWS: ScienceEntry[] = [
  { id: "luca-2016", icon: Star, tone: "gold" },
  { id: "chevalier-mayzlin-2006", icon: TrendingUp, tone: "forest" },
  { id: "review-filtering", icon: Filter, tone: "terracotta" },
  { id: "platform-bias", icon: MessageSquare, tone: "terracotta" },
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
  group: "competitors";
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

/** Local coffee cup icon (avoids importing one we don't have). */
function Coffee({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 9 H16 V14 C16 17.3 13.3 20 10 20 C6.7 20 4 17.3 4 14 Z" fill="currentColor" opacity="0.85" />
      <path d="M16 10 H18 C19.7 10 21 11.3 21 13 C21 14.7 19.7 16 18 16 H16" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
  );
}
