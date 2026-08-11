"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { MapPin, ZoomIn, ZoomOut } from "lucide-react";

interface Position {
  id: string;
  name: string;
  x: number; // 0-100 scale axis
  y: number; // 0-100 innovation axis
  size: number; // bubble size
  color: string;
  shape: "circle" | "square" | "diamond";
  category: string;
}

const POSITIONS: Position[] = [
  { id: "bradesco", name: "Banco Bradesco", x: 85, y: 78, size: 45, color: "#B91C3C", shape: "circle", category: "Banco operativo" },
  { id: "bradesco-seguros", name: "Bradesco Seguros", x: 70, y: 55, size: 30, color: "#B08D57", shape: "circle", category: "Seguros" },
  { id: "next", name: "Next", x: 60, y: 65, size: 20, color: "#DC4E6A", shape: "circle", category: "Marca digital" },
  { id: "digio", name: "Digio", x: 55, y: 60, size: 18, color: "#E87B91", shape: "circle", category: "Banco digital" },
  { id: "inovabra", name: "Inovabra habitat", x: 40, y: 90, size: 25, color: "#B08D57", shape: "diamond", category: "Lab innovación" },
  { id: "bcp", name: "BCP Perú", x: 35, y: 52, size: 28, color: "#0F766E", shape: "circle", category: "Banco operativo" },
  { id: "credicorp", name: "Credicorp", x: 40, y: 58, size: 32, color: "#7C3AED", shape: "circle", category: "Grupo" },
  { id: "yape", name: "Yape", x: 30, y: 75, size: 22, color: "#14B8A6", shape: "circle", category: "App pagos" },
  { id: "mibanco", name: "Mibanco", x: 25, y: 45, size: 18, color: "#0F766E", shape: "circle", category: "Microfinanzas" },
  { id: "cix", name: "CIX BCP", x: 20, y: 82, size: 16, color: "#0F766E", shape: "diamond", category: "Lab innovación" },
  { id: "krealo", name: "Krealo", x: 22, y: 68, size: 14, color: "#7C3AED", shape: "diamond", category: "CVC fund" },
];

const QUADRANTS = [
  { id: "leaders", label: "Líderes", x: 50, y: 50, color: "#16A34A", desc: "Escala + Innovación" },
  { id: "challengers", label: "Retadores", x: 0, y: 50, color: "#F59E0B", desc: "Innovación sin escala" },
  { id: "established", label: "Establecidos", x: 50, y: 0, color: "#1D4ED8", desc: "Escala sin innovación" },
  { id: "emerging", label: "Emergentes", x: 0, y: 0, color: "#6B7280", desc: "Construyendo base" },
];

