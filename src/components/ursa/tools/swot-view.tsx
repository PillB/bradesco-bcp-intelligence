"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import { ViewHero, ViewSection, Card, DossierLinkBanner } from "../view-shell";
import { BearMark, Pill, Callout } from "../ursa-brand";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
  Swords,
  Eye,
  TrendingUp,
  AlertTriangle,
  Info,
  Microscope,
  BookOpen,
  GraduationCap,
  Brain,
  Target,
  Fingerprint,
  Grid,
  Scale,
} from "lucide-react";

/**
 * Competitor SWOT Matrix — an interactive 2x2 visualization that plots
 * Ursa and its Miraflores/Lima competitors on two axes the dossier
 * actually researched: Brand Distinctiveness (bear/gram/green) vs
 * Distribution Reach (scale + channels). Each quadrant has a label and
 * an implication. Clicking a competitor shows its SWOT detail.
 *
 * The COMPETITORS array below is research-source data verified in
 * Module 02 — strength / weakness / opportunity / threat / ursaImplication
 * prose stays inline as in the Competitor Intelligence Dashboard (T2)
 * and the Origin Atlas (T7). UI chrome is translated.
 */

type Competitor = {
  name: string;
  area: string;
  // 0-100 scores from the dossier research
  distinctiveness: number; // bear/gram/green identity strength
  reach: number; // distribution + scale + channel coverage
  strength: string;
  weakness: string;
  opportunity: string;
  threat: string;
  ursaImplication: string;
  isUrsa?: boolean;
};

