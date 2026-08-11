"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { CircleDot as Bubble, Info } from "lucide-react";

interface Bubble {
  id: string;
  name: string;
  x: number; // scale (assets USD bn)
  y: number; // profitability (ROAE %)
  size: number; // digital customers (M)
  color: string;
  entity: "Bradesco" | "BCP" | "Credicorp";
  shape: "circle" | "square";
}

const BUBBLES: Bubble[] = [
  { id: "bradesco", name: "Banco Bradesco", x: 463, y: 15.2, size: 28, color: "#B91C3C", entity: "Bradesco", shape: "circle" },
  { id: "bradesco-seg", name: "Bradesco Seguros", x: 91, y: 21.9, size: 5, color: "#B08D57", entity: "Bradesco", shape: "circle" },
  { id: "bcp", name: "BCP Perú", x: 54, y: 24.7, size: 8, color: "#0F766E", entity: "BCP", shape: "square" },
  { id: "credicorp", name: "Credicorp", x: 71, y: 19.0, size: 10, color: "#7C3AED", entity: "Credicorp", shape: "circle" },
  { id: "yape", name: "Yape (target)", x: 15, y: 0, size: 16.5, color: "#14B8A6", entity: "BCP", shape: "square" },
  { id: "next", name: "Next", x: 20, y: 0, size: 15, color: "#DC4E6A", entity: "Bradesco", shape: "circle" },
];

