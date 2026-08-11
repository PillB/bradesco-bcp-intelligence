"use client";

import type { ComponentType } from "react";
import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import {
  BearMark,
  ArtNouveauDivider,
  Pill,
  Callout,
  StatBlock,
  SectionBadge,
  EvidenceTag,
  ProgressBar,
} from "../ursa-brand";
import { ROADMAP, TWELVE_MONTH_ROADMAP, BUDGET_SCENARIOS } from "@/lib/ursa-data";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import {
  ArrowRight,
  Calendar,
  Trophy,
  Target,
  Crosshair,
  History,
  Shield,
  Banknote,
  Zap,
  Sparkles,
  Flag,
  Beaker,
  Coffee,
  Megaphone,
  Truck,
  Package,
  Store,
  Briefcase,
  CircleDot,
  BookOpen,
  Repeat,
  Scale,
  Compass,
  Microscope,
  AlertTriangle,
  Clock,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const PEN = (n: number) => `S/. ${n.toLocaleString("en-US")}`;

// ---- Phase metadata ----------------------------------------------------------
type PhaseMeta = {
  icon: React.ReactNode;
  tone: "terracotta" | "gold" | "forest";
  accentBorder: string;
  accentBg: string;
  dot: string;
};

const PHASE_META: PhaseMeta[] = [
  {
    icon: <Zap size={18} className="text-ursa-terracotta-text" />,
    tone: "terracotta",
    accentBorder: "border-ursa-terracotta/40",
    accentBg: "bg-ursa-terracotta/6",
    dot: "bg-ursa-terracotta",
  },
  {
    icon: <Calendar size={18} className="text-ursa-gold-text" />,
    tone: "gold",
    accentBorder: "border-ursa-gold/50",
    accentBg: "bg-ursa-gold/6",
    dot: "bg-ursa-gold",
  },
  {
    icon: <Target size={18} className="text-ursa-forest-deep" />,
    tone: "forest",
    accentBorder: "border-ursa-forest-deep/40",
    accentBg: "bg-ursa-dark-roast/6",
    dot: "bg-ursa-forest-deep",
  },
  {
    icon: <Trophy size={18} className="text-ursa-forest-deep" />,
    tone: "forest",
    accentBorder: "border-ursa-forest-deep/60",
    accentBg: "bg-ursa-dark-roast/8",
    dot: "bg-ursa-forest-deep",
  },
];

// ---- Owners & dependencies ---------------------------------------------------
type Owner = {
  icon: React.ReactNode;
};

const OWNERS: Owner[] = [
  { icon: <Shield size={16} className="text-ursa-gold-text" /> },
  { icon: <Megaphone size={16} className="text-ursa-gold-text" /> },
  { icon: <Crosshair size={16} className="text-ursa-gold-text" /> },
  { icon: <Sparkles size={16} className="text-ursa-gold-text" /> },
  { icon: <Truck size={16} className="text-ursa-gold-text" /> },
  { icon: <Store size={16} className="text-ursa-gold-text" /> },
  { icon: <Package size={16} className="text-ursa-gold-text" /> },
  { icon: <Briefcase size={16} className="text-ursa-gold-text" /> },
];

// ---- KPI dashboard -----------------------------------------------------------
type Kpi = {
  tone: "forest" | "gold" | "terracotta";
};

const KPIS: Kpi[] = [
  { tone: "forest" },
  { tone: "gold" },
  { tone: "terracotta" },
  { tone: "forest" },
  { tone: "gold" },
  { tone: "terracotta" },
];

// ---- Skeptical revision log --------------------------------------------------
type Revision = {
  tone: "gold" | "forest" | "terracotta";
};

const REVISIONS: Revision[] = [
  { tone: "gold" },
  { tone: "forest" },
  { tone: "terracotta" },
];

// ---- 12-month roadmap accent map ---------------------------------------------
const QUARTER_ACCENT: { tone: "forest" | "gold" | "terracotta"; dot: string }[] = [
  { tone: "forest", dot: "bg-ursa-forest-deep" },
  { tone: "gold", dot: "bg-ursa-gold" },
  { tone: "terracotta", dot: "bg-ursa-terracotta" },
  { tone: "forest", dot: "bg-ursa-forest-deep" },
];

// ---- Budget scenario tones ---------------------------------------------------
const BUDGET_TONES: { tone: "forest" | "gold" | "terracotta"; ring: string }[] = [
  { tone: "forest", ring: "border-ursa-forest-deep/40" },
  { tone: "gold", ring: "border-ursa-gold/50" },
  { tone: "terracotta", ring: "border-ursa-terracotta/40" },
];

// ---- Component ---------------------------------------------------------------
export function RoadmapView() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.roadmap.eyebrow")}
        tone="forest"
        title={<>{t("content.view.roadmap.title")}</>}
        lede={<>{t("content.roadmap.lede")}</>}
        meta={[
          { label: t("content.roadmap.meta.phasing.label"), value: t("content.roadmap.meta.phasing") },
          { label: t("content.roadmap.meta.horizon.label"), value: t("content.roadmap.meta.horizon") },
          { label: t("content.roadmap.meta.governance.label"), value: t("content.roadmap.meta.governance") },
        ]}
      />

      {/* Section 1 — First 72 hours ============================================ */}
      <ViewSection
        badge={t("content.roadmap.section.1.badge")}
        title={<>{t("content.roadmap.section.1.title")}</>}
        meta={ROADMAP[0].phase}
      >
        <PhasePhase phase={ROADMAP[0]} meta={PHASE_META[0]} index={0} t={t} />

        <Callout tone="stop" title={t("content.roadmap.section.1.callout.title")}>
          {t("content.roadmap.section.1.callout.body")}
        </Callout>
      </ViewSection>

      {/* Section 2 — 30-day plan =============================================== */}
      <ViewSection
        badge={t("content.roadmap.section.2.badge")}
        title={<>{t("content.roadmap.section.2.title")}</>}
        meta={ROADMAP[1].phase}
      >
        <PhasePhase phase={ROADMAP[1]} meta={PHASE_META[1]} index={1} t={t} />
      </ViewSection>

      {/* Section 3 — 60-day plan =============================================== */}
      <ViewSection
        badge={t("content.roadmap.section.3.badge")}
        title={<>{t("content.roadmap.section.3.title")}</>}
        meta={ROADMAP[2].phase}
      >
        <PhasePhase phase={ROADMAP[2]} meta={PHASE_META[2]} index={2} t={t} />
      </ViewSection>

      {/* Section 4 — 90-day plan =============================================== */}
      <ViewSection
        badge={t("content.roadmap.section.4.badge")}
        title={<>{t("content.roadmap.section.4.title")}</>}
        meta={ROADMAP[3].phase}
      >
        <PhasePhase phase={ROADMAP[3]} meta={PHASE_META[3]} index={3} t={t} />

        <Callout tone="ok" title={t("content.roadmap.section.4.callout.title")}>
          {t("content.roadmap.section.4.callout.body")}
        </Callout>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("experiments")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ursa-dark-roast text-ursa-cream hover:bg-ursa-medium-roast transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
          >
            <Beaker size={14} /> {t("content.roadmap.button.open-experiment-tracker")}
          </button>
          <button
            onClick={() => navigate("calculator")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ursa-gold/60 text-ursa-gold-text hover:bg-ursa-gold hover:text-ursa-dark-roast transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
          >
            <ArrowRight size={14} /> {t("content.roadmap.button.model-subscription")}
          </button>
        </div>
      </ViewSection>

      <ArtNouveauDivider />

      {/* Section 5 — 12-month innovation roadmap =============================== */}
      <ViewSection
        badge={t("content.roadmap.section.5.badge")}
        title={<>{t("content.roadmap.section.5.title")}</>}
        meta="Q1 → Q4"
      >
        <p className="text-[0.97rem] text-muted-foreground leading-relaxed max-w-[68ch] mb-6">
          {t("content.roadmap.section.5.intro")}
        </p>

        <Grid cols={4}>
          {TWELVE_MONTH_ROADMAP.map((q, i) => {
            const accent = QUARTER_ACCENT[i];
            return (
              <Card key={q.quarter} highlight={i === 0} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-semibold text-ursa-dark-roast">
                    {q.quarter}
                  </span>
                  <span className={cn("h-2.5 w-2.5 rounded-full", accent.dot)} aria-hidden="true" />
                </div>
                <div>
                  <SectionBadge tone={accent.tone}>Theme</SectionBadge>
                  <h4 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-1">
                    {q.theme}
                  </h4>
                  <p className="text-[0.86rem] text-muted-foreground leading-relaxed m-0">
                    {q.focus}
                  </p>
                </div>
                <div className="mt-auto pt-3 border-t border-ursa-line-soft">
                  <span className="font-label text-[0.62rem] tracking-[0.16em] uppercase text-muted-foreground">
                    {t(`content.roadmap.section.5.quarter.${i + 1}`)}
                  </span>
                </div>
              </Card>
            );
          })}
        </Grid>

        <Callout tone="forest" title={t("content.roadmap.section.5.callout.title")}>
          {t("content.roadmap.section.5.callout.body")}
        </Callout>
      </ViewSection>

      {/* Section 6 — Budget scenarios summary ================================== */}
      <ViewSection
        badge={t("content.roadmap.section.6.badge")}
        title={<>{t("content.roadmap.section.6.title")}</>}
        meta={t("content.roadmap.section.6.meta")}
      >
        <Grid cols={3}>
          {BUDGET_SCENARIOS.map((s, i) => {
            const tone = BUDGET_TONES[i];
            const scenarioLabel = i === 0
              ? t("content.roadmap.section.6.scenario.lean")
              : i === 1
                ? t("content.roadmap.section.6.scenario.moderate")
                : t("content.roadmap.section.6.scenario.growth");
            const fundsLabel = i === 0
              ? t("content.roadmap.section.6.funds.lean")
              : i === 1
                ? t("content.roadmap.section.6.funds.moderate")
                : t("content.roadmap.section.6.funds.growth");
            return (
              <Card
                key={s.name}
                highlight={i === 1}
                className={cn("flex flex-col gap-4", tone.ring)}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-display text-xl font-semibold text-ursa-dark-roast m-0">
                    {s.name}
                  </h4>
                  <Pill tone={tone.tone === "forest" ? "forest" : tone.tone === "gold" ? "gold" : "stop"}>
                    {scenarioLabel}
                  </Pill>
                </div>

                <div>
                  <StatBlock
                    value={PEN(s.monthlyPEN)}
                    label={t("content.roadmap.section.6.stat.monthly")}
                    tone={tone.tone}
                  />
                </div>

                <ProgressBar
                  value={Math.round((s.monthlyPEN / BUDGET_SCENARIOS[2].monthlyPEN) * 100)}
                  tone={tone.tone === "forest" ? "forest" : tone.tone === "gold" ? "gold" : "terracotta"}
                />

                <p className="text-[0.86rem] text-muted-foreground leading-relaxed m-0">
                  {s.focus}
                </p>

                <ul className="space-y-1 m-0 p-0 list-none text-[0.82rem] text-foreground/85">
                  {s.items.slice(0, 4).map((it) => (
                    <li key={it.item} className="flex items-baseline gap-2">
                      <CircleDot size={11} className="text-ursa-gold-text shrink-0 translate-y-0.5" />
                      <span className="flex-1">{it.item}</span>
                      <span className="font-label text-[0.66rem] tracking-wider text-muted-foreground uppercase">
                        {PEN(it.cost)}
                      </span>
                    </li>
                  ))}
                  {s.items.length > 4 && (
                    <li className="text-[0.78rem] text-muted-foreground italic pl-5">
                      {t("content.roadmap.section.6.more").replace("{n}", String(s.items.length - 4))}
                    </li>
                  )}
                </ul>

                <div className="mt-auto pt-2">
                  <span className="font-label text-[0.62rem] tracking-[0.16em] uppercase text-muted-foreground">
                    {fundsLabel}
                  </span>
                </div>
              </Card>
            );
          })}
        </Grid>

        <Callout tone="gold" title={t("content.roadmap.section.6.callout.title")}>
          {t("content.roadmap.section.6.callout.body")}
        </Callout>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("budget")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ursa-gold text-ursa-dark-roast hover:bg-ursa-gold-soft transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
          >
            <Banknote size={14} /> {t("content.roadmap.button.open-budget-allocator")}
          </button>
          <button
            onClick={() => navigate("roi")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ursa-forest-deep/40 text-ursa-forest-deep hover:bg-ursa-dark-roast hover:text-ursa-cream transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
          >
            <Crosshair size={14} /> {t("content.roadmap.button.model-roi")}
          </button>
        </div>
      </ViewSection>

      {/* Section 7 — Owners & dependencies ===================================== */}
      <ViewSection
        badge={t("content.roadmap.section.7.badge")}
        title={<>{t("content.roadmap.section.7.title")}</>}
        meta={t("content.roadmap.section.7.meta")}
      >
        <p className="text-[0.97rem] text-muted-foreground leading-relaxed max-w-[68ch] mb-6">
          {t("content.roadmap.section.7.intro")}
        </p>

        <div className="overflow-x-auto rounded-xl border border-ursa-line-soft bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-ursa-cream/60 hover:bg-ursa-cream/60">
                <TableHead className="font-label text-[0.64rem] tracking-[0.14em] uppercase text-ursa-medium-roast">{t("content.roadmap.section.7.col.workstream")}</TableHead>
                <TableHead className="font-label text-[0.64rem] tracking-[0.14em] uppercase text-ursa-medium-roast">{t("content.roadmap.section.7.col.owner")}</TableHead>
                <TableHead className="font-label text-[0.64rem] tracking-[0.14em] uppercase text-ursa-medium-roast">{t("content.roadmap.section.7.col.dependency")}</TableHead>
                <TableHead className="font-label text-[0.64rem] tracking-[0.14em] uppercase text-ursa-medium-roast">{t("content.roadmap.section.7.col.metric")}</TableHead>
                <TableHead className="font-label text-[0.64rem] tracking-[0.14em] uppercase text-ursa-medium-roast">{t("content.roadmap.section.7.col.stop")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OWNERS.map((o, i) => (
                <TableRow key={i} className="align-top">
                  <TableCell className="font-medium text-ursa-dark-roast">
                    <span className="inline-flex items-center gap-2">
                      <span className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-ursa-gold/12 border border-ursa-gold/30">
                        {o.icon}
                      </span>
                      <span className="font-display text-[0.95rem]">{t(`content.roadmap.owners.${i}.workstream`)}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-[0.86rem] text-foreground/85">{t(`content.roadmap.owners.${i}.owner`)}</TableCell>
                  <TableCell className="text-[0.86rem] text-muted-foreground">{t(`content.roadmap.owners.${i}.dependency`)}</TableCell>
                  <TableCell className="text-[0.86rem] text-ursa-forest-deep">{t(`content.roadmap.owners.${i}.metric`)}</TableCell>
                  <TableCell className="text-[0.84rem] text-ursa-terracotta-text italic">{t(`content.roadmap.owners.${i}.stop`)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Callout tone="warn" title={t("content.roadmap.section.7.callout.title")}>
          {t("content.roadmap.section.7.callout.body")}
        </Callout>
      </ViewSection>

      {/* Section 8 — KPI dashboard ============================================== */}
      <ViewSection
        badge={t("content.roadmap.section.8.badge")}
        title={<>{t("content.roadmap.section.8.title")}</>}
        meta={t("content.roadmap.section.8.meta")}
      >
        <p className="text-[0.97rem] text-muted-foreground leading-relaxed max-w-[68ch] mb-6">
          {t("content.roadmap.section.8.intro")}
        </p>

        <Grid cols={3}>
          {KPIS.map((k, i) => (
            <Card key={i} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast m-0 leading-snug">
                  {t(`content.roadmap.kpi.${i}.label`)}
                </h4>
                <EvidenceTag status="unverified" />
              </div>
              <p className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground m-0">
                {t(`content.roadmap.kpi.${i}.metric`)}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-ursa-line-soft">
                <div>
                  <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground block mb-1">
                    {t("content.roadmap.section.8.baseline")}
                  </span>
                  <span className="font-display text-[1.3rem] font-semibold text-muted-foreground">
                    {t(`content.roadmap.kpi.${i}.baseline`)}
                  </span>
                </div>
                <div>
                  <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground block mb-1">
                    {t("content.roadmap.section.8.target")}
                  </span>
                  <span
                    className={cn(
                      "font-display text-[1.3rem] font-semibold",
                      k.tone === "forest" && "text-ursa-forest-deep",
                      k.tone === "gold" && "text-ursa-gold-text",
                      k.tone === "terracotta" && "text-ursa-terracotta-text"
                    )}
                  >
                    {t(`content.roadmap.kpi.${i}.target`)}
                  </span>
                </div>
              </div>
              <p className="text-[0.8rem] text-muted-foreground leading-relaxed m-0 pt-2">
                {t(`content.roadmap.kpi.${i}.note`)}
              </p>
            </Card>
          ))}
        </Grid>

        <Callout tone="forest" title={t("content.roadmap.section.8.callout.title")}>
          {t("content.roadmap.section.8.callout.body")}
        </Callout>
      </ViewSection>

      {/* Section 9 — Skeptical revision log ==================================== */}
      <ViewSection
        badge={t("content.roadmap.section.9.badge")}
        title={<>{t("content.roadmap.section.9.title")}</>}
        meta={t("content.roadmap.section.9.meta")}
      >
        <p className="text-[0.97rem] text-muted-foreground leading-relaxed max-w-[68ch] mb-6">
          {t("content.roadmap.section.9.intro")}
        </p>

        <Grid cols={3}>
          {REVISIONS.map((r, i) => (
            <Card key={i} className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-2 font-label text-[0.66rem] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full border",
                    r.tone === "gold" && "border-ursa-gold/50 text-ursa-gold-text bg-ursa-gold/8",
                    r.tone === "forest" && "border-ursa-forest-deep/40 text-ursa-forest-deep bg-ursa-dark-roast/8",
                    r.tone === "terracotta" && "border-ursa-terracotta/40 text-ursa-terracotta-text bg-ursa-terracotta/8"
                  )}
                >
                  <History size={12} /> {t(`content.roadmap.section.9.round.${i}`)}
                </span>
                <span className="font-display text-3xl font-semibold text-ursa-line">
                  0{i + 1}
                </span>
              </div>
              <div>
                <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground">
                  {t("content.roadmap.section.9.col.challenge")}
                </span>
                <p className="text-[0.92rem] font-medium text-ursa-dark-roast leading-relaxed mt-1 mb-0">
                  {t(`content.roadmap.revisions.${i}.challenge`)}
                </p>
              </div>
              <div className="mt-auto pt-3 border-t border-ursa-line-soft">
                <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-ursa-forest-deep">
                  {t("content.roadmap.section.9.col.change")}
                </span>
                <p className="text-[0.86rem] text-muted-foreground leading-relaxed mt-1 mb-0">
                  {t(`content.roadmap.revisions.${i}.change`)}
                </p>
              </div>
            </Card>
          ))}
        </Grid>

        <Callout tone="warn" title={t("content.roadmap.section.9.callout.title")}>
          {t("content.roadmap.section.9.callout.body")}
        </Callout>
      </ViewSection>

      {/* Section 10 — Final spirit-preservation verdict ======================== */}
      <ViewSection
        badge={t("content.roadmap.section.10.badge")}
        title={<>{t("content.roadmap.section.10.title")}</>}
        meta={t("content.roadmap.section.10.meta")}
      >
        <div
          className="relative overflow-hidden rounded-2xl border border-ursa-forest-deep/30 p-8 md:p-10"
          style={{
            background:
              "radial-gradient(ellipse at top right, rgba(184,146,74,0.18), transparent 60%), radial-gradient(ellipse at bottom left, rgba(143,166,139,0.22), transparent 60%), linear-gradient(180deg, var(--color-ursa-forest-deep) 0%, #243d2b 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><g fill='none' stroke='%23D9BC7E' stroke-width='0.6' opacity='0.5'><path d='M0 60 Q30 30 60 60 T120 60'/><path d='M0 90 Q30 60 60 90 T120 90'/><circle cx='60' cy='60' r='2'/></g></svg>\")",
            }}
          />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <BearMark size={64} className="text-ursa-gold-text shrink-0" />
            <div className="flex-1">
              <span className="font-label text-[0.7rem] tracking-[0.22em] uppercase text-ursa-gold-text-soft">
                {t("content.roadmap.section.10.eyebrow")}
              </span>
              <h3 className="font-display text-2xl md:text-[1.8rem] font-semibold text-ursa-cream leading-tight mt-2 mb-3">
                {t("content.roadmap.section.10.headline")}
              </h3>
              <p className="text-[0.97rem] text-ursa-leaf leading-relaxed max-w-[64ch] m-0">
                {t("content.roadmap.section.10.body")}
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="inline-flex items-center gap-1.5 font-label text-[0.64rem] tracking-[0.16em] uppercase px-2.5 py-1 rounded-full bg-ursa-gold/20 text-ursa-gold-text-soft border border-ursa-gold/50">
                  <Shield size={12} /> {t("content.roadmap.section.10.badge.bear")}
                </span>
                <span className="inline-flex items-center gap-1.5 font-label text-[0.64rem] tracking-[0.16em] uppercase px-2.5 py-1 rounded-full bg-ursa-medium-roast/30 text-ursa-leaf border border-ursa-leaf/40">
                  <Coffee size={12} /> {t("content.roadmap.section.10.badge.gram")}
                </span>
                <span className="inline-flex items-center gap-1.5 font-label text-[0.64rem] tracking-[0.16em] uppercase px-2.5 py-1 rounded-full bg-ursa-medium-roast/30 text-ursa-leaf border border-ursa-leaf/40">
                  <Sparkles size={12} /> {t("content.roadmap.section.10.badge.green")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Grid cols={3}>
          <Card className="bg-ursa-foam">
            <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-1.5 flex items-center gap-2">
              <Flag size={16} className="text-ursa-gold-text" /> {t("content.roadmap.verdict.permanent.title")}
            </h4>
            <p className="text-[0.86rem] text-muted-foreground leading-relaxed m-0">
              {t("content.roadmap.verdict.permanent.body")}
            </p>
          </Card>
          <Card className="bg-ursa-foam">
            <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-1.5 flex items-center gap-2">
              <Calendar size={16} className="text-ursa-gold-text" /> {t("content.roadmap.verdict.reversible.title")}
            </h4>
            <p className="text-[0.86rem] text-muted-foreground leading-relaxed m-0">
              {t("content.roadmap.verdict.reversible.body")}
            </p>
          </Card>
          <Card className="bg-ursa-foam">
            <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-1.5 flex items-center gap-2">
              <Sparkles size={16} className="text-ursa-gold-text" /> {t("content.roadmap.verdict.seasonal.title")}
            </h4>
            <p className="text-[0.86rem] text-muted-foreground leading-relaxed m-0">
              {t("content.roadmap.verdict.seasonal.body")}
            </p>
          </Card>
        </Grid>
      </ViewSection>

      {/* Section 11 — Dossier link ============================================== */}
      <ViewSection>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <DossierLinkBanner moduleId="07-implementation-roadmap-and-kpis" />
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("experiments")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ursa-dark-roast text-ursa-cream hover:bg-ursa-medium-roast transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
            >
              <Beaker size={14} /> {t("content.roadmap.button.experiment-tracker-short")}
            </button>
            <button
              onClick={() => navigate("calculator")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ursa-gold/60 text-ursa-gold-text hover:bg-ursa-gold hover:text-ursa-dark-roast transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
            >
              <ArrowRight size={14} /> {t("content.roadmap.button.subscription-calc-short")}
            </button>
            <button
              onClick={() => navigate("budget")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ursa-forest-deep/40 text-ursa-forest-deep hover:bg-ursa-dark-roast hover:text-ursa-cream transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
            >
              <Banknote size={14} /> {t("content.roadmap.button.budget-allocator-short")}
            </button>
          </div>
        </div>

        <ArtNouveauDivider />

        <Grid cols={4}>
          <StatBlock value="72h" label={t("content.roadmap.stat.action-window")} tone="terracotta" />
          <StatBlock value="90d" label={t("content.roadmap.stat.launch-horizon")} tone="gold" />
          <StatBlock value="11" label={t("content.roadmap.stat.experiments")} tone="forest" />
          <StatBlock value="8" label={t("content.roadmap.stat.workstreams")} tone="forest" />
        </Grid>
      </ViewSection>

      {/* ============================================================
          SCIENCE — the research behind the roadmap
         ============================================================ */}
      <ViewSection
        badge={t("content.roadmap.science.badge")}
        title={t("content.roadmap.science.title")}
        meta={t("content.roadmap.science.meta")}
      >
        <p className="text-[0.92rem] text-muted-foreground max-w-[78ch] m-0 mb-6">
          {t("content.roadmap.science.intro")}
        </p>

        {/* Group 1 — Implementation science */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Zap size={16} className="text-ursa-gold-text" />
          {t("content.roadmap.science.group.implementation")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {SCIENCE_IMPLEMENTATION.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        {/* Group 2 — KPI science */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Crosshair size={16} className="text-ursa-gold-text" />
          {t("content.roadmap.science.group.kpi")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {SCIENCE_KPI.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        {/* Group 3 — 90-day plan methodology */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-ursa-gold-text" />
          {t("content.roadmap.science.group.planning")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
          {SCIENCE_PLANNING.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        <Callout tone="gold" title={t("content.roadmap.science.synthesis.title")}>
          {t("content.roadmap.science.synthesis.body")}
        </Callout>
      </ViewSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Science cards — research that backs the Roadmap view.
// Strings live under content.roadmap.science.card.{id}.{field} in i18n.ts.
// ---------------------------------------------------------------------------

type ScienceTone = "gold" | "forest" | "terracotta";

type ScienceEntry = {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone: ScienceTone;
};

const SCIENCE_IMPLEMENTATION: ScienceEntry[] = [
  { id: "kotter-1996", icon: BookOpen, tone: "forest" },
  { id: "agile-marketing", icon: Repeat, tone: "gold" },
  { id: "lean-startup-2011", icon: Beaker, tone: "terracotta" },
  { id: "doerr-okr-2018", icon: Target, tone: "gold" },
];

const SCIENCE_KPI: ScienceEntry[] = [
  { id: "kaplan-norton-1992", icon: Scale, tone: "forest" },
  { id: "leading-lagging", icon: Compass, tone: "gold" },
  { id: "vanity-metrics-ries", icon: AlertTriangle, tone: "terracotta" },
  { id: "multi-touch-attribution", icon: Microscope, tone: "gold" },
];

const SCIENCE_PLANNING: ScienceEntry[] = [
  { id: "quarterly-planning", icon: Calendar, tone: "forest" },
  { id: "moran-lennntington-2013", icon: Clock, tone: "gold" },
  { id: "gv-design-sprint", icon: Zap, tone: "terracotta" },
];

function ScienceCard({
  id,
  icon: Icon,
  tone,
}: {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone: ScienceTone;
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
            {t(`content.roadmap.science.card.${id}.name`)}
          </h4>
          <p className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-muted-foreground m-0 mt-0.5">
            {t(`content.roadmap.science.card.${id}.source`)}
          </p>
        </div>
      </div>
      <div className={cn("border-l-2 pl-2.5 py-1", accentBorder[tone])}>
        <p className="text-[0.82rem] italic text-ursa-dark-roast m-0 leading-snug">
          {t(`content.roadmap.science.card.${id}.finding`)}
        </p>
      </div>
      <p className="text-[0.84rem] leading-relaxed text-foreground/85 m-0">
        {t(`content.roadmap.science.card.${id}.apply`)}
      </p>
    </Card>
  );
}

// ---- Phase sub-component -----------------------------------------------------
function PhasePhase({
  phase,
  meta,
  index,
  t,
}: {
  phase: { phase: string; items: string[] };
  meta: PhaseMeta;
  index: number;
  t: (key: string) => string;
}) {
  const badge = t(`content.roadmap.phase.${index + 1}.badge`);
  const intro = t(`content.roadmap.phase.${index + 1}.intro`);
  return (
    <div className={cn("rounded-xl border p-5 md:p-6", meta.accentBorder, meta.accentBg)}>
      <div className="flex flex-wrap items-baseline gap-3 mb-3">
        <span className="inline-flex items-center gap-2 font-label text-[0.7rem] tracking-[0.18em] uppercase text-ursa-dark-roast">
          <span
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-full border",
              meta.accentBorder,
              "bg-ursa-paper"
            )}
          >
            {meta.icon}
          </span>
          Phase {index + 1} · {badge}
        </span>
        <Pill tone={meta.tone === "forest" ? "forest" : meta.tone === "gold" ? "gold" : "stop"}>
          {phase.phase}
        </Pill>
        <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">
          {phase.items.length} {t("content.roadmap.phase.commitments")}
        </span>
      </div>

      <p className="text-[0.95rem] text-foreground/90 leading-relaxed max-w-[72ch] mb-5">
        {intro}
      </p>

      <ol className="grid gap-3 sm:grid-cols-2 m-0 p-0 list-none">
        {phase.items.map((item, i) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-lg border border-ursa-line-soft bg-card p-3.5"
          >
            <span
              className={cn(
                "shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full font-display text-[0.9rem] font-semibold text-ursa-cream",
                meta.dot
              )}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="text-[0.9rem] text-foreground/90 leading-relaxed">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
