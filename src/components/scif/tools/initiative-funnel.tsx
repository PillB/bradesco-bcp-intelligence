"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { INITIATIVES, TECH_CAPABILITIES } from "@/lib/scif/data";
import { Filter, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  { id: "DISCOVERED", label: "Descubierto", color: "#94A3B8", order: 0 },
  { id: "ANNOUNCED", label: "Anunciado", color: "#7DD3FC", order: 1 },
  { id: "RESEARCH", label: "Investigación", color: "#A855F7", order: 2 },
  { id: "EXPERIMENT", label: "Experimento", color: "#FB923C", order: 3 },
  { id: "EXPERIMENT_PILOT", label: "Exp./Piloto", color: "#F59E0B", order: 3.5 },
  { id: "POC", label: "PoC", color: "#FBBF24", order: 4 },
  { id: "PILOT", label: "Piloto", color: "#F59E0B", order: 5 },
  { id: "BETA", label: "Beta", color: "#8B5CF6", order: 6 },
  { id: "PRODUCTION", label: "Producción", color: "#16A34A", order: 7 },
  { id: "PRODUCTION_SCALING", label: "Prod. Escalando", color: "#22C55E", order: 8 },
  { id: "SCALING", label: "Escalando", color: "#84CC16", order: 8.5 },
  { id: "MATURE", label: "Maduro", color: "#15803D", order: 9 },
  { id: "MATURE_PRODUCTION", label: "Maduro Prod.", color: "#166534", order: 9.5 },
  { id: "INTEGRATED", label: "Integrado", color: "#0891B2", order: 8.5 },
  { id: "REPOSITIONED", label: "Reposicionado", color: "#06B6D4", order: 7.5 },
  { id: "PAUSED", label: "Pausado", color: "#A1A1AA", order: 3.5 },
  { id: "SUNSET", label: "Sunset", color: "#EF4444", order: -1 },
  { id: "SOLD", label: "Vendido", color: "#F97316", order: -1 },
  { id: "FAILED", label: "Fallido", color: "#DC2626", order: -2 },
  { id: "UNKNOWN", label: "Desconocido", color: "#6B7280", order: -1 },
] as const;

// Group stages into funnel phases for the visualization
const FUNNEL_PHASES = [
  { id: "signal", label: "SIGNAL", stages: ["DISCOVERED", "ANNOUNCED", "RESEARCH", "UNKNOWN"], color: "#94A3B8" },
  { id: "experiment", label: "EXPERIMENT", stages: ["EXPERIMENT", "EXPERIMENT_PILOT", "POC", "PAUSED"], color: "#F59E0B" },
  { id: "pilot", label: "PILOT", stages: ["PILOT", "BETA"], color: "#FB923C" },
  { id: "production", label: "PRODUCTION", stages: ["PRODUCTION", "PRODUCTION_SCALING", "SCALING", "REPOSITIONED", "INTEGRATED"], color: "#16A34A" },
  { id: "mature", label: "MATURE", stages: ["MATURE", "MATURE_PRODUCTION"], color: "#166534" },
  { id: "exit", label: "EXIT", stages: ["SUNSET", "SOLD", "FAILED"], color: "#DC2626" },
];

