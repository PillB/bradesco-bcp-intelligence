"use client";

import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import {
  BearMark,
  ArtNouveauDivider,
  Pill,
  Callout,
  StatBlock,
} from "../ursa-brand";
import {
  CONTENT_CONCEPTS,
  SCRIPTS,
  REPEATABLE_SERIES,
  CREATOR_BRIFS,
  UGC_MECHANISMS,
} from "@/lib/ursa-data";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Sparkles,
  TrendingUp,
  XCircle,
  PlayCircle,
  Repeat,
  Users,
  ArrowRight,
  Film,
  LayoutGrid,
  CalendarDays,
  Megaphone,
  HandHeart,
  Clapperboard,
  ShieldCheck,
  Camera,
  Smartphone,
  UserCheck,
} from "lucide-react";

type ConceptFormat = string;

function formatTone(
  format: ConceptFormat
): "default" | "forest" | "gold" | "warn" | "stop" | "ok" {
  const f = format.toLowerCase();
  if (f.includes("carousel")) return "gold";
  if (f.includes("series") || f.includes("story")) return "warn";
  if (f.includes("ugc")) return "stop";
  if (f.includes("event")) return "ok";
  if (f.includes("reel")) return "forest";
  return "default";
}

/** Pick an icon that signals the content format visually. */
function FormatIcon({ format, className }: { format: string; className?: string }) {
  const f = format.toLowerCase();
  if (f.includes("carousel")) return <LayoutGrid size={14} className={className} />;
  if (f.includes("series")) return <Repeat size={14} className={className} />;
  if (f.includes("story")) return <Sparkles size={14} className={className} />;
  if (f.includes("ugc")) return <HandHeart size={14} className={className} />;
  if (f.includes("event")) return <Megaphone size={14} className={className} />;
  if (f.includes("reel")) return <Film size={14} className={className} />;
  return <Clapperboard size={14} className={className} />;
}

const WEEKS = 4;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Pre-populated 4-week pilot calendar — Mon/Wed/Fri Reels, Tue/Thu Carousels,
// Sat Event/UGC, Sun rest. Daily Stories (Bear's Morning Ritual) run every day
// alongside the featured concept.
const SCHEDULE: { week: number; day: number; conceptId: string }[] = [
  // Week 1
  { week: 0, day: 0, conceptId: "C01" },
  { week: 0, day: 1, conceptId: "C10" },
  { week: 0, day: 2, conceptId: "C03" },
  { week: 0, day: 3, conceptId: "C04" },
  { week: 0, day: 4, conceptId: "C05" },
  { week: 0, day: 5, conceptId: "C15" },
  // Week 2
  { week: 1, day: 0, conceptId: "C09" },
  { week: 1, day: 1, conceptId: "C26" },
  { week: 1, day: 2, conceptId: "C06" },
  { week: 1, day: 3, conceptId: "C11" },
  { week: 1, day: 4, conceptId: "C13" },
  { week: 1, day: 5, conceptId: "C16" },
  // Week 3
  { week: 2, day: 0, conceptId: "C14" },
  { week: 2, day: 1, conceptId: "C21" },
  { week: 2, day: 2, conceptId: "C18" },
  { week: 2, day: 3, conceptId: "C12" },
  { week: 2, day: 4, conceptId: "C22" },
  { week: 2, day: 5, conceptId: "C07" },
  // Week 4
  { week: 3, day: 0, conceptId: "C19" },
  { week: 3, day: 1, conceptId: "C24" },
  { week: 3, day: 2, conceptId: "C25" },
  { week: 3, day: 3, conceptId: "C08" },
  { week: 3, day: 4, conceptId: "C20" },
  { week: 3, day: 5, conceptId: "C23" },
];

function conceptById(id: string) {
  return CONTENT_CONCEPTS.find((c) => c.id === id);
}

