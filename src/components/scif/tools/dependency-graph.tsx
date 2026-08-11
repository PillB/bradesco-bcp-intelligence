"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { GitGraph, Info } from "lucide-react";
import { RECOMMENDATIONS, CLAIMS } from "@/lib/scif/data";
import { theme } from "@/lib/scif/theme";
import { cn } from "@/lib/utils";

interface DNode {
  id: string;
  label: string;
  type: "recommendation" | "claim" | "source";
  x: number;
  y: number;
  color: string;
  r: number;
}

interface DEdge {
  source: string;
  target: string;
  type: "supports" | "contradicts";
}

// Build graph: recommendations → supporting claims → sources
function buildDependencyGraph(): { nodes: DNode[]; edges: DEdge[] } {
  const nodes: DNode[] = [];
  const edges: DEdge[] = [];
  const w = 640, h = 400;

  // Recommendations on left
  RECOMMENDATIONS.forEach((rec, i) => {
    const y = 40 + i * (320 / RECOMMENDATIONS.length);
    nodes.push({
      id: rec.rec_id,
      label: rec.rec_id,
      type: "recommendation",
      x: 60,
      y,
      color: "#B91C3C",
      r: 16,
    });
    // Connect to supporting claims
    rec.supporting_claim_ids.forEach((cid, j) => {
      const claim = CLAIMS.find((c) => c.claim_id === cid);
      if (claim) {
        const claimY = y + (j - rec.supporting_claim_ids.length / 2 + 0.5) * 20;
        const claimId = `${rec.rec_id}-${cid}`;
        nodes.push({
          id: claimId,
          label: cid,
          type: "claim",
          x: 280,
          y: Math.max(30, Math.min(h - 30, claimY)),
          color: theme.evidence[claim.evidence_status].dot,
          r: 10,
        });
        edges.push({ source: rec.rec_id, target: claimId, type: "supports" });
        // Connect claim to sources
        claim.source_ids.slice(0, 3).forEach((sid, k) => {
          const sourceId = `${claimId}-${sid}`;
          nodes.push({
            id: sourceId,
            label: sid,
            type: "source",
            x: 500,
            y: Math.max(30, Math.min(h - 30, claimY + (k - 1) * 18)),
            color: "#6B7280",
            r: 7,
          });
          edges.push({ source: claimId, target: sourceId, type: "supports" });
        });
      }
    });
  });

  return { nodes, edges };
}

