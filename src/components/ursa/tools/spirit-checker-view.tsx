"use client";

import { useState, useMemo } from "react";
import type { ComponentType } from "react";
import { ViewHero, ViewSection, Card, DossierLinkBanner } from "../view-shell";
import { BearMark, Pill, Callout, ProgressBar } from "../ursa-brand";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
  Shield, Check, X, AlertTriangle, RotateCcw, PawPrint as BearLucide,
  Scale, Coffee, Info,
  BookOpen, Microscope, Brain, Target, Award, GraduationCap,
} from "lucide-react";

/**
 * Spirit-Preservation Checker — an interactive tool that validates any
 * proposed tactic against Ursa's verified identity (bear, gram, green,
 * Art Nouveau, roastery). Returns a score and a verdict.
 *
 * The three spirit pillars:
 *  1. BEAR — the bear motif / mascot / character
 *  2. GRAM — "Un gramo a la vez" — the weighing ritual / patient craft
 *  3. GREEN — the browns-and-greens palette / Art Nouveau / roastery craft
 *
 * A tactic that erodes any pillar without offsetting gain fails the check.
 */

type Pillar = "bear" | "gram" | "green";

type Question = {
  id: string;
  pillar: Pillar;
  // "yes" = preserves/strengthens, "no" = erodes, "neutral" = n/a
  weight: number; // how much this question matters (1-3)
};

const QUESTIONS: Question[] = [
  { id: "q1", pillar: "bear", weight: 3 },
  { id: "q2", pillar: "bear", weight: 2 },
  { id: "q3", pillar: "gram", weight: 3 },
  { id: "q4", pillar: "gram", weight: 2 },
  { id: "q5", pillar: "green", weight: 2 },
  { id: "q6", pillar: "green", weight: 2 },
  { id: "q7", pillar: "green", weight: 3 },
  { id: "q8", pillar: "bear", weight: 2 },
];

const PILLAR_META: Record<Pillar, { labelKey: string; descKey: string; icon: typeof BearLucide; color: string; textColor: string }> = {
  bear: { labelKey: "content.spirit-checker.pillar.bear.label", descKey: "content.spirit-checker.pillar.bear.desc", icon: BearLucide, color: "var(--color-ursa-dark-roast)", textColor: "var(--color-ursa-dark-roast)" },
  gram: { labelKey: "content.spirit-checker.pillar.gram.label", descKey: "content.spirit-checker.pillar.gram.desc", icon: Scale, color: "var(--color-ursa-gold)", textColor: "var(--color-ursa-gold-text)" },
  green: { labelKey: "content.spirit-checker.pillar.green.label", descKey: "content.spirit-checker.pillar.green.desc", icon: Coffee, color: "var(--color-ursa-forest-deep)", textColor: "var(--color-ursa-forest-deep)" },
};

const qKey = (id: string, field: string) => `content.spirit-checker.q.${id}.${field}`;

