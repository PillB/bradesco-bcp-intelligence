"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { Workflow, Info } from "lucide-react";

// Sankey-style flow: Entity → Segment → Outcome (revenue/profitability tier)
interface FlowNode {
  id: string;
  label: string;
  level: 0 | 1 | 2;
  color: string;
  value: number;
}

interface FlowLink {
  source: string;
  target: string;
  value: number;
}

const NODES: FlowNode[] = [
  // Level 0: Entities
  { id: "bradesco", label: "Bradesco", level: 0, color: "#B91C3C", value: 100 },
  { id: "bcp-group", label: "BCP/Credicorp", level: 0, color: "#0F766E", value: 100 },
  // Level 1: Segments
  { id: "banca-bra", label: "Banca (Bradesco)", level: 1, color: "#B91C3C", value: 65 },
  { id: "seguros", label: "Seguros", level: 1, color: "#B08D57", value: 35 },
  { id: "banca-bcp", label: "Banca (BCP)", level: 1, color: "#0F766E", value: 76 },
  { id: "disrupt", label: "Disruptivas (Yape)", level: 1, color: "#14B8A6", value: 24 },
  // Level 2: Outcome tiers
  { id: "high-profit", label: "Alta rentabilidad (>20% ROAE)", level: 2, color: "#16A34A", value: 0 },
  { id: "improving", label: "Mejorando (15-20% ROAE)", level: 2, color: "#F59E0B", value: 0 },
  { id: "scaling", label: "Escalando (<15% ROAE)", level: 2, color: "#6B7280", value: 0 },
];

const LINKS: FlowLink[] = [
  // Bradesco → segments
  { source: "bradesco", target: "banca-bra", value: 65 },
  { source: "bradesco", target: "seguros", value: 35 },
  // BCP → segments
  { source: "bcp-group", target: "banca-bcp", value: 76 },
  { source: "bcp-group", target: "disrupt", value: 24 },
  // Segments → outcomes
  { source: "banca-bra", target: "improving", value: 65 }, // ROAE 15.2%
  { source: "seguros", target: "high-profit", value: 35 }, // ROAE 21.9%
  { source: "banca-bcp", target: "high-profit", value: 76 }, // ROAE 24.7%
  { source: "disrupt", target: "scaling", value: 24 }, // Yape escalando
];

// Compute outcome values
LINKS.forEach((l) => {
  if (l.target === "high-profit") NODES.find((n) => n.id === "high-profit")!.value += l.value;
  if (l.target === "improving") NODES.find((n) => n.id === "improving")!.value += l.value;
  if (l.target === "scaling") NODES.find((n) => n.id === "scaling")!.value += l.value;
});