// ---------------------------------------------------------------------------
// CONCEPT_EVIDENCE — WHY each concept works for Ursa specifically (not generic
// “behind the scenes works”). Anchored to verified Ursa assets: named drinks,
// tagline, two-bar layout, bear, roastery, Alcanfores 183, Rappi, etc.
// Snapshot 2026-08-01.
// ---------------------------------------------------------------------------
const CONCEPT_EVIDENCE: Record<string, string> = {
  C01: "Works for Ursa because ‘Un gramo a la vez’ is the verified Instagram-bio tagline (snapshot 2026-08-01) — the weighing ritual is the literal enactment of the brand promise. A generic café cannot make this Reel because it has no scale-led tagline. Ursa owns the gram-as-ritual position.",
  C02: "Works for Ursa because the bear mark is verified on the Instagram avatar AND the café sits ~7 minutes walk from Parque Kennedy (verified on Google Maps). The treasure-trail mechanic turns Miraflores footfall into Ursa-bound footfall. Generic cafés lack an animal mark to leave as a ‘track’.",
  C03: "Works for Ursa because the two-bar layout (‘Espresso bar + Coldbrew bar’) is verified in the Instagram bio. The split-screen format is the visual enactment of the two-bar architecture. A competitor with one bar cannot shoot this honestly.",
  C04: "Works for Ursa because the Filtrado Lonya is a verified named drink (Rappi menu, 2026-08-01) sourced from Utcubamba, Amazonas at 1,750m. The origin story is already on the menu — the carousel just makes it visible. A café that resells green beans cannot tell this story.",
  C05: "Works for Ursa because Ursagroni is a verified coined-name drink (Ursa + negroni, observed on Instagram + Rappi). The etymology IS the asset — no competitor has a drink name that explains itself. The barista who named it is a Ursa-specific character.",
  C06: "Works for Ursa because Maracumango is a verified coined-name cold brew (maracuyá + mango, Rappi + Instagram). The colour change on the pour is a sensory hook the drink itself provides — no studio trick needed. A café without a coloured cold brew cannot replicate this.",
  C08: "Works for Ursa because the café opens 7:30am Mon–Sat (verified Instagram bio). The ‘7am club’ framing turns an opening hour into a community — the same five regulars are a Ursa-specific observation the owner can confirm. Generic cafés cannot profile regulars they don't have.",
  C12: "Works for Ursa because Ursa roasts in-house (verified Instagram bio, CoffeePass, Corner.inc). ‘Gram of the week’ is a double-pun: the tagline AND the roast weight. A non-roaster café has no micro-lot rotation to feature.",
  C13: "Works for Ursa because Alcanfores 183 is the verified address (Corner.inc, mindtrip.ai, Instagram) and Parque Kennedy is the Miraflores tourist anchor. The walk is genuinely short (Google Maps: ~7 min). This concept turns a location disadvantage (off the main plaza) into a discovery hook.",
  C14: "Works for Ursa because Durazno Clarificado Coldbrew is a verified drink (Rappi). Clarification is a technical process most customers haven't seen — the ‘behind the science’ angle is owned by Ursa because the drink is named for the process.",
  C15: "Works for Ursa because Corner.inc independently notes ‘baristas double as coffee educators’ (verified Dec 26, 2025). The cupping night operationalises that observation — it's not invented, it's surfaced. A café without educator-staff cannot run this honestly.",
  C18: "Works for Ursa because transparency is the operational backbone of an in-house roaster (verified). The 9pm close-down matches URSA_FACTS hours (Mon–Sat 21:00). The deep-clean video is a trust signal — a café that doesn't roast has nothing to deep-clean publicly.",
  C22: "Works for Ursa because Rappi delivery is verified active (Rappi listing + Instagram bio). The packing ritual is a verifiable Ursa operational detail (insulation, tape, note) that competitors using a third-party commissary cannot honestly show.",
  C23: "Works for Ursa because the Art Nouveau label ornamentation is verified on Instagram post templates. Macro shots of the label are asset-rich — a café with a templated sticker has nothing to macro-photograph.",
  C24: "Works for Ursa because TripAdvisor currently shows 0 reviews (verified 2026-08-01). A ‘review reply of the week’ is corrective content for a listing that has none — it primes the next reviewer by modelling the owner's voice.",
  C26: "Works for Ursa because Ursa roasts in-house, which means the cost breakdown (bean, milk, labour, rent, roastery) is honest and verifiable. A non-roaster café cannot break down the roastery line item without revealing it doesn't exist.",
};

// ---------------------------------------------------------------------------
// SCRIPT_VERIFICATION — for each of the 10 scripts, the REAL Ursa products
// and details it references (verified from VERIFIED_BEVERAGES, URSA_FACTS,
// Instagram, Rappi). Snapshot 2026-08-01.
// ---------------------------------------------------------------------------
const SCRIPT_VERIFICATION: Record<string, { refs: string[]; status: "passed" | "flagged" }> = {
  S01: {
    refs: ["‘Un gramo a la vez’ tagline (IG bio)", "18.0g dose (brewing-standard)", "Alcanfores 183 (verified address)"],
    status: "passed",
  },
  S02: {
    refs: ["Parque Kennedy (Miraflores anchor)", "Malecón (Miraflores)", "Alcanfores 183 (verified address)", "Bear mark (IG avatar)"],
    status: "passed",
  },
  S03: {
    refs: ["Two-bar layout (IG bio: ‘Espresso bar + Coldbrew bar’)", "Ursagroni (verified drink)", "Maracumango Coldbrew (verified drink)"],
    status: "passed",
  },
  S04: {
    refs: ["Filtrado Lonya (verified drink)", "Utcubamba, Amazonas (verified origin)", "1,750m altitude (verified)", "Washed process / Bourbon varietal (verified)"],
    status: "passed",
  },
  S05: {
    refs: ["Ursagroni (verified drink — Ursa + negroni)", "Espresso + tonic + bitter (verified recipe)"],
    status: "passed",
  },
  S06: {
    refs: ["Maracumango Coldbrew (verified drink)", "Passionfruit (maracuyá) + mango (verified recipe)", "Coldbrew bar (IG bio)"],
    status: "passed",
  },
  S07: {
    refs: ["In-house roastery (IG bio / CoffeePass / Corner.inc)", "Lonya micro-lot (verified bean — Filtrado Lonya)", "Roast date stamp (verified on bean bag)"],
    status: "passed",
  },
  S08: {
    refs: ["Parque Kennedy → Alcanfores 183 (Google Maps ~7 min)", "Alcanfores 183 (verified address)"],
    status: "passed",
  },
  S09: {
    refs: ["9pm close (URSA_FACTS hours Mon–Sat 21:00)", "Bear mark on window (IG avatar reference)", "In-house roaster (close-down includes roaster)"],
    status: "passed",
  },
  S10: {
    refs: ["S/. 20/month unlimited coffee (Ursa Mañana pilot, EXP-11)", "7–10am window (verified opening hours)", "Side-attach math (verified EXP-11 hypothesis)"],
    status: "passed",
  },
};

