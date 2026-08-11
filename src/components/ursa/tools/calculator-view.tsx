"use client";

import { useState, useMemo } from "react";
import type { ComponentType } from "react";
import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import { Pill, Callout, StatBlock, EvidenceTag, SectionBadge } from "../ursa-brand";
import { Calculator, Coffee, TrendingUp, AlertTriangle, Sparkles, RotateCcw, Info, Repeat, Infinity as InfinityIcon, Scale, BookOpen, Target, Layers, Droplet, Brain, Split, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

const PEN = (n: number) => {
  if (!isFinite(n)) return "—";
  return `S/. ${n.toFixed(2)}`;
};

const PRESETS = {
  conservative: { subPrice: 20, costPerCup: 1.8, visitsWeek: 2.5, cupsVisit: 1, attachRate: 50, sideMargin: 4.5, cannibal: 40, avgSpendPre: 14 },
  default: { subPrice: 20, costPerCup: 1.5, visitsWeek: 3, cupsVisit: 1, attachRate: 60, sideMargin: 4.5, cannibal: 30, avgSpendPre: 14 },
  optimistic: { subPrice: 25, costPerCup: 1.2, visitsWeek: 3.5, cupsVisit: 1, attachRate: 70, sideMargin: 5, cannibal: 20, avgSpendPre: 16 },
};

type Inputs = typeof PRESETS.default;

export function CalculatorView() {
  const { t } = useI18n();
  const [inputs, setInputs] = useState<Inputs>(PRESETS.default);
  const [weeksMonth] = useState(4.33);

  const update = <K extends keyof Inputs>(key: K, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const calc = useMemo(() => {
    const { subPrice, costPerCup, visitsWeek, cupsVisit, attachRate, sideMargin, cannibal, avgSpendPre } = inputs;
    const visitsMonth = visitsWeek * weeksMonth;
    const cupsMonth = visitsMonth * cupsVisit;
    const coffeeCost = cupsMonth * costPerCup;
    const sideMarginTotal = visitsMonth * (attachRate / 100) * sideMargin;
    const netProfit = subPrice + sideMarginTotal - coffeeCost;

    const breakevenNoSides = costPerCup > 0 ? subPrice / costPerCup : Infinity;
    const freeCapacity = costPerCup > 0 ? (subPrice + sideMarginTotal) / costPerCup : Infinity;

    let cutoffAttach = NaN;
    if (sideMargin > 0 && visitsMonth > 0) {
      cutoffAttach = ((coffeeCost - subPrice) * 100) / (visitsMonth * sideMargin);
    }

    const cannibalProfit = netProfit + (cannibal / 100) * (subPrice - avgSpendPre);

    let recoverMonths: number;
    if (cannibalProfit < 0 && netProfit > 0) {
      recoverMonths = Math.abs(cannibalProfit) / netProfit;
    } else if (cannibalProfit >= 0) {
      recoverMonths = 0;
    } else {
      recoverMonths = Infinity;
    }

    return { visitsMonth, cupsMonth, coffeeCost, sideMarginTotal, netProfit, breakevenNoSides, freeCapacity, cutoffAttach, cannibalProfit, recoverMonths };
  }, [inputs, weeksMonth]);

  // Sensitivity table data
  const sensitivity = useMemo(() => {
    const attachRates = [0, 20, 40, 60, 80, 100];
    const visitOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    const rows = visitOptions.map((vw) => {
      const cells = attachRates.map((ar) => {
        const vm = vw * weeksMonth;
        const cc = vm * inputs.cupsVisit * inputs.costPerCup;
        const sm = vm * (ar / 100) * inputs.sideMargin;
        const np = inputs.subPrice + sm - cc;
        return { value: np, isCurrent: Math.abs(vw - inputs.visitsWeek) < 0.01 && Math.abs(ar - inputs.attachRate) < 1 };
      });
      return { visits: vw, cells, isCurrentRow: Math.abs(vw - inputs.visitsWeek) < 0.01 };
    });
    return { attachRates, rows };
  }, [inputs, weeksMonth]);

  // Scale projection: profit at N subscribers
  const scaleProjection = useMemo(() => {
    const subscriberCounts = [25, 50, 100, 200, 500];
    return subscriberCounts.map((n) => ({
      subscribers: n,
      monthlyProfit: calc.cannibalProfit * n,
      cupsPerMonth: calc.cupsMonth * n,
    }));
  }, [calc]);

  const cellClass = (v: number) =>
    v > 1 ? "bg-ursa-dark-roast/15 text-ursa-forest-deep font-semibold" : v < -1 ? "bg-ursa-terracotta/15 text-ursa-medium-roast font-semibold" : "bg-muted text-muted-foreground";

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.calculator.eyebrow")}
        title={t("content.view.calculator.title")}
        lede={<>{t("content.calculator.lede")}</>}
        meta={[
          { label: t("content.calculator.meta.pilot"), value: t("content.calculator.meta.pilot-value") },
          { label: t("content.calculator.meta.default"), value: t("content.calculator.meta.default-value") },
          { label: t("content.calculator.meta.cost"), value: t("content.calculator.meta.cost-value") },
        ]}
      />

      <ViewSection>
        <DossierLinkBanner moduleId="08-subscription-economics-and-calculator" />
      </ViewSection>

      {/* Presets */}
      <ViewSection>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="font-label text-[0.7rem] tracking-[0.16em] uppercase text-muted-foreground">{t("content.calculator.presets.label")}</span>
          {(["conservative", "default", "optimistic"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setInputs(PRESETS[p])}
              className={cn(
                "px-4 py-2 rounded-full font-label text-[0.7rem] tracking-[0.12em] uppercase border transition",
                "hover:-translate-y-0.5"
              )}
              style={{
                borderColor: "var(--color-ursa-gold)",
                background: "var(--color-ursa-paper)",
                color: "var(--color-ursa-medium-roast)",
              }}
            >
              {p === "conservative" && t("content.calculator.preset.conservative")}
              {p === "default" && t("content.calculator.preset.default")}
              {p === "optimistic" && t("content.calculator.preset.optimistic")}
            </button>
          ))}
          <button
            onClick={() => setInputs(PRESETS.default)}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-full font-label text-[0.7rem] tracking-[0.12em] uppercase text-muted-foreground hover:text-ursa-dark-roast transition"
          >
            <RotateCcw size={13} /> {t("content.calculator.action.reset")}
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 items-start">
          {/* INPUTS */}
          <Card>
            <h3 className="font-display text-xl font-semibold text-ursa-dark-roast mt-0 mb-1 flex items-center gap-2">
              <Calculator size={20} className="text-ursa-gold-text" /> {t("content.calculator.inputs.title")}
            </h3>
            <p className="text-[0.85rem] text-muted-foreground mb-5">{t("content.calculator.inputs.subtitle")}</p>

            <div className="space-y-5">
              {/* Subscription price */}
              <NumberField label={t("content.calculator.field.subPrice.label")} value={inputs.subPrice} onChange={(v) => update("subPrice", v)} min={5} max={60} step={1} prefix="S/. " hint={t("content.calculator.field.subPrice.hint")} />
              {/* Cost per cup */}
              <NumberField label={t("content.calculator.field.costPerCup.label")} value={inputs.costPerCup} onChange={(v) => update("costPerCup", v)} min={0.3} max={4} step={0.05} prefix="S/. " hint={t("content.calculator.field.costPerCup.hint")} />

              <SliderField label={t("content.calculator.field.visitsWeek.label")} value={inputs.visitsWeek} onChange={(v) => update("visitsWeek", v)} min={0.5} max={5} step={0.5} display={`${inputs.visitsWeek.toFixed(1)}`} hint={t("content.calculator.field.visitsWeek.hint")} />
              <SliderField label={t("content.calculator.field.cupsVisit.label")} value={inputs.cupsVisit} onChange={(v) => update("cupsVisit", v)} min={1} max={3} step={1} display={`${inputs.cupsVisit}`} hint={t("content.calculator.field.cupsVisit.hint")} />

              <SliderField label={t("content.calculator.field.attachRate.label")} value={inputs.attachRate} onChange={(v) => update("attachRate", v)} min={0} max={100} step={5} display={`${inputs.attachRate}%`} hint={t("content.calculator.field.attachRate.hint")} />
              <NumberField label={t("content.calculator.field.sideMargin.label")} value={inputs.sideMargin} onChange={(v) => update("sideMargin", v)} min={1} max={12} step={0.25} prefix="S/. " hint={t("content.calculator.field.sideMargin.hint")} />

              <SliderField label={t("content.calculator.field.cannibal.label")} value={inputs.cannibal} onChange={(v) => update("cannibal", v)} min={0} max={100} step={5} display={`${inputs.cannibal}%`} hint={t("content.calculator.field.cannibal.hint")} />
              <NumberField label={t("content.calculator.field.avgSpendPre.label")} value={inputs.avgSpendPre} onChange={(v) => update("avgSpendPre", v)} min={6} max={30} step={0.5} prefix="S/. " hint={t("content.calculator.field.avgSpendPre.hint")} />
            </div>

            <Callout tone="warn" title={t("content.calculator.callout.side.title")}>
              <p className="m-0">{t("content.calculator.callout.side.body")}</p>
            </Callout>
          </Card>

          {/* OUTPUTS */}
          <div className="space-y-5">
            {/* Headline profit */}
            <Card highlight className="bg-gradient-to-br from-ursa-paper to-ursa-cream">
              <div className="flex items-center justify-between mb-1">
                <span className="font-label text-[0.7rem] tracking-[0.18em] uppercase text-ursa-gold-text">{t("content.calculator.outputs.profit.label")}</span>
                <EvidenceTag status="verified" />
              </div>
              <div className={cn("font-display text-5xl font-semibold leading-none mb-2", calc.netProfit >= 0 ? "text-ursa-forest-deep" : "text-ursa-terracotta-text")}>
                {PEN(calc.netProfit)}
              </div>
              <p className="text-[0.85rem] text-muted-foreground m-0">
                {calc.netProfit >= 0
                  ? t("content.calculator.outputs.profit.body-positive")
                  : t("content.calculator.outputs.profit.body-negative")}
              </p>
            </Card>

            {/* Key metrics grid */}
            <Grid cols={2}>
              <MiniMetric icon={<Coffee size={16} />} label={t("content.calculator.metric.visits")} value={calc.visitsMonth.toFixed(1)} tone="neutral" />
              <MiniMetric icon={<Coffee size={16} />} label={t("content.calculator.metric.cups")} value={calc.cupsMonth.toFixed(0)} tone="neutral" />
              <MiniMetric icon={<TrendingUp size={16} />} label={t("content.calculator.metric.coffee-cost")} value={PEN(calc.coffeeCost)} tone="terracotta" />
              <MiniMetric icon={<Sparkles size={16} />} label={t("content.calculator.metric.side-margin")} value={PEN(calc.sideMarginTotal)} tone="forest" />
              <MiniMetric icon={<Info size={16} />} label={t("content.calculator.metric.breakeven")} value={isFinite(calc.breakevenNoSides) ? `${calc.breakevenNoSides.toFixed(1)} cups` : "∞"} tone="neutral" />
              <MiniMetric icon={<Info size={16} />} label={t("content.calculator.metric.free-capacity")} value={isFinite(calc.freeCapacity) ? `${calc.freeCapacity.toFixed(1)} cups` : "∞"} tone="forest" />
            </Grid>

            {/* Cutoff attach */}
            <Card>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-display text-base font-semibold text-ursa-dark-roast m-0">{t("content.calculator.cutoff.title")}</h4>
                <Pill tone={isFinite(calc.cutoffAttach) && calc.cutoffAttach <= inputs.attachRate ? "ok" : "warn"}>
                  {isFinite(calc.cutoffAttach) ? `${calc.cutoffAttach.toFixed(0)}%` : "n/a"}
                </Pill>
              </div>
              <p className="text-[0.85rem] text-muted-foreground m-0">
                {isFinite(calc.cutoffAttach)
                  ? calc.cutoffAttach <= inputs.attachRate
                    ? t("content.calculator.cutoff.body-above", { delta: (inputs.attachRate - calc.cutoffAttach).toFixed(0) })
                    : t("content.calculator.cutoff.body-below", { delta: (calc.cutoffAttach - inputs.attachRate).toFixed(0) })
                  : t("content.calculator.cutoff.body-na")}
              </p>
            </Card>

            {/* Cannibalization */}
            <Card className="bg-ursa-foam">
              <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
                <AlertTriangle size={16} className="text-ursa-gold-text" /> {t("content.calculator.cannibal.title")}
              </h4>
              <div className="flex items-baseline gap-3 mb-2">
                <span className={cn("font-display text-3xl font-semibold", calc.cannibalProfit >= 0 ? "text-ursa-forest-deep" : "text-ursa-terracotta-text")}>
                  {PEN(calc.cannibalProfit)}
                </span>
                <span className="text-[0.8rem] text-muted-foreground">{t("content.calculator.cannibal.subtitle")}</span>
              </div>
              <p className="text-[0.85rem] text-muted-foreground m-0">
                {calc.cannibalProfit >= 0
                  ? t("content.calculator.cannibal.body-positive", { cannibal: inputs.cannibal })
                  : t("content.calculator.cannibal.body-negative", { cannibal: inputs.cannibal })}
              </p>
              <div className="mt-3 pt-3 border-t border-ursa-line-soft flex items-center justify-between">
                <span className="font-label text-[0.7rem] tracking-[0.12em] uppercase text-muted-foreground">{t("content.calculator.cannibal.recovery-label")}</span>
                <span className="font-display text-base font-semibold text-ursa-dark-roast">
                  {isFinite(calc.recoverMonths) ? (calc.recoverMonths === 0 ? t("content.calculator.cannibal.recovery-already") : `${calc.recoverMonths.toFixed(1)} mo`) : t("content.calculator.cannibal.recovery-never")}
                </span>
              </div>
            </Card>
          </div>
        </div>
      </ViewSection>

      {/* Offer-value lens — what this calculator is actually testing */}
      <ViewSection badge={t("content.calculator.lens.badge")} title={t("content.calculator.lens.title")}>
        <Callout tone="gold" title={t("content.calculator.lens.title")}>
          <p className="m-0 text-[0.92rem]">
            {t("content.calculator.lens.body")}
          </p>
        </Callout>
      </ViewSection>

      {/* Tabs: sensitivity + scale + assumptions */}
      <ViewSection badge={t("content.calculator.tabs.badge")} title={t("content.calculator.tabs.title")}>
        <Tabs defaultValue="sensitivity">
          <TabsList className="bg-muted overflow-x-auto ursa-scroll justify-start sm:justify-center flex-nowrap max-w-full">
            <TabsTrigger value="sensitivity">{t("content.calculator.tab.sensitivity")}</TabsTrigger>
            <TabsTrigger value="scale">{t("content.calculator.tab.scale")}</TabsTrigger>
            <TabsTrigger value="assumptions">{t("content.calculator.tab.assumptions")}</TabsTrigger>
            <TabsTrigger value="sides">{t("content.calculator.tab.sides")}</TabsTrigger>
          </TabsList>

          <TabsContent value="sensitivity" className="mt-6">
            <Card>
              <p className="text-[0.9rem] text-muted-foreground mb-4">
                {t("content.calculator.sensitivity.intro")}
              </p>
              <div className="overflow-x-auto ursa-scroll">
                <table className="w-full border-collapse text-[0.85rem]">
                  <thead>
                    <tr>
                      <th className="text-left p-2 font-label text-[0.7rem] tracking-[0.1em] uppercase text-muted-foreground border-b border-ursa-line">
                        {t("content.calculator.sensitivity.col-visits")}
                      </th>
                      {sensitivity.attachRates.map((ar) => (
                        <th key={ar} className="p-2 font-label text-[0.7rem] tracking-[0.1em] uppercase text-muted-foreground border-b border-ursa-line text-center">
                          {ar}%
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sensitivity.rows.map((row) => (
                      <tr key={row.visits} className={row.isCurrentRow ? "bg-ursa-gold/10" : ""}>
                        <td className="p-2 font-label text-[0.8rem] text-ursa-dark-roast border-b border-ursa-line-soft">
                          {row.visits.toFixed(1)}
                        </td>
                        {row.cells.map((c, i) => (
                          <td key={i} className={cn("p-2 text-center border-b border-ursa-line-soft", cellClass(c.value), c.isCurrent && "outline outline-2 outline-ursa-gold outline-offset-[-2px]")}>
                            {c.value.toFixed(1)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="scale" className="mt-6">
            <Card>
              <p className="text-[0.9rem] text-muted-foreground mb-4">
                {t("content.calculator.scale.intro")}
              </p>
              <div className="space-y-3">
                {scaleProjection.map((s) => {
                  const isPilot = s.subscribers === 50;
                  const pctOfMax = (s.monthlyProfit / (scaleProjection[scaleProjection.length - 1].monthlyProfit || 1)) * 100;
                  return (
                    <div key={s.subscribers} className="flex items-center gap-4">
                      <span className="font-label text-[0.8rem] tracking-[0.08em] uppercase text-muted-foreground w-28 shrink-0">
                        {s.subscribers} {t("content.calculator.scale.label-subs")} {isPilot && <span className="text-ursa-gold-text">· {t("content.calculator.scale.label-pilot")}</span>}
                      </span>
                      <div className="flex-1 h-8 bg-muted rounded relative overflow-hidden">
                        <div
                          className={cn("h-full rounded flex items-center justify-end pr-3 transition-all", s.monthlyProfit >= 0 ? "bg-gradient-to-r from-ursa-forest to-ursa-forest-deep" : "bg-gradient-to-r from-ursa-terracotta to-ursa-gold")}
                          style={{ width: `${Math.max(8, Math.abs(pctOfMax))}%` }}
                        >
                          <span className="text-ursa-cream font-display font-semibold text-sm">{PEN(s.monthlyProfit)}</span>
                        </div>
                      </div>
                      <span className="text-[0.75rem] text-muted-foreground w-24 text-right shrink-0">{s.cupsPerMonth.toFixed(0)} {t("content.calculator.scale.label-cups")}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="assumptions" className="mt-6">
            <Grid cols={2}>
              <Callout tone="forest" title={t("content.calculator.assumptions.verified.title")}>
                <ul className="space-y-1.5 m-0 p-0 list-none text-[0.9rem]">
                  <li>• {t("content.calculator.assumptions.verified.1")}</li>
                  <li>• {t("content.calculator.assumptions.verified.2")}</li>
                  <li>• {t("content.calculator.assumptions.verified.3")}</li>
                  <li>• {t("content.calculator.assumptions.verified.4")}</li>
                </ul>
              </Callout>
              <Callout tone="warn" title={t("content.calculator.assumptions.assumed.title")}>
                <ul className="space-y-1.5 m-0 p-0 list-none text-[0.9rem]">
                  <li>• {t("content.calculator.assumptions.assumed.1")}</li>
                  <li>• {t("content.calculator.assumptions.assumed.2")}</li>
                  <li>• {t("content.calculator.assumptions.assumed.3")}</li>
                  <li>• {t("content.calculator.assumptions.assumed.4")}</li>
                </ul>
              </Callout>
              <Callout tone="stop" title={t("content.calculator.assumptions.stop.title")}>
                <p className="m-0 text-[0.9rem]">
                  {t("content.calculator.assumptions.stop.body")}
                </p>
              </Callout>
              <Callout tone="gold" title={t("content.calculator.assumptions.not-assumed.title")}>
                <ul className="space-y-1.5 m-0 p-0 list-none text-[0.9rem]">
                  <li>• {t("content.calculator.assumptions.not-assumed.1")}</li>
                  <li>• {t("content.calculator.assumptions.not-assumed.2")}</li>
                  <li>• {t("content.calculator.assumptions.not-assumed.3")}</li>
                </ul>
              </Callout>
            </Grid>
          </TabsContent>

          <TabsContent value="sides" className="mt-6">
            <Card>
              <h4 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-3">{t("content.calculator.sides.title")}</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-label text-[0.72rem] tracking-[0.12em] uppercase text-ursa-gold-text mb-2">{t("content.calculator.sides.counter-title")}</h5>
                  <ul className="space-y-1.5 text-[0.9rem] m-0 p-0 list-none">
                    <li>• {t("content.calculator.sides.counter.1")}</li>
                    <li>• {t("content.calculator.sides.counter.2")}</li>
                    <li>• {t("content.calculator.sides.counter.3")}</li>
                    <li>• {t("content.calculator.sides.counter.4")}</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-label text-[0.72rem] tracking-[0.12em] uppercase text-ursa-gold-text mb-2">{t("content.calculator.sides.online-title")}</h5>
                  <ul className="space-y-1.5 text-[0.9rem] m-0 p-0 list-none">
                    <li>• {t("content.calculator.sides.online.1")}</li>
                    <li>• {t("content.calculator.sides.online.2")}</li>
                    <li>• {t("content.calculator.sides.online.3")}</li>
                  </ul>
                </div>
              </div>
              <Callout tone="forest" title={t("content.calculator.sides.principle.title")}>
                <p className="m-0 text-[0.9rem]">
                  {t("content.calculator.sides.principle.body")}
                </p>
              </Callout>
            </Card>
          </TabsContent>
        </Tabs>
      </ViewSection>

      {/* ============================================================
          SCIENCE — the research behind the numbers
         ============================================================ */}
      <ViewSection
        badge={t("content.calculator.science.badge")}
        title={t("content.calculator.science.title")}
        meta={t("content.calculator.science.meta")}
      >
        <p className="text-[0.92rem] text-muted-foreground max-w-[78ch] m-0 mb-6">
          {t("content.calculator.science.intro")}
        </p>

        {/* Group 1 — Subscription economics */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Repeat size={16} className="text-ursa-gold-text" />
          {t("content.calculator.science.group.subscription")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {CALC_SUBSCRIPTION.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        {/* Group 2 — Coffee shop unit economics */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Coffee size={16} className="text-ursa-gold-text" />
          {t("content.calculator.science.group.unit")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {CALC_UNIT.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        {/* Group 3 — Behavioral pricing & retention */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Brain size={16} className="text-ursa-gold-text" />
          {t("content.calculator.science.group.behavioural")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
          {CALC_BEHAVIOURAL.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        <Callout tone="gold" title={t("content.calculator.science.synthesis.title")}>
          {t("content.calculator.science.synthesis.body")}
        </Callout>
      </ViewSection>

      <ViewSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatBlock value={PEN(calc.netProfit)} label={t("content.calculator.stat.profit")} tone="forest" />
          <StatBlock value={`${calc.cutoffAttach.toFixed(0)}%`} label={t("content.calculator.stat.cutoff")} tone="gold" />
          <StatBlock value={`${calc.freeCapacity.toFixed(0)}`} label={t("content.calculator.stat.capacity")} tone="forest" />
          <StatBlock value={isFinite(calc.recoverMonths) ? `${calc.recoverMonths.toFixed(1)} mo` : t("content.calculator.stat.recovery-kill")} label={t("content.calculator.stat.recovery")} tone="terracotta" />
        </div>
        <p className="text-[0.78rem] text-muted-foreground mt-6 max-w-3xl">
          {t("content.calculator.footer.body")}
        </p>
      </ViewSection>
    </>
  );
}

function NumberField({ label, value, onChange, min, max, step, prefix, hint }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; prefix?: string; hint?: string }) {
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
        </div>
      </div>
      {hint && <p className="text-[0.78rem] text-muted-foreground m-0">{hint}</p>}
    </div>
  );
}

function SliderField({ label, value, onChange, min, max, step, display, hint }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; display: string; hint?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <Label className="font-label text-[0.74rem] tracking-[0.08em] uppercase text-ursa-dark-roast">{label}</Label>
        <span className="font-display font-semibold text-ursa-dark-roast text-[0.95rem]">{display}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} className="py-1" />
      {hint && <p className="text-[0.78rem] text-muted-foreground m-0 mt-1">{hint}</p>}
    </div>
  );
}

function MiniMetric({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "neutral" | "forest" | "terracotta" }) {
  const tones = { neutral: "text-ursa-dark-roast", forest: "text-ursa-forest-deep", terracotta: "text-ursa-terracotta-text" };
  return (
    <div className="bg-card border border-ursa-line-soft rounded-lg p-4">
      <div className="flex items-center gap-2 text-ursa-gold-text mb-1">{icon}<span className="font-label text-[0.66rem] tracking-[0.12em] uppercase text-muted-foreground">{label}</span></div>
      <p className={cn("font-display text-2xl font-semibold m-0", tones[tone])}>{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Science cards — research that backs the Subscription Calculator.
// Strings live under content.calculator.science.card.{id}.{field} in i18n.ts.
// ---------------------------------------------------------------------------

type ScienceTone = "gold" | "forest" | "terracotta";

type ScienceEntry = {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone: ScienceTone;
};

const CALC_SUBSCRIPTION: ScienceEntry[] = [
  { id: "recurly-churn", icon: Repeat, tone: "terracotta" },
  { id: "chargebee-ltv", icon: InfinityIcon, tone: "gold" },
  { id: "bessemer-ltv-cac", icon: Scale, tone: "forest" },
  { id: "contribution-margin-horngren", icon: BookOpen, tone: "forest" },
];

const CALC_UNIT: ScienceEntry[] = [
  { id: "sca-food-cost", icon: Coffee, tone: "forest" },
  { id: "breakeven-horngren", icon: Target, tone: "gold" },
  { id: "marginal-cup-cost", icon: Layers, tone: "forest" },
  { id: "pour-over-economics", icon: Droplet, tone: "gold" },
];

const CALC_BEHAVIOURAL: ScienceEntry[] = [
  { id: "thaler-mental-accounting", icon: Brain, tone: "gold" },
  { id: "gourville-soman-decoupling", icon: Split, tone: "forest" },
  { id: "reichheld-nps", icon: Star, tone: "terracotta" },
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
            {t(`content.calculator.science.card.${id}.name`)}
          </h4>
          <p className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-muted-foreground m-0 mt-0.5">
            {t(`content.calculator.science.card.${id}.source`)}
          </p>
        </div>
      </div>
      <div className={cn("border-l-2 pl-2.5 py-1", accentBorder[tone])}>
        <p className="text-[0.82rem] italic text-ursa-dark-roast m-0 leading-snug">
          {t(`content.calculator.science.card.${id}.finding`)}
        </p>
      </div>
      <p className="text-[0.84rem] leading-relaxed text-foreground/85 m-0">
        {t(`content.calculator.science.card.${id}.apply`)}
      </p>
    </Card>
  );
}
