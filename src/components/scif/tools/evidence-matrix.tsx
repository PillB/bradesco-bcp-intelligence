"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { Grid3x3, Info } from "lucide-react";
import { CLAIMS } from "@/lib/scif/data";
import { theme } from "@/lib/scif/theme";
import type { EvidenceStatus } from "@/lib/scif/types";
import { cn } from "@/lib/utils";

const STATUS_ORDER: EvidenceStatus[] = ["VERIFIED", "INDEPENDENTLY_CORROBORATED", "STRONGLY_SUPPORTED", "PARTIAL", "INFERRED", "UNRESOLVED"];
const STATUS_SHORT: Record<EvidenceStatus, string> = {
  VERIFIED: "VER",
  INDEPENDENTLY_CORROBORATED: "COR",
  STRONGLY_SUPPORTED: "STR",
  PARTIAL: "PAR",
  INFERRED: "INF",
  HYPOTHESIS: "HYP",
  CONTRADICTED: "CON",
  STALE: "STL",
  HISTORICAL_ONLY: "HIS",
  UNRESOLVED: "UNR",
};

export function EvidenceMatrix() {
  const [hovered, setHovered] = React.useState<string | null>(null);

  // Build matrix: topics (rows) × evidence status (columns)
  const topics = React.useMemo(() => {
    const set = new Set(CLAIMS.map((c) => c.topic));
    return Array.from(set).sort();
  }, []);

  const matrix = React.useMemo(() => {
    const m: Record<string, Record<EvidenceStatus, typeof CLAIMS>> = {};
    topics.forEach((t) => {
      m[t] = {} as Record<EvidenceStatus, typeof CLAIMS>;
      STATUS_ORDER.forEach((s) => { m[t][s] = []; });
      CLAIMS.filter((c) => c.topic === t).forEach((c) => {
        if (m[t][c.evidence_status]) m[t][c.evidence_status].push(c);
      });
    });
    return m;
  }, [topics]);

  const hoveredClaim = hovered ? CLAIMS.find((c) => c.claim_id === hovered) : null;

  // Compute column totals
  const colTotals = STATUS_ORDER.map((s) => CLAIMS.filter((c) => c.evidence_status === s).length);

  function cellColor(status: EvidenceStatus, count: number): string {
    if (count === 0) return "transparent";
    const cfg = theme.evidence[status];
    return cfg.dot;
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Grid3x3 className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Matriz de Calidad de Evidencia — Topics × Estado</h3>
            <p className="text-[11px] text-muted-foreground">{topics.length} topics × {STATUS_ORDER.length} estados · click celda para ver claims</p>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-card px-2 py-1.5 text-left font-semibold text-muted-foreground">Topic</th>
              {STATUS_ORDER.map((s) => (
                <th key={s} className="px-1 py-1.5 text-center font-semibold" style={{ color: theme.evidence[s].dot }}>
                  <div>{theme.evidence[s].label}</div>
                  <div className="text-[8px] font-mono">{colTotals[STATUS_ORDER.indexOf(s)]}</div>
                </th>
              ))}
              <th className="px-2 py-1.5 text-right font-semibold text-muted-foreground">Total</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => {
              const total = CLAIMS.filter((c) => c.topic === topic).length;
              return (
                <tr key={topic} className="border-b border-border/30 hover:bg-muted/20">
                  <td className="sticky left-0 z-10 bg-card px-2 py-1.5 font-medium">{topic}</td>
                  {STATUS_ORDER.map((status) => {
                    const cellClaims = matrix[topic][status];
                    const count = cellClaims.length;
                    const color = cellColor(status, count);
                    return (
                      <td key={status} className="p-1">
                        <div className="flex flex-wrap justify-center gap-0.5">
                          {cellClaims.map((c) => (
                            <button
                              key={c.claim_id}
                              onClick={() => setHovered(hovered === c.claim_id ? null : c.claim_id)}
                              className={cn(
                                "flex h-6 w-6 items-center justify-center rounded text-[7px] font-bold transition-all hover:scale-125 hover:z-10 hover:ring-2 hover:ring-primary/40",
                                hovered === c.claim_id && "scale-125 ring-2 ring-primary z-10"
                              )}
                              style={{ backgroundColor: color, color: "white" }}
                              title={`${c.claim_id}: ${c.claim.slice(0, 60)}...`}
                            >
                              {c.claim_id.replace("C", "")}
                            </button>
                          ))}
                          {count === 0 && <span className="text-muted-foreground/20">·</span>}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-2 py-1.5 text-right font-bold tabular-nums">{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail */}
      {hoveredClaim && (
        <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-primary">{hoveredClaim.claim_id}</span>
            <span className="rounded px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: theme.evidence[hoveredClaim.evidence_status].dot }}>
              {theme.evidence[hoveredClaim.evidence_status].label}
            </span>
            <span className="text-[10px] text-muted-foreground">Topic: {hoveredClaim.topic}</span>
          </div>
          <p className="mt-1 text-xs">{hoveredClaim.claim}</p>
          <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
            <span>Confianza: <strong>{Math.round(hoveredClaim.confidence * 100)}%</strong></span>
            <span>Fuentes: <strong>{hoveredClaim.source_ids.length}</strong></span>
            <span>As-of: {hoveredClaim.as_of_date}</span>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Lectura:</strong> La matriz revela dónde la evidencia es fuerte (VER/COR) vs débil (UNR).
          Topics como "scale" y "profitability" tienen alta calidad de evidencia (VERIFIED).
          Topics como "quantum" y "biometrics" tienen evidencia más reciente pero de calidad alta.
          Cada celda contiene botones clickeables con el ID del claim — click para ver el detalle completo.
        </div>
      </div>
    </Card>
  );
}