const COMPETITORS: Competitor[] = [
  {
    name: "Ursa",
    area: "Miraflores",
    distinctiveness: 88,
    reach: 32,
    strength: "Motivo del oso + teatro de dos barras + bebidas con nombre (Ursagroni, Maracumango) + tostadora a la vista + «un gramo a la vez»",
    weakness: "Sin web, Google Business Profile sin reclamar, ~0 reseñas en TripAdvisor, todavía sin red de creadores",
    opportunity: "Adueñarnos del nicho craft liderado por el oso en Miraflores antes de que los competidores copien el ángulo de carácter",
    threat: "La brecha de distribución deja que los competidores capturen el tráfico de búsqueda y reseñas que debería ser de Ursa",
    ursaImplication: "Este es Ursa — el cuadrante de alto craft, bajo alcance. El trabajo del plan es subir el alcance sin bajar la distintividad.",
    isUrsa: true,
  },
  {
    name: "Punto Café",
    area: "Miraflores",
    distinctiveness: 48,
    reach: 62,
    strength: "Ganador de Premios Somos 2024; reconocimiento local fuerte; local visible",
    weakness: "Identidad de tostadora limitada; menos craft Art Nouveau; posicionamiento de specialty genérico",
    opportunity: "Fatiga de premios — los clientes pueden buscar una historia craft más distintiva",
    threat: "La credibilidad del premio atrae turistas y habituales que podrían preferir el craft de Ursa",
    ursaImplication: "Emparejar la visibilidad del premio con reseñas en Google/TripAdvisor; liderar con tostadora + craft del oso.",
  },
  {
    name: "Neira Café Lab",
    area: "Miraflores + 3",
    distinctiveness: 52,
    reach: 78,
    strength: "4+ locales incl. cobrand WorkCafé; escala y alcance B2B",
    weakness: "El cobrand diluye la identidad de café puro; se siente corporativo a escala",
    opportunity: "Clientes cansados de escala pueden preferir una experiencia craft de local único",
    threat: "Las cuentas B2B y de oficina que Neira podría ganar también son oportunidad de wholesale para Ursa",
    ursaImplication: "Liderar con la intimidad de local único; evitar la dilución del cobrand. Competir en craft, no en huella.",
  },
  {
    name: "Bisetti",
    area: "Barranco",
    distinctiveness: 72,
    reach: 55,
    strength: "Es dueño del posicionamiento de «escuela de café»; credibilidad educativa",
    weakness: "El foco educativo puede sentirse formal; Barranco no es Miraflores",
    opportunity: "Ursa puede ofrecer educación más cálida y vivencial (noches de cata vs escuela)",
    threat: "Los graduados de la escuela de Bisetti pueden acabar trabajando en otros locales, subiendo el listón local",
    ursaImplication: "Competir en educación pero hacerla más cálida — noches de cata, no aulas.",
  },
  {
    name: "Puku Puku",
    area: "Varios puntos de Lima",
    distinctiveness: 58,
    reach: 82,
    strength: "Es dueño del posicionamiento de «microlotes»; fuerte alcance retail en toda Lima",
    weakness: "Feel de cadena a escala; menos atmósfera craft por local",
    opportunity: "Los clientes de microlotes pueden graduarse a una experiencia craft de local único",
    threat: "La huella retail hace que los granos de Puku Puku estén en todas partes donde compran los clientes de Ursa",
    ursaImplication: "Liderar con atmósfera craft; ofrecer microlotes como sub-línea, no como titular.",
  },
  {
    name: "Terrua",
    area: "Miraflores",
    distinctiveness: 64,
    reach: 45,
    strength: "Cata pagada de US$25 — pricing de experiencia premium; márgenes fuertes",
    weakness: "El techo de precio alto limita la frecuencia y la accesibilidad",
    opportunity: "Catas en niveles — entrada accesible + profundidad premium — le gana al todo-o-nada de Terrua",
    threat: "El posicionamiento premium de Terrua puede atraer a los clientes aspiracionales de Ursa",
    ursaImplication: "Catas en niveles; entrada accesible (S/. 15) + profundidad premium (S/. 35).",
  },
  {
    name: "Ciclos",
    area: "Lima",
    distinctiveness: 60,
    reach: 38,
    strength: "Nicho de comunidad bici + café; subcultura leal",
    weakness: "El nicho limita al público; poca conciencia general",
    opportunity: "Cruzarse con partners de ciclismo/turismo que Ursa también podría alcanzar",
    threat: "La comunidad de Ciclos es leal y puede no cambiar",
    ursaImplication: "Aliarse con ciclismo/turismo para descubrimiento mutuo, no competencia directa.",
  },
  {
    name: "RAIZ",
    area: "Lima",
    distinctiveness: 66,
    reach: 35,
    strength: "Historia de finca a taza; credibilidad de origen",
    weakness: "Menos presencia retail; la historia puede sentirse abstracta sin la taza",
    opportunity: "Historias de origen vía la línea Filtrado Lonya de Ursa — tangibles, no abstractas",
    threat: "Las relaciones con fincas de RAIZ podrían ser una fuente de grano wholesale que Ursa también necesita",
    ursaImplication: "Hacer tangible el origen — el Filtrado Lonya de Ursa es una taza que puedes probar, no solo una historia.",
  },
  {
    name: "Café Verde",
    area: "Miraflores",
    distinctiveness: 50,
    reach: 50,
    strength: "Narrativa de sostenibilidad; base de clientes ecoconscientes",
    weakness: "El discurso verde puede sentirse genérico sin prueba específica de origen",
    opportunity: "Las historias de origen de Ursa son más específicas que los claims genéricos de sostenibilidad",
    threat: "Los clientes ecoconscientes pueden ir por defecto a Café Verde si la sostenibilidad de Ursa no es visible",
    ursaImplication: "Hacer específica la sostenibilidad — origen, altitud, nombre del productor — no un claim verde genérico.",
  },
  {
    name: "True Artisan",
    area: "Miraflores",
    distinctiveness: 44,
    reach: 42,
    strength: "Posicionamiento artisan; reconocimiento local",
    weakness: "Identidad visual menos diferenciada; «artisan» está saturado",
    opportunity: "Oso + Art Nouveau es más propio que «artisan» solo",
    threat: "Mínima — True Artisan no tiene un espacio distintivo que Ursa necesite",
    ursaImplication: "No competir en «artisan» — competir en el oso. La identidad de Ursa es propia; «artisan» no.",
  },
  {
    name: "Milimetrica Coffee Co",
    area: "Miraflores · Alcanfores 215",
    distinctiveness: 42,
    reach: 35,
    strength: "Competidor directo más cercano — misma calle (Alcanfores 215, a 32 puertas de Ursa). Tostadora + cafetería confirmadas. Posicionamiento de specialty minimalista. Web + Instagram + TripAdvisor. 7:30am–8pm.",
    weakness: "La estética minimalista carece de calidez y storytelling; sin bebidas con nombre, sin Art Nouveau, sin teatro de dos barras. Limpio pero no propio. Solo dulces como comida según TripAdvisor.",
    opportunity: "Milimetrica tuesta pero no cuenta historia. La identidad del oso, las bebidas con nombre (Ursagroni, Maracumango) y el teatro de dos barras de Ursa se adueñan del espacio emocional que Milimetrica no puede.",
    threat: "Como tostadora en la misma calle, Milimetrica compite directamente por el claim de «café recién tostado». El tráfico que camina por la calle puede entrar primero a Milimetrica (32 puertas más cerca de la esquina).",
    ursaImplication: "Milimetrica es el competidor de cuadra más peligroso — tuestan. Ganar en carácter (oso, Art Nouveau, bebidas con nombre, calidez), no en capacidad de tostado. La diferenciación es identidad, no equipo.",
  },
  {
    name: "Milenaria Café",
    area: "Miraflores · Alcanfores 348",
    distinctiveness: 48,
    reach: 40,
    strength: "Competidor de la misma calle en Alcanfores 348. Brunch completo + café de specialty + postres artesanales. Plant-based, vegano, avocado toast. Instagram @milenariacafe. Abre a diario. Tráfico fuerte de brunch.",
    weakness: "La amplitud del brunch diluye el foco en el craft de café. Sin tostadora a la vista. La ocasión de brunch es distinta al ritual matutino de Ursa.",
    opportunity: "Milenaria es dueño del brunch en Alcanfores; Ursa NO debería competir en brunch. Adueñarnos del ritual de café matutino (7:30–10am) + momento craft de tarde. Los brunchers de Milenaria que quieren mejor café caminan 165m hasta Ursa.",
    threat: "Milenaria captura al público de media mañana/brunch que de otra forma extendería su visita a Ursa hasta la comida. Su oferta de comida todo el día es una conveniencia que Ursa no iguala.",
    ursaImplication: "No competir con Milenaria en brunch. Adueñarnos del ritual de café 7:30–10am y del momento craft de tarde. Posicionarnos como el destino de café, no el destino de comida.",
  },
  {
    name: "Dulce Ciudad",
    area: "Miraflores · 50m",
    distinctiveness: 32,
    reach: 22,
    strength: "Muy cerca; captura tráfico peatonal que pasa por la misma calle",
    weakness: "Posicionamiento de café genérico; sin tostadora ni narrativa de origen",
    opportunity: "La visibilidad de la tostadora y el storytelling de bebidas con nombre de Ursa diferencian dentro de la misma cuadra",
    threat: "Absorbe a los buscadores casuales de café que no saben que Ursa está 50 metros más allá",
    ursaImplication: "Liderar con visibilidad de tostadora y bebidas con nombre para que el tráfico de la cuadra elija a Ursa sobre la opción genérica.",
  },
  {
    name: "Caficulto",
    area: "Miraflores · 83m",
    distinctiveness: 42,
    reach: 30,
    strength: "Naming enfocado en café; suficientemente cerca para compartir la cuadra de destino de café",
    weakness: "Identidad de marca limitada más allá del nombre; escala pequeña",
    opportunity: "La experiencia de dos barras y la atmósfera craft de Ursa superan a un posicionamiento de solo naming",
    threat: "Contribuye a la saturación de la cuadra — los clientes pueden conformarse con la opción más cercana",
    ursaImplication: "Competir en atmósfera craft y la experiencia de dos barras en vez de solo naming.",
  },
];

