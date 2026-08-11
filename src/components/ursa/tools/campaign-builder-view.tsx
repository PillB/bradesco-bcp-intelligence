"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import { ViewHero, ViewSection, Card, DossierLinkBanner } from "../view-shell";
import { BearMark, Callout, ArtNouveauDivider } from "../ursa-brand";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
  ArrowRight, ArrowLeft, Check, RotateCcw, Target, Users, Megaphone,
  TrendingUp, Wallet, FileText,
  Lightbulb, Award, ListChecks, Fingerprint,
  Layers, Tag, ShieldCheck, Anchor,
  AlertTriangle, Beaker, Scale,
} from "lucide-react";

/**
 * Campaign Builder — an interactive wizard that walks the owner through
 * assembling a campaign: offer → audience → channel → metric → budget → summary.
 * State is local; the summary can be copied to clipboard.
 */

type Offer = { id: string };
type Audience = { id: string };
type Channel = { id: string };
type Metric = { id: string };

const OFFERS: Offer[] = [
  { id: "ursamanana" },
  { id: "tasting" },
  { id: "pairing" },
  { id: "hotelcard" },
  { id: "gramweek" },
  { id: "cupping" },
];

const AUDIENCES: Audience[] = [
  { id: "morning" },
  { id: "tourist" },
  { id: "remote" },
  { id: "curious" },
  { id: "office" },
  { id: "hotel" },
];

const CHANNELS: Channel[] = [
  { id: "instagram" },
  { id: "meta" },
  { id: "creator" },
  { id: "google" },
  { id: "whatsapp" },
  { id: "hotel" },
  { id: "rappi" },
  { id: "event" },
];

const METRICS: Metric[] = [
  { id: "visits" },
  { id: "profile" },
  { id: "aov" },
  { id: "repeat" },
  { id: "tags" },
  { id: "reviews" },
];

const STEP_IDS = ["offer", "audience", "channel", "metric", "budget", "summary"] as const;
const STEP_ICONS = [Target, Users, Megaphone, TrendingUp, Wallet, FileText];

const offerKey = (id: string, field: string) => `content.campaign-builder.offer.${id}.${field}`;
const audienceKey = (id: string, field: string) => `content.campaign-builder.audience.${id}.${field}`;
const channelKey = (id: string, field: string) => `content.campaign-builder.channel.${id}.${field}`;
const metricKey = (id: string, field: string) => `content.campaign-builder.metric.${id}.${field}`;
const stepKey = (id: string, field: string) => `content.campaign-builder.step.${id}.${field}`;

