"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { EvidenceTag, SourcePill, ConfidenceMeter, ClaimRef } from "@/components/scif/evidence";
import { CLAIMS, SOURCES } from "@/lib/scif/data";
import type { EvidenceStatus } from "@/lib/scif/types";
import { Network, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export function ClaimExplorer() {
  const [topicFilter, setTopicFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<EvidenceStatus | "ALL">("ALL");
  const [selectedClaim, setSelectedClaim] = React.useState<string | null>(null);

  const topics = React.useMemo(() => {
    const set = new Set(CLAIMS.map((c) => c.topic));
    return ["ALL", ...Array.from(set).sort()];
  }, []);

  const filtered = React.useMemo(() => {
    return CLAIMS.filter((c) => {
      if (topicFilter !== "ALL" && c.topic !== topicFilter) return false;
      if (statusFilter !== "ALL" && c.evidence_status !== statusFilter) return false;
      return true;
    });
  }, [topicFilter, statusFilter]);

  const selected = CLAIMS.find((c) => c.claim_id === selectedClaim);
  const selectedSources = selected ? SOURCES.filter((s) => selected.source_ids.includes(s.source_id)) : [];

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Explorador de Claims — Grafo de Evidencia</h3>
            <p className="text-[11px] text-muted-foreground">{CLAIMS.length} claims interactivos · click para ver fuentes conectadas</p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold outline-none focus:border-primary"
        >
          {topics.map((t) => (
            <option key={t} value={t}>{t === "ALL" ? "Todos los temas" : t}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as EvidenceStatus | "ALL")}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold outline-none focus:border-primary"
        >
          <option value="ALL">Todos los estados</option>
          <option value="VERIFIED">Verificado</option>
          <option value="INDEPENDENTLY_CORROBORATED">Corroborado independiente</option>
          <option value="STRONGLY_SUPPORTED">Fuertemente respaldado</option>
          <option value="PARTIAL">Parcial</option>
          <option value="INFERRED">Inferido</option>
          <option value="UNRESOLVED">No resuelto</option>
        </select>
        <span className="ml-auto text-[10px] text-muted-foreground">{filtered.length} claims mostrados</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Claims list */}
        <div className="max-h-[480px] space-y-2 overflow-y-auto pr-2">
          {filtered.map((c) => (
            <button
              key={c.claim_id}
              onClick={() => setSelectedClaim(c.claim_id)}
              className={cn(
                "w-full rounded-lg border p-3 text-left transition-all",
                selectedClaim === c.claim_id ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/40 hover:bg-muted/30"
              )}
            >
              <div className="flex items-start gap-2">
                <span className="font-mono text-[10px] font-bold text-primary">{c.claim_id}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium leading-snug">{c.claim}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <EvidenceTag status={c.evidence_status} />
                    <ConfidenceMeter value={c.confidence} />
                    <span className="rounded bg-muted px-1 py-0.5 text-[9px] text-muted-foreground">{c.topic}</span>
                    <span className="text-[9px] text-muted-foreground">{c.source_ids.length} fuentes</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              No hay claims que coincidan con los filtros.
            </div>
          )}
        </div>

        {/* Selected claim detail with source graph */}
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          {!selected ? (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center text-xs text-muted-foreground">
              <Network className="mb-2 h-8 w-8 opacity-30" />
              <p>Selecciona un claim para ver su grafo de fuentes</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-primary">{selected.claim_id}</span>
                <EvidenceTag status={selected.evidence_status} />
              </div>
              <p className="mt-2 text-xs font-medium">{selected.claim}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                <span>Entity: <strong>{selected.entity.replace(/_/g, " ")}</strong></span>
                <span>Topic: <strong>{selected.topic}</strong></span>
                <span>As-of: <strong>{selected.as_of_date}</strong></span>
              </div>
              {selected.evidence_excerpt && (
                <div className="mt-2 rounded bg-background p-2 text-[11px] italic text-foreground/70">
                  "{selected.evidence_excerpt}"
                </div>
              )}

              {/* Source graph visualization */}
              <div className="mt-3">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Fuentes conectadas ({selectedSources.length}) · {selected.independence_clusters.length} clusters independientes
                </p>
                <div className="relative">
                  <svg width="100%" height={Math.max(120, selectedSources.length * 32)} viewBox={`0 0 400 ${Math.max(120, selectedSources.length * 32)}`}>
                    {/* Central claim node */}
                    <circle cx="60" cy={Math.max(60, (selectedSources.length * 32) / 2)} r="20" fill="#B91C3C" />
                    <text x="60" y={Math.max(60, (selectedSources.length * 32) / 2) + 3} textAnchor="middle" className="fill-white text-[9px] font-bold">{selected.claim_id}</text>

                    {/* Source nodes */}
                    {selectedSources.map((s, i) => {
                      const y = 30 + i * 32;
                      const tierColors: Record<string, string> = { A: "#166534", B: "#1D4ED8", C: "#6D28D9", D: "#B45309", E: "#9CA3AF" };
                      const color = tierColors[s.source_tier];
                      return (
                        <g key={s.source_id}>
                          <line x1="80" y1={Math.max(60, (selectedSources.length * 32) / 2)} x2="180" y2={y} stroke={color} strokeWidth="1.5" strokeOpacity="0.4" />
                          <circle cx="200" cy={y} r="14" fill={color} />
                          <text x="200" y={y + 2} textAnchor="middle" className="fill-white text-[8px] font-bold">{s.source_tier}</text>
                          <text x="222" y={y - 2} className="fill-foreground text-[9px] font-semibold">{s.source_id}</text>
                          <text x="222" y={y + 9} className="fill-muted-foreground text-[8px]">{s.publisher.slice(0, 35)}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {selected.inference && (
                <div className="mt-3 rounded-md border border-primary/20 bg-primary/5 p-2 text-[11px]">
                  <p className="font-bold text-primary">Inferencia</p>
                  <p className="text-foreground/80">{selected.inference}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