export function DependencyGraph() {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const { nodes, edges } = React.useMemo(() => buildDependencyGraph(), []);
  const nodeMap = React.useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const connectedIds = React.useMemo(() => {
    if (!hovered) return new Set<string>();
    const connected = new Set<string>([hovered]);
    edges.forEach((e) => {
      if (e.source === hovered) connected.add(e.target);
      if (e.target === hovered) connected.add(e.source);
    });
    return connected;
  }, [hovered, edges]);

  const hoveredNode = hovered ? nodeMap.get(hovered) : null;
  const hoveredRec = hovered ? RECOMMENDATIONS.find((r) => r.rec_id === hovered) : null;
  const hoveredClaim = hovered && !hoveredRec ? CLAIMS.find((c) => hovered.includes(c.claim_id)) : null;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <GitGraph className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Grafo de Dependencias — Recomendación → Claim → Fuente</h3>
            <p className="text-[11px] text-muted-foreground">{RECOMMENDATIONS.length} recomendaciones · cadena de razonamiento trazable</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
        <div className="overflow-x-auto rounded-lg border border-border bg-gradient-to-br from-muted/20 to-background">
          <svg width="100%" viewBox="0 0 640 400" className="min-w-[600px]">
            {/* Column headers */}
            <text x="60" y="18" textAnchor="middle" className="fill-primary text-[10px] font-bold uppercase">Recomendaciones</text>
            <text x="280" y="18" textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold uppercase">Claims</text>
            <text x="500" y="18" textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold uppercase">Fuentes</text>

            {/* Edges */}
            {edges.map((e, i) => {
              const s = nodeMap.get(e.source);
              const t = nodeMap.get(e.target);
              if (!s || !t) return null;
              const isHighlighted = hovered && (e.source === hovered || e.target === hovered);
              return (
                <line
                  key={i}
                  x1={s.x + s.r} y1={s.y} x2={t.x - t.r} y2={t.y}
                  stroke={e.type === "supports" ? "#16A34A" : "#DC2626"}
                  strokeWidth={isHighlighted ? 2 : 0.8}
                  strokeOpacity={isHighlighted ? 0.8 : !hovered ? 0.2 : 0.05}
                  strokeDasharray={e.type === "contradicts" ? "3 3" : undefined}
                  className="transition-all"
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((n) => {
              const isHovered = hovered === n.id;
              const isConnected = connectedIds.has(n.id);
              const dim = hovered && !isConnected;
              return (
                <g
                  key={n.id}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                  opacity={dim ? 0.15 : 1}
                >
                  <circle
                    cx={n.x} cy={n.y} r={isHovered ? n.r + 2 : n.r}
                    fill={n.color} fillOpacity={n.type === "source" ? 0.6 : 0.8}
                    stroke="#fff" strokeWidth={n.type === "recommendation" ? 2.5 : 1.5}
                    className="transition-all"
                  />
                  <text x={n.x} y={n.y + 2} textAnchor="middle" className="fill-white text-[7px] font-bold pointer-events-none">{n.label.slice(0, 6)}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          {!hoveredNode ? (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center text-xs text-muted-foreground">
              <GitGraph className="mb-2 h-8 w-8 opacity-30" />
              <p>Hover sobre un nodo</p>
              <p className="mt-1 text-[10px]">Recomendaciones (izq.) → Claims (centro) → Fuentes (der.)</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold" style={{ color: hoveredNode.color }}>{hoveredNode.id.split("-").pop()}</span>
                <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-white", hoveredNode.type === "recommendation" ? "bg-primary" : hoveredNode.type === "claim" ? "bg-blue-500" : "bg-gray-500")}>
                  {hoveredNode.type}
                </span>
              </div>

              {hoveredRec && (
                <>
                  <p className="mt-2 text-xs font-medium">{hoveredRec.title}</p>
                  <div className="mt-2 text-[10px]">
                    <p><strong>Transferibilidad:</strong> {hoveredRec.transferability.replace(/_/g, " ")}</p>
                    <p><strong>Confianza:</strong> {(hoveredRec.confidence * 100).toFixed(0)}%</p>
                  </div>
                  <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-[10px] dark:border-amber-800 dark:bg-amber-950/30">
                    <p className="font-bold text-amber-700 dark:text-amber-300">¿Qué cambiaría mi conclusión?</p>
                    <p className="text-foreground/80">{hoveredRec.what_would_change_my_mind}</p>
                  </div>
                </>
              )}

              {hoveredClaim && (
                <>
                  <p className="mt-2 text-xs font-medium">{hoveredClaim.claim}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">Status: {hoveredClaim.evidence_status}</p>
                  <p className="text-[10px] text-muted-foreground">Fuentes: {hoveredClaim.source_ids.length}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-[10px]">
        <span className="font-bold uppercase text-muted-foreground">Tipos de nodo:</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#B91C3C" }} /> Recomendación</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#1D4ED8" }} /> Claim</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#6B7280" }} /> Fuente</span>
        <span className="ml-2 flex items-center gap-1"><span className="h-0.5 w-4 bg-emerald-500" /> soporta</span>
        <span className="flex items-center gap-1"><span className="h-0.5 w-4 border-t-2 border-dashed border-red-500" /> contradice</span>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Cadena de razonamiento:</strong> Cada recomendación (REC01-REC05) se conecta a sus claims de soporte (C00x),
          y cada claim se conecta a sus fuentes (Sxx). Esta trazabilidad bidireccional permite a un ejecutivo verificar
          <em> por qué</em> se hace cada recomendación y <em>qué evidencia</em> la respalda. Hover para trazar la cadena completa.
        </div>
      </div>
    </Card>
  );
}
