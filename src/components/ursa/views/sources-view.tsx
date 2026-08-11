"use client";

import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import {
  ArtNouveauDivider,
  Pill,
  Callout,
  StatBlock,
  EvidenceTag,
} from "../ursa-brand";
import { SOURCES, OPEN_QUESTIONS } from "@/lib/ursa-data";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import {
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  FileJson,
  FlaskConical,
  Ban,
  CircleSlash,
  BookOpen,
  MapPin,
  ArrowRight,
} from "lucide-react";

/** Missing business data, with notes on how scenarios absorb each gap. */
const MISSING_DATA: { item: string; note: string }[] = [
  { item: "Monthly marketing budget", note: "Owner confirmation requested; Lean / Moderate / Growth scenarios parameterised so no budget is required to act." },
  { item: "Average ticket size", note: "POS extract would refine conversion forecasts; lean/moderate/growth scenarios use defensible ranges instead." },
  { item: "Best / worst sellers from POS", note: "Affects menu-engineering and attach-rate model; both tools tolerate default inputs until POS data arrives." },
  { item: "Ingredient / cup cost", note: "Only category-level inferences are used. No invented supplier prices appear anywhere in the dossier." },
  { item: "Gross margin %", note: "Replaced by lean/moderate/growth scenario ranges. No fixed margin is asserted." },
  { item: "Peak-hour capacity", note: "Affects service-recovery playbook; default capacity assumptions are stated and overridable." },
  { item: "Staff capacity for classes / cuppings / creator collabs", note: "Open question to the owner; experimental phases assume minimum capacity and scale up if confirmed." },
  { item: "Repeat-visit rate or loyalty data", note: "No CRM extract available; retention scenarios model from industry benchmarks, flagged as unverified." },
  { item: "Customer database (email / WhatsApp list size with consent)", note: "Owner confirmation requested; growth scenarios assume cold start (zero list) as the worst case." },
  { item: "Campaign history (paid social, past spend, past CPA)", note: "No Ads Manager access; ROI dashboard uses defensible benchmarks rather than actuals." },
];

/** Conflicting information found across public sources. */
const CONFLICTS: { topic: string; detail: string }[] = [
  {
    topic: "Operating hours across platforms",
    detail: "Hours may differ slightly between the Instagram bio, the Rappi listing, and the CoffeePass page. The dossier treats the Instagram bio hours (Mon–Sat 07:30–21:00 · Sun 08:30–20:00) as canonical and recommends the owner confirm before any campaign launch.",
  },
  {
    topic: "Instagram follower count over time",
    detail: "Follower counts fluctuate daily. The 4,746 figure is a 2026-08-01 snapshot and should be treated as approximately current rather than exact. Re-check before quoting in any external material.",
  },
  {
    topic: "TripAdvisor listing exists but has ~0 reviews",
    detail: "A TripAdvisor listing for Ursa Coffee Roasters exists at snapshot but carries approximately zero reviews. The listing is either new, unmonitored, or inaccurate — owner confirmation recommended before citing publicly.",
  },
  {
    topic: "Cross-platform menu & pricing",
    detail: "Pricing may differ between the in-store chalkboard, Rappi, and CoffeePass. The dossier treats Rappi prices as the public default and marks any reconstructed prices with an asterisk in the menu module.",
  },
];