export function ComparativeSankey() {
  const w = 640, h = 380, padX = 100, padY = 30;
  const levelWidth = (w - 2 * padX) / 2;

  const [hovered, setHovered] = React.useState<string | null>(null);

  // Position nodes
  const nodePositions: Record<string, { x: number; y: number; h: number }> = {};
  [0, 1, 2].forEach((lvl) => {
    const levelNodes = NODES.filter((n) => n.level === lvl);
    const totalValue = levelNodes.reduce((s, n) => s + n.value, 0) || 1;
    const availableH = h - 2 * padY;
    let cumY = padY;
    levelNodes.forEach((n) => {
      const nodeH = (n.value / totalValue) * availableH * 0.85;
      const gap = (availableH * 0.15) / (levelNodes.length - 1 || 1);
      nodePositions[n.id] = { x: padX + lvl * levelWidth, y: cumY, h: nodeH };
      cumY += nodeH + gap;
    });
  });

  // Generate flow paths
  function flowPath(link: FlowLink): string {
    const s = nodePositions[link.source];
    const t = nodePositions[link.target];
    if (!s || !t) return "";
    const sourceIdx = LINKS.filter((l) => l.source === link.source).indexOf(link);
    const targetIdx = LINKS.filter((l) => l.target === link.target).indexOf(link);
    const sourceTotal = LINKS.filter((l) => l.source === link.source).reduce((sum, l) => sum + l.value, 0);
    const targetTotal = LINKS.filter((l) => l.target === link.target).reduce((sum, l) => sum + l.value, 0);

    const sYStart = s.y + (sourceIdx / Math.max(sourceTotal, 1)) * s.h * 0.5;
    const sYEnd = s.y + ((sourceIdx + 1) / Math.max(sourceTotal, 1)) * s.h * 0.5;
    // Simpler: just use middle of source node band
    const sy = s.y + s.h * (sourceIdx + 0.5) / LINKS.filter((l) => l.source === link.source).length;
    const ty = t.y + t.h * (targetIdx + 0.5) / LINKS.filter((l) => l.target === link.target).length;

    const midX = (s.x + t.x) / 2;
    return `M ${s.x + 80} ${sy} C ${midX} ${sy}, ${midX} ${ty}, ${t.x - 10} ${ty}`;
  }

  const hoveredNode = hovered ? NODES.find((n) => n.id === hovered) : null;
  const connectedLinks = hovered ? LINKS.filter((l) => l.source === hovered || l.target === hovered) : [];

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Workflow className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Diagrama Sankey — Flujo Entidad → Segmento → Rentabilidad</h3>
            <p className="text-[11px] text-muted-foreground">Ancho ∝ contribución relativa · hover para destacar flujos</p>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="min-w-[600px]">
          {/* Level labels */}
          {["Entidades", "Segmentos", "Rentabilidad"].map((label, i) => (
            <text key={i} x={padX + i * levelWidth + 35} y={18} textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold uppercase">{label}</text>
          ))}

          {/* Links */}
          {LINKS.map((link, i) => {
            const isHighlighted = hovered && (link.source === hovered || link.target === hovered);
            const isDimmed = hovered && !isHighlighted;
            const sourceNode = NODES.find((n) => n.id === link.source)!;
            return (
              <path
                key={i}
                d={flowPath(link)}
                fill="none"
                stroke={sourceNode.color}
                strokeWidth={Math.max(2, link.value / 3)}
                strokeOpacity={isHighlighted ? 0.7 : isDimmed ? 0.05 : 0.25}
                className="transition-all"
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((n) => {
            const pos = nodePositions[n.id];
            if (!pos) return null;
            const isHovered = hovered === n.id;
            return (
              <g key={n.id} onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
                <rect
                  x={pos.x} y={pos.y} width={70} height={Math.max(pos.h, 20)}
                  fill={n.color} fillOpacity={isHovered ? 0.9 : 0.7} rx={4}
                  stroke={n.color} strokeWidth={isHovered ? 2 : 1}
                  className="transition-all"
                />
                <text x={pos.x + 35} y={pos.y + Math.max(pos.h, 20) / 2 + 3} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">{n.label}</text>
                <text x={pos.x + 35} y={pos.y + Math.max(pos.h, 20) / 2 + 14} textAnchor="middle" className="fill-white/80 text-[8px] pointer-events-none">{n.value}%</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail */}
      {hoveredNode && (
        <div className="mt-3 flex items-center gap-3 rounded-md border border-border bg-muted/20 p-2 text-xs">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: hoveredNode.color }} />
          <span className="font-bold">{hoveredNode.label}</span>
          <span className="text-muted-foreground">Valor: {hoveredNode.value}%</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">Flujos conectados: {connectedLinks.length}</span>
        </div>
      )}

      <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Lectura del flujo:</strong> BCP/Credicorp concentra mayor proporción en "Alta rentabilidad" (banca 24.7% ROAE),
          mientras Bradesco tiene mix balanceado entre banca (mejorando, 15.2%) y seguros (alta, 21.9%).
          Las iniciativas disruptivas de Credicorp (Yape) están en fase de escalado. El Sankey muestra que la rentabilidad
          de Bradesco depende más de seguros que de la banca core, mientras BCP depende de la banca operativa.
        </div>
      </div>
    </Card>
  );
}
