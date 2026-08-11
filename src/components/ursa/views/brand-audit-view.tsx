"use client";

import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import {
  BearMark,
  CupGlyph,
  ArtNouveauDivider,
  Pill,
  Callout,
  StatBlock,
  EvidenceTag,
  SectionBadge,
} from "../ursa-brand";
import { PALETTE, TYPOGRAPHY, URSA_FACTS } from "@/lib/ursa-data";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import {
  Palette,
  Type,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Star,
  CircleSlash,
  ShieldCheck,
  Layers,
  FlaskConical,
  ArrowRight,
} from "lucide-react";

type VerifiedItem = {
  id: string;
  status: "verified" | "partial" | "unverified" | "gap";
};

const VERIFIED_BRAND_ELEMENTS: VerifiedItem[] = [
  { id: "art-nouveau", status: "verified" },
  { id: "palette", status: "verified" },
  { id: "bear", status: "verified" },
  { id: "roastery", status: "verified" },
  { id: "tagline", status: "verified" },
  { id: "two-bar", status: "verified" },
  { id: "named-drinks", status: "verified" },
  { id: "cross-surface", status: "partial" },
];

const BEAR_ANALYSIS = [
  { id: "consistent", icon: CheckCircle2, tone: "ok" as const },
  { id: "inconsistent", icon: AlertTriangle, tone: "warn" as const },
  { id: "distinctive", icon: Star, tone: "gold" as const },
  { id: "missing", icon: CircleSlash, tone: "stop" as const },
];

const ART_NOUVEAU_COMPONENTS = [
  { id: "borders" },
  { id: "type" },
  { id: "gold" },
  { id: "botanical" },
];

const EVOLUTION_LEVELS = [
  { id: "level-1", level: "Level 1", recommended: true },
  { id: "level-2", level: "Level 2", recommended: false },
  { id: "level-3", level: "Level 3", recommended: false },
];

const CONSISTENT_INCONSISTENT = [
  { id: "consistent", icon: CheckCircle2, tone: "ok" as const },
  { id: "inconsistent", icon: AlertTriangle, tone: "warn" as const },
  { id: "distinctive", icon: Star, tone: "gold" as const },
  { id: "missing", icon: CircleSlash, tone: "stop" as const },
];

const DISTINCTIVE_ASSETS = [
  { id: "bear" },
  { id: "ornamentation" },
  { id: "tagline" },
  { id: "palette" },
];

