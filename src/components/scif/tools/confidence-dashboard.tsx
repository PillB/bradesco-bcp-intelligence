"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { EvidenceTag } from "@/components/scif/evidence";
import { CLAIMS, SOURCES } from "@/lib/scif/data";
import { theme } from "@/lib/scif/theme";
import type { EvidenceStatus } from "@/lib/scif/types";
import { Gauge, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

export function ConfidenceDashboard() {
  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of CLAIMS) {
      counts[c.evidence_status] = (counts[c.evidence_status] ?? 0) + 1;
    }
    return counts;
  }, []);

  const total = CLAIMS.length;
  const strongCount = (statusCounts["VERIFIED"] ?? 0) + (statusCounts["INDEPENDENTLY_CORROBORATED"] ?? 0) + (statusCounts["STRONGLY_SUPPORTED"] ?? 0);
  const strongPct = (strongCount / total) * 100;
  const avgConfidence = CLAIMS.reduce((sum, c) => sum + c.confidence, 0) / total;
  const tierCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of SOURCES) {
      counts[s.source_tier] = (counts[s.source_tier] ?? 0) + 1;
    }
    return counts;
  }, []);

  const statuses: EvidenceStatus[] = ["VERIFIED", "INDEPENDENTLY_CORROBORATED", "STRONGLY_SUPPORTED", "PARTIAL", "INFERRED", "UNRESOLVED"];

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Gauge className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-bold text-sm">Dashboard de Confianza de Evidencia</h3>
          <p className="text-[11px] text-muted-foreground">{total} claims · {SOURCES.length} fuentes · confianza promedio {(avgConfidence * 100).toFixed(0)}%</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/20">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-300">{strongCount}</p>
          <p className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">Claims fuertes</p>
          <p className="text-[10px] text-muted-foreground">{strongPct.toFixed(0)}% del total</p>
        </div>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <TrendingUp className="h-5 w-5 text-primary" />
          <p className="mt-1 text-2xl font-black text-primary">{(avgConfidence * 100).toFixed(0)}%</p>
          <p className="text-[10px] font-semibold uppercase text-primary">Confianza avg</p>
          <p className="text-[10px] text-muted-foreground">sobre {total} claims</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <p className="mt-1 text-2xl font-black text-amber-600">{statusCounts["UNRESOLVED"] ?? 0}</p>
          <p className="text-[10px] font-semibold uppercase text-amber-600">Unresolved</p>
          <p className="text-[10px] text-muted-foreground">PendingRecords</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground">A</div>
          <p className="mt-1 text-2xl font-black text-foreground">{tierCounts["A"] ?? 0}</p>
          <p className="text-[10px] font-semibold uppercase text-muted-foreground">Fuentes Tier A</p>
          <p className="text-[10px] text-muted-foreground">primarias autoritativas</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Distribución por estado de evidencia</p>
        <div className="flex h-8 overflow-hidden rounded-lg">
          {statuses.map((s) => {
            const count = statusCounts[s] ?? 0;
            if (count === 0) return null;
            const pct = (count / total) * 100;
            const cfg = theme.evidence[s];
            return (
              <div
                key={s}
                className="group relative flex items-center justify-center transition-all hover:brightness-110"
                style={{ width: `${pct}%`, backgroundColor: cfg.dot }}
                title={`${cfg.label}: ${count} claims (${pct.toFixed(0)}%)`}
              >
                {pct > 8 && <span className="text-[10px] font-bold text-white">{count}</span>}
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {statuses.map((s) => {
            const count = statusCounts[s] ?? 0;
            if (count === 0) return null;
            return (
              <div key={s} className="flex items-center gap-1.5 text-[10px]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: theme.evidence[s].dot }} />
                <span className="text-muted-foreground">{theme.evidence[s].label}</span>
                <span className="font-bold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Fuentes por tier</p>
        <div className="grid grid-cols-5 gap-2">
          {(["A", "B", "C", "D", "E"] as const).map((t) => {
            const count = tierCounts[t] ?? 0;
            const cfg = theme.tier[t];
            const maxTier = Math.max(...Object.values(tierCounts).map(Number));
            const h = maxTier > 0 ? (count / maxTier) * 100 : 0;
            return (
              <div key={t} className="flex flex-col items-center">
                <div className="flex h-20 w-full items-end overflow-hidden rounded-md bg-muted/30">
                  <div className="w-full rounded-t-md transition-all duration-500" style={{ height: `${h}%`, backgroundColor: cfg.color, minHeight: count > 0 ? "4px" : "0" }} />
                </div>
                <span className="mt-1 text-[10px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                <span className="text-[10px] text-muted-foreground">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
