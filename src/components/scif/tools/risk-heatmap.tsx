"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { Grid3x3, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskItem {
  id: string;
  label: string;
  likelihood: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  category: "regulatory" | "competitive" | "tech" | "financial" | "operational";
  entity: "Bradesco" | "BCP" | "Ambos";
  mitigation?: string;
}

const RISKS: RiskItem[] = [
  { id: "R01", label: "Marco Legal da IA (Brasil)", likelihood: 3, impact: 4, category: "regulatory", entity: "Bradesco", mitigation: "Guardrails centralizados en Bridge; monitoreo regulatorio" },
  { id: "R02", label: "Competencia fintechs digitales (Nubank)", likelihood: 4, impact: 3, category: "competitive", entity: "Bradesco", mitigation: "Next segmento; Bridge GenAI; eficiencia 40% meta" },
  { id: "R03", label: "Ciclo crédito brasileño volátil", likelihood: 3, impact: 4, category: "financial", entity: "Bradesco", mitigation: "Diversificación seguros (ROAE 21.9%)" },
  { id: "R04", label: "Bridge single-source (era)", likelihood: 2, impact: 3, category: "tech", entity: "Bradesco", mitigation: "RESUELTO: corroborado por Forbes/RedHat/FundsSociety" },
  { id: "R05", label: "Fragmentación marcas (Next/Digio/Bitz)", likelihood: 2, impact: 2, category: "operational", entity: "Bradesco", mitigation: "Bitz sunset; Next integrado; Digio consolidado" },
  { id: "R06", label: "Open Finance Perú menos maduro", likelihood: 3, impact: 3, category: "regulatory", entity: "BCP", mitigation: "BCP Xplore APIs; preparación horizonte REC05" },
  { id: "R07", label: "Entrada fintechs globales Perú", likelihood: 3, impact: 3, category: "competitive", entity: "BCP", mitigation: "Yape expansión; NPS +3 ventaja" },
  { id: "R08", label: "Dependencia ciclo económico Perú", likelihood: 3, impact: 3, category: "financial", entity: "BCP", mitigation: "Diversificación grupo (Mibanco, Prima AFP)" },
  { id: "R09", label: "Cyber resilience (UNKNOWN)", likelihood: 2, impact: 5, category: "tech", entity: "Ambos", mitigation: "PendingRecord — sin evidencia pública específica" },
  { id: "R10", label: "GNN/synthetic data (UNKNOWN)", likelihood: 1, impact: 2, category: "tech", entity: "Ambos", mitigation: "PendingRecord — no evidence of gap or capability" },
  { id: "R11", label: "Quantum threat a encriptación", likelihood: 1, impact: 5, category: "tech", entity: "Bradesco", mitigation: "IBM Research piloto quantum-safe encryption" },
  { id: "R12", label: "Stablecoin regulatory uncertainty", likelihood: 3, impact: 3, category: "regulatory", entity: "Bradesco", mitigation: "Parfin partnership; R$10B capital increase prepara custodia" },
];

const CATEGORY_COLORS: Record<string, string> = {
  regulatory: "#7C3AED",
  competitive: "#DC2626",
  tech: "#1D4ED8",
  financial: "#D97706",
  operational: "#0891B2",
};

const ENTITY_SHAPES: Record<string, string> = {
  Bradesco: "circle",
  BCP: "square",
  Ambos: "triangle",
};

function riskColor(likelihood: number, impact: number): string {
  const score = likelihood * impact;
  if (score >= 16) return "#DC2626"; // critical
  if (score >= 12) return "#EA580C"; // high
  if (score >= 8) return "#F59E0B"; // medium
  if (score >= 4) return "#84CC16"; // low
  return "#22C55E"; // minimal
}

function riskLabel(likelihood: number, impact: number): string {
  const score = likelihood * impact;
  if (score >= 16) return "Crítico";
  if (score >= 12) return "Alto";
  if (score >= 8) return "Medio";
  if (score >= 4) return "Bajo";
  return "Mínimo";
}

