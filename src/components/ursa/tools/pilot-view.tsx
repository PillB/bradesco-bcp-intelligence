"use client";

import { useState, useMemo, useCallback } from "react";
import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import { BearMark, Pill, Callout, StatBlock, ProgressBar, ArtNouveauDivider, EvidenceTag } from "../ursa-brand";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users, Coffee, Cookie, TrendingUp, TrendingDown, AlertTriangle,
  RotateCcw, Calculator, Target, DollarSign, Info, BookOpen,
  FlaskConical, Scale, ArrowRight, Lightbulb,
} from "lucide-react";

/**
 * Ursa Mañana Business Case — full decision-support tool for the
 * S/. 20/month subscription pilot. Replaces the simpler pilot dashboard.
 *
 * Sections (9 + headline + actions):
 *  - Headline: 5 numbers that decide the pilot
 *  - 01: Cost structure (editable)
 *  - 02: Revenue structure (editable)
 *  - 03: Pilot parameters (editable)
 *  - 04: Calculated outputs (formulas visible)
 *  - 05: Sensitivity analysis (tornado)
 *  - 06: 12-week projection (editable per-week sign-ups)
 *  - 07: 12-month P&L (if pilot graduates)
 *  - 08: Decision framework (go / kill / scale + risks)
 *  - 09: Scientific backing (citations)
 *  - Actions: next steps + cross-links
 *
 * All calculations are live (useMemo) and transparent — every output
 * shows its formula so the owner can argue with the model line by line.
 *
 * Hash route: #/pilot
 */

