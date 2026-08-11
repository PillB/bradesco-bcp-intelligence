"use client";
import { ViewHero, ViewSection, Card, Grid, Callout, StatBlock } from "@/components/scif/view-shell";
import { ContextTooltip } from "@/components/scif/context-tooltip";
import { EvidenceTag, SourcePill } from "@/components/scif/evidence";
import { ROADMAP, KPIS } from "@/lib/scif/data";
import { KpiGaugeDashboard } from "@/components/scif/tools/kpi-gauge-dashboard";
import { Target, Flag, TrendingUp } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  ACHIEVED: "#16A34A",
  IN_PROGRESS: "#F59E0B",
  TARGET: "#6366F1",
};

export function Module15Roadmap() {
  return (
    <>
      <ViewHero number="15" title="Roadmap, Experimentos y KPIs" subtitle="Seguimiento y métricas"
        description="Roadmap declarado de Bradesco (eficiencia 40% en 2028, inversión tech +16% 2026) y Credicorp (Yape 16,5M usuarios, 10% ingresos disruptivos 2026). KPIs con trazabilidad de fuente." />
      <div className="space-y-8">
        <ViewSection eyebrow="Roadmap" title="Items de roadmap por año">
          <div className="space-y-3">
            {[2026, 2028].map((year) => (
              <Card key={year}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-12 items-center justify-center rounded-lg bg-primary font-black text-primary-foreground">{year}</span>
                </div>
                <div className="space-y-2">
                  {ROADMAP.filter((r) => r.year === String(year)).map((r, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-md border border-border/60 p-2">
                      <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: STATUS_COLORS[r.status] ?? "#6B7280" }} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">{r.item}</p>
                          <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: STATUS_COLORS[r.status] ?? "#6B7280" }}>{r.status.replace(/_/g, " ")}</span>
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold">{r.owner}</span>
                        </div>
                        <div className="mt-1"><SourcePill sourceId={r.source} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </ViewSection>

        <ViewSection eyebrow="Dashboard animado" title="Gauges de KPIs — progreso visual">
          <KpiGaugeDashboard />
        </ViewSection>

        <ViewSection eyebrow="KPIs" title="Métricas clave con trazabilidad">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-3 py-2 font-semibold">Métrica</th>
                  <th className="px-3 py-2 font-semibold">Valor actual</th>
                  <th className="px-3 py-2 font-semibold">Meta</th>
                  <th className="px-3 py-2 font-semibold">Período</th>
                  <th className="px-3 py-2 font-semibold">Fuente</th>
                </tr>
              </thead>
              <tbody>
                {KPIS.map((k, idx) => (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="px-3 py-2 font-medium">{k.metric}</td>
                    <td className="px-3 py-2 font-bold tabular-nums">{k.value}</td>
                    <td className="px-3 py-2 text-muted-foreground">{k.target}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{k.period}</td>
                    <td className="px-3 py-2"><SourcePill sourceId={k.source} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ViewSection>

        <ViewSection eyebrow="Stop rules" title="Reglas de parada y stop-loss">
          <Callout type="warn" title="Principio del framework — stop rules explícitos">
            Cada experimento debe tener un stop rule definido (umbral de éxito/fracaso, plazo, presupuesto). Los
            experimentos sin stop rule tienden a perpetuarse sin conversión a producción. Bradesco no publica stop rules
            explícitos por iniciativa — esto es una OPEN_QUESTION para futura investigación.
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Resumen ejecutivo" title="Trayectoria 2025-2028">
          <Grid>
            <StatBlock label="Bradesco — eficiencia" value="50% → 40%" sub="Meta 2028 (desde 2025)" accent="primary" />
            <StatBlock label="Bradesco — inversión tech" value="+16%" sub="2026 proyectado vs 2025" accent="primary" />
            <StatBlock label="Credicorp — disrupción" value="10%" sub="Meta ingresos ajustados 2026" accent="teal" />
            <StatBlock label="Yape — usuarios" value="16,5M" sub="Meta 2026" accent="teal" />
          </Grid>
        </ViewSection>
      </div>
    </>
  );
}
