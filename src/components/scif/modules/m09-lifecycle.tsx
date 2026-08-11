"use client";
import { ViewHero, ViewSection, Card, Grid, Callout, StatBlock } from "@/components/scif/view-shell";
import { ContextTooltip } from "@/components/scif/context-tooltip";
import { EvidenceTag, SourcePill, LifecycleTag } from "@/components/scif/evidence";
import { INITIATIVES } from "@/lib/scif/data";
import { InitiativeFunnel } from "@/components/scif/tools/initiative-funnel";
import { theme } from "@/lib/scif/theme";

export function Module09Lifecycle() {
  const counts = INITIATIVES.reduce((acc, i) => {
    acc[i.lifecycle] = (acc[i.lifecycle] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <ViewHero number="09" title="Ciclo de Vida de Iniciativas" subtitle="Éxitos, experimentos, sunsets"
        description="Clasificación de ciclo de vida para productos, marcas y plataformas. Promesa original vs resultado posterior. Distinción crítica: INTEGRATED ≠ FAILED, SUNSET requiere confirmación, UNKNOWN es aceptable." />
      <div className="space-y-8">
        <ViewSection eyebrow="Dashboard de ciclo de vida" title="Distribución de iniciativas por estado">
          <Grid>
            {Object.entries(counts).map(([status, count]) => {
              const cfg = theme.lifecycle[status as keyof typeof theme.lifecycle] ?? theme.lifecycle.UNKNOWN;
              return (
                <StatBlock key={status} label={cfg.label} value={String(count)} accent="primary" />
              );
            })}
          </Grid>
        </ViewSection>

        <ViewSection eyebrow="Visualización interactiva" title="Funnel de iniciativas — SIGNAL → PRODUCTION → MATURE">
          <InitiativeFunnel />
        </ViewSection>

        <ViewSection eyebrow="Explorador de iniciativas" title="Promesa original vs resultado">
          <div className="space-y-3">
            {INITIATIVES.map((i) => {
              const cfg = theme.lifecycle[i.lifecycle as keyof typeof theme.lifecycle] ?? theme.lifecycle.UNKNOWN;
              return (
                <Card key={i.initiative_id}>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-sm">{i.name}</h3>
                        <LifecycleTag status={i.lifecycle} />
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{i.category}</span>
                        <span className="text-[10px] text-muted-foreground">{i.first_seen} → {i.last_seen}</span>
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-md border border-border/60 bg-muted/20 p-2">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">Promesa original</p>
                          <p className="mt-1 text-xs text-foreground/80">{i.original_promise}</p>
                        </div>
                        <div className="rounded-md border border-border/60 bg-muted/20 p-2">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">Resultado posterior</p>
                          <p className="mt-1 text-xs text-foreground/80">{i.later_outcome}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-xs italic text-muted-foreground"><strong>Interpretación:</strong> {i.interpretation}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <EvidenceTag status={i.evidence_status} />
                        {i.source_ids.map((s) => <SourcePill key={s} sourceId={s} />)}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ViewSection>

        <ViewSection eyebrow="Criterios de éxito/fracaso" title="Qué cuenta como SUCCESS o FAILED">
          <Card>
            <h3 className="font-bold text-sm">Evidencia de éxito posible</h3>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>• Adopción / usuarios / transacciones</li>
              <li>• Ingresos / margen / productividad / reducción de costo</li>
              <li>• Reducción de riesgo / conversión / time-to-market</li>
              <li>• Expansión de negocio / deployment repetido / scale por unidad de negocio</li>
              <li>• Inversión sostenida</li>
            </ul>
          </Card>
          <Card className="mt-3">
            <h3 className="font-bold text-sm">Evidencia de fracaso posible</h3>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>• Cierre explícito / write-off / abandono</li>
              <li>• KPI fallido / admisión de management</li>
              <li>• Retiro tras prueba / rechazo regulatorio</li>
              <li>• Incapacidad material de escalar</li>
            </ul>
          </Card>
          <Callout type="info" title="Distinciones intermedias">
            SUCCESS · PARTIAL_SUCCESS · LEARNING_EXPERIMENT · INTEGRATED · REBRANDED · SUNSET · FAILED · UNKNOWN.
            Un award o elogio ejecutivo <strong>no cuenta como éxito</strong> por sí solo.
          </Callout>
        </ViewSection>
      </div>
    </>
  );
}
