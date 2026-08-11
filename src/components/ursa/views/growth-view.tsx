"use client";

import { useState } from "react";
import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import {
  BearMark,
  ArtNouveauDivider,
  CupGlyph,
  Pill,
  Callout,
  StatBlock,
  SectionBadge,
  EvidenceTag,
} from "../ursa-brand";
import { HORMOZI_PRINCIPLES, SUTHERLAND_PRINCIPLES, BUDGET_SCENARIOS } from "@/lib/ursa-data";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowDown,
  ChevronDown,
  Compass,
  Coffee,
  Users,
  Map as MapIcon,
  MapPin,
  Star,
  Mail,
  Truck,
  Building2,
  Calendar,
  Hotel,
  Briefcase,
  Heart,
  Gift,
  MessageSquare,
  RefreshCw,
  Package,
  Store,
  Sparkles,
  Layers,
  Footprints,
  Camera,
  Repeat,
  Megaphone,
  Handshake,
  FlaskConical,
  Lightbulb,
  BookOpen,
  Quote,
} from "lucide-react";

type Persona = {
  id: string;
  icon: React.ReactNode;
  signalCount: number;
  channelCount: number;
  tone: "gold" | "terracotta" | "forest";
};

const PERSONAS: Persona[] = [
  {
    id: "morning-regular",
    icon: <Coffee size={18} className="text-ursa-gold-text" />,
    signalCount: 3,
    channelCount: 3,
    tone: "gold",
  },
  {
    id: "tourist-explorer",
    icon: <Compass size={18} className="text-ursa-terracotta-text" />,
    signalCount: 3,
    channelCount: 4,
    tone: "terracotta",
  },
  {
    id: "remote-worker",
    icon: <Users size={18} className="text-ursa-forest-deep" />,
    signalCount: 3,
    channelCount: 3,
    tone: "forest",
  },
  {
    id: "coffee-curious",
    icon: <Sparkles size={18} className="text-ursa-gold-text" />,
    signalCount: 3,
    channelCount: 4,
    tone: "gold",
  },
];

type Pillar = {
  id: string;
  tone: "gold" | "forest" | "terracotta";
};

const MESSAGE_PILLARS: Pillar[] = [
  { id: "visible-craft", tone: "gold" },
  { id: "ownable-atmosphere", tone: "forest" },
  { id: "honest-origin", tone: "forest" },
  { id: "patient-continuity", tone: "gold" },
];

const OFFER_STACK = [
  {
    id: "continuity",
    labelKey: "content.growth.offer.layer.continuity.label",
    itemKey: "content.growth.offer.layer.continuity.item",
    noteKey: "content.growth.offer.layer.continuity.note",
    value: "S/. 20/mo (optional)",
    tone: "forest" as const,
  },
  {
    id: "story",
    labelKey: "content.growth.offer.layer.story.label",
    itemKey: "content.growth.offer.layer.story.item",
    noteKey: "content.growth.offer.layer.story.note",
    value: "Included",
    tone: "gold" as const,
  },
  {
    id: "sample",
    labelKey: "content.growth.offer.layer.sample.label",
    itemKey: "content.growth.offer.layer.sample.item",
    noteKey: "content.growth.offer.layer.sample.note",
    value: "S/. 10",
    tone: "gold" as const,
  },
  {
    id: "side",
    labelKey: "content.growth.offer.layer.side.label",
    itemKey: "content.growth.offer.layer.side.item",
    noteKey: "content.growth.offer.layer.side.note",
    value: "S/. 6–9",
    tone: "terracotta" as const,
  },
  {
    id: "core",
    labelKey: "content.growth.offer.layer.core.label",
    itemKey: "content.growth.offer.layer.core.item",
    noteKey: "content.growth.offer.layer.core.note",
    value: "S/. 12–18",
    tone: "gold" as const,
  },
];

const JOURNEY = [
  {
    id: "discover",
    icon: <Compass size={16} />,
    nameKey: "content.growth.journey.stage.discover.name",
    channelKey: "content.growth.journey.stage.discover.channel",
    tacticKey: "content.growth.journey.stage.discover.tactic",
  },
  {
    id: "consider",
    icon: <Star size={16} />,
    nameKey: "content.growth.journey.stage.consider.name",
    channelKey: "content.growth.journey.stage.consider.channel",
    tacticKey: "content.growth.journey.stage.consider.tactic",
  },
  {
    id: "first-visit",
    icon: <Coffee size={16} />,
    nameKey: "content.growth.journey.stage.first-visit.name",
    channelKey: "content.growth.journey.stage.first-visit.channel",
    tacticKey: "content.growth.journey.stage.first-visit.tactic",
  },
  {
    id: "repeat",
    icon: <Repeat size={16} />,
    nameKey: "content.growth.journey.stage.repeat.name",
    channelKey: "content.growth.journey.stage.repeat.channel",
    tacticKey: "content.growth.journey.stage.repeat.tactic",
  },
  {
    id: "advocate",
    icon: <Megaphone size={16} />,
    nameKey: "content.growth.journey.stage.advocate.name",
    channelKey: "content.growth.journey.stage.advocate.channel",
    tacticKey: "content.growth.journey.stage.advocate.tactic",
  },
];