// ---------- Formatting helpers ----------
const PEN = (n: number) => {
  if (!isFinite(n)) return "∞";
  const sign = n < 0 ? "−" : "";
  return `${sign}S/. ${Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};
const PENd = (n: number) => {
  if (!isFinite(n)) return "∞";
  const sign = n < 0 ? "−" : "";
  return `${sign}S/. ${Math.abs(n).toFixed(2)}`;
};
const NUM = (n: number, d = 1) => {
  if (!isFinite(n)) return "∞";
  return n.toLocaleString(undefined, { maximumFractionDigits: d });
};

// ---------- Defaults ----------
type RampPreset = "linear" | "s-curve" | "aggressive";

interface Inputs {
  // Cost
  greenBeanCost: number;     // S/. / kg green
  roastYieldPct: number;     // %
  doseGrams: number;         // g per cup
  cupCost: number;           // S/. per cup
  baristaWage: number;       // S/. / hour loaded
  baristaMinutes: number;    // min per cup
  overhead: number;          // S/. / month fixed
  // Revenue
  subPrice: number;          // S/. / month
  visitsWeek: number;        // visits/week/subscriber
  cupsPerVisit: number;      // default 1
  attachRate: number;        // %
  sideMargin: number;        // S/. per attach
  retailBeanAttach: number;  // bags/month/subscriber
  retailBeanMargin: number;  // S/. per bag
  cannibalRate: number;      // %
  avgPreSpend: number;       // S/. per visit pre-subscription
  churnRate: number;         // % monthly
  // Pilot params
  pilotWeeks: number;        // weeks
  subCap: number;            // max subscribers
  ramp: RampPreset;
}

const DEFAULTS: Inputs = {
  greenBeanCost: 35,
  roastYieldPct: 85,
  doseGrams: 18,
  cupCost: 0.35,
  baristaWage: 12,
  baristaMinutes: 2.5,
  overhead: 4500,
  subPrice: 20,
  visitsWeek: 3,
  cupsPerVisit: 1,
  attachRate: 60,
  sideMargin: 4.5,
  retailBeanAttach: 0.5,
  retailBeanMargin: 18,
  cannibalRate: 30,
  avgPreSpend: 14,
  churnRate: 8,
  pilotWeeks: 12,
  subCap: 50,
  ramp: "linear",
};

const WEEKS_PER_MONTH = 4.33;
const ASSUMED_CAC = 15;

// ---------- Ramp curve generator ----------
function rampCurve(preset: RampPreset, weeks: number, cap: number): number[] {
  const arr: number[] = [];
  for (let w = 1; w <= weeks; w++) {
    let frac: number;
    if (preset === "linear") {
      frac = w / weeks;
    } else if (preset === "s-curve") {
      // Saturating exponential — front-loaded early adopters, plateaus
      frac = 1 - Math.exp(-2.5 * w / weeks);
    } else {
      // Aggressive — 60% by week 4, then ramps to cap
      frac = 1 - Math.exp(-5 * w / weeks);
    }
    arr.push(Math.round(cap * frac));
  }
  return arr;
}

// ---------- Pure calc function (used for sensitivity too) ----------
interface CalcResult {
  roastCostPerCup: number;
  laborPerCup: number;
  variableCostPerCup: number;
  visitsMonth: number;
  cupsMonth: number;
  coffeeCostMonth: number;
  sideMarginMonth: number;
  retailMarginMonth: number;
  grossProfitMonth: number;
  cannibalLossMonth: number;
  netProfitMonth: number;
  contributionMarginPerCup: number;
  breakEvenSubs: number;
  ltv: number;
  ltvCac: number;
}

function compute(inputs: Inputs): CalcResult {
  const {
    greenBeanCost, roastYieldPct, doseGrams, cupCost,
    baristaWage, baristaMinutes, overhead,
    subPrice, visitsWeek, cupsPerVisit, attachRate, sideMargin,
    retailBeanAttach, retailBeanMargin, cannibalRate, avgPreSpend, churnRate,
  } = inputs;

  const roastCostPerCup = greenBeanCost * (doseGrams / 1000) / (roastYieldPct / 100);
  const laborPerCup = baristaWage * baristaMinutes / 60;
  const variableCostPerCup = roastCostPerCup + cupCost + laborPerCup;

  const visitsMonth = visitsWeek * WEEKS_PER_MONTH;
  const cupsMonth = visitsMonth * cupsPerVisit;
  const coffeeCostMonth = cupsMonth * variableCostPerCup;

  const sideMarginMonth = visitsMonth * (attachRate / 100) * sideMargin;
  const retailMarginMonth = retailBeanAttach * retailBeanMargin;

  const grossProfitMonth = subPrice + sideMarginMonth + retailMarginMonth - coffeeCostMonth;
  const cannibalLossMonth = (cannibalRate / 100) * visitsMonth * avgPreSpend;
  const netProfitMonth = grossProfitMonth - cannibalLossMonth;

  const contributionMarginPerCup = cupsMonth > 0 ? netProfitMonth / cupsMonth : 0;
  const breakEvenSubs = netProfitMonth > 0 ? overhead / netProfitMonth : Infinity;

  // LTV (12-month, churn-adjusted)
  const churn = churnRate / 100;
  let ltv: number;
  if (churn <= 0) {
    ltv = netProfitMonth * 12;
  } else if (churn >= 1) {
    ltv = netProfitMonth;
  } else {
    // Sum of geometric series: netProfitMonth * (1 - (1-churn)^12) / churn
    ltv = netProfitMonth * (1 - Math.pow(1 - churn, 12)) / churn;
  }
  const ltvCac = ASSUMED_CAC > 0 ? ltv / ASSUMED_CAC : Infinity;

  return {
    roastCostPerCup, laborPerCup, variableCostPerCup,
    visitsMonth, cupsMonth, coffeeCostMonth,
    sideMarginMonth, retailMarginMonth, grossProfitMonth,
    cannibalLossMonth, netProfitMonth, contributionMarginPerCup,
    breakEvenSubs, ltv, ltvCac,
  };
}

// ---------- Main component ----------
export function PilotView() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [weeklyOverrides, setWeeklyOverrides] = useState<Record<number, number>>({});

  const update = useCallback(<K extends keyof Inputs>(key: K, value: Inputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs(DEFAULTS);
    setWeeklyOverrides({});
  }, []);

  const calc = useMemo(() => compute(inputs), [inputs]);

  // Weekly ramp (with overrides)
  const weeklySubs = useMemo(() => {
    const base = rampCurve(inputs.ramp, inputs.pilotWeeks, inputs.subCap);
    return base.map((s, i) => weeklyOverrides[i] ?? s);
  }, [inputs.ramp, inputs.pilotWeeks, inputs.subCap, weeklyOverrides]);

  const setWeekSubs = (i: number, v: number) => {
    setWeeklyOverrides((prev) => ({ ...prev, [i]: Math.max(0, Math.min(inputs.subCap * 2, v)) }));
  };

  // Weekly projection
  const weeklyPnL = useMemo(() => {
    const perSubPerWeek = calc.netProfitMonth / WEEKS_PER_MONTH;
    const overheadPerWeek = inputs.overhead / WEEKS_PER_MONTH;
    let cum = 0;
    return weeklySubs.map((subs, i) => {
      const rev = subs * (calc.grossProfitMonth / WEEKS_PER_MONTH);
      const varCost = subs * (calc.coffeeCostMonth / WEEKS_PER_MONTH);
      const cannibal = subs * (calc.cannibalLossMonth / WEEKS_PER_MONTH);
      const overheadWk = overheadPerWeek;
      const net = subs * perSubPerWeek - overheadPerWeek;
      cum += net;
      return { week: i + 1, subs, rev, varCost, overhead: overheadWk, cannibal, net, cumulative: cum };
    });
  }, [weeklySubs, calc, inputs.overhead]);

  const pilotNet = weeklyPnL.length > 0 ? weeklyPnL[weeklyPnL.length - 1].cumulative : 0;
  const breakEvenWeek = useMemo(() => {
    const idx = weeklyPnL.findIndex((w) => w.cumulative >= 0);
    return idx >= 0 ? idx + 1 : null;
  }, [weeklyPnL]);

  // 12-month P&L
  const monthlyPnL = useMemo(() => {
    const rows: Array<{
      month: number; startSubs: number; newSubs: number; churned: number;
      endSubs: number; revenue: number; varCost: number; fixedCost: number; net: number;
    }> = [];
    const cap = 200;
    const churn = inputs.churnRate / 100;
    const perSubRevenue = inputs.subPrice + calc.sideMarginMonth + calc.retailMarginMonth;
    const perSubVarCost = calc.coffeeCostMonth;
    const perSubCannibal = calc.cannibalLossMonth;
    const perSubNet = calc.netProfitMonth;

    // Months 1-3: pilot ramp end-of-month subs (approximated from weekly ramp)
    // Use the week ending in that month (week 4, 8, 12)
    const monthEndWeeks = [4, 8, 12];
    let prevEnd = 0;
    for (let m = 1; m <= 3; m++) {
      const wkIdx = Math.min(monthEndWeeks[m - 1] - 1, weeklySubs.length - 1);
      const endSubs = Math.max(prevEnd, weeklySubs[wkIdx] ?? 0);
      const newSubs = endSubs - prevEnd;
      const churned = 0; // pilot ramp already nets churn into the curve
      const revenue = endSubs * perSubRevenue;
      const varCost = endSubs * perSubVarCost;
      const fixedCost = inputs.overhead;
      const net = endSubs * perSubNet - fixedCost;
      rows.push({ month: m, startSubs: prevEnd, newSubs, churned, endSubs, revenue, varCost, fixedCost, net });
      prevEnd = endSubs;
    }
    // Months 4-12: scale phase
    for (let m = 4; m <= 12; m++) {
      const startSubs = prevEnd;
      const signups = m <= 8 ? 5 : 10;
      const churned = Math.round(startSubs * churn);
      let endSubs = startSubs + signups - churned;
      endSubs = Math.min(endSubs, cap);
      const revenue = endSubs * perSubRevenue;
      const varCost = endSubs * perSubVarCost;
      const fixedCost = inputs.overhead;
      const net = endSubs * perSubNet - fixedCost;
      rows.push({ month: m, startSubs, newSubs: signups, churned, endSubs, revenue, varCost, fixedCost, net });
      prevEnd = endSubs;
    }
    return rows;
  }, [weeklySubs, calc, inputs.overhead, inputs.churnRate, inputs.subPrice]);

  const yearTotals = useMemo(() => {
    return monthlyPnL.reduce(
      (acc, r) => ({
        revenue: acc.revenue + r.revenue,
        varCost: acc.varCost + r.varCost,
        fixedCost: acc.fixedCost + r.fixedCost,
        net: acc.net + r.net,
      }),
      { revenue: 0, varCost: 0, fixedCost: 0, net: 0 }
    );
  }, [monthlyPnL]);

  // Sensitivity (tornado) — one-at-a-time
  const sensitivity = useMemo(() => {
    const base = calc.netProfitMonth;
    const variants: Array<{
      key: string; label: string; lowInput: Inputs; highInput: Inputs;
      low: number; base: number; high: number; swing: number;
    }> = [
      {
        key: "green-bean",
        label: t("content.pilotbiz.sensitivity.var.green-bean"),
        lowInput: { ...inputs, greenBeanCost: inputs.greenBeanCost * 0.8 },
        highInput: { ...inputs, greenBeanCost: inputs.greenBeanCost * 1.2 },
        low: 0, base, high: 0, swing: 0,
      },
      {
        key: "attach",
        label: t("content.pilotbiz.sensitivity.var.attach"),
        lowInput: { ...inputs, attachRate: Math.max(0, inputs.attachRate - 10) },
        highInput: { ...inputs, attachRate: Math.min(100, inputs.attachRate + 10) },
        low: 0, base, high: 0, swing: 0,
      },
      {
        key: "side-margin",
        label: t("content.pilotbiz.sensitivity.var.side-margin"),
        lowInput: { ...inputs, sideMargin: inputs.sideMargin * 0.8 },
        highInput: { ...inputs, sideMargin: inputs.sideMargin * 1.2 },
        low: 0, base, high: 0, swing: 0,
      },
      {
        key: "visits",
        label: t("content.pilotbiz.sensitivity.var.visits"),
        lowInput: { ...inputs, visitsWeek: Math.max(0.5, inputs.visitsWeek - 0.5) },
        highInput: { ...inputs, visitsWeek: inputs.visitsWeek + 0.5 },
        low: 0, base, high: 0, swing: 0,
      },
      {
        key: "cannibal",
        label: t("content.pilotbiz.sensitivity.var.cannibal"),
        lowInput: { ...inputs, cannibalRate: Math.max(0, inputs.cannibalRate - 10) },
        highInput: { ...inputs, cannibalRate: Math.min(100, inputs.cannibalRate + 10) },
        low: 0, base, high: 0, swing: 0,
      },
      {
        key: "churn",
        label: t("content.pilotbiz.sensitivity.var.churn"),
        lowInput: { ...inputs, churnRate: Math.max(0, inputs.churnRate - 5) },
        highInput: { ...inputs, churnRate: inputs.churnRate + 5 },
        low: 0, base, high: 0, swing: 0,
      },
      {
        key: "sub-price",
        label: t("content.pilotbiz.sensitivity.var.sub-price"),
        lowInput: { ...inputs, subPrice: inputs.subPrice - 2 },
        highInput: { ...inputs, subPrice: inputs.subPrice + 2 },
        low: 0, base, high: 0, swing: 0,
      },
    ];
    return variants.map((v) => {
      v.low = compute(v.lowInput).netProfitMonth;
      v.high = compute(v.highInput).netProfitMonth;
      v.swing = Math.abs(v.high - v.low);
      return v;
    }).sort((a, b) => b.swing - a.swing);
  }, [inputs, calc.netProfitMonth, t]);

  // Headline verdict
  const verdict =
    calc.netProfitMonth >= 8 && calc.breakEvenSubs <= inputs.subCap
      ? { label: t("content.pilotbiz.headline.verdict.ok"), tone: "ok" as const, color: "var(--color-ursa-forest-deep)" }
      : calc.netProfitMonth > 0
        ? { label: t("content.pilotbiz.headline.verdict.warn"), tone: "warn" as const, color: "var(--color-ursa-gold)" }
        : { label: t("content.pilotbiz.headline.verdict.stop"), tone: "stop" as const, color: "var(--color-ursa-terracotta)" };

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.pilot.eyebrow")}
        title={<>{t("content.view.pilot.title")}</>}
        lede={<>{t("content.pilotbiz.lede")}</>}
        meta={[
          { label: t("content.pilotbiz.meta.pilot"), value: t("content.pilotbiz.meta.pilot-value") },
          { label: t("content.pilotbiz.meta.price"), value: t("content.pilotbiz.meta.price-value") },
          { label: t("content.pilotbiz.meta.currency"), value: t("content.pilotbiz.meta.currency-value") },
        ]}
        tone="gold"
      />

      <ViewSection>
        <DossierLinkBanner moduleId="08-subscription-economics-and-calculator" />
      </ViewSection>

      {/* ============ HEADLINE ============ */}
      <ViewSection badge={t("content.pilotbiz.section.headline.badge")} title={t("content.pilotbiz.section.headline.title")} meta={t("content.pilotbiz.section.headline.meta")}>
        <Grid cols={4}>
          <Card highlight className="text-center">
            <div className="font-display text-4xl font-semibold leading-none" style={{ color: verdict.color }}>
              {PENd(calc.netProfitMonth)}
            </div>
            <div className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-muted-foreground mt-2">{t("content.pilotbiz.headline.net-profit")}</div>
            <Pill tone={verdict.tone} className="mt-2">{verdict.label}</Pill>
          </Card>
          <StatBlock value={PENd(calc.contributionMarginPerCup)} label={t("content.pilotbiz.headline.contribution")} tone="gold" />
          <StatBlock value={isFinite(calc.breakEvenSubs) ? NUM(calc.breakEvenSubs, 0) : "∞"} label={t("content.pilotbiz.headline.breakeven-subs")} tone="forest" />
          <StatBlock value={breakEvenWeek ? `${breakEvenWeek}` : "—"} label={t("content.pilotbiz.headline.breakeven-weeks")} tone="terracotta" />
        </Grid>
        <Card className="mt-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-muted-foreground block">{t("content.pilotbiz.headline.pilot-net")}</span>
              <span className={cn("font-display text-3xl font-semibold", pilotNet >= 0 ? "text-ursa-forest-deep" : "text-ursa-terracotta-text")}>
                {PEN(pilotNet)}
              </span>
            </div>
            <div className="flex items-center gap-6 text-[0.86rem]">
              <div>
                <span className="font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground block">LTV (12mo)</span>
                <span className="font-display font-semibold text-ursa-dark-roast">{PENd(calc.ltv)}</span>
              </div>
              <div>
                <span className="font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground block">LTV : CAC</span>
                <span className={cn("font-display font-semibold", calc.ltvCac >= 3 ? "text-ursa-forest-deep" : calc.ltvCac >= 2 ? "text-ursa-gold-text" : "text-ursa-terracotta-text")}>
                  {isFinite(calc.ltvCac) ? `${calc.ltvCac.toFixed(1)} : 1` : "∞"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </ViewSection>

      <ArtNouveauDivider />

      {/* ============ SECTION 01: COSTS ============ */}
      <ViewSection badge={t("content.pilotbiz.section.costs.badge")} title={t("content.pilotbiz.section.costs.title")} meta={t("content.pilotbiz.section.costs.meta")}>
        <p className="text-[0.92rem] text-muted-foreground mb-5 max-w-[80ch]">{t("content.pilotbiz.costs.subtitle")}</p>
        <div className="grid lg:grid-cols-2 gap-5 [grid-template-columns:minmax(0,1fr)]">
          <Card>
            <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-ursa-gold-text" /> Cost inputs
            </h3>
            <div className="space-y-5">
              <NumberField label={t("content.pilotbiz.cost.field.green-bean.label")} value={inputs.greenBeanCost} onChange={(v) => update("greenBeanCost", v)} min={10} max={80} step={1} prefix="S/. " hint={t("content.pilotbiz.cost.field.green-bean.hint")} />
              <SliderField label={t("content.pilotbiz.cost.field.roast-yield.label")} value={inputs.roastYieldPct} onChange={(v) => update("roastYieldPct", v)} min={75} max={92} step={1} display={`${inputs.roastYieldPct}%`} hint={t("content.pilotbiz.cost.field.roast-yield.hint")} />
              <NumberField label={t("content.pilotbiz.cost.field.dose.label")} value={inputs.doseGrams} onChange={(v) => update("doseGrams", v)} min={10} max={25} step={0.5} suffix=" g" hint={t("content.pilotbiz.cost.field.dose.hint")} />
              <NumberField label={t("content.pilotbiz.cost.field.cup.label")} value={inputs.cupCost} onChange={(v) => update("cupCost", v)} min={0} max={2} step={0.05} prefix="S/. " hint={t("content.pilotbiz.cost.field.cup.hint")} />
              <NumberField label={t("content.pilotbiz.cost.field.barista-wage.label")} value={inputs.baristaWage} onChange={(v) => update("baristaWage", v)} min={6} max={25} step={0.5} prefix="S/. " hint={t("content.pilotbiz.cost.field.barista-wage.hint")} />
              <SliderField label={t("content.pilotbiz.cost.field.barista-minutes.label")} value={inputs.baristaMinutes} onChange={(v) => update("baristaMinutes", v)} min={1} max={5} step={0.25} display={`${inputs.baristaMinutes.toFixed(2)} min`} hint={t("content.pilotbiz.cost.field.barista-minutes.hint")} />
              <NumberField label={t("content.pilotbiz.cost.field.overhead.label")} value={inputs.overhead} onChange={(v) => update("overhead", v)} min={1500} max={12000} step={100} prefix="S/. " hint={t("content.pilotbiz.cost.field.overhead.hint")} />
            </div>
          </Card>

          {/* Cost trace card */}
          <Card className="bg-gradient-to-br from-ursa-paper to-ursa-cream">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 flex items-center gap-2">
                <Coffee size={18} className="text-ursa-gold-text" /> Cost trace per cup
              </h3>
              <EvidenceTag status="verified" />
            </div>
            <div className="space-y-2.5 text-[0.92rem]">
              <TraceRow label="Roast cost" formula="green × dose / yield" value={PENd(calc.roastCostPerCup)} tone="terracotta" />
              <TraceRow label="Cup + lid" formula="direct input" value={PENd(inputs.cupCost)} tone="terracotta" />
              <TraceRow label="Labor (barista)" formula="wage × min / 60" value={PENd(calc.laborPerCup)} tone="terracotta" />
              <div className="border-t border-ursa-line-soft pt-2.5">
                <TraceRow label="Variable cost / cup" formula="sum of above" value={PENd(calc.variableCostPerCup)} tone="default" bold />
              </div>
            </div>
            <Callout tone="forest" title="Why own-roastery matters">
              <p className="m-0 text-[0.86rem]">
                {`The variable cost per cup sits at ${PENd(calc.variableCostPerCup)} with these inputs. A café buying roasted wholesale would pay S/. 2.50–3.50 per cup — that gap is the structural reason the subscription works at Ursa and would not work at most Lima competitors (SCA benchmark; Module 03).`}
              </p>
            </Callout>
          </Card>
        </div>
      </ViewSection>

      {/* ============ SECTION 02: REVENUE ============ */}
      <ViewSection badge={t("content.pilotbiz.section.revenue.badge")} title={t("content.pilotbiz.section.revenue.title")} meta={t("content.pilotbiz.section.revenue.meta")}>
        <p className="text-[0.92rem] text-muted-foreground mb-5 max-w-[80ch]">{t("content.pilotbiz.rev.subtitle")}</p>
        <div className="grid lg:grid-cols-2 gap-5 [grid-template-columns:minmax(0,1fr)]">
          <Card>
            <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-ursa-gold-text" /> Revenue inputs
            </h3>
            <div className="space-y-5">
              <NumberField label={t("content.pilotbiz.rev.field.sub-price.label")} value={inputs.subPrice} onChange={(v) => update("subPrice", v)} min={10} max={40} step={1} prefix="S/. " hint={t("content.pilotbiz.rev.field.sub-price.hint")} />
              <SliderField label={t("content.pilotbiz.rev.field.visits-week.label")} value={inputs.visitsWeek} onChange={(v) => update("visitsWeek", v)} min={0.5} max={5} step={0.25} display={`${inputs.visitsWeek.toFixed(2)}`} hint={t("content.pilotbiz.rev.field.visits-week.hint")} />
              <SliderField label={t("content.pilotbiz.rev.field.cups-visit.label")} value={inputs.cupsPerVisit} onChange={(v) => update("cupsPerVisit", v)} min={1} max={3} step={1} display={`${inputs.cupsPerVisit}`} hint={t("content.pilotbiz.rev.field.cups-visit.hint")} />
              <SliderField label={t("content.pilotbiz.rev.field.attach-rate.label")} value={inputs.attachRate} onChange={(v) => update("attachRate", v)} min={0} max={100} step={5} display={`${inputs.attachRate}%`} hint={t("content.pilotbiz.rev.field.attach-rate.hint")} />
              <NumberField label={t("content.pilotbiz.rev.field.side-margin.label")} value={inputs.sideMargin} onChange={(v) => update("sideMargin", v)} min={1} max={12} step={0.25} prefix="S/. " hint={t("content.pilotbiz.rev.field.side-margin.hint")} />
              <NumberField label={t("content.pilotbiz.rev.field.retail-attach.label")} value={inputs.retailBeanAttach} onChange={(v) => update("retailBeanAttach", v)} min={0} max={3} step={0.1} suffix=" bags" hint={t("content.pilotbiz.rev.field.retail-attach.hint")} />
              <NumberField label={t("content.pilotbiz.rev.field.retail-margin.label")} value={inputs.retailBeanMargin} onChange={(v) => update("retailBeanMargin", v)} min={5} max={40} step={0.5} prefix="S/. " hint={t("content.pilotbiz.rev.field.retail-margin.hint")} />
              <SliderField label={t("content.pilotbiz.rev.field.cannibal.label")} value={inputs.cannibalRate} onChange={(v) => update("cannibalRate", v)} min={0} max={100} step={5} display={`${inputs.cannibalRate}%`} hint={t("content.pilotbiz.rev.field.cannibal.hint")} />
              <NumberField label={t("content.pilotbiz.rev.field.avg-spend-pre.label")} value={inputs.avgPreSpend} onChange={(v) => update("avgPreSpend", v)} min={6} max={30} step={0.5} prefix="S/. " hint={t("content.pilotbiz.rev.field.avg-spend-pre.hint")} />
              <SliderField label={t("content.pilotbiz.rev.field.churn.label")} value={inputs.churnRate} onChange={(v) => update("churnRate", v)} min={0} max={25} step={1} display={`${inputs.churnRate}%`} hint={t("content.pilotbiz.rev.field.churn.hint")} />
            </div>
          </Card>

          {/* Revenue trace card */}
          <Card className="bg-gradient-to-br from-ursa-paper to-ursa-cream">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 flex items-center gap-2">
                <Cookie size={18} className="text-ursa-gold-text" /> Revenue trace per subscriber / month
              </h3>
              <EvidenceTag status="partial" />
            </div>
            <div className="space-y-2.5 text-[0.92rem]">
              <TraceRow label="Subscription" formula="direct input" value={PENd(inputs.subPrice)} tone="forest" />
              <TraceRow label="Side margin" formula="visits × attach × margin" value={PENd(calc.sideMarginMonth)} tone="forest" />
              <TraceRow label="Retail bean margin" formula="bags × bag margin" value={PENd(calc.retailMarginMonth)} tone="forest" />
              <TraceRow label="Coffee cost" formula="cups × var cost / cup" value={`− ${PENd(calc.coffeeCostMonth)}`} tone="terracotta" />
              <div className="border-t border-ursa-line-soft pt-2.5">
                <TraceRow label="Gross profit" formula="sub + sides + retail − coffee" value={PENd(calc.grossProfitMonth)} tone="default" bold />
              </div>
              <TraceRow label="Cannibalization loss" formula="cannibal% × visits × pre-spend" value={`− ${PENd(calc.cannibalLossMonth)}`} tone="terracotta" />
              <div className="border-t-2 border-ursa-gold/30 pt-2.5">
                <TraceRow label="Net profit" formula="gross − cannibal" value={PENd(calc.netProfitMonth)} tone={calc.netProfitMonth >= 0 ? "forest" : "terracotta"} bold />
              </div>
            </div>
            <Callout tone={calc.netProfitMonth >= 8 ? "forest" : calc.netProfitMonth > 0 ? "warn" : "stop"} title="What this number means">
              <p className="m-0 text-[0.86rem]">
                {calc.netProfitMonth >= 8
                  ? `At ${PENd(calc.netProfitMonth)} per subscriber per month, the model clears the S/. 8 go-criteria threshold. With ${NUM(calc.breakEvenSubs, 0)} subscribers needed to cover overhead, the pilot can graduate at week 12 if the other three criteria hold.`
                  : calc.netProfitMonth > 0
                    ? `At ${PENd(calc.netProfitMonth)} per subscriber per month, the model is positive but below the S/. 8 go-criteria threshold. Either raise the attach rate (push sides), raise the price, or lower the marginal cost.`
                    : `At ${PENd(calc.netProfitMonth)} per subscriber per month, the model is negative. Do not launch the pilot at these inputs — adjust before committing.`}
              </p>
            </Callout>
          </Card>
        </div>
      </ViewSection>

      {/* ============ SECTION 03: PILOT PARAMS ============ */}
      <ViewSection badge={t("content.pilotbiz.section.params.badge")} title={t("content.pilotbiz.section.params.title")} meta={t("content.pilotbiz.section.params.meta")}>
        <p className="text-[0.92rem] text-muted-foreground mb-5 max-w-[80ch]">{t("content.pilotbiz.params.subtitle")}</p>
        <div className="grid md:grid-cols-3 gap-5 [grid-template-columns:minmax(0,1fr)]">
          <Card>
            <NumberField label={t("content.pilotbiz.params.field.pilot-weeks.label")} value={inputs.pilotWeeks} onChange={(v) => update("pilotWeeks", v)} min={4} max={24} step={1} suffix=" wk" hint={t("content.pilotbiz.params.field.pilot-weeks.hint")} />
          </Card>
          <Card>
            <NumberField label={t("content.pilotbiz.params.field.sub-cap.label")} value={inputs.subCap} onChange={(v) => update("subCap", v)} min={20} max={150} step={5} suffix=" subs" hint={t("content.pilotbiz.params.field.sub-cap.hint")} />
          </Card>
          <Card>
            <div>
              <Label className="font-label text-[0.74rem] tracking-[0.08em] uppercase text-ursa-dark-roast">{t("content.pilotbiz.params.field.weeks-month.label")}</Label>
              <div className="font-display text-xl font-semibold text-ursa-dark-roast mt-1">{WEEKS_PER_MONTH}</div>
              <p className="text-[0.78rem] text-muted-foreground m-0 mt-1">{t("content.pilotbiz.params.field.weeks-month.hint")}</p>
            </div>
          </Card>
        </div>

        {/* Ramp preset selector */}
        <Card className="mt-5">
          <Label className="font-label text-[0.74rem] tracking-[0.08em] uppercase text-ursa-dark-roast">{t("content.pilotbiz.params.field.ramp.label")}</Label>
          <p className="text-[0.78rem] text-muted-foreground m-0 mt-1 mb-3">{t("content.pilotbiz.params.field.ramp.hint")}</p>
          <div className="flex flex-wrap gap-3">
            {(["linear", "s-curve", "aggressive"] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  update("ramp", r);
                  setWeeklyOverrides({});
                }}
                className={cn(
                  "px-4 py-2 rounded-full font-label text-[0.72rem] tracking-[0.12em] uppercase border transition",
                  inputs.ramp === r
                    ? "bg-ursa-gold text-ursa-dark-roast border-ursa-gold shadow-md"
                    : "bg-ursa-paper text-ursa-medium-roast border-ursa-line hover:border-ursa-gold"
                )}
              >
                {r === "linear" && t("content.pilotbiz.params.ramp.linear")}
                {r === "s-curve" && t("content.pilotbiz.params.ramp.s-curve")}
                {r === "aggressive" && t("content.pilotbiz.params.ramp.aggressive")}
              </button>
            ))}
          </div>

          {/* Mini ramp preview */}
          <div className="mt-5 flex items-end gap-1 h-24">
            {rampCurve(inputs.ramp, inputs.pilotWeeks, inputs.subCap).map((s, i) => {
              const pct = (s / inputs.subCap) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-ursa-forest-deep to-ursa-forest"
                    style={{ height: `${Math.max(4, pct)}%` }}
                    title={`Week ${i + 1}: ${s} subs`}
                  />
                  <span className="font-label text-[0.5rem] tracking-[0.08em] uppercase text-muted-foreground mt-1">{i + 1}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </ViewSection>

      <ArtNouveauDivider />

      {/* ============ SECTION 04: OUTPUTS ============ */}
      <ViewSection badge={t("content.pilotbiz.section.outputs.badge")} title={t("content.pilotbiz.section.outputs.title")} meta={t("content.pilotbiz.section.outputs.meta")}>
        <p className="text-[0.92rem] text-muted-foreground mb-5 max-w-[80ch]">{t("content.pilotbiz.outputs.subtitle")}</p>
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto ursa-scroll">
            <table className="w-full border-collapse text-[0.86rem] min-w-[680px]">
              <thead>
                <tr className="bg-ursa-foam border-b-2 border-ursa-gold/30">
                  <th className="text-left p-3 font-label text-[0.66rem] tracking-[0.12em] uppercase text-ursa-dark-roast">{t("content.pilotbiz.outputs.col.metric")}</th>
                  <th className="text-left p-3 font-label text-[0.66rem] tracking-[0.12em] uppercase text-ursa-dark-roast">{t("content.pilotbiz.outputs.col.formula")}</th>
                  <th className="text-right p-3 font-label text-[0.66rem] tracking-[0.12em] uppercase text-ursa-dark-roast">{t("content.pilotbiz.outputs.col.value")}</th>
                </tr>
              </thead>
              <tbody>
                <OutputRow label={t("content.pilotbiz.outputs.row.roast-cost.label")} formula={t("content.pilotbiz.outputs.row.roast-cost.formula")} value={PENd(calc.roastCostPerCup)} />
                <OutputRow label={t("content.pilotbiz.outputs.row.labor-per-cup.label")} formula={t("content.pilotbiz.outputs.row.labor-per-cup.formula")} value={PENd(calc.laborPerCup)} />
                <OutputRow label={t("content.pilotbiz.outputs.row.var-cost.label")} formula={t("content.pilotbiz.outputs.row.var-cost.formula")} value={PENd(calc.variableCostPerCup)} bold />
                <OutputRow label={t("content.pilotbiz.outputs.row.visits-month.label")} formula={t("content.pilotbiz.outputs.row.visits-month.formula")} value={NUM(calc.visitsMonth, 1)} />
                <OutputRow label={t("content.pilotbiz.outputs.row.cups-month.label")} formula={t("content.pilotbiz.outputs.row.cups-month.formula")} value={NUM(calc.cupsMonth, 0)} />
                <OutputRow label={t("content.pilotbiz.outputs.row.coffee-cost-month.label")} formula={t("content.pilotbiz.outputs.row.coffee-cost-month.formula")} value={PENd(calc.coffeeCostMonth)} tone="terracotta" />
                <OutputRow label={t("content.pilotbiz.outputs.row.side-margin-month.label")} formula={t("content.pilotbiz.outputs.row.side-margin-month.formula")} value={PENd(calc.sideMarginMonth)} tone="forest" />
                <OutputRow label={t("content.pilotbiz.outputs.row.retail-margin-month.label")} formula={t("content.pilotbiz.outputs.row.retail-margin-month.formula")} value={PENd(calc.retailMarginMonth)} tone="forest" />
                <OutputRow label={t("content.pilotbiz.outputs.row.gross-profit.label")} formula={t("content.pilotbiz.outputs.row.gross-profit.formula")} value={PENd(calc.grossProfitMonth)} bold />
                <OutputRow label={t("content.pilotbiz.outputs.row.cannibal-loss.label")} formula={t("content.pilotbiz.outputs.row.cannibal-loss.formula")} value={`− ${PENd(calc.cannibalLossMonth)}`} tone="terracotta" />
                <OutputRow label={t("content.pilotbiz.outputs.row.net-profit.label")} formula={t("content.pilotbiz.outputs.row.net-profit.formula")} value={PENd(calc.netProfitMonth)} tone={calc.netProfitMonth >= 0 ? "forest" : "terracotta"} bold large />
                <OutputRow label={t("content.pilotbiz.outputs.row.contribution-margin.label")} formula={t("content.pilotbiz.outputs.row.contribution-margin.formula")} value={PENd(calc.contributionMarginPerCup)} />
                <OutputRow label={t("content.pilotbiz.outputs.row.breakeven-subs.label")} formula={t("content.pilotbiz.outputs.row.breakeven-subs.formula")} value={isFinite(calc.breakEvenSubs) ? NUM(calc.breakEvenSubs, 0) : "∞"} bold />
                <OutputRow label={t("content.pilotbiz.outputs.row.breakeven-weeks.label")} formula={t("content.pilotbiz.outputs.row.breakeven-weeks.formula")} value={breakEvenWeek ? `${breakEvenWeek}` : "—"} />
                <OutputRow label={t("content.pilotbiz.outputs.row.ltv.label")} formula={t("content.pilotbiz.outputs.row.ltv.formula")} value={PENd(calc.ltv)} />
                <OutputRow label={t("content.pilotbiz.outputs.row.ltv-cac.label")} formula={t("content.pilotbiz.outputs.row.ltv-cac.formula")} value={isFinite(calc.ltvCac) ? `${calc.ltvCac.toFixed(2)} : 1` : "∞"} tone={calc.ltvCac >= 3 ? "forest" : calc.ltvCac >= 2 ? "gold" : "terracotta"} bold />
              </tbody>
            </table>
          </div>
        </Card>
        <p className="text-[0.78rem] text-muted-foreground mt-3 m-0">
          <Info size={11} className="inline mr-1 text-ursa-gold-text/70" />
          {t("content.pilotbiz.outputs.row.ltv-cac.note")}
        </p>
      </ViewSection>

      {/* ============ SECTION 05: SENSITIVITY ============ */}
      <ViewSection badge={t("content.pilotbiz.section.sensitivity.badge")} title={t("content.pilotbiz.section.sensitivity.title")} meta={t("content.pilotbiz.section.sensitivity.meta")}>
        <p className="text-[0.92rem] text-muted-foreground mb-5 max-w-[80ch]">{t("content.pilotbiz.sensitivity.subtitle")}</p>
        <Card>
          {/* Tornado bars */}
          <div className="space-y-3 mb-6">
            {sensitivity.map((v) => {
              const maxSwing = sensitivity[0].swing || 1;
              const lowPct = (Math.min(v.low, v.high, v.base) / (Math.max(v.low, v.high, v.base) || 1)) * 100;
              const highPct = (Math.max(v.low, v.high) / (Math.max(v.low, v.high, v.base) || 1)) * 100;
              const basePct = (v.base / (Math.max(v.low, v.high, v.base) || 1)) * 100;
              const lowNeg = v.low < 0;
              const highNeg = v.high < 0;
              return (
                <div key={v.key} className="flex items-center gap-3">
                  <span className="font-label text-[0.72rem] tracking-[0.06em] uppercase text-muted-foreground w-56 shrink-0">{v.label}</span>
                  <div className="flex-1 relative h-7">
                    {/* Bar from low to high */}
                    <div
                      className={cn(
                        "absolute h-full rounded",
                        lowNeg || highNeg ? "bg-gradient-to-r from-ursa-terracotta/40 to-ursa-gold/40" : "bg-gradient-to-r from-ursa-forest/30 to-ursa-forest-deep/40"
                      )}
                      style={{ left: `${Math.min(lowPct, basePct)}%`, width: `${Math.abs(highPct - lowPct) || 1}%` }}
                    />
                    {/* Base marker */}
                    <div
                      className="absolute h-full w-0.5 bg-ursa-dark-roast"
                      style={{ left: `${basePct}%` }}
                      title={`Base: ${PENd(v.base)}`}
                    />
                    {/* Labels at ends */}
                    <span className="absolute top-1/2 -translate-y-1/2 text-[0.7rem] font-display font-semibold text-ursa-terracotta-text" style={{ left: `${Math.min(lowPct, basePct)}%`, transform: "translate(-100%, -50%)" }}>
                      {PENd(v.low)}
                    </span>
                    <span className="absolute top-1/2 -translate-y-1/2 text-[0.7rem] font-display font-semibold text-ursa-forest-deep" style={{ left: `${Math.max(highPct, basePct)}%`, transform: "translate(8px, -50%)" }}>
                      {PENd(v.high)}
                    </span>
                  </div>
                  <span className="font-label text-[0.66rem] tracking-[0.1em] uppercase text-muted-foreground w-24 text-right shrink-0">
                    Δ {PENd(v.swing)}
                  </span>
                  {/* Mini bar showing relative swing */}
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden shrink-0">
                    <div className="h-full bg-gradient-to-r from-ursa-gold to-ursa-terracotta rounded-full" style={{ width: `${(v.swing / maxSwing) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Numeric table */}
          <div className="overflow-x-auto ursa-scroll mt-6">
            <table className="w-full border-collapse text-[0.84rem] min-w-[560px]">
              <thead>
                <tr className="border-b-2 border-ursa-gold/30">
                  <th className="text-left p-2 font-label text-[0.66rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.sensitivity.col.variable")}</th>
                  <th className="text-right p-2 font-label text-[0.66rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.sensitivity.col.low")}</th>
                  <th className="text-right p-2 font-label text-[0.66rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.sensitivity.col.base")}</th>
                  <th className="text-right p-2 font-label text-[0.66rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.sensitivity.col.high")}</th>
                  <th className="text-right p-2 font-label text-[0.66rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.sensitivity.col.swing")}</th>
                </tr>
              </thead>
              <tbody>
                {sensitivity.map((v) => (
                  <tr key={v.key} className="border-b border-ursa-line-soft">
                    <td className="p-2 text-ursa-dark-roast">{v.label}</td>
                    <td className={cn("p-2 text-right font-display font-semibold", v.low >= 0 ? "text-ursa-forest-deep" : "text-ursa-terracotta-text")}>{PENd(v.low)}</td>
                    <td className="p-2 text-right font-display font-semibold text-ursa-dark-roast bg-ursa-gold/10">{PENd(v.base)}</td>
                    <td className={cn("p-2 text-right font-display font-semibold", v.high >= 0 ? "text-ursa-forest-deep" : "text-ursa-terracotta-text")}>{PENd(v.high)}</td>
                    <td className="p-2 text-right font-display font-semibold text-ursa-gold-text">{PENd(v.swing)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </ViewSection>

      {/* ============ SECTION 06: WEEKLY PROJECTION ============ */}
      <ViewSection badge={t("content.pilotbiz.section.weekly.badge")} title={t("content.pilotbiz.section.weekly.title")} meta={t("content.pilotbiz.section.weekly.meta")}>
        <p className="text-[0.92rem] text-muted-foreground mb-5 max-w-[80ch]">{t("content.pilotbiz.weekly.subtitle")}</p>
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto ursa-scroll">
            <table className="w-full border-collapse text-[0.82rem] min-w-[720px]">
              <thead>
                <tr className="bg-ursa-foam border-b-2 border-ursa-gold/30">
                  <th className="text-left p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.weekly.col.week")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.weekly.col.subs")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.weekly.col.rev")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.weekly.col.var-cost")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.weekly.col.overhead")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.weekly.col.cannibal")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.weekly.col.net")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.weekly.col.cumulative")}</th>
                </tr>
              </thead>
              <tbody>
                {weeklyPnL.map((w) => {
                  const isBreakEven = breakEvenWeek === w.week;
                  return (
                    <tr key={w.week} className={cn("border-b border-ursa-line-soft hover:bg-muted/30 transition", isBreakEven && "bg-ursa-forest/8")}>
                      <td className="p-2 font-display font-semibold text-ursa-dark-roast">{w.week}</td>
                      <td className="p-2 text-right">
                        <InlineNum value={w.subs} onChange={(v) => setWeekSubs(w.week - 1, v)} min={0} max={inputs.subCap * 2} step={1} />
                      </td>
                      <td className="p-2 text-right text-ursa-forest-deep font-display">{PENd(w.rev)}</td>
                      <td className="p-2 text-right text-ursa-terracotta-text font-display">{PENd(w.varCost)}</td>
                      <td className="p-2 text-right text-ursa-terracotta-text font-display">{PENd(w.overhead)}</td>
                      <td className="p-2 text-right text-ursa-terracotta-text font-display">{PENd(w.cannibal)}</td>
                      <td className={cn("p-2 text-right font-display font-semibold", w.net >= 0 ? "text-ursa-forest-deep" : "text-ursa-terracotta-text")}>{PENd(w.net)}</td>
                      <td className={cn("p-2 text-right font-display font-semibold", w.cumulative >= 0 ? "text-ursa-forest-deep" : "text-ursa-terracotta-text")}>
                        {PENd(w.cumulative)}
                        {isBreakEven && <span className="ml-1 text-[0.6rem] text-ursa-gold-text">▲</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-ursa-foam border-t border-ursa-line-soft">
            <p className="text-[0.78rem] text-muted-foreground m-0">
              {breakEvenWeek
                ? t("content.pilotbiz.weekly.breakeven-reached", { week: breakEvenWeek })
                : t("content.pilotbiz.weekly.breakeven-not-reached")}
            </p>
            <button
              onClick={() => setWeeklyOverrides({})}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label text-[0.64rem] tracking-[0.1em] uppercase text-muted-foreground hover:text-ursa-terracotta-text transition"
            >
              <RotateCcw size={12} /> {t("content.pilotbiz.weekly.reset")}
            </button>
          </div>
        </Card>
      </ViewSection>

      {/* ============ SECTION 07: MONTHLY P&L ============ */}
      <ViewSection badge={t("content.pilotbiz.section.monthly.badge")} title={t("content.pilotbiz.section.monthly.title")} meta={t("content.pilotbiz.section.monthly.meta")}>
        <p className="text-[0.92rem] text-muted-foreground mb-5 max-w-[80ch]">{t("content.pilotbiz.monthly.subtitle")}</p>
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto ursa-scroll">
            <table className="w-full border-collapse text-[0.82rem] min-w-[820px]">
              <thead>
                <tr className="bg-ursa-foam border-b-2 border-ursa-gold/30">
                  <th className="text-left p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.monthly.col.month")}</th>
                  <th className="text-center p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.monthly.pilot-phase")} / {t("content.pilotbiz.monthly.scale-phase")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.monthly.col.start")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.monthly.col.new")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.monthly.col.churned")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.monthly.col.end")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.monthly.col.rev")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.monthly.col.var-cost")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.monthly.col.fixed")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.monthly.col.net")}</th>
                  <th className="text-right p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.monthly.col.cumulative")}</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let cum = 0;
                  return monthlyPnL.map((r) => {
                    cum += r.net;
                    const isPilot = r.month <= 3;
                    return (
                      <tr key={r.month} className={cn("border-b border-ursa-line-soft", isPilot ? "bg-ursa-gold/4" : "bg-ursa-forest/4")}>
                        <td className="p-2 font-display font-semibold text-ursa-dark-roast">{r.month}</td>
                        <td className="p-2 text-center">
                          <Pill tone={isPilot ? "gold" : "forest"} className="text-[0.56rem]">
                            {isPilot ? t("content.pilotbiz.monthly.pilot-phase") : t("content.pilotbiz.monthly.scale-phase")}
                          </Pill>
                        </td>
                        <td className="p-2 text-right tabular-nums">{r.startSubs}</td>
                        <td className="p-2 text-right tabular-nums text-ursa-forest-deep">+{r.newSubs}</td>
                        <td className="p-2 text-right tabular-nums text-ursa-terracotta-text">−{r.churned}</td>
                        <td className="p-2 text-right tabular-nums font-display font-semibold text-ursa-dark-roast">{r.endSubs}</td>
                        <td className="p-2 text-right text-ursa-forest-deep font-display">{PEN(r.revenue)}</td>
                        <td className="p-2 text-right text-ursa-terracotta-text font-display">{PEN(r.varCost)}</td>
                        <td className="p-2 text-right text-ursa-terracotta-text font-display">{PEN(r.fixedCost)}</td>
                        <td className={cn("p-2 text-right font-display font-semibold", r.net >= 0 ? "text-ursa-forest-deep" : "text-ursa-terracotta-text")}>{PEN(r.net)}</td>
                        <td className={cn("p-2 text-right font-display font-semibold", cum >= 0 ? "text-ursa-forest-deep" : "text-ursa-terracotta-text")}>{PEN(cum)}</td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-ursa-gold/40 bg-ursa-foam">
                  <td colSpan={6} className="p-3 font-label text-[0.7rem] tracking-[0.14em] uppercase text-ursa-dark-roast">{t("content.pilotbiz.monthly.year-totals")}</td>
                  <td className="p-3 text-right font-display font-semibold text-ursa-forest-deep">{PEN(yearTotals.revenue)}</td>
                  <td className="p-3 text-right font-display font-semibold text-ursa-terracotta-text">{PEN(yearTotals.varCost)}</td>
                  <td className="p-3 text-right font-display font-semibold text-ursa-terracotta-text">{PEN(yearTotals.fixedCost)}</td>
                  <td className={cn("p-3 text-right font-display font-bold", yearTotals.net >= 0 ? "text-ursa-forest-deep" : "text-ursa-terracotta-text")}>{PEN(yearTotals.net)}</td>
                  <td className="p-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
        <div className="grid sm:grid-cols-2 gap-4 mt-5 [grid-template-columns:minmax(0,1fr)]">
          <Card className="text-center">
            <div className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-muted-foreground">{t("content.pilotbiz.monthly.year-revenue")}</div>
            <div className="font-display text-3xl font-semibold text-ursa-forest-deep mt-1">{PEN(yearTotals.revenue)}</div>
          </Card>
          <Card className="text-center">
            <div className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-muted-foreground">{t("content.pilotbiz.monthly.year-net")}</div>
            <div className={cn("font-display text-3xl font-semibold mt-1", yearTotals.net >= 0 ? "text-ursa-forest-deep" : "text-ursa-terracotta-text")}>{PEN(yearTotals.net)}</div>
          </Card>
        </div>
      </ViewSection>

      <ArtNouveauDivider />

      {/* ============ SECTION 08: DECISION FRAMEWORK ============ */}
      <ViewSection badge={t("content.pilotbiz.section.decision.badge")} title={t("content.pilotbiz.section.decision.title")} meta={t("content.pilotbiz.section.decision.meta")}>
        <div className="grid md:grid-cols-3 gap-5 [grid-template-columns:minmax(0,1fr)]">
          <Card className="border-ursa-forest-deep/40">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-full bg-ursa-forest-deep/12 text-ursa-forest-deep grid place-items-center"><TrendingUp size={16} /></span>
              <h4 className="font-display text-base font-semibold text-ursa-dark-roast m-0">{t("content.pilotbiz.decision.go.title")}</h4>
            </div>
            <p className="text-[0.84rem] text-muted-foreground m-0 leading-relaxed">{t("content.pilotbiz.decision.go.body")}</p>
            <div className="mt-3 pt-3 border-t border-ursa-line-soft space-y-1.5 text-[0.78rem]">
              <DecisionCheck ok={calc.netProfitMonth >= 8} label={`Net profit ≥ S/. 8`} value={PENd(calc.netProfitMonth)} />
              <DecisionCheck ok={inputs.attachRate >= 45} label={`Attach ≥ 45%`} value={`${inputs.attachRate}%`} />
              <DecisionCheck ok={inputs.cannibalRate <= 40} label={`Cannibal ≤ 40%`} value={`${inputs.cannibalRate}%`} />
              <DecisionCheck ok={inputs.churnRate <= 8} label={`Churn ≤ 8%`} value={`${inputs.churnRate}%`} />
            </div>
          </Card>

          <Card className="border-ursa-terracotta/40">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-full bg-ursa-terracotta/12 text-ursa-terracotta-text grid place-items-center"><AlertTriangle size={16} /></span>
              <h4 className="font-display text-base font-semibold text-ursa-dark-roast m-0">{t("content.pilotbiz.decision.kill.title")}</h4>
            </div>
            <p className="text-[0.84rem] text-muted-foreground m-0 leading-relaxed">{t("content.pilotbiz.decision.kill.body")}</p>
            <div className="mt-3 pt-3 border-t border-ursa-line-soft space-y-1.5 text-[0.78rem]">
              <DecisionCheck ok={calc.netProfitMonth >= 0} inverted label={`Net profit ≥ 0`} value={PENd(calc.netProfitMonth)} />
              <DecisionCheck ok={inputs.attachRate >= 40} inverted label={`Attach ≥ 40%`} value={`${inputs.attachRate}%`} />
              <DecisionCheck ok={inputs.cannibalRate <= 50} inverted label={`Cannibal ≤ 50%`} value={`${inputs.cannibalRate}%`} />
              <DecisionCheck ok={inputs.churnRate <= 15} inverted label={`Churn ≤ 15%`} value={`${inputs.churnRate}%`} />
            </div>
          </Card>

          <Card className="border-ursa-gold">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-full bg-ursa-gold/18 text-ursa-gold-text grid place-items-center"><Scale size={16} /></span>
              <h4 className="font-display text-base font-semibold text-ursa-dark-roast m-0">{t("content.pilotbiz.decision.scale.title")}</h4>
            </div>
            <p className="text-[0.84rem] text-muted-foreground m-0 leading-relaxed">{t("content.pilotbiz.decision.scale.body")}</p>
            <div className="mt-3 pt-3 border-t border-ursa-line-soft">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-muted-foreground">Cap ceiling (year-1)</span>
                <span className="font-display font-semibold text-ursa-dark-roast">200 subs</span>
              </div>
              <ProgressBar value={Math.min(100, (monthlyPnL[monthlyPnL.length - 1]?.endSubs || 0) / 2)} tone="gold" />
            </div>
          </Card>
        </div>

        {/* Risk register */}
        <Card className="mt-6">
          <h4 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-ursa-terracotta-text" /> {t("content.pilotbiz.decision.risk.title")}
          </h4>
          <div className="overflow-x-auto ursa-scroll">
            <table className="w-full border-collapse text-[0.84rem] min-w-[720px]">
              <thead>
                <tr className="border-b-2 border-ursa-gold/30">
                  <th className="text-left p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground w-8">#</th>
                  <th className="text-left p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.decision.risk.col.risk")}</th>
                  <th className="text-left p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.decision.risk.col.prob")}</th>
                  <th className="text-left p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.decision.risk.col.impact")}</th>
                  <th className="text-left p-2 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.pilotbiz.decision.risk.col.mitigation")}</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-ursa-line-soft align-top">
                    <td className="p-2 font-display font-semibold text-ursa-gold-text">{i}</td>
                    <td className="p-2 text-ursa-dark-roast font-medium">{t(`content.pilotbiz.decision.risk.${i}.name`)}</td>
                    <td className="p-2">
                      <RiskBadge level={t(`content.pilotbiz.decision.risk.${i}.prob`)} />
                    </td>
                    <td className="p-2 text-[0.82rem] text-muted-foreground">{t(`content.pilotbiz.decision.risk.${i}.impact`)}</td>
                    <td className="p-2 text-[0.82rem] text-muted-foreground">{t(`content.pilotbiz.decision.risk.${i}.mitig`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </ViewSection>

      {/* ============ SECTION 09: SCIENTIFIC BACKING ============ */}
      <ViewSection badge={t("content.pilotbiz.section.science.badge")} title={t("content.pilotbiz.section.science.title")} meta={t("content.pilotbiz.section.science.meta")}>
        <p className="text-[0.92rem] text-muted-foreground mb-5 max-w-[80ch]">{t("content.pilotbiz.science.subtitle")}</p>
        <Tabs defaultValue="subscription">
          <TabsList className="bg-muted overflow-x-auto ursa-scroll justify-start sm:justify-center flex-nowrap max-w-full">
            <TabsTrigger value="subscription">
              <BookOpen size={12} className="mr-1.5" /> {t("content.pilotbiz.science.tab.subscription")}
            </TabsTrigger>
            <TabsTrigger value="coffee">
              <Coffee size={12} className="mr-1.5" /> {t("content.pilotbiz.science.tab.coffee")}
            </TabsTrigger>
            <TabsTrigger value="behavioral">
              <FlaskConical size={12} className="mr-1.5" /> {t("content.pilotbiz.science.tab.behavioral")}
            </TabsTrigger>
            <TabsTrigger value="pricing">
              <DollarSign size={12} className="mr-1.5" /> {t("content.pilotbiz.science.tab.pricing")}
            </TabsTrigger>
            <TabsTrigger value="methods">
              <Calculator size={12} className="mr-1.5" /> {t("content.pilotbiz.science.tab.methods")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="mt-6">
            <ScienceCard title={t("content.pilotbiz.science.subscription.title")}>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <ScienceItem key={i} num={i} text={t(`content.pilotbiz.science.subscription.${i}`)} />
              ))}
            </ScienceCard>
          </TabsContent>
          <TabsContent value="coffee" className="mt-6">
            <ScienceCard title={t("content.pilotbiz.science.coffee.title")}>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <ScienceItem key={i} num={i} text={t(`content.pilotbiz.science.coffee.${i}`)} />
              ))}
            </ScienceCard>
          </TabsContent>
          <TabsContent value="behavioral" className="mt-6">
            <ScienceCard title={t("content.pilotbiz.science.behavioral.title")}>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <ScienceItem key={i} num={i} text={t(`content.pilotbiz.science.behavioral.${i}`)} />
              ))}
            </ScienceCard>
          </TabsContent>
          <TabsContent value="pricing" className="mt-6">
            <ScienceCard title={t("content.pilotbiz.science.pricing.title")}>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <ScienceItem key={i} num={i} text={t(`content.pilotbiz.science.pricing.${i}`)} />
              ))}
            </ScienceCard>
          </TabsContent>
          <TabsContent value="methods" className="mt-6">
            <ScienceCard title={t("content.pilotbiz.science.methods.title")}>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <ScienceItem key={i} num={i} text={t(`content.pilotbiz.science.methods.${i}`)} />
              ))}
            </ScienceCard>
          </TabsContent>
        </Tabs>
      </ViewSection>

      {/* ============ ACTIONS ============ */}
      <ViewSection badge={t("content.pilotbiz.section.actions.badge")} title={t("content.pilotbiz.section.actions.title")}>
        <p className="text-[0.92rem] text-muted-foreground mb-5 max-w-[80ch]">{t("content.pilotbiz.actions.subtitle")}</p>

        <Callout tone="gold" title={t("content.pilotbiz.assumption.callout.title")}>
          <p className="m-0 text-[0.9rem]">{t("content.pilotbiz.assumption.callout.body")}</p>
        </Callout>

        {/* Offer-value lens — what the pilot is testing in offer-value terms */}
        <div className="mt-6 rounded-lg border border-ursa-gold/40 bg-gradient-to-br from-ursa-paper to-ursa-cream p-5">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <span className="font-label text-[0.62rem] tracking-[0.16em] uppercase text-ursa-gold-text">{t("content.pilotbiz.lens.badge")}</span>
            <EvidenceTag status="verified" />
          </div>
          <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-2">{t("content.pilotbiz.lens.title")}</h3>
          <p className="text-[0.9rem] text-foreground/85 leading-relaxed m-0">
            {t("content.pilotbiz.lens.body")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ursa-terracotta/40 text-ursa-terracotta-text font-label text-[0.74rem] tracking-[0.12em] uppercase hover:bg-ursa-terracotta hover:text-ursa-cream transition"
          >
            <RotateCcw size={14} /> {t("content.pilotbiz.actions.button.reset")}
          </button>
          <button
            onClick={() => navigate("calculator")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ursa-forest-deep/40 text-ursa-forest-deep font-label text-[0.74rem] tracking-[0.12em] uppercase hover:bg-ursa-dark-roast hover:text-ursa-cream transition"
          >
            <Calculator size={14} /> {t("content.pilotbiz.actions.button.calculator")}
          </button>
          <button
            onClick={() => navigate("experiments")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ursa-forest-deep/40 text-ursa-forest-deep font-label text-[0.74rem] tracking-[0.12em] uppercase hover:bg-ursa-dark-roast hover:text-ursa-cream transition"
          >
            <Target size={14} /> {t("content.pilotbiz.actions.button.experiments")}
          </button>
          <button
            onClick={() => navigate("landing")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ursa-gold text-ursa-dark-roast font-label text-[0.74rem] tracking-[0.12em] uppercase hover:bg-ursa-gold-soft transition shadow-lg"
          >
            <ArrowRight size={14} /> {t("content.pilotbiz.actions.button.landing")}
          </button>
        </div>
      </ViewSection>
    </>
  );
}

// ============ Sub-components ============

function NumberField({
  label, value, onChange, min, max, step, prefix, suffix, hint,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number;
  prefix?: string; suffix?: string; hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <Label className="font-label text-[0.74rem] tracking-[0.08em] uppercase text-ursa-dark-roast">{label}</Label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-[0.8rem] text-muted-foreground">{prefix}</span>}
          <Input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="w-24 h-8 text-right font-display font-semibold text-ursa-dark-roast"
          />
          {suffix && <span className="text-[0.78rem] text-muted-foreground">{suffix}</span>}
        </div>
      </div>
      {hint && <p className="text-[0.76rem] text-muted-foreground m-0 leading-snug">{hint}</p>}
    </div>
  );
}

function SliderField({
  label, value, onChange, min, max, step, display, hint,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number;
  display: string; hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <Label className="font-label text-[0.74rem] tracking-[0.08em] uppercase text-ursa-dark-roast">{label}</Label>
        <span className="font-display font-semibold text-ursa-dark-roast text-[0.95rem]">{display}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} className="py-1" />
      {hint && <p className="text-[0.76rem] text-muted-foreground m-0 mt-1 leading-snug">{hint}</p>}
    </div>
  );
}

function TraceRow({
  label, formula, value, tone = "default", bold = false,
}: {
  label: string; formula: string; value: string;
  tone?: "default" | "forest" | "terracotta"; bold?: boolean;
}) {
  const tones = {
    default: "text-ursa-dark-roast",
    forest: "text-ursa-forest-deep",
    terracotta: "text-ursa-terracotta-text",
  };
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="min-w-0 flex-1">
        <span className={cn("font-medium", bold && "font-semibold", tones[tone])}>{label}</span>
        <span className="block text-[0.7rem] text-muted-foreground italic">{formula}</span>
      </div>
      <span className={cn("font-display tabular-nums shrink-0", bold ? "text-lg font-bold" : "text-base font-semibold", tones[tone])}>{value}</span>
    </div>
  );
}