export function CampaignBuilderView() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [offer, setOffer] = useState<string | null>(null);
  const [audience, setAudience] = useState<string | null>(null);
  const [channel, setChannel] = useState<string | null>(null);
  const [metric, setMetric] = useState<string | null>(null);
  const [budget, setBudget] = useState(800);
  const [copied, setCopied] = useState(false);

  const canAdvance = () => {
    if (step === 0) return offer !== null;
    if (step === 1) return audience !== null;
    if (step === 2) return channel !== null;
    if (step === 3) return metric !== null;
    return true;
  };

  const reset = () => {
    setStep(0);
    setOffer(null);
    setAudience(null);
    setChannel(null);
    setMetric(null);
    setBudget(800);
  };

  const selectedOfferName = offer ? t(offerKey(offer, "name")) : null;
  const selectedOfferDesc = offer ? t(offerKey(offer, "desc")) : null;
  const selectedOfferAnchor = offer ? t(offerKey(offer, "anchor")) : null;
  const selectedAudienceName = audience ? t(audienceKey(audience, "name")) : null;
  const selectedAudienceDesc = audience ? t(audienceKey(audience, "desc")) : null;
  const selectedChannelName = channel ? t(channelKey(channel, "name")) : null;
  const selectedChannelReach = channel ? t(channelKey(channel, "reach")) : null;
  const selectedChannelCost = channel ? t(channelKey(channel, "cost")) : null;
  const selectedMetricName = metric ? t(metricKey(metric, "name")) : null;
  const selectedMetricDesc = metric ? t(metricKey(metric, "desc")) : null;
  const selectedMetricTarget = metric ? t(metricKey(metric, "target")) : null;

  const summaryText = () => {
    const lines = [
      t("content.campaign-builder.brief.output.header"),
      "============================",
      "",
      `${t("content.campaign-builder.brief.output.offer-label")}:     ${selectedOfferName ?? "—"} (${selectedOfferAnchor ?? ""})`,
      `           ${selectedOfferDesc ?? ""}`,
      "",
      `${t("content.campaign-builder.brief.output.audience-label")}:  ${selectedAudienceName ?? "—"}`,
      `           ${selectedAudienceDesc ?? ""}`,
      "",
      `${t("content.campaign-builder.brief.output.channel-label")}:   ${selectedChannelName ?? "—"}`,
      `           ${t("content.campaign-builder.brief.output.reach-label")}: ${selectedChannelReach ?? "—"} · ${t("content.campaign-builder.brief.output.cost-label")}: ${selectedChannelCost ?? "—"}`,
      "",
      `${t("content.campaign-builder.brief.output.metric-label")}:    ${selectedMetricName ?? "—"} (${t("content.campaign-builder.brief.output.target-label")}: ${selectedMetricTarget ?? "—"})`,
      `           ${selectedMetricDesc ?? ""}`,
      "",
      `${t("content.campaign-builder.brief.output.budget-label")}:    S/. ${budget}/${t("content.campaign-builder.step.budget.label-monthly").toLowerCase()}`,
      "",
      `${t("content.campaign-builder.brief.output.stop-rule-label")}: ${t("content.campaign-builder.brief.output.stop-rule-template", {
        metric: (selectedMetricName ?? t("content.campaign-builder.step.metric.label")).toLowerCase(),
        target: selectedMetricTarget ?? "—",
      })}`,
      "",
      t("content.campaign-builder.brief.output.footer"),
    ];
    return lines.join("\n");
  };

  const copySummary = () => {
    navigator.clipboard.writeText(summaryText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const STEPS = STEP_IDS.map((id, i) => ({
    id,
    label: t(stepKey(id, "label")),
    icon: STEP_ICONS[i],
  }));

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.campaign-builder.eyebrow")}
        title={t("content.view.campaign-builder.title")}
        lede={<>{t("content.campaign-builder.hero.lede")}</>}
        meta={[
          { label: t("content.campaign-builder.meta.steps"), value: t("content.campaign-builder.meta.steps-value") },
          { label: t("content.campaign-builder.meta.source"), value: t("content.campaign-builder.meta.source-value") },
          { label: t("content.campaign-builder.meta.output"), value: t("content.campaign-builder.meta.output-value") },
        ]}
        tone="gold"
      />

      <ViewSection>
        {/* Step progress bar */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto ursa-scroll pb-2">
          {STEPS.map((s, i) => {
            const isDone = i < step;
            const isActive = i === step;
            return (
              <div key={s.id} className="flex items-center shrink-0">
                <button
                  onClick={() => i <= step && setStep(i)}
                  disabled={i > step}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full font-label text-[0.66rem] tracking-[0.12em] uppercase transition border",
                    isActive && "bg-ursa-dark-roast text-ursa-cream border-ursa-dark-roast",
                    isDone && "bg-ursa-dark-roast/15 text-ursa-forest-deep border-ursa-forest-deep/40 hover:bg-ursa-dark-roast/25",
                    !isActive && !isDone && "bg-card text-muted-foreground border-ursa-line-soft"
                  )}
                >
                  <span className={cn("w-5 h-5 rounded-full grid place-items-center text-[0.6rem] font-semibold", isActive ? "bg-ursa-gold text-ursa-dark-roast" : isDone ? "bg-ursa-dark-roast text-ursa-cream" : "bg-muted")}>
                    {isDone ? <Check size={11} /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <span className="text-muted-foreground/40 mx-0.5">→</span>}
              </div>
            );
          })}
          <button onClick={reset} className="ml-auto shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full font-label text-[0.66rem] tracking-[0.12em] uppercase text-muted-foreground hover:text-ursa-terracotta-text transition">
            <RotateCcw size={12} /> {t("content.campaign-builder.action.reset")}
          </button>
        </div>

        {/* Step content */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start [grid-template-columns:minmax(0,1fr)]">
          {/* Main step area */}
          <Card className="min-h-[400px]">
            {step === 0 && (
              <StepShell title={t(stepKey("offer", "title"))} desc={t(stepKey("offer", "desc"))} icon={<Target size={20} className="text-ursa-gold-text" />}>
                <div className="grid sm:grid-cols-2 gap-3">
                  {OFFERS.map((o) => (
                    <OptionCard
                      key={o.id}
                      selected={offer === o.id}
                      onClick={() => setOffer(o.id)}
                      title={t(offerKey(o.id, "name"))}
                      desc={t(offerKey(o.id, "desc"))}
                      badge={t(offerKey(o.id, "anchor"))}
                    />
                  ))}
                </div>
              </StepShell>
            )}
            {step === 1 && (
              <StepShell title={t(stepKey("audience", "title"))} desc={t(stepKey("audience", "desc"))} icon={<Users size={20} className="text-ursa-gold-text" />}>
                <div className="grid sm:grid-cols-2 gap-3">
                  {AUDIENCES.map((a) => (
                    <OptionCard
                      key={a.id}
                      selected={audience === a.id}
                      onClick={() => setAudience(a.id)}
                      title={t(audienceKey(a.id, "name"))}
                      desc={t(audienceKey(a.id, "desc"))}
                    />
                  ))}
                </div>
              </StepShell>
            )}
            {step === 2 && (
              <StepShell title={t(stepKey("channel", "title"))} desc={t(stepKey("channel", "desc"))} icon={<Megaphone size={20} className="text-ursa-gold-text" />}>
                <div className="grid sm:grid-cols-2 gap-3">
                  {CHANNELS.map((c) => (
                    <OptionCard
                      key={c.id}
                      selected={channel === c.id}
                      onClick={() => setChannel(c.id)}
                      title={t(channelKey(c.id, "name"))}
                      desc={`${t(channelKey(c.id, "reach"))} · ${t(channelKey(c.id, "cost"))}`}
                    />
                  ))}
                </div>
              </StepShell>
            )}
            {step === 3 && (
              <StepShell title={t(stepKey("metric", "title"))} desc={t(stepKey("metric", "desc"))} icon={<TrendingUp size={20} className="text-ursa-gold-text" />}>
                <div className="grid sm:grid-cols-2 gap-3">
                  {METRICS.map((m) => (
                    <OptionCard
                      key={m.id}
                      selected={metric === m.id}
                      onClick={() => setMetric(m.id)}
                      title={t(metricKey(m.id, "name"))}
                      desc={t(metricKey(m.id, "desc"))}
                      badge={t(metricKey(m.id, "target"))}
                    />
                  ))}
                </div>
              </StepShell>
            )}
            {step === 4 && (
              <StepShell title={t(stepKey("budget", "title"))} desc={t(stepKey("budget", "desc"))} icon={<Wallet size={20} className="text-ursa-gold-text" />}>
                <div className="max-w-md">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="font-label text-[0.72rem] tracking-[0.12em] uppercase text-muted-foreground">{t(stepKey("budget", "label-monthly"))}</span>
                    <span className="font-display text-4xl font-semibold text-ursa-dark-roast">S/. {budget}</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={3000}
                    step={100}
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-ursa-gold"
                  />
                  <div className="flex justify-between font-label text-[0.6rem] tracking-[0.1em] uppercase text-muted-foreground mt-2">
                    <span>{t("content.campaign-builder.step.budget.lean")}</span>
                    <span>{t("content.campaign-builder.step.budget.growth")}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <BudgetTier label={t("content.campaign-builder.step.budget.tier-lean")} amount={500} current={budget} onClick={setBudget} />
                    <BudgetTier label={t("content.campaign-builder.step.budget.tier-moderate")} amount={1200} current={budget} onClick={setBudget} />
                    <BudgetTier label={t("content.campaign-builder.step.budget.tier-growth")} amount={2500} current={budget} onClick={setBudget} />
                  </div>
                </div>
              </StepShell>
            )}
            {step === 5 && (
              <StepShell title={t(stepKey("summary", "title"))} desc={t(stepKey("summary", "desc"))} icon={<FileText size={20} className="text-ursa-gold-text" />}>
                <div className="relative">
                  <pre className="bg-ursa-espresso text-ursa-cream rounded-xl p-5 text-[0.82rem] leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto ursa-scroll border border-ursa-gold/30">
{summaryText()}
                  </pre>
                  <button
                    onClick={copySummary}
                    className={cn(
                      "absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label text-[0.66rem] tracking-[0.1em] uppercase transition",
                      copied ? "bg-ursa-dark-roast text-ursa-cream" : "bg-ursa-gold text-ursa-dark-roast hover:bg-ursa-gold-soft"
                    )}
                  >
                    {copied ? <><Check size={12} /> {t("content.campaign-builder.action.copied")}</> : t("content.campaign-builder.action.copy")}
                  </button>
                </div>
                <Callout tone="forest" title={t("content.campaign-builder.callout.stop-rule.title")}>
                  <p className="m-0 text-[0.88rem]">
                    {t("content.campaign-builder.callout.stop-rule.body")}
                  </p>
                </Callout>
              </StepShell>
            )}
          </Card>

          {/* Sidebar — running summary */}
          <Card className="bg-ursa-foam lg:sticky lg:top-24">
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-3 flex items-center gap-2">
              <BearMark size={18} className="text-ursa-dark-roast" /> {t("content.campaign-builder.brief.title")}
            </h3>
            <div className="space-y-3 text-[0.85rem]">
              <BriefRow label={t("content.campaign-builder.brief.row.offer")} value={selectedOfferName} tone="gold" />
              <BriefRow label={t("content.campaign-builder.brief.row.audience")} value={selectedAudienceName} tone="terracotta" />
              <BriefRow label={t("content.campaign-builder.brief.row.channel")} value={selectedChannelName} tone="forest" />
              <BriefRow label={t("content.campaign-builder.brief.row.metric")} value={selectedMetricName} tone="gold" />
              <BriefRow label={t("content.campaign-builder.brief.row.budget")} value={budget ? `S/. ${budget}/mo` : null} tone="forest" />
            </div>
            <ArtNouveauDivider className="my-4" />
            <p className="text-[0.76rem] text-muted-foreground m-0">
              {canAdvance() || step === 5
                ? t("content.campaign-builder.brief.hint-all-set")
                : t("content.campaign-builder.brief.hint-select", { step: STEPS[step].label.toLowerCase() })}
            </p>
          </Card>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-label text-[0.74rem] tracking-[0.12em] uppercase border border-ursa-line-soft text-muted-foreground hover:text-ursa-dark-roast hover:border-ursa-gold/60 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={14} /> {t("content.campaign-builder.action.back")}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => canAdvance() && setStep((s) => s + 1)}
              disabled={!canAdvance()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-label text-[0.74rem] tracking-[0.12em] uppercase bg-ursa-gold text-ursa-dark-roast hover:bg-ursa-gold-soft transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            >
              {t("content.campaign-builder.action.next")} <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => navigate("roadmap")}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-label text-[0.74rem] tracking-[0.12em] uppercase bg-ursa-dark-roast text-ursa-cream hover:bg-ursa-espresso transition shadow-lg"
            >
              {t("content.campaign-builder.action.view-roadmap")} <ArrowRight size={14} />
            </button>
          )}
        </div>
      </ViewSection>

      {/* ============================================================
          SCIENCE — the research behind the brief
         ============================================================ */}
      <ViewSection
        badge={t("content.campaign-builder.science.badge")}
        title={t("content.campaign-builder.science.title")}
        meta={t("content.campaign-builder.science.meta")}
      >
        <p className="text-[0.92rem] text-muted-foreground max-w-[78ch] m-0 mb-6">
          {t("content.campaign-builder.science.intro")}
        </p>

        {/* Group 1 — Campaign effectiveness research */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Lightbulb size={16} className="text-ursa-gold-text" />
          {t("content.campaign-builder.science.group.effectiveness")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {CB_EFFECTIVENESS.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        {/* Group 2 — Offer construction science */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Target size={16} className="text-ursa-gold-text" />
          {t("content.campaign-builder.science.group.offer")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {CB_OFFER.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        {/* Group 3 — Stop-rule & discipline science */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-ursa-gold-text" />
          {t("content.campaign-builder.science.group.discipline")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
          {CB_DISCIPLINE.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        <Callout tone="gold" title={t("content.campaign-builder.science.synthesis.title")}>
          {t("content.campaign-builder.science.synthesis.body")}
        </Callout>
      </ViewSection>

      <ViewSection>
        <DossierLinkBanner moduleId="04-marketing-growth-and-retention-plan" />
      </ViewSection>
    </>
  );
}

function StepShell({ title, desc, icon, children }: { title: string; desc: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="ursa-fade-up" key={title}>
      <div className="flex items-start gap-3 mb-5">
        <span className="w-11 h-11 rounded-full bg-ursa-gold/15 border border-ursa-gold/40 grid place-items-center shrink-0">{icon}</span>
        <div>
          <h2 className="font-display text-xl font-semibold text-ursa-dark-roast m-0 leading-tight">{title}</h2>
          <p className="text-[0.88rem] text-muted-foreground m-0 mt-1">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function OptionCard({ selected, onClick, title, desc, badge }: { selected: boolean; onClick: () => void; title: string; desc: string; badge?: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "text-left rounded-xl border p-4 transition ursa-card-hover",
        selected ? "border-ursa-gold bg-ursa-gold/10 shadow-[0_0_0_3px_rgba(184,146,74,0.15)]" : "border-ursa-line-soft bg-card hover:border-ursa-gold/60"
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <h4 className="font-display text-[0.98rem] font-semibold text-ursa-dark-roast m-0 leading-tight">{title}</h4>
        {selected && <Check size={16} className="text-ursa-gold-text shrink-0" />}
      </div>
      <p className="text-[0.82rem] text-muted-foreground m-0 leading-relaxed">{desc}</p>
      {badge && (
        <span className="inline-block mt-2 font-label text-[0.6rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full bg-ursa-dark-roast/10 text-ursa-forest-deep border border-ursa-forest-deep/20">
          {badge}
        </span>
      )}
    </button>
  );
}

function BudgetTier({ label, amount, current, onClick }: { label: string; amount: number; current: number; onClick: (n: number) => void }) {
  const isActive = current === amount;
  return (
    <button
      onClick={() => onClick(amount)}
      className={cn(
        "rounded-lg border p-2.5 text-center transition",
        isActive ? "border-ursa-gold bg-ursa-gold/10" : "border-ursa-line-soft bg-card hover:border-ursa-gold/40"
      )}
    >
      <div className="font-label text-[0.58rem] tracking-[0.1em] uppercase text-muted-foreground">{label}</div>
      <div className="font-display text-[0.92rem] font-semibold text-ursa-dark-roast mt-0.5">S/. {amount}</div>
    </button>
  );
}

function BriefRow({ label, value, tone }: { label: string; value: string | null | undefined; tone: "gold" | "terracotta" | "forest" }) {
  const tones = { gold: "text-ursa-gold-text", terracotta: "text-ursa-terracotta-text", forest: "text-ursa-forest-deep" };
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground shrink-0">{label}</span>
      <span className={cn("font-display text-[0.88rem] font-semibold text-right", !value && "text-muted-foreground/50 italic font-body", value && tones[tone])}>
        {value || "—"}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Science cards — research that backs the Campaign Builder.
// Strings live under content.campaign-builder.science.card.{id}.{field} in i18n.ts.
// ---------------------------------------------------------------------------

type ScienceTone = "gold" | "forest" | "terracotta";

type ScienceEntry = {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone: ScienceTone;
};

const CB_EFFECTIVENESS: ScienceEntry[] = [
  { id: "ogilvy-1985", icon: Lightbulb, tone: "forest" },
  { id: "binet-field-2013", icon: Award, tone: "gold" },
  { id: "direct-marketing-hughes", icon: ListChecks, tone: "forest" },
  { id: "romaniuk-distinctive", icon: Fingerprint, tone: "gold" },
];

const CB_OFFER: ScienceEntry[] = [
  { id: "hormozi-offer-stack", icon: Layers, tone: "forest" },
  { id: "monroe-pricing-psychology", icon: Tag, tone: "gold" },
  { id: "risk-reversal-dholakia", icon: ShieldCheck, tone: "forest" },
  { id: "anchoring-tversky-kahneman", icon: Anchor, tone: "gold" },
];

const CB_DISCIPLINE: ScienceEntry[] = [
  { id: "moore-healy-overconfidence", icon: AlertTriangle, tone: "terracotta" },
  { id: "ries-validated-learning", icon: Beaker, tone: "forest" },
  { id: "binet-field-stop-rules", icon: Scale, tone: "gold" },
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
            {t(`content.campaign-builder.science.card.${id}.name`)}
          </h4>
          <p className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-muted-foreground m-0 mt-0.5">
            {t(`content.campaign-builder.science.card.${id}.source`)}
          </p>
        </div>
      </div>
      <div className={cn("border-l-2 pl-2.5 py-1", accentBorder[tone])}>
        <p className="text-[0.82rem] italic text-ursa-dark-roast m-0 leading-snug">
          {t(`content.campaign-builder.science.card.${id}.finding`)}
        </p>
      </div>
      <p className="text-[0.84rem] leading-relaxed text-foreground/85 m-0">
        {t(`content.campaign-builder.science.card.${id}.apply`)}
      </p>
    </Card>
  );
}
