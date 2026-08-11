"use client";
import { ViewHero, ViewSection, Card, Grid, Callout, EntityBadge } from "@/components/scif/view-shell";
import { ContextTooltip } from "@/components/scif/context-tooltip";
import { EvidenceTag, SourcePill, LifecycleTag, ClaimRef } from "@/components/scif/evidence";
import { TIMELINE, CLAIMS } from "@/lib/scif/data";
import { TimelineVisualizer } from "@/components/scif/tools/timeline-visualizer";
import { StrategicGantt } from "@/components/scif/tools/strategic-gantt";
import * as Lucide from "lucide-react";

const ENTITIES = [
  { id: "ORG_BRADESCO", name: "Organização Bradesco", type: "Holding / Grupo consolidado", country: "Brazil", parent: null, brands: "Bradesco, Bradesco Seguros, Next, Digio, Ágora, Inovabra", color: "#B91C3C", note: "Grupo multi-negocio: banca + seguros + digital" },
  { id: "BRADESCO_BANK", name: "Banco Bradesco S.A.", type: "Banco operativo (primary target)", country: "Brazil", parent: "ORG_BRADESCO", brands: "Bradesco, BIA, Bridge", color: "#B91C3C", note: "Sede Osasco (SP). R$2,33T activos FY2025" },
  { id: "BRADESCO_SEGUROS", name: "Bradesco Seguros S.A.", type: "Brazo de seguros", country: "Brazil", parent: "ORG_BRADESCO", brands: "Bradesco Seguros, Vida, Saúde", color: "#B91C3C", note: "ROAE 21,9% (más rentable que el banco)" },
  { id: "BRADESCO_BBI", name: "Banco Bradesco BBI", type: "Banca de inversión", country: "Brazil", parent: "ORG_BRADESCO", brands: "Bradesco BBI", color: "#B91C3C" },
  { id: "NEXT", name: "Next", type: "Marca digital (integrada)", country: "Brazil", parent: "BRADESCO_BANK", brands: "Next", color: "#B91C3C", note: "Reincorporado al banco matriz 2023-24 como segmento" },
  { id: "DIGIO", name: "Banco Digio S.A.", type: "Banco digital subsidiario", country: "Brazil", parent: "BRADESCO_BANK", brands: "Digio", color: "#B91C3C", note: "100% controlado; AWS (separado de Next/Azure)" },
  { id: "AGORA", name: "Ágora Corretora", type: "Corretaje / wealth", country: "Brazil", parent: "ORG_BRADESCO", brands: "Ágora", color: "#B91C3C", note: "Adquirida 2008" },
  { id: "INOVABRA", name: "Inovabra habitat", type: "Laboratorio de innovación", country: "Brazil", parent: "ORG_BRADESCO", brands: "Inovabra", color: "#B08D57", note: "230 startups, 80 empresas, 8 hubs (2026)" },
  { id: "BIA", name: "BIA — Bradesco Inteligência Artificial", type: "Asistente IA", country: "Brazil", parent: "BRADESCO_BANK", brands: "BIA", color: "#B91C3C", note: "Lanzado 2016 (Watson); 100% GenAI hoy" },
  { id: "BRIDGE", name: "Bridge — GenAI platform", type: "Plataforma GenAI corporativa", country: "Brazil", parent: "BRADESCO_BANK", brands: "Bridge", color: "#B91C3C", note: "500+ casos de uso; 70 a escala" },
];

const TYPE_ICONS: Record<string, Lucide.LucideIcon> = {
  FOUNDING: Lucide.Flag, ACQUISITION: Lucide.Handshake, PRODUCT_LAUNCH: Lucide.Rocket,
  INNOVATION_LAB: Lucide.Lightbulb, SUNSET: Lucide.Power, REORGANIZATION: Lucide.Shuffle,
  TECH_STRATEGY: Lucide.Server, AI_MILESTONE: Lucide.BrainCircuit, FINANCIAL_MILESTONE: Lucide.TrendingUp,
  INVESTMENT: Lucide.Banknote, DIVERSIFICATION: Lucide.Split, CSR: Lucide.Heart,
};