const QUADRANT_KEYS = {
  topRight: { labelKey: "content.swot.quadrant.top-right.label", descKey: "content.swot.quadrant.top-right.desc", color: "var(--color-ursa-forest-deep)", textColor: "var(--color-ursa-forest-deep)" },
  topLeft: { labelKey: "content.swot.quadrant.top-left.label", descKey: "content.swot.quadrant.top-left.desc", color: "var(--color-ursa-gold)", textColor: "var(--color-ursa-gold-text)" },
  bottomRight: { labelKey: "content.swot.quadrant.bottom-right.label", descKey: "content.swot.quadrant.bottom-right.desc", color: "var(--color-ursa-terracotta)", textColor: "var(--color-ursa-terracotta-text)" },
  bottomLeft: { labelKey: "content.swot.quadrant.bottom-left.label", descKey: "content.swot.quadrant.bottom-left.desc", color: "var(--color-ursa-sage)", textColor: "var(--color-ursa-sage-text)" },
};

export function SwotView() {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string>("Ursa");

  const selectedComp = COMPETITORS.find((c) => c.name === selected) || COMPETITORS[0];

  // Map scores to % positions (invert reach so high reach = right)
  const pos = (c: Competitor) => ({
    left: `${c.reach}%`,
    top: `${100 - c.distinctiveness}%`,
  });

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.swot.eyebrow")}
        title={t("content.view.swot.title")}
        lede={<>{t("content.swot.hero.lede", { n: COMPETITORS.length })}</>}
        meta={[
          { label: t("content.swot.meta.competitors"), value: t("content.swot.meta.competitors-value", { n: COMPETITORS.length }) },
          { label: t("content.swot.meta.axes"), value: t("content.swot.meta.axes-value") },
          { label: t("content.swot.meta.ursa"), value: t("content.swot.meta.ursa-value") },
        ]}
        tone="forest"
      />

      <ViewSection>
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 items-start [grid-template-columns:minmax(0,1fr)]">
          {/* The matrix */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="font-display text-lg font-semibold text-ursa-dark-roast m-0 flex items-center gap-2">
                <Swords size={18} className="text-ursa-gold-text" /> {t("content.swot.matrix.title")}
              </h3>
              <div className="flex items-center gap-3 text-[0.7rem] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-ursa-gold ring-2 ring-ursa-gold/30" /> {t("content.swot.matrix.legend-ursa")}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-ursa-forest-deep" /> {t("content.swot.matrix.legend-competitor")}
                </span>
              </div>
            </div>

            {/* The plot area with axis labels */}
            <div className="relative w-full pl-8 pb-8">
              <div className="relative aspect-square md:aspect-[4/3] w-full">
              {/* Y-axis label — positioned to the left, rotated, no clipping */}
              <span className="absolute top-1/2 -translate-y-1/2 -rotate-90 font-label text-[0.6rem] tracking-[0.16em] uppercase text-muted-foreground whitespace-nowrap origin-center" style={{ left: "-32px" }}>
                {t("content.swot.matrix.axis-y")}
              </span>
              {/* X-axis label — positioned below, centered, no overlap */}
              <span className="absolute left-1/2 -translate-x-1/2 font-label text-[0.6rem] tracking-[0.16em] uppercase text-muted-foreground whitespace-nowrap" style={{ bottom: "-24px" }}>
                {t("content.swot.matrix.axis-x")}
              </span>

              {/* Quadrant background tints */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-lg overflow-hidden border border-ursa-line-soft">
                <div className="bg-ursa-gold/5 border-r border-b border-ursa-line-soft/50 relative">
                  <span className="absolute top-2 left-2 font-label text-[0.58rem] tracking-[0.14em] uppercase" style={{ color: QUADRANT_KEYS.topLeft.textColor }}>{t(QUADRANT_KEYS.topLeft.labelKey)}</span>
                </div>
                <div className="bg-ursa-dark-roast/5 border-b border-ursa-line-soft/50 relative">
                  <span className="absolute top-2 right-2 font-label text-[0.58rem] tracking-[0.14em] uppercase text-right" style={{ color: QUADRANT_KEYS.topRight.textColor }}>{t(QUADRANT_KEYS.topRight.labelKey)}</span>
                </div>
                <div className="bg-muted border-r border-ursa-line-soft/50 relative">
                  <span className="absolute bottom-2 left-2 font-label text-[0.58rem] tracking-[0.14em] uppercase" style={{ color: QUADRANT_KEYS.bottomLeft.textColor }}>{t(QUADRANT_KEYS.bottomLeft.labelKey)}</span>
                </div>
                <div className="bg-ursa-terracotta/5 relative">
                  <span className="absolute bottom-2 right-2 font-label text-[0.58rem] tracking-[0.14em] uppercase text-right" style={{ color: QUADRANT_KEYS.bottomRight.textColor }}>{t(QUADRANT_KEYS.bottomRight.labelKey)}</span>
                </div>
              </div>

              {/* Crosshair lines */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-ursa-line/40" aria-hidden="true" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-ursa-line/40" aria-hidden="true" />

              {/* Competitor dots */}
              {COMPETITORS.map((c) => {
                const p = pos(c);
                const isSelected = c.name === selected;
                const isUrsa = c.isUrsa;
                return (
                  <button
                    key={c.name}
                    onClick={() => setSelected(c.name)}
                    aria-label={`${c.name} — ${t("content.swot.readout.distinctiveness")} ${c.distinctiveness}, ${t("content.swot.readout.reach")} ${c.reach}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 group"
                    style={{ left: p.left, top: p.top, zIndex: isSelected ? 20 : 10 }}
                  >
                    <span
                      className={cn(
                        "block rounded-full border-2 transition-all",
                        isUrsa ? "w-5 h-5" : "w-3.5 h-3.5",
                        isSelected && "scale-125"
                      )}
                      style={{
                        background: isUrsa ? "var(--color-ursa-gold)" : "var(--color-ursa-forest-deep)",
                        borderColor: isSelected ? "var(--color-ursa-dark-roast)" : isUrsa ? "var(--color-ursa-gold-soft)" : "var(--color-ursa-cream)",
                        boxShadow: isSelected ? "0 0 0 4px rgba(184,146,74,0.25)" : isUrsa ? "0 0 0 3px rgba(184,146,74,0.2)" : "none",
                      }}
                    />
                    {/* Label */}
                    <span
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 mt-1 font-label text-[0.58rem] tracking-[0.06em] uppercase whitespace-nowrap transition-opacity",
                        isUrsa || isSelected ? "opacity-100 text-ursa-dark-roast font-semibold" : "opacity-0 group-hover:opacity-100 text-muted-foreground"
                      )}
                      style={{ top: "100%" }}
                    >
                      {c.name}
                    </span>
                    {isUrsa && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2">
                        <BearMark size={18} className="text-ursa-dark-roast" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quadrant descriptions */}
            <div className="grid grid-cols-2 gap-2 mt-8 pt-4 border-t border-ursa-line-soft">
              {(Object.keys(QUADRANT_KEYS) as (keyof typeof QUADRANT_KEYS)[]).map((qk) => (
                <div key={qk} className="flex items-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm mt-1 shrink-0" style={{ background: QUADRANT_KEYS[qk].color }} />
                  <div>
                    <span className="font-label text-[0.62rem] tracking-[0.1em] uppercase text-ursa-dark-roast font-semibold">{t(QUADRANT_KEYS[qk].labelKey)}</span>
                    <p className="text-[0.72rem] text-muted-foreground m-0 leading-snug">{t(QUADRANT_KEYS[qk].descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </Card>

          {/* SWOT detail panel */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card highlight={selectedComp.isUrsa} className={cn(selectedComp.isUrsa && "border-ursa-gold")}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {selectedComp.isUrsa && <BearMark size={22} className="text-ursa-dark-roast" />}
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ursa-dark-roast m-0 leading-tight">{selectedComp.name}</h3>
                    <span className="font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">{selectedComp.area}</span>
                  </div>
                </div>
                {selectedComp.isUrsa && <Pill tone="gold">{t("content.swot.matrix.legend-ursa")}</Pill>}
              </div>

              {/* Position readout */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="rounded-lg bg-ursa-foam border border-ursa-line-soft p-2.5 text-center">
                  <div className="font-display text-xl font-semibold text-ursa-gold-text leading-none">{selectedComp.distinctiveness}</div>
                  <div className="font-label text-[0.54rem] tracking-[0.12em] uppercase text-muted-foreground mt-1">{t("content.swot.readout.distinctiveness")}</div>
                </div>
                <div className="rounded-lg bg-ursa-foam border border-ursa-line-soft p-2.5 text-center">
                  <div className="font-display text-xl font-semibold text-ursa-forest-deep leading-none">{selectedComp.reach}</div>
                  <div className="font-label text-[0.54rem] tracking-[0.12em] uppercase text-muted-foreground mt-1">{t("content.swot.readout.reach")}</div>
                </div>
              </div>

              {/* SWOT grid */}
              <div className="grid grid-cols-2 gap-2">
                <SwotCell label={t("content.swot.swot-cell.strengths")} icon={<TrendingUp size={12} />} tone="forest" text={selectedComp.strength} />
                <SwotCell label={t("content.swot.swot-cell.weaknesses")} icon={<AlertTriangle size={12} />} tone="terracotta" text={selectedComp.weakness} />
                <SwotCell label={t("content.swot.swot-cell.opportunities")} icon={<Eye size={12} />} tone="gold" text={selectedComp.opportunity} />
                <SwotCell label={t("content.swot.swot-cell.threats")} icon={<Swords size={12} />} tone="stop" text={selectedComp.threat} />
              </div>
            </Card>

            {/* Ursa implication */}
            <Card className="bg-gradient-to-br from-ursa-paper to-ursa-cream">
              <h4 className="font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-gold-text m-0 mb-2 flex items-center gap-1.5">
                <Info size={13} /> {t("content.swot.ursa-implication.heading")}
              </h4>
              <p className="text-[0.88rem] text-ursa-dark-roast m-0 leading-relaxed font-medium">{selectedComp.ursaImplication}</p>
            </Card>

            {/* Quick switch */}
            <Card className="bg-ursa-foam">
              <h4 className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground m-0 mb-2">{t("content.swot.quick-switch.heading")}</h4>
              <div className="flex flex-wrap gap-1.5">
                {COMPETITORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelected(c.name)}
                    className={cn(
                      "px-2.5 py-1 rounded-full font-label text-[0.6rem] tracking-[0.08em] uppercase border transition",
                      c.name === selected
                        ? "bg-ursa-dark-roast text-ursa-cream border-ursa-dark-roast"
                        : "bg-card text-muted-foreground border-ursa-line-soft hover:border-ursa-gold/60 hover:text-ursa-dark-roast"
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Strategic takeaway */}
        <Callout tone="forest" title={t("content.swot.callout.takeaway.title")}>
          <p className="m-0 text-[0.92rem]">
            {t("content.swot.callout.takeaway.body")}
          </p>
        </Callout>
      </ViewSection>

      {/* ============================================================
          SCIENCE — the research behind the matrix
         ============================================================ */}
      <ViewSection
        badge={t("content.swot.science.badge")}
        title={t("content.swot.science.title")}
        meta={t("content.swot.science.meta")}
      >
        <p className="text-[0.92rem] text-muted-foreground max-w-[78ch] m-0 mb-6">
          {t("content.swot.science.intro")}
        </p>

        {/* Group 1 — SWOT methodology science */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Microscope size={16} className="text-ursa-gold-text" />
          {t("content.swot.science.group.methodology")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {SWOT_METHODOLOGY.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} group="swot" />
          ))}
        </div>

        {/* Group 2 — Competitive positioning research */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Brain size={16} className="text-ursa-gold-text" />
          {t("content.swot.science.group.positioning")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {SWOT_POSITIONING.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} group="swot" />
          ))}
        </div>

        {/* Group 3 — 2×2 matrix science */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Grid size={16} className="text-ursa-gold-text" />
          {t("content.swot.science.group.matrix")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
          {SWOT_MATRIX.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} group="swot" />
          ))}
        </div>

        <Callout tone="gold" title={t("content.swot.science.synthesis.title")}>
          {t("content.swot.science.synthesis.body")}
        </Callout>
      </ViewSection>

      <ViewSection>
        <DossierLinkBanner moduleId="02-market-competitors-and-customer-voice" />
      </ViewSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Science cards — research that backs the SWOT view.
// Strings live under content.swot.science.card.{id}.{field} in i18n.ts.
// ---------------------------------------------------------------------------

type ScienceTone = "gold" | "forest" | "terracotta";

type ScienceEntry = {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone: ScienceTone;
};

const SWOT_METHODOLOGY: ScienceEntry[] = [
  { id: "weihrich-1982", icon: BookOpen, tone: "forest" },
  { id: "pickton-wright-1998", icon: Microscope, tone: "gold" },
  { id: "helms-nixon-2010", icon: GraduationCap, tone: "forest" },
  { id: "valentin-2001", icon: AlertTriangle, tone: "terracotta" },
];

const SWOT_POSITIONING: ScienceEntry[] = [
  { id: "sharp-2010", icon: Brain, tone: "gold" },
  { id: "romaniuk-sharp-2016", icon: Target, tone: "forest" },
  { id: "romaniuk-2018", icon: Fingerprint, tone: "gold" },
  { id: "ehrenberg-mcphee", icon: TrendingUp, tone: "terracotta" },
];

const SWOT_MATRIX: ScienceEntry[] = [
  { id: "bcg-1968", icon: Grid, tone: "forest" },
  { id: "kasavana-smith-1982", icon: Scale, tone: "gold" },
  { id: "median-split-limit", icon: AlertTriangle, tone: "terracotta" },
];

function ScienceCard({
  id,
  icon: Icon,
  tone,
  group,
}: {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone: ScienceTone;
  group: "swot";
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
            {t(`content.${group}.science.card.${id}.name`)}
          </h4>
          <p className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-muted-foreground m-0 mt-0.5">
            {t(`content.${group}.science.card.${id}.source`)}
          </p>
        </div>
      </div>
      <div className={cn("border-l-2 pl-2.5 py-1", accentBorder[tone])}>
        <p className="text-[0.82rem] italic text-ursa-dark-roast m-0 leading-snug">
          {t(`content.${group}.science.card.${id}.finding`)}
        </p>
      </div>
      <p className="text-[0.84rem] leading-relaxed text-foreground/85 m-0">
        {t(`content.${group}.science.card.${id}.apply`)}
      </p>
    </Card>
  );
}

function SwotCell({ label, icon, tone, text }: { label: string; icon: React.ReactNode; tone: "forest" | "terracotta" | "gold" | "stop"; text: string }) {
  const tones = {
    forest: "border-ursa-forest-deep/25 bg-ursa-dark-roast/5 text-ursa-forest-deep",
    terracotta: "border-ursa-terracotta/25 bg-ursa-terracotta/5 text-ursa-terracotta-text",
    gold: "border-ursa-gold/30 bg-ursa-gold/5 text-ursa-gold-text",
    stop: "border-ursa-terracotta/30 bg-ursa-terracotta/8 text-ursa-terracotta-text",
  };
  return (
    <div className={cn("rounded-lg border p-2.5", tones[tone])}>
      <div className="flex items-center gap-1 mb-1">
        {icon}
        <span className="font-label text-[0.56rem] tracking-[0.12em] uppercase">{label}</span>
      </div>
      <p className="text-[0.76rem] text-ursa-dark-roast m-0 leading-snug">{text}</p>
    </div>
  );
}
