"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { GanttChartSquare, Filter } from "lucide-react";
import { INITIATIVES } from "@/lib/scif/data";
import { theme } from "@/lib/scif/theme";
import { cn } from "@/lib/utils";

function parseYear(dateStr: string): number {
  const y = parseInt(dateStr);
  return isNaN(y) ? new Date(dateStr).getFullYear() || 2020 : y;
}

interface GanttRow {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  lifecycle: string;
  category: string;
  color: string;
}

const GANTT_DATA: GanttRow[] = INITIATIVES.map((i) => {
  const startYear = parseYear(i.first_seen);
  const endYear = parseYear(i.last_seen);
  const cfg = theme.lifecycle[i.lifecycle as keyof typeof theme.lifecycle] ?? theme.lifecycle.UNKNOWN;
  return {
    id: i.initiative_id,
    name: i.name,
    startYear,
    endYear,
    lifecycle: i.lifecycle,
    category: i.category,
    color: cfg.color,
  };
}).sort((a, b) => a.startYear - b.startYear);

const MIN_YEAR = Math.min(...GANTT_DATA.map((d) => d.startYear));
const MAX_YEAR = 2027;
const YEAR_SPAN = MAX_YEAR - MIN_YEAR;

const MILESTONES = [
  { year: 2016, label: "BIA launch" },
  { year: 2017, label: "Next launch" },
  { year: 2018, label: "Inovabra habitat" },
  { year: 2020, label: "Bitz launch" },
  { year: 2021, label: "Digio 100%" },
  { year: 2023, label: "Bitz sunset" },
  { year: 2024, label: "Next integrated" },
  { year: 2025, label: "Bridge launch" },
  { year: 2026, label: "R$10B capital" },
];

export function StrategicGantt() {
  const [filter, setFilter] = React.useState<string>("ALL");
  const categories = React.useMemo(() => ["ALL", ...Array.from(new Set(GANTT_DATA.map((d) => d.category)))], []);

  const filtered = filter === "ALL" ? GANTT_DATA : GANTT_DATA.filter((d) => d.category === filter);

  const yearToX = (year: number) => ((year - MIN_YEAR) / YEAR_SPAN) * 100;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <GanttChartSquare className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Gantt Estratégico — Timeline de Iniciativas</h3>
            <p className="text-[11px] text-muted-foreground">{GANTT_DATA.length} iniciativas · {MIN_YEAR}–{MAX_YEAR} · hitos clave marcados</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold outline-none focus:border-primary">
            {categories.map((c) => <option key={c} value={c}>{c === "ALL" ? "Todas categorías" : c}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Year axis */}
          <div className="relative mb-2 ml-48 h-6 border-b border-border">
            {Array.from({ length: YEAR_SPAN + 1 }).map((_, i) => {
              const year = MIN_YEAR + i;
              return (
                <div key={year} className="absolute top-0 flex flex-col items-center" style={{ left: `${yearToX(year)}%` }}>
                  <span className="text-[9px] font-mono font-bold text-muted-foreground">{year}</span>
                  <div className="h-2 w-px bg-border" />
                </div>
              );
            })}
          </div>

          {/* Milestones */}
          <div className="relative mb-3 ml-48 h-8">
            {MILESTONES.map((m) => (
              <div key={m.year} className="absolute top-0 group" style={{ left: `${yearToX(m.year)}%` }}>
                <div className="absolute -top-1 h-3 w-3 rotate-45 border-2 border-primary bg-background" />
                <div className="invisible absolute top-4 z-10 w-32 rounded-md border border-border bg-popover p-1.5 text-[9px] shadow-lg group-hover:visible">
                  <p className="font-bold text-primary">{m.year}</p>
                  <p className="text-foreground">{m.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Gantt rows */}
          <div className="space-y-1">
            {filtered.map((row) => {
              const cfg = theme.lifecycle[row.lifecycle as keyof typeof theme.lifecycle] ?? theme.lifecycle.UNKNOWN;
              const startX = yearToX(row.startYear);
              const widthX = yearToX(row.endYear) - startX;
              return (
                <div key={row.id} className="group flex items-center hover:bg-muted/20">
                  <div className="flex w-48 shrink-0 items-center gap-2 pr-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <span className="truncate text-[11px] font-medium" title={row.name}>{row.name}</span>
                  </div>
                  <div className="relative h-6 flex-1">
                    {/* Grid lines */}
                    {Array.from({ length: YEAR_SPAN + 1 }).map((_, i) => (
                      <div key={i} className="absolute top-0 h-full w-px bg-border/30" style={{ left: `${yearToX(MIN_YEAR + i)}%` }} />
                    ))}
                    {/* Bar */}
                    <div
                      className="absolute top-1 flex h-4 items-center overflow-hidden rounded-md transition-all group-hover:brightness-110"
                      style={{
                        left: `${startX}%`,
                        width: `${Math.max(widthX, 1.5)}%`,
                        background: `linear-gradient(90deg, ${row.color}88, ${row.color})`,
                        boxShadow: `0 1px 3px ${row.color}40`,
                      }}
                      title={`${row.name}: ${row.startYear}–${row.endYear} (${cfg.label})`}
                    >
                      <span className="ml-1 truncate text-[8px] font-bold text-white">{cfg.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-[10px]">
        <span className="font-bold uppercase text-muted-foreground">Estados:</span>
        {Array.from(new Set(GANTT_DATA.map((d) => d.lifecycle))).map((status) => {
          const cfg = theme.lifecycle[status as keyof typeof theme.lifecycle] ?? theme.lifecycle.UNKNOWN;
          return (
            <span key={status} className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
              {cfg.label}
            </span>
          );
        })}
        <span className="ml-2 flex items-center gap-1"><span className="h-2 w-2 rotate-45 border-2 border-primary bg-background" /> Hito clave (hover)</span>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <GanttChartSquare className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Lectura:</strong> La línea temporal muestra la coexistencia de marcas digitales (Next, Digio, Bitz) antes de la consolidación
          (Bitz sunset 2023, Next integrated 2024). BIA es la iniciativa más longeva (2016–presente). Bridge y el aumento de capital R$10B
          son los más recientes (2025-2026), reflejando la aceleración actual hacia GenAI y custodia digital.
        </div>
      </div>
    </Card>
  );
}
