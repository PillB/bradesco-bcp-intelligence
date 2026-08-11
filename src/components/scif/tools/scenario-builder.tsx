"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { Layers, Plus, X, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScenarioAction {
  id: string;
  label: string;
  impact: "high" | "medium" | "low";
  transferability: "reasonable" | "conditional" | "not-evidence" | "do-not";
  description: string;
}

const ACTIONS: ScenarioAction[] = [
  { id: "genai-platform", label: "Plataforma GenAI centralizada (tipo Bridge)", impact: "high", transferability: "reasonable", description: "Capa horizontal de GenAI con guardrails centralizados. Recomendación REC01." },
  { id: "consolidate-brands", label: "Consolidar marcas digitales fragmentadas", impact: "medium", transferability: "conditional", description: "Evaluar costos de coordinación vs beneficios de segmentación. REC02." },
  { id: "habitat-model", label: "Adoptar modelo habitat físico (Inovabra)", impact: "medium", transferability: "not-evidence", description: "Sin evidencia de ROI superior vs cartera de venture. REC03." },
  { id: "avoid-benchmarks", label: "No usar cifras Bradesco como benchmark directo", impact: "high", transferability: "do-not", description: "Ajustar por definición de métrica y escala. REC04." },
  { id: "open-finance-prep", label: "Preparar para Open Finance maduro", impact: "high", transferability: "reasonable", description: "Mapear capacidades Bradesco Open Finance para horizonte peruano. REC05." },
  { id: "yape-expand", label: "Expandir Yape más allá de pagos", impact: "medium", transferability: "conditional", description: "Servicios financieros adicionales sobre base Yape." },
  { id: "cix-scale", label: "Escalar CIX con métricas de ROI", impact: "medium", transferability: "reasonable", description: "CIX activo (+1 década); formalizar ROI como Inovabra Ventures." },
  { id: "fico-fraud", label: "Implementar plataforma fraude tipo FICO", impact: "high", transferability: "reasonable", description: "Bradesco logró -25% rechazos con FICO. Patrón replicable." },
];

const IMPACT_COLOR = { high: "#DC2626", medium: "#F59E0B", low: "#6B7280" };
const TRANSFER_LABEL = {
  reasonable: { label: "Transferible", color: "#16A34A" },
  conditional: { label: "Condicional", color: "#F59E0B" },
  "not-evidence": { label: "Sin evidencia", color: "#6B7280" },
  "do-not": { label: "No transferir", color: "#DC2626" },
};

export function ScenarioBuilder() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set(["genai-platform", "open-finance-prep"]));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedActions = ACTIONS.filter((a) => selected.has(a.id));
  const highImpactCount = selectedActions.filter((a) => a.impact === "high").length;
  const reasonableCount = selectedActions.filter((a) => a.transferability === "reasonable").length;
  const score = selectedActions.reduce((sum, a) => sum + (a.impact === "high" ? 3 : a.impact === "medium" ? 2 : 1), 0);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Constructor de Escenarios Estratégicos</h3>
            <p className="text-[11px] text-muted-foreground">Selecciona acciones para construir un escenario para BCP/Perú</p>
          </div>
        </div>
        {selected.size > 0 && (
          <button onClick={() => setSelected(new Set())} className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[10px] font-semibold text-muted-foreground hover:bg-muted">
            <X className="h-3 w-3" /> Limpiar
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Available actions */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Acciones disponibles ({ACTIONS.length})</p>
          <div className="max-h-[400px] space-y-1.5 overflow-y-auto pr-1">
            {ACTIONS.map((a) => {
              const isSelected = selected.has(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggle(a.id)}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-lg border p-2 text-left transition-all",
                    isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30 hover:bg-muted/30"
                  )}
                >
                  <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border", isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
                    {isSelected && <span className="text-[10px]">✓</span>}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">{a.label}</p>
                    <p className="text-[10px] text-muted-foreground">{a.description}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="rounded px-1 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: IMPACT_COLOR[a.impact] }}>{a.impact}</span>
                      <span className="rounded px-1 py-0.5 text-[9px] font-bold" style={{ color: TRANSFER_LABEL[a.transferability].color, border: `1px solid ${TRANSFER_LABEL[a.transferability].color}` }}>{TRANSFER_LABEL[a.transferability].label}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scenario summary */}
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            <p className="text-xs font-bold">Escenario construido</p>
          </div>

          {selectedActions.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
              Selecciona acciones para construir tu escenario estratégico
            </div>
          ) : (
            <>
              {/* Score panel */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-border bg-card p-2 text-center">
                  <p className="text-[9px] font-bold uppercase text-muted-foreground">Acciones</p>
                  <p className="text-xl font-black text-primary">{selectedActions.length}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-2 text-center">
                  <p className="text-[9px] font-bold uppercase text-muted-foreground">Alto impacto</p>
                  <p className="text-xl font-black text-red-600">{highImpactCount}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-2 text-center">
                  <p className="text-[9px] font-bold uppercase text-muted-foreground">Score</p>
                  <p className="text-xl font-black text-emerald-600">{score}</p>
                </div>
              </div>

              {/* Selected list */}
              <div className="mt-3 space-y-1.5">
                {selectedActions.map((a) => (
                  <div key={a.id} className="flex items-start gap-2 rounded-md border border-border bg-card p-2">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: IMPACT_COLOR[a.impact] }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold">{a.label}</p>
                      <p className="text-[10px] text-muted-foreground">{a.description}</p>
                    </div>
                    <button onClick={() => toggle(a.id)} className="text-muted-foreground hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Recommendation */}
              <div className="mt-3 rounded-md border border-primary/20 bg-primary/5 p-2 text-[11px]">
                <p className="font-bold text-primary">Recomendación del escenario</p>
                <p className="mt-1 text-foreground/80">
                  {reasonableCount >= 2
                    ? `Escenario balanceado con ${reasonableCount} acciones razonablemente transferibles. Priorizar implementación con métricas de ROI claras.`
                    : reasonableCount === 1
                    ? "Escenario conservador. Considerar agregar más acciones transferibles para maximizar aprendizaje."
                    : "Escenario de bajo retorno esperado. Revisar transferibilidad antes de proceder."}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
