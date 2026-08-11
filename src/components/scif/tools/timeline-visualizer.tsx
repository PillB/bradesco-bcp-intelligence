"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { TIMELINE } from "@/lib/scif/data";
import { GitCommitHorizontal, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const ERA_COLORS: Record<string, string> = {
  FOUNDING: "#6B7280",
  DIVERSIFICATION: "#0F766E",
  ACQUISITION: "#7C3AED",
  PRODUCT_LAUNCH: "#2563EB",
  INNOVATION_LAB: "#B08D57",
  SUNSET: "#DC2626",
  REORGANIZATION: "#0891B2",
  TECH_STRATEGY: "#1D4ED8",
  AI_MILESTONE: "#B91C3C",
  FINANCIAL_MILESTONE: "#16A34A",
  INVESTMENT: "#D97706",
  CSR: "#6366F1",
};

export function TimelineVisualizer() {
  const [eraFilter, setEraFilter] = React.useState<string>("ALL");
  const eras = React.useMemo(() => {
    const set = new Set(TIMELINE.map((t) => t.type));
    return ["ALL", ...Array.from(set).sort()];
  }, []);

  const filtered = React.useMemo(() => {
    if (eraFilter === "ALL") return TIMELINE;
    return TIMELINE.filter((t) => t.type === eraFilter);
  }, [eraFilter]);

  const minYear = Math.min(...TIMELINE.map((t) => t.year));
  const maxYear = Math.max(...TIMELINE.map((t) => t.year));
  const span = maxYear - minYear;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <GitCommitHorizontal className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Visualizador de Línea Temporal Estratégica</h3>
            <p className="text-[11px] text-muted-foreground">{TIMELINE.length} eventos · {minYear}–{maxYear} · {span} años de historia</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={eraFilter}
            onChange={(e) => setEraFilter(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold outline-none focus:border-primary"
          >
            {eras.map((e) => (
              <option key={e} value={e}>{e === "ALL" ? "Todas las eras" : e.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Horizontal timeline track */}
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="relative min-w-[700px] px-4">
          {/* Track line */}
          <div className="absolute left-4 right-4 top-8 h-1 rounded-full bg-gradient-to-r from-muted via-primary/30 to-primary" />

          {/* Year markers */}
          <div className="absolute left-4 right-4 top-9 flex justify-between text-[9px] font-mono text-muted-foreground">
            {Array.from({ length: 6 }).map((_, i) => {
              const year = minYear + Math.round((span / 5) * i);
              return <span key={i}>{year}</span>;
            })}
          </div>

          {/* Events */}
          <div className="relative mt-12 space-y-2">
            {filtered.map((t, idx) => {
              const pos = ((t.year - minYear) / span) * 100;
              const color = ERA_COLORS[t.type] ?? "#6B7280";
              const above = idx % 2 === 0;
              return (
                <div
                  key={`${t.year}-${idx}`}
                  className="group relative transition-all hover:z-10"
                  style={{ marginLeft: `${pos}%`, transform: "translateX(-50%)" }}
                >
                  <div className="flex flex-col items-center">
                    {above && (
                      <div className="mb-2 hidden max-w-[200px] rounded-lg border border-border bg-popover p-2 shadow-sm group-hover:block">
                        <p className="text-[10px] font-bold" style={{ color }}>{t.year}</p>
                        <p className="text-[10px] font-medium leading-tight">{t.event}</p>
                        <p className="mt-0.5 text-[9px] text-muted-foreground">{t.significance}</p>
                      </div>
                    )}
                    <div
                      className="h-4 w-4 rounded-full border-2 border-background shadow-md transition-transform group-hover:scale-150"
                      style={{ backgroundColor: color }}
                    />
                    <div className="mt-1 text-center">
                      <p className="font-mono text-[10px] font-bold" style={{ color }}>{t.year}</p>
                    </div>
                    {!above && (
                      <div className="mt-1 hidden max-w-[200px] rounded-lg border border-border bg-popover p-2 shadow-sm group-hover:block">
                        <p className="text-[10px] font-medium leading-tight">{t.event}</p>
                        <p className="mt-0.5 text-[9px] text-muted-foreground">{t.significance}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Era legend */}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
        {Object.entries(ERA_COLORS).map(([era, color]) => {
          const count = TIMELINE.filter((t) => t.type === era).length;
          if (count === 0) return null;
          return (
            <button
              key={era}
              onClick={() => setEraFilter(eraFilter === era ? "ALL" : era)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all",
                eraFilter === era ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
              )}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              {era.replace(/_/g, " ")}
              <span className="text-muted-foreground">({count})</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
