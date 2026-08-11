"use client";

import { useState } from "react";
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
  ProgressBar,
} from "../ursa-brand";
import { PALETTE, TYPOGRAPHY } from "@/lib/ursa-data";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import {
  Copy,
  Check,
  Palette,
  Type,
  Component,
  Ruler,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  SwatchBook,
} from "lucide-react";

/** Radius tokens — visual values stay constant; the use label is translated. */
const RADIUS_TOKENS = [
  { token: "rounded-sm", value: "0.125rem", key: "sm" },
  { token: "rounded-md", value: "0.375rem", key: "md" },
  { token: "rounded-lg", value: "0.5rem", key: "lg" },
  { token: "rounded-xl", value: "0.75rem", key: "xl" },
  { token: "rounded-full", value: "9999px", key: "full" },
] as const;

const SPACING_TOKENS = [
  { token: "gap-2", value: "0.5rem", px: 8 },
  { token: "gap-3", value: "0.75rem", px: 12 },
  { token: "gap-4", value: "1rem", px: 16 },
  { token: "gap-6", value: "1.5rem", px: 24 },
  { token: "gap-8", value: "2rem", px: 32 },
  { token: "gap-12", value: "3rem", px: 48 },
];

/** Do / Don't items — structural only; text resolves via i18n. */
const DO_KEYS = [1, 2, 3, 4, 5, 6] as const;
const DONT_KEYS = [1, 2, 3, 4, 5, 6] as const;

function CopyButton({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context). Fail quietly —
      // the swatch still shows the hex for manual copy.
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={t("content.style-guide.color.copy-aria", { hex })}
      className="inline-flex items-center gap-1.5 font-label text-[0.6rem] tracking-[0.1em] uppercase px-2 py-1 rounded-md border border-ursa-line-soft bg-ursa-foam text-ursa-dark-roast hover:bg-ursa-gold hover:text-ursa-dark-roast hover:border-ursa-gold transition"
    >
      {copied ? (
        <>
          <Check size={11} /> {t("content.style-guide.color.copied-label")}
        </>
      ) : (
        <>
          <Copy size={11} /> {t("content.style-guide.color.copy-label")}
        </>
      )}
    </button>
  );
}

