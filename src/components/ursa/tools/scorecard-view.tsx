"use client";

import { useState, useMemo } from "react";
import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import { BearMark, Pill, Callout, StatBlock, ProgressBar, ArtNouveauDivider, EvidenceTag } from "../ursa-brand";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
  FileText, Download, Check, X, AlertTriangle, Shield, FlaskConical,
  TrendingUp, Coffee, Scale, PawPrint, Printer, RefreshCw,
} from "lucide-react";

/**
 * Brand Audit Scorecard — a compilation tool that pulls together the
 * Bear Score (identity consistency), Spirit-Preservation verdict,
 * Experiment tracker status, and the four brand pillars into one
 * printable, copyable summary. This is the "one-page executive view"
 * the owner can share or print.
 *
 * Reads the same data sources as the individual tools; does not duplicate
 * state — it's a read-only compilation.
 */

// Mirrors the Bear Score widget surfaces (kept in sync manually)
const BEAR_SCORE_SURFACES = [
  { surfaceKey: "ig-bio", score: 92, status: "verified" as const },
  { surfaceKey: "post-covers", score: 68, status: "partial" as const },
  { surfaceKey: "caption-language", score: 78, status: "partial" as const },
  { surfaceKey: "packaging", score: 85, status: "verified" as const },
  { surfaceKey: "cups-collateral", score: 72, status: "partial" as const },
  { surfaceKey: "storefront", score: 88, status: "verified" as const },
  { surfaceKey: "gbp", score: 18, status: "gap" as const },
  { surfaceKey: "tripadvisor", score: 12, status: "gap" as const },
  { surfaceKey: "rappi", score: 64, status: "partial" as const },
  { surfaceKey: "website", score: 8, status: "gap" as const },
];

const PILLARS = [
  { nameKey: "bear", score: 76, icon: PawPrint, color: "var(--color-ursa-dark-roast)" },
  { nameKey: "art-nouveau", score: 82, icon: Coffee, color: "var(--color-ursa-gold)" },
  { nameKey: "palette", score: 84, icon: Coffee, color: "var(--color-ursa-forest-deep)" },
  { nameKey: "roastery", score: 90, icon: Scale, color: "var(--color-ursa-terracotta)" },
];

// Experiment status summary (mirrors experiments-view defaults — names stay as research-source data)
const EXPERIMENT_SUMMARY = [
  { id: "EXP-01", name: "Story card on pour-over", status: "proposed" as const },
  { id: "EXP-02", name: "Google Business Profile claim", status: "proposed" as const },
  { id: "EXP-03", name: "Hotel concierge card drop", status: "proposed" as const },
  { id: "EXP-04", name: "Named-drink menu board", status: "proposed" as const },
  { id: "EXP-05", name: "Cookie pairing table sign", status: "proposed" as const },
  { id: "EXP-06", name: "Weekly cupping night", status: "proposed" as const },
  { id: "EXP-07", name: "Creator pilot (3 creators)", status: "proposed" as const },
  { id: "EXP-08", name: "WhatsApp consent list", status: "proposed" as const },
  { id: "EXP-09", name: "Rappi menu optimisation", status: "proposed" as const },
  { id: "EXP-10", name: "TripAdvisor claiming", status: "proposed" as const },
  { id: "EXP-11", name: "Ursa Mañana subscription pilot", status: "proposed" as const },
];

const STATUS_META = {
  proposed: { labelKey: "proposed", tone: "warn" as const, color: "var(--color-ursa-gold)" },
  running: { labelKey: "running", tone: "forest" as const, color: "var(--color-ursa-forest-deep)" },
  passed: { labelKey: "passed", tone: "ok" as const, color: "var(--color-ursa-forest-deep)" },
  killed: { labelKey: "killed", tone: "stop" as const, color: "var(--color-ursa-terracotta)" },
};

