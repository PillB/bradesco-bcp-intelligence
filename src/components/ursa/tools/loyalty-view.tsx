"use client";

import { useState, useMemo } from "react";
import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import { BearMark, Pill, Callout, ArtNouveauDivider } from "../ursa-brand";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  CreditCard,
  Coffee,
  Bell,
  MapPin,
  Sparkles,
  Brain,
  Target,
  Smartphone,
  Zap,
  TrendingUp,
  Award,
  Info,
  Check,
  ArrowRight,
  PawPrint,
  Heart,
  Calendar,
  Scale,
  Library,
  Trophy,
  BookMarked,
} from "lucide-react";

/**
 * LoyaltyView — Extra Tool T14 · Loyalty Wallet Card Analysis
 *
 * Ursa's digital loyalty card lives in the customer's phone wallet (Apple
 * Wallet + Google Pay) via itsloyaleats by bytecampperu. Mechanic: 8 visits
 * = 1 free coffee. This view analyses the behavioral science behind the card,
 * models the economics interactively, and recommends specific marketing +
 * design tactics to maximise stamp velocity and retention.
 */

const PEN = (n: number) => (isFinite(n) ? `S/. ${n.toFixed(2)}` : "—");
const PENn = (n: number) => (isFinite(n) ? `S/. ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—");

// --- Paw-print stamp SVG (used on the wallet card mockup) ------------------
function PawStamp({ filled, size = 28 }: { filled: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={filled ? "text-ursa-gold" : "text-ursa-cream/40"}
    >
      {/* Main pad */}
      <ellipse cx="16" cy="20" rx="6.5" ry="5.5" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" />
      {/* Four toes */}
      <ellipse cx="8" cy="13" rx="2.4" ry="3.2" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="13" cy="9" rx="2.4" ry="3.4" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="19" cy="9" rx="2.4" ry="3.4" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="24" cy="13" rx="2.4" ry="3.2" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

// --- The five behavioral-science principles -------------------------------
// Names, sources, findings, applications and recommendations are resolved via t()
// under content.loyalty.principle.{id}.{field}. The icon and tone stay inline as
// presentation data.
type Tone = "gold" | "forest" | "terracotta";

const PRINCIPLES: { id: string; icon: typeof Sparkles; tone: Tone }[] = [
  { id: "endowed-progress", icon: Sparkles, tone: "gold" },
  { id: "endowment", icon: Heart, tone: "forest" },
  { id: "goal-gradient", icon: TrendingUp, tone: "terracotta" },
  { id: "loss-aversion", icon: Scale, tone: "terracotta" },
  { id: "small-wins", icon: Brain, tone: "gold" },
];

// --- Evidence library cards (meta-analyses + adoption + success cases) ----
// Each card renders title, source line, body, and a list of bullet findings
// via t() under content.loyalty.evidence.{id}.{field}.
const EVIDENCE_CARDS = [
  { id: "meta-analysis", icon: Library, tone: "forest" as const },
  { id: "wallet-adoption", icon: Smartphone, tone: "gold" as const },
  { id: "success-cases", icon: Trophy, tone: "gold" as const },
  { id: "punch-vs-app", icon: BookMarked, tone: "forest" as const },
];

// --- Evidence bullet lists (per card) --------------------------------------
// Card 1 (meta-analysis): 3 studies cited. Card 2 (wallet adoption): 3 stats.
// Card 3 (success cases): 4 cases. Card 4 (punch vs app): 3 findings.
const EVIDENCE_BULLETS: Record<string, number> = {
  "meta-analysis": 3,
  "wallet-adoption": 3,
  "success-cases": 4,
  "punch-vs-app": 3,
};

// --- Marketing recommendations --------------------------------------------
const MARKETING_TACTICS = [
  { id: 1, icon: Sparkles, tone: "gold" as const },
  { id: 2, icon: Heart, tone: "forest" as const },
  { id: 3, icon: Bell, tone: "terracotta" as const },
  { id: 4, icon: MapPin, tone: "gold" as const },
  { id: 5, icon: Coffee, tone: "forest" as const },
  { id: 6, icon: Zap, tone: "terracotta" as const },
];

// --- Competitor comparison -------------------------------------------------
// rowKey indexes loyalty.compare.row.{rowKey}.{field}; advantage stays inline.
const COMPETITORS_TABLE = [
  { rowKey: "ursa", advantage: true },
  { rowKey: "coffeepass", advantage: false },
  { rowKey: "paper", advantage: false },
  { rowKey: "app", advantage: false },
];

// --- Improvement recommendations -------------------------------------------
const IMPROVEMENTS = [
  { id: 1, icon: PawPrint, tone: "gold" as const },
  { id: 2, icon: Info, tone: "forest" as const },
  { id: 3, icon: Calendar, tone: "terracotta" as const },
  { id: 4, icon: Coffee, tone: "gold" as const },
];

// ===========================================================================
export function LoyaltyView() {
  const navigate = useNavigate();
  const { t } = useI18n();

  // --- Calculator state -----------------------------------------------------
  const [avgTicket, setAvgTicket] = useState(14);
  const [visitsToComplete, setVisitsToComplete] = useState(8);
  const [freeCoffeeCost, setFreeCoffeeCost] = useState(3);
  const [endowedStamps, setEndowedStamps] = useState(2);
  const [cycles, setCycles] = useState(6);

  const calc = useMemo(() => {
    const paidVisits = Math.max(0, visitsToComplete - endowedStamps);
    const revenuePerCycle = paidVisits * avgTicket;
    const rewardCost = freeCoffeeCost;
    const netPerCycle = revenuePerCycle - rewardCost;
    const clv = netPerCycle * cycles;
    const ratio = rewardCost > 0 ? revenuePerCycle / rewardCost : Infinity;
    return {
      paidVisits,
      revenuePerCycle,
      rewardCost,
      netPerCycle,
      clv,
      ratio,
    };
  }, [avgTicket, visitsToComplete, freeCoffeeCost, endowedStamps, cycles]);

  // Filled paws on the wallet mockup — show 5 of 8
  const TOTAL_STAMPS = 8;
  const FILLED_STAMPS = 5;
  const remaining = TOTAL_STAMPS - FILLED_STAMPS;

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.loyalty.eyebrow")}
        title={t("content.view.loyalty.title")}
        lede={<>{t("content.loyalty.lede")}</>}
        meta={[
          { label: t("content.loyalty.meta.platform"), value: t("content.loyalty.meta.platform-value") },
          { label: t("content.loyalty.meta.mechanic"), value: t("content.loyalty.meta.mechanic-value") },
          { label: t("content.loyalty.meta.channels"), value: t("content.loyalty.meta.channels-value") },
          { label: t("content.loyalty.meta.no-app"), value: t("content.loyalty.meta.no-app-value") },
        ]}
      />

      {/* ============================================================
          SECTION 2 — The wallet card mockup (Apple Wallet pass look)
         ============================================================ */}
      <ViewSection badge={t("content.loyalty.section.02.badge")} title={t("content.loyalty.section.02.title")} meta={t("content.loyalty.section.02.meta")}>
        <Grid cols={2}>
          {/* The pass */}
          <div className="flex flex-col gap-4">
            <div
              className="relative w-full max-w-[420px] mx-auto rounded-2xl overflow-hidden shadow-[0_24px_60px_-20px_rgba(33,18,8,0.6),0_4px_12px_-4px_rgba(33,18,8,0.4)] border border-ursa-gold/30"
              style={{
                aspectRatio: "1.6 / 1",
                background:
                  "linear-gradient(135deg, #2D4A36 0%, #3E6149 35%, #6F4A2E 75%, #3B2417 100%)",
              }}
            >
              {/* Subtle texture overlay */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><g fill='none' stroke='%23D9BC7E' stroke-width='0.5' opacity='0.5'><path d='M0 40 Q20 20 40 40 T80 40'/><path d='M0 60 Q20 40 40 60 T80 60'/><circle cx='40' cy='40' r='1'/></g></svg>\")",
                }}
              />
              {/* Inner border (Art Nouveau frame) */}
              <div className="absolute inset-3 rounded-xl border border-ursa-gold/30 pointer-events-none" />

              {/* Pass content */}
              <div className="relative h-full flex flex-col p-5 md:p-6 text-ursa-cream">
                {/* Header row: brand + label */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-full bg-ursa-cream grid place-items-center text-ursa-dark-roast shrink-0">
                      <BearMark size={24} />
                    </span>
                    <div className="leading-tight">
                      <div className="font-display text-[1.05rem] md:text-[1.15rem] font-semibold text-ursa-cream">
                        {t("content.loyalty.pass.brand")}
                      </div>
                      <div className="font-label text-[0.55rem] tracking-[0.22em] uppercase text-ursa-gold-soft">
                        {t("content.loyalty.pass.address")}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-label text-[0.5rem] tracking-[0.2em] uppercase text-ursa-sage">
                      {t("content.loyalty.pass.label-card-es")}
                    </div>
                    <div className="font-label text-[0.5rem] tracking-[0.16em] uppercase text-ursa-sage">
                      {t("content.loyalty.pass.label-card-en")}
                    </div>
                  </div>
                </div>

                {/* Stamp grid */}
                <div className="flex-1 flex flex-col justify-center my-3">
                  <div className="grid grid-cols-4 gap-2 md:gap-2.5 place-items-center">
                    {Array.from({ length: TOTAL_STAMPS }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-9 h-9 md:w-10 md:h-10 rounded-full grid place-items-center border",
                          i < FILLED_STAMPS
                            ? "bg-ursa-gold/15 border-ursa-gold/60"
                            : "bg-ursa-cream/5 border-ursa-cream/20 border-dashed"
                        )}
                      >
                        <PawStamp filled={i < FILLED_STAMPS} size={22} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-center">
                    <p className="font-display text-[0.95rem] md:text-[1.05rem] font-semibold text-ursa-cream m-0">
                      {t("content.loyalty.pass.remaining", { n: remaining })}
                    </p>
                    <p className="font-label text-[0.55rem] tracking-[0.16em] uppercase text-ursa-sage m-0 mt-0.5">
                      {t("content.loyalty.pass.stamped", { filled: FILLED_STAMPS, total: TOTAL_STAMPS })}
                    </p>
                  </div>
                </div>

                {/* Member name + progress bar */}
                <div className="border-t border-ursa-cream/15 pt-2.5">
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <div>
                      <span className="font-label text-[0.5rem] tracking-[0.18em] uppercase text-ursa-sage">
                        {t("content.loyalty.pass.member-label")}
                      </span>
                      <div className="font-display text-[0.92rem] font-semibold text-ursa-cream leading-tight">
                        {t("content.loyalty.pass.member-name")}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-label text-[0.5rem] tracking-[0.18em] uppercase text-ursa-sage">
                        {t("content.loyalty.pass.member-since-label")}
                      </span>
                      <div className="font-display text-[0.78rem] text-ursa-gold-soft leading-tight">
                        {t("content.loyalty.pass.member-since-value")}
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-ursa-cream/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-ursa-gold to-ursa-gold-soft rounded-full transition-all duration-500"
                      style={{ width: `${(FILLED_STAMPS / TOTAL_STAMPS) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Add to wallet button */}
                <div className="mt-3 flex items-center justify-center gap-2 bg-ursa-cream/10 hover:bg-ursa-cream/15 border border-ursa-gold/40 rounded-lg py-2 px-3 transition cursor-pointer">
                  <Smartphone size={14} className="text-ursa-gold-soft" />
                  <span className="font-label text-[0.58rem] tracking-[0.18em] uppercase text-ursa-cream">
                    {t("content.loyalty.pass.add-to-wallet")}
                  </span>
                </div>
              </div>
            </div>

            {/* Pass fact strip */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Pill tone="gold">{t("content.loyalty.pass.pill.apple")}</Pill>
              <Pill tone="forest">{t("content.loyalty.pass.pill.google")}</Pill>
              <Pill tone="default">{t("content.loyalty.pass.pill.no-app")}</Pill>
              <Pill tone="default">{t("content.loyalty.pass.pill.one-tap")}</Pill>
              <Pill tone="default">{t("content.loyalty.pass.pill.lock-screen")}</Pill>
            </div>
          </div>

          {/* Side notes */}
          <div className="space-y-4">
            <Card className="bg-ursa-foam">
              <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-3 flex items-center gap-2">
                <CreditCard size={18} className="text-ursa-gold-text" /> {t("content.loyalty.why-wallet.title")}
              </h3>
              <p className="text-[0.92rem] leading-relaxed text-foreground/85 mb-3 m-0">
                {t("content.loyalty.why-wallet.body")}
              </p>
              <ul className="space-y-2 text-[0.88rem] m-0 p-0 list-none">
                <li className="flex items-start gap-2">
                  <Check size={15} className="text-ursa-forest-deep mt-0.5 shrink-0" />
                  <span>{t("content.loyalty.why-wallet.bullet.1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={15} className="text-ursa-forest-deep mt-0.5 shrink-0" />
                  <span>{t("content.loyalty.why-wallet.bullet.2")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={15} className="text-ursa-forest-deep mt-0.5 shrink-0" />
                  <span>{t("content.loyalty.why-wallet.bullet.3")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={15} className="text-ursa-forest-deep mt-0.5 shrink-0" />
                  <span>{t("content.loyalty.why-wallet.bullet.4")}</span>
                </li>
              </ul>
            </Card>
            <Callout tone="gold" title={t("content.loyalty.why-8.title")}>
              {t("content.loyalty.why-8.body")}
            </Callout>
            <Callout tone="forest" title={t("content.loyalty.paw-stamp.title")}>
              {t("content.loyalty.paw-stamp.body")}
            </Callout>
          </div>
        </Grid>
      </ViewSection>

      {/* ============================================================
          SECTION 3 — The psychology (4 cards)
         ============================================================ */}
      <ViewSection badge={t("content.loyalty.section.03.badge")} title={t("content.loyalty.section.03.title")} meta={t("content.loyalty.section.03.meta")}>
        <Grid cols={2}>
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            return (
              <Card key={p.id}>
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className={cn(
                      "w-10 h-10 rounded-lg grid place-items-center shrink-0",
                      p.tone === "gold" && "bg-ursa-gold/15 text-ursa-gold-text",
                      p.tone === "forest" && "bg-ursa-dark-roast/10 text-ursa-forest-deep",
                      p.tone === "terracotta" && "bg-ursa-terracotta/15 text-ursa-terracotta-text"
                    )}
                  >
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="font-display text-[1.1rem] font-semibold text-ursa-dark-roast m-0 leading-tight">
                      {t(`content.loyalty.principle.${p.id}.name`)}
                    </h3>
                    <p className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground m-0 mt-1">
                      {t(`content.loyalty.principle.${p.id}.source`)}
                    </p>
                  </div>
                </div>
                <div className="bg-muted/50 border-l-2 border-ursa-gold/40 pl-3 py-1.5 mb-3">
                  <p className="text-[0.85rem] italic text-ursa-dark-roast m-0">
                    &ldquo;{t(`content.loyalty.principle.${p.id}.finding`)}&rdquo;
                  </p>
                </div>
                <p className="text-[0.92rem] leading-relaxed text-foreground/85 mb-3 m-0">{t(`content.loyalty.principle.${p.id}.apply`)}</p>
                <div className="bg-ursa-dark-roast/5 border border-ursa-forest-deep/20 rounded-md p-3">
                  <p className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-ursa-forest-deep mb-1">
                    {t("content.loyalty.principle.rec-label")}
                  </p>
                  <p className="text-[0.88rem] leading-relaxed text-ursa-dark-roast m-0">{t(`content.loyalty.principle.${p.id}.rec`)}</p>
                </div>
              </Card>
            );
          })}
        </Grid>
        <Callout tone="warn" title={t("content.loyalty.principle.82-callout.title")}>
          {t("content.loyalty.principle.82-callout.body")}
        </Callout>
      </ViewSection>

      {/* ============================================================
          SECTION 3B — Evidence library & success cases
          Meta-analyses · wallet adoption · success cases · punch vs app
         ============================================================ */}
      <ViewSection badge={t("content.loyalty.section.03b.badge")} title={t("content.loyalty.section.03b.title")} meta={t("content.loyalty.section.03b.meta")}>
        <p className="text-[0.92rem] text-muted-foreground max-w-[80ch] mb-5 m-0">
          {t("content.loyalty.section.03b.lede")}
        </p>
        <Grid cols={2}>
          {EVIDENCE_CARDS.map((card) => {
            const Icon = card.icon;
            const bulletCount = EVIDENCE_BULLETS[card.id] ?? 0;
            return (
              <Card key={card.id}>
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className={cn(
                      "w-10 h-10 rounded-lg grid place-items-center shrink-0",
                      card.tone === "gold" && "bg-ursa-gold/15 text-ursa-gold-text",
                      card.tone === "forest" && "bg-ursa-dark-roast/10 text-ursa-forest-deep",
                      card.tone === "terracotta" && "bg-ursa-terracotta/15 text-ursa-terracotta-text"
                    )}
                  >
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="font-display text-[1.1rem] font-semibold text-ursa-dark-roast m-0 leading-tight">
                      {t(`content.loyalty.evidence.${card.id}.title`)}
                    </h3>
                    <p className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground m-0 mt-1">
                      {t(`content.loyalty.evidence.${card.id}.source`)}
                    </p>
                  </div>
                </div>
                <p className="text-[0.92rem] leading-relaxed text-foreground/85 mb-3 m-0">
                  {t(`content.loyalty.evidence.${card.id}.body`)}
                </p>
                <ul className="space-y-2 m-0 p-0 list-none">
                  {Array.from({ length: bulletCount }).map((_, i) => (
                    <li key={i} className="flex items-start gap-2 text-[0.86rem] leading-relaxed text-foreground/85">
                      <span className="font-label text-[0.55rem] tracking-[0.16em] uppercase text-ursa-gold-text shrink-0 mt-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">{t(`content.loyalty.evidence.${card.id}.bullet.${i + 1}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 bg-ursa-dark-roast/5 border border-ursa-forest-deep/20 rounded-md p-3">
                  <p className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-ursa-forest-deep mb-1">
                    {t("content.loyalty.evidence.ursa-label")}
                  </p>
                  <p className="text-[0.88rem] leading-relaxed text-ursa-dark-roast m-0">
                    {t(`content.loyalty.evidence.${card.id}.ursa`)}
                  </p>
                </div>
              </Card>
            );
          })}
        </Grid>
        <Callout tone="forest" title={t("content.loyalty.evidence.synthesis.title")}>
          {t("content.loyalty.evidence.synthesis.body")}
        </Callout>
      </ViewSection>

      {/* ============================================================
          SECTION 4 — Interactive economics calculator
         ============================================================ */}
      <ViewSection badge={t("content.loyalty.section.04.badge")} title={t("content.loyalty.section.04.title")} meta={t("content.loyalty.section.04.meta")}>
        <Grid cols={2}>
          {/* Inputs */}
          <Card>
            <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-4 flex items-center gap-2">
              <Coffee size={18} className="text-ursa-gold-text" /> {t("content.loyalty.calc.inputs-title")}
            </h3>
            <div className="space-y-5">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <Label className="font-label text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground">
                    {t("content.loyalty.calc.field.avg-ticket.label")}
                  </Label>
                  <span className="font-display text-lg font-semibold text-ursa-dark-roast">
                    {PEN(avgTicket)}
                  </span>
                </div>
                <Slider
                  value={[avgTicket]}
                  onValueChange={(v) => setAvgTicket(v[0])}
                  min={6}
                  max={30}
                  step={1}
                />
                <p className="text-[0.72rem] text-muted-foreground mt-1.5 m-0">
                  {t("content.loyalty.calc.field.avg-ticket.hint")}
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <Label className="font-label text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground">
                    {t("content.loyalty.calc.field.visits-complete.label")}
                  </Label>
                  <span className="font-display text-lg font-semibold text-ursa-dark-roast">
                    {visitsToComplete}
                  </span>
                </div>
                <Slider
                  value={[visitsToComplete]}
                  onValueChange={(v) => setVisitsToComplete(v[0])}
                  min={6}
                  max={12}
                  step={1}
                />
                <p className="text-[0.72rem] text-muted-foreground mt-1.5 m-0">
                  {t("content.loyalty.calc.field.visits-complete.hint")}
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <Label className="font-label text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground">
                    {t("content.loyalty.calc.field.free-cost.label")}
                  </Label>
                  <span className="font-display text-lg font-semibold text-ursa-dark-roast">
                    {PEN(freeCoffeeCost)}
                  </span>
                </div>
                <Slider
                  value={[freeCoffeeCost]}
                  onValueChange={(v) => setFreeCoffeeCost(v[0])}
                  min={1}
                  max={8}
                  step={0.5}
                />
                <p className="text-[0.72rem] text-muted-foreground mt-1.5 m-0">
                  {t("content.loyalty.calc.field.free-cost.hint")}
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <Label className="font-label text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground">
                    {t("content.loyalty.calc.field.endowed.label")}
                  </Label>
                  <span className="font-display text-lg font-semibold text-ursa-dark-roast">
                    {endowedStamps}
                  </span>
                </div>
                <Slider
                  value={[endowedStamps]}
                  onValueChange={(v) => setEndowedStamps(v[0])}
                  min={0}
                  max={3}
                  step={1}
                />
                <p className="text-[0.72rem] text-muted-foreground mt-1.5 m-0">
                  {t("content.loyalty.calc.field.endowed.hint", { cost: freeCoffeeCost.toFixed(2) })}
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <Label className="font-label text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground">
                    {t("content.loyalty.calc.field.cycles.label")}
                  </Label>
                  <span className="font-display text-lg font-semibold text-ursa-dark-roast">
                    {cycles}
                  </span>
                </div>
                <Slider
                  value={[cycles]}
                  onValueChange={(v) => setCycles(v[0])}
                  min={3}
                  max={12}
                  step={1}
                />
                <p className="text-[0.72rem] text-muted-foreground mt-1.5 m-0">
                  {t("content.loyalty.calc.field.cycles.hint")}
                </p>
              </div>
            </div>
          </Card>

          {/* Outputs */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-ursa-paper to-ursa-cream">
              <div className="text-center">
                <div className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-muted-foreground">
                  {t("content.loyalty.calc.outputs.net-label")}
                </div>
                <div
                  className={cn(
                    "font-display text-5xl font-semibold leading-none mt-2",
                    calc.netPerCycle >= 0 ? "text-ursa-forest-deep" : "text-ursa-terracotta-text"
                  )}
                >
                  {PENn(calc.netPerCycle)}
                </div>
                <div className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground mt-2">
                  {t("content.loyalty.calc.outputs.net-formula", { paid: calc.paidVisits, ticket: PEN(avgTicket), reward: PEN(freeCoffeeCost) })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-ursa-line-soft">
                <Metric label={t("content.loyalty.calc.metric.revenue-cycle")} value={PENn(calc.revenuePerCycle)} tone="forest" />
                <Metric label={t("content.loyalty.calc.metric.reward-cost")} value={PEN(calc.rewardCost)} tone="terracotta" />
                <Metric label={t("content.loyalty.calc.metric.ratio")} value={`${calc.ratio.toFixed(1)}×`} tone="gold" />
                <Metric label={t("content.loyalty.calc.metric.net-cycle")} value={PENn(calc.netPerCycle)} tone="forest" />
              </div>
            </Card>

            <Card highlight>
              <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-ursa-gold-text" /> {t("content.loyalty.calc.clv.title")}
              </h3>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-display text-4xl font-semibold text-ursa-dark-roast leading-none">
                  {PENn(calc.clv)}
                </span>
                <span className="font-label text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground">
                  {t("content.loyalty.calc.clv.over", { cycles })}
                </span>
              </div>
              <p className="text-[0.88rem] leading-relaxed text-muted-foreground m-0">
                {t("content.loyalty.calc.clv.body", { cost: PEN(freeCoffeeCost), revenue: PENn(calc.revenuePerCycle), ratio: calc.ratio.toFixed(1) })}
              </p>
            </Card>

            <Callout tone="ok" title={t("content.loyalty.calc.headline.title")}>
              {t("content.loyalty.calc.headline.body", { cost: PEN(freeCoffeeCost), paid: calc.paidVisits, revenue: PENn(calc.revenuePerCycle), ratio: calc.ratio.toFixed(1), cycles, clv: PENn(calc.clv) })}
            </Callout>
          </div>
        </Grid>

        {/* Bottom benchmark callout */}
        <Callout tone="warn" title={t("content.loyalty.calc.benchmark.title")}>
          {t("content.loyalty.calc.benchmark.body", { clv: PENn(calc.clv), total: PENn(calc.clv * 150) })}
        </Callout>
      </ViewSection>

      {/* ============================================================
          SECTION 5 — Marketing recommendations
         ============================================================ */}
      <ViewSection badge={t("content.loyalty.section.05.badge")} title={t("content.loyalty.section.05.title")} meta={t("content.loyalty.section.05.meta")}>
        <Grid cols={3}>
          {MARKETING_TACTICS.map((tactic) => {
            const Icon = tactic.icon;
            return (
              <Card key={tactic.id}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className={cn(
                      "w-9 h-9 rounded-lg grid place-items-center shrink-0",
                      tactic.tone === "gold" && "bg-ursa-gold/15 text-ursa-gold-text",
                      tactic.tone === "forest" && "bg-ursa-dark-roast/10 text-ursa-forest-deep",
                      tactic.tone === "terracotta" && "bg-ursa-terracotta/15 text-ursa-terracotta-text"
                    )}
                  >
                    <Icon size={18} />
                  </span>
                  <Pill tone={tactic.tone}>{t(`content.loyalty.tactic.${tactic.id}.pill`)}</Pill>
                </div>
                <h3 className="font-display text-[1rem] font-semibold text-ursa-dark-roast mt-0 mb-1.5 leading-tight">
                  {t(`content.loyalty.tactic.${tactic.id}.title`)}
                </h3>
                <p className="text-[0.86rem] leading-relaxed text-muted-foreground m-0">{t(`content.loyalty.tactic.${tactic.id}.body`)}</p>
              </Card>
            );
          })}
        </Grid>
        <Callout tone="forest" title={t("content.loyalty.sequencing.title")}>
          {t("content.loyalty.sequencing.body")}
        </Callout>
      </ViewSection>

      {/* ============================================================
          SECTION 6 — Competitor comparison
         ============================================================ */}
      <ViewSection badge={t("content.loyalty.section.06.badge")} title={t("content.loyalty.section.06.title")} meta={t("content.loyalty.section.06.meta")}>
        <Card className="p-4 md:p-6">
          <div className="overflow-x-auto ursa-scroll -mx-4 px-4 md:mx-0 md:px-0">
            <table className="w-full border-collapse text-[0.82rem] min-w-[760px]">
              <thead>
                <tr className="border-b-2 border-ursa-gold/30">
                  <th className="text-left p-3 font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
                    {t("content.loyalty.compare.col.model")}
                  </th>
                  <th className="text-left p-3 font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
                    {t("content.loyalty.compare.col.mechanic")}
                  </th>
                  <th className="text-left p-3 font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
                    {t("content.loyalty.compare.col.friction")}
                  </th>
                  <th className="text-left p-3 font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
                    {t("content.loyalty.compare.col.data")}
                  </th>
                  <th className="text-left p-3 font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
                    {t("content.loyalty.compare.col.personalisation")}
                  </th>
                  <th className="text-left p-3 font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
                    {t("content.loyalty.compare.col.brand")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPETITORS_TABLE.map((row) => (
                  <tr
                    key={row.rowKey}
                    className={cn(
                      "border-b border-ursa-line-soft transition",
                      row.advantage
                        ? "bg-ursa-gold/8 hover:bg-ursa-gold/12"
                        : "hover:bg-muted/30"
                    )}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold text-ursa-dark-roast">
                          {t(`content.loyalty.compare.row.${row.rowKey}.name`)}
                        </span>
                        {row.advantage && (
                          <Pill tone="gold">
                            <Award size={11} /> {t("content.loyalty.compare.advantage.ursa")}
                          </Pill>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-foreground/85">{t(`content.loyalty.compare.row.${row.rowKey}.model`)}</td>
                    <td className="p-3 text-foreground/85">{t(`content.loyalty.compare.row.${row.rowKey}.friction`)}</td>
                    <td className="p-3 text-foreground/85">{t(`content.loyalty.compare.row.${row.rowKey}.data`)}</td>
                    <td className="p-3 text-foreground/85">{t(`content.loyalty.compare.row.${row.rowKey}.personalisation`)}</td>
                    <td className="p-3 text-foreground/85">{t(`content.loyalty.compare.row.${row.rowKey}.brand`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Grid cols={3}>
          <Card>
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
              <Zap size={16} className="text-ursa-gold-text" /> {t("content.loyalty.compare.card.1.title")}
            </h3>
            <p className="text-[0.86rem] leading-relaxed text-muted-foreground m-0">
              {t("content.loyalty.compare.card.1.body")}
            </p>
          </Card>
          <Card>
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
              <Target size={16} className="text-ursa-terracotta-text" /> {t("content.loyalty.compare.card.2.title")}
            </h3>
            <p className="text-[0.86rem] leading-relaxed text-muted-foreground m-0">
              {t("content.loyalty.compare.card.2.body")}
            </p>
          </Card>
          <Card>
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
              <PawPrint size={16} className="text-ursa-forest-deep" /> {t("content.loyalty.compare.card.3.title")}
            </h3>
            <p className="text-[0.86rem] leading-relaxed text-muted-foreground m-0">
              {t("content.loyalty.compare.card.3.body")}
            </p>
          </Card>
        </Grid>
      </ViewSection>

      {/* ============================================================
          SECTION 7 — Improvement recommendations
         ============================================================ */}
      <ViewSection badge={t("content.loyalty.section.07.badge")} title={t("content.loyalty.section.07.title")} meta={t("content.loyalty.section.07.meta")}>
        <Grid cols={2}>
          {IMPROVEMENTS.map((imp) => {
            const Icon = imp.icon;
            return (
              <Card key={imp.id}>
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className={cn(
                      "w-10 h-10 rounded-lg grid place-items-center shrink-0",
                      imp.tone === "gold" && "bg-ursa-gold/15 text-ursa-gold-text",
                      imp.tone === "forest" && "bg-ursa-dark-roast/10 text-ursa-forest-deep",
                      imp.tone === "terracotta" && "bg-ursa-terracotta/15 text-ursa-terracotta-text"
                    )}
                  >
                    <Icon size={20} />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast m-0 leading-tight">
                        {t(`content.loyalty.improvement.${imp.id}.title`)}
                      </h3>
                      <Pill tone={imp.tone}>{t(`content.loyalty.improvement.${imp.id}.impact`)}</Pill>
                    </div>
                    <p className="text-[0.88rem] leading-relaxed text-muted-foreground m-0">{t(`content.loyalty.improvement.${imp.id}.body`)}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </Grid>
        <ArtNouveauDivider />
        <Callout tone="forest" title={t("content.loyalty.spirit-check.title")}>
          {t("content.loyalty.spirit-check.body")}
        </Callout>
      </ViewSection>

      {/* ============================================================
          SECTION 8 — Dossier link
         ============================================================ */}
      <ViewSection badge={t("content.loyalty.section.08.badge")} title={t("content.loyalty.section.08.title")}>
        <div className="flex flex-wrap items-center gap-4">
          <DossierLinkBanner moduleId="04-marketing-growth-and-retention-plan" />
          <button
            onClick={() => navigate("growth")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ursa-dark-roast text-ursa-cream hover:bg-ursa-espresso transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
          >
            <Coffee size={14} /> {t("content.loyalty.button.growth")}
            <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate("calculator")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ursa-gold text-ursa-dark-roast hover:bg-ursa-gold-soft transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
          >
            <CreditCard size={14} /> {t("content.loyalty.button.calculator")}
            <ArrowRight size={14} />
          </button>
        </div>
      </ViewSection>
    </>
  );
}

// --- Small subcomponents ---------------------------------------------------
function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "forest" | "gold" | "terracotta";
}) {
  const toneCls = {
    default: "text-ursa-dark-roast",
    forest: "text-ursa-forest-deep",
    gold: "text-ursa-gold-text",
    terracotta: "text-ursa-terracotta-text",
  };
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-muted-foreground">
        {label}
      </span>
      <span className={cn("font-display text-[1.15rem] font-semibold leading-tight", toneCls[tone])}>
        {value}
      </span>
    </div>
  );
}
