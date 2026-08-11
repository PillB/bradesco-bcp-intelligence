"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { GitBranch, Check, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface DecisionNode {
  id: string;
  label: string;
  type: "question" | "action" | "outcome";
  x: number;
  y: number;
  color: string;
  detail?: string;
}

interface DecisionEdge {
  from: string;
  to: string;
  label: string;
  type: "yes" | "no" | "neutral";
}

const NODES: DecisionNode[] = [
  { id: "q1", label: "¿BCP tiene plataforma GenAI centralizada?", type: "question", x: 50, y: 40, color: "#1D4ED8" },
  { id: "a1-yes", label: "Auditar gobernanza y guardrails", type: "action", x: 220, y: 15, color: "#16A34A", detail: "REC01: Verificar capa horizontal, guardrails centralizados" },
  { id: "a1-no", label: "Construir tipo Bridge", type: "action", x: 220, y: 65, color: "#F59E0B", detail: "REC01: Plataforma GenAI con gobernanza única, reutilizable" },
  { id: "q2", label: "¿Marcas digitales fragmentadas?", type: "question", x: 400, y: 90, color: "#1D4ED8" },
  { id: "a2-yes", label: "Evaluar consolidación", type: "action", x: 560, y: 65, color: "#F59E0B", detail: "REC02: Análisis costos coordinación vs beneficios segmentación" },
  { id: "a2-no", label: "Mantener status quo", type: "outcome", x: 560, y: 115, color: "#6B7280", detail: "Monitorear cada 18-24 meses" },
  { id: "q3", label: "¿Marco Open Finance maduro en Perú?", type: "question", x: 220, y: 150, color: "#1D4ED8" },
  { id: "a3-no", label: "Preparar capacidades", type: "action", x: 400, y: 150, color: "#F59E0B", detail: "REC05: Mapear capacidades Bradesco Open Finance para horizonte peruano" },
  { id: "q4", label: "¿Cifras Bradesco como benchmark?", type: "question", x: 50, y: 200, color: "#1D4ED8" },
  { id: "a4-warn", label: "NO usar sin ajuste", type: "outcome", x: 220, y: 200, color: "#DC2626", detail: "REC04: Reconciliar definición de métrica y ajuste por escala" },
  { id: "q5", label: "¿ROI Inovabra > cartera CVC?", type: "question", x: 50, y: 280, color: "#1D4ED8" },
  { id: "a5-no", label: "Mantener modelo CVC", type: "outcome", x: 220, y: 260, color: "#6B7280", detail: "REC03: Sin evidencia de superioridad del habitat" },
  { id: "a5-unknown", label: "Documentar ROI actual", type: "action", x: 220, y: 300, color: "#F59E0B", detail: "Medir ROI Yape/Tenpo/Krealo antes de replicar habitat" },
];

const EDGES: DecisionEdge[] = [
  { from: "q1", to: "a1-yes", label: "Sí", type: "yes" },
  { from: "q1", to: "a1-no", label: "No", type: "no" },
  { from: "a1-no", to: "q2", label: "", type: "neutral" },
  { from: "q2", to: "a2-yes", label: "Sí", type: "yes" },
  { from: "q2", to: "a2-no", label: "No", type: "no" },
  { from: "a1-yes", to: "q3", label: "", type: "neutral" },
  { from: "q3", to: "a3-no", label: "No", type: "no" },
  { from: "q4", to: "a4-warn", label: "Sí", type: "yes" },
  { from: "q5", to: "a5-no", label: "No", type: "no" },
  { from: "q5", to: "a5-unknown", label: "Unknown", type: "neutral" },
];

const EDGE_COLORS = { yes: "#16A34A", no: "#DC2626", neutral: "#6B7280" };

