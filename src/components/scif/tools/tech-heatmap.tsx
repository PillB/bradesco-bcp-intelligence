"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { EvidenceTag } from "@/components/scif/evidence";
import { Grid3x3 } from "lucide-react";
import { TECH_CAPABILITIES } from "@/lib/scif/data";
import { theme } from "@/lib/scif/theme";
import type { TechMaturity } from "@/lib/scif/types";
import { cn } from "@/lib/utils";

const MATURITY_ORDER: TechMaturity[] = ["UNKNOWN", "RADAR", "RESEARCH", "EXPERIMENT", "EXPERIMENT_PILOT", "POC", "PILOT", "BETA", "PRODUCTION", "SCALING", "PRODUCTION_SCALING", "MATURE", "MATURE_PRODUCTION"];

const CATEGORY_GROUPS: Record<string, string[]> = {
  "IA y Datos": ["GenAI", "Conversational AI", "Agentic AI", "AI governance", "Data architecture", "Data / Model risk"],
  "Cloud e Infra": ["Cloud"],
  "Pagos y Open Finance": ["Payments", "Open Finance"],
  "Seguridad e Identidad": ["Digital identity", "Fraud / AML"],
  "Emergentes": ["Emerging"],
};

function maturityScore(m: TechMaturity): number {
  const idx = MATURITY_ORDER.indexOf(m);
  return idx === -1 ? 0 : idx;
}

function heatColor(m: TechMaturity): string {
  const s = maturityScore(m);
  const total = MATURITY_ORDER.length - 1;
  const ratio = s / total;
  if (m === "UNKNOWN") return "#475569";
  // gradient from amber (low) to emerald (high)
  if (ratio < 0.33) return "#F59E0B";
  if (ratio < 0.66) return "#22C55E";
  return "#16A34A";
}

export function TechHeatmap() {
  const [filter, setFilter] = React.useState<string>("ALL");
  const categories = Object.keys(CATEGORY_GROUPS);

  const filtered = React.useMemo(() => {
    if (filter === "ALL") return TECH_CAPABILITIES;
    const cats = CATEGORY_GROUPS[filter];
    return TECH_CAPABILITIES.filter((t) => cats.includes(t.category));
  }, [filter]);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Grid3x3 className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Heatmap de Capacidades Tecnológicas</h3>
            <p className="text-[11px] text-muted-foreground">{TECH_CAPABILITIES.length} capacidades clasificadas por madurez · hover para evidencia</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <button onClick={() => setFilter("ALL")} className={cn("rounded-md border px-2 py-0.5 text-[10px] font-semibold", filter === "ALL" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted")}>Todas</button>
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={cn("rounded-md border px-2 py-0.5 text-[10px] font-semibold", filter === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted")}>{c}</button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] gap-1 text-xs">
        <div className="font-bold uppercase text-muted-foreground">Capacidad</div>
        <div className="font-bold uppercase text-muted-foreground">Madurez</div>
        {filtered.map((t) => {
          const cfg = theme.lifecycle[t.maturity as keyof typeof theme.lifecycle] ?? theme.lifecycle.UNKNOWN;
          return (
            <React.Fragment key={t.tech_id}>
              <div
                className="group relative cursor-help rounded-l-md border-r-2 px-3 py-2 transition-colors hover:bg-muted/40"
                style={{ borderColor: heatColor(t.maturity) }}
                title={`${t.name}\n${t.maturity_evidence}\nConfianza: ${Math.round(t.confidence * 100)}%`}
              >
                <div className="font-medium">{t.name}</div>
                <div className="text-[10px] text-muted-foreground">{t.category}</div>
                <div className="invisible absolute left-full top-0 z-20 ml-2 w-64 rounded-md border border-border bg-popover p-3 text-[11px] shadow-lg group-hover:visible">
                  <p className="font-bold">{t.name}</p>
                  <p className="mt-1 text-muted-foreground">{t.maturity_evidence}</p>
                  <div className="mt-2 flex items-center gap-1"><EvidenceTag status={t.evidence_status} /></div>
                  {t.notes && <p className="mt-1 text-[10px] italic text-muted-foreground">{t.notes}</p>}
                </div>
              </div>
              <div
                className="flex items-center justify-center rounded-r-md px-2 font-bold text-white"
                style={{ backgroundColor: heatColor(t.maturity) }}
              >
                <span className="text-[10px] uppercase tracking-wide">{cfg.label}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-[10px]">
        <span className="font-bold uppercase text-muted-foreground">Leyenda:</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: "#475569" }} /> UNKNOWN (PendingRecord)</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: "#F59E0B" }} /> Experimento / Piloto</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: "#22C55E" }} /> Producción</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ backgroundColor: "#16A34A" }} /> Maduro / Escala</span>
      </div>
    </Card>
  );
}