export function PositioningMap() {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [zoom, setZoom] = React.useState(1);
  const [showLabels, setShowLabels] = React.useState(true);

  const hoveredPos = hovered ? POSITIONS.find((p) => p.id === hovered) : null;
  const w = 520, h = 420, pad = 50;

  const toSvgX = (x: number) => pad + (x / 100) * (w - 2 * pad);
  const toSvgY = (y: number) => h - pad - (y / 100) * (h - 2 * pad);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Mapa de Posicionamiento Competitivo</h3>
            <p className="text-[11px] text-muted-foreground">Escala (activos USD) × Madurez Innovación · {POSITIONS.length} entidades</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((z) => Math.min(z + 0.15, 1.6))} className="rounded-md border border-border p-1 hover:bg-muted" aria-label="Zoom in"><ZoomIn className="h-3.5 w-3.5" /></button>
          <button onClick={() => setZoom((z) => Math.max(z - 0.15, 0.7))} className="rounded-md border border-border p-1 hover:bg-muted" aria-label="Zoom out"><ZoomOut className="h-3.5 w-3.5" /></button>
          <button onClick={() => setShowLabels((s) => !s)} className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${showLabels ? "border-primary bg-primary/10" : "border-border"}`}>Labels</button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_240px]">
        <div className="overflow-x-auto">
          <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ transform: `scale(${zoom})`, transformOrigin: "center", transition: "transform 0.3s" }}>
            {/* Quadrant backgrounds */}
            {QUADRANTS.map((q) => (
              <g key={q.id}>
                <rect x={toSvgX(q.x)} y={toSvgY(q.y) - (h - 2 * pad) / 2} width={(w - 2 * pad) / 2} height={(h - 2 * pad) / 2} fill={q.color} fillOpacity={0.04} stroke={q.color} strokeOpacity={0.15} strokeDasharray="4 4" />
                <text x={toSvgX(q.x) + (w - 2 * pad) / 4} y={toSvgY(q.y) - (h - 2 * pad) / 4} textAnchor="middle" className="fill-muted-foreground text-[9px] font-bold uppercase opacity-50">{q.label}</text>
              </g>
            ))}

            {/* Axes */}
            <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="currentColor" strokeWidth={1} className="text-border" />
            <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="currentColor" strokeWidth={1} className="text-border" />
            <text x={w / 2} y={h - 10} textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold">Escala (activos USD bn) →</text>
            <text x={15} y={h / 2} textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold" transform={`rotate(-90, 15, ${h / 2})`}>Madurez Innovación →</text>

            {/* Grid lines */}
            {[25, 50, 75].map((v) => (
              <g key={v}>
                <line x1={toSvgX(v)} y1={pad} x2={toSvgX(v)} y2={h - pad} stroke="currentColor" strokeWidth={0.5} strokeDasharray="2 4" className="text-border" />
                <line x1={pad} y1={toSvgY(v)} x2={w - pad} y2={toSvgY(v)} stroke="currentColor" strokeWidth={0.5} strokeDasharray="2 4" className="text-border" />
              </g>
            ))}

            {/* Bubbles */}
            {POSITIONS.map((p) => {
              const isHovered = hovered === p.id;
              const cx = toSvgX(p.x), cy = toSvgY(p.y);
              return (
                <g key={p.id} onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)} className="cursor-pointer" opacity={hovered && !isHovered ? 0.3 : 1}>
                  {p.shape === "circle" && <circle cx={cx} cy={cy} r={p.size / 2} fill={p.color} fillOpacity={0.6} stroke={p.color} strokeWidth={isHovered ? 3 : 1.5} className="transition-all" />}
                  {p.shape === "square" && <rect x={cx - p.size / 2} y={cy - p.size / 2} width={p.size} height={p.size} fill={p.color} fillOpacity={0.6} stroke={p.color} strokeWidth={isHovered ? 3 : 1.5} className="transition-all" />}
                  {p.shape === "diamond" && <polygon points={`${cx},${cy - p.size / 2} ${cx + p.size / 2},${cy} ${cx},${cy + p.size / 2} ${cx - p.size / 2},${cy}`} fill={p.color} fillOpacity={0.6} stroke={p.color} strokeWidth={isHovered ? 3 : 1.5} className="transition-all" />}
                  {showLabels && (
                    <text x={cx} y={cy + p.size / 2 + 11} textAnchor="middle" className="fill-foreground text-[8px] font-bold pointer-events-none">{p.name}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          {!hoveredPos ? (
            <div className="flex h-full min-h-[180px] flex-col items-center justify-center text-center text-xs text-muted-foreground">
              <MapPin className="mb-2 h-8 w-8 opacity-30" />
              <p>Pasa el cursor sobre una entidad</p>
              <div className="mt-3 space-y-1 text-[10px]">
                <p className="font-bold uppercase">Cuadrantes:</p>
                {QUADRANTS.map((q) => (
                  <div key={q.id} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: q.color }} /> {q.label}: {q.desc}</div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold" style={{ color: hoveredPos.color }}>{hoveredPos.id}</span>
                <span className="rounded px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: hoveredPos.color }}>{hoveredPos.category}</span>
              </div>
              <p className="mt-2 text-sm font-bold">{hoveredPos.name}</p>
              <div className="mt-2 grid grid-cols-2 gap-1 text-[10px]">
                <div className="rounded border border-border p-1.5"><p className="font-bold uppercase text-muted-foreground">Escala</p><p className="text-sm font-black" style={{ color: hoveredPos.color }}>{hoveredPos.x}/100</p></div>
                <div className="rounded border border-border p-1.5"><p className="font-bold uppercase text-muted-foreground">Innovación</p><p className="text-sm font-black" style={{ color: hoveredPos.color }}>{hoveredPos.y}/100</p></div>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">Forma: {hoveredPos.shape === "diamond" ? "Laboratorio/CVC" : "Entidad operativa"}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-[10px]">
        <span className="font-bold uppercase text-muted-foreground">Formas:</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-gray-400" /> Entidad operativa</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-gray-400" /> (square)</span>
        <span className="flex items-center gap-1"><span className="h-0 w-0 border-x-[5px] border-b-[9px] border-x-transparent border-b-gray-400" /> Lab/CVC</span>
        <span className="ml-auto text-muted-foreground">Tamaño ∝ activos USD</span>
      </div>
    </Card>
  );
}