export function InitiativeFunnel() {
  const [filter, setFilter] = React.useState<string>("initiatives");
  const items = filter === "initiatives" ? INITIATIVES.map((i) => ({ name: i.name, lifecycle: i.lifecycle, category: i.category })) : TECH_CAPABILITIES.map((t) => ({ name: t.name, lifecycle: t.maturity, category: t.category }));

  const phaseCounts = React.useMemo(() => {
    return FUNNEL_PHASES.map((phase) => ({
      ...phase,
      count: items.filter((i) => phase.stages.includes(i.lifecycle)).length,
      items: items.filter((i) => phase.stages.includes(i.lifecycle)),
    }));
  }, [items]);

  const maxCount = Math.max(...phaseCounts.map((p) => p.count), 1);
  const total = items.length;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Funnel de Iniciativas — SIGNAL → PRODUCTION → MATURE</h3>
            <p className="text-[11px] text-muted-foreground">{total} items · {filter === "initiatives" ? "iniciativas" : "capacidades tecnológicas"} clasificadas por etapa</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
          <button onClick={() => setFilter("initiatives")} className={cn("rounded-md px-2.5 py-1 text-[10px] font-semibold", filter === "initiatives" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>Iniciativas</button>
          <button onClick={() => setFilter("tech")} className={cn("rounded-md px-2.5 py-1 text-[10px] font-semibold", filter === "tech" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>Tech Caps</button>
        </div>
      </div>

      {/* Funnel visualization */}
      <div className="mt-4 space-y-1">
        {phaseCounts.map((phase, idx) => {
          const widthPct = (phase.count / maxCount) * 100;
          const pctOfTotal = total > 0 ? (phase.count / total) * 100 : 0;
          return (
            <div key={phase.id} className="group">
              <div className="flex items-center gap-3">
                {/* Phase label */}
                <div className="flex w-32 shrink-0 items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: phase.color }} />
                  <span className="font-mono text-[10px] font-bold uppercase" style={{ color: phase.color }}>{phase.label}</span>
                </div>
                {/* Funnel bar */}
                <div className="relative h-10 flex-1 overflow-hidden rounded-md bg-muted/30">
                  <div
                    className="flex h-full items-center justify-end pr-3 transition-all duration-700 ease-out group-hover:brightness-110"
                    style={{
                      width: `${Math.max(widthPct, 2)}%`,
                      background: `linear-gradient(90deg, ${phase.color}88, ${phase.color})`,
                      marginLeft: `${idx * 3}%`,
                    }}
                  >
                    <span className="text-xs font-bold text-white drop-shadow">{phase.count}</span>
                  </div>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground">{pctOfTotal.toFixed(0)}%</span>
                </div>
              </div>
              {/* Items in phase (expandable on hover) */}
              {phase.items.length > 0 && (
                <div className="ml-32 mt-0.5 hidden flex-wrap gap-1 group-hover:flex">
                  {phase.items.map((item, i) => (
                    <span key={i} className="rounded border border-border bg-card px-1.5 py-0.5 text-[9px] font-medium" title={`${item.name} — ${item.lifecycle}`}>
                      {item.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Conversion rates */}
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 sm:grid-cols-4">
        {[
          { label: "Signal → Production", from: phaseCounts[0].count, to: phaseCounts[3].count },
          { label: "Production → Mature", from: phaseCounts[3].count, to: phaseCounts[4].count },
          { label: "Tasa de éxito", from: total, to: phaseCounts[3].count + phaseCounts[4].count },
          { label: "Tasa de exit/sunset", from: total, to: phaseCounts[5].count },
        ].map((metric, i) => {
          const rate = metric.from > 0 ? (metric.to / metric.from) * 100 : 0;
          return (
            <div key={i} className="rounded-lg border border-border p-2 text-center">
              <p className="text-[9px] font-bold uppercase text-muted-foreground">{metric.label}</p>
              <p className={cn("mt-0.5 text-lg font-black", i < 2 ? "text-emerald-600" : i === 2 ? "text-primary" : "text-red-500")}>{rate.toFixed(0)}%</p>
              <p className="text-[9px] text-muted-foreground">{metric.to}/{metric.from}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <Filter className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Lectura del funnel:</strong> La mayoría de items están en PRODUCTION/MATURE, reflejando la madurez operativa de Bradesco.
          Las iniciativas en SUNSET (Bitz) representan decisiones conscientes de consolidación, no fracasos.
          El funnel muestra que Bradesco convierte eficientemente de SIGNAL a PRODUCTION — pero la tasa exacta requiere datos de iniciativas totales iniciadas (no públicamente disponibles).
        </div>
      </div>
    </Card>
  );
}
