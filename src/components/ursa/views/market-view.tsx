"use client";

import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import {
  BearMark,
  ArtNouveauDivider,
  Pill,
  Callout,
  StatBlock,
  SectionBadge,
  EvidenceTag,
} from "../ursa-brand";
import {
  COMPETITORS,
  CUSTOMER_VOICE,
  CUSTOMER_REVIEWS,
  REVIEW_AGGREGATE_RATINGS,
  REVIEW_RESEARCH_LOG,
  URSA_FACTS,
  CENSUS_META,
} from "@/lib/ursa-data";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Compass,
  Globe,
  MapPin,
  Award,
  GraduationCap,
  Layers,
  Coffee,
  Star,
  AlertTriangle,
  ShieldCheck,
  Lightbulb,
  Wrench,
  Megaphone,
  ArrowRight,
  Swords,
  Frown,
  ThumbsUp,
  TrendingUp,
  Quote,
  ExternalLink,
  Search,
  Info,
  MapPinned,
  CheckCircle2,
  CircleSlash,
  Ruler,
  Building2,
  Network,
} from "lucide-react";

type Competitor = (typeof COMPETITORS)[number];

/** Proximity tone for a competitor's distance band. */
const PROXIMITY_BANDS = ["same-street", "nearby", "within-1km", "out-of-area-lima-wide"] as const;
type ProximityBand = (typeof PROXIMITY_BANDS)[number];

const PROXIMITY_TONE_CLASSES: Record<ProximityBand, { badge: string; dot: string; row: string }> = {
  "same-street": {
    badge: "bg-ursa-terracotta/12 text-ursa-terracotta-text border-ursa-terracotta/35",
    dot: "bg-ursa-terracotta",
    row: "border-l-2 border-l-ursa-terracotta/60",
  },
  nearby: {
    badge: "bg-ursa-gold/15 text-ursa-medium-roast border-ursa-gold/40",
    dot: "bg-ursa-gold",
    row: "border-l-2 border-l-ursa-gold/60",
  },
  "within-1km": {
    badge: "bg-ursa-forest-deep/10 text-ursa-forest-deep border-ursa-forest-deep/25",
    dot: "bg-ursa-forest-deep",
    row: "border-l-2 border-l-ursa-forest-deep/50",
  },
  "out-of-area-lima-wide": {
    badge: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground/60",
    row: "border-l-2 border-l-border opacity-90",
  },
};

/** Compact proximity badge. */
function ProximityBadge({ band, t }: { band: string; t: (key: string) => string }) {
  const safeBand = (PROXIMITY_BANDS.includes(band as ProximityBand)
    ? band
    : "within-1km") as ProximityBand;
  const cls = PROXIMITY_TONE_CLASSES[safeBand];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-label text-[0.58rem] tracking-[0.08em] uppercase px-1.5 py-0.5 rounded border",
        cls.badge,
      )}
      title={t(`content.market.proximity-desc.${safeBand}`)}
    >
      <span className={cn("w-1 h-1 rounded-full", cls.dot)} />
      {t(`content.market.proximity.${safeBand}`)}
    </span>
  );
}

