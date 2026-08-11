"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { EvidenceTag } from "@/components/scif/evidence";
import { CLAIMS, SOURCES } from "@/lib/scif/data";
import { theme } from "@/lib/scif/theme";
import { Share2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface GraphNode {
  id: string;
  label: string;
  type: "claim" | "source";
  x: number;
  y: number;
  color: string;
  r: number;
}

interface GraphEdge {
  source: string;
  target: string;
}

// Pre-computed node positions (force-directed layout approximation)
function buildGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const cx = 350, cy = 280;

  // Place claims in a circle
  const claimRadius = 140;
  CLAIMS.forEach((c, i) => {
    const angle = (i / CLAIMS.length) * Math.PI * 2 - Math.PI / 2;
    const cfg = theme.evidence[c.evidence_status] ?? theme.evidence.UNRESOLVED;
    nodes.push({
      id: c.claim_id,
      label: c.claim_id,
      type: "claim",
      x: cx + Math.cos(angle) * claimRadius,
      y: cy + Math.sin(angle) * claimRadius,
      color: cfg.dot,
      r: 14,
    });
  });

  // Place sources in outer ring, connected to their claims
  const sourceMap = new Map<string, { angle: number; count: number }>();
  CLAIMS.forEach((c, i) => {
    const claimAngle = (i / CLAIMS.length) * Math.PI * 2 - Math.PI / 2;
    c.source_ids.forEach((sid, j) => {
      if (!sourceMap.has(sid)) {
        const offsetAngle = claimAngle + (j - c.source_ids.length / 2) * 0.15;
        const sourceRadius = 230;
        const s = SOURCES.find((x) => x.source_id === sid);
        const tierColors: Record<string, string> = { A: "#166534", B: "#1D4ED8", C: "#6D28D9", D: "#B45309", E: "#9CA3AF" };
        nodes.push({
          id: sid,
          label: sid,
          type: "source",
          x: cx + Math.cos(offsetAngle) * sourceRadius,
          y: cy + Math.sin(offsetAngle) * sourceRadius,
          color: s ? tierColors[s.source_tier] : "#6B7280",
          r: 8,
        });
        sourceMap.set(sid, { angle: offsetAngle, count: 1 });
      }
      edges.push({ source: c.claim_id, target: sid });
    });
  });

  return { nodes, edges };
}

export function KnowledgeGraph() {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [zoom, setZoom] = React.useState(1);
  const { nodes, edges } = React.useMemo(() => buildGraph(), []);
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
  const hoveredClaim = hovered ? CLAIMS.find((c) => c.claim_id === hovered) : null;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Grafo de Conocimiento — Claims ↔ Fuentes</h3>
            <p className="text-[11px] text-muted-foreground">{nodes.length} nodos · {edges.length} conexiones · hover para explorar</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((z) => Math.min(z + 0.2, 1.8))} className="rounded-md border border-border p-1 text-muted-foreground hover:bg-muted" aria-label="Zoom in">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))} className="rounded-md border border-border p-1 text-muted-foreground hover:bg-muted" aria-label="Zoom out">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setZoom(1)} className="rounded-md border border-border p-1 text-muted-foreground hover:bg-muted" aria-label="Reset zoom">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
        {/* Graph SVG */}
        <div className="overflow-x-auto rounded-lg border border-border bg-gradient-to-br from-muted/20 to-background">
          <svg width="100%" height="520" viewBox="0 0 700 560" style={{ transform: `scale(${zoom})`, transformOrigin: "center", transition: "transform 0.3s" }}>
            {/* Edges */}
            {edges.map((e, i) => {
              const s = nodeMap.get(e.source);
              const t = nodeMap.get(e.target);
              if (!s || !t) return null;
              const isHighlighted = hovered && (e.source === hovered || e.target === hovered);
              return (
                <line
                  key={i}
                  x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                  stroke={isHighlighted ? s.color : "currentColor"}
                  strokeWidth={isHighlighted ? 2 : 0.6}
                  strokeOpacity={isHighlighted ? 0.8 : !hovered ? 0.2 : 0.05}
                  className="text-border transition-all"
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
                    cx={n.x} cy={n.y} r={isHovered ? n.r + 3 : n.r}
                    fill={n.color}
                    fillOpacity={n.type === "source" ? 0.7 : 0.9}
                    stroke="#fff"
                    strokeWidth={n.type === "claim" ? 2 : 1}
                    className="transition-all"
                  />
                  {(isHovered || n.type === "claim") && (
                    <text
                      x={n.x} y={n.y + n.r + 12}
                      textAnchor="middle"
                      className="fill-foreground text-[8px] font-bold pointer-events-none"
                    >
                      {n.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          {!hoveredNode ? (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center text-xs text-muted-foreground">
              <Share2 className="mb-2 h-8 w-8 opacity-30" />
              <p>Pasa el cursor sobre un nodo para ver detalles</p>
              <p className="mt-1 text-[10px]">Claims en círculo interior · Fuentes en anillo exterior</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold" style={{ color: hoveredNode.color }}>{hoveredNode.id}</span>
                <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-white", hoveredNode.type === "claim" ? "bg-primary" : "bg-muted-foreground")}>
                  {hoveredNode.type}
                </span>
              </div>

              {hoveredClaim && (
                <>
                  <p className="mt-2 text-xs font-medium leading-snug">{hoveredClaim.claim}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <EvidenceTag status={hoveredClaim.evidence_status} />
                    <span className="text-[10px] text-muted-foreground">{hoveredClaim.topic}</span>
                  </div>
                  <div className="mt-2 text-[10px] text-muted-foreground">
                    <p><strong>Fuentes:</strong> {hoveredClaim.source_ids.join(", ")}</p>
                    <p><strong>Clusters:</strong> {hoveredClaim.independence_clusters.length}</p>
                    <p><strong>As-of:</strong> {hoveredClaim.as_of_date}</p>
                  </div>
                </>
              )}

              {hoveredNode.type === "source" && (() => {
                const s = SOURCES.find((x) => x.source_id === hoveredNode.id);
                if (!s) return null;
                return (
                  <>
                    <p className="mt-2 text-xs font-medium">{s.publisher}</p>
                    <div className="mt-2 text-[10px] text-muted-foreground">
                      <p><strong>Tier:</strong> {s.source_tier}</p>
                      <p><strong>Cluster:</strong> {s.independence_cluster}</p>
                      <p><strong>Publicado:</strong> {s.publication_date}</p>
                    </div>
                    {s.notes && <p className="mt-1 text-[10px] italic text-foreground/70">{s.notes}</p>}
                    <div className="mt-2">
                      <p className="text-[9px] font-bold uppercase text-muted-foreground">Claims conectados:</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {CLAIMS.filter((c) => c.source_ids.includes(s.source_id)).map((c) => (
                          <span key={c.claim_id} className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary">{c.claim_id}</span>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-[10px]">
        <span className="font-bold uppercase text-muted-foreground">Leyenda:</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full border-2 border-white" style={{ backgroundColor: "#16A34A" }} /> VERIFIED</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full border-2 border-white" style={{ backgroundColor: "#22C55E" }} /> CORROBORATED</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full border-2 border-white" style={{ backgroundColor: "#F59E0B" }} /> STRONGLY_SUPPORTED</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full border-2 border-white" style={{ backgroundColor: "#94A3B8" }} /> UNRESOLVED</span>
        <span className="ml-auto text-muted-foreground">Tamaño: claims (14px) · fuentes (8px coloreado por tier)</span>
      </div>
    </Card>
  );
}