export function ComparativeBubble() {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [showLabels, setShowLabels] = React.useState(true);

  const W = 560, H = 380, padX = 60, padY = 40;
  const maxX = 500, maxY = 30, maxSize = 30;

  const toX = (x: number) => padX + (x / maxX) * (W - 2 * padX);
  const toY = (y: number) => H - padY - (y / maxY) * (H - 2 * padY);
  const toR = (s: number) => Math.max(8, (s / maxSize) * 30);

  const hoveredBubble = hovered ? BUBBLES.find((b) => b.id === hovered) : null;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Bubble className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Bubble Chart — Escala × Rentabilidad × Digital</h3>
            <p className="text-[11px] text-muted-foreground">X=activos USD bn · Y=ROAE % · tamaño=clientes digitales M</p>
          </div>
        </div>
        <button onClick={() => setShowLabels((s) => !s)} className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${showLabels ? "border-primary bg-primary/10" : "border-border"}`}>
          {showLabels ? "Ocultar" : "Mostrar"} labels
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_200px]">
        <div className="overflow-x-auto">
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="min-w-[520px]">
            {/* Quadrant labels */}
            <text x={W / 2} y={padY - 10} textAnchor="middle" className="fill-emerald-600 text-[9px] font-bold opacity-60">ALTA RENTABILIDAD</text>
            <text x={W / 2} y={H - 8} textAnchor="middle" className="fill-muted-foreground text-[9px] font-bold opacity-60">BAJA RENTABILIDAD</text>
            <text x={padX - 8} y={H / 2} textAnchor="middle" className="fill-muted-foreground text-[9px] font-bold opacity-60" transform={`rotate(-90, ${padX - 8}, ${H / 2})`}>← MENOR ESCALA</text>

            {/* Grid */}
            {[100, 200, 300, 400].map((v) => (
              <g key={v}>
                <line x1={toX(v)} y1={padY} x2={toX(v)} y2={H - padY} stroke="currentColor" strokeWidth={0.5} strokeDasharray="2 4" className="text-border" />
                <text x={toX(v)} y={H - padY + 14} textAnchor="middle" className="fill-muted-foreground text-[8px]">{v}</text>
              </g>
            ))}
            {[5, 10, 15, 20, 25].map((v) => (
              <g key={v}>
                <line x1={padX} y1={toY(v)} x2={W - padX} y2={toY(v)} stroke="currentColor" strokeWidth={0.5} strokeDasharray="2 4" className="text-border" />
                <text x={padX - 6} y={toY(v) + 3} textAnchor="end" className="fill-muted-foreground text-[8px]">{v}%</text>
              </g>
            ))}

            {/* Axes */}
            <line x1={padX} y1={H - padY} x2={W - padX} y2={H - padY} stroke="currentColor" strokeWidth={1} className="text-border" />
            <line x1={padX} y1={padY} x2={padX} y2={H - padY} stroke="currentColor" strokeWidth={1} className="text-border" />
            <text x={W / 2} y={H - 4} textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold">Activos (USD bn) →</text>
            <text x={15} y={H / 2} textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold" transform={`rotate(-90, 15, ${H / 2})`}>ROAE (%) →</text>

            {/* Bubbles */}
            {BUBBLES.map((b) => {
              const isHovered = hovered === b.id;
              const r = toR(b.size);
              return (
                <g key={b.id} onMouseEnter={() => setHovered(b.id)} onMouseLeave={() => setHovered(null)} className="cursor-pointer" opacity={hovered && !isHovered ? 0.25 : 1}>
                  {b.shape === "circle" ? (
                    <circle cx={toX(b.x)} cy={toY(b.y)} r={r} fill={b.color} fillOpacity={isHovered ? 0.85 : 0.6} stroke={b.color} strokeWidth={isHovered ? 3 : 1.5} className="transition-all" />
                  ) : (
                    <rect x={toX(b.x) - r} y={toY(b.y) - r} width={r * 2} height={r * 2} fill={b.color} fillOpacity={isHovered ? 0.85 : 0.6} stroke={b.color} strokeWidth={isHovered ? 3 : 1.5} className="transition-all" rx={4} />
                  )}
                  {showLabels && (
                    <text x={toX(b.x)} y={toY(b.y) + r + 12} textAnchor="middle" className="fill-foreground text-[8px] font-bold pointer-events-none">{b.name}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail + legend */}
        <div className="space-y-2">
          {hoveredBubble ? (
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: hoveredBubble.color }} />
                <span className="font-mono text-[10px] font-bold" style={{ color: hoveredBubble.color }}>{hoveredBubble.id}</span>
              </div>
              <p className="mt-1 text-xs font-bold">{hoveredBubble.name}</p>
              <div className="mt-2 grid grid-cols-3 gap-1 text-[10px]">
                <div className="rounded border border-border p-1 text-center"><p className="font-bold uppercase text-muted-foreground">Activos</p><p className="text-xs font-black">${hoveredBubble.x}B</p></div>
                <div className="rounded border border-border p-1 text-center"><p className="font-bold uppercase text-muted-foreground">ROAE</p><p className="text-xs font-black">{hoveredBubble.y}%</p></div>
                <div className="rounded border border-border p-1 text-center"><p className="font-bold uppercase text-muted-foreground">Digital</p><p className="text-xs font-black">{hoveredBubble.size}M</p></div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-3 text-center text-[10px] text-muted-foreground">
              <Bubble className="mx-auto mb-1 h-6 w-6 opacity-30" />
              Hover sobre una burbuja
            </div>
          )}
          <div className="rounded-lg border border-border p-2">
            <p className="mb-1 text-[9px] font-bold uppercase text-muted-foreground">Formas:</p>
            <div className="space-y-0.5 text-[9px]">
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-gray-400" /> Bradesco (círculo)</div>
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-gray-400 rounded-sm" /> BCP (cuadrado)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Lectura:</strong> Bradesco domina en escala absoluta (eje X) pero BCP tiene mayor rentabilidad (eje Y).
          El tamaño de la burbuja muestra clientes digitales — Bradesco lidera (28M) pero Yape target (16.5M) es comparable a Next (15M).
          Bradesco Seguros destaca por alta rentabilidad con menor escala. El cuadrante superior-izquierdo (alta rentabilidad, menor escala) es donde BCP/Credicorp/Seguros se agrupan.
        </div>
      </div>
    </Card>
  );
}
