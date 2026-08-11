"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { ScatterChart as ScatterIcon } from "lucide-react";
import { CLAIMS } from "@/lib/scif/data";
import { theme } from "@/lib/scif/theme";

export function EvidenceScatter() {
  const w = 520, h = 360, pad = 50;

  const data = CLAIMS.map((c) => ({
    id: c.claim_id,
    x: c.confidence * 100,
    y: c.source_ids.length,
    status: c.evidence_status,
    topic: c.topic,
    entity: c.entity,
  }));

  const maxX = 100;
  const maxY = Math.max(...data.map((d) => d.y), 4);

  const toSvgX = (x: number) => pad + (x / maxX) * (w - 2 * pad);
  const toSvgY = (y: number) => h - pad - (y / maxY) * (h - 2 * pad);

  const [hovered, setHovered] = React.useState<string | null>(null);
  const hoveredPoint = hovered ? data.find((d) => d.id === hovered) : null;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <ScatterIcon className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Scatter Plot — Confianza × Diversidad de Fuentes</h3>
            <p className="text-[11px] text-muted-foreground">{CLAIMS.length} claims · cada punto es un claim · hover para detalle</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px]">
        <div className="overflow-x-auto">
          <svg width="100%" viewBox={`0 0 ${w} ${h}`}>
            {/* Quadrant backgrounds */}
            <rect x={toSvgX(70)} y={pad} width={toSvgX(100) - toSvgX(70)} height={toSvgY(2) - pad} fill="#16A34A" fillOpacity={0.04} />
            <rect x={pad} y={toSvgY(2)} width={toSvgX(70) - pad} height={h - 2 * pad - (toSvgY(2) - pad)} fill="#F59E0B" fillOpacity={0.04} />

            {/* Axes */}
            <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="currentColor" strokeWidth={1} className="text-border" />
            <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="currentColor" strokeWidth={1} className="text-border" />

            {/* Grid */}
            {[25, 50, 75].map((v) => (
              <g key={v}>
                <line x1={toSvgX(v)} y1={pad} x2={toSvgX(v)} y2={h - pad} stroke="currentColor" strokeWidth={0.5} strokeDasharray="2 4" className="text-border" />
                <text x={toSvgX(v)} y={h - pad + 14} textAnchor="middle" className="fill-muted-foreground text-[8px]">{v}%</text>
              </g>
            ))}
            {Array.from({ length: maxY }).map((_, i) => i + 1).filter((v) => v <= maxY).map((v) => (
              <g key={v}>
                <line x1={pad} y1={toSvgY(v)} x2={w - pad} y2={toSvgY(v)} stroke="currentColor" strokeWidth={0.5} strokeDasharray="2 4" className="text-border" />
                <text x={pad - 6} y={toSvgY(v) + 3} textAnchor="end" className="fill-muted-foreground text-[8px]">{v}</text>
              </g>
            ))}

            {/* Threshold lines */}
            <line x1={toSvgX(70)} y1={pad} x2={toSvgX(70)} y2={h - pad} stroke="#16A34A" strokeWidth={1.5} strokeDasharray="6 3" strokeOpacity={0.5} />
            <text x={toSvgX(70) + 4} y={pad + 10} className="fill-emerald-600 text-[8px] font-bold">umbral confianza 70%</text>
            <line x1={pad} y1={toSvgY(2)} x2={w - pad} y2={toSvgY(2)} stroke="#1D4ED8" strokeWidth={1.5} strokeDasharray="6 3" strokeOpacity={0.5} />
            <text x={w - pad - 4} y={toSvgY(2) - 4} textAnchor="end" className="fill-blue-600 text-[8px] font-bold">corroboración ≥2 fuentes</text>

            {/* Axis labels */}
            <text x={w / 2} y={h - 8} textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold">Confianza (%) →</text>
            <text x={15} y={h / 2} textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold" transform={`rotate(-90, 15, ${h / 2})`}>N° fuentes →</text>

            {/* Points */}
            {data.map((d) => {
              const cfg = theme.evidence[d.status as keyof typeof theme.evidence] ?? theme.evidence.UNRESOLVED;
              const isHovered = hovered === d.id;
              return (
                <g key={d.id} onMouseEnter={() => setHovered(d.id)} onMouseLeave={() => setHovered(null)} className="cursor-pointer" opacity={hovered && !isHovered ? 0.2 : 1}>
                  <circle cx={toSvgX(d.x)} cy={toSvgY(d.y)} r={isHovered ? 8 : 5} fill={cfg.dot} fillOpacity={0.7} stroke={cfg.dot} strokeWidth={isHovered ? 2 : 1} className="transition-all" />
                  {isHovered && <text x={toSvgX(d.x) + 10} y={toSvgY(d.y) + 3} className="fill-foreground text-[8px] font-bold">{d.id}</text>}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail + legend */}
        <div className="space-y-2">
          {hoveredPoint ? (
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <p className="font-mono text-xs font-bold text-primary">{hoveredPoint.id}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{hoveredPoint.entity.replace(/_/g, " ")}</p>
              <p className="text-[10px] text-muted-foreground">Topic: {hoveredPoint.topic}</p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px]">
                <div className="rounded border border-border p-1 text-center"><p className="font-bold uppercase text-muted-foreground">Conf.</p><p className="text-sm font-black">{hoveredPoint.x}%</p></div>
                <div className="rounded border border-border p-1 text-center"><p className="font-bold uppercase text-muted-foreground">Fuentes</p><p className="text-sm font-black">{hoveredPoint.y}</p></div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-3 text-center text-[10px] text-muted-foreground">
              <ScatterIcon className="mx-auto mb-1 h-6 w-6 opacity-30" />
              Hover sobre un punto
            </div>
          )}
          <div className="rounded-lg border border-border p-2">
            <p className="mb-1 text-[9px] font-bold uppercase text-muted-foreground">Estados:</p>
            <div className="space-y-0.5 text-[9px]">
              {["VERIFIED", "INDEPENDENTLY_CORROBORATED", "STRONGLY_SUPPORTED", "PARTIAL", "INFERRED", "UNRESOLVED"].map((s) => {
                const cfg = theme.evidence[s as keyof typeof theme.evidence];
                const count = data.filter((d) => d.status === s).length;
                return (
                  <div key={s} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.dot }} />
                    <span className="flex-1">{cfg.label}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <ScatterIcon className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Lectura:</strong> El cuadrante superior-derecho (alta confianza + múltiples fuentes) contiene los claims más robustos.
          Los claims en el cuadrante inferior-izquierdo requieren más investigación. El umbral de 70% confianza y 2 fuentes
          define el estándar de INDEPENDENTLY_CORROBORATED del framework.
        </div>
      </div>
    </Card>
  );
}
