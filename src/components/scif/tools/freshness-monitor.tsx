"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { TierBadge } from "@/components/scif/evidence";
import { SOURCES } from "@/lib/scif/data";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

function monthsSince(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date("2026-08-11");
  return Math.max(0, (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth()));
}

function freshnessLevel(months: number): "fresh" | "ok" | "stale" | "very-stale" {
  if (months <= 6) return "fresh";
  if (months <= 12) return "ok";
  if (months <= 24) return "stale";
  return "very-stale";
}

const FRESHNESS_CFG = {
  fresh: { color: "#16A34A", label: "Fresco (≤6m)", bg: "bg-emerald-500" },
  ok: { color: "#22C55E", label: "Aceptable (6-12m)", bg: "bg-lime-500" },
  stale: { color: "#F59E0B", label: "Desactualizado (12-24m)", bg: "bg-amber-500" },
  "very-stale": { color: "#DC2626", label: "Muy desactualizado (>24m)", bg: "bg-red-500" },
};

export function FreshnessMonitor() {
  const [filter, setFilter] = React.useState<string>("ALL");

  const sourcesWithAge = React.useMemo(() => {
    return SOURCES.map((s) => {
      const months = monthsSince(s.publication_date);
      return { ...s, months, level: freshnessLevel(months) };
    }).sort((a, b) => b.months - a.months);
  }, []);

  const filtered = filter === "ALL" ? sourcesWithAge : sourcesWithAge.filter((s) => s.level === filter);

  const counts = React.useMemo(() => {
    const c: Record<string, number> = { fresh: 0, ok: 0, stale: 0, "very-stale": 0 };
    for (const s of sourcesWithAge) c[s.level]++;
    return c;
  }, [sourcesWithAge]);

  const staleCount = counts.stale + counts["very-stale"];
  const stalePct = (staleCount / sourcesWithAge.length) * 100;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Monitor de Frescura de Evidencia</h3>
            <p className="text-[11px] text-muted-foreground">{sourcesWithAge.length} fuentes · {staleCount} desactualizadas ({stalePct.toFixed(0)}%)</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <button onClick={() => setFilter("ALL")} className={cn("rounded-md border px-2 py-0.5 text-[10px] font-semibold", filter === "ALL" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted")}>Todas</button>
          {Object.entries(FRESHNESS_CFG).map(([k, cfg]) => (
            <button key={k} onClick={() => setFilter(k)} className={cn("flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold", filter === k ? "border-primary bg-primary/10" : "border-border hover:bg-muted")}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.color }} />
              {cfg.label.split(" ")[0]} ({counts[k as keyof typeof counts]})
            </button>
          ))}
        </div>
      </div>

      {stalePct > 30 && (
        <div className="mt-3 flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 p-2 text-xs dark:border-amber-800 dark:bg-amber-950/30">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span className="text-amber-800 dark:text-amber-200"><strong>Atención:</strong> {stalePct.toFixed(0)}% de las fuentes tienen &gt;12 meses. Las claims apoyadas en estas fuentes deben marcarse con advertencia de staleness.</span>
        </div>
      )}

      {/* Timeline bar */}
      <div className="mt-4">
        <div className="flex h-6 overflow-hidden rounded-md">
          {Object.entries(FRESHNESS_CFG).map(([k, cfg]) => {
            const count = counts[k as keyof typeof counts];
            if (count === 0) return null;
            const pct = (count / sourcesWithAge.length) * 100;
            return (
              <div key={k} className={cn("flex items-center justify-center transition-all hover:brightness-110", cfg.bg)} style={{ width: `${pct}%` }} title={`${cfg.label}: ${count}`}>
                {pct > 8 && <span className="text-[10px] font-bold text-white">{count}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sources list */}
      <div className="mt-4 max-h-[400px] space-y-1.5 overflow-y-auto pr-1">
        {filtered.map((s) => {
          const cfg = FRESHNESS_CFG[s.level];
          return (
            <div key={s.source_id} className="flex items-center gap-3 rounded-lg border border-border/60 p-2 transition-colors hover:bg-muted/30">
              <div className="relative flex h-10 w-1 shrink-0 overflow-hidden rounded-full" title={`${s.months} meses`}>
                <div className="w-full" style={{ backgroundColor: cfg.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-primary">{s.source_id}</span>
                  <TierBadge tier={s.source_tier} />
                  <span className="text-[10px] text-muted-foreground">{s.months}m</span>
                </div>
                <p className="truncate text-[11px] font-medium">{s.publisher}</p>
                <p className="text-[9px] text-muted-foreground">Publicado: {s.publication_date}</p>
              </div>
              <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: cfg.color }}>
                {cfg.label.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
