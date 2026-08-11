"use client";

import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import {
  Pill,
  Callout,
  StatBlock,
  EvidenceTag,
  SectionBadge,
  BearMark,
  ArtNouveauDivider,
} from "../ursa-brand";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Coffee,
  Snowflake,
  Droplet,
  Croissant,
  Sandwich,
  Gift,
  Sparkles,
  Clock,
  TrendingUp,
  FlaskConical,
  CircleSlash,
  CheckCircle2,
  ArrowRight,
  Target,
  Users,
  Search,
  ClipboardCheck,
} from "lucide-react";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import { URSA_FACTS, VERIFIED_BEVERAGES, VERIFIED_FOOD } from "@/lib/ursa-data";

// ---------------------------------------------------------------
// Reconstructed current menu — modelled on the .ursa-menu design
// (double border, centered crest, dotted leaders, label-font prices).
// Verified items come from VERIFIED_BEVERAGES / VERIFIED_FOOD.
// Standard espresso-bar items are reconstructed from the Rappi
// delivery snapshot (2026-08-01). Prices marked * are inferred
// from category positioning and should be confirmed at the bar.
// ---------------------------------------------------------------

type MenuItem = {
  name: string;
  price: string;
  note?: string;
  verified?: boolean;
  signature?: boolean;
};

type MenuSection = {
  id: string;
  label: string;
  items: MenuItem[];
};

const CURRENT_MENU_SECTIONS: MenuSection[] = [
  {
    id: "espresso",
    label: "Barra Espresso",
    items: [
      { name: "Espresso", price: "S/. 6" },
      { name: "Cortado", price: "S/. 8" },
      { name: "Americano", price: "S/. 8" },
      { name: "Flat White", price: "S/. 10" },
      { name: "Capuccino", price: "S/. 10" },
      { name: "Latte", price: "S/. 11" },
      { name: "Mocha", price: "S/. 12" },
      { name: "Black Label", price: "S/. 14", note: "Rotando · micro-lote de la semana" },
      {
        name: "Ursagroni",
        price: "S/. 18",
        note: "Espresso · bitter · cítrico · la bebida más fotografiada",
        verified: true,
        signature: true,
      },
    ],
  },
  {
    id: "coldbrew",
    label: "Barra Coldbrew",
    items: [
      { name: "Coldbrew", price: "S/. 10" },
      { name: "Coldbrew Tonic", price: "S/. 13" },
      {
        name: "Durazno Clarificado",
        price: "S/. 14",
        note: "Durazno · cold brew clarificado",
        verified: true,
        signature: true,
      },
      {
        name: "Maracumango",
        price: "S/. 14",
        note: "Maracuyá · mango · verano permanente",
        verified: true,
        signature: true,
      },
    ],
  },
  {
    id: "filtrados",
    label: "Filtrados",
    items: [
      { name: "Filtrado de la Casa", price: "S/. 8", note: "Rotando diario" },
      { name: "V60", price: "S/. 12" },
      { name: "Chemex (para dos)", price: "S/. 22" },
      {
        name: "Filtrado Lonya",
        price: "S/. 14 *",
        note: "Utcubamba, Amazonas · 1,750m · Bourbon lavado",
        verified: true,
        signature: true,
      },
    ],
  },
  {
    id: "pastries",
    label: "Pastelería",
    items: [
      { name: "House-made Cookie", price: "S/. 5 *", verified: true },
      { name: "Financier de Pera", price: "S/. 6 *", verified: true, signature: true },
    ],
  },
  {
    id: "savory",
    label: "Salado",
    items: [
      {
        name: "Empanada de Carne con Bechamel",
        price: "S/. 12 *",
        note: "Verificado en post de Instagram acompañando el Ursagroni",
        verified: true,
        signature: true,
      },
    ],
  },
];

// ---------------------------------------------------------------
// New product proposals — locally authored, evaluated against the
// 16-criteria framework. Each proposal shows the six most
// decision-critical criteria as visible rows; the remaining ten are
// summarised in chips.
// ---------------------------------------------------------------

