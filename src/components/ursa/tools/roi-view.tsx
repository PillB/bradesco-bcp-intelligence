"use client";

import { useState, useMemo } from "react";
import type { ComponentType } from "react";
import { ViewHero, ViewSection, Card, DossierLinkBanner } from "../view-shell";
import { Pill, Callout, StatBlock } from "../ursa-brand";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  TrendingUp,
  Wallet,
  Users,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  Gauge,
  Target,
  CalendarClock,
  Trophy,
  BookOpen,
  Split,
  BarChart3,
  Megaphone,
  Search,
  Instagram,
  MessageCircle,
  MapPin,
  Compass,
  Star,
  Brain,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { cn } from "@/lib/utils";

type Channel = {
  id: string;
  name: string;
  spend: number;
  customers: number;
  revenuePerCustomer: number;
  note: string;
};

const DEFAULT_CHANNELS: Channel[] = [
  { id: "gbp", name: "Google Business Profile", spend: 0, customers: 25, revenuePerCustomer: 14, note: "Verified listing → directions calls; near-zero cash cost." },
  { id: "meta", name: "Meta paid social", spend: 1800, customers: 90, revenuePerCustomer: 14, note: "Miraflores 3km radius; A/B bear vs cup creative." },
  { id: "creator", name: "Creator pilot (3 micro)", spend: 1600, customers: 40, revenuePerCustomer: 18, note: "Briefs, not posts; barista + foodie + traveller." },
  { id: "hotel", name: "Hotel concierge cards", spend: 300, customers: 30, revenuePerCustomer: 22, note: "8 nearby hotels; coupon code per property." },
  { id: "cupping", name: "Monthly cupping night", spend: 560, customers: 20, revenuePerCustomer: 35, note: "Monthly cupping; ticket + retail bean attach." },
  { id: "rappi", name: "Rappi optimisation", spend: 400, customers: 50, revenuePerCustomer: 22, note: "Re-photography + bundles; lifts AOV." },
  { id: "whatsapp", name: "WhatsApp list", spend: 150, customers: 35, revenuePerCustomer: 12, note: "Consented weekly drops; near-zero marginal cost." },
  { id: "sub", name: "Subscription pilot", spend: 1200, customers: 30, revenuePerCustomer: 60, note: "Ursa Mañana S/.20/mo; first 90 days LTV." },
];