function OutputRow({
  label, formula, value, tone = "default", bold = false, large = false,
}: {
  label: string; formula: string; value: string;
  tone?: "default" | "forest" | "terracotta" | "gold"; bold?: boolean; large?: boolean;
}) {
  const tones = {
    default: "text-ursa-dark-roast",
    forest: "text-ursa-forest-deep",
    terracotta: "text-ursa-terracotta-text",
    gold: "text-ursa-gold-text",
  };
  return (
    <tr className="border-b border-ursa-line-soft hover:bg-muted/20">
      <td className="p-3">
        <div className={cn("font-medium", bold && "font-semibold text-ursa-dark-roast", tones[tone])}>{label}</div>
      </td>
      <td className="p-3">
        <code className="text-[0.78rem] text-muted-foreground font-mono bg-muted/40 px-1.5 py-0.5 rounded">{formula}</code>
      </td>
      <td className={cn(
        "p-3 text-right font-display tabular-nums",
        large ? "text-xl" : "text-base",
        bold ? "font-bold" : "font-semibold",
        tones[tone]
      )}>
        {value}
      </td>
    </tr>
  );
}

function InlineNum({
  value, onChange, min = 0, max = 999, step = 1,
}: {
  value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
      className="w-16 h-7 text-right rounded-md border border-ursa-line bg-ursa-foam px-2 font-display font-semibold text-ursa-dark-roast focus:outline-none focus:border-ursa-gold focus:ring-1 focus:ring-ursa-gold/30 tabular-nums"
    />
  );
}