export function SpiritCheckerView() {
  const { t } = useI18n();
  const [tactic, setTactic] = useState("");
  const [answers, setAnswers] = useState<Record<string, "yes" | "no" | "neutral" | undefined>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    const pillarScores: Record<Pillar, { earned: number; max: number }> = {
      bear: { earned: 0, max: 0 },
      gram: { earned: 0, max: 0 },
      green: { earned: 0, max: 0 },
    };
    QUESTIONS.forEach((q) => {
      pillarScores[q.pillar].max += q.weight * 10;
      const ans = answers[q.id];
      // For "erodes" questions (q2, q4), "no" is good and "yes" is bad
      const isErodeQuestion = q.id === "q2" || q.id === "q4";
      if (ans === "neutral") {
        pillarScores[q.pillar].earned += q.weight * 5; // half credit
      } else if (isErodeQuestion) {
        if (ans === "no") pillarScores[q.pillar].earned += q.weight * 10; // good: it doesn't erode
        else if (ans === "yes") pillarScores[q.pillar].earned += 0; // bad: it erodes
      } else {
        if (ans === "yes") pillarScores[q.pillar].earned += q.weight * 10; // good: it preserves
        else if (ans === "no") pillarScores[q.pillar].earned += 0; // bad: it doesn't
      }
    });
    const pct = (p: { earned: number; max: number }) => (p.max > 0 ? Math.round((p.earned / p.max) * 100) : 0);
    const bear = pct(pillarScores.bear);
    const gram = pct(pillarScores.gram);
    const green = pct(pillarScores.green);
    const composite = Math.round((bear + gram + green) / 3);
    // Spirit preserved if no pillar falls below 50%
    const lowestPillar = Math.min(bear, gram, green);
    const verdict =
      lowestPillar >= 70 ? "preserved" :
      lowestPillar >= 50 ? "conditional" :
      "at-risk";
    return { bear, gram, green, composite, verdict, lowestPillar };
  }, [answers]);

  const answeredCount = Object.values(answers).filter((v) => v !== undefined).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const verdictMeta = {
    preserved: {
      labelKey: "content.spirit-checker.verdict.preserved.label",
      descKey: "content.spirit-checker.verdict.preserved.desc",
      tone: "ok" as const,
      color: "var(--color-ursa-forest-deep)",
    },
    conditional: {
      labelKey: "content.spirit-checker.verdict.conditional.label",
      descKey: "content.spirit-checker.verdict.conditional.desc",
      tone: "warn" as const,
      color: "var(--color-ursa-gold)",
    },
    "at-risk": {
      labelKey: "content.spirit-checker.verdict.at-risk.label",
      descKey: "content.spirit-checker.verdict.at-risk.desc",
      tone: "stop" as const,
      color: "var(--color-ursa-terracotta)",
    },
  };

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.spirit-checker.eyebrow")}
        title={t("content.view.spirit-checker.title")}
        lede={<>{t("content.spirit-checker.hero.lede")}</>}
        meta={[
          { label: t("content.spirit-checker.meta.pillars"), value: t("content.spirit-checker.meta.pillars-value") },
          { label: t("content.spirit-checker.meta.questions"), value: t("content.spirit-checker.meta.questions-value") },
          { label: t("content.spirit-checker.meta.threshold"), value: t("content.spirit-checker.meta.threshold-value") },
        ]}
        tone="forest"
      />

      <ViewSection>
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 items-start [grid-template-columns:minmax(0,1fr)]">
          {/* Left: tactic input + questions */}
          <div className="space-y-5">
            {/* Tactic input */}
            <Card>
              <label className="font-label text-[0.72rem] tracking-[0.14em] uppercase text-ursa-gold-text block mb-2">
                {t("content.spirit-checker.tactic.label")}
              </label>
              <input
                type="text"
                value={tactic}
                onChange={(e) => setTactic(e.target.value)}
                placeholder={t("content.spirit-checker.tactic.placeholder")}
                aria-label={t("content.spirit-checker.tactic.label")}
                className="w-full h-11 px-4 rounded-lg border border-ursa-line bg-ursa-foam text-ursa-dark-roast placeholder:text-muted-foreground/60 focus:outline-none focus:border-ursa-gold focus:ring-2 focus:ring-ursa-gold/20 transition font-body"
              />
              <p className="text-[0.78rem] text-muted-foreground mt-2 m-0">
                {t("content.spirit-checker.tactic.helper", { n: QUESTIONS.length })}
              </p>
            </Card>

            {/* Questions */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-ursa-dark-roast m-0 flex items-center gap-2">
                  <Shield size={18} className="text-ursa-gold-text" /> {t("content.spirit-checker.questions.title", { n: QUESTIONS.length })}
                </h3>
                <span className="font-label text-[0.66rem] tracking-[0.12em] uppercase text-muted-foreground">
                  {t("content.spirit-checker.questions.counter", { n: answeredCount, total: QUESTIONS.length })}
                </span>
              </div>
              <ProgressBar value={(answeredCount / QUESTIONS.length) * 100} tone="gold" />

              <div className="mt-5 space-y-4">
                {QUESTIONS.map((q, i) => {
                  const ans = answers[q.id];
                  const meta = PILLAR_META[q.pillar];
                  const Icon = meta.icon;
                  const isErode = q.id === "q2" || q.id === "q4";
                  const pillarLabel = t(meta.labelKey);
                  const pillarDesc = t(meta.descKey);
                  return (
                    <div key={q.id} className="rounded-lg border border-ursa-line-soft bg-ursa-foam/50 p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="w-7 h-7 rounded-full grid place-items-center shrink-0 border" style={{ background: `${meta.color}15`, borderColor: `${meta.color}40`, color: meta.color }}>
                          <Icon size={14} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-label text-[0.56rem] tracking-[0.14em] uppercase" style={{ color: meta.textColor }}>{pillarLabel}</span>
                            <span className="font-label text-[0.56rem] tracking-[0.1em] uppercase text-muted-foreground">· {t("content.spirit-checker.weight.label", { n: q.weight })}</span>
                          </div>
                          <p className="font-display text-[0.95rem] font-semibold text-ursa-dark-roast m-0 leading-snug">
                            {i + 1}. {t(qKey(q.id, "question"))}
                          </p>
                          <p className="text-[0.76rem] text-muted-foreground m-0 mt-1 leading-relaxed flex items-start gap-1">
                            <Info size={11} className="mt-0.5 shrink-0 text-ursa-gold-text/60" /> {t(qKey(q.id, "help"))}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 pl-10">
                        {(["yes", "no", "neutral"] as const).map((opt) => {
                          const isActive = ans === opt;
                          // For erode questions, "no" is the good answer (green), "yes" is bad (red)
                          const tone = isErode
                            ? (opt === "no" ? "ok" : opt === "yes" ? "stop" : "warn")
                            : (opt === "yes" ? "ok" : opt === "no" ? "stop" : "warn");
                          const toneCls = {
                            ok: isActive ? "bg-ursa-dark-roast text-ursa-cream border-ursa-forest-deep" : "text-ursa-forest-deep border-ursa-forest-deep/30 hover:bg-ursa-dark-roast/10",
                            stop: isActive ? "bg-ursa-terracotta text-ursa-cream border-ursa-terracotta" : "text-ursa-terracotta-text border-ursa-terracotta/30 hover:bg-ursa-terracotta/10",
                            warn: isActive ? "bg-ursa-gold text-ursa-dark-roast border-ursa-gold" : "text-ursa-gold-text border-ursa-gold/30 hover:bg-ursa-gold/10",
                          }[tone];
                          const optLabel = opt === "yes"
                            ? t("content.spirit-checker.option.yes")
                            : opt === "no"
                              ? t("content.spirit-checker.option.no")
                              : t("content.spirit-checker.option.na");
                          return (
                            <button
                              key={opt}
                              onClick={() => setAnswers((a) => ({ ...a, [q.id]: isActive ? undefined : opt }))}
                              aria-pressed={isActive}
                              className={cn(
                                "px-3 py-1.5 rounded-full font-label text-[0.62rem] tracking-[0.1em] uppercase border transition",
                                toneCls
                              )}
                            >
                              {optLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => setSubmitted(true)}
                  disabled={!allAnswered}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-label text-[0.74rem] tracking-[0.12em] uppercase bg-ursa-gold text-ursa-dark-roast hover:bg-ursa-gold-soft transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Shield size={14} /> {t("content.spirit-checker.action.check")}
                </button>
                <button
                  onClick={() => { setAnswers({}); setSubmitted(false); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full font-label text-[0.72rem] tracking-[0.1em] uppercase text-muted-foreground hover:text-ursa-terracotta-text transition"
                >
                  <RotateCcw size={13} /> {t("content.spirit-checker.action.clear")}
                </button>
              </div>
            </Card>
          </div>

          {/* Right: live score panel */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <Card highlight className={cn(submitted && score.verdict === "at-risk" && "border-ursa-terracotta")}>
              <div className="flex items-center gap-2 mb-4">
                <BearMark size={22} className="text-ursa-dark-roast ursa-breathe" />
                <h3 className="font-display text-lg font-semibold text-ursa-dark-roast m-0">{t("content.spirit-checker.score.title")}</h3>
              </div>

              {/* Composite */}
              <div className="text-center mb-5">
                <div className="font-display text-5xl font-semibold leading-none" style={{ color: submitted ? verdictMeta[score.verdict].color : "var(--color-ursa-line)" }}>
                  {submitted ? score.composite : "—"}
                </div>
                <div className="font-label text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground mt-2">{t("content.spirit-checker.score.composite-label")}</div>
              </div>

              {submitted ? (
                <div className="mb-4">
                  <Pill tone={verdictMeta[score.verdict].tone} className="mb-2">{t(verdictMeta[score.verdict].labelKey)}</Pill>
                  <p className="text-[0.84rem] text-muted-foreground m-0 leading-relaxed">{t(verdictMeta[score.verdict].descKey)}</p>
                </div>
              ) : (
                <p className="text-[0.84rem] text-muted-foreground m-0 mb-4 italic">
                  {t("content.spirit-checker.action.prompt", { n: QUESTIONS.length })}
                </p>
              )}

              {/* Pillar breakdown */}
              <div className="space-y-3 pt-4 border-t border-ursa-line-soft">
                {(Object.keys(PILLAR_META) as Pillar[]).map((p) => {
                  const meta = PILLAR_META[p];
                  const Icon = meta.icon;
                  const val = score[p as "bear" | "gram" | "green"];
                  const pillarTone = val >= 70 ? "var(--color-ursa-forest-deep)" : val >= 50 ? "var(--color-ursa-gold)" : "var(--color-ursa-terracotta)";
                  const pillarLabel = t(meta.labelKey);
                  const pillarDesc = t(meta.descKey);
                  return (
                    <div key={p}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5 font-label text-[0.64rem] tracking-[0.12em] uppercase text-muted-foreground">
                          <Icon size={12} style={{ color: meta.color }} /> {pillarLabel}
                        </span>
                        <span className="font-display text-[0.9rem] font-semibold tabular-nums" style={{ color: submitted ? pillarTone : "var(--color-ursa-line)" }}>
                          {submitted ? val : "—"}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: submitted ? `${val}%` : "0%", background: pillarTone }}
                        />
                      </div>
                      <p className="text-[0.7rem] text-muted-foreground m-0 mt-1">{pillarDesc}</p>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* The rule */}
            <Callout tone="forest" title={t("content.spirit-checker.callout.rule.title")}>
              <p className="m-0 text-[0.86rem]">
                {t("content.spirit-checker.callout.rule.body")}
              </p>
            </Callout>

            {/* Example verdicts */}
            <Card className="bg-ursa-foam">
              <h4 className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-gold-text m-0 mb-3">{t("content.spirit-checker.scale.title")}</h4>
              <ul className="space-y-2 m-0 p-0 list-none text-[0.82rem]">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-ursa-forest-deep mt-0.5 shrink-0" />
                  <span><strong className="text-ursa-dark-roast">{t("content.spirit-checker.scale.preserved")}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle size={14} className="text-ursa-gold-text mt-0.5 shrink-0" />
                  <span><strong className="text-ursa-dark-roast">{t("content.spirit-checker.scale.conditional")}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <X size={14} className="text-ursa-terracotta-text mt-0.5 shrink-0" />
                  <span><strong className="text-ursa-dark-roast">{t("content.spirit-checker.scale.at-risk")}</strong></span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </ViewSection>

      {/* ============================================================
          SCIENCE — the research behind the spirit check
         ============================================================ */}
      <ViewSection
        badge={t("content.spirit-checker.science.badge")}
        title={t("content.spirit-checker.science.title")}
        meta={t("content.spirit-checker.science.meta")}
      >
        <p className="text-[0.92rem] text-muted-foreground max-w-[78ch] m-0 mb-6">
          {t("content.spirit-checker.science.intro")}
        </p>

        {/* Group 1 — Brand consistency science */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-ursa-gold-text" />
          {t("content.spirit-checker.science.group.brand")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {SCIENCE_BRAND.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        {/* Group 2 — Decision framework science */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Brain size={16} className="text-ursa-gold-text" />
          {t("content.spirit-checker.science.group.decision")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
          {SCIENCE_DECISION.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        <Callout tone="gold" title={t("content.spirit-checker.science.synthesis.title")}>
          {t("content.spirit-checker.science.synthesis.body")}
        </Callout>
      </ViewSection>

      <ViewSection>
        <DossierLinkBanner moduleId="01-brand-audit-and-design-system" />
      </ViewSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Science cards — research that backs the Spirit Checker view.
// Strings live under content.spirit-checker.science.card.{id}.{field} in
// i18n.ts.
// ---------------------------------------------------------------------------

type ScienceTone = "gold" | "forest" | "terracotta";

type ScienceEntry = {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone: ScienceTone;
};

const SCIENCE_BRAND: ScienceEntry[] = [
  { id: "keller-1993", icon: BookOpen, tone: "forest" },
  { id: "aaker-1996", icon: Target, tone: "gold" },
  { id: "aaker-keller-1990", icon: AlertTriangle, tone: "terracotta" },
  { id: "lucidpress-2021", icon: Award, tone: "gold" },
];

const SCIENCE_DECISION: ScienceEntry[] = [
  { id: "kahneman-2011", icon: Brain, tone: "forest" },
  { id: "klein-2007", icon: Microscope, tone: "gold" },
  { id: "ethical-marketing", icon: GraduationCap, tone: "terracotta" },
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
            {t(`content.spirit-checker.science.card.${id}.name`)}
          </h4>
          <p className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-muted-foreground m-0 mt-0.5">
            {t(`content.spirit-checker.science.card.${id}.source`)}
          </p>
        </div>
      </div>
      <div className={cn("border-l-2 pl-2.5 py-1", accentBorder[tone])}>
        <p className="text-[0.82rem] italic text-ursa-dark-roast m-0 leading-snug">
          {t(`content.spirit-checker.science.card.${id}.finding`)}
        </p>
      </div>
      <p className="text-[0.84rem] leading-relaxed text-foreground/85 m-0">
        {t(`content.spirit-checker.science.card.${id}.apply`)}
      </p>
    </Card>
  );
}