export function ScorecardView() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const bearOverall = Math.round(BEAR_SCORE_SURFACES.reduce((s, x) => s + x.score, 0) / BEAR_SCORE_SURFACES.length);
  const pillarAvg = Math.round(PILLARS.reduce((s, p) => s + p.score, 0) / PILLARS.length);
  const composite = Math.round(bearOverall * 0.6 + pillarAvg * 0.4);

  const expCounts = useMemo(() => {
    const c = { proposed: 0, running: 0, passed: 0, killed: 0 };
    EXPERIMENT_SUMMARY.forEach((e) => { c[e.status]++; });
    return c;
  }, []);

  const spiritVerdictLabel =
    composite >= 70 ? t("content.scorecard.experiments.status.passed") :
    composite >= 50 ? t("content.scorecard.experiments.status.running") :
    t("content.scorecard.experiments.status.killed");

  const headlineGrade =
    composite >= 80 ? { letter: "A", tone: "ok" as const, color: "var(--color-ursa-forest-deep)" } :
    composite >= 65 ? { letter: "B", tone: "forest" as const, color: "var(--color-ursa-forest)" } :
    composite >= 50 ? { letter: "C", tone: "warn" as const, color: "var(--color-ursa-gold)" } :
    { letter: "D", tone: "stop" as const, color: "var(--color-ursa-terracotta)" };

  const summaryText = useMemo(() => {
    const lines = [
      t("content.scorecard.copy.title"),
      t("content.scorecard.copy.compiled"),
      t("content.scorecard.copy.divider"),
      "",
      t("content.scorecard.copy.overall", { letter: headlineGrade.letter, composite }),
      t("content.scorecard.copy.spirit-verdict", { verdict: spiritVerdictLabel }),
      "",
      t("content.scorecard.copy.bear-score-section"),
      t("content.scorecard.copy.surfaces-avg", { n: bearOverall }),
      t("content.scorecard.copy.pillars-avg", { n: pillarAvg }),
      t("content.scorecard.copy.composite", { n: composite }),
      "",
      t("content.scorecard.copy.brand-pillars-section"),
      ...PILLARS.map((p) => "  " + t(`content.scorecard.pillar.${p.nameKey}.name`) + ": " + p.score + "/100"),
      "",
      t("content.scorecard.copy.surface-consistency-section"),
      ...BEAR_SCORE_SURFACES.map((s) => "  " + t(`content.scorecard.surface.${s.surfaceKey}`).padEnd(34) + " " + s.score + "/100  [" + s.status + "]"),
      "",
      t("content.scorecard.copy.experiments-section", { n: EXPERIMENT_SUMMARY.length }),
      t("content.scorecard.copy.experiments-detail", { p: expCounts.proposed, r: expCounts.running, pa: expCounts.passed, k: expCounts.killed }),
      "",
      t("content.scorecard.copy.top-strength", { name: t(`content.scorecard.surface.${[...BEAR_SCORE_SURFACES].sort((a, b) => b.score - a.score)[0].surfaceKey}`) }),
      t("content.scorecard.copy.biggest-gap", { name: t(`content.scorecard.surface.${[...BEAR_SCORE_SURFACES].sort((a, b) => a.score - b.score)[0].surfaceKey}`) }),
      "",
      t("content.scorecard.copy.spirit-section"),
      t("content.scorecard.copy.spirit-line-1"),
      t("content.scorecard.copy.spirit-line-2"),
      t("content.scorecard.copy.spirit-line-3"),
      "",
    ];
    return lines.join("\n");
  }, [composite, bearOverall, pillarAvg, headlineGrade, spiritVerdictLabel, expCounts, t]);

  const copySummary = () => {
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const sortedDesc = [...BEAR_SCORE_SURFACES].sort((a, b) => b.score - a.score);
  const topStrength = sortedDesc[0];
  const biggestGap = sortedDesc[sortedDesc.length - 1];

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.scorecard.eyebrow")}
        title={t("content.view.scorecard.title")}
        lede={<>{t("content.scorecard.lede")}</>}
        meta={[
          { label: t("content.scorecard.meta.grade"), value: `${headlineGrade.letter} · ${composite}/100` },
          { label: t("content.scorecard.meta.surfaces"), value: t("content.scorecard.meta.surfaces-value", { n: BEAR_SCORE_SURFACES.length }) },
          { label: t("content.scorecard.meta.experiments"), value: t("content.scorecard.meta.experiments-value", { n: EXPERIMENT_SUMMARY.length }) },
        ]}
        tone="forest"
      />

      <ViewSection>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ursa-dark-roast text-ursa-cream font-label text-[0.74rem] tracking-[0.12em] uppercase hover:bg-ursa-espresso transition shadow-lg no-print">
            <Printer size={14} /> {t("content.scorecard.action.print")}
          </button>
          <button onClick={copySummary} className={cn("inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-label text-[0.74rem] tracking-[0.12em] uppercase transition shadow-lg no-print", copied ? "bg-ursa-forest-deep text-ursa-cream" : "bg-ursa-gold text-ursa-dark-roast hover:bg-ursa-gold-soft")}>
            {copied ? <><Check size={14} /> {t("content.scorecard.action.copied")}</> : <><Download size={14} /> {t("content.scorecard.action.copy")}</>}
          </button>
          <button onClick={() => navigate("brand")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ursa-line-soft text-muted-foreground font-label text-[0.74rem] tracking-[0.12em] uppercase hover:text-ursa-dark-roast hover:border-ursa-gold/60 transition no-print">
            <FileText size={14} /> {t("content.scorecard.action.full-audit")}
          </button>
        </div>
      </ViewSection>

      {/* The scorecard */}
      <ViewSection>
        <Card className="bg-gradient-to-br from-ursa-paper to-ursa-cream border-ursa-gold/30" >
          {/* Scorecard header */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-5 border-b-2 border-ursa-gold/30">
            <div className="flex items-center gap-3">
              <BearMark size={44} className="text-ursa-dark-roast ursa-breathe" />
              <div>
                <h2 className="font-display text-2xl font-semibold text-ursa-dark-roast m-0 leading-tight">{t("content.scorecard.card.title")}</h2>
                <p className="font-label text-[0.64rem] tracking-[0.2em] uppercase text-ursa-gold m-0 mt-1">{t("content.scorecard.card.subtitle")}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-6xl font-semibold leading-none" style={{ color: headlineGrade.color }}>{headlineGrade.letter}</div>
              <div className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-muted-foreground mt-1">{t("content.scorecard.card.composite-meta", { composite, verdict: spiritVerdictLabel })}</div>
            </div>
          </div>

          {/* Top metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-b border-ursa-line-soft">
            <ScorecardMetric label={t("content.scorecard.metric.bear-score")} value={bearOverall} suffix="/100" tone="gold" />
            <ScorecardMetric label={t("content.scorecard.metric.pillars-avg")} value={pillarAvg} suffix="/100" tone="forest" />
            <ScorecardMetric label={t("content.scorecard.metric.experiments-tracked")} value={EXPERIMENT_SUMMARY.length} suffix={t("content.scorecard.metric.experiments-tracked-suffix")} tone="terracotta" />
            <ScorecardMetric label={t("content.scorecard.metric.composite")} value={composite} suffix="/100" tone={headlineGrade.tone === "ok" ? "forest" : headlineGrade.tone === "warn" ? "gold" : "terracotta"} />
          </div>

          {/* Brand pillars */}
          <div className="py-5 border-b border-ursa-line-soft">
            <h3 className="font-label text-[0.66rem] tracking-[0.16em] uppercase text-ursa-gold m-0 mb-4">{t("content.scorecard.pillars.title")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.nameKey} className="text-center">
                    <div className="relative w-16 h-16 mx-auto">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-ursa-bg-alt)" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke={p.color} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(p.score / 100) * 97.4} 97.4`} />
                      </svg>
                      <span className="absolute inset-0 grid place-items-center font-display text-sm font-semibold text-ursa-dark-roast">{p.score}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Icon size={11} style={{ color: p.color }} />
                      <p className="font-label text-[0.58rem] tracking-[0.08em] uppercase text-muted-foreground m-0">{t(`content.scorecard.pillar.${p.nameKey}.name`)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strength + Gap */}
          <div className="grid grid-cols-2 gap-4 py-5 border-b border-ursa-line-soft">
            <div className="rounded-lg bg-ursa-forest-deep/8 border border-ursa-forest-deep/20 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp size={13} className="text-ursa-forest-deep" />
                <span className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-ursa-forest-deep">{t("content.scorecard.strength.title")}</span>
              </div>
              <p className="font-display text-base font-semibold text-ursa-dark-roast m-0">{t(`content.scorecard.surface.${topStrength.surfaceKey}`)}</p>
              <p className="font-label text-[0.72rem] text-ursa-forest-deep m-0 mt-0.5">{topStrength.score}/100</p>
            </div>
            <div className="rounded-lg bg-ursa-terracotta/8 border border-ursa-terracotta/25 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle size={13} className="text-ursa-terracotta" />
                <span className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-ursa-terracotta">{t("content.scorecard.gap.title")}</span>
              </div>
              <p className="font-display text-base font-semibold text-ursa-dark-roast m-0">{t(`content.scorecard.surface.${biggestGap.surfaceKey}`)}</p>
              <p className="font-label text-[0.72rem] text-ursa-terracotta m-0 mt-0.5">{biggestGap.score}/100</p>
            </div>
          </div>

          {/* Experiment status summary */}
          <div className="py-5 border-b border-ursa-line-soft">
            <h3 className="font-label text-[0.66rem] tracking-[0.16em] uppercase text-ursa-gold m-0 mb-4 flex items-center gap-2">
              <FlaskConical size={14} /> {t("content.scorecard.experiments.title", { n: EXPERIMENT_SUMMARY.length })}
            </h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {(Object.keys(STATUS_META) as (keyof typeof STATUS_META)[]).map((s) => (
                <div key={s} className="rounded-lg border border-ursa-line-soft bg-card p-3 text-center">
                  <div className="font-display text-2xl font-semibold leading-none" style={{ color: STATUS_META[s].color }}>{expCounts[s]}</div>
                  <div className="font-label text-[0.56rem] tracking-[0.12em] uppercase text-muted-foreground mt-1">{t(`content.scorecard.experiments.status.${STATUS_META[s].labelKey}`)}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {EXPERIMENT_SUMMARY.map((e) => (
                <span key={e.id} className="inline-flex items-center gap-1 font-label text-[0.6rem] tracking-[0.06em] uppercase px-2 py-1 rounded-full border" style={{ borderColor: `${STATUS_META[e.status].color}40`, color: "var(--color-ursa-dark-roast)", background: `${STATUS_META[e.status].color}10` }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_META[e.status].color }} />
                  {e.id}
                </span>
              ))}
            </div>
          </div>

          {/* Spirit-preservation verdict */}
          <div className="py-5">
            <h3 className="font-label text-[0.66rem] tracking-[0.16em] uppercase text-ursa-gold m-0 mb-3 flex items-center gap-2">
              <Shield size={14} /> {t("content.scorecard.spirit.title")}
            </h3>
            <div className="rounded-lg bg-gradient-to-r from-ursa-forest-deep/10 to-ursa-gold/10 border border-ursa-gold/30 p-5">
              <div className="flex items-center gap-3 mb-2">
                <BearMark size={28} className="text-ursa-dark-roast" />
                <PawPrint size={18} className="text-ursa-dark-roast" />
                <Coffee size={18} className="text-ursa-gold" />
                <Scale size={18} className="text-ursa-forest-deep" />
              </div>
              <p className="font-display text-lg font-semibold text-ursa-dark-roast m-0 mb-1">{t("content.scorecard.spirit.headline")}</p>
              <p className="text-[0.86rem] text-muted-foreground m-0">
                {t("content.scorecard.spirit.body")}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-ursa-line-soft flex items-center justify-between flex-wrap gap-2">
            <p className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-muted-foreground m-0">
              {t("content.scorecard.footer.snapshot")}
            </p>
            <p className="font-display italic text-[0.78rem] text-ursa-medium-roast m-0">{t("content.scorecard.footer.tagline")}</p>
          </div>
        </Card>
      </ViewSection>

      {/* Surface breakdown — compact */}
      <ViewSection badge={t("content.scorecard.detail.badge")} title={t("content.scorecard.detail.title")} meta={t("content.scorecard.detail.meta", { n: BEAR_SCORE_SURFACES.length })}>
        <Grid cols={2}>
          {sortedDesc.map((s) => {
            const barColor = s.status === "verified" ? "var(--color-ursa-forest-deep)" : s.status === "partial" ? "var(--color-ursa-gold)" : "var(--color-ursa-terracotta)";
            return (
              <Card key={s.surfaceKey} className="p-4 flex items-center gap-3">
                <EvidenceTag status={s.status} />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-[0.9rem] font-semibold text-ursa-dark-roast m-0 leading-tight truncate">{t(`content.scorecard.surface.${s.surfaceKey}`)}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: barColor }} />
                    </div>
                    <span className="font-label text-[0.72rem] font-semibold tabular-nums" style={{ color: barColor }}>{s.score}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </Grid>
      </ViewSection>

      <ViewSection>
        <DossierLinkBanner moduleId="01-brand-audit-and-design-system" />
      </ViewSection>
    </>
  );
}

function ScorecardMetric({ label, value, suffix, tone }: { label: string; value: number; suffix: string; tone: "gold" | "forest" | "terracotta" }) {
  const tones = { gold: "text-ursa-gold", forest: "text-ursa-forest-deep", terracotta: "text-ursa-terracotta" };
  return (
    <div className="text-center">
      <div className={cn("font-display text-3xl font-semibold leading-none", tones[tone])}>
        {value}<span className="text-[0.8rem] text-muted-foreground font-body">{suffix}</span>
      </div>
      <div className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-muted-foreground mt-1.5">{label}</div>
    </div>
  );
}