function DecisionCheck({
  ok, label, value, inverted = false,
}: {
  ok: boolean; label: string; value: string; inverted?: boolean;
}) {
  // inverted = true means "ok" is the SAFE state (kill criteria not triggered)
  const safe = inverted ? ok : ok;
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <span className={cn("w-3 h-3 rounded-full grid place-items-center", safe ? "bg-ursa-forest-deep/20 text-ursa-forest-deep" : "bg-ursa-terracotta/20 text-ursa-terracotta-text")}>
          {safe ? "✓" : "!"}
        </span>
        {label}
      </span>
      <span className={cn("font-display font-semibold", safe ? "text-ursa-forest-deep" : "text-ursa-terracotta-text")}>{value}</span>
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const lower = level.toLowerCase();
  const tone = lower.startsWith("h") ? "stop" : lower.startsWith("m") ? "warn" : "ok";
  return <Pill tone={tone as "stop" | "warn" | "ok"}>{level}</Pill>;
}

function ScienceCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={18} className="text-ursa-gold-text" />
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast m-0">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

function ScienceItem({ num, text }: { num: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 w-7 h-7 rounded-full bg-ursa-gold/15 text-ursa-gold-text grid place-items-center font-display text-sm font-semibold">
        {num}
      </span>
      <p className="text-[0.88rem] text-foreground/85 m-0 leading-relaxed flex-1">{text}</p>
    </div>
  );
}
