"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { Radar as RadarIcon, Info } from "lucide-react";
import { TECH_CAPABILITIES } from "@/lib/scif/data";
import { theme } from "@/lib/scif/theme";
import type { TechMaturity } from "@/lib/scif/types";

// Classic Technology Radar: 4 quadrants (Techniques, Platforms, Tools, Languages & Frameworks)
// Adapted to banking: (AI & Data, Platforms & Cloud, Security & Identity, Emerging Tech)

const QUADRANTS = [
  { id: 0, label: "IA & Datos", angleRange: [0, 90] },
  { id: 1, label: "Plataformas & Cloud", angleRange: [90, 180] },
  { id: 2, label: "Seguridad & Identidad", angleRange: [180, 270] },
  { id: 3, label: "Tech Emergente", angleRange: [270, 360] },
];

function getQuadrant(category: string): number {
  if (["GenAI", "Conversational AI", "Agentic AI", "AI governance", "Data architecture", "Data / Model risk"].includes(category)) return 0;
  if (["Cloud", "Open Finance", "Payments"].includes(category)) return 1;
  if (["Digital identity", "Fraud / AML"].includes(category)) return 2;
  return 3; // Emerging
}

// Ring mapping: 0=Adopt (inner), 1=Trial, 2=Assess, 3=Hold (outer)
function maturityToRing(m: TechMaturity): number {
  if (["MATURE", "MATURE_PRODUCTION", "PRODUCTION", "PRODUCTION_SCALING", "SCALING"].includes(m)) return 0; // Adopt
  if (["PILOT", "BETA"].includes(m)) return 1; // Trial
  if (["EXPERIMENT", "EXPERIMENT_PILOT", "POC", "RESEARCH", "RADAR"].includes(m)) return 2; // Assess
  return 3; // Hold (UNKNOWN)
}

const RING_LABELS = ["Adopt", "Trial", "Assess", "Hold"];
const RING_COLORS = ["#16A34A", "#F59E0B", "#3B82F6", "#6B7280"];