const CHANNELS = [
  { id: "acquisition", stageId: "discover", icon: <Megaphone size={14} /> },
  { id: "local-discovery", stageId: "discover", icon: <Footprints size={14} /> },
  { id: "google-maps", stageId: "discover", icon: <MapPin size={14} /> },
  { id: "organic-social", stageId: "discover", icon: <Camera size={14} /> },
  { id: "paid-social", stageId: "discover", icon: <Megaphone size={14} /> },
  { id: "tourism", stageId: "discover", icon: <Compass size={14} /> },
  { id: "creator-strategy", stageId: "engage", icon: <Star size={14} /> },
  { id: "delivery", stageId: "engage", icon: <Truck size={14} /> },
  { id: "events", stageId: "engage", icon: <Calendar size={14} /> },
  { id: "partnerships", stageId: "engage", icon: <Handshake size={14} /> },
  { id: "hotels", stageId: "engage", icon: <Hotel size={14} /> },
  { id: "offices", stageId: "engage", icon: <Briefcase size={14} /> },
  { id: "community", stageId: "retain", icon: <Heart size={14} /> },
  { id: "loyalty", stageId: "retain", icon: <Star size={14} /> },
  { id: "email-whatsapp", stageId: "retain", icon: <Mail size={14} /> },
  { id: "service-recovery", stageId: "retain", icon: <RefreshCw size={14} /> },
  { id: "retail-beans", stageId: "retain", icon: <Package size={14} /> },
  { id: "referral", stageId: "advocate", icon: <Gift size={14} /> },
  { id: "reviews", stageId: "advocate", icon: <MessageSquare size={14} /> },
  { id: "wholesale", stageId: "advocate", icon: <Store size={14} /> },
];

const FUNNEL_STAGES = [
  { id: "discover", tone: "var(--color-ursa-gold-text)", nameKey: "content.growth.channels.funnel.discover.name", descKey: "content.growth.channels.funnel.discover.desc" },
  { id: "engage", tone: "var(--color-ursa-forest)", nameKey: "content.growth.channels.funnel.engage.name", descKey: "content.growth.channels.funnel.engage.desc" },
  { id: "retain", tone: "var(--color-ursa-forest-deep)", nameKey: "content.growth.channels.funnel.retain.name", descKey: "content.growth.channels.funnel.retain.desc" },
  { id: "advocate", tone: "var(--color-ursa-terracotta-text)", nameKey: "content.growth.channels.funnel.advocate.name", descKey: "content.growth.channels.funnel.advocate.desc" },
] as const;

// Objection-handling rows (CONVERSION-3) — the top five objections Ursa will
// hear at the bar, mapped to the research-backed response, the framework
// cited, and the influence principle the response activates. Each row pulls
// all four fields from i18n so EN/ES render correctly. Tone alternates so
// the table reads as a rhythm rather than a wall of text.
const OBJECTIONS = [
  { id: 1, tone: "terracotta" as const },
  { id: 2, tone: "forest" as const },
  { id: 3, tone: "gold" as const },
  { id: 4, tone: "forest" as const },
  { id: 5, tone: "terracotta" as const },
];