/** Methodology steps. */
const METHODOLOGY: { title: string; detail: string }[] = [
  {
    title: "Public sources only",
    detail: "No proprietary data, no owner-supplied financials, no Ads Manager access. Every figure is reconstructable from a public URL in the source list above.",
  },
  {
    title: "Instagram post & reel cover sampling",
    detail: "Posts and reel cover images were sampled to identify signature drinks, brand voice, and visual patterns. Full video transcripts were not transcribed — only the cover frames and visible captions.",
  },
  {
    title: "Rappi menu extraction",
    detail: "Rappi's public delivery listing was used to reconstruct menu items, prices, and category structure. In-store-only items may not appear on Rappi and are flagged accordingly.",
  },
  {
    title: "CoffeePass cross-reference",
    detail: "CoffeePass Perú's public listing confirmed Ursa's membership-tier placement and the platform category it sits in.",
  },
  {
    title: "TripAdvisor check",
    detail: "TripAdvisor listing was checked for review sentiment and volume — approximately zero reviews at snapshot. Recorded as a partial source.",
  },
  {
    title: "Competitor website survey",
    detail: "Competitor websites were surveyed for positioning, design language, and channel coverage, to ground the orthogonality analysis in the Market module.",
  },
  {
    title: "Framework references",
    detail: "Acquisition.com (Hormozi offer / lead frameworks) and FS.blog (Rory Sutherland behavioural marketing interview) were used as primary framework sources. Both are publicly accessible.",
  },
  {
    title: "Industry context",
    detail: "Premios Somos 2024 and Fresh Cup café-trend coverage were referenced for competitor award context and macro industry direction respectively.",
  },
];

