"use client";
import { ViewHero, ViewSection, Card, Grid, Callout } from "@/components/scif/view-shell";
import { ConfidenceMeter } from "@/components/scif/evidence";
import { RECOMMENDATIONS } from "@/lib/scif/data";
import { ScenarioBuilder } from "@/components/scif/tools/scenario-builder";
import { DependencyGraph } from "@/components/scif/tools/dependency-graph";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

const TRANSFERABILITY_ICON: Record<string, React.ReactNode> = {
  REASONABLE_TO_TRANSFER: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  REASONABLE_TO_LEARN_FROM: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  CONDITIONAL: <HelpCircle className="h-4 w-4 text-amber-500" />,
  NOT_EVIDENCE_BASED: <HelpCircle className="h-4 w-4 text-amber-500" />,
  DO_NOT_TRANSFER: <XCircle className="h-4 w-4 text-red-500" />,
};

export function Module14Lessons() {
  return (
    <>
      <ViewHero number="14" title="Lecciones y Opciones Estratégicas" subtitle="Qué transferir, qué no"
        description="Cada recomendación expone su claim-graph: supporting_claim_ids[], contradicting_claim_ids[], assumptions[], confidence, what_would_change_my_mind. Una recomendación sin contradicting_claim_ids y sin what_would_change_my_mind es incompleta." />
      <div className="space-y-8">
        <ViewSection eyebrow="Claim → Conclusion graph" title="Cada lección tiene su cadena de razonamiento">
          <Callout type="info" title="Estructura exigida">
            SOURCE → CLAIM → INTERMEDIATE FINDING → COMPARISON → INTERPRETATION → STRATEGIC IMPLICATION.
            Cada recomendación requiere supporting_claim_ids[], contradicting_claim_ids[], assumptions[],
            confidence, y what_would_change_my_mind.
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Recomendaciones" title="Lecciones para BCP / Perú">
          <div className="space-y-4">
            {RECOMMENDATIONS.map((r) => (
              <Card key={r.rec_id}>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">{r.rec_id.replace("REC", "")}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm">{r.title}</h3>
                      <span className="flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px] font-bold uppercase">
                        {TRANSFERABILITY_ICON[r.transferability]}
                        {r.transferability.replace(/_/g, " ")}
                      </span>
                      <ConfidenceMeter value={r.confidence} />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-muted-foreground">Audiencia: {r.audience}</p>
                    <p className="mt-2 text-sm text-foreground/90">{r.action}</p>

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="rounded-md border border-border/60 p-2">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Supporting claims</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {r.supporting_claim_ids.length > 0 ? r.supporting_claim_ids.map((c) => (
                            <span key={c} className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{c}</span>
                          )) : <span className="text-[10px] text-muted-foreground italic">none</span>}
                        </div>
                      </div>
                      <div className="rounded-md border border-border/60 p-2">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Contradicting claims</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {r.contradicting_claim_ids.length > 0 ? r.contradicting_claim_ids.map((c) => (
                            <span key={c} className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">{c}</span>
                          )) : <span className="text-[10px] text-muted-foreground italic">none disclosed</span>}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 rounded-md bg-muted/30 p-2">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Supuestos</p>
                      <ul className="mt-1 text-[11px] text-muted-foreground">
                        {r.assumptions.map((a) => <li key={a}>• {a}</li>)}
                      </ul>
                    </div>

                    <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-950/20">
                      <p className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300">¿Qué cambiaría mi conclusión?</p>
                      <p className="mt-1 text-[11px] text-foreground/80">{r.what_would_change_my_mind}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ViewSection>

        <ViewSection eyebrow="Grafo de dependencias" title="Cadena de razonamiento — Recomendación → Claim → Fuente">
          <DependencyGraph />
        </ViewSection>

        <ViewSection eyebrow="Herramienta interactiva" title="Constructor de escenarios estratégicos">
          <ScenarioBuilder />
        </ViewSection>

        <ViewSection eyebrow="Síntesis" title="Qué es razonablemente transferible">
          <Grid>
            <Card>
              <h3 className="font-bold text-sm text-emerald-600">Razonablemente transferible</h3>
              <p className="mt-2 text-xs text-muted-foreground">Centralizar una plataforma GenAI con gobernanza única (Bridge pattern). La lógica de capa horizontal con guardrails no depende del tamaño del banco.</p>
            </Card>
            <Card>
              <h3 className="font-bold text-sm text-amber-600">Condicional</h3>
              <p className="mt-2 text-xs text-muted-foreground">Evaluar consolidación de marcas digitales fragmentadas. Depende de si el banco matriz alcanzó madurez digital propia.</p>
            </Card>
            <Card>
              <h3 className="font-bold text-sm text-red-600">No transferir sin más evidencia</h3>
              <p className="mt-2 text-xs text-muted-foreground">Cifras específicas de Bradesco (90% retención BIA, 500 casos Bridge, 40x costo) — no usar como benchmarks objetivos sin reconciliación de definición.</p>
            </Card>
          </Grid>
        </ViewSection>
      </div>
    </>
  );
}