export function GrowthView() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [expandedPersona, setExpandedPersona] = useState<number | null>(0);

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.growth.eyebrow")}
        title={<>{t("content.view.growth.title")}</>}
        lede={<>{t("content.growth.hero.lede")}</>}
        meta={[
          { label: t("content.growth.hero.meta.frameworks"), value: t("content.growth.hero.meta.frameworks-value") },
          { label: t("content.growth.hero.meta.budget"), value: t("content.growth.hero.meta.budget-value") },
          { label: t("content.growth.hero.meta.spirit"), value: t("content.growth.hero.meta.spirit-value") },
        ]}
      />

      <ViewSection>
        <DossierLinkBanner moduleId="04-marketing-growth-and-retention-plan" />
      </ViewSection>

      {/* Positioning statement */}
      <ViewSection badge={t("content.growth.positioning.badge")} title={t("content.growth.positioning.title")} meta={t("content.growth.positioning.meta")}>
        <Card highlight className="bg-gradient-to-br from-ursa-paper to-ursa-cream">
          <div className="flex items-start gap-4">
            <BearMark size={40} className="text-ursa-dark-roast shrink-0" />
            <div>
              <p className="font-display text-[1.15rem] md:text-[1.35rem] leading-[1.55] text-ursa-dark-roast m-0">
                {t("content.growth.positioning.paragraph")}
              </p>
              <p className="font-label text-[0.72rem] tracking-[0.16em] uppercase text-muted-foreground mt-4 mb-0">
                {t("content.growth.positioning.caption")}
              </p>
            </div>
          </div>
        </Card>
        <Callout tone="forest" title={t("content.growth.positioning.callout.title")}>
          {t("content.growth.positioning.callout.body")}
        </Callout>

        {/* Evidence / Risk / Test triple — grounds the positioning in the census */}
        <Grid cols={3}>
          <Card className="bg-ursa-foam">
            <div className="flex items-center gap-2 mb-2">
              <EvidenceTag status="partial" />
              <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">{t("content.growth.positioning.card.evidence.heading")}</span>
            </div>
            <ul className="space-y-2 text-[0.84rem] text-foreground/85 m-0 p-0 list-none">
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.positioning.card.evidence.1")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.positioning.card.evidence.2")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.positioning.card.evidence.3")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.positioning.card.evidence.4")}</span></li>
            </ul>
          </Card>
          <Card className="bg-ursa-cream">
            <div className="flex items-center gap-2 mb-2">
              <EvidenceTag status="gap" />
              <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">{t("content.growth.positioning.card.risks.heading")}</span>
            </div>
            <ul className="space-y-2 text-[0.84rem] text-foreground/85 m-0 p-0 list-none">
              <li className="flex gap-2"><span className="text-ursa-terracotta-text mt-1 shrink-0">›</span> <span>{t("content.growth.positioning.card.risks.1")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-terracotta-text mt-1 shrink-0">›</span> <span>{t("content.growth.positioning.card.risks.2")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-terracotta-text mt-1 shrink-0">›</span> <span>{t("content.growth.positioning.card.risks.3")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-terracotta-text mt-1 shrink-0">›</span> <span>{t("content.growth.positioning.card.risks.4")}</span></li>
            </ul>
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical size={14} className="text-ursa-forest-deep" />
              <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">{t("content.growth.positioning.card.test.heading")}</span>
            </div>
            <ul className="space-y-2 text-[0.84rem] text-foreground/85 m-0 p-0 list-none">
              <li className="flex gap-2"><span className="text-ursa-forest-deep mt-1 shrink-0">›</span> <span>{t("content.growth.positioning.card.test.1")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-forest-deep mt-1 shrink-0">›</span> <span>{t("content.growth.positioning.card.test.2")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-forest-deep mt-1 shrink-0">›</span> <span>{t("content.growth.positioning.card.test.3")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-forest-deep mt-1 shrink-0">›</span> <span>{t("content.growth.positioning.card.test.4")}</span></li>
            </ul>
          </Card>
        </Grid>
      </ViewSection>

      {/* Personas & JTBD — interactive expandable cards */}
      <ViewSection badge={t("content.growth.audience.badge")} title={t("content.growth.audience.title")} meta={t("content.growth.audience.meta")}>
        <Grid cols={2}>
          {PERSONAS.map((p, idx) => {
            const expanded = expandedPersona === idx;
            const accent = p.tone === "gold" ? "var(--color-ursa-gold-text)" : p.tone === "terracotta" ? "var(--color-ursa-terracotta-text)" : "var(--color-ursa-forest-deep)";
            const personaKey = (field: string) => `content.growth.audience.persona.${p.id}.${field}`;
            const signals = Array.from({ length: p.signalCount }, (_, i) => t(personaKey(`signal.${i + 1}`)));
            const channels = Array.from({ length: p.channelCount }, (_, i) => t(personaKey(`channel.${i + 1}`)));
            return (
              <Card
                key={p.id}
                className="flex flex-col gap-3 cursor-pointer border-t-2 overflow-hidden"
                >
                <span className="block h-1 -mx-6 -mt-6 mb-1" style={{ background: accent }} />
                <button
                  onClick={() => setExpandedPersona(expanded ? null : idx)}
                  aria-expanded={expanded}
                  className="text-left flex gap-4 items-start"
                >
                  <div className="shrink-0">
                    <div className="w-11 h-11 rounded-full grid place-items-center border" style={{ background: `${accent}15`, borderColor: `${accent}40` }}>
                      {p.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-1">{t(personaKey("name"))}</h3>
                      <ChevronDown size={18} className={cn("text-muted-foreground transition-transform shrink-0", expanded && "rotate-180")} />
                    </div>
                    <p className="text-[0.9rem] italic text-ursa-medium-roast leading-relaxed mb-2 m-0">
                      &ldquo;{t(personaKey("jtb"))}&rdquo;
                    </p>
                  </div>
                </button>
                {/* Always-visible signals */}
                <div className="flex flex-wrap gap-1.5 pl-[60px]">
                  {signals.map((s) => (
                    <span key={s} className="font-label text-[0.6rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full border text-muted-foreground bg-ursa-foam" style={{ borderColor: `${accent}30` }}>
                      {s}
                    </span>
                  ))}
                </div>
                {/* Expandable detail */}
                {expanded && (
                  <div className="pl-[60px] space-y-3 ursa-fade-up border-t border-ursa-line-soft pt-3 mt-1">
                    <div>
                      <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase block mb-1" style={{ color: accent }}>{t("content.growth.audience.detail.proof")}</span>
                      <p className="text-[0.84rem] text-muted-foreground m-0">{t(personaKey("proof"))}</p>
                    </div>
                    <div>
                      <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase block mb-1" style={{ color: accent }}>{t("content.growth.audience.detail.channels")}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {channels.map((ch) => (
                          <span key={ch} className="font-label text-[0.62rem] tracking-[0.06em] px-2 py-0.5 rounded border" style={{ borderColor: `${accent}30`, color: "var(--color-ursa-dark-roast)", background: `${accent}08` }}>
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-lg p-2.5 border" style={{ borderColor: `${accent}25`, background: `${accent}06` }}>
                        <span className="font-label text-[0.56rem] tracking-[0.14em] uppercase block mb-0.5" style={{ color: accent }}>{t("content.growth.audience.detail.offer-for")}</span>
                        <p className="text-[0.8rem] text-ursa-dark-roast m-0 leading-snug">{t(personaKey("offer"))}</p>
                      </div>
                      <div className="rounded-lg p-2.5 border border-ursa-line-soft bg-ursa-foam">
                        <span className="font-label text-[0.56rem] tracking-[0.14em] uppercase block mb-0.5 text-muted-foreground">{t("content.growth.audience.detail.success-metric")}</span>
                        <p className="text-[0.8rem] text-ursa-dark-roast m-0 leading-snug font-medium">{t(personaKey("metric"))}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </Grid>

        {/* Census-grounding evidence for each persona — verifies signals are not invented */}
        <Callout tone="forest" title={t("content.growth.audience.callout.title")}>
          <div className="space-y-2.5 text-[0.86rem] m-0">
            <p className="m-0">{t("content.growth.audience.callout.morning")}</p>
            <p className="m-0">{t("content.growth.audience.callout.tourist")}</p>
            <p className="m-0">{t("content.growth.audience.callout.remote")}</p>
            <p className="m-0">{t("content.growth.audience.callout.coffee")}</p>
          </div>
        </Callout>

        {/* Test method for persona validation */}
        <Grid cols={2}>
          <Card className="bg-ursa-cream">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical size={14} className="text-ursa-forest-deep" />
              <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">{t("content.growth.audience.card.validate.heading")}</span>
            </div>
            <ul className="space-y-1.5 text-[0.84rem] text-foreground/85 m-0 p-0 list-none">
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.audience.card.validate.1")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.audience.card.validate.2")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.audience.card.validate.3")}</span></li>
            </ul>
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <EvidenceTag status="partial" />
              <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">{t("content.growth.audience.card.missing.heading")}</span>
            </div>
            <ul className="space-y-1.5 text-[0.84rem] text-foreground/85 m-0 p-0 list-none">
              <li className="flex gap-2"><span className="text-ursa-terracotta-text mt-1 shrink-0">›</span> <span>{t("content.growth.audience.card.missing.1")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-terracotta-text mt-1 shrink-0">›</span> <span>{t("content.growth.audience.card.missing.2")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-terracotta-text mt-1 shrink-0">›</span> <span>{t("content.growth.audience.card.missing.3")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-terracotta-text mt-1 shrink-0">›</span> <span>{t("content.growth.audience.card.missing.4")}</span></li>
            </ul>
          </Card>
        </Grid>
      </ViewSection>
      <ViewSection badge={t("content.growth.message.badge")} title={t("content.growth.message.title")} meta={t("content.growth.message.meta")}>
        <Card className="bg-ursa-foam">
          {/* Root: brand promise */}
          <div className="flex flex-col items-center text-center mb-2">
            <SectionBadge tone="gold">{t("content.growth.message.brand-promise.badge")}</SectionBadge>
            <p className="font-display text-xl md:text-2xl font-semibold text-ursa-dark-roast mt-2 mb-0 max-w-[42ch]">
              {t("content.growth.message.brand-promise.text")}
            </p>
          </div>

          <div className="flex items-center justify-center my-3 text-ursa-gold-text">
            <span className="h-px w-12 bg-ursa-line" />
            <ArrowDown size={14} className="mx-1" />
            <span className="h-px w-12 bg-ursa-line" />
          </div>

          {/* Pillars grid */}
          <Grid cols={2}>
            {MESSAGE_PILLARS.map((pillar) => {
              const pillarKey = (field: string) => `content.growth.message.pillar.${pillar.id}.${field}`;
              const proofs = [1, 2, 3].map((n) => t(pillarKey(`proof.${n}`)));
              return (
              <div
                key={pillar.id}
                className="rounded-lg border border-ursa-line-soft bg-card p-5 shadow-[0_1px_0_rgba(59,36,23,0.06),0_8px_24px_-16px_rgba(59,36,23,0.18)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Pill tone={pillar.tone}>{t(pillarKey("title"))}</Pill>
                </div>
                <p className="font-display text-[1.05rem] text-ursa-dark-roast font-medium leading-snug mb-3">
                  {t(pillarKey("promise"))}
                </p>
                <div className="flex items-center gap-1 text-ursa-gold-text mb-2">
                  <ArrowDown size={12} />
                  <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase">{t("content.growth.message.pillars.label")}</span>
                </div>
                <ul className="space-y-1.5 m-0 p-0 list-none">
                  {proofs.map((proof) => (
                    <li key={proof} className="flex items-start gap-2 text-[0.85rem] text-foreground/85">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ursa-forest shrink-0" />
                      <span>{proof}</span>
                    </li>
                  ))}
                </ul>
                {/* Evidence + risk note under each pillar */}
                <div className="mt-3 pt-3 border-t border-ursa-line-soft space-y-2">
                  <div className="flex items-start gap-2">
                    <EvidenceTag status="partial" />
                    <p className="text-[0.78rem] text-muted-foreground leading-relaxed m-0 flex-1">
                      <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-ursa-forest-deep block mb-0.5">{t("content.growth.message.label.evidence")}</span>
                      {t(pillarKey("evidence"))}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase px-1.5 py-0.5 rounded border bg-ursa-terracotta/15 text-ursa-terracotta-text border-ursa-terracotta/40 shrink-0 mt-0.5">{t("content.growth.message.label.risk")}</span>
                    <p className="text-[0.78rem] text-muted-foreground leading-relaxed m-0 flex-1">
                      {t(pillarKey("risk"))}
                    </p>
                  </div>
                </div>
              </div>
              );
            })}
          </Grid>
        </Card>
        <Callout tone="warn" title={t("content.growth.message.callout.title")}>
          {t("content.growth.message.callout.body")}
        </Callout>
      </ViewSection>

      {/* Hormozi adaptation */}
      <ViewSection badge={t("content.growth.hormozi.badge")} title={t("content.growth.hormozi.title")} meta={t("content.growth.hormozi.meta")}>
        <Callout tone="warn" title={t("content.growth.hormozi.callout.title")}>
          <p className="m-0 text-[0.88rem]">
            {t("content.growth.hormozi.callout.body")}
          </p>
        </Callout>
        <Grid cols={2}>
          {HORMOZI_PRINCIPLES.map((h, i) => {
            const n = i + 1;
            const hormoziKey = (field: string) => `content.growth.hormozi.principle.${n}.${field}`;
            return (
            <Card key={h.principle} className="flex flex-col">
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0">{t(hormoziKey("name"))}</h3>
                <EvidenceTag status="partial" />
              </div>
              <p className="text-[0.9rem] leading-relaxed text-foreground/85 mb-3">{t(hormoziKey("adapted"))}</p>
              <div className="mt-auto border-t border-ursa-line-soft pt-3">
                <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-ursa-terracotta-text flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-ursa-terracotta" /> {t("content.growth.hormozi.label.do-not")}
                </span>
                <p className="text-[0.82rem] text-muted-foreground mt-1 m-0">{t(hormoziKey("caveat"))}</p>
              </div>
            </Card>
            );
          })}
        </Grid>
      </ViewSection>

      {/* Sutherland adaptation */}
      <ViewSection badge={t("content.growth.sutherland.badge")} title={t("content.growth.sutherland.title")} meta={t("content.growth.sutherland.meta")}>
        <Callout tone="gold" title={t("content.growth.sutherland.callout.title")}>
          <p className="m-0 text-[0.88rem]">
            {t("content.growth.sutherland.callout.body")}
          </p>
        </Callout>
        <Grid cols={3}>
          {SUTHERLAND_PRINCIPLES.map((s, i) => {
            const n = i + 1;
            const sutherlandKey = (field: string) => `content.growth.sutherland.principle.${n}.${field}`;
            const caveat = t(sutherlandKey("caveat"));
            return (
            <Card key={s.principle}>
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 leading-snug">
                  {t(sutherlandKey("name"))}
                </h3>
                <EvidenceTag status="partial" />
              </div>
              <p className="text-[0.85rem] leading-relaxed text-foreground/85 m-0">{t(sutherlandKey("adapted"))}</p>
              {caveat && caveat !== sutherlandKey("caveat") && (
                <p className="mt-3 pt-3 border-t border-ursa-line-soft font-label text-[0.62rem] tracking-[0.12em] uppercase text-ursa-gold-text m-0">
                  {caveat}
                </p>
              )}
            </Card>
            );
          })}
        </Grid>
        <Callout tone="gold" title={t("content.growth.sutherland.callout2.title")}>
          {t("content.growth.sutherland.callout2.body")}
        </Callout>
      </ViewSection>

      {/* Customer objections & responses (CONVERSION-3) -----------------------
          Five objections mapped to a research-backed response, framework, and
          influence principle. Cites Rackham (1988) SPIN, Dixon & Adamson
          (2011) Challenger Sale, and Cialdini (2007) Influence. */}
      <ViewSection badge={t("content.growth.objections.badge")} title={t("content.growth.objections.title")} meta={t("content.growth.objections.meta")}>
        <p className="text-[0.92rem] text-muted-foreground max-w-[78ch] mb-6 m-0">
          {t("content.growth.objections.lede")}
        </p>

        {/* Objection/response rows */}
        <div className="space-y-3 mb-6">
          {OBJECTIONS.map((o) => {
            const accent = o.tone === "gold" ? "var(--color-ursa-gold-text)" : o.tone === "terracotta" ? "var(--color-ursa-terracotta-text)" : "var(--color-ursa-forest-deep)";
            const k = (field: string) => `content.growth.objections.item.${o.id}.${field}`;
            return (
              <Card key={o.id} className="overflow-hidden p-0">
                <div className="grid md:grid-cols-[1fr_1.4fr] gap-0">
                  {/* Left column: the objection */}
                  <div className="p-5 border-b md:border-b-0 md:border-r border-ursa-line-soft" style={{ background: `${accent}08` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-md grid place-items-center shrink-0" style={{ background: `${accent}18`, color: accent }}>
                        <Quote size={14} />
                      </span>
                      <span className="font-label text-[0.58rem] tracking-[0.14em] uppercase" style={{ color: accent }}>
                        {t("content.growth.objections.label.objection")} {o.id}
                      </span>
                    </div>
                    <p className="font-display text-[1rem] font-semibold text-ursa-dark-roast mt-0 mb-0 leading-snug">
                      {t(k("objection"))}
                    </p>
                    {/* Framework + principle tags under the objection */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="font-label text-[0.56rem] tracking-[0.12em] uppercase px-1.5 py-0.5 rounded border bg-card text-ursa-forest-deep border-ursa-forest-deep/30 flex items-center gap-1">
                        <BookOpen size={10} /> {t(k("framework"))}
                      </span>
                    </div>
                  </div>
                  {/* Right column: the response + principle */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-md grid place-items-center shrink-0 bg-ursa-gold/15 text-ursa-gold-text">
                        <Lightbulb size={14} />
                      </span>
                      <span className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-ursa-gold-text">
                        {t("content.growth.objections.label.response")}
                      </span>
                    </div>
                    <p className="text-[0.9rem] text-foreground/85 leading-relaxed m-0 mb-3">
                      {t(k("response"))}
                    </p>
                    <div className="flex items-center gap-1.5 pt-3 border-t border-ursa-line-soft">
                      <Sparkles size={12} className="text-ursa-terracotta-text shrink-0" />
                      <span className="font-label text-[0.56rem] tracking-[0.12em] uppercase text-muted-foreground">
                        {t("content.growth.objections.label.principle")}:
                      </span>
                      <span className="font-label text-[0.6rem] tracking-[0.06em] text-ursa-dark-roast font-medium">
                        {t(k("principle"))}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Framework explainer — the three research traditions behind the responses */}
        <Card className="bg-ursa-foam mb-6">
          <div className="flex items-start gap-3">
            <span className="w-9 h-9 rounded-md grid place-items-center bg-ursa-forest-deep/12 text-ursa-forest-deep shrink-0">
              <BookOpen size={18} />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2">{t("content.growth.objections.science.title")}</h3>
              <p className="text-[0.88rem] text-foreground/85 leading-relaxed m-0">{t("content.growth.objections.science.body")}</p>
            </div>
          </div>
        </Card>

        <Callout tone="forest" title={t("content.growth.objections.callout.title")}>
          <p className="m-0 text-[0.88rem]">{t("content.growth.objections.callout.body")}</p>
        </Callout>
      </ViewSection>

      {/* Offer architecture stack */}
      <ViewSection badge={t("content.growth.offer.badge")} title={t("content.growth.offer.title")} meta={t("content.growth.offer.meta")}>
        {/* Offer-value lens — eight questions answered */}
        <Card highlight className="bg-gradient-to-br from-ursa-paper to-ursa-cream mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <span className="font-label text-[0.62rem] tracking-[0.16em] uppercase text-ursa-gold-text">{t("content.growth.offer.lens.badge")}</span>
            <EvidenceTag status="verified" />
          </div>
          <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-1">{t("content.growth.offer.lens.heading")}</h3>
          <p className="text-[0.84rem] text-muted-foreground m-0 mb-4">{t("content.growth.offer.lens.subtitle")}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {(["outcome", "likelihood", "delay", "effort", "proof", "risk-reversal", "packaging", "friction"] as const).map((row) => (
              <div key={row} className="rounded-lg border border-ursa-line-soft bg-card p-3.5">
                <div className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-ursa-forest-deep mb-1">{t(`content.growth.offer.lens.row.${row}.label`)}</div>
                <p className="text-[0.82rem] text-foreground/85 leading-relaxed m-0">{t(`content.growth.offer.lens.row.${row}.body`)}</p>
              </div>
            ))}
          </div>
          <p className="text-[0.78rem] text-muted-foreground mt-4 m-0 italic leading-relaxed">
            {t("content.growth.offer.lens.footnote")}
          </p>
        </Card>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 items-start">
          <Card className="bg-ursa-foam">
            <div className="flex items-center gap-2 mb-4">
              <Layers size={18} className="text-ursa-gold-text" />
              <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0">{t("content.growth.offer.stack.heading")}</h3>
            </div>
            <div className="relative pl-6">
              {/* Vertical connecting line */}
              <span className="absolute left-[10px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-ursa-gold via-ursa-gold/50 to-ursa-dark-roast/30 rounded-full" aria-hidden="true" />
              <div className="space-y-2">
                {[...OFFER_STACK].reverse().map((layer, i) => {
                  const accent = layer.tone === "forest" ? "var(--color-ursa-forest-deep)" : layer.tone === "terracotta" ? "var(--color-ursa-terracotta-text)" : "var(--color-ursa-gold-text)";
                  return (
                    <div
                      key={layer.id}
                      className="relative rounded-lg border bg-card p-4 shadow-[0_1px_0_rgba(59,36,23,0.06),0_8px_24px_-16px_rgba(59,36,23,0.18)] transition hover:shadow-md hover:-translate-y-0.5"
                      style={{
                        marginLeft: `${i * 10}px`,
                        borderColor: accent,
                        borderWidth: "1px",
                      }}
                    >
                      {/* Node dot on the connecting line */}
                      <span
                        className="absolute -left-[19px] top-5 w-3 h-3 rounded-full border-2 border-card shadow-sm"
                        style={{ background: accent }}
                        aria-hidden="true"
                      />
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-label text-[0.6rem] tracking-[0.16em] uppercase text-muted-foreground">
                            {t(layer.labelKey)}
                          </span>
                          <p className="font-display text-[1rem] font-semibold text-ursa-dark-roast mt-0.5 mb-1 m-0">{t(layer.itemKey)}</p>
                          <p className="text-[0.82rem] text-muted-foreground m-0">{t(layer.noteKey)}</p>
                        </div>
                        <span
                          className="font-display text-sm font-semibold whitespace-nowrap"
                          style={{ color: accent }}
                        >
                          {layer.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-[0.78rem] text-muted-foreground mt-4 mb-0 italic">
              {t("content.growth.offer.stack.italic-note")}
            </p>
          </Card>

          <div className="space-y-4">
            <Card>
              <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
                <CupGlyph size={18} className="text-ursa-gold-text" /> {t("content.growth.offer.card.why.heading")}
              </h4>
              <ul className="space-y-2 m-0 p-0 list-none text-[0.88rem] text-foreground/85">
                <li className="flex gap-2"><span className="text-ursa-gold-text mt-1">›</span> {t("content.growth.offer.card.why.1")}</li>
                <li className="flex gap-2"><span className="text-ursa-gold-text mt-1">›</span> {t("content.growth.offer.card.why.2")}</li>
                <li className="flex gap-2"><span className="text-ursa-gold-text mt-1">›</span> {t("content.growth.offer.card.why.3")}</li>
                <li className="flex gap-2"><span className="text-ursa-gold-text mt-1">›</span> {t("content.growth.offer.card.why.4")}</li>
              </ul>
            </Card>
            <Card className="bg-ursa-cream">
              <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
                <FlaskConical size={16} className="text-ursa-forest-deep" /> {t("content.growth.offer.card.feasibility.heading")}
              </h4>
              <div className="space-y-3 m-0">
                <div className="grid grid-cols-[7rem_1fr] gap-x-3 gap-y-1 text-[0.84rem]">
                  <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground pt-0.5">{t("content.growth.offer.card.feasibility.continuity.label")}</span>
                  <p className="text-foreground/85 m-0">{t("content.growth.offer.card.feasibility.continuity.body")}</p>

                  <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground pt-0.5">{t("content.growth.offer.card.feasibility.story-card.label")}</span>
                  <p className="text-foreground/85 m-0">{t("content.growth.offer.card.feasibility.story-card.body")}</p>

                  <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground pt-0.5">{t("content.growth.offer.card.feasibility.sample.label")}</span>
                  <p className="text-foreground/85 m-0">{t("content.growth.offer.card.feasibility.sample.body")}</p>

                  <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground pt-0.5">{t("content.growth.offer.card.feasibility.side.label")}</span>
                  <p className="text-foreground/85 m-0">{t("content.growth.offer.card.feasibility.side.body")}</p>

                  <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground pt-0.5">{t("content.growth.offer.card.feasibility.core.label")}</span>
                  <p className="text-foreground/85 m-0">{t("content.growth.offer.card.feasibility.core.body")}</p>
                </div>
              </div>
            </Card>
            <Card className="bg-ursa-cream">
              <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2">{t("content.growth.offer.card.worked-example.heading")}</h4>
              <p className="text-[0.88rem] text-muted-foreground m-0 mb-3">
                {t("content.growth.offer.card.worked-example.body")}
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="font-display text-lg font-semibold text-ursa-dark-roast m-0">S/. 27</p>
                  <p className="font-label text-[0.58rem] tracking-[0.1em] uppercase text-muted-foreground m-0">{t("content.growth.offer.card.worked-example-ticket")}</p>
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-ursa-forest-deep m-0">3</p>
                  <p className="font-label text-[0.58rem] tracking-[0.1em] uppercase text-muted-foreground m-0">{t("content.growth.offer.card.worked-example.touchpoints")}</p>
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-ursa-gold-text m-0">1</p>
                  <p className="font-label text-[0.58rem] tracking-[0.1em] uppercase text-muted-foreground m-0">{t("content.growth.offer.card.worked-example-referral")}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Behavioral lens — Sutherland perceived-value levers on the same stack */}
        <Callout tone="gold" title={t("content.growth.offer.behavioral.heading")}>
          <p className="m-0 text-[0.88rem]">
            <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-ursa-gold-text block mb-1.5">{t("content.growth.offer.behavioral.badge")}</span>
            {t("content.growth.offer.behavioral.body")}
          </p>
        </Callout>
      </ViewSection>

      {/* Customer journey timeline */}
      <ViewSection badge={t("content.growth.journey.badge")} title={t("content.growth.journey.title")} meta={t("content.growth.journey.meta")}>
        <div className="overflow-x-auto ursa-scroll pb-2">
          <div className="flex items-stretch gap-0 min-w-[760px]">
            {JOURNEY.map((j, i) => (
              <div key={j.id} className="flex items-stretch flex-1">
                <div className="flex-1 rounded-lg border border-ursa-line-soft bg-card p-4 shadow-[0_1px_0_rgba(59,36,23,0.06),0_8px_24px_-16px_rgba(59,36,23,0.18)] flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-full bg-ursa-cream border border-ursa-gold/40 flex items-center justify-center text-ursa-gold-text">
                      {j.icon}
                    </span>
                    <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">
                      {t("content.growth.journey.label.stage")} {i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2">{t(j.nameKey)}</h3>
                  <p className="font-label text-[0.62rem] tracking-[0.1em] uppercase text-ursa-gold-text mb-1 m-0">{t("content.growth.journey.label.channel")}</p>
                  <p className="text-[0.82rem] text-foreground/85 mb-3 m-0">{t(j.channelKey)}</p>
                  <p className="font-label text-[0.62rem] tracking-[0.1em] uppercase text-ursa-forest-deep mb-1 m-0 mt-auto">{t("content.growth.journey.label.tactic")}</p>
                  <p className="text-[0.82rem] text-muted-foreground m-0">{t(j.tacticKey)}</p>
                </div>
                {i < JOURNEY.length - 1 && (
                  <div className="flex items-center justify-center w-8 text-ursa-gold-text">
                    <ArrowRight size={18} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <Callout tone="forest" title={t("content.growth.journey.callout.title")}>
          {t("content.growth.journey.callout.body")}
        </Callout>
      </ViewSection>

      {/* Channel coverage grid — grouped by funnel stage */}
      <ViewSection badge={t("content.growth.channels.badge")} title={t("content.growth.channels.title")} meta={t("content.growth.channels.meta")}>
        {/* Funnel stage legend */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {FUNNEL_STAGES.map((stage, i) => {
            const count = CHANNELS.filter((c) => c.stageId === stage.id).length;
            return (
              <div key={stage.id} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ background: stage.tone }} />
                <span className="font-label text-[0.66rem] tracking-[0.12em] uppercase text-ursa-dark-roast">{t(stage.nameKey)}</span>
                <span className="font-label text-[0.6rem] text-muted-foreground">({count})</span>
                {i < FUNNEL_STAGES.length - 1 && <span className="text-muted-foreground/40 mx-1">→</span>}
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          {FUNNEL_STAGES.map((stage) => {
            const stageChannels = CHANNELS.filter((c) => c.stageId === stage.id);
            return (
              <div key={stage.id}>
                <div className="flex items-baseline gap-3 mb-3">
                  <h3 className="font-display text-lg font-semibold m-0" style={{ color: stage.tone }}>{t(stage.nameKey)}</h3>
                  <span className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">{t(stage.descKey)}</span>
                </div>
                <Grid cols={4}>
                  {stageChannels.map((c) => (
                    <Card key={c.id} className="p-4 border-t-2" >
                      <span className="block h-0.5 -mx-4 -mt-4 mb-3" style={{ background: stage.tone }} />
                      <div className="flex items-center gap-2 mb-2" style={{ color: stage.tone }}>
                        {c.icon}
                        <h4 className="font-display text-[0.95rem] font-semibold text-ursa-dark-roast m-0">{t(`content.growth.channels.channel.${c.id}.name`)}</h4>
                      </div>
                      <p className="text-[0.8rem] leading-snug text-muted-foreground m-0">{t(`content.growth.channels.channel.${c.id}.tactic`)}</p>
                    </Card>
                  ))}
                </Grid>
              </div>
            );
          })}
        </div>

        {/* Census evidence: which channels competitors use successfully */}
        <Grid cols={3}>
          <Card className="bg-ursa-foam">
            <div className="flex items-center gap-2 mb-2">
              <EvidenceTag status="partial" />
              <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">{t("content.growth.channels.card.discover.heading")}</span>
            </div>
            <ul className="space-y-2 text-[0.84rem] text-foreground/85 m-0 p-0 list-none">
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.channels.card.discover.1")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.channels.card.discover.2")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.channels.card.discover.3")}</span></li>
            </ul>
          </Card>
          <Card className="bg-ursa-cream">
            <div className="flex items-center gap-2 mb-2">
              <EvidenceTag status="partial" />
              <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">{t("content.growth.channels.card.engage.heading")}</span>
            </div>
            <ul className="space-y-2 text-[0.84rem] text-foreground/85 m-0 p-0 list-none">
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.channels.card.engage.1")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.channels.card.engage.2")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.channels.card.engage.3")}</span></li>
            </ul>
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <EvidenceTag status="partial" />
              <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">{t("content.growth.channels.card.retain-advocate.heading")}</span>
            </div>
            <ul className="space-y-2 text-[0.84rem] text-foreground/85 m-0 p-0 list-none">
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.channels.card.retain-advocate.1")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.channels.card.retain-advocate.2")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-gold-text mt-1 shrink-0">›</span> <span>{t("content.growth.channels.card.retain-advocate.3")}</span></li>
            </ul>
          </Card>
        </Grid>

        <Callout tone="warn" title={t("content.growth.channels.callout.risks.title")}>
          <ul className="space-y-1.5 m-0 p-0 list-none text-[0.86rem]">
            <li>• {t("content.growth.channels.callout.risks.1")}</li>
            <li>• {t("content.growth.channels.callout.risks.2")}</li>
            <li>• {t("content.growth.channels.callout.risks.3")}</li>
            <li>• {t("content.growth.channels.callout.risks.4")}</li>
          </ul>
        </Callout>

        <Callout tone="forest" title={t("content.growth.channels.callout.test.title")}>
          <p className="m-0 text-[0.86rem]">
            {t("content.growth.channels.callout.test.body")}
          </p>
        </Callout>
      </ViewSection>
      <ViewSection badge={t("content.growth.budget.badge")} title={t("content.growth.budget.title")} meta={t("content.growth.budget.meta")}>
        <Grid cols={3}>
          {BUDGET_SCENARIOS.map((s, i) => {
            const scenarioId = i === 0 ? "lean" : i === 1 ? "moderate" : "growth";
            return (
              <Card
                key={s.name}
                highlight={i === 1}
                className="flex flex-col"
              >
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="font-display text-xl font-semibold text-ursa-dark-roast mt-0">{t(`content.growth.budget.scenario.${scenarioId}.name`)}</h3>
                  <Pill tone={i === 0 ? "forest" : i === 1 ? "gold" : "default"}>S/. {s.monthlyPEN.toLocaleString()}{t("content.growth.budget.label.per-month")}</Pill>
                </div>
                <p className="text-[0.85rem] text-muted-foreground mb-4 m-0">{t(`content.growth.budget.scenario.${scenarioId}.focus`)}</p>
                <ul className="space-y-1.5 m-0 p-0 list-none text-[0.82rem] mb-4">
                  {s.items.slice(0, 4).map((it, idx) => (
                    <li key={it.item} className="flex justify-between gap-2">
                      <span className="text-foreground/80">{t(`content.growth.budget.scenario.${scenarioId}.item.${idx + 1}`)}</span>
                      <span className="font-label text-[0.7rem] text-ursa-medium-roast whitespace-nowrap">S/. {it.cost.toLocaleString()}</span>
                    </li>
                  ))}
                  {s.items.length > 4 && (
                    <li className="font-label text-[0.62rem] tracking-[0.1em] uppercase text-muted-foreground">
                      {t("content.growth.budget.label.more-items", { n: s.items.length - 4 })}
                    </li>
                  )}
                </ul>
                {/* Prominent total + visual bar */}
                <div className="mt-auto pt-3 border-t border-ursa-line-soft">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground">{t("content.growth.budget.label.monthly-total")}</span>
                  <span className="font-display text-2xl font-semibold text-ursa-dark-roast leading-none">
                    S/. {s.monthlyPEN.toLocaleString()}
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                    style={{
                      width: `${(s.monthlyPEN / BUDGET_SCENARIOS[2].monthlyPEN) * 100}%`,
                      background:
                        i === 0
                          ? "linear-gradient(90deg, var(--color-ursa-forest), var(--color-ursa-forest-deep))"
                          : i === 1
                          ? "linear-gradient(90deg, var(--color-ursa-gold-soft), var(--color-ursa-gold))"
                          : "linear-gradient(90deg, var(--color-ursa-terracotta), var(--color-ursa-gold))",
                    }}
                  >
                    <span
                      className={cn(
                        "font-label text-[0.56rem] tracking-[0.08em] uppercase",
                        // Forest bar is dark enough for cream text; gold/terracotta bars need near-black for AA contrast.
                        i === 0 ? "text-ursa-cream" : "text-ursa-espresso"
                      )}
                    >
                      {Math.round((s.monthlyPEN / BUDGET_SCENARIOS[2].monthlyPEN) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            );
          })}
        </Grid>

        <div className="grid sm:grid-cols-3 gap-6 mt-8">
          <StatBlock
            value={`S/. ${BUDGET_SCENARIOS[0].monthlyPEN.toLocaleString()}`}
            label={t("content.growth.budget.stat.lean.label")}
            tone="forest"
          />
          <StatBlock
            value={`S/. ${BUDGET_SCENARIOS[1].monthlyPEN.toLocaleString()}`}
            label={t("content.growth.budget.stat.moderate.label")}
            tone="gold"
          />
          <StatBlock
            value={`S/. ${BUDGET_SCENARIOS[2].monthlyPEN.toLocaleString()}`}
            label={t("content.growth.budget.stat.growth.label")}
            tone="terracotta"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("budget")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ursa-gold text-ursa-dark-roast hover:bg-ursa-gold-soft transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
          >
            <MapIcon size={14} /> {t("content.growth.budget.button.budget-allocator")}
          </button>
          <button
            onClick={() => navigate("roi")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ursa-forest-deep/40 text-ursa-forest-deep hover:bg-ursa-dark-roast hover:text-ursa-cream transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
          >
            <ArrowRight size={14} /> {t("content.growth.budget.button.roi")}
          </button>
        </div>

        <ArtNouveauDivider />

        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="bg-ursa-foam">
            <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
              <Coffee size={16} className="text-ursa-gold-text" /> {t("content.growth.budget.card.unlocks.heading")}
            </h4>
            <ul className="space-y-1.5 text-[0.88rem] m-0 p-0 list-none text-foreground/85">
              <li>{t("content.growth.budget.card.unlocks.lean")}</li>
              <li>{t("content.growth.budget.card.unlocks.moderate")}</li>
              <li>{t("content.growth.budget.card.unlocks.growth")}</li>
            </ul>
          </Card>
          <Card>
            <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
              <Star size={16} className="text-ursa-gold-text" /> {t("content.growth.budget.card.choose.heading")}
            </h4>
            <p className="text-[0.88rem] text-muted-foreground m-0">
              {t("content.growth.budget.card.choose.body")}
            </p>
          </Card>
        </div>
      </ViewSection>

      <ViewSection>
        <DossierLinkBanner moduleId="04-marketing-growth-and-retention-plan" />
      </ViewSection>
    </>
  );
}