// ---------------------------------------------------------------------------
// PRODUCTION_FEASIBILITY — for the calendar. Which concepts can be shot
// in-house with a phone vs which need external help.
// ---------------------------------------------------------------------------
const PRODUCTION_FEASIBILITY: Record<string, { mode: "phone-in-house" | "phone-with-edit" | "external-help"; note: string }> = {
  C01: { mode: "phone-in-house", note: "Barista's phone on the bar, available light, no edit. ~20 min shoot + 10 min upload. Zero external cost." },
  C02: { mode: "phone-with-edit", note: "Multi-location shoot (Parque Kennedy, Malecón, Alcanfores). Needs a half-day and a stamped bear paw. Edit: ~2h in CapCut. No external hire." },
  C03: { mode: "phone-with-edit", note: "Split-screen needs two angles of the same moment. Easiest: shoot the espresso pull, then the coldbrew drip separately, stitch in CapCut. ~1h shoot + 2h edit." },
  C04: { mode: "phone-with-edit", note: "Carousel — needs farm photos. Ursa may not have Utcubamba farm imagery (open question). Workaround: use Google Maps satellite zoom + Instagram-style farm stock from the producer if shared. ~3h assemble." },
  C05: { mode: "phone-in-house", note: "One barista, one Ursagroni, one camera. Talking-head + macro pour. ~30 min shoot + 30 min edit. Zero external cost." },
  C06: { mode: "external-help", note: "Needs customer consent coordination + 3 willing samplers. Consent forms (UGC mechanism). Barista can shoot, but community management is the bottleneck. ~2h shoot + 1h edit + 2h consent admin." },
  C07: { mode: "external-help", note: "UGC mechanism — needs a sticker set (design cost S/. 200–400) + weekly community management (~2h/wk) + prize fulfilment. Not a ‘shoot’; it's a programme." },
  C08: { mode: "phone-in-house", note: "Interview series. One regular, one barista, one phone on a tripod. ~15 min per episode. Zero external cost." },
  C09: { mode: "phone-with-edit", note: "Time-lapse of a 12-min roast. Phone on tripod, interval-capture app (Lapse It, free). ~15 min setup + 12 min capture + 1h edit." },
  C10: { mode: "phone-in-house", note: "Carousel — text + drink photo. Reusable template. After the first one, ~30 min per carousel. Zero external cost." },
  C11: { mode: "phone-in-house", note: "Table sign + Reel. Print the sign (S/. 0.60), phone-shot of the table. ~20 min. Zero external cost." },
  C12: { mode: "phone-in-house", note: "Macro phone-shot of the bean bag label + caption. ~15 min per episode after the template is set. Zero external cost." },
  C13: { mode: "phone-with-edit", note: "POV walk from Parque Kennedy to Alcanfores 183. Needs a steady shot (phone gimbal S/. 80 one-time, or careful handheld). ~45 min shoot + 1h edit." },
  C14: { mode: "phone-with-edit", note: "Macro close-up of the clarification process. Needs good light + macro lens clip (S/. 30). ~30 min shoot + 1.5h edit." },
  C15: { mode: "phone-with-edit", note: "Event coverage of the cupping night. Phone on tripod + handheld B-roll. ~1h shoot (during the event) + 2h edit." },
  C16: { mode: "phone-with-edit", note: "B2B unboxing of hotel concierge cards. Staged in the café. ~30 min shoot + 1h edit." },
  C17: { mode: "external-help", note: "Animated/illustrated bear opener. Needs a simple looping animation — outsource to a motion designer (S/. 400–800 one-time) or use a free template (Canva, CapCut) with reduced quality. Not a phone shoot." },
  C18: { mode: "phone-in-house", note: "Phone on tripod during the 9pm close-down. Available light only (dim, atmospheric). ~30 min capture + 1h edit." },
  C19: { mode: "phone-with-edit", note: "Staged reveal of a seasonal drink. Needs a cloth, a menu board, good light. ~30 min setup + 30 min shoot + 1h edit." },
  C20: { mode: "phone-in-house", note: "One barista, one question, one phone. Reusable template. ~10 min per episode after setup. Zero external cost." },
  C21: { mode: "phone-in-house", note: "Calculator + receipt on the bar. Phone-shot overhead. ~30 min shoot + 1h edit. Zero external cost." },
  C22: { mode: "phone-in-house", note: "Phone-shot of the packing ritual at the counter. ~20 min shoot + 30 min edit. Zero external cost." },
  C23: { mode: "phone-with-edit", note: "Macro lens clip (S/. 30) for the label close-up. Phone-shot. ~20 min shoot + 30 min edit." },
  C24: { mode: "phone-in-house", note: "Text-only Story series or talking-head owner. ~15 min per episode. Zero external cost." },
  C25: { mode: "phone-in-house", note: "Sped-up pour-over. Phone on tripod, time-remap in CapCut. ~15 min shoot + 30 min edit." },
  C26: { mode: "phone-in-house", note: "Carousel — text + receipt photo + bean bag photo. ~45 min per carousel. Zero external cost." },
};