export function StyleGuideView() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <>
      {/* 1. Hero */}
      <ViewHero
        eyebrow={t("content.view.style-guide.eyebrow")}
        title={<>{t("content.view.style-guide.title")}</>}
        lede={<>{t("content.style-guide.hero.lede")}</>}
        meta={[
          {
            label: t("content.style-guide.hero.meta.palette"),
            value: t("content.style-guide.hero.meta.palette-value", { n: PALETTE.length }),
          },
          {
            label: t("content.style-guide.hero.meta.type"),
            value: t("content.style-guide.hero.meta.type-value", { n: TYPOGRAPHY.length }),
          },
          {
            label: t("content.style-guide.hero.meta.mode"),
            value: t("content.style-guide.hero.meta.mode-value"),
          },
        ]}
      />

      {/* 2. Color tokens — interactive swatches */}
      <ViewSection
        badge={t("content.style-guide.section.color.badge")}
        title={t("content.style-guide.section.color.title")}
        meta={t("content.style-guide.section.color.meta", { n: PALETTE.length })}
      >
        <p className="text-[1rem] leading-relaxed text-muted-foreground max-w-[68ch] mb-6">
          {t("content.style-guide.section.color.intro")}
        </p>
        <Grid cols={4}>
          {PALETTE.map((c) => (
            <Card key={c.name} className="overflow-hidden p-0">
              <div
                className="relative h-28 w-full"
                style={{ backgroundColor: c.hex }}
                aria-hidden="true"
              >
                <div className="absolute bottom-2 right-2">
                  <CopyButton hex={c.hex} />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-display text-[1rem] font-semibold text-ursa-dark-roast m-0 leading-tight">
                    {c.name}
                  </h4>
                  <span className="font-label text-[0.62rem] tracking-[0.1em] uppercase text-muted-foreground">
                    {c.hex}
                  </span>
                </div>
                <p className="text-[0.78rem] text-muted-foreground m-0 leading-snug">{c.role}</p>
              </div>
            </Card>
          ))}
        </Grid>
      </ViewSection>

      {/* 3. Typography specimens */}
      <ViewSection
        badge={t("content.style-guide.section.typography.badge")}
        title={t("content.style-guide.section.typography.title")}
        meta={t("content.style-guide.section.typography.meta")}
      >
        <Grid cols={3}>
          {TYPOGRAPHY.map((f) => (
            <Card key={f.name} className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <Pill tone="forest">{f.role.split(" · ")[0]}</Pill>
                <Type size={16} className="text-ursa-gold-text" />
              </div>
              <h4 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast mt-0 mb-3">
                {f.name}
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground block mb-1">
                    {t("content.style-guide.typography.label-display")}
                  </span>
                  <p className={`${f.className} text-[1.6rem] font-semibold text-ursa-dark-roast m-0 leading-tight`}>
                    {f.sample}
                  </p>
                </div>
                <div>
                  <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground block mb-1">
                    {t("content.style-guide.typography.label-body")}
                  </span>
                  <p className={`${f.className} text-[0.95rem] text-ursa-dark-roast/85 m-0 leading-relaxed`}>
                    {f.sample}
                  </p>
                </div>
                <div>
                  <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground block mb-1">
                    {t("content.style-guide.typography.label-label")}
                  </span>
                  <p className={`${f.className} text-[0.7rem] tracking-[0.16em] uppercase text-ursa-forest-deep m-0`}>
                    {f.sample}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </Grid>

        <ArtNouveauDivider />

        {/* Type scale demonstration */}
        <div className="bg-ursa-foam border border-ursa-line-soft rounded-xl p-6">
          <h4 className="font-label text-[0.7rem] tracking-[0.16em] uppercase text-muted-foreground mb-4">
            {t("content.style-guide.section.typography.scale-label")}
          </h4>
          <div className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground w-16 shrink-0">
                3.2rem
              </span>
              <p className="font-display text-[2rem] md:text-[2.4rem] font-semibold text-ursa-dark-roast m-0 leading-tight">
                {t("content.style-guide.section.typography.scale-line-1")}
              </p>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground w-16 shrink-0">
                1.6rem
              </span>
              <p className="font-display text-[1.4rem] md:text-[1.6rem] font-medium text-ursa-medium-roast m-0 leading-tight">
                {t("content.style-guide.section.typography.scale-line-2")}
              </p>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground w-16 shrink-0">
                1.05rem
              </span>
              <p className="font-body text-[1.05rem] text-ursa-dark-roast/85 m-0 leading-relaxed max-w-[60ch]">
                {t("content.style-guide.section.typography.scale-line-3")}
              </p>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground w-16 shrink-0">
                0.72rem
              </span>
              <p className="font-label text-[0.72rem] tracking-[0.18em] uppercase text-ursa-forest-deep m-0">
                {t("content.style-guide.section.typography.scale-line-4")}
              </p>
            </div>
          </div>

          <p className="text-[0.84rem] text-muted-foreground mt-6 mb-0 max-w-[68ch] leading-relaxed">
            {t("content.style-guide.typography.note")}
          </p>
        </div>
      </ViewSection>

      {/* 4. Component library preview */}
      <ViewSection
        badge={t("content.style-guide.section.components.badge")}
        title={t("content.style-guide.section.components.title")}
        meta={t("content.style-guide.section.components.meta")}
      >
        <div className="space-y-6">
          {/* Pills — all tones */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Component size={16} className="text-ursa-gold-text" />
              <h4 className="font-display text-[1.1rem] font-semibold text-ursa-dark-roast m-0">
                {t("content.style-guide.components.pill.heading")}
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill tone="default">{t("content.style-guide.components.pill.default")}</Pill>
              <Pill tone="ok">{t("content.style-guide.components.pill.ok")}</Pill>
              <Pill tone="warn">{t("content.style-guide.components.pill.warn")}</Pill>
              <Pill tone="stop">{t("content.style-guide.components.pill.stop")}</Pill>
              <Pill tone="forest">{t("content.style-guide.components.pill.forest")}</Pill>
              <Pill tone="gold">{t("content.style-guide.components.pill.gold")}</Pill>
            </div>
            <p className="text-[0.8rem] text-muted-foreground mt-3 m-0">
              {t("content.style-guide.components.pill.note")}
            </p>
          </Card>

          {/* EvidenceTags — all statuses */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Component size={16} className="text-ursa-gold-text" />
              <h4 className="font-display text-[1.1rem] font-semibold text-ursa-dark-roast m-0">
                {t("content.style-guide.components.evidence.heading")}
              </h4>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <EvidenceTag status="verified" />
              <EvidenceTag status="partial" />
              <EvidenceTag status="unverified" />
              <EvidenceTag status="gap" />
            </div>
            <p className="text-[0.8rem] text-muted-foreground mt-3 m-0">
              {t("content.style-guide.components.evidence.note")}
            </p>
          </Card>

          {/* Callouts — all tones */}
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <Component size={16} className="text-ursa-gold-text" />
              <h4 className="font-display text-[1.1rem] font-semibold text-ursa-dark-roast m-0">
                {t("content.style-guide.components.callout.heading")}
              </h4>
            </div>
            <Callout tone="gold" title={t("content.style-guide.components.callout.gold.title")}>
              {t("content.style-guide.components.callout.gold.body")}
            </Callout>
            <Callout tone="ok" title={t("content.style-guide.components.callout.ok.title")}>
              {t("content.style-guide.components.callout.ok.body")}
            </Callout>
            <Callout tone="warn" title={t("content.style-guide.components.callout.warn.title")}>
              {t("content.style-guide.components.callout.warn.body")}
            </Callout>
            <Callout tone="stop" title={t("content.style-guide.components.callout.stop.title")}>
              {t("content.style-guide.components.callout.stop.body")}
            </Callout>
            <Callout tone="forest" title={t("content.style-guide.components.callout.forest.title")}>
              {t("content.style-guide.components.callout.forest.body")}
            </Callout>
          </Card>

          {/* Card + StatBlock + ProgressBar */}
          <Grid cols={3}>
            <Card>
              <h4 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast mt-0 mb-2">
                {t("content.style-guide.components.card.heading-default")}
              </h4>
              <p className="text-[0.85rem] text-muted-foreground m-0">
                {t("content.style-guide.components.card.body-default")}
              </p>
            </Card>
            <Card highlight>
              <h4 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast mt-0 mb-2">
                {t("content.style-guide.components.card.heading-highlighted")}
              </h4>
              <p className="text-[0.85rem] text-muted-foreground m-0">
                {t("content.style-guide.components.card.body-highlighted")}
              </p>
            </Card>
            <Card>
              <h4 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast mt-0 mb-3">
                {t("content.style-guide.components.progress.heading")}
              </h4>
              <div className="space-y-2.5">
                <ProgressBar value={88} tone="gold" />
                <ProgressBar value={62} tone="forest" />
                <ProgressBar value={34} tone="terracotta" />
              </div>
            </Card>
          </Grid>

          {/* StatBlock row */}
          <Card>
            <h4 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast mt-0 mb-4">
              {t("content.style-guide.components.statblock.heading")}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatBlock value="4,746" label={t("content.style-guide.components.statblock.demo.1")} tone="forest" />
              <StatBlock value="S/. 20" label={t("content.style-guide.components.statblock.demo.2")} tone="gold" />
              <StatBlock value="8+" label={t("content.style-guide.components.statblock.demo.3")} tone="terracotta" />
            </div>
          </Card>

          {/* BearMark + Divider + CupGlyph */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Component size={16} className="text-ursa-gold-text" />
              <h4 className="font-display text-[1.1rem] font-semibold text-ursa-dark-roast m-0">
                {t("content.style-guide.components.bearmark.heading")}
              </h4>
            </div>
            <div className="flex flex-wrap items-center gap-6 mb-2">
              <div className="flex flex-col items-center gap-1">
                <BearMark size={24} className="text-ursa-dark-roast" />
                <span className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-muted-foreground">24</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <BearMark size={32} className="text-ursa-dark-roast" />
                <span className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-muted-foreground">32</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <BearMark size={48} className="text-ursa-dark-roast" />
                <span className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-muted-foreground">48</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <BearMark size={64} className="text-ursa-dark-roast" />
                <span className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-muted-foreground">64</span>
              </div>
              <div className="h-12 w-px bg-ursa-line-soft" />
              <CupGlyph size={32} className="text-ursa-forest-deep" />
              <CupGlyph size={40} className="text-ursa-gold-text" />
              <CupGlyph size={48} className="text-ursa-terracotta-text" />
            </div>
            <ArtNouveauDivider />
            <p className="text-[0.8rem] text-muted-foreground m-0 text-center">
              {t("content.style-guide.components.bearmark.note")}
            </p>
          </Card>
        </div>
      </ViewSection>

      {/* 5. Spacing & radius */}
      <ViewSection
        badge={t("content.style-guide.section.tokens.badge")}
        title={t("content.style-guide.section.tokens.title")}
        meta={t("content.style-guide.section.tokens.meta")}
      >
        <Grid cols={2}>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Ruler size={16} className="text-ursa-gold-text" />
              <h4 className="font-display text-[1.1rem] font-semibold text-ursa-dark-roast m-0">
                {t("content.style-guide.section.tokens.radius.heading")}
              </h4>
            </div>
            <ul className="space-y-3 m-0 p-0 list-none">
              {RADIUS_TOKENS.map((r) => (
                <li key={r.token} className="flex items-center gap-3">
                  <span
                    className={`${r.token} bg-ursa-dark-roast h-10 w-10 shrink-0 inline-block`}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <code className="text-ursa-forest-deep text-[0.82rem]">{r.token}</code>
                      <span className="font-label text-[0.6rem] tracking-[0.1em] uppercase text-muted-foreground">
                        {r.value}
                      </span>
                    </div>
                    <p className="text-[0.78rem] text-muted-foreground m-0">
                      {t(`content.style-guide.radius.${r.token}.use`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Ruler size={16} className="text-ursa-gold-text" />
              <h4 className="font-display text-[1.1rem] font-semibold text-ursa-dark-roast m-0">
                {t("content.style-guide.section.tokens.spacing.heading")}
              </h4>
            </div>
            <ul className="space-y-3 m-0 p-0 list-none">
              {SPACING_TOKENS.map((s) => (
                <li key={s.token} className="flex items-center gap-3">
                  <span
                    className="h-3 bg-ursa-gold rounded-full shrink-0"
                    style={{ width: `${Math.min(120, s.px * 2)}px` }}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <code className="text-ursa-forest-deep text-[0.82rem]">{s.token}</code>
                      <span className="font-label text-[0.6rem] tracking-[0.1em] uppercase text-muted-foreground">
                        {s.value}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </Grid>

        <p className="text-[0.84rem] text-muted-foreground mt-6 mb-0 max-w-[68ch] leading-relaxed">
          {t("content.style-guide.section.tokens.note")}
        </p>
      </ViewSection>

      {/* 6. Bear mark variants */}
      <ViewSection
        badge={t("content.style-guide.section.bearmark.badge")}
        title={t("content.style-guide.section.bearmark.title")}
        meta={t("content.style-guide.section.bearmark.meta")}
      >
        <Grid cols={2}>
          {/* On cream */}
          <Card className="bg-ursa-cream">
            <div className="flex items-center justify-between mb-4">
              <Pill tone="forest">{t("content.style-guide.section.bearmark.cream.pill")}</Pill>
              <span className="font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
                {t("content.style-guide.section.bearmark.cream.label")}
              </span>
            </div>
            <div className="flex flex-wrap items-end gap-6">
              <div className="flex flex-col items-center gap-1.5">
                <BearMark size={24} className="text-ursa-dark-roast" />
                <span className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-muted-foreground">24 · dark-roast</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <BearMark size={32} className="text-ursa-dark-roast" />
                <span className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-muted-foreground">32 · dark-roast</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <BearMark size={48} className="text-ursa-forest-deep" />
                <span className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-muted-foreground">48 · forest-deep</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <BearMark size={64} className="text-ursa-forest-deep" />
                <span className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-muted-foreground">64 · forest-deep</span>
              </div>
            </div>
          </Card>

          {/* On dark */}
          <Card className="bg-ursa-espresso border-ursa-espresso">
            <div className="flex items-center justify-between mb-4">
              <Pill tone="gold">{t("content.style-guide.section.bearmark.dark.pill")}</Pill>
              <span className="font-label text-[0.6rem] tracking-[0.12em] uppercase text-ursa-cream/70">
                {t("content.style-guide.section.bearmark.dark.label")}
              </span>
            </div>
            <div className="flex flex-wrap items-end gap-6">
              <div className="flex flex-col items-center gap-1.5">
                <BearMark size={24} className="text-ursa-gold-text" />
                <span className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-ursa-cream/70">24 · gold</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <BearMark size={32} className="text-ursa-gold-text" />
                <span className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-ursa-cream/70">32 · gold</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <BearMark size={48} className="text-ursa-cream" />
                <span className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-ursa-cream/70">48 · cream</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <BearMark size={64} className="text-ursa-cream" />
                <span className="font-label text-[0.58rem] tracking-[0.12em] uppercase text-ursa-cream/70">64 · cream</span>
              </div>
            </div>
          </Card>
        </Grid>

        <Callout tone="forest" title={t("content.style-guide.section.bearmark.callout.title")}>
          {t("content.style-guide.section.bearmark.callout.body")}
        </Callout>
      </ViewSection>

      {/* 7. Usage do's and don'ts */}
      <ViewSection
        badge={t("content.style-guide.section.guardrails.badge")}
        title={t("content.style-guide.section.guardrails.title")}
        meta={t("content.style-guide.section.guardrails.meta")}
      >
        <Grid cols={2}>
          <Card className="border-ursa-forest-deep/30">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} className="text-ursa-forest-deep" />
              <h4 className="font-display text-[1.15rem] font-semibold text-ursa-dark-roast m-0">
                {t("content.style-guide.section.guardrails.do.heading")}
              </h4>
            </div>
            <ul className="space-y-2.5 m-0 p-0 list-none">
              {DO_KEYS.map((i) => (
                <li key={i} className="text-[0.88rem] text-ursa-dark-roast/85 leading-relaxed flex gap-2">
                  <CheckCircle2 size={14} className="text-ursa-forest-deep mt-0.5 shrink-0" />
                  <span>{t(`content.style-guide.section.guardrails.do.${i}`)}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="border-ursa-terracotta/30">
            <div className="flex items-center gap-2 mb-4">
              <XCircle size={18} className="text-ursa-terracotta-text" />
              <h4 className="font-display text-[1.15rem] font-semibold text-ursa-dark-roast m-0">
                {t("content.style-guide.section.guardrails.dont.heading")}
              </h4>
            </div>
            <ul className="space-y-2.5 m-0 p-0 list-none">
              {DONT_KEYS.map((i) => (
                <li key={i} className="text-[0.88rem] text-ursa-dark-roast/85 leading-relaxed flex gap-2">
                  <XCircle size={14} className="text-ursa-terracotta-text mt-0.5 shrink-0" />
                  <span>{t(`content.style-guide.section.guardrails.dont.${i}`)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </Grid>
      </ViewSection>

      {/* Footer / onward nav */}
      <ViewSection>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <SectionBadge>{t("content.style-guide.section.crossref.badge")}</SectionBadge>
            <h3 className="font-display text-xl font-semibold text-ursa-dark-roast mt-3 mb-1">
              {t("content.style-guide.section.crossref.title")}
            </h3>
            <p className="text-[0.9rem] text-muted-foreground m-0 max-w-[58ch]">
              {t("content.style-guide.section.crossref.body")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <DossierLinkBanner moduleId="01-brand-audit-and-design-system" />
            <button
              onClick={() => navigate("brand")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ursa-dark-roast text-ursa-cream hover:bg-ursa-espresso transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
            >
              <SwatchBook size={14} /> {t("content.style-guide.section.crossref.button")} <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <ArtNouveauDivider />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatBlock
            value={PALETTE.length.toString()}
            label={t("content.style-guide.section.crossref.stat.1")}
            tone="forest"
          />
          <StatBlock
            value={TYPOGRAPHY.length.toString()}
            label={t("content.style-guide.section.crossref.stat.2")}
            tone="gold"
          />
          <StatBlock value="4" label={t("content.style-guide.section.crossref.stat.3")} tone="terracotta" />
          <StatBlock value="12" label={t("content.style-guide.section.crossref.stat.4")} tone="forest" />
        </div>

        <div className="mt-6 flex items-center gap-3 text-muted-foreground">
          <Palette size={14} className="text-ursa-gold-text" />
          <Sparkles size={14} className="text-ursa-gold-text" />
          <span className="font-label text-[0.7rem] tracking-[0.14em] uppercase">
            {t("content.style-guide.section.crossref.snapshot")}
          </span>
        </div>
      </ViewSection>
    </>
  );
}
