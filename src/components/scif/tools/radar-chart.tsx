"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { Radar as RadarIcon } from "lucide-react";
import { RADAR_VERSIONS } from "@/lib/scif/data";
import { theme } from "@/lib/scif/theme";
import type { TechMaturity } from "@/lib/scif/types";
import { cn } from "@/lib/utils";

// Map maturity to a 0-100 numeric score for radar plotting
function maturityScore(m: TechMaturity): number {
  const map: Record<TechMaturity, number> = {
    UNKNOWN: 0, RADAR: 10, RESEARCH: 20, EXPERIMENT: 30, EXPERIMENT_PILOT: 35,
    POC: 40, PILOT: 50, BETA: 60, PRODUCTION: 75, SCALING: 80, PRODUCTION_SCALING: 85,
    MATURE: 90, MATURE_PRODUCTION: 95,
  };
  return map[m] ?? 0;
}

// Select comparable technologies across all versions
const TECH_KEYS = ["Conversational AI (BIA)", "Cloud", "GenAI (Bridge)", "Open Finance", "Agentic AI", "Data Architecture"];

function getTechScore(versionId: string, key: string): number {
  const v = RADAR_VERSIONS.find((rv) => rv.version_id === versionId);
  if (!v) return 0;
  const mapping: Record<string, string> = {
    "Conversational AI (BIA)": ["Watson-based BIA", "BIA (Watson + GenAI transition)", "BIA (100% GenAI)"],
    "Cloud": ["Cloud migration (early)", "Multicloud (Azure/AWS/Oracle)", "Multicloud (hybrid)"],
    "GenAI (Bridge)": ["GenAI pilots (pre-Bridge)", "Bridge (GenAI platform)"],
    "Open Finance": ["Open Finance readiness", "Open Finance compliance"],
    "Agentic AI": ["Multi-agent architectures"],
    "Data Architecture": ["Data virtualization (QueryGrid)"],
  };
  const names = mapping[key] ?? [];
  for (const item of v.technology_items) {
    if (names.includes(item.name)) return maturityScore(item.maturity);
  }
  return 0;
}

const VERSION_COLORS: Record<string, string> = {
  RADAR_2022: "#6B7280",
  RADAR_2024: "#F59E0B",
  RADAR_2026: "#B91C3C",
};

export function RadarChart() {
  const [visibleVersions, setVisibleVersions] = React.useState<Set<string>>(new Set(RADAR_VERSIONS.map((v) => v.version_id)));

  const size = 360;
  const center = size / 2;
  const radius = size / 2 - 50;
  const axes = TECH_KEYS.length;
  const angleStep = (Math.PI * 2) / axes;

  const pointFor = (axisIdx: number, value: number) => {
    const angle = -Math.PI / 2 + axisIdx * angleStep;
    const r = (value / 100) * radius;
    return { x: center + Math.cos(angle) * r, y: center + Math.sin(angle) * r };
  };

  const axisEnd = (axisIdx: number) => {
    const angle = -Math.PI / 2 + axisIdx * angleStep;
    return { x: center + Math.cos(angle) * radius, y: center + Math.sin(angle) * radius };
  };

  const labelPos = (axisIdx: number) => {
    const angle = -Math.PI / 2 + axisIdx * angleStep;
    const r = radius + 28;
    return { x: center + Math.cos(angle) * r, y: center + Math.sin(angle) * r };
  };

  const toggleVersion = (id: string) => {
    setVisibleVersions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const rings = [25, 50, 75, 100];

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <RadarIcon className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Radar de Tecnología — Comparación Versionada</h3>
            <p className="text-[11px] text-muted-foreground">Evolución de madurez 2022 → 2024 → 2026 (reconstruido de disclosures)</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {RADAR_VERSIONS.map((v) => (
            <button
              key={v.version_id}
              onClick={() => toggleVersion(v.version_id)}
              className={cn("flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold transition-all", visibleVersions.has(v.version_id) ? "border-border bg-muted/60" : "border-border opacity-40")}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: VERSION_COLORS[v.version_id] }} />
              {v.version_id.replace("RADAR_", "")}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-4 lg:flex-row lg:items-start">
        <div className="relative">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="max-w-full">
            {/* Grid rings */}
            {rings.map((r) => (
              <circle key={r} cx={center} cy={center} r={(r / 100) * radius} fill="none" stroke="currentColor" strokeWidth={0.5} className="text-border" />
            ))}
            {/* Axes */}
            {TECH_KEYS.map((_, i) => {
              const end = axisEnd(i);
              return <line key={i} x1={center} y1={center} x2={end.x} y2={end.y} stroke="currentColor" strokeWidth={0.5} className="text-border" />;
            })}
            {/* Ring labels */}
            {rings.map((r) => (
              <text key={r} x={center + 3} y={center - (r / 100) * radius + 3} className="fill-muted-foreground text-[8px]">{r}</text>
            ))}
            {/* Data polygons per version */}
            {RADAR_VERSIONS.filter((v) => visibleVersions.has(v.version_id)).map((v) => {
              const points = TECH_KEYS.map((key, i) => {
                const p = pointFor(i, getTechScore(v.version_id, key));
                return `${p.x},${p.y}`;
              }).join(" ");
              const color = VERSION_COLORS[v.version_id];
              return (
                <g key={v.version_id}>
                  <polygon points={points} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={2} />
                  {TECH_KEYS.map((key, i) => {
                    const p = pointFor(i, getTechScore(v.version_id, key));
                    return <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />;
                  })}
                </g>
              );
            })}
            {/* Axis labels */}
            {TECH_KEYS.map((key, i) => {
              const p = labelPos(i);
              const anchor = Math.abs(p.x - center) < 10 ? "middle" : p.x > center ? "start" : "end";
              return (
                <text key={key} x={p.x} y={p.y} textAnchor={anchor} dominantBaseline="middle" className="fill-foreground text-[9px] font-semibold">
                  {key}
                </text>
              );
            })}
          </svg>
        </div>

        <div className="flex-1 space-y-2 text-xs">
          <p className="font-bold uppercase text-muted-foreground">Interpretación</p>
          <p className="text-foreground/80">
            El radar muestra la <strong>expansión consistente de madurez</strong> de Bradesco entre 2022 y 2026. BIA evolucionó
            de Watson-primary a 100% GenAI. Bridge emergió como plataforma consolidada. Multicloud escaló de experimento a SCALING.
            Open Finance pasó de piloto a MADURO (obligatorio).
          </p>
          <p className="text-foreground/80">
            <strong>Agentic AI</strong> aparece solo en 2026 como EXPERIMENT_PILOT — la frontera actual. <strong>Data Architecture</strong>
            (QueryGrid) entró al radar en 2026 en PRODUCTION.
          </p>
          <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-[11px] dark:border-amber-800 dark:bg-amber-950/30">
            <strong className="text-amber-700 dark:text-amber-300">Nota metodológica:</strong> Bradesco no publica un radar formal.
            Versiones reconstruidas de disclosures públicos. Las puntuaciones son inferidas, no auditadas.
          </div>
        </div>
      </div>
    </Card>
  );
}
