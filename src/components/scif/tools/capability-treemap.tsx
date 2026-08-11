"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { LayoutGrid, Info } from "lucide-react";
import { TECH_CAPABILITIES } from "@/lib/scif/data";
import { theme } from "@/lib/scif/theme";
import type { TechMaturity } from "@/lib/scif/types";

interface TreemapNode {
  id: string;
  name: string;
  category: string;
  maturity: TechMaturity;
  confidence: number;
  area: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

// Simplified squarified treemap algorithm
function squarify(items: { id: string; value: number }[], x: number, y: number, w: number, h: number): TreemapNode[] {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  const result: TreemapNode[] = [];
  let cx = x, cy = y, cw = w, ch = h;
  const remaining = [...items];

  while (remaining.length > 0) {
    const row = [remaining.shift()!];
    let rowValue = row[0].value;
    const isWide = cw >= ch;

    // Try to add more items to improve aspect ratio
    while (remaining.length > 0) {
      const next = remaining[0];
      const newRatio = Math.max(
        (cw * (rowValue + next.value) / (ch * ch * total / (ch * cw))),
        (ch * (rowValue + next.value) / (cw * cw * total / (cw * ch)))
      );
      if (newRatio < 2.5) {
        row.push(remaining.shift()!);
        rowValue += row[row.length - 1].value;
      } else break;
    }

    const rowH = (rowValue / total) * (isWide ? ch : cw);
    let pos = isWide ? cy : cx;
    row.forEach((item) => {
      const itemW = isWide ? (item.value / rowValue) * cw : rowH;
      const itemH = isWide ? rowH : (item.value / rowValue) * ch;
      result.push({
        id: item.id, name: item.id, category: "", maturity: "UNKNOWN" as TechMaturity,
        confidence: 0, area: item.value,
        x: isWide ? cx : pos, y: isWide ? pos : cy,
        w: isWide ? itemW : rowH, h: isWide ? rowH : itemH,
      } as TreemapNode);
      pos += isWide ? itemH : itemW;
    });

    if (isWide) { cy += rowH; ch -= rowH; }
    else { cx += rowH; cw -= rowH; }
  }
  return result;
}

export function CapabilityTreemap() {
  const [hovered, setHovered] = React.useState<string | null>(null);

  // Group by category
  const byCategory = React.useMemo(() => {
    const groups: Record<string, typeof TECH_CAPABILITIES> = {};
    TECH_CAPABILITIES.forEach((t) => {
      const cat = t.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(t);
    });
    return groups;
  }, []);

  // Build treemap data: each capability gets area = confidence * 100 + 10 (min size)
  const treemapItems = TECH_CAPABILITIES.map((t) => ({
    id: t.tech_id,
    value: Math.round(t.confidence * 100) + 10,
    tech: t,
  }));

  const W = 600, H = 360, pad = 4;
  const layout = React.useMemo(() => {
    const nodes = squarify(treemapItems, pad, pad, W - 2 * pad, H - 2 * pad);
    // Merge back tech data
    return nodes.map((n) => {
      const item = treemapItems.find((t) => t.id === n.id);
      const tech = item?.tech;
      return { ...n, name: tech?.name ?? n.id, category: tech?.category ?? "", maturity: tech?.maturity ?? "UNKNOWN", confidence: tech?.confidence ?? 0, notes: tech?.notes, evidence: tech?.evidence_status };
    });
  }, [treemapItems]);

  const hoveredNode = hovered ? layout.find((n) => n.id === hovered) : null;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Treemap de Capacidades Tecnológicas</h3>
            <p className="text-[11px] text-muted-foreground">{TECH_CAPABILITIES.length} capacidades · área ∝ confianza · color = madurez</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px]">
        <div className="overflow-x-auto">
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="min-w-[550px]">
            {layout.map((n) => {
              const cfg = theme.lifecycle[n.maturity as keyof typeof theme.lifecycle] ?? theme.lifecycle.UNKNOWN;
              const isHovered = hovered === n.id;
              return (
                <g
                  key={n.id}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                  opacity={hovered && !isHovered ? 0.3 : 1}
                >
                  <rect
                    x={n.x + 1} y={n.y + 1} width={Math.max(n.w - 2, 1)} height={Math.max(n.h - 2, 1)}
                    fill={cfg.color} fillOpacity={isHovered ? 0.95 : 0.7}
                    stroke="#fff" strokeWidth={1.5} rx={3}
                    className="transition-all"
                  />
                  {n.w > 50 && n.h > 30 && (
                    <>
                      <text x={n.x + n.w / 2} y={n.y + n.h / 2 - 4} textAnchor="middle" className="fill-white text-[9px] font-bold pointer-events-none">{n.name.slice(0, 16)}</text>
                      <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 8} textAnchor="middle" className="fill-white/80 text-[8px] pointer-events-none">{cfg.label}</text>
                    </>
                  )}
                  {n.w > 30 && n.h > 18 && n.w <= 50 && (
                    <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 3} textAnchor="middle" className="fill-white text-[7px] font-bold pointer-events-none">{n.name.slice(0, 8)}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div className="space-y-2">
          {hoveredNode ? (
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <p className="font-mono text-[10px] font-bold text-primary">{hoveredNode.id}</p>
              <p className="mt-1 text-xs font-medium">{hoveredNode.name}</p>
              <div className="mt-2 space-y-1 text-[10px]">
                <p><span className="text-muted-foreground">Categoría:</span> {hoveredNode.category}</p>
                <p><span className="text-muted-foreground">Madurez:</span> <span className="font-bold" style={{ color: theme.lifecycle[hoveredNode.maturity as keyof typeof theme.lifecycle]?.color }}>{theme.lifecycle[hoveredNode.maturity as keyof typeof theme.lifecycle]?.label}</span></p>
                <p><span className="text-muted-foreground">Confianza:</span> {Math.round(hoveredNode.confidence * 100)}%</p>
                <p><span className="text-muted-foreground">Evidencia:</span> {hoveredNode.evidence}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-3 text-center text-[10px] text-muted-foreground">
              <LayoutGrid className="mx-auto mb-1 h-6 w-6 opacity-30" />
              Hover sobre un rectángulo
            </div>
          )}

          {/* Category summary */}
          <div className="rounded-lg border border-border p-2">
            <p className="mb-1 text-[9px] font-bold uppercase text-muted-foreground">Por categoría:</p>
            <div className="space-y-0.5 text-[9px]">
              {Object.entries(byCategory).map(([cat, caps]) => (
                <div key={cat} className="flex justify-between">
                  <span className="truncate">{cat}</span>
                  <span className="font-bold">{caps.length}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-[10px]">
        <span className="font-bold uppercase text-muted-foreground">Madurez:</span>
        {["UNKNOWN", "EXPERIMENT_PILOT", "PILOT", "PRODUCTION", "PRODUCTION_SCALING", "MATURE", "MATURE_PRODUCTION"].map((m) => {
          const cfg = theme.lifecycle[m as keyof typeof theme.lifecycle];
          const count = TECH_CAPABILITIES.filter((t) => t.maturity === m).length;
          if (count === 0) return null;
          return (
            <span key={m} className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded" style={{ backgroundColor: cfg.color }} />
              {cfg.label} ({count})
            </span>
          );
        })}
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Lectura:</strong> El área de cada rectángulo es proporcional a la confianza de la evidencia — las capacidades
          más grandes (BIA, Open Finance, Pix, Biometrics) tienen la evidencia más robusta. Las capacidades UNKNOWN (GNN, synthetic data)
          aparecen pequeñas, reflejando la falta de evidencia pública. El color indica madurez: verde = producción/maduro, amber = experimento, gray = desconocido.
        </div>
      </div>
    </Card>
  );
}