function feasibilityTone(mode: string): "ok" | "warn" | "stop" {
  if (mode === "phone-in-house") return "ok";
  if (mode === "phone-with-edit") return "warn";
  return "stop";
}

function feasibilityLabel(mode: string, t: (k: string) => string): string {
  if (mode === "phone-in-house") return t("content.viral.feasibility-label.phone");
  if (mode === "phone-with-edit") return t("content.viral.feasibility-label.edit");
  return t("content.viral.feasibility-label.external");
}

export function ViralView() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.viral.eyebrow")}
        title={<>{t("content.view.viral.title")}</>}
        lede={<>{t("content.viral.lede")}</>}
        meta={[
          { label: t("content.viral.meta.concepts"), value: "26" },
          { label: t("content.viral.meta.scripts"), value: "10" },
          { label: t("content.viral.meta.series"), value: "3" },
          { label: t("content.viral.meta.pilot"), value: t("content.viral.meta.pilot-value") },
        ]}
      />

      {/* Disclaimer callout — prominent, immediately under hero */}
      <ViewSection className="border-b-0 pt-0 -mt-2">
        <Callout tone="stop" title={t("content.viral.disclaimer.title")}>
          {t("content.viral.disclaimer.body")}
        </Callout>
      </ViewSection>

      {/* Section 01 — 26 content concepts */}
      <ViewSection
        badge="Section 01"
        title={t("content.viral.section.01.title")}
        meta={t("content.viral.section.01.meta")}
      >
        <p className="text-[0.95rem] text-muted-foreground max-w-[68ch] mb-6">
          {t("content.viral.section.01.lede")}
        </p>
        <Grid cols={3}>
          {CONTENT_CONCEPTS.map((c) => {
            const evidence = CONCEPT_EVIDENCE[c.id];
            const feasibility = PRODUCTION_FEASIBILITY[c.id];
            return (
            <Card key={c.id} className="p-5 flex flex-col gap-3 group relative overflow-hidden">
              {/* Top accent bar colored by format tone */}
              <span
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{
                  background:
                    formatTone(c.format) === "forest" ? "var(--color-ursa-forest-deep)" :
                    formatTone(c.format) === "gold" ? "var(--color-ursa-gold)" :
                    formatTone(c.format) === "warn" ? "linear-gradient(90deg,var(--color-ursa-gold),var(--color-ursa-terracotta))" :
                    formatTone(c.format) === "stop" ? "var(--color-ursa-terracotta)" :
                    formatTone(c.format) === "ok" ? "var(--color-ursa-forest)" :
                    "var(--color-ursa-line)",
                }}
              />
              <div className="flex items-start justify-between gap-2">
                <span className="font-label text-[0.7rem] tracking-[0.18em] uppercase text-ursa-gold-text">
                  {c.id}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {feasibility && (
                    <Pill tone={feasibilityTone(feasibility.mode)}>
                      {feasibilityLabel(feasibility.mode, t)}
                    </Pill>
                  )}
                  <Pill tone={formatTone(c.format)}>
                    <FormatIcon format={c.format} className="shrink-0" />
                    {c.format}
                  </Pill>
                </div>
              </div>
              <h3 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast leading-snug">
                {c.title}
              </h3>
              <p className="text-[0.85rem] text-muted-foreground leading-relaxed m-0">
                {c.hook}
              </p>
              {evidence && (
                <div className="mt-auto pt-3 border-t border-ursa-line-soft">
                  <div className="font-label text-[0.55rem] tracking-[0.16em] uppercase text-ursa-gold-text mb-1">
                    {t("content.viral.section.01.why-ursa")}
                  </div>
                  <p className="text-[0.76rem] text-ursa-dark-roast/85 m-0 leading-relaxed">{evidence}</p>
                </div>
              )}
            </Card>
            );
          })}
        </Grid>
      </ViewSection>

      {/* Section 02 — 10 complete scripts */}
      <ViewSection
        badge="Section 02"
        title={t("content.viral.section.02.title")}
        meta={t("content.viral.section.02.meta")}
      >
        <p className="text-[0.95rem] text-muted-foreground max-w-[68ch] mb-6">
          {t("content.viral.section.02.lede")}
        </p>
        <Accordion
          type="single"
          collapsible
          className="bg-card border border-ursa-line-soft rounded-xl px-5"
        >
          {SCRIPTS.map((s) => {
            const concept = conceptById(s.concept);
            const verification = SCRIPT_VERIFICATION[s.id];
            return (
              <AccordionItem key={s.id} value={s.id} className="border-0">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-start gap-4 flex-1 text-left">
                    <span className="font-label text-[0.7rem] tracking-[0.18em] uppercase text-ursa-gold-text mt-1 shrink-0">
                      {s.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast leading-snug">
                        {s.title}
                      </div>
                      <div className="text-[0.82rem] text-muted-foreground mt-0.5">
                        {s.hook}
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Pill tone="default">{s.duration}</Pill>
                        {concept && (
                          <Pill tone={formatTone(concept.format)}>
                            {concept.format}
                          </Pill>
                        )}
                        {verification && (
                          <Pill tone={verification.status === "passed" ? "ok" : "stop"}>
                            <ShieldCheck size={11} className="shrink-0" />
                            {t("content.viral.section.02.verified-refs").replace("{n}", String(verification.refs.length))}
                          </Pill>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-2 gap-6 pt-2">
                    <div>
                      <div className="font-label text-[0.66rem] tracking-[0.18em] uppercase text-ursa-forest-deep mb-3">
                        {t("content.viral.section.02.beats")}
                      </div>
                      <ol className="list-none space-y-2.5 m-0 p-0">
                        {s.beats.map((b, i) => (
                          <li
                            key={i}
                            className="flex gap-3 text-[0.92rem] leading-relaxed"
                          >
                            <span className="font-display font-semibold text-ursa-gold-text w-6 shrink-0 text-base">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-ursa-dark-roast">{b}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="flex flex-col gap-4">
                      {verification && (
                        <div className="border border-ursa-forest-deep/30 bg-ursa-dark-roast/5 rounded-lg p-4">
                          <div className="font-label text-[0.66rem] tracking-[0.18em] uppercase text-ursa-forest-deep mb-2 flex items-center gap-1">
                            <ShieldCheck size={12} /> {t("content.viral.section.02.verified-detail")}
                          </div>
                          <ul className="list-none space-y-1.5 m-0 p-0">
                            {verification.refs.map((r, i) => (
                              <li key={i} className="text-[0.82rem] text-ursa-dark-roast/85 leading-snug flex gap-2">
                                <span className="text-ursa-forest-deep mt-0.5 shrink-0">✓</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="bg-ursa-dark-roast text-ursa-cream rounded-lg p-4 border border-ursa-espresso">
                        <div className="font-label text-[0.66rem] tracking-[0.18em] uppercase text-ursa-gold-text-soft mb-2">
                          {t("content.viral.section.02.caption-label")}
                        </div>
                        <p className="font-body text-[0.95rem] leading-relaxed m-0">
                          {s.caption}
                        </p>
                      </div>
                      <div className="bg-ursa-dark-roast text-ursa-cream rounded-lg p-4">
                        <div className="font-label text-[0.66rem] tracking-[0.18em] uppercase text-ursa-leaf mb-2">
                          {t("content.viral.section.02.cta-label")}
                        </div>
                        <p className="font-body text-[0.95rem] leading-relaxed m-0">
                          {s.cta}
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ViewSection>

      {/* Section 03 — 3 repeatable series */}
      <ViewSection
        badge="Section 03"
        title={t("content.viral.section.03.title")}
        meta={t("content.viral.section.03.meta")}
      >
        <p className="text-[0.95rem] text-muted-foreground max-w-[68ch] mb-6">
          {t("content.viral.section.03.lede")}
        </p>
        <Grid cols={3}>
          {REPEATABLE_SERIES.map((s) => (
            <Card key={s.name} className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <Repeat size={20} className="text-ursa-forest-deep" />
                <Pill tone={s.cadence.toLowerCase().includes("daily") ? "forest" : "warn"}>
                  {s.cadence}
                </Pill>
              </div>
              <h3 className="font-display text-[1.15rem] font-semibold text-ursa-dark-roast m-0">
                {s.name}
              </h3>
              <p className="text-[0.88rem] text-muted-foreground leading-relaxed m-0">
                {s.concept}
              </p>
              <div className="border-t border-ursa-line-soft pt-3 mt-auto">
                <div className="font-label text-[0.66rem] tracking-[0.16em] uppercase text-muted-foreground mb-0.5">
                  {t("content.viral.section.03.episodes")}
                </div>
                <div className="text-[0.85rem] text-ursa-dark-roast">{s.episodes}</div>
              </div>
            </Card>
          ))}
        </Grid>
      </ViewSection>

      {/* Section 04 — 3 creator briefs */}
      <ViewSection
        badge="Section 04"
        title={t("content.viral.section.04.title")}
        meta={t("content.viral.section.04.meta")}
      >
        <p className="text-[0.95rem] text-muted-foreground max-w-[68ch] mb-6">
          {t("content.viral.section.04.lede")}
        </p>
        <Grid cols={3}>
          {CREATOR_BRIFS.map((b) => (
            <Card key={b.name} className="flex flex-col gap-3 p-6">
              <h3 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast leading-snug m-0">
                {b.name}
              </h3>
              <BriefRow label={t("content.viral.section.04.brief.objective")} value={b.objective} />
              <BriefRow label={t("content.viral.section.04.brief.deliverable")} value={b.deliverable} />
              <BriefRow label={t("content.viral.section.04.brief.key-message")} value={b.keyMessage} />
              <BriefRow label={t("content.viral.section.04.brief.assets")} value={b.assetsProvided} />
              <div className="border-t border-ursa-gold/30 bg-ursa-gold/10 -mx-6 -mb-6 px-6 py-3 rounded-b-xl mt-auto">
                <div className="font-label text-[0.66rem] tracking-[0.16em] uppercase text-ursa-medium-roast mb-0.5">
                  {t("content.viral.section.04.brief.metric")}
                </div>
                <div className="text-[0.88rem] text-ursa-dark-roast font-medium">
                  {b.metric}
                </div>
              </div>
            </Card>
          ))}
        </Grid>
      </ViewSection>

      {/* Section 05 — 3 UGC mechanisms */}
      <ViewSection
        badge="Section 05"
        title={t("content.viral.section.05.title")}
        meta={t("content.viral.section.05.meta")}
      >
        <p className="text-[0.95rem] text-muted-foreground max-w-[68ch] mb-6">
          {t("content.viral.section.05.lede")}
        </p>
        <Grid cols={3}>
          {UGC_MECHANISMS.map((u) => (
            <Card key={u.name} className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <Users size={20} className="text-ursa-terracotta-text" />
                <Pill tone="stop">UGC</Pill>
              </div>
              <h3 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast m-0">
                {u.name}
              </h3>
              <p className="text-[0.88rem] text-muted-foreground leading-relaxed m-0">
                {u.mechanism}
              </p>
              <div className="border-l-2 border-ursa-terracotta pl-3 bg-ursa-terracotta/5 py-2 rounded-r">
                <div className="font-label text-[0.62rem] tracking-[0.16em] uppercase text-ursa-terracotta-text mb-1">
                  {t("content.viral.section.05.consent")}
                </div>
                <p className="text-[0.82rem] text-ursa-dark-roast leading-snug m-0">
                  {u.consent}
                </p>
              </div>
            </Card>
          ))}
        </Grid>
      </ViewSection>

      <ArtNouveauDivider />

      {/* Section 06 — Four-week pilot calendar */}
      <ViewSection
        badge="Section 06"
        title={t("content.viral.section.06.title")}
        meta={t("content.viral.section.06.meta")}
      >
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="font-label text-[0.66rem] tracking-[0.16em] uppercase text-muted-foreground">
            {t("content.viral.section.06.format-key")}
          </span>
          <Pill tone="forest">Reel</Pill>
          <Pill tone="gold">Carousel</Pill>
          <Pill tone="warn">Series</Pill>
          <Pill tone="stop">UGC</Pill>
          <Pill tone="ok">Event</Pill>
          <span className="mx-2 text-ursa-line">|</span>
          <span className="font-label text-[0.66rem] tracking-[0.16em] uppercase text-muted-foreground">
            {t("content.viral.section.06.production-key")}
          </span>
          <Pill tone="ok"><Smartphone size={11} /> {t("content.viral.feasibility-label.phone")}</Pill>
          <Pill tone="warn"><Camera size={11} /> {t("content.viral.feasibility-label.edit")}</Pill>
          <Pill tone="stop"><UserCheck size={11} /> {t("content.viral.feasibility-label.external")}</Pill>
        </div>

        <div className="bg-card border border-ursa-line-soft rounded-xl p-4 md:p-6 overflow-x-auto ursa-scroll">
          <div className="grid grid-cols-7 gap-1.5 md:gap-2 min-w-[680px]">
            {DAYS.map((d) => (
              <div
                key={d}
                className="font-label text-[0.66rem] tracking-[0.16em] uppercase text-ursa-medium-roast text-center pb-2 border-b-2 border-ursa-gold/30"
              >
                {d}
              </div>
            ))}
            {[...Array(WEEKS)].map((_, w) =>
              DAYS.map((_, d) => {
                const entry = SCHEDULE.find((s) => s.week === w && s.day === d);
                const concept = entry ? conceptById(entry.conceptId) : undefined;
                // Add a subtle week separator after Sunday (last day of each week row)
                const isWeekEnd = d === 6;
                if (concept) {
                  const tone = formatTone(concept.format);
                  const feasibility = PRODUCTION_FEASIBILITY[concept.id];
                  const toneBg: Record<string, string> = {
                    forest: "bg-ursa-dark-roast/8 border-ursa-forest-deep/30",
                    gold: "bg-ursa-gold/15 border-ursa-gold/40",
                    warn: "bg-ursa-gold-soft/20 border-ursa-gold/40",
                    stop: "bg-ursa-terracotta/8 border-ursa-terracotta/30",
                    ok: "bg-ursa-medium-roast/10 border-ursa-forest-deep/30",
                    default: "bg-muted border-ursa-line-soft",
                  };
                  const feasIcon =
                    feasibility?.mode === "phone-in-house" ? <Smartphone size={9} /> :
                    feasibility?.mode === "phone-with-edit" ? <Camera size={9} /> :
                    <UserCheck size={9} />;
                  return (
                    <div
                      key={`${w}-${d}`}
                      className={`rounded-lg p-2.5 border ${toneBg[tone]} min-h-[100px] flex flex-col gap-1 transition hover:shadow-md hover:-translate-y-0.5 ${isWeekEnd ? "mr-2 md:mr-3" : ""} group cursor-default`}
                      title={feasibility?.note}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
                          W{w + 1} · {DAYS[d]}
                        </span>
                        <span className="font-label text-[0.6rem] tracking-[0.1em] uppercase text-ursa-medium-roast">
                          {concept.id}
                        </span>
                      </div>
                      <div className="text-[0.78rem] font-medium text-ursa-dark-roast leading-snug">
                        {concept.title}
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                          <FormatIcon format={concept.format} className="text-muted-foreground" />
                          <span className="font-label text-[0.55rem] tracking-[0.08em] uppercase text-muted-foreground">
                            {concept.format.split(" ")[0]}
                          </span>
                        </div>
                        {feasibility && (
                          <span className={`inline-flex items-center gap-0.5 font-label text-[0.5rem] tracking-[0.08em] uppercase px-1 py-0.5 rounded ${
                            feasibility.mode === "phone-in-house" ? "text-ursa-forest-deep bg-ursa-dark-roast/5" :
                            feasibility.mode === "phone-with-edit" ? "text-ursa-medium-roast bg-ursa-gold/10" :
                            "text-ursa-terracotta-text bg-ursa-terracotta/8"
                          }`}>
                            {feasIcon}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
                // Empty cell — rest day, Stories only
                return (
                  <div
                    key={`${w}-${d}`}
                    className={`rounded-lg p-2.5 border border-dashed border-ursa-line min-h-[100px] flex flex-col items-center justify-center gap-1 bg-ursa-cream/40 ${isWeekEnd ? "mr-2 md:mr-3" : ""}`}
                  >
                    <span className="font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
                      W{w + 1} · {DAYS[d]}
                    </span>
                    <span className="text-[0.7rem] text-muted-foreground italic text-center">
                      {t("content.viral.section.06.rest-day")}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-ursa-line-soft flex items-center gap-2 text-[0.78rem] text-muted-foreground">
            <BearMark size={18} className="text-ursa-gold-text" />
            <span>
              {t("content.viral.section.06.every-day-body")}
            </span>
          </div>
        </div>

        <Callout tone="gold" title={t("content.viral.section.06.cadence.title")}>
          {t("content.viral.section.06.cadence.body")}
        </Callout>

        {/* Production feasibility breakdown */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-ursa-forest-deep/30 bg-ursa-dark-roast/5 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone size={18} className="text-ursa-forest-deep" />
              <h4 className="font-display text-[1rem] font-semibold text-ursa-dark-roast m-0">{t("content.viral.section.06.feasibility.phone.title")}</h4>
            </div>
            <p className="text-[0.82rem] text-muted-foreground m-0 leading-relaxed mb-3">
              {t("content.viral.section.06.feasibility.phone.body")}
            </p>
            <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-forest-deep mb-1">
              {t("content.viral.section.06.feasibility.list-label")}
            </div>
            <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
              {t("content.viral.section.06.feasibility.phone.list")}
            </p>
          </div>
          <div className="rounded-lg border border-ursa-gold/50 bg-ursa-gold/8 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Camera size={18} className="text-ursa-medium-roast" />
              <h4 className="font-display text-[1rem] font-semibold text-ursa-dark-roast m-0">{t("content.viral.section.06.feasibility.edit.title")}</h4>
            </div>
            <p className="text-[0.82rem] text-muted-foreground m-0 leading-relaxed mb-3">
              {t("content.viral.section.06.feasibility.edit.body")}
            </p>
            <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-medium-roast mb-1">
              {t("content.viral.section.06.feasibility.list-label")}
            </div>
            <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
              {t("content.viral.section.06.feasibility.edit.list")}
            </p>
          </div>
          <div className="rounded-lg border border-ursa-terracotta/40 bg-ursa-terracotta/8 p-5">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck size={18} className="text-ursa-terracotta-text" />
              <h4 className="font-display text-[1rem] font-semibold text-ursa-dark-roast m-0">{t("content.viral.section.06.feasibility.external.title")}</h4>
            </div>
            <p className="text-[0.82rem] text-muted-foreground m-0 leading-relaxed mb-3">
              {t("content.viral.section.06.feasibility.external.body")}
            </p>
            <div className="font-label text-[0.58rem] tracking-[0.16em] uppercase text-ursa-terracotta-text mb-1">
              {t("content.viral.section.06.feasibility.list-label")}
            </div>
            <p className="text-[0.78rem] text-ursa-dark-roast/85 m-0 leading-relaxed">
              {t("content.viral.section.06.feasibility.external.list")}
            </p>
          </div>
        </div>

        <Callout tone="stop" title={t("content.viral.section.06.rule.title")}>
          {t("content.viral.section.06.rule.body")}
        </Callout>
      </ViewSection>

      {/* Section 07 — Test & amplification method */}
      <ViewSection
        badge="Section 07"
        title={t("content.viral.section.07.title")}
        meta={t("content.viral.section.07.meta")}
      >
        <p className="text-[0.95rem] text-muted-foreground max-w-[68ch] mb-6">
          {t("content.viral.section.07.lede")}
        </p>
        <div className="grid md:grid-cols-4 gap-4">
          <MethodStep
            n="01"
            title={t("content.viral.section.07.step01.title")}
            body={t("content.viral.section.07.step01.body")}
            tone="forest"
            icon={<PlayCircle size={18} />}
          />
          <MethodStep
            n="02"
            title={t("content.viral.section.07.step02.title")}
            body={t("content.viral.section.07.step02.body")}
            tone="gold"
            icon={<TrendingUp size={18} />}
          />
          <MethodStep
            n="03"
            title={t("content.viral.section.07.step03.title")}
            body={t("content.viral.section.07.step03.body")}
            tone="warn"
            icon={<Sparkles size={18} />}
          />
          <MethodStep
            n="04"
            title={t("content.viral.section.07.step04.title")}
            body={t("content.viral.section.07.step04.body")}
            tone="stop"
            icon={<XCircle size={18} />}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card className="p-5">
            <StatBlock
              value="48h"
              label={t("content.viral.section.07.stat01")}
              tone="forest"
            />
          </Card>
          <Card className="p-5">
            <StatBlock
              value="S/. 50–150"
              label={t("content.viral.section.07.stat02")}
              tone="gold"
            />
          </Card>
          <Card className="p-5">
            <StatBlock
              value="14d"
              label={t("content.viral.section.07.stat03")}
              tone="terracotta"
            />
          </Card>
        </div>

        <Callout tone="forest" title={t("content.viral.section.07.callout.title")}>
          {t("content.viral.section.07.callout.body")}
        </Callout>
      </ViewSection>

      {/* Closing — Dossier link banner + cross-link to interactive planner */}
      <ViewSection className="border-b-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <BearMark size={40} className="text-ursa-dark-roast shrink-0 mt-1" />
            <div>
              <h3 className="font-display text-[1.4rem] font-semibold text-ursa-dark-roast mb-2 m-0">
                {t("content.viral.closing.title")}
              </h3>
              <p className="text-[0.9rem] text-muted-foreground max-w-[58ch] m-0">
                {t("content.viral.closing.body")}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start md:items-end">
            <DossierLinkBanner moduleId="05-viral-content-laboratory" />
            <button
              onClick={() => navigate("content-calendar")}
              className="inline-flex items-center gap-2 text-[0.8rem] text-ursa-gold-text hover:text-ursa-dark-roast transition font-label tracking-[0.12em] uppercase"
            >
              {t("content.viral.closing.cta")}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </ViewSection>
    </>
  );
}

function BriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-label text-[0.62rem] tracking-[0.16em] uppercase text-muted-foreground mb-0.5">
        {label}
      </div>
      <div className="text-[0.85rem] text-ursa-dark-roast leading-snug">{value}</div>
    </div>
  );
}

function MethodStep({
  n,
  title,
  body,
  tone,
  icon,
}: {
  n: string;
  title: string;
  body: string;
  tone: "forest" | "gold" | "warn" | "stop";
  icon: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    forest: "border-ursa-forest-deep/40 bg-ursa-dark-roast/5",
    gold: "border-ursa-gold/50 bg-ursa-gold/8",
    warn: "border-ursa-gold-soft bg-ursa-gold-soft/15",
    stop: "border-ursa-terracotta/40 bg-ursa-terracotta/8",
  };
  const iconTones: Record<string, string> = {
    forest: "text-ursa-forest-deep",
    gold: "text-ursa-gold-text",
    warn: "text-ursa-medium-roast",
    stop: "text-ursa-terracotta-text",
  };
  return (
    <div
      className={`rounded-lg border-2 p-5 flex flex-col gap-2 ${tones[tone]}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-[1.8rem] font-semibold leading-none text-ursa-dark-roast">
          {n}
        </span>
        <span className={iconTones[tone]}>{icon}</span>
      </div>
      <h3 className="font-display text-[1rem] font-semibold text-ursa-dark-roast m-0">
        {title}
      </h3>
      <p className="text-[0.82rem] text-ursa-dark-roast leading-relaxed m-0">{body}</p>
    </div>
  );
}