const PEN = (n: number) => {
  if (!isFinite(n)) return "—";
  return `S/. ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const DAYS_PER_MONTH = 30;
const BEST_CONFIDENCE = 100;
const WORST_CONFIDENCE = 50;

type Calc = {
  scaledCustomers: number;
  revenue: number;
  roi: number; // percentage
  paybackMonths: number;
};

function calcChannel(c: Channel, confidence: number): Calc {
  const scaledCustomers = c.customers * (confidence / 100);
  const revenue = scaledCustomers * c.revenuePerCustomer;
  const roi = c.spend > 0 ? ((revenue - c.spend) / c.spend) * 100 : Infinity;
  const paybackMonths = revenue > 0 ? c.spend / revenue : Infinity;
  return { scaledCustomers, revenue, roi, paybackMonths };
}

function roiTone(roi: number): "forest" | "gold" | "terracotta" {
  if (!isFinite(roi)) return "gold"; // free channel
  if (roi >= 200) return "forest";
  if (roi >= 100) return "gold";
  return "terracotta";
}

function roiColorHex(roi: number): string {
  if (!isFinite(roi)) return "#B8924A";
  if (roi >= 200) return "#2D4A36";
  if (roi >= 100) return "#B8924A";
  return "#C16E4B";
}

export function RoiView() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [channels, setChannels] = useState<Channel[]>(DEFAULT_CHANNELS);
  const [confidence, setConfidence] = useState<number>(75);

  const update = (id: string, field: keyof Channel, value: number) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: Number.isFinite(value) ? value : 0 } : c))
    );
  };

  const reset = () => {
    setChannels(DEFAULT_CHANNELS);
    setConfidence(75);
  };

  // Calculations using current confidence
  const calced = useMemo(
    () => channels.map((c) => ({ channel: c, ...calcChannel(c, confidence) })),
    [channels, confidence]
  );

  // Portfolio totals at current confidence
  const portfolio = useMemo(() => {
    const totalSpend = calced.reduce((s, c) => s + c.channel.spend, 0);
    const totalRevenue = calced.reduce((s, c) => s + c.revenue, 0);
    const totalCustomers = calced.reduce((s, c) => s + c.scaledCustomers, 0);
    const blendedRoi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : Infinity;
    const blendedPayback = totalRevenue > 0 ? totalSpend / totalRevenue : Infinity;
    return { totalSpend, totalRevenue, totalCustomers, blendedRoi, blendedPayback };
  }, [calced]);

  // Confidence ranges for total revenue
  const confidenceRanges = useMemo(() => {
    const best = channels.reduce(
      (s, c) => s + calcChannel(c, BEST_CONFIDENCE).revenue,
      0
    );
    const expected = channels.reduce(
      (s, c) => s + calcChannel(c, confidence).revenue,
      0
    );
    const worst = channels.reduce(
      (s, c) => s + calcChannel(c, WORST_CONFIDENCE).revenue,
      0
    );
    return { best, expected, worst };
  }, [channels, confidence]);

  // Bar chart data
  const chartData = useMemo(
    () =>
      calced.map((c) => ({
        name: c.channel.name,
        roi: isFinite(c.roi) ? Math.round(c.roi) : 200, // cap free-channel visual at 200
        actualRoi: c.roi,
        spend: c.channel.spend,
        revenue: c.revenue,
      })),
    [calced]
  );

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.roi.eyebrow")}
        title={<>{t("content.view.roi.title")}</>}
        lede={<>{t("content.roi.hero.lede")}</>}
        meta={[
          { label: t("content.roi.meta.currency"), value: t("content.roi.meta.currency-value") },
          { label: t("content.roi.meta.channels"), value: t("content.roi.meta.channels-value", { n: DEFAULT_CHANNELS.length }) },
          { label: t("content.roi.meta.confidence"), value: t("content.roi.meta.confidence-value") },
        ]}
      />

      <ViewSection>
        <DossierLinkBanner moduleId="04-marketing-growth-and-retention-plan" />
      </ViewSection>

      {/* Sensitivity slider */}
      <ViewSection
        badge={t("content.roi.section.sensitivity.badge")}
        title={t("content.roi.section.sensitivity.title")}
        meta={t("content.roi.section.sensitivity.meta")}
      >
        <Card highlight className="bg-gradient-to-br from-ursa-paper to-ursa-cream">
          <div className="grid md:grid-cols-[1fr_280px] gap-6 items-center">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <Label className="font-label text-[0.7rem] tracking-[0.16em] uppercase text-ursa-gold-text">
                  {t("content.roi.section.sensitivity.label")}
                </Label>
                <span className="font-display text-3xl font-semibold text-ursa-dark-roast leading-none">
                  {confidence}%
                </span>
              </div>
              <Slider
                value={[confidence]}
                min={WORST_CONFIDENCE}
                max={BEST_CONFIDENCE}
                step={5}
                onValueChange={(v) => setConfidence(v[0])}
                className="mt-3"
              />
              <div className="flex justify-between mt-2 font-label text-[0.62rem] tracking-[0.1em] uppercase text-muted-foreground">
                <span>{t("content.roi.section.sensitivity.worst")}</span>
                <span>{t("content.roi.section.sensitivity.expected", { n: confidence })}</span>
                <span>{t("content.roi.section.sensitivity.best")}</span>
              </div>
              <p className="text-[0.85rem] text-muted-foreground mt-4 m-0">
                {t("content.roi.section.sensitivity.body", {
                  confidence,
                  scaled: Math.round(100 * (confidence / 100)),
                })}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <RangeRow label={t("content.roi.section.sensitivity.range-best")} value={PEN(confidenceRanges.best)} tone="forest" />
              <RangeRow label={t("content.roi.section.sensitivity.range-expected", { n: confidence })} value={PEN(confidenceRanges.expected)} tone="gold" highlight />
              <RangeRow label={t("content.roi.section.sensitivity.range-worst")} value={PEN(confidenceRanges.worst)} tone="terracotta" />
            </div>
          </div>
        </Card>
        <div className="flex justify-end mt-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full font-label text-[0.7rem] tracking-[0.12em] uppercase text-muted-foreground hover:text-ursa-dark-roast transition"
          >
            <RotateCcw size={13} /> {t("content.roi.section.sensitivity.reset")}
          </button>
        </div>
      </ViewSection>

      {/* Channel ROI table */}
      <ViewSection
        badge={t("content.roi.section.channels.badge")}
        title={t("content.roi.section.channels.title")}
        meta={t("content.roi.section.channels.meta")}
      >
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto ursa-scroll">
            <table className="w-full border-collapse text-[0.85rem] min-w-[820px]">
              <thead>
                <tr className="bg-ursa-cream">
                  <th className="text-left p-3 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground border-b border-ursa-line sticky left-0 bg-ursa-cream z-10">
                    {t("content.roi.section.channels.col-channel")}
                  </th>
                  <th className="text-right p-3 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground border-b border-ursa-line">
                    {t("content.roi.section.channels.col-spend")}
                  </th>
                  <th className="text-right p-3 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground border-b border-ursa-line">
                    {t("content.roi.section.channels.col-customers")}
                  </th>
                  <th className="text-right p-3 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground border-b border-ursa-line">
                    {t("content.roi.section.channels.col-revenue-per")}
                  </th>
                  <th className="text-right p-3 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground border-b border-ursa-line">
                    {t("content.roi.section.channels.col-revenue")}
                  </th>
                  <th className="text-right p-3 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground border-b border-ursa-line">
                    {t("content.roi.section.channels.col-payback")}
                  </th>
                  <th className="text-right p-3 font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground border-b border-ursa-line">
                    {t("content.roi.section.channels.col-roi")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {calced.map((c) => {
                  const tone = roiTone(c.roi);
                  return (
                    <tr key={c.channel.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-3 align-top border-b border-ursa-line-soft sticky left-0 bg-card z-10">
                        <p className="font-display font-semibold text-ursa-dark-roast m-0 leading-tight">
                          {c.channel.name}
                        </p>
                        <p className="text-[0.72rem] text-muted-foreground m-0 mt-0.5 max-w-[28ch]">
                          {c.channel.note}
                        </p>
                      </td>
                      <td className="p-3 text-right align-top border-b border-ursa-line-soft">
                        <EditableCell value={c.channel.spend} onChange={(v) => update(c.channel.id, "spend", v)} />
                      </td>
                      <td className="p-3 text-right align-top border-b border-ursa-line-soft">
                        <EditableCell value={c.channel.customers} onChange={(v) => update(c.channel.id, "customers", v)} />
                        <span className="font-label text-[0.6rem] tracking-[0.08em] text-muted-foreground block mt-0.5">
                          {t("content.roi.section.channels.scaled-suffix", {
                            n: c.scaledCustomers.toFixed(0),
                            confidence,
                          })}
                        </span>
                      </td>
                      <td className="p-3 text-right align-top border-b border-ursa-line-soft">
                        <EditableCell value={c.channel.revenuePerCustomer} onChange={(v) => update(c.channel.id, "revenuePerCustomer", v)} />
                      </td>
                      <td className="p-3 text-right align-top border-b border-ursa-line-soft font-display font-semibold text-ursa-dark-roast">
                        {PEN(c.revenue)}
                      </td>
                      <td className="p-3 text-right align-top border-b border-ursa-line-soft font-display font-semibold text-ursa-dark-roast">
                        {isFinite(c.paybackMonths) ? c.paybackMonths.toFixed(1) : "—"}
                      </td>
                      <td className={cn("p-3 text-right align-top border-b border-ursa-line-soft font-display font-semibold", tone === "forest" ? "text-ursa-forest-deep" : tone === "gold" ? "text-ursa-gold-text" : "text-ursa-terracotta-text")}>
                        {isFinite(c.roi) ? `${c.roi.toFixed(0)}%` : "∞"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex flex-wrap gap-2 mt-4">
          <Pill tone="forest">{t("content.roi.section.channels.legend-green")}</Pill>
          <Pill tone="gold">{t("content.roi.section.channels.legend-gold")}</Pill>
          <Pill tone="stop">{t("content.roi.section.channels.legend-terracotta")}</Pill>
          <Pill tone="default">{t("content.roi.section.channels.legend-free")}</Pill>
        </div>

        <Callout tone="warn" title={t("content.roi.section.channels.callout-title")}>
          <p className="m-0">
            {t("content.roi.section.channels.callout-body")}
          </p>
        </Callout>
      </ViewSection>

      {/* Portfolio view */}
      <ViewSection
        badge={t("content.roi.section.portfolio.badge")}
        title={t("content.roi.section.portfolio.title")}
        meta={t("content.roi.section.portfolio.meta", { n: confidence })}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatBlock
            value={PEN(portfolio.totalSpend)}
            label={t("content.roi.section.portfolio.stat-spend")}
            tone="terracotta"
          />
          <StatBlock
            value={PEN(portfolio.totalRevenue)}
            label={t("content.roi.section.portfolio.stat-revenue", { n: confidence })}
            tone="forest"
          />
          <StatBlock
            value={isFinite(portfolio.blendedRoi) ? `${portfolio.blendedRoi.toFixed(0)}%` : "∞"}
            label={t("content.roi.section.portfolio.stat-roi")}
            tone={portfolio.blendedRoi >= 200 ? "forest" : portfolio.blendedRoi >= 100 ? "gold" : "terracotta"}
          />
          <StatBlock
            value={isFinite(portfolio.blendedPayback) ? `${portfolio.blendedPayback.toFixed(1)} mo` : "—"}
            label={t("content.roi.section.portfolio.stat-payback")}
            tone="gold"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-ursa-foam">
            <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
              <Users size={16} className="text-ursa-gold-text" /> {t("content.roi.section.portfolio.card-customers-title")}
            </h4>
            <p className="font-display text-3xl font-semibold text-ursa-dark-roast m-0">
              {portfolio.totalCustomers.toFixed(0)}
            </p>
            <p className="text-[0.82rem] text-muted-foreground m-0 mt-1">
              {t("content.roi.section.portfolio.card-customers-body", {
                confidence,
                cpa: portfolio.totalCustomers > 0 ? PEN(portfolio.totalSpend / portfolio.totalCustomers) : "—",
              })}
            </p>
          </Card>
          <Card className="bg-ursa-foam">
            <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
              <Target size={16} className="text-ursa-forest-deep" /> {t("content.roi.section.portfolio.card-profit-title")}
            </h4>
            <p className={cn("font-display text-3xl font-semibold m-0", portfolio.totalRevenue - portfolio.totalSpend >= 0 ? "text-ursa-forest-deep" : "text-ursa-terracotta-text")}>
              {PEN(portfolio.totalRevenue - portfolio.totalSpend)}
            </p>
            <p className="text-[0.82rem] text-muted-foreground m-0 mt-1">
              {t("content.roi.section.portfolio.card-profit-body")}
            </p>
          </Card>
          <Card className="bg-ursa-foam">
            <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
              <CalendarClock size={16} className="text-ursa-gold-text" /> {t("content.roi.section.portfolio.card-payback-title")}
            </h4>
            <p className="font-display text-3xl font-semibold text-ursa-dark-roast m-0">
              {isFinite(portfolio.blendedPayback) ? portfolio.blendedPayback.toFixed(1) : "—"}
              <span className="font-label text-[0.7rem] tracking-[0.1em] uppercase text-muted-foreground ml-1">
                {t("content.roi.section.portfolio.unit-months")}
              </span>
            </p>
            <p className="text-[0.82rem] text-muted-foreground m-0 mt-1">
              {t("content.roi.section.portfolio.card-payback-body")}
            </p>
          </Card>
        </div>
      </ViewSection>

      {/* Channel comparison bar chart */}
      <ViewSection
        badge={t("content.roi.section.compare.badge")}
        title={t("content.roi.section.compare.title")}
        meta={t("content.roi.section.compare.meta", { n: confidence })}
      >
        <Card>
          <p className="text-[0.85rem] text-muted-foreground mb-4 m-0">
            {t("content.roi.section.compare.intro")}
          </p>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 16, left: 8, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2D4B0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#6F4A2E" }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={70}
                  stroke="#C9B68C"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6F4A2E" }}
                  tickFormatter={(v) => `${v}%`}
                  stroke="#C9B68C"
                  domain={[0, 250]}
                  ticks={[0, 50, 100, 150, 200, 250]}
                />
                <ReTooltip
                  formatter={(value: number, _name: string, payload: { payload?: { actualRoi?: number; spend?: number; revenue?: number } }) => {
                    const actual = payload?.payload?.actualRoi;
                    const roiLabel = !isFinite(actual as number) ? "∞ (free channel)" : `${(actual as number).toFixed(0)}%`;
                    return [roiLabel, `ROI · spend ${PEN(payload?.payload?.spend ?? 0)} · rev ${PEN(payload?.payload?.revenue ?? 0)}`];
                  }}
                  contentStyle={{
                    background: "#FAF5EC",
                    border: "1px solid #C9B68C",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    color: "#3B2417",
                  }}
                  cursor={{ fill: "rgba(184,146,74,0.08)" }}
                />
                <Bar dataKey="roi" radius={[6, 6, 0, 0]} maxBarSize={64}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={roiColorHex(d.actualRoi)} />
                  ))}
                  <LabelList
                    dataKey="roi"
                    position="top"
                    formatter={(v: number) => (v >= 200 ? "200%+" : `${v}%`)}
                    style={{ fontSize: 10, fill: "#3B2417", fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </ViewSection>

      {/* Confidence ranges */}
      <ViewSection
        badge={t("content.roi.section.confidence.badge")}
        title={t("content.roi.section.confidence.title")}
        meta={t("content.roi.section.confidence.meta")}
      >
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 items-stretch">
          <Card className="bg-ursa-foam">
            <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-4 flex items-center gap-2">
              <Gauge size={18} className="text-ursa-gold-text" /> {t("content.roi.section.confidence.chart-title")}
            </h3>
            <div className="space-y-4">
              <RangeBar
                label={t("content.roi.section.confidence.bar-best")}
                value={confidenceRanges.best}
                max={confidenceRanges.best}
                tone="forest"
              />
              <RangeBar
                label={t("content.roi.section.confidence.bar-expected", { n: confidence })}
                value={confidenceRanges.expected}
                max={confidenceRanges.best}
                tone="gold"
                highlight
              />
              <RangeBar
                label={t("content.roi.section.confidence.bar-worst")}
                value={confidenceRanges.worst}
                max={confidenceRanges.best}
                tone="terracotta"
              />
            </div>
            <p className="text-[0.82rem] text-muted-foreground mt-4 m-0">
              {t("content.roi.section.confidence.body")}
            </p>
          </Card>

          <div className="space-y-4">
            <Card>
              <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-3 flex items-center gap-2">
                <Trophy size={16} className="text-ursa-gold-text" /> {t("content.roi.section.confidence.best-title")}
              </h4>
              {(() => {
                const sorted = [...calced].sort((a, b) => (isFinite(b.roi) ? b.roi : Infinity) - (isFinite(a.roi) ? a.roi : Infinity));
                const best = sorted[0];
                return (
                  <div>
                    <p className="font-display text-lg font-semibold text-ursa-dark-roast m-0">{best.channel.name}</p>
                    <p className="text-[0.85rem] text-muted-foreground m-0 mt-1">{best.channel.note}</p>
                    <p className="text-[0.78rem] text-muted-foreground m-0 mt-2">
                      {t("content.roi.section.confidence.best-intro")}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Pill tone={roiTone(best.roi)}>ROI {isFinite(best.roi) ? `${best.roi.toFixed(0)}%` : "∞"}</Pill>
                      <Pill tone="forest">{t("content.roi.section.confidence.pill-revenue", { amount: PEN(best.revenue) })}</Pill>
                      <Pill tone="default">{t("content.roi.section.confidence.pill-spend", { amount: PEN(best.channel.spend) })}</Pill>
                    </div>
                  </div>
                );
              })()}
            </Card>
            <Card>
              <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-ursa-terracotta-text" /> {t("content.roi.section.confidence.worst-title")}
              </h4>
              {(() => {
                const sorted = [...calced]
                  .filter((c) => isFinite(c.roi))
                  .sort((a, b) => a.roi - b.roi);
                const worst = sorted[0];
                if (!worst) {
                  return <p className="text-[0.85rem] text-muted-foreground m-0">{t("content.roi.section.confidence.worst-all-free")}</p>;
                }
                return (
                  <div>
                    <p className="font-display text-lg font-semibold text-ursa-dark-roast m-0">{worst.channel.name}</p>
                    <p className="text-[0.85rem] text-muted-foreground m-0 mt-1">
                      {worst.roi < 0
                        ? t("content.roi.section.confidence.worst-losing", {
                            amount: PEN(Math.abs(worst.channel.spend - worst.revenue)),
                            confidence,
                          })
                        : t("content.roi.section.confidence.worst-below", {
                            roi: worst.roi.toFixed(0),
                          })}
                    </p>
                    <p className="text-[0.78rem] text-muted-foreground m-0 mt-2">
                      {t("content.roi.section.confidence.worst-intro")}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Pill tone={roiTone(worst.roi)}>ROI {worst.roi.toFixed(0)}%</Pill>
                      <Pill tone="stop">{t("content.roi.section.confidence.pill-spend", { amount: PEN(worst.channel.spend) })}</Pill>
                      <Pill tone="default">{t("content.roi.section.confidence.pill-revenue", { amount: PEN(worst.revenue) })}</Pill>
                    </div>
                  </div>
                );
              })()}
            </Card>
          </div>
        </div>
      </ViewSection>

      {/* Cross-link */}
      <ViewSection
        badge={t("content.roi.section.pair.badge")}
        title={t("content.roi.section.pair.title")}
      >
        <p className="text-[0.9rem] text-muted-foreground max-w-[68ch] mb-5 m-0">
          {t("content.roi.section.pair.intro")}
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-ursa-paper to-ursa-cream">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-ursa-dark-roast/15 border border-ursa-forest-deep flex items-center justify-center shrink-0">
                <Wallet size={18} className="text-ursa-forest-deep" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-1.5">
                  {t("content.roi.section.pair.budget-title")}
                </h3>
                <p className="text-[0.9rem] text-muted-foreground m-0 mb-3">
                  {t("content.roi.section.pair.budget-body")}
                </p>
                <button
                  onClick={() => navigate("budget")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ursa-dark-roast text-ursa-cream hover:bg-ursa-espresso transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
                >
                  <Wallet size={14} /> {t("content.roi.section.pair.budget-cta")} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-ursa-paper to-ursa-cream">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-ursa-gold/15 border border-ursa-gold flex items-center justify-center shrink-0">
                <TrendingUp size={18} className="text-ursa-gold-text" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-1.5">
                  {t("content.roi.section.pair.calc-title")}
                </h3>
                <p className="text-[0.9rem] text-muted-foreground m-0 mb-3">
                  {t("content.roi.section.pair.calc-body")}
                </p>
                <button
                  onClick={() => navigate("calculator")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ursa-gold text-ursa-dark-roast hover:bg-ursa-gold-soft transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
                >
                  <TrendingUp size={14} /> {t("content.roi.section.pair.calc-cta")} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </ViewSection>

      {/* ============================================================
          SCIENCE — the research behind the return
         ============================================================ */}
      <ViewSection
        badge={t("content.roi.science.badge")}
        title={t("content.roi.science.title")}
        meta={t("content.roi.science.meta")}
      >
        <p className="text-[0.92rem] text-muted-foreground max-w-[78ch] m-0 mb-6">
          {t("content.roi.science.intro")}
        </p>

        {/* Group 1 — Marketing ROI methodology */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-ursa-gold-text" />
          {t("content.roi.science.group.methodology")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {ROI_METHODOLOGY.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        {/* Group 2 — Channel-specific ROI research */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Megaphone size={16} className="text-ursa-gold-text" />
          {t("content.roi.science.group.channels")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {ROI_CHANNELS.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        {/* Group 3 — Attribution traps & free-channel science */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-ursa-gold-text" />
          {t("content.roi.science.group.traps")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
          {ROI_TRAPS.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        <Callout tone="gold" title={t("content.roi.science.synthesis.title")}>
          {t("content.roi.science.synthesis.body")}
        </Callout>
      </ViewSection>

      <ViewSection>
        <DossierLinkBanner moduleId="04-marketing-growth-and-retention-plan" />
      </ViewSection>
    </>
  );
}

function EditableCell({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="inline-flex items-center gap-1 justify-end w-[110px]">
      <span className="font-label text-[0.62rem] tracking-[0.06em] text-muted-foreground">S/.</span>
      <Input
        type="number"
        value={value}
        min={0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="h-8 w-[78px] text-right text-[0.85rem]"
      />
    </div>
  );
}

function RangeRow({
  label,
  value,
  tone,
  highlight = false,
}: {
  label: string;
  value: string;
  tone: "forest" | "gold" | "terracotta";
  highlight?: boolean;
}) {
  const tones = {
    forest: "text-ursa-forest-deep border-ursa-forest-deep",
    gold: "text-ursa-gold-text border-ursa-gold",
    terracotta: "text-ursa-terracotta-text border-ursa-terracotta",
  };
  return (
    <div
      className={cn(
        "rounded-lg border bg-card px-4 py-3 flex items-baseline justify-between",
        tones[tone],
        highlight && "ring-2 ring-offset-2 ring-offset-ursa-paper ring-ursa-gold/40"
      )}
    >
      <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">
        {label}
      </span>
      <span className={cn("font-display text-xl font-semibold", tones[tone].split(" ")[0])}>
        {value}
      </span>
    </div>
  );
}

function RangeBar({
  label,
  value,
  max,
  tone,
  highlight = false,
}: {
  label: string;
  value: number;
  max: number;
  tone: "forest" | "gold" | "terracotta";
  highlight?: boolean;
}) {
  const tones = {
    forest: "bg-ursa-forest-deep",
    gold: "bg-ursa-gold",
    terracotta: "bg-ursa-terracotta",
  };
  const pct = max > 0 ? Math.max(2, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-label text-[0.66rem] tracking-[0.12em] uppercase text-muted-foreground">
          {label}
        </span>
        <span className={cn("font-display text-lg font-semibold", tone === "forest" ? "text-ursa-forest-deep" : tone === "gold" ? "text-ursa-gold-text" : "text-ursa-terracotta-text")}>
          {PEN(value)}
        </span>
      </div>
      <div className={cn("h-3 rounded-full bg-muted overflow-hidden", highlight && "ring-1 ring-ursa-gold/40")}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", tones[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Science cards — research that backs the ROI Dashboard.
// Strings live under content.roi.science.card.{id}.{field} in i18n.ts.
// ---------------------------------------------------------------------------

type ScienceTone = "gold" | "forest" | "terracotta";

type ScienceEntry = {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone: ScienceTone;
};

const ROI_METHODOLOGY: ScienceEntry[] = [
  { id: "lenskold-2003", icon: BookOpen, tone: "forest" },
  { id: "attribution-problem", icon: Split, tone: "terracotta" },
  { id: "marketing-mix-tellis", icon: BarChart3, tone: "gold" },
  { id: "incremental-gordon", icon: AlertTriangle, tone: "terracotta" },
];

const ROI_CHANNELS: ScienceEntry[] = [
  { id: "google-roas-benchmarks", icon: Search, tone: "forest" },
  { id: "instagram-engagement-conversion", icon: Instagram, tone: "gold" },
  { id: "whatsapp-marketing", icon: MessageCircle, tone: "forest" },
  { id: "gbp-local-seo", icon: MapPin, tone: "gold" },
];

const ROI_TRAPS: ScienceEntry[] = [
  { id: "tripadvisor-platform", icon: Compass, tone: "gold" },
  { id: "luca-reviews-revenue", icon: Star, tone: "forest" },
  { id: "attribution-bias-stop", icon: Brain, tone: "terracotta" },
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
            {t(`content.roi.science.card.${id}.name`)}
          </h4>
          <p className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-muted-foreground m-0 mt-0.5">
            {t(`content.roi.science.card.${id}.source`)}
          </p>
        </div>
      </div>
      <div className={cn("border-l-2 pl-2.5 py-1", accentBorder[tone])}>
        <p className="text-[0.82rem] italic text-ursa-dark-roast m-0 leading-snug">
          {t(`content.roi.science.card.${id}.finding`)}
        </p>
      </div>
      <p className="text-[0.84rem] leading-relaxed text-foreground/85 m-0">
        {t(`content.roi.science.card.${id}.apply`)}
      </p>
    </Card>
  );
}