export function TechRadarViz() {
  const W = 520, H = 520, cx = W / 2, cy = H / 2;
  const maxR = 210;
  const ringR = [maxR * 0.28, maxR * 0.52, maxR * 0.76, maxR];

  const [hovered, setHovered] = React.useState<string | null>(null);

  // Position blips
  const blips = TECH_CAPABILITIES.map((t, i) => {
    const q = getQuadrant(t.category);
    const ring = maturityToRing(t.maturity);
    const [angleStart, angleEnd] = QUADRANTS[q].angleRange;
    const angle = (angleStart + angleEnd) / 2 + (i % 3 - 1) * 12;
    const angleRad = (angle * Math.PI) / 180;
    const r = ringR[ring] - 18;
    return {
      ...t,
      x: cx + Math.cos(angleRad) * r,
      y: cy - Math.sin(angleRad) * r,
      ring,
      quadrant: q,
      angle,
    };
  });

  const hoveredBlip = hovered ? blips.find((b) => b.tech_id === hovered) : null;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <RadarIcon className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Radar Tecnológico — Estilo ThoughtWorks</h3>
            <p className="text-[11px] text-muted-foreground">{TECH_CAPABILITIES.length} blips · 4 cuadrantes · 4 anillos (Adopt/Trial/Assess/Hold)</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px]">
        <div className="overflow-x-auto">
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="min-w-[480px]">
            {/* Quadrant backgrounds */}
            {QUADRANTS.map((q) => {
              const [start, end] = q.angleRange;
              const startRad = (start * Math.PI) / 180;
              const endRad = (end * Math.PI) / 180;
              const x1 = cx + Math.cos(startRad) * maxR;
              const y1 = cy - Math.sin(startRad) * maxR;
              const x2 = cx + Math.cos(endRad) * maxR;
              const y2 = cy - Math.sin(endRad) * maxR;
              const colors = ["#B91C3C08", "#1D4ED808", "#0F766E08", "#7C3AED08"];
              return (
                <path
                  key={q.id}
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${maxR} ${maxR} 0 0 1 ${x2} ${y2} Z`}
                  fill={colors[q.id]}
                />
              );
            })}

            {/* Rings */}
            {ringR.map((r, i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth={0.8} strokeDasharray="3 3" className="text-border" />
                <text x={cx + 4} y={cy - r + 12} className="fill-muted-foreground text-[9px] font-bold">{RING_LABELS[i]}</text>
              </g>
            ))}

            {/* Quadrant dividing lines */}
            <line x1={cx} y1={cy - maxR} x2={cx} y2={cy + maxR} stroke="currentColor" strokeWidth={1} className="text-border" />
            <line x1={cx - maxR} y1={cy} x2={cx + maxR} y2={cy} stroke="currentColor" strokeWidth={1} className="text-border" />

            {/* Quadrant labels */}
            {QUADRANTS.map((q) => {
              const angle = (q.angleRange[0] + q.angleRange[1]) / 2;
              const angleRad = (angle * Math.PI) / 180;
              const lr = maxR + 22;
              return (
                <text
                  key={q.id}
                  x={cx + Math.cos(angleRad) * lr}
                  y={cy - Math.sin(angleRad) * lr}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-[11px] font-bold"
                >
                  {q.label}
                </text>
              );
            })}

            {/* Blips */}
            {blips.map((b) => {
              const isHovered = hovered === b.tech_id;
              const color = RING_COLORS[b.ring];
              return (
                <g
                  key={b.tech_id}
                  onMouseEnter={() => setHovered(b.tech_id)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                  opacity={hovered && !isHovered ? 0.3 : 1}
                >
                  <circle
                    cx={b.x} cy={b.y} r={isHovered ? 9 : 7}
                    fill={color} fillOpacity={0.85}
                    stroke="#fff" strokeWidth={2}
                    className="transition-all"
                  />
                  <text x={b.x} y={b.y + 2} textAnchor="middle" className="fill-white text-[7px] font-bold pointer-events-none">{b.tech_id.slice(0, 3)}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div className="space-y-2">
          {hoveredBlip ? (
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <p className="font-mono text-[10px] font-bold text-primary">{hoveredBlip.tech_id}</p>
              <p className="mt-1 text-xs font-medium">{hoveredBlip.name}</p>
              <div className="mt-2 space-y-1 text-[10px]">
                <p><span className="text-muted-foreground">Cuadrante:</span> {QUADRANTS[hoveredBlip.quadrant].label}</p>
                <p><span className="text-muted-foreground">Anillo:</span> <span className="font-bold" style={{ color: RING_COLORS[hoveredBlip.ring] }}>{RING_LABELS[hoveredBlip.ring]}</span></p>
                <p><span className="text-muted-foreground">Madurez:</span> {theme.lifecycle[hoveredBlip.maturity as keyof typeof theme.lifecycle]?.label}</p>
                <p><span className="text-muted-foreground">Confianza:</span> {Math.round(hoveredBlip.confidence * 100)}%</p>
              </div>
              {hoveredBlip.notes && <p className="mt-1 text-[10px] italic text-foreground/70">{hoveredBlip.notes}</p>}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-3 text-center text-[10px] text-muted-foreground">
              <RadarIcon className="mx-auto mb-1 h-6 w-6 opacity-30" />
              Hover sobre un blip
            </div>
          )}

          {/* Ring legend */}
          <div className="rounded-lg border border-border p-2">
            <p className="mb-1 text-[9px] font-bold uppercase text-muted-foreground">Anillos:</p>
            <div className="space-y-0.5 text-[9px]">
              {RING_LABELS.map((label, i) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: RING_COLORS[i] }} />
                  <span className="flex-1">{label}</span>
                  <span className="font-bold">{blips.filter((b) => b.ring === i).length}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Lectura del radar:</strong> El anillo interior (Adopt) contiene tecnologías en producción/maduras (BIA, Open Finance, Pix, Biometrics, Multicloud).
          El anillo Trial contiene pilotos (DLT/stablecoin). Assess incluye experimentos (Agentic AI, Quantum-safe). Hold agrupa UNKNOWN (GNN, synthetic data) —
          no significa "evitar", sino "sin evidencia pública suficiente para clasificar".
        </div>
      </div>
    </Card>
  );
}
