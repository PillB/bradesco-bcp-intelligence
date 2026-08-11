"use client";

import { ViewHero, ViewSection, Card, Grid, Reveal } from "../view-shell";
import { BearMark, CupGlyph, ArtNouveauDivider, Pill, StatBlock, Callout, EvidenceTag, SectionBadge } from "../ursa-brand";
import { BearScoreWidget } from "../bear-score-widget";
import { DayInTheLifeWidget } from "../day-in-life-widget";
import { URSA_FACTS, VERIFIED_BEVERAGES, VERIFIED_FOOD, BUDGET_SCENARIOS } from "@/lib/ursa-data";
import { ROUTES, useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import { ArrowRight, MapPin, Clock, Coffee, Star, Sparkles, Calculator, ExternalLink, Flame, Compass, Utensils, Swords, Calendar, FlaskConical, SwatchBook, Wallet, Globe, TrendingUp, Wand2, Shield, Grid2x2, Activity, Award, CreditCard, Instagram, BadgeCheck, Eye, Search, Lightbulb, MousePointerClick, Repeat, BookOpen } from "lucide-react";

export function DashboardView() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const dossierModules = [
    { key: "brand", num: "01" },
    { key: "market", num: "02" },
    { key: "menu", num: "03" },
    { key: "growth", num: "04" },
    { key: "viral", num: "05" },
    { key: "creative", num: "06" },
    { key: "roadmap", num: "07" },
  ];

  const tools = [
    { key: "calculator", num: "08", featured: true, icon: Calculator },
    { key: "menu-studio", num: "T1", icon: Utensils },
    { key: "competitors", num: "T2", icon: Swords },
    { key: "content-calendar", num: "T3", icon: Calendar },
    { key: "experiments", num: "T4", icon: FlaskConical },
    { key: "style-guide", num: "T5", icon: SwatchBook },
    { key: "budget", num: "T6", icon: Wallet },
    { key: "origin-atlas", num: "T7", icon: Globe },
    { key: "roi", num: "T8", icon: TrendingUp },
    { key: "campaign-builder", num: "T9", icon: Wand2 },
    { key: "spirit-checker", num: "T10", icon: Shield },
    { key: "swot", num: "T11", icon: Grid2x2 },
    { key: "pilot", num: "T12", icon: Activity },
    { key: "scorecard", num: "T13", icon: Award, featured: false },
    { key: "loyalty", num: "T14", icon: CreditCard, featured: false },
  ];

  // Conversion pathway stages (CONVERSION-3) — Awareness → Interest →
  // Decision → Action → Retention. Each stage carries its tactic, the
  // Ursa touchpoint where it lands, and the science backing the tactic.
  // Cites the AISAS model (Dentsu 2005) and AIDA (Lewis 1898).
  const PATHWAY_STAGES = [
    { id: "awareness", icon: Eye, tone: "var(--color-ursa-gold-text)" },
    { id: "interest", icon: Search, tone: "var(--color-ursa-forest)" },
    { id: "decision", icon: Lightbulb, tone: "var(--color-ursa-forest-deep)" },
    { id: "action", icon: MousePointerClick, tone: "var(--color-ursa-terracotta-text)" },
    { id: "retention", icon: Repeat, tone: "var(--color-ursa-gold-text)" },
  ] as const;

  // --- Proof & credibility entries (CONVERSION-1) -----------------------
  // Six verifiable trust signals — each paired with a behavioral-science
  // citation explaining why it converts. The landing page (Ursa Mañana)
  // deploys the same six signals in its Trust & proof section; the dashboard
  // records them as the baseline the strategic plan must protect.
  const PROOF_ENTRIES = [
    { id: "cam", icon: Award },
    { id: "google", icon: Star },
    { id: "aeropress", icon: Coffee },
    { id: "instagram", icon: Instagram },
    { id: "coffeepass", icon: BadgeCheck },
    { id: "cornerinc", icon: MapPin },
  ];

  return (
    <>
      <ViewHero
        eyebrow={t("content.dashboard.eyebrow")}
        title={<>{t("content.dashboard.title")}</>}
        lede={<>{t("content.dashboard.lede")}</>}
        meta={[
          { label: t("common.subject"), value: "Alcanfores 183, Miraflores" },
          { label: t("common.scope"), value: "90-day launch + 12-month roadmap" },
          { label: t("common.currency"), value: "PEN (S/.)" },
          { label: t("common.report"), value: t("common.english-report") },
          { label: t("common.campaign-copy"), value: t("common.spanish-peru") },
        ]}
      />

      {/* Quick facts + spirit preservation */}
      <ViewSection>
        <Grid cols={2}>
          <div className="flex flex-col gap-4">
            <SectionBadge>{t("badges.read-me-first")}</SectionBadge>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-ursa-dark-roast mt-0 mb-3">
              {t("content.dashboard.section.how-to-use")}
            </h2>
            <p className="text-[0.97rem] leading-relaxed text-foreground/85 mb-0">
              {t("content.dashboard.how-to-use.p1")}
            </p>
            <p className="text-[0.97rem] leading-relaxed text-muted-foreground mb-0">
              {t("content.dashboard.how-to-use.p2")}
            </p>
            <Callout tone="forest" title={t("content.dashboard.how-to-use.callout-title")}>
              {t("content.dashboard.how-to-use.callout")}
            </Callout>
          </div>
          <div className="flex flex-col gap-4">
            <Card className="bg-ursa-foam">
              <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-3 flex items-center gap-2">
                <BearMark size={22} className="text-ursa-dark-roast" /> {t("common.verified-at-snapshot")}
              </h3>
              <ul className="space-y-1.5 text-[0.9rem] m-0 p-0 list-none">
                <FactRow label={t("common.address")} value={URSA_FACTS.address} />
                <FactRow label={t("common.hours")} value={URSA_FACTS.hours} />
                <FactRow label={t("common.tagline")} value={`"${URSA_FACTS.tagline}"`} />
                <FactRow label={t("common.instagram")} value={`${URSA_FACTS.instagram} · ${URSA_FACTS.followers} followers · ${URSA_FACTS.posts} posts`} />
                <FactRow label={t("common.layout")} value={URSA_FACTS.twoBars} />
                <FactRow label={t("common.delivery")} value={URSA_FACTS.delivery} />
                <FactRow label={t("common.membership")} value={URSA_FACTS.membership} />
              </ul>
              <p className="font-label text-[0.72rem] tracking-[0.06em] text-muted-foreground mt-3 mb-0">
                {t("common.snapshot")} {URSA_FACTS.snapshot} · <button onClick={() => navigate("sources")} data-analytics="tool_open" data-analytics-tool="sources" className="text-ursa-forest-deep underline hover:text-ursa-dark-roast">{t("common.see-sources")}</button>
              </p>
            </Card>
            <Callout tone="warn" title={t("content.dashboard.disambiguation-title")}>
              {t("content.dashboard.disambiguation")}
            </Callout>
          </div>
        </Grid>
      </ViewSection>

      {/* Proof & credibility — public evidence + behavioral-science backing (CONVERSION-1) */}
      <ViewSection badge={t("content.dashboard.proof.badge")} title={t("content.dashboard.proof.title")} meta={t("content.dashboard.meta.proof")}>
        <p className="text-[0.95rem] text-muted-foreground max-w-[78ch] mb-6 m-0">
          {t("content.dashboard.proof.lede")}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 [grid-template-columns:minmax(0,1fr)]">
          {PROOF_ENTRIES.map((entry) => {
            const Icon = entry.icon;
            return (
              <Card key={entry.id} className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-9 h-9 rounded-md bg-ursa-gold/15 text-ursa-gold-text grid place-items-center shrink-0">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-label text-[0.56rem] tracking-[0.14em] uppercase text-muted-foreground m-0">
                      {t(`content.dashboard.proof.${entry.id}.label`)}
                    </p>
                  </div>
                  <EvidenceTag status="verified" />
                </div>
                <p className="text-[0.92rem] text-ursa-dark-roast font-medium m-0 mb-2.5 leading-snug">
                  {t(`content.dashboard.proof.${entry.id}.value`)}
                </p>
                <div className="border-l-2 border-ursa-gold/40 pl-3 py-1 mt-auto">
                  <p className="text-[0.76rem] italic text-ursa-dark-roast m-0 leading-snug">
                    {t(`content.dashboard.proof.${entry.id}.citation`)}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
        <Callout tone="forest" title={t("content.dashboard.proof.callout.title")}>
          <p className="m-0 text-[0.92rem]">{t("content.dashboard.proof.callout.body")}</p>
        </Callout>
      </ViewSection>

      {/* Verified signature drinks */}
      <ViewSection badge={t("badges.verified-menu")} title={t("content.dashboard.section.signature")} meta={t("content.dashboard.meta.signature")}>
        <Grid cols={2}>
          <Card>
            <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-3 flex items-center gap-2">
              <Coffee size={18} className="text-ursa-gold" /> {t("content.dashboard.verified.beverages")}
            </h3>
            <ul className="space-y-2 m-0 p-0 list-none">
              {VERIFIED_BEVERAGES.map((b) => (
                <li key={b.name} className="flex items-start gap-2">
                  <EvidenceTag status={b.status} />
                  <div>
                    <p className="font-display font-semibold text-ursa-dark-roast m-0 leading-tight">{b.name}</p>
                    <p className="text-[0.85rem] text-muted-foreground m-0">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-3 flex items-center gap-2">
              <Flame size={18} className="text-ursa-terracotta" /> {t("content.dashboard.verified.food")}
            </h3>
            <ul className="space-y-2 m-0 p-0 list-none">
              {VERIFIED_FOOD.map((b) => (
                <li key={b.name} className="flex items-start gap-2">
                  <EvidenceTag status={b.status} />
                  <div>
                    <p className="font-display font-semibold text-ursa-dark-roast m-0 leading-tight">{b.name}</p>
                    <p className="text-[0.85rem] text-muted-foreground m-0">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-[0.82rem] text-muted-foreground mt-3 mb-0 italic">
              {t("content.dashboard.verified.menu-footnote")}
            </p>
          </Card>
        </Grid>
      </ViewSection>

      {/* Bear Score — brand-health widget */}
      <ViewSection badge={t("badges.brand-health")} title={t("content.dashboard.section.bear-score")} meta={t("content.dashboard.meta.bear-score")}>
        <BearScoreWidget />
      </ViewSection>

      {/* Dossier modules */}
      <ViewSection badge={t("badges.modules")} title={t("content.dashboard.section.modules")}>
        <Grid cols={4}>
          {dossierModules.map((m, i) => (
            <Card key={m.key} className={`cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:border-ursa-gold/50 hover:shadow-md stagger-${(i % 6) + 1}`}>
              <button
                onClick={() => navigate(m.key)}
                data-analytics="tool_open"
                data-analytics-tool={m.key}
                aria-label={`${t("content.dashboard.module." + m.key + ".title")} — open module ${m.num}`}
                className="text-left w-full h-full flex flex-col"
              >
                <Pill tone="forest">{t("common.module")} {m.num}</Pill>
                <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-1.5 flex items-center gap-1.5">
                  {t(`content.dashboard.module.${m.key}.title`)}
                  <ArrowRight size={15} className="text-ursa-gold-text opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-[0.85rem] text-muted-foreground m-0">{t(`content.dashboard.module.${m.key}.desc`)}</p>
              </button>
            </Card>
          ))}
        </Grid>
      </ViewSection>

      {/* Tools — the extra innovative pages */}
      <ViewSection badge={t("badges.interactive-tools")} title={t("content.dashboard.section.tools")} meta={t("content.dashboard.meta.tools")}>
        <Grid cols={4}>
          {tools.map((tool, toolIdx) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.key} highlight={tool.featured} className={`cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:border-ursa-gold/50 hover:shadow-md stagger-${(toolIdx % 6) + 1}`}>
                <button
                  onClick={() => navigate(tool.key)}
                  data-analytics="tool_open"
                  data-analytics-tool={tool.key}
                  aria-label={`${t("content.dashboard.tool." + tool.key + ".title")} — open interactive tool`}
                  className="text-left w-full h-full flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`w-10 h-10 rounded-lg grid place-items-center shrink-0 transition group-hover:scale-110 ${tool.featured ? "bg-ursa-gold/20 text-ursa-gold" : "bg-ursa-forest-deep/10 text-ursa-forest-deep"}`}>
                      <Icon size={20} />
                    </span>
                    <Pill tone={tool.featured ? "gold" : "forest"}>{tool.featured ? `${t("common.module")} 08` : `${t("common.extra")} · ${tool.num}`}</Pill>
                  </div>
                  <h3 className="font-display text-[0.98rem] font-semibold text-ursa-dark-roast mt-0 mb-1.5 flex items-center gap-1.5 leading-tight">
                    {t(`content.dashboard.tool.${tool.key}.title`)}
                    <ArrowRight size={14} className="text-ursa-gold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                  </h3>
                  <p className="text-[0.8rem] text-muted-foreground m-0 leading-relaxed">{t(`content.dashboard.tool.${tool.key}.desc`)}</p>
                </button>
              </Card>
            );
          })}
        </Grid>
      </ViewSection>

      {/* Headlines */}
      <ViewSection badge={t("badges.headlines")} title={t("content.dashboard.section.headlines")}>
        <Grid cols={3}>
          <Reveal delay={0}><Card>
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2">{t("content.dashboard.h1.title")}</h3>
            <p className="text-[0.9rem] text-muted-foreground m-0">{t("content.dashboard.h1.body")}</p>
          </Card></Reveal>
          <Reveal delay={80}><Card>
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2">{t("content.dashboard.h2.title")}</h3>
            <p className="text-[0.9rem] text-muted-foreground m-0">{t("content.dashboard.h2.body")}</p>
          </Card></Reveal>
          <Reveal delay={160}><Card>
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2">{t("content.dashboard.h3.title")}</h3>
            <p className="text-[0.9rem] text-muted-foreground m-0">{t("content.dashboard.h3.body")}</p>
          </Card></Reveal>
          <Reveal delay={0}><Card>
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2">{t("content.dashboard.h4.title")}</h3>
            <p className="text-[0.9rem] text-muted-foreground m-0">{t("content.dashboard.h4.body")}</p>
          </Card></Reveal>
          <Reveal delay={80}><Card>
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2">{t("content.dashboard.h5.title")}</h3>
            <p className="text-[0.9rem] text-muted-foreground m-0">{t("content.dashboard.h5.body")}</p>
          </Card></Reveal>
          <Reveal delay={160}><Card>
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2">{t("content.dashboard.h6.title")}</h3>
            <p className="text-[0.9rem] text-muted-foreground m-0">{t("content.dashboard.h6.body", { lean: BUDGET_SCENARIOS[0].monthlyPEN.toLocaleString(), moderate: BUDGET_SCENARIOS[1].monthlyPEN.toLocaleString(), growth: BUDGET_SCENARIOS[2].monthlyPEN.toLocaleString() })}</p>
          </Card></Reveal>
          <Reveal delay={0}><Card highlight>
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-1.5">
              <Calculator size={16} className="text-ursa-gold" /> {t("content.dashboard.h7.title")}
            </h3>
            <p className="text-[0.9rem] text-muted-foreground m-0">{t("content.dashboard.h7.body-start")} <strong>S/. 35.60/subscriber/month</strong> {t("content.dashboard.h7.body-end")}</p>
            <button onClick={() => navigate("calculator")} data-analytics="tool_open" data-analytics-tool="calculator" className="mt-3 inline-flex items-center gap-1.5 font-label text-[0.72rem] tracking-[0.12em] uppercase text-ursa-gold hover:text-ursa-dark-roast transition">
              {t("actions.open-calculator")} <ArrowRight size={14} />
            </button>
          </Card></Reveal>
          <Reveal delay={80}><Card>
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2">{t("content.dashboard.h8.title")}</h3>
            <p className="text-[0.9rem] text-muted-foreground m-0">{t("content.dashboard.h8.body")}</p>
          </Card></Reveal>
          <Reveal delay={160}><Card>
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2">{t("content.dashboard.h9.title")}</h3>
            <p className="text-[0.9rem] text-muted-foreground m-0">{t("content.dashboard.h9.body")}</p>
          </Card></Reveal>
          <Reveal delay={0}><Card highlight>
            <div className="flex items-center gap-2 mb-2">
              <Pill tone="gold">{t("content.dashboard.h10.badge")}</Pill>
            </div>
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-1.5">
              <ArrowRight size={16} className="text-ursa-gold-text" /> {t("content.dashboard.h10.title")}
            </h3>
            <p className="text-[0.9rem] text-muted-foreground m-0">{t("content.dashboard.h10.body")}</p>
          </Card></Reveal>
        </Grid>
      </ViewSection>

      {/* Day in the Life — new interactive feature */}
      <ViewSection badge={t("badges.rhythm")} title={t("content.dashboard.section.day-in-life")} meta={t("content.dashboard.meta.day-in-life")}>
        <DayInTheLifeWidget />
      </ViewSection>

      {/* Conversion pathway (CONVERSION-3) -------------------------------
          A five-stage horizontal flow showing how a stranger becomes a
          regular. Each stage carries the tactic, the Ursa touchpoint, and
          the science backing it. Cites AISAS (Dentsu 2005) and AIDA (Lewis
          1898). */}
      <ViewSection badge={t("content.dashboard.pathway.badge")} title={t("content.dashboard.pathway.title")} meta={t("content.dashboard.pathway.meta")}>
        <p className="text-[0.95rem] text-muted-foreground max-w-[78ch] mb-6 m-0 leading-relaxed">
          {t("content.dashboard.pathway.lede")}
        </p>

        {/* Horizontal scroll on mobile, full row on desktop */}
        <div className="overflow-x-auto ursa-scroll pb-2 mb-6">
          <div className="flex items-stretch gap-0 min-w-[920px]">
            {PATHWAY_STAGES.map((stage, i) => {
              const Icon = stage.icon;
              const sKey = (field: string) => `content.dashboard.pathway.stage.${stage.id}.${field}`;
              return (
                <div key={stage.id} className="flex items-stretch flex-1">
                  {/* Using a div (not Card) because Card does not accept a
                      `style` prop and we need the stage-accent border color
                      driven by the inline `tone` value. The className mirrors
                      Card's base look. */}
                  <div
                    className="flex-1 flex flex-col p-4 bg-card border rounded-xl overflow-hidden shadow-[0_1px_0_rgba(59,36,23,0.06),0_8px_24px_-12px_rgba(59,36,23,0.18)] ursa-card-hover"
                    style={{ borderColor: stage.tone, borderTopWidth: "2px" }}
                  >
                    {/* Stage number + icon */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-9 h-9 rounded-full grid place-items-center shrink-0" style={{ background: `${stage.tone}18`, color: stage.tone }}>
                        <Icon size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="font-label text-[0.56rem] tracking-[0.14em] uppercase text-muted-foreground m-0">{t("content.dashboard.pathway.label.stage")} {i + 1}</p>
                        <p className="font-display text-base font-semibold text-ursa-dark-roast m-0 leading-tight">{t(sKey("name"))}</p>
                      </div>
                    </div>

                    {/* Tactic */}
                    <div className="mb-3">
                      <p className="font-label text-[0.56rem] tracking-[0.12em] uppercase text-ursa-gold-text m-0 mb-1">{t("content.dashboard.pathway.label.tactic")}</p>
                      <p className="text-[0.82rem] text-foreground/85 m-0 leading-snug">{t(sKey("tactic"))}</p>
                    </div>

                    {/* Touchpoint */}
                    <div className="mb-3">
                      <p className="font-label text-[0.56rem] tracking-[0.12em] uppercase text-ursa-forest-deep m-0 mb-1">{t("content.dashboard.pathway.label.touchpoint")}</p>
                      <p className="text-[0.8rem] text-muted-foreground m-0 leading-snug">{t(sKey("touchpoint"))}</p>
                    </div>

                    {/* Science citation — pinned to bottom */}
                    <div className="mt-auto pt-3 border-t border-ursa-line-soft">
                      <p className="font-label text-[0.56rem] tracking-[0.12em] uppercase text-ursa-terracotta-text m-0 mb-1 flex items-center gap-1">
                        <BookOpen size={10} /> {t("content.dashboard.pathway.label.science")}
                      </p>
                      <p className="text-[0.78rem] italic text-ursa-dark-roast m-0 leading-snug">{t(sKey("science"))}</p>
                    </div>
                  </div>
                  {i < PATHWAY_STAGES.length - 1 && (
                    <div className="flex items-center justify-center w-8 text-ursa-gold-text" aria-hidden="true">
                      <ArrowRight size={18} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="font-label text-[0.62rem] tracking-[0.1em] uppercase text-muted-foreground mb-6 m-0 italic">
          {t("content.dashboard.pathway.source")}
        </p>

        <Callout tone="forest" title={t("content.dashboard.pathway.callout.title")}>
          <p className="m-0 text-[0.9rem]">{t("content.dashboard.pathway.callout.body")}</p>
        </Callout>
      </ViewSection>

      {/* Quick stats */}
      <ViewSection badge={t("badges.by-the-numbers")} title={t("content.dashboard.section.figures")}>
        <Card className="bg-gradient-to-br from-ursa-paper to-ursa-cream">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-ursa-line-soft">
            <div className="px-2 md:px-4 first:pl-0">
              <StatBlock value="26" label={t("content.dashboard.stat.concepts")} tone="forest" />
            </div>
            <div className="px-2 md:px-4">
              <StatBlock value="11" label={t("content.dashboard.stat.experiments")} tone="gold" />
            </div>
            <div className="px-2 md:px-4">
              <StatBlock value="S/.20" label={t("content.dashboard.stat.subscription")} tone="terracotta" />
            </div>
            <div className="px-2 md:px-4 last:pr-0">
              <StatBlock value="8+" label={t("content.dashboard.stat.hotels")} tone="forest" />
            </div>
          </div>
        </Card>
        <ArtNouveauDivider />
      </ViewSection>

      {/* Open questions */}
      <ViewSection badge={t("badges.open-questions")} title={t("content.dashboard.section.clarification")}>
        <p className="text-[1.05rem] text-muted-foreground max-w-[62ch] mb-6">
          {t("content.dashboard.open-questions.lede")}
        </p>
        <Grid cols={2}>
          <Card>
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-3 flex items-center gap-2">
              <Compass size={16} className="text-ursa-forest-deep" /> {t("common.operational-data")}
            </h3>
            <ul className="space-y-1.5 text-[0.9rem] m-0 p-0 list-none">
              <li>{t("content.dashboard.q.operational.1")}</li>
              <li>{t("content.dashboard.q.operational.2")}</li>
              <li>{t("content.dashboard.q.operational.3")}</li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-3 flex items-center gap-2">
              <Star size={16} className="text-ursa-gold" /> {t("common.audience-assets")}
            </h3>
            <ul className="space-y-1.5 text-[0.9rem] m-0 p-0 list-none">
              <li>{t("content.dashboard.q.audience.1")}</li>
              <li>{t("content.dashboard.q.audience.2")}</li>
              <li>{t("content.dashboard.q.audience.3")}</li>
            </ul>
          </Card>
        </Grid>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/dossier/index.html" target="_blank" rel="noopener noreferrer" data-analytics="cta_click" data-analytics-target="dashboard_open_static_html" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ursa-gold-soft/40 text-ursa-forest-deep hover:bg-ursa-gold hover:text-ursa-dark-roast transition font-label text-[0.74rem] tracking-[0.1em] uppercase">
            <ExternalLink size={14} /> {t("actions.open-static-html")}
          </a>
          <button onClick={() => navigate("roadmap")} data-analytics="tool_open" data-analytics-tool="roadmap" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ursa-forest-deep text-ursa-cream hover:bg-ursa-dark-roast transition font-label text-[0.74rem] tracking-[0.1em] uppercase">
            <MapPin size={14} /> {t("actions.see-roadmap")}
          </button>
          <button onClick={() => navigate("calculator")} data-analytics="tool_open" data-analytics-tool="calculator" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ursa-gold text-ursa-dark-roast hover:bg-ursa-gold-soft transition font-label text-[0.74rem] tracking-[0.1em] uppercase">
            <Calculator size={14} /> {t("actions.try-calculator")}
          </button>
        </div>
      </ViewSection>
    </>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
      <span className="font-label text-[0.66rem] tracking-[0.12em] uppercase text-muted-foreground shrink-0 sm:w-24">{label}</span>
      <span className="text-ursa-dark-roast font-medium">{value}</span>
    </li>
  );
}
