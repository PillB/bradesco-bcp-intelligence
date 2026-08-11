"use client";
import { ViewHero, ViewSection, Card, Grid, Callout, EntityBadge } from "@/components/scif/view-shell";
import { EvidenceTag } from "@/components/scif/evidence";
import { HYPOTHESES, CLAIMS } from "@/lib/scif/data";
import { ComparativeSWOT } from "@/components/scif/tools/comparative-swot";
import { ComparativeCharts } from "@/components/scif/tools/comparative-charts";
import { Scale, GitCompare, AlertTriangle } from "lucide-react";

export function Module13Compare() {
  return (
    <>
      <ViewHero number="13" title="Bradesco vs BCP" subtitle="Comparación estratégica"
        description="Gate de comparabilidad superado. Comparación A (banco vs banco) y B (grupo vs grupo). Hipótesis alternativas H1-H4. Red-team question set aplicado. Donde la comparación no es válida, se etiqueta NOT_DIRECTLY_COMPARABLE." />
      <div className="space-y-8">
        <ViewSection eyebrow="Gate de comparabilidad" title="Comparación A — Banco vs Banco">
          <Card>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <EntityBadge entity="BRADESCO" />
                <div>
                  <p className="text-xs font-semibold">Banco Bradesco S.A.</p>
                  <p className="text-[10px] text-muted-foreground">OPERATING_BANK · Brazil · BRL</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <EntityBadge entity="BCP" />
                <div>
                  <p className="text-xs font-semibold">Banco de Crédito del Perú</p>
                  <p className="text-[10px] text-muted-foreground">OPERATING_BANK · Peru · PEN</p>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs dark:border-emerald-800 dark:bg-emerald-950/30">
              <strong className="text-emerald-700 dark:text-emerald-300">VALID_WITH_NORMALIZATION</strong>
              <p className="mt-1 text-muted-foreground">Requiere conversión de moneda o comparación de ratios (ROAE, eficiencia, crecimiento %). No comparar absolutos sin normalización.</p>
            </div>
          </Card>
        </ViewSection>

        <ViewSection eyebrow="Gate de comparabilidad" title="Comparación B — Grupo vs Grupo">
          <Card>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <EntityBadge entity="BRADESCO" label="ORG BRADESCO" />
                <div>
                  <p className="text-xs font-semibold">Organização Bradesco</p>
                  <p className="text-[10px] text-muted-foreground">CONSOLIDATED_GROUP · Brazil · BRL</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <EntityBadge entity="CREDICORP" />
                <div>
                  <p className="text-xs font-semibold">Credicorp Ltd.</p>
                  <p className="text-[10px] text-muted-foreground">CONSOLIDATED_GROUP · Peru · PEN</p>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs dark:border-amber-800 dark:bg-amber-950/30">
              <strong className="text-amber-700 dark:text-amber-300">CONDITIONALLY_VALID</strong>
              <p className="mt-1 text-muted-foreground">Ambos multi-negocio (banca+seguros+digital). Útil para comparación estructural (mix de negocio), no para ranking absoluto.</p>
            </div>
          </Card>
        </ViewSection>

        <ViewSection eyebrow="Matriz comparativa" title="Bradesco vs BCP — dimensiones clave">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-3 py-2 font-semibold">Dimensión</th>
                  <th className="px-3 py-2 font-semibold">Bradesco</th>
                  <th className="px-3 py-2 font-semibold">BCP</th>
                  <th className="px-3 py-2 font-semibold">Comparabilidad</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="px-3 py-2 font-medium">Activos absolutos</td>
                  <td className="px-3 py-2">R$ 2,33 T</td>
                  <td className="px-3 py-2">S/ 204,9 mm</td>
                  <td className="px-3 py-2"><span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">NOT_COMPARABLE</span></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="px-3 py-2 font-medium">ROAE</td>
                  <td className="px-3 py-2">15,2%</td>
                  <td className="px-3 py-2">24,7%</td>
                  <td className="px-3 py-2"><span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">COMPARABLE</span></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="px-3 py-2 font-medium">Eficiencia</td>
                  <td className="px-3 py-2">50% (→40% en 2028)</td>
                  <td className="px-3 py-2">no disclosed con misma definición</td>
                  <td className="px-3 py-2"><span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">PARTIAL</span></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="px-3 py-2 font-medium">Asistente IA (retención)</td>
                  <td className="px-3 py-2">BIA — 90%</td>
                  <td className="px-3 py-2">no métrica pública equivalente</td>
                  <td className="px-3 py-2"><span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">NOT_COMPARABLE</span></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="px-3 py-2 font-medium">Casos de uso IA</td>
                  <td className="px-3 py-2">500+ (Bridge, auto-reportado)</td>
                  <td className="px-3 py-2">no equivalente público</td>
                  <td className="px-3 py-2"><span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">NOT_COMPARABLE</span></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="px-3 py-2 font-medium">Innovación (modelo)</td>
                  <td className="px-3 py-2">Inovabra habitat (abierto)</td>
                  <td className="px-3 py-2">Cartera disruptiva + Krealo</td>
                  <td className="px-3 py-2"><span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">CATEGORY_DISTINCT</span></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="px-3 py-2 font-medium">Open Finance</td>
                  <td className="px-3 py-2">MADURO (obligatorio)</td>
                  <td className="px-3 py-2">BCP Xplore (en desarrollo)</td>
                  <td className="px-3 py-2"><span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">PARTIAL</span></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="px-3 py-2 font-medium">Instant payments</td>
                  <td className="px-3 py-2">Pix (nacional, maduro)</td>
                  <td className="px-3 py-2">Yape (app, no nacional obligatorio)</td>
                  <td className="px-3 py-2"><span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">PARTIAL</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </ViewSection>

        <ViewSection eyebrow="Visualización recharts" title="Gráficos comparativos interactivos">
          <ComparativeCharts />
        </ViewSection>

        <ViewSection eyebrow="Herramienta interactiva" title="SWOT comparativo Bradesco vs BCP">
          <ComparativeSWOT />
        </ViewSection>

        <ViewSection eyebrow="Hipótesis alternativas" title="¿Por qué Bradesco comunica más IA que BCP?">
          <div className="space-y-3">
            {HYPOTHESES.map((h) => (
              <Card key={h.hypothesis_id}>
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">{h.hypothesis_id}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{h.hypothesis}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{h.explanation}</p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="rounded border border-emerald-200 bg-emerald-50 p-2 dark:border-emerald-800 dark:bg-emerald-950/20">
                        <p className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">Evidencia a favor</p>
                        <ul className="mt-1 text-[11px] text-muted-foreground">
                          {h.evidence_for.map((e) => <li key={e}>• {e}</li>)}
                        </ul>
                      </div>
                      <div className="rounded border border-red-200 bg-red-50 p-2 dark:border-red-800 dark:bg-red-950/20">
                        <p className="text-[10px] font-bold uppercase text-red-700 dark:text-red-300">Evidencia en contra</p>
                        <ul className="mt-1 text-[11px] text-muted-foreground">
                          {h.evidence_against.map((e) => <li key={e}>• {e}</li>)}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold">{h.status.replace(/_/g, " ")}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Callout type="warn" title="Síntesis — no discriminación concluyente">
            No se encontró evidencia pública que permita discriminar concluyentemente entre H1-H4. La conclusión reportada
            evita asignar la diferencia observada a una sola hipótesis. Declaradas como OPEN_QUESTIONS (OQ08).
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Red-team question set" title="Preguntas adversariales aplicadas">
          <Card>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" /><span><strong>¿Confundimos tamaño con capacidad?</strong> Sí, riesgo presente — Bradesco es ~11× mayor en activos absolutos. La comparación debe normalizar por mercado.</span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" /><span><strong>¿Confundimos publicidad con producción?</strong> Riesgo presente — los 500 casos de uso son auto-reportados, fuente única.</span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" /><span><strong>¿Confundimos conteo de pilotos con valor?</strong> No hay datos de conversión piloto→producción por unidad de inversión.</span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" /><span><strong>¿Comparamos grupo con banco operativo?</strong> Evitado — Comparison A y B están separadas explícitamente.</span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" /><span><strong>¿Están alineados los períodos?</strong> Sí — FY2025 para ambos.</span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" /><span><strong>¿Son las métricas semánticamente idénticas?</strong> No siempre — 'caso de uso', 'cliente digital', 'eficiencia' tienen definiciones distintas.</span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" /><span><strong>¿La infraestructura del país explica la diferencia?</strong> Parcialmente (H4) — Open Finance Brasil + Pix más maduros.</span></li>
              <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" /><span><strong>¿Podría la conclusión opuesta ajustarse a la misma evidencia?</strong> Sí — BCP podría ser igual de capaz pero comunicar distinto (H2).</span></li>
            </ul>
          </Card>
        </ViewSection>
      </div>
    </>
  );
}