export function DecisionTree() {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const hoveredNode = hovered ? NODES.find((n) => n.id === hovered) : null;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Árbol de Decisiones Estratégicas — BCP/Perú</h3>
            <p className="text-[11px] text-muted-foreground">Rutas de decisión basadas en aprendizajes de Bradesco · hover para detalle</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_240px]">
        <div className="overflow-x-auto">
          <svg width="100%" viewBox="0 0 680 360" className="min-w-[640px]">
            {/* Edges */}
            {EDGES.map((e, i) => {
              const from = NODES.find((n) => n.id === e.from)!;
              const to = NODES.find((n) => n.id === e.to)!;
              if (!from || !to) return null;
              const isHighlighted = hovered && (e.from === hovered || e.to === hovered);
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;
              return (
                <g key={i}>
                  <path
                    d={`M ${from.x + 90} ${from.y + 15} C ${midX} ${from.y + 15}, ${midX} ${to.y + 15}, ${to.x} ${to.y + 15}`}
                    fill="none"
                    stroke={EDGE_COLORS[e.type]}
                    strokeWidth={isHighlighted ? 2.5 : 1.2}
                    strokeOpacity={hovered && !isHighlighted ? 0.1 : isHighlighted ? 0.9 : 0.5}
                    strokeDasharray={e.type === "neutral" ? "4 4" : undefined}
                    className="transition-all"
                  />
                  {e.label && (
                    <text x={midX - 5} y={midY + 12} className="fill-foreground text-[9px] font-bold" style={{ opacity: hovered && !isHighlighted ? 0.2 : 1 }}>
                      {e.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map((n) => {
              const isHovered = hovered === n.id;
              const w = 100, h = 30;
              return (
                <g
                  key={n.id}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                  opacity={hovered && !isHovered ? 0.4 : 1}
                >
                  {n.type === "question" ? (
                    <>
                      <rect x={n.x} y={n.y} width={w} height={h} rx={h / 2} fill={n.color} fillOpacity={isHovered ? 0.95 : 0.8} stroke={n.color} strokeWidth={isHovered ? 2 : 1} className="transition-all" />
                      <text x={n.x + w / 2} y={n.y + h / 2 + 3} textAnchor="middle" className="fill-white text-[8px] font-bold pointer-events-none">{n.label.slice(0, 22)}</text>
                    </>
                  ) : n.type === "action" ? (
                    <>
                      <rect x={n.x} y={n.y} width={w} height={h} rx={4} fill={n.color} fillOpacity={isHovered ? 0.95 : 0.75} stroke={n.color} strokeWidth={isHovered ? 2 : 1} className="transition-all" />
                      <text x={n.x + w / 2} y={n.y + h / 2 + 3} textAnchor="middle" className="fill-white text-[8px] font-bold pointer-events-none">{n.label.slice(0, 22)}</text>
                    </>
                  ) : (
                    <>
                      <rect x={n.x} y={n.y} width={w} height={h} rx={4} fill="none" stroke={n.color} strokeWidth={isHovered ? 2 : 1.5} strokeDasharray="3 3" className="transition-all" />
                      <text x={n.x + w / 2} y={n.y + h / 2 + 3} textAnchor="middle" style={{ fill: n.color }} className="text-[8px] font-bold pointer-events-none">{n.label.slice(0, 22)}</text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          {!hoveredNode ? (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center text-xs text-muted-foreground">
              <GitBranch className="mb-2 h-8 w-8 opacity-30" />
              <p>Hover sobre un nodo</p>
              <div className="mt-3 space-y-1 text-[10px]">
                <p className="font-bold uppercase">Tipos:</p>
                <div className="flex items-center gap-1.5"><span className="h-3 w-5 rounded-full bg-blue-600" /> Pregunta</div>
                <div className="flex items-center gap-1.5"><span className="h-3 w-5 rounded bg-amber-500" /> Acción</div>
                <div className="flex items-center gap-1.5"><span className="h-3 w-5 rounded border-2 border-dashed border-gray-500" /> Outcome</div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: hoveredNode.color }}>{hoveredNode.type}</span>
                <span className="font-mono text-[10px] font-bold" style={{ color: hoveredNode.color }}>{hoveredNode.id}</span>
              </div>
              <p className="mt-2 text-xs font-medium">{hoveredNode.label}</p>
              {hoveredNode.detail && (
                <div className="mt-2 rounded-md border border-border bg-card p-2 text-[10px] text-foreground/80">
                  {hoveredNode.detail}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Uso:</strong> El árbol guía decisiones para BCP basadas en aprendizajes de Bradesco.
          Las preguntas (azul) definen bifurcaciones; las acciones (amber) son recomendaciones; los outcomes (punteado) son resultados.
          Cada nodo está vinculado a una recomendación (REC01-REC05) del framework SCIF.
        </div>
      </div>
    </Card>
  );
}