export function RiskHeatmap() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const selectedRisk = RISKS.find((r) => r.id === selected);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Grid3x3 className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Heatmap de Riesgos — Probabilidad × Impacto</h3>
            <p className="text-[11px] text-muted-foreground">{RISKS.length} riesgos mapeados · click para ver mitigación</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
        {/* Matrix */}
        <div className="overflow-x-auto">
          <div className="relative min-w-[400px]">
            {/* Y-axis label */}
            <div className="absolute -left-1 top-1/2 -rotate-90 -translate-y-1/2 text-[10px] font-bold uppercase text-muted-foreground" style={{ transformOrigin: "left center", transform: "rotate(-90deg) translateX(-50%)", left: -20 }}>Impacto →</div>

            <table className="border-collapse">
              <tbody>
                {[5, 4, 3, 2, 1].map((impact) => (
                  <tr key={impact}>
                    <td className="w-6 pr-1 text-right text-[10px] font-bold text-muted-foreground">{impact}</td>
                    {[1, 2, 3, 4, 5].map((likelihood) => {
                      const cellRisks = RISKS.filter((r) => r.likelihood === likelihood && r.impact === impact);
                      const bgColor = riskColor(likelihood, impact);
                      return (
                        <td key={likelihood} className="p-0.5">
                          <div
                            className="relative flex min-h-[60px] min-w-[60px] flex-wrap items-center justify-center gap-1 rounded-md border border-border/40 transition-all hover:ring-2 hover:ring-primary/30"
                            style={{ backgroundColor: `${bgColor}15` }}
                          >
                            {cellRisks.map((r) => (
                              <button
                                key={r.id}
                                onClick={() => setSelected(selected === r.id ? null : r.id)}
                                className={cn(
                                  "flex items-center justify-center transition-all hover:scale-125",
                                  selected === r.id && "scale-125 ring-2 ring-primary"
                                )}
                                title={`${r.id}: ${r.label} (${riskLabel(likelihood, impact)})`}
                              >
                                {ENTITY_SHAPES[r.entity] === "circle" && (
                                  <span className="block h-5 w-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: CATEGORY_COLORS[r.category] }} />
                                )}
                                {ENTITY_SHAPES[r.entity] === "square" && (
                                  <span className="block h-5 w-5 border-2 border-white shadow" style={{ backgroundColor: CATEGORY_COLORS[r.category] }} />
                                )}
                                {ENTITY_SHAPES[r.entity] === "triangle" && (
                                  <span className="block h-0 w-0 border-x-[10px] border-b-[18px] border-x-transparent shadow" style={{ borderBottomColor: CATEGORY_COLORS[r.category] }} />
                                )}
                              </button>
                            ))}
                            {cellRisks.length === 0 && <span className="text-[9px] text-muted-foreground/30">·</span>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* X-axis label */}
            <div className="mt-1 text-center text-[10px] font-bold uppercase text-muted-foreground">Probabilidad →</div>
          </div>
        </div>

        {/* Detail panel */}
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          {!selectedRisk ? (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center text-xs text-muted-foreground">
              <AlertTriangle className="mb-2 h-8 w-8 opacity-30" />
              <p>Selecciona un riesgo para ver detalles y mitigación</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-primary">{selectedRisk.id}</span>
                <span className="rounded px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: CATEGORY_COLORS[selectedRisk.category] }}>{selectedRisk.category}</span>
              </div>
              <p className="mt-2 text-xs font-medium">{selectedRisk.label}</p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 text-[10px]">
                <div className="rounded border border-border p-1 text-center">
                  <p className="font-bold uppercase text-muted-foreground">Prob.</p>
                  <p className="text-sm font-black">{selectedRisk.likelihood}/5</p>
                </div>
                <div className="rounded border border-border p-1 text-center">
                  <p className="font-bold uppercase text-muted-foreground">Impacto</p>
                  <p className="text-sm font-black">{selectedRisk.impact}/5</p>
                </div>
                <div className="rounded border p-1 text-center" style={{ backgroundColor: `${riskColor(selectedRisk.likelihood, selectedRisk.impact)}20` }}>
                  <p className="font-bold uppercase text-muted-foreground">Score</p>
                  <p className="text-sm font-black" style={{ color: riskColor(selectedRisk.likelihood, selectedRisk.impact) }}>{selectedRisk.likelihood * selectedRisk.impact}</p>
                </div>
              </div>
              <div className="mt-2">
                <span className="rounded px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: riskColor(selectedRisk.likelihood, selectedRisk.impact) }}>
                  {riskLabel(selectedRisk.likelihood, selectedRisk.impact)}
                </span>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground"><strong>Entidad:</strong> {selectedRisk.entity}</p>
              {selectedRisk.mitigation && (
                <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-[11px] dark:border-emerald-800 dark:bg-emerald-950/30">
                  <p className="font-bold text-emerald-700 dark:text-emerald-300">Mitigación</p>
                  <p className="text-foreground/80">{selectedRisk.mitigation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-[10px]">
        <span className="font-bold uppercase text-muted-foreground">Categorías:</span>
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <span key={cat} className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} /> {cat}</span>
        ))}
        <span className="ml-4 font-bold uppercase text-muted-foreground">Formas:</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-gray-400" /> Bradesco</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-gray-400" /> BCP</span>
        <span className="flex items-center gap-1"><span className="h-0 w-0 border-x-[5px] border-b-[9px] border-x-transparent border-b-gray-400" /> Ambos</span>
      </div>
    </Card>
  );
}