export function BrandAuditView() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <>
      {/* 1. Hero */}
      <ViewHero
        eyebrow={t("content.view.brand.eyebrow")}
        title={<>{t("content.view.brand.title")}</>}
        lede={t("content.brand.hero.lede")}
        meta={[
          { label: t("common.snapshot"), value: URSA_FACTS.snapshot },
          { label: t("common.subject"), value: URSA_FACTS.address },
          { label: t("content.brand.hero.meta.direction"), value: t("content.brand.hero.meta.direction-value") },
        ]}
      />

      {/* 2. What we verified */}
      <ViewSection
        badge={t("content.brand.section.verified.badge")}
        title={t("content.brand.section.verified.title")}
        meta={t("content.brand.section.verified.meta")}
      >
        <p className="text-[1rem] leading-relaxed text-muted-foreground max-w-[68ch] mb-6">
          {t("content.brand.section.verified.intro")}
        </p>
        <Grid cols={4}>
          {VERIFIED_BRAND_ELEMENTS.map((el) => (
            <Card key={el.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <BearMark size={22} className="text-ursa-dark-roast" />
                <EvidenceTag status={el.status} />
              </div>
              <h3 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast mt-0 mb-1.5 leading-tight">
                {t(`content.brand.verified.${el.id}.title`)}
              </h3>
              <p className="text-[0.85rem] text-muted-foreground m-0 leading-relaxed">
                {t(`content.brand.verified.${el.id}.detail`)}
              </p>
              <div className="mt-3 pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-gold-text mb-1 flex items-center gap-1">
                  <ShieldCheck size={11} aria-hidden /> {t("content.brand.evidence-snapshot-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t(`content.brand.verified.${el.id}.evidence`)}
                </p>
              </div>
            </Card>
          ))}
        </Grid>
      </ViewSection>

      {/* 3. Color palette */}
      <ViewSection
        badge={t("content.brand.section.palette.badge")}
        title={t("content.brand.section.palette.title")}
        meta={t("content.brand.section.palette.meta")}
      >
        <p className="text-[1rem] leading-relaxed text-muted-foreground max-w-[68ch] mb-4">
          {t("content.brand.section.palette.intro")}
        </p>
        <div className="flex flex-wrap items-center gap-3 mb-6 p-3 rounded-lg bg-ursa-foam border border-ursa-line-soft">
          <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">
            {t("content.brand.section.palette.provenance-key")}:
          </span>
          <span className="flex items-center gap-1.5 text-[0.76rem]">
            <span className="w-2.5 h-2.5 rounded-sm bg-ursa-gold/60" /> {t("content.brand.section.palette.provenance.approximate")}
          </span>
          <span className="flex items-center gap-1.5 text-[0.76rem]">
            <span className="w-2.5 h-2.5 rounded-sm bg-ursa-terracotta/60" /> {t("content.brand.section.palette.provenance.proposed")}
          </span>
          <span className="flex items-center gap-1.5 text-[0.76rem]">
            <span className="w-2.5 h-2.5 rounded-sm bg-ursa-forest-deep/60" /> {t("content.brand.section.palette.provenance.official")}
          </span>
        </div>
        <Grid cols={4}>
          {PALETTE.map((c) => {
            // Determine if the color is dark (for contrast-aware text overlay)
            const r = parseInt(c.hex.slice(1, 3), 16);
            const g = parseInt(c.hex.slice(3, 5), 16);
            const b = parseInt(c.hex.slice(5, 7), 16);
            // Use WCAG relative luminance for contrast-aware text overlay
            function srgbLin(v: number) {
              return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            }
            const relLum =
              0.2126 * srgbLin(r / 255) +
              0.7152 * srgbLin(g / 255) +
              0.0722 * srgbLin(b / 255);
            // Use ink text on mid-tone backgrounds (relLum > 0.18), cream on dark
            const overlayText = relLum > 0.18 ? "#211208" : "#F4EBD9";
            return (
              <Card key={c.name} className="overflow-hidden p-0 group cursor-default">
                <div
                  className="h-24 w-full relative flex items-end p-3 transition group-hover:h-28"
                  style={{ backgroundColor: c.hex }}
                >
                  <span
                    className="font-label text-[0.66rem] tracking-[0.12em] uppercase font-medium"
                    style={{ color: overlayText }}
                  >
                    {c.hex}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-display text-[1rem] font-semibold text-ursa-dark-roast m-0 leading-tight">
                      {c.name}
                    </h4>
                    <span
                      className="font-label text-[0.52rem] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded border"
                      style={{
                        borderColor:
                          c.provenance === "official"
                            ? "var(--color-ursa-forest-deep)"
                            : c.provenance === "approximate"
                              ? "var(--color-ursa-gold)"
                              : "var(--color-ursa-terracotta)",
                        color:
                          c.provenance === "official"
                            ? "var(--color-ursa-forest-deep)"
                            : c.provenance === "approximate"
                              ? "var(--color-ursa-gold-text)"
                              : "var(--color-ursa-terracotta-text)",
                      }}
                    >
                      {t(`content.brand.palette.provenance.${c.provenance}`)}
                    </span>
                  </div>
                  <p className="text-[0.78rem] text-muted-foreground m-0 leading-snug">{c.role}</p>
                </div>
              </Card>
            );
          })}
        </Grid>
      </ViewSection>

      {/* 4. Typography */}
      <ViewSection
        badge={t("content.brand.section.typography.badge")}
        title={t("content.brand.section.typography.title")}
        meta="Cormorant Garamond · Inter · Oswald"
      >
        <p className="text-[1rem] leading-relaxed text-muted-foreground max-w-[68ch] mb-6">
          {t("content.brand.section.typography.intro")}
        </p>
        <Grid cols={3}>
          {TYPOGRAPHY.map((f) => (
            <Card key={f.name} className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <Pill tone="forest">{f.role.split(" · ")[0]}</Pill>
                <Type size={16} className="text-ursa-gold-text" />
              </div>
              <p
                className={`${f.className} text-ursa-dark-roast mt-0 mb-3 leading-tight`}
                style={{ fontSize: "1.5rem", fontWeight: 600 }}
              >
                {f.sample}
              </p>
              <h4 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast mt-0 mb-1">
                {f.name}
              </h4>
              <p className="text-[0.82rem] text-muted-foreground m-0">{f.role}</p>
            </Card>
          ))}
        </Grid>

        <ArtNouveauDivider />

        {/* Type scale demonstration */}
        <div className="bg-ursa-foam border border-ursa-line-soft rounded-xl p-6">
          <h4 className="font-label text-[0.7rem] tracking-[0.16em] uppercase text-muted-foreground mb-4">
            {t("content.brand.section.typography.scale.label")}
          </h4>
          <p className="font-display text-[2.4rem] font-semibold text-ursa-dark-roast mt-0 mb-2 leading-tight">
            {t("content.brand.section.typography.scale.headline")}
          </p>
          <p className="font-display text-[1.6rem] font-medium text-ursa-medium-roast mt-0 mb-2 leading-tight">
            {t("content.brand.section.typography.scale.subhead")}
          </p>
          <p className="font-body text-[1.05rem] text-ursa-dark-roast/85 mt-0 mb-3 leading-relaxed max-w-[60ch]">
            {t("content.brand.section.typography.scale.body")}
          </p>
          <p className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-ursa-forest-deep mt-0 mb-0">
            {t("content.brand.section.typography.scale.label-text")}
          </p>
        </div>
      </ViewSection>

      {/* 5. Bear motif analysis */}
      <ViewSection
        badge={t("content.brand.section.bear.badge")}
        title={t("content.brand.section.bear.title")}
        meta={t("content.brand.section.bear.meta")}
      >
        <Grid cols={4}>
          {BEAR_ANALYSIS.map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.id} className="flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={18} className="text-ursa-dark-roast" />
                  <Pill tone={b.tone}>{t(`content.brand.bear.${b.id}.label`)}</Pill>
                </div>
                <ul className="space-y-2 m-0 p-0 list-none">
                  {[0, 1, 2].map((i) => (
                    <li key={i} className="text-[0.85rem] text-muted-foreground leading-relaxed flex gap-2">
                      <span className="text-ursa-gold-text mt-1 shrink-0">·</span>
                      <span>{t(`content.brand.bear.${b.id}.point-${i + 1}`)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </Grid>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <BearMark size={48} className="text-ursa-dark-roast" />
          <BearMark size={48} className="text-ursa-forest-deep" />
          <BearMark size={48} className="text-ursa-gold-text" />
          <BearMark size={48} className="text-ursa-terracotta-text" />
          <span className="font-label text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground">
            {t("content.brand.section.bear.tints")}
          </span>
        </div>
      </ViewSection>

      {/* 5b. Distinctive Assets — Ehrenberg-Bass framework */}
      <ViewSection
        badge={t("content.brand.section.distinctive.badge")}
        title={t("content.brand.section.distinctive.title")}
        meta={t("content.brand.section.distinctive.meta")}
      >
        <div className="grid md:grid-cols-[2fr_1fr] gap-5 items-start mb-6">
          <p className="text-[0.95rem] leading-relaxed text-muted-foreground max-w-[68ch] m-0">
            {t("content.brand.section.distinctive.intro")}
          </p>
          <Callout tone="forest" title={t("content.brand.section.distinctive.census-callout-title")}>
            <p className="text-[0.88rem] m-0">
              {t("content.brand.section.distinctive.census-callout-body")}
            </p>
          </Callout>
        </div>

        <Grid cols={2}>
          {DISTINCTIVE_ASSETS.map((a) => {
            const uniqueness = t(`content.brand.distinctive.${a.id}.uniqueness`);
            const prevalence = t(`content.brand.distinctive.${a.id}.prevalence`);
            return (
              <Card key={a.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h4 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast m-0 leading-tight">
                    {t(`content.brand.distinctive.${a.id}.asset`)}
                  </h4>
                  <div className="flex flex-col gap-1 items-end shrink-0">
                    <span className="inline-flex items-center gap-1 font-label text-[0.55rem] tracking-[0.14em] uppercase px-1.5 py-0.5 rounded border border-ursa-forest-deep/30 text-ursa-forest-deep bg-ursa-dark-roast/5">
                      <Star size={9} /> {t("content.brand.distinctive.uniqueness-label")} · {uniqueness}
                    </span>
                    <span className="inline-flex items-center gap-1 font-label text-[0.55rem] tracking-[0.14em] uppercase px-1.5 py-0.5 rounded border border-ursa-gold text-ursa-forest-deep bg-ursa-gold/15">
                      <AlertTriangle size={9} /> {t("content.brand.distinctive.prevalence-label")} · {prevalence}
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-gold-text mb-1">
                    {t("content.brand.distinctive.census-evidence-label")}
                  </div>
                  <p className="text-[0.82rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                    {t(`content.brand.distinctive.${a.id}.census`)}
                  </p>
                </div>
                <div className="mb-3">
                  <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-forest-deep mb-1">
                    {t("content.brand.distinctive.verdict-label")}
                  </div>
                  <p className="text-[0.82rem] text-muted-foreground m-0 leading-relaxed">
                    {t(`content.brand.distinctive.${a.id}.verdict`)}
                  </p>
                </div>
                <div className="mt-auto pt-3 border-t border-ursa-line-soft">
                  <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-terracotta-text mb-1 flex items-center gap-1">
                    <ShieldCheck size={11} /> {t("content.brand.distinctive.promote-label")}
                  </div>
                  <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                    {t(`content.brand.distinctive.${a.id}.apply-if`)}
                  </p>
                </div>
              </Card>
            );
          })}
        </Grid>

        <Callout tone="gold" title={t("content.brand.section.distinctive.why-callout-title")}>
          {t("content.brand.section.distinctive.why-callout-body")}
        </Callout>
      </ViewSection>

      {/* 6. Art Nouveau components */}
      <ViewSection
        badge={t("content.brand.section.art-nouveau.badge")}
        title={t("content.brand.section.art-nouveau.title")}
        meta={t("content.brand.section.art-nouveau.meta")}
      >
        <Grid cols={4}>
          {ART_NOUVEAU_COMPONENTS.map((c) => (
            <Card key={c.id} className="flex flex-col">
              <Palette size={18} className="text-ursa-gold-text mb-2" />
              <h4 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast mt-0 mb-1.5">
                {t(`content.brand.art-nouveau.${c.id}.title`)}
              </h4>
              <p className="text-[0.85rem] text-muted-foreground m-0 leading-relaxed">
                {t(`content.brand.art-nouveau.${c.id}.detail`)}
              </p>
              <div className="mt-3 pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-gold-text mb-1 flex items-center gap-1">
                  <ShieldCheck size={11} aria-hidden /> {t("content.brand.evidence-snapshot-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t(`content.brand.art-nouveau.${c.id}.evidence`)}
                </p>
              </div>
            </Card>
          ))}
        </Grid>

        <div className="mt-2 bg-ursa-cream border border-ursa-line-soft rounded-xl p-6">
          <h4 className="font-label text-[0.7rem] tracking-[0.16em] uppercase text-muted-foreground mb-1">
            {t("content.brand.section.art-nouveau.live-label")}
          </h4>
          <p className="text-[0.85rem] text-muted-foreground mb-2">
            {t("content.brand.section.art-nouveau.live-detail")}
          </p>
          <ArtNouveauDivider />
          <div className="flex items-center gap-4 mt-2">
            <CupGlyph size={28} className="text-ursa-dark-roast" />
            <span className="font-display text-lg text-ursa-dark-roast italic">
              “Un gramo a la vez.”
            </span>
            <CupGlyph size={28} className="text-ursa-forest-deep" />
          </div>
        </div>
      </ViewSection>

      {/* 7. Three brand-evolution levels */}
      <ViewSection
        badge={t("content.brand.section.evolution.badge")}
        title={t("content.brand.section.evolution.title")}
        meta={t("content.brand.section.evolution.meta")}
      >
        <p className="text-[1rem] leading-relaxed text-muted-foreground max-w-[68ch] mb-6">
          {t("content.brand.section.evolution.intro")}
        </p>
        <Grid cols={3}>
          {EVOLUTION_LEVELS.map((lvl) => (
            <Card key={lvl.id} highlight={lvl.recommended} className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <Pill tone={lvl.recommended ? "gold" : "forest"}>{lvl.level}</Pill>
                {lvl.recommended && (
                  <span className="inline-flex items-center gap-1 font-label text-[0.6rem] tracking-[0.14em] uppercase text-ursa-gold-text">
                    <ShieldCheck size={12} /> {t("content.brand.evolution.recommended-tag")}
                  </span>
                )}
              </div>
              <h3 className="font-display text-[1.25rem] font-semibold text-ursa-dark-roast mt-0 mb-1 leading-tight">
                {t(`content.brand.evolution.${lvl.id}.name`)}
              </h3>
              <p className="font-label text-[0.66rem] tracking-[0.12em] uppercase text-muted-foreground mb-3">
                {t(`content.brand.evolution.${lvl.id}.horizon`)}
              </p>
              <p className="text-[0.88rem] text-muted-foreground m-0 leading-relaxed mb-4">
                {t(`content.brand.evolution.${lvl.id}.summary`)}
              </p>
              <ul className="space-y-1.5 m-0 p-0 list-none">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="text-[0.82rem] text-ursa-dark-roast/85 leading-snug flex gap-2">
                    <CheckCircle2 size={14} className="text-ursa-forest-deep mt-0.5 shrink-0" />
                    <span>{t(`content.brand.evolution.${lvl.id}.outcome-${i + 1}`)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-t border-ursa-terracotta/30 bg-ursa-terracotta/5 -mx-4 -mb-4 px-4 py-3 rounded-b-xl">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-terracotta-text mb-1 flex items-center gap-1">
                  <AlertTriangle size={11} aria-hidden /> {t("content.brand.evolution.risk-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t(`content.brand.evolution.${lvl.id}.risk`)}
                </p>
              </div>
            </Card>
          ))}
        </Grid>
        <Callout tone="gold" title={t("content.brand.section.evolution.why-callout-title")}>
          {t("content.brand.section.evolution.why-callout-body")}
        </Callout>
      </ViewSection>

      {/* 8. Consistent / Inconsistent / Distinctive / Missing summary */}
      <ViewSection
        badge={t("content.brand.section.summary.badge")}
        title={t("content.brand.section.summary.title")}
        meta={t("content.brand.section.summary.meta")}
      >
        <Grid cols={2}>
          {CONSISTENT_INCONSISTENT.map((block) => {
            const Icon = block.icon;
            return (
              <Card key={block.id}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon size={18} className="text-ursa-dark-roast" />
                  <Pill tone={block.tone}>{t(`content.brand.summary.${block.id}.title`)}</Pill>
                </div>
                <ul className="space-y-2 m-0 p-0 list-none">
                  {[0, 1, 2, 3].map((i) => (
                    <li key={i} className="text-[0.88rem] text-ursa-dark-roast/85 leading-relaxed flex gap-2">
                      <span className="text-ursa-gold-text mt-1 shrink-0">◆</span>
                      <span>{t(`content.brand.summary.${block.id}.item-${i + 1}`)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </Grid>
      </ViewSection>

      {/* 9. Spirit-preservation callout */}
      <ViewSection badge={t("content.brand.section.spirit.badge")} title={t("content.brand.section.spirit.title")}>
        <div
          className="relative overflow-hidden rounded-xl border border-ursa-forest-deep/30 p-6 md:p-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(45,74,54,0.96) 0%, rgba(33,18,8,0.97) 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><g fill='none' stroke='%23B8924A' stroke-width='0.5' opacity='0.4'><path d='M0 60 Q30 30 60 60 T120 60'/><path d='M0 90 Q30 60 60 90 T120 90'/></g></svg>\")",
            }}
            aria-hidden="true"
          />
          <div className="relative flex flex-col md:flex-row md:items-start gap-6">
            <BearMark size={56} className="text-ursa-gold-text shrink-0" />
            <div className="flex-1">
              <span className="font-label text-[0.7rem] tracking-[0.18em] uppercase text-ursa-gold-text-soft">
                {t("content.brand.spirit.eyebrow")}
              </span>
              <h3 className="font-display text-2xl md:text-[1.8rem] font-semibold text-ursa-cream mt-2 mb-3 leading-tight">
                {t("content.brand.spirit.headline")}
              </h3>
              <p className="text-[0.97rem] text-ursa-cream/85 leading-relaxed max-w-[68ch] mb-4">
                {t("content.brand.spirit.body")}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 font-label text-[0.66rem] tracking-[0.12em] uppercase text-ursa-cream/80 border border-ursa-gold/40 rounded-full px-2.5 py-1">
                  <Layers size={12} /> {t("content.brand.spirit.chip.bear")}
                </span>
                <span className="inline-flex items-center gap-1.5 font-label text-[0.66rem] tracking-[0.12em] uppercase text-ursa-cream/80 border border-ursa-gold/40 rounded-full px-2.5 py-1">
                  <ShieldCheck size={12} /> {t("content.brand.spirit.chip.no-rebrand")}
                </span>
                <span className="inline-flex items-center gap-1.5 font-label text-[0.66rem] tracking-[0.12em] uppercase text-ursa-cream/80 border border-ursa-gold/40 rounded-full px-2.5 py-1">
                  <FlaskConical size={12} /> {t("content.brand.spirit.chip.experiments")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ViewSection>

      {/* 9b. Brand science — empirical evidence */}
      <ViewSection
        badge={t("content.brand.science.badge")}
        title={t("content.brand.science.title")}
        meta={t("content.brand.science.meta")}
      >
        <p className="text-[1rem] leading-relaxed text-muted-foreground max-w-[68ch] mb-6">
          {t("content.brand.science.intro")}
        </p>
        <Grid cols={3}>
          {/* Distinctive assets science */}
          <Card className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Star size={18} className="text-ursa-gold-text" />
              <Pill tone="gold">{t("content.brand.science.distinctive.heading")}</Pill>
            </div>
            <p className="text-[0.86rem] text-muted-foreground m-0 leading-relaxed mb-3">
              {t("content.brand.science.distinctive.body")}
            </p>
            <div className="mt-auto space-y-3">
              <div className="pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-gold-text mb-1 flex items-center gap-1">
                  <FlaskConical size={11} /> {t("content.brand.science.distinctive.metric-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t("content.brand.science.distinctive.metric-body")}
                </p>
              </div>
              <div className="pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-forest-deep mb-1 flex items-center gap-1">
                  <BearMark size={11} className="text-ursa-dark-roast" /> {t("content.brand.science.distinctive.bear-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t("content.brand.science.distinctive.bear-body")}
                </p>
              </div>
            </div>
          </Card>

          {/* Art Nouveau as craft authenticity signal */}
          <Card className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Palette size={18} className="text-ursa-gold-text" />
              <Pill tone="forest">{t("content.brand.science.artnouv.heading")}</Pill>
            </div>
            <p className="text-[0.86rem] text-muted-foreground m-0 leading-relaxed mb-3">
              {t("content.brand.science.artnouv.body")}
            </p>
            <div className="mt-auto pt-3 border-t border-ursa-line-soft">
              <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-terracotta-text mb-1 flex items-center gap-1">
                <Sparkles size={11} /> {t("content.brand.science.artnouv.diff-label")}
              </div>
              <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                {t("content.brand.science.artnouv.diff-body")}
              </p>
            </div>
          </Card>

          {/* Brand consistency science */}
          <Card className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={18} className="text-ursa-forest-deep" />
              <Pill tone="forest">{t("content.brand.science.consistency.heading")}</Pill>
            </div>
            <p className="text-[0.86rem] text-muted-foreground m-0 leading-relaxed mb-3">
              {t("content.brand.science.consistency.body")}
            </p>
            <div className="mt-auto space-y-3">
              <div className="pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-gold-text mb-1 flex items-center gap-1">
                  <CheckCircle2 size={11} /> {t("content.brand.science.consistency.evidence-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t("content.brand.science.consistency.evidence-body")}
                </p>
              </div>
              <div className="pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-terracotta-text mb-1 flex items-center gap-1">
                  <AlertTriangle size={11} /> {t("content.brand.science.consistency.caveat-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t("content.brand.science.consistency.caveat-body")}
                </p>
              </div>
            </div>
          </Card>
        </Grid>

        <Callout tone="forest" title={t("content.brand.science.callout-title")}>
          {t("content.brand.science.callout-body")}
        </Callout>
      </ViewSection>

      {/* 10. Dossier link + onward nav */}
      <ViewSection>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <SectionBadge>{t("content.brand.section.dossier.badge")}</SectionBadge>
            <h3 className="font-display text-xl font-semibold text-ursa-dark-roast mt-3 mb-1">
              {t("content.brand.section.dossier.title")}
            </h3>
            <p className="text-[0.9rem] text-muted-foreground m-0 max-w-[58ch]">
              {t("content.brand.section.dossier.body")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <DossierLinkBanner moduleId="01-brand-audit-and-design-system" />
            <button
              onClick={() => navigate("style-guide")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ursa-dark-roast text-ursa-cream hover:bg-ursa-espresso transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
            >
              <Sparkles size={14} /> {t("content.brand.section.dossier.button")} <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <ArtNouveauDivider />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatBlock value={PALETTE.length.toString()} label={t("content.brand.stat.palette")} tone="forest" />
          <StatBlock value={TYPOGRAPHY.length.toString()} label={t("content.brand.stat.typography")} tone="gold" />
          <StatBlock value="3" label={t("content.brand.stat.evolution")} tone="terracotta" />
          <StatBlock value="Level 1" label={t("content.brand.stat.recommended")} tone="forest" />
        </div>
      </ViewSection>
    </>
  );
}
