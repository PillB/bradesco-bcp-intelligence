"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { Share2 } from "lucide-react";
import { PARTNERSHIPS } from "@/lib/scif/data";

interface Node {
  id: string;
  label: string;
  type: "BANK" | "VENDOR" | "PARTNER";
  color: string;
  r: number;
  x: number;
  y: number;
}

interface Edge {
  source: string;
  target: string;
  status: string;
  color: string;
}

const BANK_NODES = [
  { id: "bradesco", label: "Bradesco", color: "#B91C3C", x: 180, y: 140 },
  { id: "inovabra", label: "Inovabra", color: "#B08D57", x: 180, y: 260 },
  { id: "digio", label: "Digio", color: "#B91C3C", x: 90, y: 80 },
  { id: "bcp", label: "BCP / Credicorp", color: "#0F766E", x: 430, y: 140 },
];

const PARTNER_NODES = [
  { id: "azure", label: "Azure", color: "#0078D4", x: 60, y: 200 },
  { id: "aws", label: "AWS", color: "#FF9900", x: 60, y: 290 },
  { id: "oracle", label: "Oracle", color: "#C74634", x: 130, y: 330 },
  { id: "teradata", label: "Teradata", color: "#F37423", x: 250, y: 360 },
  { id: "wework", label: "WeWork", color: "#000000", x: 250, y: 240 },
  { id: "ibm", label: "IBM", color: "#0F62FE", x: 300, y: 60 },
  { id: "startups", label: "230 startups", color: "#8B5CF6", x: 180, y: 380 },
  { id: "krealo", label: "Krealo", color: "#7C3AED", x: 430, y: 280 },
  { id: "culqi", label: "Culqi", color: "#0EA5E9", x: 510, y: 220 },
  { id: "bb", label: "Bco. Brasil (ex)", color: "#FFD700", x: 60, y: 110 },
];

const NODE_MAP = new Map([...BANK_NODES, ...PARTNER_NODES].map((n) => [n.id, n]));

const EDGES: Edge[] = [
  { source: "bradesco", target: "azure", status: "Next + analytics", color: "#0078D4" },
  { source: "bradesco", target: "aws", status: "vía Digio", color: "#FF9900" },
  { source: "digio", target: "aws", status: "infra propia", color: "#FF9900" },
  { source: "bradesco", target: "oracle", status: "Seguros", color: "#C74634" },
  { source: "bradesco", target: "teradata", status: "QueryGrid", color: "#F37423" },
  { source: "bradesco", target: "ibm", status: "Watson→GenAI", color: "#0F62FE" },
  { source: "digio", target: "bb", status: "ex-JV (divested)", color: "#FFD700" },
  { source: "inovabra", target: "wework", status: "espacio físico", color: "#000000" },
  { source: "inovabra", target: "startups", status: "230 conectadas", color: "#8B5CF6" },
  { source: "bradesco", target: "inovabra", status: "owned", color: "#B91C3C" },
  { source: "bradesco", target: "digio", status: "100% owned", color: "#B91C3C" },
  { source: "bcp", target: "krealo", status: "CVC fund", color: "#7C3AED" },
  { source: "bcp", target: "culqi", status: "acquired", color: "#0EA5E9" },
  { source: "krealo", target: "startups", status: "portfolio", color: "#7C3AED" },
];

export function PartnershipNetwork() {
  const [hoverEdge, setHoverEdge] = React.useState<string | null>(null);
  const width = 580;
  const height = 420;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Grafo de Alianzas y Ecosistema</h3>
            <p className="text-[11px] text-muted-foreground">Red de partnerships Bradesco (izq.) vs BCP/Credicorp (der.)</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#B91C3C" }} /> Bradesco</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#0F766E" }} /> BCP/Credicorp</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#8B5CF6" }} /> Ecosistema</span>
        </div>
      </div>

      <div className="mt-2 overflow-x-auto">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
          {/* Divider */}
          <line x1={305} y1={20} x2={305} y2={height - 20} stroke="currentColor" strokeWidth={1} strokeDasharray="4 4" className="text-border" />
          <text x={150} y={20} textAnchor="middle" className="fill-[#B91C3C] text-[10px] font-bold">ECOSISTEMA BRADESCO</text>
          <text x={460} y={20} textAnchor="middle" className="fill-[#0F766E] text-[10px] font-bold">ECOSISTEMA BCP/CREDICORP</text>

          {/* Edges */}
          {EDGES.map((e, i) => {
            const s = NODE_MAP.get(e.source);
            const t = NODE_MAP.get(e.target);
            if (!s || !t) return null;
            const isHover = hoverEdge === `${e.source}-${e.target}`;
            return (
              <g key={i} onMouseEnter={() => setHoverEdge(`${e.source}-${e.target}`)} onMouseLeave={() => setHoverEdge(null)} className="cursor-pointer">
                <line
                  x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                  stroke={e.color} strokeWidth={isHover ? 3 : 1.5} strokeOpacity={isHover ? 1 : 0.5}
                  strokeDasharray={e.status.includes("ex-") ? "3 3" : undefined}
                />
                {isHover && (
                  <g>
                    <rect x={(s.x + t.x) / 2 - 40} y={(s.y + t.y) / 2 - 9} width={80} height={18} rx={4} fill="hsl(var(--popover))" stroke="hsl(var(--border))" />
                    <text x={(s.x + t.x) / 2} y={(s.y + t.y) / 2 + 3} textAnchor="middle" className="fill-foreground text-[8px] font-semibold">{e.status}</text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {[...BANK_NODES, ...PARTNER_NODES].map((n) => {
            const isBank = n.id === "bradesco" || n.id === "bcp";
            const isOwned = n.id === "inovabra" || n.id === "digio";
            const r = isBank ? 26 : isOwned ? 22 : 16;
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={r} fill={n.color} fillOpacity={0.85} stroke="#fff" strokeWidth={2} className="drop-shadow" />
                <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle" className="fill-white text-[9px] font-bold pointer-events-none">{n.label}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3 text-[10px] sm:grid-cols-4">
        <div className="rounded-md border border-border p-2"><p className="font-bold text-[#B91C3C]">Bradesco</p><p className="text-muted-foreground">3 cloud providers + 1 data vendor + 1 legacy AI + 1 innovation space</p></div>
        <div className="rounded-md border border-border p-2"><p className="font-bold text-[#0F766E]">BCP/Credicorp</p><p className="text-muted-foreground">Krealo (CVC) + Culqi (acquired) + Open Banking ecosystem</p></div>
        <div className="rounded-md border border-border p-2"><p className="font-bold">Modelo Bradesco</p><p className="text-muted-foreground">Habitat abierto — co-innovación con 230 startups externas</p></div>
        <div className="rounded-md border border-border p-2"><p className="font-bold">Modelo Credicorp</p><p className="text-muted-foreground">Cartera de venture — equity en startups vía Krealo</p></div>
      </div>
    </Card>
  );
}