export function SourcesView() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const verifiedCount = SOURCES.filter((s) => s.status === "verified").length;
  const partialCount = SOURCES.filter((s) => s.status === "partial").length;
  const unverifiedCount = SOURCES.filter((s) => s.status === "unverified").length;
  const gapCount = SOURCES.filter((s) => s.status === "gap").length;

  const section1Meta = t("content.sources.section.1.meta")
    .replace("{n}", String(SOURCES.length))
    .replace("{verified}", String(verifiedCount))
    .replace("{partial}", String(partialCount));
  const section5Meta = t("content.sources.section.5.meta")
    .replace("{n}", String(OPEN_QUESTIONS.length));

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.sources.eyebrow")}
        title={<>{t("content.view.sources.title")}</>}
        lede={<>{t("content.sources.lede")}</>}
        meta={[
          { label: t("content.sources.meta.snapshot.label"), value: t("content.sources.meta.snapshot") },
          { label: t("content.sources.meta.scope.label"), value: t("content.sources.meta.scope") },
          { label: t("content.sources.meta.constraint.label"), value: t("content.sources.meta.constraint") },
        ]}
        tone="forest"
      />

      {/* §1 — At-a-glance source stats */}
      <ViewSection
        badge={t("content.sources.section.1.badge")}
        title={t("content.sources.section.1.title")}
        meta={section1Meta}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatBlock value={String(verifiedCount)} label={t("content.sources.section.1.stat.verified")} tone="forest" />
          <StatBlock value={String(partialCount)} label={t("content.sources.section.1.stat.partial")} tone="gold" />
          <StatBlock value={String(unverifiedCount)} label={t("content.sources.section.1.stat.unverified")} tone="terracotta" />
          <StatBlock value={String(gapCount)} label={t("content.sources.section.1.stat.gap")} tone="forest" />
        </div>
        <Callout tone="forest" title={t("content.sources.section.1.callout.title")}>
          {t("content.sources.section.1.callout.body")}
        </Callout>
      </ViewSection>

      {/* §2 — Source list */}
      <ViewSection
        badge={t("content.sources.section.2.badge")}
        title={t("content.sources.section.2.title")}
        meta={t("content.sources.section.2.meta")}
      >
        <Grid cols={2}>
          {SOURCES.map((s) => (
            <Card key={s.id} className="flex flex-col gap-3 h-full">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-baseline gap-2 min-w-0">
                  <span className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-gold-text shrink-0">{s.id}</span>
                  <h3 className="font-display text-lg font-semibold text-ursa-dark-roast m-0 leading-snug">{s.label}</h3>
                </div>
                <EvidenceTag status={s.status} />
              </div>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-1.5 text-[0.82rem] text-ursa-forest-deep hover:text-ursa-gold-text transition break-all"
              >
                <ExternalLink size={12} className="mt-0.5 shrink-0" />
                <span className="break-all">{s.url}</span>
              </a>
              <p className="m-0 text-[0.88rem] text-foreground/80 leading-relaxed">{s.note}</p>
            </Card>
          ))}
        </Grid>
        <ArtNouveauDivider />
      </ViewSection>

      {/* §3 — Evidence status legend */}
      <ViewSection
        badge={t("content.sources.section.3.badge")}
        title={t("content.sources.section.3.title")}
        meta={t("content.sources.section.3.meta")}
      >
        <Grid cols={2}>
          <Card className="flex flex-col gap-3 h-full">
            <div className="flex items-center gap-2">
              <EvidenceTag status="verified" />
              <span className="font-display text-base font-semibold text-ursa-dark-roast">{t("common.verified")}</span>
            </div>
            <p className="m-0 text-[0.88rem] text-foreground/80">
              {t("content.sources.section.3.verified.body")}
            </p>
          </Card>
          <Card className="flex flex-col gap-3 h-full">
            <div className="flex items-center gap-2">
              <EvidenceTag status="partial" />
              <span className="font-display text-base font-semibold text-ursa-dark-roast">{t("common.partial")}</span>
            </div>
            <p className="m-0 text-[0.88rem] text-foreground/80">
              {t("content.sources.section.3.partial.body")}
            </p>
          </Card>
          <Card className="flex flex-col gap-3 h-full">
            <div className="flex items-center gap-2">
              <EvidenceTag status="unverified" />
              <span className="font-display text-base font-semibold text-ursa-dark-roast">{t("common.unverified")}</span>
            </div>
            <p className="m-0 text-[0.88rem] text-foreground/80">
              {t("content.sources.section.3.unverified.body")}
            </p>
          </Card>
          <Card className="flex flex-col gap-3 h-full">
            <div className="flex items-center gap-2">
              <EvidenceTag status="gap" />
              <span className="font-display text-base font-semibold text-ursa-dark-roast">{t("common.gap")}</span>
            </div>
            <p className="m-0 text-[0.88rem] text-foreground/80">
              {t("content.sources.section.3.gap.body")}
            </p>
          </Card>
        </Grid>
      </ViewSection>

      {/* §4 — Disambiguation warning */}
      <ViewSection
        badge={t("content.sources.section.4.badge")}
        title={t("content.sources.section.4.title")}
      >
        <Callout tone="stop" title={t("content.sources.section.4.callout.title")}>
          <p className="m-0 mb-2">
            {t("content.sources.section.4.callout.p1")}
          </p>
          <p className="m-0">
            {t("content.sources.section.4.callout.p2")}
          </p>
        </Callout>
        <Grid cols={3}>
          <Card highlight className="h-full">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-ursa-forest-deep" />
              <span className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-forest-deep">{t("content.sources.section.4.card.subject.eyebrow")}</span>
            </div>
            <h4 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-1">Ursa Coffee Roasters</h4>
            <p className="m-0 text-[0.86rem] text-foreground/80 leading-relaxed">
              {t("content.sources.section.4.card.subject.body")}
            </p>
          </Card>
          <Card className="h-full border-dashed">
            <div className="flex items-center gap-2 mb-2">
              <Ban size={16} className="text-ursa-terracotta-text" />
              <span className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-terracotta-text">{t("content.sources.section.4.card.unrelated.eyebrow")}</span>
            </div>
            <h4 className="font-display text-lg font-semibold text-muted-foreground mt-0 mb-1">URSA (Bridgeport, CT)</h4>
            <p className="m-0 text-[0.86rem] text-muted-foreground leading-relaxed">
              {t("content.sources.section.4.card.unrelated.body")}
            </p>
          </Card>
          <Card className="h-full">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={16} className="text-ursa-gold-text" />
              <span className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-gold-text">{t("content.sources.section.4.card.verify.eyebrow")}</span>
            </div>
            <h4 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-1">{t("content.sources.section.4.card.verify.title")}</h4>
            <ul className="m-0 p-0 list-none space-y-1 text-[0.86rem] text-foreground/85">
              <li className="flex gap-2"><span className="text-ursa-gold-text">·</span><span>{t("content.sources.section.4.card.verify.li.1")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-gold-text">·</span><span>{t("content.sources.section.4.card.verify.li.2")}</span></li>
              <li className="flex gap-2"><span className="text-ursa-gold-text">·</span><span>{t("content.sources.section.4.card.verify.li.3")}</span></li>
            </ul>
          </Card>
        </Grid>
      </ViewSection>

      {/* §5 — Open questions for the owner */}
      <ViewSection
        badge={t("content.sources.section.5.badge")}
        title={t("content.sources.section.5.title")}
        meta={section5Meta}
      >
        <Card highlight>
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={18} className="text-ursa-gold-text" />
            <h3 className="font-display text-lg font-semibold text-ursa-dark-roast m-0">{t("content.sources.section.5.card.title")}</h3>
          </div>
          <p className="text-[0.92rem] text-foreground/85 mb-4 mt-0">
            {t("content.sources.section.5.card.body")}
          </p>
          <ol className="space-y-2.5 m-0 p-0 list-none">
            {OPEN_QUESTIONS.map((q, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-ursa-dark-roast text-ursa-cream font-label text-[0.72rem] tracking-[0.06em]">
                  {i + 1}
                </span>
                <span className="text-[0.92rem] text-foreground/90 leading-relaxed pt-1">{q}</span>
              </li>
            ))}
          </ol>
          <Callout tone="gold" title={t("content.sources.section.5.callout.title")}>
            {t("content.sources.section.5.callout.body")}
          </Callout>
        </Card>
      </ViewSection>

      {/* §6 — Missing business data */}
      <ViewSection
        badge={t("content.sources.section.6.badge")}
        title={t("content.sources.section.6.title")}
        meta={t("content.sources.section.6.meta")}
      >
        <Grid cols={2}>
          {MISSING_DATA.map((m) => (
            <Card key={m.item} className="flex flex-col gap-2 h-full">
              <div className="flex items-start gap-2">
                <CircleSlash size={15} className="text-ursa-terracotta-text mt-1 shrink-0" />
                <h4 className="font-display text-base font-semibold text-ursa-dark-roast m-0">{m.item}</h4>
              </div>
              <p className="m-0 text-[0.86rem] text-foreground/75 leading-relaxed pl-7">{m.note}</p>
            </Card>
          ))}
        </Grid>
        <Callout tone="forest" title={t("content.sources.section.6.callout.title")}>
          {t("content.sources.section.6.callout.body")}
        </Callout>
      </ViewSection>

      {/* §7 — Conflicting information */}
      <ViewSection
        badge={t("content.sources.section.7.badge")}
        title={t("content.sources.section.7.title")}
        meta={t("content.sources.section.7.meta")}
      >
        <div className="space-y-4">
          {CONFLICTS.map((c) => (
            <Card key={c.topic} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-ursa-gold-text shrink-0" />
                <h4 className="font-display text-base font-semibold text-ursa-dark-roast m-0">{c.topic}</h4>
              </div>
              <p className="m-0 text-[0.9rem] text-foreground/85 leading-relaxed pl-7">{c.detail}</p>
            </Card>
          ))}
        </div>
        <Callout tone="gold" title={t("content.sources.section.7.callout.title")}>
          {t("content.sources.section.7.callout.body")}
        </Callout>
      </ViewSection>

      {/* §8 — Methodology */}
      <ViewSection
        badge={t("content.sources.section.8.badge")}
        title={t("content.sources.section.8.title")}
        meta={t("content.sources.section.8.meta")}
      >
        <Grid cols={2}>
          {METHODOLOGY.map((m, i) => (
            <Card key={m.title} className="flex flex-col gap-2 h-full">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-ursa-dark-roast/10 text-ursa-forest-deep font-label text-[0.66rem] tracking-[0.06em] border border-ursa-forest-deep/25">
                  {i + 1}
                </span>
                <h4 className="font-display text-base font-semibold text-ursa-dark-roast m-0">{m.title}</h4>
              </div>
              <p className="m-0 text-[0.86rem] text-foreground/80 leading-relaxed pl-8">{m.detail}</p>
            </Card>
          ))}
        </Grid>
        <Callout tone="gold" title={t("content.sources.section.8.callout.title")}>
          <ul className="m-0 p-0 list-none space-y-1 mb-3">
            <li className="flex gap-2"><span className="text-ursa-terracotta-text">·</span><span>{t("content.sources.section.8.callout.list.1")}</span></li>
            <li className="flex gap-2"><span className="text-ursa-terracotta-text">·</span><span>{t("content.sources.section.8.callout.list.2")}</span></li>
            <li className="flex gap-2"><span className="text-ursa-terracotta-text">·</span><span>{t("content.sources.section.8.callout.list.3")}</span></li>
            <li className="flex gap-2"><span className="text-ursa-terracotta-text">·</span><span>{t("content.sources.section.8.callout.list.4")}</span></li>
            <li className="flex gap-2"><span className="text-ursa-terracotta-text">·</span><span>{t("content.sources.section.8.callout.list.5")}</span></li>
          </ul>
          <p className="m-0 text-[0.88rem] text-foreground/85 leading-relaxed">
            {t("content.sources.section.8.callout.closing")}
          </p>
        </Callout>
      </ViewSection>

      {/* §9 — Structured data files */}
      <ViewSection
        badge={t("content.sources.section.9.badge")}
        title={t("content.sources.section.9.title")}
        meta={t("content.sources.section.9.meta")}
      >
        <Grid cols={2}>
          <Card className="flex flex-col gap-3 h-full">
            <div className="flex items-center gap-2">
              <FileJson size={18} className="text-ursa-gold-text" />
              <h4 className="font-display text-lg font-semibold text-ursa-dark-roast m-0">evidence.json</h4>
            </div>
            <p className="m-0 text-[0.88rem] text-foreground/80 leading-relaxed">
              {t("content.sources.section.9.card.evidence.body")}
            </p>
            <a
              href="/AIMarket-Design-Consulting-Reports/dossier/assets/evidence.json"
              target="_blank"
              rel="noopener noreferrer"
              className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-forest-deep hover:text-ursa-gold-text transition inline-flex items-center gap-1.5 mt-auto"
            >
              <ExternalLink size={11} /> /dossier/assets/evidence.json
            </a>
          </Card>
          <Card className="flex flex-col gap-3 h-full">
            <div className="flex items-center gap-2">
              <FlaskConical size={18} className="text-ursa-gold-text" />
              <h4 className="font-display text-lg font-semibold text-ursa-dark-roast m-0">experiments.json</h4>
            </div>
            <p className="m-0 text-[0.88rem] text-foreground/80 leading-relaxed">
              {t("content.sources.section.9.card.experiments.body")}
            </p>
            <a
              href="/AIMarket-Design-Consulting-Reports/dossier/assets/experiments.json"
              target="_blank"
              rel="noopener noreferrer"
              className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-forest-deep hover:text-ursa-gold-text transition inline-flex items-center gap-1.5 mt-auto"
            >
              <ExternalLink size={11} /> /dossier/assets/experiments.json
            </a>
          </Card>
        </Grid>
        <Callout tone="forest" title={t("content.sources.section.9.callout.title")}>
          {t("content.sources.section.9.callout.body")}
        </Callout>
      </ViewSection>

      {/* §10 — Dossier link banner + cross-link */}
      <ViewSection>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
          <DossierLinkBanner moduleId="sources-and-evidence" />
          <div className="flex items-center gap-3 flex-wrap">
            <Pill tone="forest"><BookOpen size={11} /> {t("content.sources.section.10.pill")}</Pill>
            <button
              onClick={() => navigate("experiments")}
              className="font-label text-[0.72rem] tracking-[0.14em] uppercase text-ursa-forest-deep hover:text-ursa-gold-text transition inline-flex items-center gap-1.5"
            >
              {t("content.sources.section.10.button")} <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </ViewSection>
    </>
  );
}