export function Module01History() {
  return (
    <>
      <ViewHero number="01" title="Compañía, Perímetro e Historia" subtitle="Estructura societaria y eras estratégicas"
        description="Entity resolution gate superado. Organização Bradesco (grupo) se distingue de Banco Bradesco S.A. (banco operativo). Las marcas digitales Next y Digio son subsidiarias controladas con perímetros distintos." />
      <div className="space-y-8">
        <ViewSection eyebrow="Entity registry" title="Mapa de entidades — Organização Bradesco">
          <Callout type="warn" title="Gate de resolución de entidades — bloqueante">
            Antes de confiar en cualquier fuente, cada entidad tiene un registro en EntityRegistry con nombre legal,
            alias, country, domains, parent, subsidiaries, known_brands y excluded_homonyms. Los homónimos erróneos
            (Nextel vs Next; BCP Bolivia vs BCP Perú) están en blacklist explícita.
          </Callout>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ENTITIES.map((e) => (
              <Card key={e.id}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: e.color }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm">{e.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{e.type}</p>
                    <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                      <p><span className="font-semibold">Parent:</span> {e.parent ?? "—"}</p>
                      <p><span className="font-semibold">País:</span> {e.country}</p>
                      <p><span className="font-semibold">Marcas:</span> {e.brands}</p>
                    </div>
                    {e.note && <p className="mt-2 text-xs italic text-foreground/70">{e.note}</p>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ViewSection>

        <ViewSection eyebrow="Perímetros de comparación" title="Gate de comparabilidad — bloqueante">
          <Grid>
            <Card>
              <h3 className="font-bold text-sm">Comparación A: Banco vs Banco</h3>
              <p className="mt-2 text-xs text-muted-foreground">Banco Bradesco S.A. (OPERATING_BANK, BRL, Brazil) vs BCP stand-alone (OPERATING_BANK, PEN, Peru)</p>
              <div className="mt-3">
                <span className="rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">VALID_WITH_NORMALIZATION</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Requiere conversión de moneda o comparación de ratios (no absolutos).</p>
            </Card>
            <Card>
              <h3 className="font-bold text-sm">Comparación B: Grupo vs Grupo</h3>
              <p className="mt-2 text-xs text-muted-foreground">Organização Bradesco (CONSOLIDATED_GROUP, BRL) vs Credicorp (CONSOLIDATED_GROUP, PEN)</p>
              <div className="mt-3">
                <span className="rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">CONDITIONALLY_VALID</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Ambos multi-negocio (banca+seguros+digital). Útil para estructura, no para ranking absoluto.</p>
            </Card>
          </Grid>
          <div className="mt-3">
            <Callout type="danger" title="Mezclas prohibidas">
              BCP + Credicorp + Yape + BCP Bolivia en un solo número · Bradesco Seguros vs BCP stand-alone (perímetro distinto) ·
              Next vs Yape como bancos independientes (Next es marca-dentro-banco; Yape es app-de-pagos-dentro-BCP).
            </Callout>
          </div>
        </ViewSection>

        <ViewSection eyebrow="Visualización interactiva" title="Línea temporal estratégica — explorador">
          <TimelineVisualizer />
        </ViewSection>

        <ViewSection eyebrow="Gantt estratégico" title="Timeline de iniciativas — vista Gantt con hitos">
          <StrategicGantt />
        </ViewSection>

        <ViewSection eyebrow="Línea temporal estratégica" title="Eras y eventos clave (1943–2026)">
          <div className="relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border sm:left-[27px]" />
            <ol className="space-y-3">
              {TIMELINE.map((t) => {
                const Icon = TYPE_ICONS[t.type] ?? Lucide.Circle;
                return (
                  <li key={`${t.year}-${t.event}`} className="relative flex gap-4">
                    <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background sm:h-14 sm:w-14">
                      <Icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-lg font-black text-primary">{t.year}</span>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{t.type.replace(/_/g, " ")}</span>
                      </div>
                      <p className="mt-0.5 font-semibold text-sm text-foreground">{t.event}</p>
                      <p className="text-xs text-muted-foreground">{t.significance}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </ViewSection>

        <ViewSection eyebrow="Disambiguación" title="Homónimos excluidos (blacklist)">
          <Card>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="text-red-500">✕</span><span><strong>BCP</strong> — excluye BCP Bolivia (subsidiaria, perímetro distinto), Border Control Point (aeropuerto), Bulk Copy Program (SQL Server)</span></li>
              <li className="flex items-start gap-2"><span className="text-red-500">✕</span><span><strong><ContextTooltip term="NEXT">Next</ContextTooltip></strong> — excluye Nextel (telecom), Next.js (framework)</span></li>
              <li className="flex items-start gap-2"><span className="text-red-500">✕</span><span><strong>Bridge</strong> — excluye otras empresas tecnológicas nombradas Bridge no relacionadas con la plataforma GenAI de Bradesco</span></li>
            </ul>
          </Card>
        </ViewSection>

        <ViewSection eyebrow="Claims de soporte" title="Evidencia de estructura y M&A">
          <div className="space-y-2">
            {CLAIMS.filter((c) => ["C010","C011","C012"].includes(c.claim_id)).map((c) => (
              <Card key={c.claim_id}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{c.claim}</p>
                  <LifecycleTag status={c.value as never} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <EvidenceTag status={c.evidence_status} />
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