type Proposal = {
  id: string;
  category:
    | "Signature coffee"
    | "Cold coffee"
    | "Seasonal"
    | "Non-coffee"
    | "Pastries"
    | "Retail beans"
    | "Experiences";
  pricingLean: number;
  pricingModerate: number;
  pricingGrowth: number;
};

// Text content (name, spanish, concept, why, need, evidence, brand-fit, taste,
// prep, margin, operational-test, market-test, stop-rule, pricing-rationale)
// is resolved via t(`content.menu.section.02.proposal.${id}.${field}`) so every
// string lives in i18n.ts with a hand-crafted Spanish equivalent.
const PROPOSALS: Proposal[] = [
  { id: "P-01", category: "Signature coffee", pricingLean: 9, pricingModerate: 11, pricingGrowth: 13 },
  { id: "P-02", category: "Signature coffee", pricingLean: 9, pricingModerate: 11, pricingGrowth: 12 },
  { id: "P-03", category: "Cold coffee", pricingLean: 13, pricingModerate: 15, pricingGrowth: 16 },
  { id: "P-04", category: "Cold coffee", pricingLean: 14, pricingModerate: 16, pricingGrowth: 18 },
  { id: "P-05", category: "Seasonal", pricingLean: 22, pricingModerate: 26, pricingGrowth: 30 },
  { id: "P-06", category: "Seasonal", pricingLean: 12, pricingModerate: 14, pricingGrowth: 16 },
  { id: "P-07", category: "Non-coffee", pricingLean: 12, pricingModerate: 14, pricingGrowth: 16 },
  { id: "P-08", category: "Non-coffee", pricingLean: 8, pricingModerate: 9, pricingGrowth: 11 },
  { id: "P-09", category: "Pastries", pricingLean: 8, pricingModerate: 10, pricingGrowth: 11 },
  { id: "P-10", category: "Pastries", pricingLean: 6, pricingModerate: 8, pricingGrowth: 9 },
  { id: "P-11", category: "Retail beans", pricingLean: 38, pricingModerate: 45, pricingGrowth: 52 },
  { id: "P-12", category: "Experiences", pricingLean: 38, pricingModerate: 45, pricingGrowth: 55 },
  { id: "P-13", category: "Experiences", pricingLean: 85, pricingModerate: 110, pricingGrowth: 140 },
];

// ---------------------------------------------------------------
// 16-criteria evaluation framework — name + description are resolved
// via t(`content.menu.section.04.criterion.${n}.name` / `.desc`) so both
// languages stay in i18n.ts.
// ---------------------------------------------------------------

const EVALUATION_CRITERIA = Array.from({ length: 16 }, (_, i) => ({ n: i + 1 }));

const PROPOSAL_CATEGORY_KEY: Record<
  Proposal["category"],
  { icon: React.ReactNode; tone: "gold" | "forest" | "terracotta"; key: string }
> = {
  "Signature coffee": { icon: <Coffee size={14} />, tone: "gold", key: "signature-coffee" },
  "Cold coffee": { icon: <Snowflake size={14} />, tone: "forest", key: "cold-coffee" },
  Seasonal: { icon: <Sparkles size={14} />, tone: "gold", key: "seasonal" },
  "Non-coffee": { icon: <Droplet size={14} />, tone: "forest", key: "non-coffee" },
  Pastries: { icon: <Croissant size={14} />, tone: "terracotta", key: "pastries" },
  "Retail beans": { icon: <Gift size={14} />, tone: "gold", key: "retail-beans" },
  Experiences: { icon: <FlaskConical size={14} />, tone: "forest", key: "experiences" },
};