/** Status pill — operating / uncertain. */
function StatusPill({ status, t }: { status: string; t: (key: string) => string }) {
  if (status === "uncertain") {
    return (
      <span className="inline-flex items-center gap-1 font-label text-[0.58rem] tracking-[0.08em] uppercase px-1.5 py-0.5 rounded bg-ursa-gold/15 text-ursa-medium-roast border border-ursa-gold/40">
        <CircleSlash size={9} /> {t("content.market.status.uncertain")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-label text-[0.58rem] tracking-[0.08em] uppercase px-1.5 py-0.5 rounded bg-ursa-forest-deep/10 text-ursa-forest-deep border border-ursa-forest-deep/25">
      <CheckCircle2 size={9} /> {t("content.market.status.operating")}
    </span>
  );
}

/** Rating cell — shows ★ rating + review count, or em-dash if null/undefined/invalid. */
function RatingCell({
  rating,
  count,
  t,
}: {
  rating: number | null | undefined;
  count: number | null | undefined;
  t: (key: string) => string;
}) {
  // Ultra-safe: coerce to number, validate, fallback gracefully
  const r = typeof rating === "number" ? rating : typeof rating === "string" ? parseFloat(rating) : NaN;
  const c = typeof count === "number" ? count : typeof count === "string" ? parseInt(count, 10) : NaN;
  const hasRating = isFinite(r) && !isNaN(r);
  const hasCount = isFinite(c) && !isNaN(c);
  if (!hasRating && !hasCount) return <span className="text-muted-foreground/60">—</span>;
  return (
    <div className="flex flex-col leading-tight">
      {hasRating ? (
        <span className="font-medium text-ursa-dark-roast flex items-center gap-0.5">
          <Star size={10} className="text-ursa-gold-text fill-ursa-gold" />
          {r.toFixed(1)}
        </span>
      ) : (
        <span className="text-muted-foreground/60 text-[0.78rem]">—</span>
      )}
      {hasCount ? (
        <span className="text-[0.66rem] text-muted-foreground tracking-[0.02em]">
          {c} {t("content.market.reviews-suffix")}
        </span>
      ) : null}
    </div>
  );
}

/** Distance formatter — meters or km. Safe for undefined/NaN. */
function formatDistance(m: number | undefined | null): string {
  if (m == null || typeof m !== "number" || !isFinite(m) || isNaN(m)) return "—";
  if (m < 1000) return `${m}m`;
  return `${(m / 1000).toFixed(1)}km`;
}

/** One competitor card. */
function CompetitorCard({
  c,
  t,
}: {
  c: (typeof COMPETITORS)[number];
  t: (key: string) => string;
}) {
  return (
    <Card className="flex flex-col gap-3 h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-ursa-dark-roast mt-0 mb-1">{c.name}</h3>
          <div className="flex items-center gap-1.5 text-[0.78rem] text-muted-foreground">
            <MapPin size={13} className="text-ursa-gold-text" />
            <span className="font-label tracking-[0.06em] uppercase">{c.area}</span>
          </div>
        </div>
        <Pill tone={c.hasWebsite ? "ok" : "stop"}>
          <Globe size={11} /> {c.hasWebsite ? t("content.market.website.yes") : t("content.market.website.no")}
        </Pill>
      </div>
      <ArtNouveauDivider className="my-1" />
      <div className="space-y-2.5 text-[0.9rem]">
        <div>
          <div className="flex items-center gap-1.5 font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-forest-deep mb-0.5">
            <ThumbsUp size={11} /> {t("content.market.competitor.strength")}
          </div>
          <p className="m-0 text-foreground/85">{t(`content.competitors.data.${c.name}.strength`)}</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-terracotta-text mb-0.5">
            <Frown size={11} /> {t("content.market.competitor.weakness")}
          </div>
          <p className="m-0 text-foreground/85">{t(`content.competitors.data.${c.name}.weakness`)}</p>
        </div>
        <div className="bg-ursa-dark-roast/5 border border-ursa-forest-deep/15 rounded-md px-3 py-2">
          <div className="flex items-center gap-1.5 font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-forest-deep mb-0.5">
            <Compass size={11} /> {t("content.market.competitor.ursa-implication")}
          </div>
          <p className="m-0 text-ursa-dark-roast font-medium">{t(`content.competitors.data.${c.name}.ursaImplication`)}</p>
        </div>
      </div>
    </Card>
  );
}

/** Conversion-to-action card. */
function ActionCard({
  icon,
  title,
  tone,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  tone: "gold" | "forest" | "terracotta";
  items: string[];
}) {
  const toneMap = {
    gold: { text: "text-ursa-gold-text", bg: "bg-ursa-gold/10", border: "border-ursa-gold/40" },
    forest: { text: "text-ursa-forest-deep", bg: "bg-ursa-dark-roast/8", border: "border-ursa-forest-deep/25" },
    terracotta: { text: "text-ursa-terracotta-text", bg: "bg-ursa-terracotta/10", border: "border-ursa-terracotta/30" },
  }[tone];
  return (
    <Card className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2.5">
        <span className={`flex items-center justify-center w-9 h-9 rounded-lg ${toneMap.bg} ${toneMap.text} border ${toneMap.border}`}>
          {icon}
        </span>
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-0">{title}</h3>
      </div>
      <ul className="space-y-1.5 m-0 p-0 list-none text-[0.88rem]">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 leading-snug">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${toneMap.text}`} style={{ backgroundColor: "currentColor" }} />
            <span className="text-foreground/85">{it}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function MarketView() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const inCatchment = COMPETITORS.filter(
    (c) => c.distanceBand !== "out-of-area-lima-wide",
  ).length;
  const operating = COMPETITORS.filter((c) => c.status === "operating").length;
  const uncertain = COMPETITORS.filter((c) => c.status === "uncertain").length;
  const sameStreet = COMPETITORS.filter((c) => c.distanceBand === "same-street").length;
  const withWebsite = COMPETITORS.filter((c) => c.hasWebsite).length;

  // Sorted by distance for the census table — nearest first.
  const censusSorted = [...COMPETITORS].sort(
    (a, b) => (a.distanceMeters ?? 9999) - (b.distanceMeters ?? 9999),
  );

  const ownableSpaces = [
    { id: "punto", name: "Punto Café", icon: <Award size={14} /> },
    { id: "neira", name: "Neira Café Lab", icon: <Layers size={14} /> },
    { id: "bisetti", name: "Bisetti", icon: <GraduationCap size={14} /> },
    { id: "puku-puku", name: "Puku Puku", icon: <Coffee size={14} /> },
    { id: "terrua", name: "Terrua", icon: <Star size={14} /> },
    {
      id: "ursa",
      name: "Ursa",
      icon: <BearMark size={14} className="text-ursa-dark-roast" />,
      ursa: true,
    },
  ];

  const conversionCards: {
    icon: React.ReactNode;
    title: string;
    tone: "gold" | "forest" | "terracotta";
    items: string[];
  }[] = [
    {
      icon: <ShieldCheck size={16} />,
      title: t("content.market.conversion.standards.title"),
      tone: "gold",
      items: [
        t("content.market.conversion.standards.item-1"),
        t("content.market.conversion.standards.item-2"),
        t("content.market.conversion.standards.item-3"),
        t("content.market.conversion.standards.item-4"),
      ],
    },
    {
      icon: <AlertTriangle size={16} />,
      title: t("content.market.conversion.problems.title"),
      tone: "terracotta",
      items: [
        t("content.market.conversion.problems.item-1"),
        t("content.market.conversion.problems.item-2"),
        t("content.market.conversion.problems.item-3"),
        t("content.market.conversion.problems.item-4"),
        t("content.market.conversion.problems.item-5"),
      ],
    },
    {
      icon: <TrendingUp size={16} />,
      title: t("content.market.conversion.lead.title"),
      tone: "forest",
      items: [
        t("content.market.conversion.lead.item-1"),
        t("content.market.conversion.lead.item-2"),
        t("content.market.conversion.lead.item-3"),
        t("content.market.conversion.lead.item-4"),
        t("content.market.conversion.lead.item-5"),
      ],
    },
    {
      icon: <Wrench size={16} />,
      title: t("content.market.conversion.experience.title"),
      tone: "gold",
      items: [
        t("content.market.conversion.experience.item-1"),
        t("content.market.conversion.experience.item-2"),
        t("content.market.conversion.experience.item-3"),
        t("content.market.conversion.experience.item-4"),
        t("content.market.conversion.experience.item-5"),
      ],
    },
    {
      icon: <Lightbulb size={16} />,
      title: t("content.market.conversion.product.title"),
      tone: "forest",
      items: [
        t("content.market.conversion.product.item-1"),
        t("content.market.conversion.product.item-2"),
        t("content.market.conversion.product.item-3"),
        t("content.market.conversion.product.item-4"),
        t("content.market.conversion.product.item-5"),
      ],
    },
    {
      icon: <Megaphone size={16} />,
      title: t("content.market.conversion.marketing.title"),
      tone: "terracotta",
      items: [
        t("content.market.conversion.marketing.item-1"),
        t("content.market.conversion.marketing.item-2"),
        t("content.market.conversion.marketing.item-3"),
        t("content.market.conversion.marketing.item-4"),
        t("content.market.conversion.marketing.item-5"),
      ],
    },
  ];

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.market.eyebrow")}
        title={<>{t("content.view.market.title")}</>}
        lede={t("content.market.hero.lede")}
        meta={[
          {
            label: t("content.market.hero.meta.census"),
            value: `${CENSUS_META.censusId} · ${COMPETITORS.length} ${t("content.market.hero.meta.competitors")}`,
          },
          {
            label: t("content.market.hero.meta.scope"),
            value: `${CENSUS_META.totals.inCatchment} ${t("content.market.hero.meta.in-catchment")} + ${CENSUS_META.totals.outOfAreaBenchmarks} ${t("content.market.hero.meta.benchmarks")}`,
          },
          { label: t("common.snapshot"), value: URSA_FACTS.snapshot },
        ]}
      />

      {/* At-a-glance stats */}
      <ViewSection className="py-8">
        <Grid cols={4}>
          <StatBlock value={`${COMPETITORS.length}`} label={t("content.market.stat.competitors")} tone="forest" />
          <StatBlock value={`${inCatchment}`} label={t("content.market.stat.catchment")} tone="gold" />
          <StatBlock
            value={`${operating}·${uncertain}`}
            label={t("content.market.stat.operating-uncertain")}
            tone="terracotta"
          />
          <StatBlock value={`${sameStreet}`} label={t("content.market.stat.same-street")} tone="forest" />
        </Grid>
      </ViewSection>

      {/* 1km Competitor Census */}
      <ViewSection
        badge={t("content.market.section.census.badge")}
        title={t("content.market.section.census.title")}
        meta={t("content.market.section.census.meta")}
      >
        <p className="text-[0.97rem] leading-relaxed text-foreground/85 max-w-[68ch] mb-5">
          {t("content.market.section.census.intro")}
        </p>

        {/* Summary stats grid */}
        <Grid cols={4}>
          <StatBlock value={`${CENSUS_META.totals.inCensus}`} label={t("content.market.section.census.summary.discovered")} tone="forest" />
          <StatBlock value={`${CENSUS_META.totals.operating}`} label={t("content.market.section.census.summary.operating")} tone="gold" />
          <StatBlock value={`${CENSUS_META.totals.uncertain}`} label={t("content.market.section.census.summary.uncertain")} tone="terracotta" />
          <StatBlock value={`${CENSUS_META.totals.directCompetitors}`} label={t("content.market.section.census.summary.direct")} tone="forest" />
        </Grid>

        {/* Census table */}
        <Card className="mt-6 p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-ursa-line-soft bg-ursa-foam flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <MapPinned size={15} className="text-ursa-gold-text" />
              <h3 className="font-display text-base font-semibold text-ursa-dark-roast m-0">
                {t("content.market.section.census.table.title")}
              </h3>
            </div>
            <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">
              {COMPETITORS.length} {t("content.market.hero.meta.competitors")} · {CENSUS_META.gridStreets.length} {t("content.market.section.census.table.streets")}
            </span>
          </div>
          <Table className="text-[0.82rem]">
            <TableHeader>
              <TableRow className="border-ursa-line-soft hover:bg-transparent">
                <TableHead className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground h-9 py-2">{t("content.market.section.census.col.competitor")}</TableHead>
                <TableHead className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground h-9 py-2 hidden md:table-cell">{t("content.market.section.census.col.address")}</TableHead>
                <TableHead className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground h-9 py-2">{t("content.market.section.census.col.distance")}</TableHead>
                <TableHead className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground h-9 py-2 hidden lg:table-cell">{t("content.market.section.census.col.type")}</TableHead>
                <TableHead className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground h-9 py-2">{t("content.market.section.census.col.google")}</TableHead>
                <TableHead className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground h-9 py-2">{t("content.market.section.census.col.tripadvisor")}</TableHead>
                <TableHead className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground h-9 py-2">{t("content.market.section.census.col.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {censusSorted.map((c) => {
                const safeBand = (PROXIMITY_BANDS.includes(c.distanceBand as ProximityBand)
                  ? c.distanceBand
                  : "within-1km") as ProximityBand;
                const cls = PROXIMITY_TONE_CLASSES[safeBand];
                return (
                  <TableRow
                    key={c.id}
                    className={cn("border-ursa-line-soft hover:bg-ursa-foam/60", cls.row)}
                  >
                    <TableCell className="py-2.5 pr-3 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="font-display font-semibold text-ursa-dark-roast leading-tight">{c.name}</span>
                        <ProximityBadge band={c.distanceBand} t={t} />
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5 pr-3 align-top hidden md:table-cell">
                      <div className="flex items-start gap-1.5 text-muted-foreground">
                        <MapPin size={11} className="text-ursa-gold-text mt-0.5 shrink-0" />
                        <span className="leading-snug">{c.address}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5 pr-3 align-top">
                      <div className="flex items-center gap-1 text-ursa-dark-roast font-medium">
                        <Ruler size={11} className="text-muted-foreground" />
                        {formatDistance(c.distanceMeters)}
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5 pr-3 align-top hidden lg:table-cell">
                      <span className="text-muted-foreground leading-snug">{c.type}</span>
                    </TableCell>
                    <TableCell className="py-2.5 pr-3 align-top">
                      <RatingCell rating={c.googleRating} count={c.googleReviewCount} t={t} />
                    </TableCell>
                    <TableCell className="py-2.5 pr-3 align-top">
                      <RatingCell rating={c.tripAdvisorRating} count={c.tripAdvisorReviewCount} t={t} />
                    </TableCell>
                    <TableCell className="py-2.5 pr-3 align-top">
                      <StatusPill status={c.status} t={t} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        {/* Coverage methodology callout */}
        <div className="mt-6">
        <Callout tone="forest" title={t("content.market.section.census.coverage.title")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-3">
            <div>
              <div className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-ursa-forest-deep mb-1 flex items-center gap-1.5">
                <Network size={11} /> {t("content.market.section.census.coverage.study-area-label")}
              </div>
              <p className="m-0 text-[0.88rem] text-foreground/85 leading-snug">{t("content.market.section.census.coverage.study-area")}</p>
            </div>
            <div>
              <div className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-ursa-forest-deep mb-1 flex items-center gap-1.5">
                <MapPinned size={11} /> {t("content.market.section.census.coverage.grid-label")}
              </div>
              <p className="m-0 text-[0.88rem] text-foreground/85 leading-snug">{t("content.market.section.census.coverage.grid")}</p>
            </div>
            <div>
              <div className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-ursa-forest-deep mb-1 flex items-center gap-1.5">
                <Building2 size={11} /> {t("content.market.section.census.coverage.streets-label")} ({CENSUS_META.gridStreets.length})
              </div>
              <ul className="m-0 p-0 list-none flex flex-wrap gap-x-3 gap-y-0.5 text-[0.8rem] text-foreground/80">
                {CENSUS_META.gridStreets.map((s) => (
                  <li key={s} className="leading-snug">· {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-ursa-forest-deep mb-1 flex items-center gap-1.5">
                <Info size={11} /> {t("content.market.section.census.coverage.inclusion-label")}
              </div>
              <p className="m-0 text-[0.88rem] text-foreground/85 leading-snug">{t("content.market.section.census.coverage.inclusion")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {[
              { label: t("content.market.section.census.coverage.stat.discovered"), value: CENSUS_META.totals.inCensus, tone: "forest" },
              { label: t("content.market.section.census.coverage.stat.in-catchment"), value: CENSUS_META.totals.inCatchment, tone: "gold" },
              { label: t("content.market.section.census.coverage.stat.operating"), value: CENSUS_META.totals.operating, tone: "forest" },
              { label: t("content.market.section.census.coverage.stat.uncertain-closed"), value: `${CENSUS_META.totals.uncertain} / ${CENSUS_META.totals.closed}`, tone: "terracotta" },
            ].map((s) => (
              <div key={s.label} className="bg-ursa-paper border border-ursa-line-soft rounded-md px-3 py-2 text-center">
                <div className="font-display text-lg font-semibold text-ursa-dark-roast leading-none">{s.value}</div>
                <div className="font-label text-[0.58rem] tracking-[0.1em] uppercase text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="mb-2 text-[0.86rem] leading-snug text-foreground/85">
            <strong className="text-ursa-dark-roast">{t("content.market.section.census.coverage.anchor-label")}</strong>{" "}
            {t("content.market.section.census.coverage.anchor-body", {
              nearestConfirmed: CENSUS_META.nearestConfirmed,
              nearestUncertain: CENSUS_META.nearestUncertain,
              highestVolume: CENSUS_META.highestVolume,
              highestRated: CENSUS_META.highestRatedOperating,
              awardInCatchment: CENSUS_META.awardLeaderInCatchment,
              awardLimaWide: CENSUS_META.awardLeaderLimaWide,
            })}
          </p>
          <details className="bg-ursa-paper border border-ursa-line-soft rounded-md px-3 py-2">
            <summary className="cursor-pointer font-label text-[0.7rem] tracking-[0.1em] uppercase text-ursa-forest-deep hover:text-ursa-dark-roast">
              {t("content.market.section.census.coverage.methodology-toggle")}
            </summary>
            <div className="mt-2 space-y-2">
              <p className="m-0 text-[0.82rem] leading-snug text-foreground/80">{CENSUS_META.methodology}</p>
              <div className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.market.section.census.coverage.next-steps-label")}</div>
              <ul className="m-0 p-0 list-none space-y-1 text-[0.82rem] text-foreground/80">
                {CENSUS_META.nextSteps.map((step, i) => (
                  <li key={i} className="flex gap-1.5 leading-snug">
                    <span className="text-ursa-terracotta-text shrink-0">·</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <p className="m-0 text-[0.74rem] italic text-muted-foreground">
                {t("content.market.section.census.coverage.full-census-prefix")} <code className="text-[0.7rem]">/research/competitor-census.json</code>
              </p>
            </div>
          </details>
        </Callout>
        </div>
      </ViewSection>

      {/* Competitor landscape */}
      <ViewSection
        badge={t("content.market.section.landscape.badge")}
        title={t("content.market.section.landscape.title")}
        meta={t("content.market.section.landscape.meta")}
      >
        <p className="text-[0.97rem] leading-relaxed text-foreground/85 max-w-[68ch] mb-6">
          {t("content.market.section.landscape.intro")}
        </p>
        <Grid cols={3}>
          {COMPETITORS.map((c) => (
            <CompetitorCard key={c.name} c={c} t={t} />
          ))}
        </Grid>
      </ViewSection>

      {/* Ownable space analysis */}
      <ViewSection
        badge={t("content.market.section.ownable.badge")}
        title={t("content.market.section.ownable.title")}
        meta={t("content.market.section.ownable.meta")}
      >
        <Grid cols={2}>
          <div className="space-y-4">
            <p className="text-[0.97rem] leading-relaxed text-foreground/85">
              {t("content.market.section.ownable.intro")}
            </p>
            <Callout tone="forest" title={t("content.market.section.ownable.ortho-title")}>
              {t("content.market.section.ownable.ortho-body")}
            </Callout>
            <p className="text-[0.92rem] leading-relaxed text-muted-foreground">
              {t("content.market.section.ownable.rule")}
            </p>
          </div>
          <Card highlight className="bg-ursa-foam">
            <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-4 flex items-center gap-2">
              <Swords size={18} className="text-ursa-gold-text" /> {t("content.market.section.ownable.card-title")}
            </h3>
            <ul className="space-y-2.5 m-0 p-0 list-none">
              {ownableSpaces.map((s) => (
                <li
                  key={s.id}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-md border ${
                    s.ursa
                      ? "border-ursa-gold bg-ursa-gold/12 shadow-[0_0_0_3px_rgba(184,146,74,0.12)]"
                      : "border-ursa-line-soft bg-ursa-paper"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`flex items-center justify-center w-7 h-7 rounded-full ${s.ursa ? "bg-ursa-gold text-ursa-dark-roast" : "bg-ursa-dark-roast/10 text-ursa-forest-deep"}`}>
                      {s.icon}
                    </span>
                    <span className="font-medium text-ursa-dark-roast text-[0.95rem]">{s.name}</span>
                  </div>
                  <span className={`font-label text-[0.72rem] tracking-[0.1em] uppercase ${s.ursa ? "text-ursa-gold-text font-semibold" : "text-muted-foreground"}`}>
                    {t(`content.market.ownable.${s.id}`)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-label text-[0.7rem] tracking-[0.1em] uppercase text-muted-foreground mt-4 mb-0">
              {t("content.market.section.ownable.card-footnote")}
            </p>
          </Card>
        </Grid>
      </ViewSection>

      {/* Customer voice */}
      <ViewSection
        badge={t("content.market.section.voice.badge")}
        title={t("content.market.section.voice.title")}
        meta={t("content.market.section.voice.meta")}
      >
        <Callout tone="warn" title={t("content.market.section.voice.methodology-title")}>
          <p className="mb-3">
            {t("content.market.section.voice.methodology-intro")}
          </p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-3 m-0">
            <div>
              <dt className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-forest-deep mb-0.5">{t("content.market.section.voice.field.boundary")}</dt>
              <dd className="m-0 text-ursa-dark-roast text-[0.92rem]">{t("content.market.section.voice.field.boundary-value")}</dd>
            </div>
            <div>
              <dt className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-forest-deep mb-0.5">{t("content.market.section.voice.field.platforms")}</dt>
              <dd className="m-0 text-ursa-dark-roast text-[0.92rem]">{t("content.market.section.voice.field.platforms-value")}</dd>
            </div>
            <div>
              <dt className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-forest-deep mb-0.5">{t("content.market.section.voice.field.period")}</dt>
              <dd className="m-0 text-ursa-dark-roast text-[0.92rem]">{t("content.market.section.voice.field.period-value")}</dd>
            </div>
            <div>
              <dt className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-forest-deep mb-0.5">{t("content.market.section.voice.field.sample")}</dt>
              <dd className="m-0 text-ursa-dark-roast text-[0.92rem]">{t("content.market.section.voice.field.sample-value")}</dd>
            </div>
            <div>
              <dt className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-forest-deep mb-0.5">{t("content.market.section.voice.field.inclusion")}</dt>
              <dd className="m-0 text-ursa-dark-roast text-[0.92rem]">{t("content.market.section.voice.field.inclusion-value")}</dd>
            </div>
            <div>
              <dt className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-forest-deep mb-0.5">{t("content.market.section.voice.field.coding")}</dt>
              <dd className="m-0 text-ursa-dark-roast text-[0.92rem]">{t("content.market.section.voice.field.coding-value")}</dd>
            </div>
          </dl>
          <p className="mb-0">
            <strong className="text-ursa-dark-roast">{t("content.market.section.voice.limitation-label")}</strong>{" "}
            {t("content.market.section.voice.limitation-body")}
          </p>
        </Callout>

        {/* Real customer reviews sample */}
        <Card className="mb-6 border-ursa-gold/35 bg-ursa-foam">
          <div className="flex items-start gap-3 mb-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-ursa-gold/15 text-ursa-medium-roast border border-ursa-gold/40 shrink-0">
              <Search size={16} />
            </span>
            <div className="min-w-0">
              <div className="font-label text-[0.62rem] tracking-[0.16em] uppercase text-muted-foreground">
                {t("content.market.section.voice.review-sample.eyebrow")}
              </div>
              <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-1">
                {t("content.market.section.voice.review-sample.title")}
              </h3>
              <p className="m-0 text-[0.88rem] leading-relaxed text-foreground/85">
                {t("content.market.section.voice.review-sample.intro", {
                  platforms: REVIEW_RESEARCH_LOG.platformsChecked.length.toString(),
                  date: REVIEW_RESEARCH_LOG.observationDate,
                  real: REVIEW_RESEARCH_LOG.realReviewsFound.toString(),
                  aggregate: REVIEW_RESEARCH_LOG.aggregateRatingsFound.toString(),
                })}
              </p>
            </div>
          </div>

          {/* Aggregate ratings row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {REVIEW_AGGREGATE_RATINGS.map((r) => (
              <div
                key={r.platform}
                className="bg-ursa-paper border border-ursa-line-soft rounded-md px-3 py-2 text-center"
              >
                <div className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-muted-foreground mb-0.5">
                  {r.platform}
                </div>
                <div className="font-display text-lg font-semibold text-ursa-dark-roast leading-none">
                  {r.rating != null && typeof r.rating === "number" ? `${r.rating}★` : "—"}
                </div>
                <div className="font-label text-[0.66rem] tracking-[0.04em] text-ursa-gold-text mt-0.5">
                  {r.reviewCount} {t("content.market.reviews-suffix")}
                </div>
              </div>
            ))}
          </div>

          {/* Important correction callout */}
          <div className="bg-ursa-gold/10 border border-ursa-gold/35 rounded-md px-3 py-2 mb-3 flex items-start gap-2">
            <Info size={14} className="text-ursa-medium-roast shrink-0 mt-0.5" />
            <p className="m-0 text-[0.82rem] leading-snug text-ursa-dark-roast">
              {t("content.market.section.voice.review-sample.correction")}
            </p>
          </div>

          {/* Methodology note */}
          <details className="bg-ursa-paper border border-ursa-line-soft rounded-md px-3 py-2 mb-3">
            <summary className="cursor-pointer font-label text-[0.7rem] tracking-[0.1em] uppercase text-ursa-forest-deep hover:text-ursa-dark-roast">
              {t("content.market.section.voice.review-sample.platforms-toggle")} ({REVIEW_RESEARCH_LOG.platformsChecked.length})
            </summary>
            <div className="mt-2 space-y-2">
              <div>
                <div className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground mb-1">
                  {t("content.market.section.voice.review-sample.platforms-label")}
                </div>
                <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-[0.78rem] text-foreground/80">
                  {REVIEW_RESEARCH_LOG.platformsChecked.map((p) => (
                    <li key={p} className="leading-snug">· {p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground mb-1">
                  {t("content.market.section.voice.review-sample.methodology-label")}
                </div>
                <p className="m-0 text-[0.82rem] leading-snug text-foreground/80">
                  {REVIEW_RESEARCH_LOG.methodology}
                </p>
              </div>
              <div>
                <div className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground mb-1">
                  {t("content.market.section.voice.review-sample.limitations-label")}
                </div>
                <ul className="m-0 p-0 list-none space-y-1 text-[0.82rem] text-foreground/80">
                  {REVIEW_RESEARCH_LOG.limitations.map((l, i) => (
                    <li key={i} className="flex gap-1.5 leading-snug">
                      <span className="text-ursa-terracotta-text shrink-0">·</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>
        </Card>

        {/* Real review cards */}
        <Grid cols={2}>
          {CUSTOMER_REVIEWS.map((r) => (
            <Card key={r.source} className="flex flex-col gap-2.5 h-full">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Pill tone={r.sentiment === "positive" ? "ok" : r.sentiment === "mixed" ? "warn" : "stop"}>
                      {r.platform}
                    </Pill>
                    <span className="font-label text-[0.6rem] tracking-[0.1em] uppercase text-muted-foreground">
                      {r.date}
                    </span>
                  </div>
                  <div className="font-medium text-[0.82rem] text-ursa-dark-roast truncate">{r.author}</div>
                </div>
                <span
                  className={`flex items-center justify-center w-7 h-7 rounded-md shrink-0 ${
                    r.sentiment === "positive"
                      ? "bg-ursa-dark-roast/10 text-ursa-forest-deep"
                      : r.sentiment === "mixed"
                        ? "bg-ursa-gold/15 text-ursa-medium-roast"
                        : "bg-ursa-terracotta/10 text-ursa-terracotta-text"
                  }`}
                  title={r.sentiment}
                >
                  {r.sentiment === "positive" ? <ThumbsUp size={13} /> : r.sentiment === "mixed" ? <AlertTriangle size={13} /> : <Frown size={13} />}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-label text-[0.58rem] tracking-[0.1em] uppercase text-ursa-gold-text bg-ursa-gold/10 border border-ursa-gold/25 rounded px-1.5 py-0.5">
                  <Star size={9} className="inline mr-1" /> {r.theme}
                </span>
              </div>
              <div className="relative bg-ursa-paper border border-ursa-line-soft rounded-md px-3 py-2.5 text-[0.86rem] leading-relaxed text-foreground/90 flex gap-2">
                <Quote size={14} className="text-ursa-gold-text shrink-0 mt-0.5" />
                <p className="m-0">{r.text}</p>
              </div>
              {r.notes && (
                <p className="m-0 text-[0.74rem] leading-snug text-muted-foreground italic">
                  {r.notes}
                </p>
              )}
              <a
                href={r.source}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1 text-[0.74rem] text-ursa-forest-deep hover:text-ursa-dark-roast hover:underline self-start"
              >
                <ExternalLink size={11} /> {t("content.market.section.voice.review-sample.source-link")}
              </a>
            </Card>
          ))}
        </Grid>

        {/* Spacer before illustrative themes */}
        <div className="mt-8 mb-2 flex items-center gap-3">
          <div className="h-px flex-1 bg-ursa-line-soft" />
          <span className="font-label text-[0.62rem] tracking-[0.16em] uppercase text-muted-foreground">
            {t("content.market.section.voice.themes-divider")}
          </span>
          <div className="h-px flex-1 bg-ursa-line-soft" />
        </div>

        <Grid cols={2}>
          {CUSTOMER_VOICE.map((theme, i) => {
            const tones = [
              { icon: <ThumbsUp size={15} />, tone: "forest" as const, label: t("content.market.section.voice.theme-label.value") },
              { icon: <Frown size={15} />, tone: "terracotta" as const, label: t("content.market.section.voice.theme-label.pain") },
              { icon: <AlertTriangle size={15} />, tone: "gold" as const, label: t("content.market.section.voice.theme-label.friction") },
              { icon: <TrendingUp size={15} />, tone: "forest" as const, label: t("content.market.section.voice.theme-label.lead") },
              { icon: <Coffee size={15} />, tone: "gold" as const, label: t("content.market.section.voice.theme-label.evidence") },
            ][i % 5];
            return (
              <Card key={theme.theme} className="flex flex-col gap-3 h-full">
                <div className="flex items-center gap-2.5">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                    tones.tone === "forest"
                      ? "bg-ursa-dark-roast/10 text-ursa-forest-deep"
                      : tones.tone === "terracotta"
                        ? "bg-ursa-terracotta/10 text-ursa-terracotta-text"
                        : "bg-ursa-gold/15 text-ursa-medium-roast"
                  }`}>
                    {tones.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="font-label text-[0.62rem] tracking-[0.16em] uppercase text-muted-foreground">
                      {t("content.market.section.voice.theme-label.theme")} {String(i + 1).padStart(2, "0")} · {tones.label}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-0">{theme.theme}</h3>
                  </div>
                </div>
                <ul className="space-y-2.5 m-0 p-0 list-none text-[0.9rem]">
                  {theme.points.map((p, pi) => (
                    <li key={pi} className="flex flex-col gap-1 leading-snug">
                      <div className="flex gap-2.5">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ursa-gold shrink-0" />
                        <span className="text-foreground/85">{p.text}</span>
                      </div>
                      {p.evidence && (
                        <div className="ml-4 pl-2 border-l border-ursa-line-soft text-[0.8rem] text-muted-foreground italic leading-snug">
                          <span className="font-label not-italic text-[0.58rem] tracking-[0.12em] uppercase text-ursa-gold-text mr-1">{t("content.market.section.voice.evidence-prefix")}</span>
                          {p.evidence}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                {theme.sampleNote && (
                  <p className="mt-auto pt-2 border-t border-ursa-line-soft text-[0.74rem] leading-snug text-muted-foreground italic m-0">
                    <span className="font-label not-italic text-[0.58rem] tracking-[0.12em] uppercase text-ursa-forest-deep mr-1">{t("content.market.section.voice.sample-prefix")}</span>
                    {theme.sampleNote}
                  </p>
                )}
              </Card>
            );
          })}
        </Grid>
      </ViewSection>

      {/* Conversion to action */}
      <ViewSection
        badge={t("content.market.section.conversion.badge")}
        title={t("content.market.section.conversion.title")}
        meta={t("content.market.section.conversion.meta")}
      >
        <p className="text-[0.97rem] leading-relaxed text-foreground/85 max-w-[68ch] mb-6">
          {t("content.market.section.conversion.intro")}
        </p>
        <Grid cols={3}>
          {conversionCards.map((c) => (
            <ActionCard key={c.title} icon={c.icon} title={c.title} tone={c.tone} items={c.items} />
          ))}
        </Grid>
      </ViewSection>

      {/* Market research methodology — the evidence base */}
      <ViewSection
        badge={t("content.market.science.badge")}
        title={t("content.market.science.title")}
        meta={t("content.market.science.meta")}
      >
        <p className="text-[0.97rem] leading-relaxed text-muted-foreground max-w-[68ch] mb-6">
          {t("content.market.science.intro")}
        </p>
        <Grid cols={3}>
          {/* 1km census — retail-geography foundations */}
          <Card className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <MapPinned size={18} className="text-ursa-gold-text" />
              <Pill tone="gold">{t("content.market.science.census.heading")}</Pill>
            </div>
            <p className="text-[0.86rem] text-muted-foreground m-0 leading-relaxed mb-3">
              {t("content.market.science.census.body")}
            </p>
            <div className="mt-auto space-y-3">
              <div className="pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-forest-deep mb-1 flex items-center gap-1">
                  <Globe size={11} /> {t("content.market.science.census.osm-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t("content.market.science.census.osm-body")}
                </p>
              </div>
              <div className="pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-terracotta-text mb-1 flex items-center gap-1">
                  <Network size={11} /> {t("content.market.science.census.ethno-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t("content.market.science.census.ethno-body")}
                </p>
              </div>
            </div>
          </Card>

          {/* Customer review analysis */}
          <Card className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Quote size={18} className="text-ursa-gold-text" />
              <Pill tone="forest">{t("content.market.science.reviews.heading")}</Pill>
            </div>
            <p className="text-[0.86rem] text-muted-foreground m-0 leading-relaxed mb-3">
              {t("content.market.science.reviews.body")}
            </p>
            <div className="mt-auto space-y-3">
              <div className="pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-gold-text mb-1 flex items-center gap-1">
                  <AlertTriangle size={11} /> {t("content.market.science.reviews.bias-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t("content.market.science.reviews.bias-body")}
                </p>
              </div>
              <div className="pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-terracotta-text mb-1 flex items-center gap-1">
                  <CircleSlash size={11} /> {t("content.market.science.reviews.fake-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t("content.market.science.reviews.fake-body")}
                </p>
              </div>
              <div className="pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-forest-deep mb-1 flex items-center gap-1">
                  <CheckCircle2 size={11} /> {t("content.market.science.reviews.reliability-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t("content.market.science.reviews.reliability-body")}
                </p>
              </div>
            </div>
          </Card>

          {/* Local search and discovery */}
          <Card className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Search size={18} className="text-ursa-gold-text" />
              <Pill tone="gold">{t("content.market.science.local-search.heading")}</Pill>
            </div>
            <p className="text-[0.86rem] text-muted-foreground m-0 leading-relaxed mb-3">
              {t("content.market.science.local-search.body")}
            </p>
            <div className="mt-auto space-y-3">
              <div className="pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-forest-deep mb-1 flex items-center gap-1">
                  <MapPin size={11} /> {t("content.market.science.local-search.gbp-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t("content.market.science.local-search.gbp-body")}
                </p>
              </div>
              <div className="pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-gold-text mb-1 flex items-center gap-1">
                  <TrendingUp size={11} /> {t("content.market.science.local-search.nearme-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t("content.market.science.local-search.nearme-body")}
                </p>
              </div>
              <div className="pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-terracotta-text mb-1 flex items-center gap-1">
                  <Star size={11} /> {t("content.market.science.local-search.volume-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t("content.market.science.local-search.volume-body")}
                </p>
              </div>
            </div>
          </Card>
        </Grid>

        <Callout tone="forest" title={t("content.market.science.callout-title")}>
          {t("content.market.science.callout-body")}
        </Callout>
      </ViewSection>

      {/* The website gap */}
      <ViewSection
        badge={t("content.market.section.website-gap.badge")}
        title={t("content.market.section.website-gap.title", { count: withWebsite })}
        meta={t("content.market.section.website-gap.meta")}
      >
        <Callout tone="stop" title={t("content.market.section.website-gap.callout-title")}>
          <p className="mb-3">
            {t("content.market.section.website-gap.callout-body", {
              withWebsite: withWebsite.toString(),
              total: COMPETITORS.length.toString(),
            })}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 my-4">
            {["Punto Café", "Neira Café Lab", "Terrua", "Cate Tasting Room", "True Artisan Cafe"].map((n) => (
              <div key={n} className="flex items-center gap-1.5 bg-ursa-paper border border-ursa-line-soft rounded-md px-2.5 py-2">
                <Globe size={13} className="text-ursa-forest-deep" />
                <span className="text-[0.78rem] font-medium text-ursa-dark-roast">{n}</span>
              </div>
            ))}
          </div>
          <p className="mb-0">
            <strong className="text-ursa-dark-roast">{t("content.market.section.website-gap.priority-label")}</strong>{" "}
            {t("content.market.section.website-gap.priority-body")}
          </p>
        </Callout>
        <div className="flex flex-wrap items-center gap-3 mt-5">
          <button
            onClick={() => navigate("brand")}
            className="inline-flex items-center gap-2 bg-ursa-dark-roast text-ursa-cream font-label text-[0.74rem] tracking-[0.14em] uppercase px-4 py-2.5 rounded-md hover:bg-ursa-espresso transition"
          >
            <ArrowRight size={14} /> {t("content.market.section.website-gap.open-brand")}
          </button>
          <button
            onClick={() => navigate("competitors")}
            className="inline-flex items-center gap-2 border border-ursa-gold text-ursa-gold-text font-label text-[0.74rem] tracking-[0.14em] uppercase px-4 py-2.5 rounded-md hover:bg-ursa-gold hover:text-ursa-dark-roast transition"
          >
            <Swords size={14} /> {t("content.market.section.website-gap.open-dashboard")}
          </button>
        </div>
      </ViewSection>

      {/* Dossier link */}
      <ViewSection className="py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <EvidenceTag status="verified" />
            <span className="text-[0.85rem] text-muted-foreground">
              {t("content.market.section.dossier.body")}
            </span>
          </div>
          <DossierLinkBanner moduleId="02-market-competitors-and-customer-voice" />
        </div>
      </ViewSection>
    </>
  );
}
