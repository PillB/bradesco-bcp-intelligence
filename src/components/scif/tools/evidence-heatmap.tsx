"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { SOURCES, CLAIMS } from "@/lib/scif/data";
import { Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

function parseYear(dateStr: string): number {
  const y = new Date(dateStr).getFullYear();
  return isNaN(y) ? 0 : y;
}

function parseMonth(dateStr: string): number {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? -1 : d.getMonth();
}

const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export function EvidenceHeatmap() {
  // Build year x month matrix of source counts
  const years = React.useMemo(() => {
    const ys = new Set<number>();
    SOURCES.forEach((s) => { const y = parseYear(s.publication_date); if (y > 0) ys.add(y); });
    CLAIMS.forEach((c) => { const y = parseYear(c.publication_date); if (y > 0) ys.add(y); });
    return Array.from(ys).sort();
  }, []);

  const matrix = React.useMemo(() => {
    const m: Record<number, number[]> = {};
    years.forEach((y) => { m[y] = new Array(12).fill(0); });
    SOURCES.forEach((s) => {
      const y = parseYear(s.publication_date);
      const mo = parseMonth(s.publication_date);
      if (y > 0 && mo >= 0 && m[y]) m[y][mo]++;
    });
    return m;
  }, [years]);

  const maxCount = React.useMemo(() => {
    let max = 0;
    Object.values(matrix).forEach((months) => months.forEach((c) => { if (c > max) max = c; }));
    return max || 1;
  }, [matrix]);

  function heatColor(count: number): string {
    if (count === 0) return "transparent";
    const ratio = count / maxCount;
    if (ratio > 0.75) return "#B91C3C";
    if (ratio > 0.5) return "#DC4E6A";
    if (ratio > 0.25) return "#E87B91";
    return "#F5B5C0";
  }

  const totalByYear = React.useMemo(() => {
    const tby: Record<number, number> = {};
    Object.entries(matrix).forEach(([y, months]) => {
      tby[Number(y)] = months.reduce((s, c) => s + c, 0);
    });
    return tby;
  }, [matrix]);

  const maxYearTotal = Math.max(...Object.values(totalByYear), 1);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Heatmap Temporal de Evidencia</h3>
            <p className="text-[11px] text-muted-foreground">Densidad de fuentes por mes · {years.length} años · patrón de actividad de publicación</p>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-card px-2 py-1 text-left font-semibold text-muted-foreground">Año</th>
              {MONTH_LABELS.map((m) => (
                <th key={m} className="px-1 py-1 text-center font-semibold text-muted-foreground">{m}</th>
              ))}
              <th className="px-2 py-1 text-right font-semibold text-muted-foreground">Total</th>
            </tr>
          </thead>
          <tbody>
            {years.slice().reverse().map((year) => (
              <tr key={year} className="border-b border-border/30">
                <td className="sticky left-0 z-10 bg-card px-2 py-1 font-bold text-foreground">{year}</td>
                {matrix[year].map((count, mo) => (
                  <td key={mo} className="p-0.5">
                    <div
                      className={cn(
                        "group relative flex h-7 w-full items-center justify-center rounded transition-all hover:scale-110 hover:ring-2 hover:ring-primary/40",
                        count === 0 && "border border-border/40 bg-muted/20"
                      )}
                      style={count > 0 ? { backgroundColor: heatColor(count) } : undefined}
                      title={`${MONTH_LABELS[mo]} ${year}: ${count} fuente(s)`}
                    >
                      {count > 0 && <span className="text-[9px] font-bold text-white">{count}</span>}
                    </div>
                  </td>
                ))}
                <td className="px-2 py-1 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="h-3 w-16 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(totalByYear[year] / maxYearTotal) * 100}%` }} />
                    </div>
                    <span className="font-bold tabular-nums">{totalByYear[year]}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-[10px]">
        <span className="font-bold uppercase text-muted-foreground">Densidad:</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded border border-border/40 bg-muted/20" /> 0</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: "#F5B5C0" }} /> bajo</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: "#E87B91" }} /> medio</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: "#DC4E6A" }} /> alto</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: "#B91C3C" }} /> pico</span>
        <span className="ml-auto flex items-center gap-1 text-muted-foreground">
          <TrendingUp className="h-3 w-3" />
          Total: {SOURCES.length} fuentes
        </span>
      </div>

      {/* Insight */}
      <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Patrón temporal:</strong> La densidad de publicación se concentra en 2025-2026, reflejando la aceleración
          de la transformación digital de Bradesco (Bridge, BIA GenAI, FICO, Parfin stablecoin) y la respuesta de Credicorp
          (NPS +3, GenIA). Los años anteriores tienen menor densidad de fuentes publicadas — las claims históricas
          requieren caveats de staleness (ver Freshness Monitor).
        </div>
      </div>
    </Card>
  );
}
