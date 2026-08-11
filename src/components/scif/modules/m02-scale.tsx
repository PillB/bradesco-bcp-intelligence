"use client";
import { ViewHero, ViewSection, Card, Grid, StatBlock, Callout } from "@/components/scif/view-shell";
import { ContextTooltip } from "@/components/scif/context-tooltip";
import { EvidenceTag, SourcePill, ConfidenceMeter } from "@/components/scif/evidence";
import { SCALE_ENTITIES, CLAIMS } from "@/lib/scif/data";
import { ScaleComparator } from "@/components/scif/tools/scale-comparator";
import { MetricNormalizer } from "@/components/scif/tools/metric-normalizer";
import { ComparativeSankey } from "@/components/scif/tools/comparative-sankey";
import { FinancialWaterfall } from "@/components/scif/tools/financial-waterfall";
import * as React from "react";

export function Module02Scale() {
  const [entityFilter, setEntityFilter] = React.useState<string>("ALL");
  const entities = entityFilter === "ALL" ? SCALE_ENTITIES : SCALE_ENTITIES.filter((e) => e.entity_id === entityFilter);

  const bradesco = SCALE_ENTITIES[0];
  const seguros = SCALE_ENTITIES[1];
  const bcp = SCALE_ENTITIES[2];
  const credicorp = SCALE_ENTITIES[3];

  return (
    <>
      <ViewHero number="02" title="Escala, Economía y Posición" subtitle="Activos, rentabilidad, eficiencia"
        description="Scorecard de escala con trazabilidad fuente-por-fuente. Comparación A (banco vs banco) requiere normalización de moneda; Comparación B (grupo vs grupo) es estructural." />
      <div className="space-y-8">
        <ViewSection eyebrow="Scorecard interactivo" title="Selector de entidad">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setEntityFilter("ALL")} className={`rounded-md border px-3 py-1 text-xs font-semibold ${entityFilter === "ALL" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}>Todas</button>
            {SCALE_ENTITIES.map((e) => (
              <button key={e.entity_id} onClick={() => setEntityFilter(e.entity_id)} className={`rounded-md border px-3 py-1 text-xs font-semibold ${entityFilter === e.entity_id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}>
                {e.entity_id.replace(/_/g, " ")}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {entities.map((e) => (
              <Card key={e.entity_id}>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{e.entity_id.replace(/_/g, " ")}</h3>
                    <p className="text-xs text-muted-foreground">{e.perimeter.replace(/_/g, " ")} · {e.geography} · {e.currency} · as-of {e.as_of}</p>
                  </div>
                  {e.entity_id.startsWith("BRADESCO") && <span className="rounded bg-[#B91C3C] px-1.5 py-0.5 text-[10px] font-bold text-white">BRADESCO</span>}
                  {e.entity_id === "BCP" && <span className="rounded bg-[#0F766E] px-1.5 py-0.5 text-[10px] font-bold text-white">BCP</span>}
                  {e.entity_id === "CREDICORP" && <span className="rounded bg-[#7C3AED] px-1.5 py-0.5 text-[10px] font-bold text-white">CREDICORP</span>}
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {e.metrics.map((m) => (
                      <tr key={m.metric} className="border-b border-border/50 last:border-0">
                        <td className="py-1.5 pr-2 text-xs text-muted-foreground capitalize">{m.metric.replace(/_/g, " ")}</td>
                        <td className="py-1.5 text-right font-bold tabular-nums">{m.display}</td>
                        <td className="py-1.5 pl-2 text-right">
                          {m.yoy && <span className="text-[10px] font-semibold text-emerald-600">{m.yoy}</span>}
                          {m.target && <span className="block text-[10px] text-amber-600">→ {m.target}</span>}
                        </td>
                        <td className="py-1.5 pl-2"><SourcePill sourceId={m.source} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </Card>
            ))}
          </div>
        </ViewSection>

        <ViewSection eyebrow="Comparación A" title="Banco Bradesco vs BCP stand-alone">
          <Grid>
            <StatBlock label="Activos totales (absoluto)" value="NOT_COMPARABLE" sub="R$2,33T vs S/204,9B — mezcla moneda + escala" accent="muted" />
            <StatBlock label="ROAE (dimensión)" value="15,2% vs 24,7%" sub="BCP significativamente más rentable" accent="teal" />
            <StatBlock label="Crecimiento recurrente" value="+26,1% (Bradesco)" sub="Trayectoria de mejora" accent="primary" />
            <StatBlock label="Costo de riesgo BCP" value="1,28%" sub="Cayó de 2,13% — impulsor del ROAE" accent="teal" />
          </Grid>
          <Callout type="warn" title="¿Por qué BCP es más rentable?">
            El ROAE (Retorno sobre Patrimonio Promedio — mide rentabilidad sobre patrimonio promedio) de BCP (24,7%) supera al de Bradesco (15,2%) en parte por una caída fuerte del costo de riesgo
            (de 2,13% a 1,28% en 2025) y en parte por la diferencia de ciclo de crédito y estructura de mercado entre
            Brasil y Perú. La diferencia puede reflejar <strong>ciclo y estructura, no solo capacidad operativa</strong>.
            Etiquetado COMPARABLE (dimensión) con nota explícita.
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Herramienta interactiva" title="Comparador de escala con normalización (OQ04)">
          <ScaleComparator />
        </ViewSection>

        <ViewSection eyebrow="Calculadora avanzada" title="Normalizador de métricas — ajusta FX en tiempo real">
          <MetricNormalizer />
        </ViewSection>

        <ViewSection eyebrow="Comparación B" title="Organização Bradesco vs Credicorp (grupo)">
          <Card>
            <p className="text-sm text-foreground/90">
              Ambos son holdings multi-negocio (banca + seguros + digital). Credicorp consolida BCP (75,6% de activos del grupo),
              Mibanco (microfinanzas), Grupo Pacífico (seguros), Prima AFP y las iniciativas disruptivas (Yape, Tenpo, Culqi, iO).
              Organização Bradesco consolida el banco matriz, Bradesco Seguros, BBI, Ágora, Digio y la marca Next.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Útil para comparación estructural (mix de negocio), no para ranking absoluto — la asimetría de escala de mercado persiste.
            </p>
          </Card>
        </ViewSection>

        <ViewSection eyebrow="Waterfall financiero" title="Descomposición drivers — Resultado recurrente 2024→2025">
          <FinancialWaterfall />
        </ViewSection>

        <ViewSection eyebrow="Flujo Sankey" title="Flujo Entidad → Segmento → Rentabilidad">
          <ComparativeSankey />
        </ViewSection>

        <ViewSection eyebrow="Rentabilidad por brazo" title="Bradesco Seguros vs Bradesco Banco">
          <Grid>
            <StatBlock label="ROAE Bradesco Banco (4T25)" value="15,2%" sub="Resultado recurrente R$24,7B" accent="primary" />
            <StatBlock label="ROAE Bradesco Seguros (2025)" value="21,9%" sub="Utilidad neta R$10,1B" accent="gold" />
          </Grid>
          <Callout type="info" title="El brazo de seguros supera al bancario en rentabilidad">
            Relevante para la comparación grupo-a-grupo con Credicorp (que también tiene Grupo Pacífico). Sugiere que
            la diversificación banca+seguros es estructuralmente valorativa en ambos grupos.
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Claims de soporte" title="Trazabilidad de cifras clave">
          <div className="space-y-2">
            {CLAIMS.filter((c) => ["C001","C002","C003","C004","C013","C014","C016"].includes(c.claim_id)).map((c) => (
              <Card key={c.claim_id}>
                <p className="text-sm font-medium">{c.claim}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <EvidenceTag status={c.evidence_status} />
                  <ConfidenceMeter value={c.confidence} />
                  <span className="text-[11px] text-muted-foreground">As-of: {c.as_of_date}</span>
                  {c.source_ids.map((s) => <SourcePill key={s} sourceId={s} />)}
                </div>
              </Card>
            ))}
          </div>
        </ViewSection>
      </div>
    </>
  );
}