export function MenuView() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.menu.eyebrow")}
        title={<>{t("content.view.menu.title")}</>}
        lede={<>{t("content.menu.hero.lede")}</>}
        meta={[
          { label: t("content.menu.hero.meta.snapshot"), value: URSA_FACTS.snapshot },
          { label: t("content.menu.hero.meta.framework"), value: t("content.menu.section.02.hero-meta.framework-value") },
          { label: t("content.menu.hero.meta.pricing"), value: t("content.menu.section.02.hero-meta.pricing-value") },
          { label: t("content.menu.hero.meta.sources"), value: t("content.menu.section.02.hero-meta.sources-value") },
        ]}
      />

      <ViewSection>
        <DossierLinkBanner moduleId="03-menu-and-product-development" />
      </ViewSection>

      {/* ---------- Reconstructed current menu ---------- */}
      <ViewSection
        badge={t("content.menu.section.01.badge")}
        title={t("content.menu.section.01.title")}
        meta={t("content.menu.section.01.meta")}
      >
        <Grid cols={3}>
          <StatBlock
            value={`${VERIFIED_BEVERAGES.length + VERIFIED_FOOD.length}`}
            label={t("content.menu.section.01.stat.verified-items")}
            tone="forest"
          />
          <StatBlock
            value="5"
            label={t("content.menu.section.01.stat.categories")}
            tone="gold"
          />
          <StatBlock
            value="S/. 5–22"
            label={t("content.menu.section.01.stat.range")}
            tone="terracotta"
          />
        </Grid>

        <div className="mt-8 grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
          {/* Menu prototype card */}
          <MenuCard>
            <div className="ursa-menu__crest">
              <BearMark size={56} className="text-ursa-dark-roast mx-auto" />
              <h3
                className="font-display text-[1.8rem] font-semibold text-ursa-dark-roast mt-2 mb-1"
                style={{ letterSpacing: "0.04em" }}
              >
                Carta Ursa
              </h3>
              <small className="font-label text-[0.66rem] tracking-[0.32em] uppercase text-ursa-gold-text block">
                Alcanfores 183 · Miraflores
              </small>
            </div>
            <ArtNouveauDivider className="my-4" />
            {/* Signature legend */}
            <div className="flex items-center justify-center gap-2 mb-4 text-[0.72rem] text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-ursa-gold" aria-hidden="true" />
              <span className="font-label tracking-[0.08em] uppercase">{t("content.menu.section.01.legend")}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-0">
              {CURRENT_MENU_SECTIONS.map((section) => (
                <div key={section.id} className="ursa-menu__section">
                  <h4 className="font-display italic text-ursa-medium-roast text-center border-t border-b border-ursa-line py-2 my-3 text-[1.1rem]">
                    {section.label}
                  </h4>
                  {section.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-baseline gap-2 mb-3 text-[0.95rem] group"
                    >
                      <b
                        className="font-display font-semibold text-ursa-dark-roast text-[1.05rem] flex items-center gap-1.5"
                      >
                        {item.signature && (
                          <span
                            className="inline-block w-2 h-2 rounded-full bg-ursa-gold shrink-0"
                            aria-label="Signature drink"
                          />
                        )}
                        {item.name}
                      </b>
                      <span
                        className="flex-1 border-b border-dotted border-ursa-line translate-y-[-3px]"
                        aria-hidden="true"
                      />
                      <span className="font-label text-ursa-medium-roast tracking-[0.04em] text-[0.9rem] font-medium">
                        {item.price}
                      </span>
                      {item.note && (
                        <span className="basis-full italic text-muted-foreground text-[0.8rem] mt-[-4px] mb-1 pl-4 border-l-2 border-ursa-gold/30">
                          {item.note}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-dashed border-ursa-line">
              <div className="grid sm:grid-cols-3 gap-3 text-center">
                <div>
                  <span className="font-display italic text-ursa-medium-roast text-[1rem]">La Ursa</span>
                  <br />
                  <small className="text-muted-foreground text-[0.78rem]">
                    Ursagroni + empanada · S/. 28
                  </small>
                </div>
                <div>
                  <span className="font-display italic text-ursa-medium-roast text-[1rem]">La Lonya</span>
                  <br />
                  <small className="text-muted-foreground text-[0.78rem]">
                    Filtrado + financier · S/. 20
                  </small>
                </div>
                <div>
                  <span className="font-display italic text-ursa-medium-roast text-[1rem]">La Maracumango</span>
                  <br />
                  <small className="text-muted-foreground text-[0.78rem]">
                    Coldbrew + cookie · S/. 19
                  </small>
                </div>
              </div>
            </div>
          </MenuCard>

          {/* Menu notes */}
          <div className="space-y-4">
            <Callout tone="forest" title={t("content.menu.section.01.callout.verified.title")}>
              <p className="m-0">
                {t("content.menu.section.01.callout.verified.body")}
              </p>
            </Callout>
            <Callout tone="warn" title={t("content.menu.section.01.callout.prices.title")}>
              <p className="m-0">
                {t("content.menu.section.01.callout.prices.body")}
              </p>
            </Callout>
            <Callout tone="gold" title={t("content.menu.section.01.callout.behavioral.title")}>
              <p className="m-0">
                {t("content.menu.section.01.callout.behavioral.body")}
              </p>
            </Callout>
            <Card className="bg-ursa-foam">
              <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
                <Coffee size={16} className="text-ursa-gold-text" />
                {t("content.menu.section.01.card.ownable.heading")}
              </h4>
              <ul className="space-y-1.5 text-[0.88rem] m-0 p-0 list-none text-muted-foreground">
                <li>• {t("content.menu.section.01.card.ownable.b1")}</li>
                <li>• {t("content.menu.section.01.card.ownable.b2")}</li>
                <li>• {t("content.menu.section.01.card.ownable.b3")}</li>
                <li>• {t("content.menu.section.01.card.ownable.b4")}</li>
                <li>• {t("content.menu.section.01.card.ownable.b5")}</li>
              </ul>
            </Card>
          </div>
        </div>
      </ViewSection>

      {/* ---------- Product development proposals ---------- */}
      <ViewSection
        badge={t("content.menu.section.02.badge")}
        title={t("content.menu.section.02.title")}
        meta={t("content.menu.section.02.meta")}
      >
        <p className="text-[0.95rem] text-muted-foreground max-w-[68ch] mb-6">
          {t("content.menu.section.02.lede")}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {(["Signature coffee", "Cold coffee", "Seasonal", "Non-coffee", "Pastries", "Retail beans", "Experiences"] as const).map((c) => {
            const meta = PROPOSAL_CATEGORY_KEY[c];
            return (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 font-label text-[0.66rem] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full border bg-ursa-paper"
                style={{
                  borderColor:
                    meta.tone === "gold"
                      ? "var(--color-ursa-gold)"
                      : meta.tone === "forest"
                      ? "var(--color-ursa-forest-deep)"
                      : "var(--color-ursa-terracotta)",
                  color:
                    meta.tone === "gold"
                      ? "var(--color-ursa-medium-roast)"
                      : meta.tone === "forest"
                      ? "var(--color-ursa-forest-deep)"
                      : "var(--color-ursa-terracotta-text)",
                }}
              >
                {meta.icon}
                {t(`content.menu.section.02.category.${meta.key}`)}
              </span>
            );
          })}
        </div>

        <Accordion type="multiple" className="space-y-3">
          {PROPOSALS.map((p) => {
            const meta = PROPOSAL_CATEGORY_KEY[p.category];
            const proposalKey = (field: string) => `content.menu.section.02.proposal.${p.id}.${field}`;
            return (
              <AccordionItem
                key={p.id}
                value={p.id}
                className="border border-ursa-line-soft rounded-lg bg-card px-5 shadow-[0_1px_0_rgba(59,36,23,0.04)]"
              >
                <AccordionTrigger className="hover:no-underline py-5">
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <span
                      className="font-label text-[0.66rem] tracking-[0.12em] uppercase px-2 py-0.5 rounded border shrink-0"
                      style={{
                        borderColor:
                          meta.tone === "gold"
                            ? "var(--color-ursa-gold)"
                            : meta.tone === "forest"
                            ? "var(--color-ursa-forest-deep)"
                            : "var(--color-ursa-terracotta)",
                        color:
                          meta.tone === "gold"
                            ? "var(--color-ursa-medium-roast)"
                            : meta.tone === "forest"
                            ? "var(--color-ursa-forest-deep)"
                            : "var(--color-ursa-terracotta-text)",
                      }}
                    >
                      {p.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-[1.25rem] font-semibold text-ursa-dark-roast m-0">
                        {t(proposalKey("name"))}
                      </h3>
                      <p className="italic text-muted-foreground text-[0.85rem] m-0">
                        {t(proposalKey("spanish"))}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1.5 font-label text-[0.64rem] tracking-[0.12em] uppercase text-muted-foreground">
                        {meta.icon}
                        {t(`content.menu.section.02.category.${meta.key}`)}
                      </span>
                      <span className="font-label text-[0.7rem] tracking-[0.06em] text-ursa-medium-roast bg-ursa-cream border border-ursa-line-soft px-2 py-1 rounded">
                        S/. {p.pricingLean}–{p.pricingGrowth}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
                    <div>
                      <p className="text-[0.95rem] leading-relaxed text-ursa-dark-roast m-0 mb-4">
                        {t(proposalKey("concept"))}
                      </p>
                      <div className="space-y-3">
                        <CriterionRow icon={<Target size={14} />} label={t("content.menu.section.02.criterion.why")} value={t(proposalKey("why"))} />
                        <CriterionRow icon={<Users size={14} />} label={t("content.menu.section.02.criterion.customer-need")} value={t(proposalKey("need"))} />
                        <CriterionRow icon={<Search size={14} />} label={t("content.menu.section.02.criterion.evidence")} value={t(proposalKey("evidence"))} />
                        <CriterionRow icon={<Sparkles size={14} />} label={t("content.menu.section.02.criterion.brand-fit")} value={t(proposalKey("brand-fit"))} />
                        <CriterionRow icon={<Coffee size={14} />} label={t("content.menu.section.02.criterion.taste")} value={t(proposalKey("taste"))} />
                        <CriterionRow icon={<Clock size={14} />} label={t("content.menu.section.02.criterion.prep")} value={t(proposalKey("prep"))} />
                        <CriterionRow icon={<TrendingUp size={14} />} label={t("content.menu.section.02.criterion.margin")} value={t(proposalKey("margin"))} />
                        <CriterionRow icon={<ClipboardCheck size={14} />} label={t("content.menu.section.02.criterion.operational-test")} value={t(proposalKey("operational-test"))} />
                        <CriterionRow icon={<FlaskConical size={14} />} label={t("content.menu.section.02.criterion.market-test")} value={t(proposalKey("market-test"))} />
                        <CriterionRow icon={<CircleSlash size={14} />} label={t("content.menu.section.02.criterion.stop-rule")} value={t(proposalKey("stop-rule"))} tone="terracotta" />
                      </div>
                    </div>
                    <div className="bg-ursa-cream rounded-lg p-4 border border-ursa-line-soft">
                      <h5 className="font-label text-[0.7rem] tracking-[0.16em] uppercase text-ursa-gold-text m-0 mb-3">
                        {t("content.menu.section.02.scenario.heading")}
                      </h5>
                      <div className="space-y-2.5">
                        <ScenarioRow label={t("content.menu.section.02.scenario.lean.label")} value={p.pricingLean} note={t("content.menu.section.02.scenario.lean.note")} />
                        <ScenarioRow label={t("content.menu.section.02.scenario.moderate.label")} value={p.pricingModerate} note={t("content.menu.section.02.scenario.moderate.note")} highlight />
                        <ScenarioRow label={t("content.menu.section.02.scenario.growth.label")} value={p.pricingGrowth} note={t("content.menu.section.02.scenario.growth.note")} />
                      </div>
                      <div className="mt-3 pt-3 border-t border-ursa-line-soft">
                        <h6 className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-ursa-forest-deep m-0 mb-1.5 flex items-center gap-1.5">
                          <Search size={11} /> {t("content.menu.section.02.scenario.rationale.heading")}
                        </h6>
                        <p className="text-[0.78rem] text-muted-foreground leading-relaxed m-0">
                          {t(proposalKey("pricing-rationale"))}
                        </p>
                      </div>
                      <p className="text-[0.75rem] text-muted-foreground mt-3 m-0 leading-relaxed">
                        {t("content.menu.section.02.scenario.disclaimer")}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ViewSection>

      {/* ---------- Ursa Mañana subscription callout ---------- */}
      <ViewSection
        badge={t("content.menu.section.03.badge-section")}
        title={t("content.menu.section.03.title")}
        meta={t("content.menu.section.03.meta")}
      >
        <Card highlight className="bg-gradient-to-br from-ursa-paper to-ursa-cream">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <SectionBadge tone="gold">{t("content.menu.section.03.badge")}</SectionBadge>
                <EvidenceTag status="verified" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-ursa-dark-roast mt-0 mb-3">
                {t("content.menu.section.03.heading")}
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-muted-foreground m-0 mb-4">
                {t("content.menu.section.03.body")}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("calculator")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-label text-[0.72rem] tracking-[0.12em] uppercase bg-ursa-gold text-ursa-dark-roast border border-ursa-gold hover:-translate-y-0.5 transition"
                >
                  {t("content.menu.section.03.button.calculator")}
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => navigate("experiments")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-label text-[0.72rem] tracking-[0.12em] uppercase bg-transparent text-ursa-medium-roast border border-ursa-line hover:-translate-y-0.5 transition"
                >
                  {t("content.menu.section.03.button.experiments")}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MiniStat value="S/. 20" label={t("content.menu.section.03.ministat.monthly")} />
              <MiniStat value="7–10am" label={t("content.menu.section.03.ministat.window")} />
              <MiniStat value="1 cup / visit" label={t("content.menu.section.03.ministat.cap")} />
              <MiniStat value="50" label={t("content.menu.section.03.ministat.pilot-cap")} />
              <MiniStat value="S/. 1.20–1.80" label={t("content.menu.section.03.ministat.marginal-cost")} />
              <MiniStat value="≥ 60%" label={t("content.menu.section.03.ministat.target-attach")} />
            </div>
          </div>
        </Card>
        <Callout tone="gold" title={t("content.menu.section.03.callout.title")}>
          <p className="m-0">
            {t("content.menu.section.03.callout.body")}
          </p>
        </Callout>
      </ViewSection>

      {/* ---------- Menu science — engineering, design, pricing, pairing ---------- */}
      <ViewSection
        badge={t("content.menu.science.badge")}
        title={t("content.menu.science.title")}
        meta={t("content.menu.science.meta")}
      >
        <p className="text-[0.95rem] leading-relaxed text-muted-foreground max-w-[68ch] mb-6">
          {t("content.menu.science.intro")}
        </p>
        <Grid cols={2}>
          {/* Menu engineering */}
          <Card className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardCheck size={18} className="text-ursa-gold-text" />
              <Pill tone="gold">{t("content.menu.science.engineering.heading")}</Pill>
            </div>
            <p className="text-[0.86rem] text-muted-foreground m-0 leading-relaxed mb-3">
              {t("content.menu.science.engineering.body")}
            </p>
            <div className="mt-auto pt-3 border-t border-ursa-line-soft">
              <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-forest-deep mb-1 flex items-center gap-1">
                <Target size={11} /> {t("content.menu.science.engineering.benchmark-label")}
              </div>
              <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                {t("content.menu.science.engineering.benchmark-body")}
              </p>
            </div>
          </Card>

          {/* Menu design psychology */}
          <Card className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Search size={18} className="text-ursa-gold-text" />
              <Pill tone="forest">{t("content.menu.science.design.heading")}</Pill>
            </div>
            <p className="text-[0.86rem] text-muted-foreground m-0 leading-relaxed mb-3">
              {t("content.menu.science.design.body")}
            </p>
            <div className="mt-auto pt-3 border-t border-ursa-line-soft">
              <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-gold-text mb-1 flex items-center gap-1">
                <CheckCircle2 size={11} /> {t("content.menu.science.design.apply-label")}
              </div>
              <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                {t("content.menu.science.design.apply-body")}
              </p>
            </div>
          </Card>

          {/* Pricing psychology for specialty coffee */}
          <Card className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-ursa-gold-text" />
              <Pill tone="gold">{t("content.menu.science.pricing.heading")}</Pill>
            </div>
            <p className="text-[0.86rem] text-muted-foreground m-0 leading-relaxed mb-3">
              {t("content.menu.science.pricing.body")}
            </p>
            <div className="mt-auto space-y-3">
              <div className="pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-forest-deep mb-1 flex items-center gap-1">
                  <Coffee size={11} /> {t("content.menu.science.pricing.band-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t("content.menu.science.pricing.band-body")}
                </p>
              </div>
              <div className="pt-3 border-t border-ursa-line-soft">
                <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-terracotta-text mb-1 flex items-center gap-1">
                  <FlaskConical size={11} /> {t("content.menu.science.pricing.elasticity-label")}
                </div>
                <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                  {t("content.menu.science.pricing.elasticity-body")}
                </p>
              </div>
            </div>
          </Card>

          {/* Food pairing and attach-rate */}
          <Card className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Croissant size={18} className="text-ursa-gold-text" />
              <Pill tone="forest">{t("content.menu.science.pairing.heading")}</Pill>
            </div>
            <p className="text-[0.86rem] text-muted-foreground m-0 leading-relaxed mb-3">
              {t("content.menu.science.pairing.body")}
            </p>
            <div className="mt-auto pt-3 border-t border-ursa-line-soft">
              <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-gold-text mb-1 flex items-center gap-1">
                <Target size={11} /> {t("content.menu.science.pairing.attach-label")}
              </div>
              <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
                {t("content.menu.science.pairing.attach-body")}
              </p>
            </div>
          </Card>
        </Grid>

        <Callout tone="gold" title={t("content.menu.science.callout-title")}>
          {t("content.menu.science.callout-body")}
        </Callout>
      </ViewSection>

      {/* ---------- 16-criteria evaluation framework ---------- */}
      <ViewSection
        badge={t("content.menu.section.04.badge")}
        title={t("content.menu.section.04.title")}
        meta={t("content.menu.section.04.meta")}
      >
        <p className="text-[0.95rem] text-muted-foreground max-w-[68ch] mb-6">
          {t("content.menu.section.04.lede")}
        </p>
        <Grid cols={4}>
          {EVALUATION_CRITERIA.map((c) => (
            <div
              key={c.n}
              className="bg-card border border-ursa-line-soft rounded-lg p-4 transition hover:border-ursa-gold hover:shadow-[0_4px_16px_-8px_rgba(184,146,74,0.4)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-display text-[1.4rem] font-semibold text-ursa-gold-text leading-none w-7">
                  {String(c.n).padStart(2, "0")}
                </span>
                <CheckCircle2 size={14} className="text-ursa-forest-deep" />
              </div>
              <h4 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast m-0 mb-1">
                {t(`content.menu.section.04.criterion.${c.n}.name`)}
              </h4>
              <p className="text-[0.82rem] text-muted-foreground m-0 leading-relaxed">
                {t(`content.menu.section.04.criterion.${c.n}.desc`)}
              </p>
            </div>
          ))}
        </Grid>
      </ViewSection>

      {/* ---------- Pricing scenario note ---------- */}
      <ViewSection
        badge={t("content.menu.section.05.badge")}
        title={t("content.menu.section.05.title")}
        meta={t("content.menu.section.05.meta")}
      >
        <Grid cols={3}>
          <Card>
            <h4 className="font-label text-[0.72rem] tracking-[0.16em] uppercase text-ursa-gold-text m-0 mb-2">
              {t("content.menu.section.05.lean.heading")}
            </h4>
            <p className="font-display text-2xl font-semibold text-ursa-dark-roast m-0 mb-2">
              {t("content.menu.section.05.lean.tagline")}
            </p>
            <p className="text-[0.85rem] text-muted-foreground m-0">
              {t("content.menu.section.05.lean.body")}
            </p>
          </Card>
          <Card highlight>
            <h4 className="font-label text-[0.72rem] tracking-[0.16em] uppercase text-ursa-gold-text m-0 mb-2">
              {t("content.menu.section.05.moderate.heading")}
            </h4>
            <p className="font-display text-2xl font-semibold text-ursa-dark-roast m-0 mb-2">
              {t("content.menu.section.05.moderate.tagline")}
            </p>
            <p className="text-[0.85rem] text-muted-foreground m-0">
              {t("content.menu.section.05.moderate.body")}
            </p>
          </Card>
          <Card>
            <h4 className="font-label text-[0.72rem] tracking-[0.16em] uppercase text-ursa-gold-text m-0 mb-2">
              {t("content.menu.section.05.growth.heading")}
            </h4>
            <p className="font-display text-2xl font-semibold text-ursa-dark-roast m-0 mb-2">
              {t("content.menu.section.05.growth.tagline")}
            </p>
            <p className="text-[0.85rem] text-muted-foreground m-0">
              {t("content.menu.section.05.growth.body")}
            </p>
          </Card>
        </Grid>

        <Callout tone="stop" title={t("content.menu.section.05.callout.not-invented.title")}>
          <ul className="space-y-1.5 m-0 p-0 list-none text-[0.9rem]">
            <li>• {t("content.menu.section.05.callout.not-invented.b1")}</li>
            <li>• {t("content.menu.section.05.callout.not-invented.b2")}</li>
            <li>• {t("content.menu.section.05.callout.not-invented.b3")}</li>
            <li>• {t("content.menu.section.05.callout.not-invented.b4")}</li>
          </ul>
        </Callout>

        <Callout tone="forest" title={t("content.menu.section.05.callout.principle.title")}>
          <p className="m-0">
            {t("content.menu.section.05.callout.principle.body")}
          </p>
        </Callout>

        <Callout tone="gold" title={t("content.menu.section.05.callout.behavioral.title")}>
          <p className="m-0">
            {t("content.menu.section.05.callout.behavioral.body")}
          </p>
        </Callout>
      </ViewSection>

      <ViewSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatBlock value={`${PROPOSALS.length}`} label={t("content.menu.final.stat.1.label")} tone="forest" />
          <StatBlock value="16 + 4" label={t("content.menu.final.stat.2.label")} tone="gold" />
          <StatBlock value="3" label={t("content.menu.final.stat.3.label")} tone="terracotta" />
          <StatBlock value="S/. 5–140" label={t("content.menu.final.stat.4.label")} tone="forest" />
        </div>
        <p className="text-[0.78rem] text-muted-foreground mt-6 max-w-3xl">
          {t("content.menu.final.note")}
        </p>
      </ViewSection>
    </>
  );
}

// ---------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------

function MenuCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-ursa-paper border-2 border-double border-ursa-gold p-6 md:p-8 rounded-sm relative"
      style={{ boxShadow: "0 1px 0 rgba(59,36,23,0.06), 0 12px 32px -16px rgba(59,36,23,0.18)" }}
    >
      {children}
    </div>
  );
}

function CriterionRow({
  icon,
  label,
  value,
  tone = "gold",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "gold" | "terracotta";
}) {
  return (
    <div className="flex gap-3 items-start">
      <span
        className="mt-0.5 shrink-0 w-7 h-7 rounded-full flex items-center justify-center border"
        style={{
          borderColor:
            tone === "terracotta"
              ? "var(--color-ursa-terracotta)"
              : "var(--color-ursa-gold)",
          color:
            tone === "terracotta"
              ? "var(--color-ursa-terracotta-text)"
              : "var(--color-ursa-medium-roast)",
          background: "var(--color-ursa-paper)",
        }}
      >
        {icon}
      </span>
      <div className="flex-1">
        <div className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-muted-foreground">
          {label}
        </div>
        <p className="text-[0.88rem] leading-relaxed text-ursa-dark-roast m-0">{value}</p>
      </div>
    </div>
  );
}

function ScenarioRow({
  label,
  value,
  note,
  highlight = false,
}: {
  label: string;
  value: number;
  note: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-2.5 rounded-md ${
        highlight ? "bg-ursa-gold/15 border border-ursa-gold" : "bg-ursa-foam border border-ursa-line-soft"
      }`}
    >
      <span className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-muted-foreground w-20 shrink-0">
        {label}
      </span>
      <span className="font-display text-[1.1rem] font-semibold text-ursa-dark-roast w-14 shrink-0">
        S/. {value}
      </span>
      <span className="text-[0.78rem] text-muted-foreground flex-1">{note}</span>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-ursa-foam border border-ursa-line-soft rounded-lg p-3 text-center">
      <div className="font-display text-[1.2rem] font-semibold text-ursa-forest-deep leading-none mb-1">
        {value}
      </div>
      <div className="font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
