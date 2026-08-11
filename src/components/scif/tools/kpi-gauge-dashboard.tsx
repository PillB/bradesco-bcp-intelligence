"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { Gauge, TrendingUp, TrendingDown } from "lucide-react";

interface KPIGauge {
  id: string;
  label: string;
  value: number;
  max: number;
  unit: string;
  target?: number;
  color: string;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
  entity: "Bradesco" | "BCP" | "Credicorp";
  source: string;
}

const KPIS: KPIGauge[] = [
  { id: "roae-bradesco", label: "ROAE Bradesco", value: 15.2, max: 30, unit: "%", target: 20, color: "#B91C3C", trend: "up", trendValue: "+26.1% YoY", entity: "Bradesco", source: "C002" },
  { id: "roae-bcp", label: "ROAE BCP", value: 24.7, max: 30, unit: "%", color: "#0F766E", trend: "up", trendValue: "costo riesgo 1.28%", entity: "BCP", source: "C013" },
  { id: "roae-seguros", label: "ROAE Seguros", value: 21.9, max: 30, unit: "%", color: "#B08D57", trend: "up", entity: "Bradesco", source: "C004" },
  { id: "efficiency", label: "Eficiencia Bradesco", value: 50, max: 100, unit: "%", target: 40, color: "#F59E0B", trend: "down", trendValue: "meta 40% 2028", entity: "Bradesco", source: "C003" },
  { id: "bia-retention", label: "Retención BIA", value: 90, max: 100, unit: "%", color: "#16A34A", trend: "up", trendValue: "85-90% → 90%", entity: "Bradesco", source: "C005" },
  { id: "bridge-cases", label: "Casos Bridge", value: 500, max: 600, unit: "", color: "#7C3AED", trend: "up", trendValue: "70 a escala", entity: "Bradesco", source: "C006" },
  { id: "fraude-reduction", label: "Reducción fraude", value: 25, max: 50, unit: "%", color: "#1D4ED8", trend: "up", trendValue: "FICO 1B tx/mes", entity: "Bradesco", source: "C022" },
  { id: "nps-bcp", label: "NPS BCP", value: 3, max: 10, unit: "pts", color: "#0F766E", trend: "up", trendValue: "digital + IA", entity: "BCP", source: "C023" },
];

function GaugeSVG({ kpi }: { kpi: KPIGauge }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(kpi.value / kpi.max, 1);
  const offset = circumference * (1 - pct);
  const targetPct = kpi.target ? kpi.target / kpi.max : null;
  const targetOffset = targetPct ? circumference * (1 - targetPct) : null;

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
          {/* Background circle */}
          <circle cx="65" cy="65" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/30" />
          {/* Progress arc */}
          <circle
            cx="65" cy="65" r={radius} fill="none" stroke={kpi.color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out", filter: `drop-shadow(0 0 6px ${kpi.color}40)` }}
          />
          {/* Target marker */}
          {targetOffset !== null && (
            <circle
              cx="65" cy="65" r={radius} fill="none" stroke="#000" strokeWidth="2"
              strokeDasharray="2 8"
              strokeDashoffset={targetOffset}
              className="dark:stroke-white"
              opacity={0.4}
            />
          )}
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-black tabular-nums" style={{ color: kpi.color }}>
            {kpi.value}{kpi.unit}
          </p>
          {kpi.target && (
            <p className="text-[9px] font-semibold text-muted-foreground">→ {kpi.target}{kpi.unit}</p>
          )}
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] font-bold leading-tight">{kpi.label}</p>
      {kpi.trend && (
        <div className="mt-0.5 flex items-center gap-1 text-[10px]">
          {kpi.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-500" />}
          {kpi.trend === "down" && <TrendingDown className="h-3 w-3 text-amber-500" />}
          <span className={kpi.trend === "up" ? "text-emerald-600" : "text-amber-600"}>{kpi.trendValue}</span>
        </div>
      )}
      <p className="mt-0.5 text-[9px] text-muted-foreground">{kpi.source}</p>
    </div>
  );
}

export function KpiGaugeDashboard() {
  const [filter, setFilter] = React.useState<string>("ALL");
  const entities = ["ALL", "Bradesco", "BCP", "Credicorp"];
  const filtered = filter === "ALL" ? KPIS : KPIS.filter((k) => k.entity === filter);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Dashboard de KPIs — Gauges Animados</h3>
            <p className="text-[11px] text-muted-foreground">{KPIS.length} métricas clave · círculos = valor actual · línea punteada = meta</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {entities.map((e) => (
            <button key={e} onClick={() => setFilter(e)} className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${filter === e ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}>{e === "ALL" ? "Todos" : e}</button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 overflow-x-auto">
        {filtered.map((kpi) => <GaugeSVG key={kpi.id} kpi={kpi} />)}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-3 text-[10px]">
        <span className="font-bold uppercase text-muted-foreground">Leyenda:</span>
        <span className="flex items-center gap-1"><span className="h-2 w-6 rounded-full bg-muted/30" /> rango 0–max</span>
        <span className="flex items-center gap-1"><span className="h-2 w-6 rounded-full" style={{ backgroundColor: "#B91C3C" }} /> progreso actual</span>
        <span className="flex items-center gap-1"><span className="h-2 w-6 rounded-full border-2 border-dashed border-foreground/40" /> meta objetivo</span>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Lectura:</strong> Bradesco muestra mejoras en ROAE (+26.1% YoY), retención BIA (90%), y reducción de fraude (-25%).
          BCP lidera en ROAE (24.7%) y NPS (+3). La meta de eficiencia de Bradesco (40% para 2028) requiere reducir 10pp desde el 50% actual.
          Los gauges muestran progreso relativo al máximo definido, no al objetivo absoluto.
        </div>
      </div>
    </Card>
  );
}
