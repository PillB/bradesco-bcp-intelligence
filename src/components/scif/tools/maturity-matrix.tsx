"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { Grid2x2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MaturityCell {
  dimension: string;
  bradesco: { level: 0 | 1 | 2 | 3 | 4; label: string; evidence: string };
  bcp: { level: 0 | 1 | 2 | 3 | 4; label: string; evidence: string };
  note: string;
}

const MATRIX: MaturityCell[] = [
  {
    dimension: "Plataforma GenAI",
    bradesco: { level: 4, label: "Bridge — 500+ use cases", evidence: "C006 (corroborated)" },
    bcp: { level: 2, label: "GenIA tool + IA dev", evidence: "C021, C023" },
    note: "Bradesco lidera en escala; BCP tiene IA en producción pero menor granularidad pública",
  },
  {
    dimension: "Asistente conversacional",
    bradesco: { level: 4, label: "BIA — 24M users, 90% ret.", evidence: "C005" },
    bcp: { level: 1, label: "Asistente BCP (no métrica pública)", evidence: "OQ01" },
    note: "Métricas de BIA son auto-reportadas; BCP no disclose retención equivalente",
  },
  {
    dimension: "Multicloud",
    bradesco: { level: 3, label: "Azure/AWS/Oracle (35% cloud)", evidence: "C008" },
    bcp: { level: 2, label: "BCP infra (no público)", evidence: "—" },
    note: "Bradesco disclose estrategia multicloud; BCP no publica detalle equivalente",
  },
  {
    dimension: "Open Finance",
    bradesco: { level: 4, label: "MADURO (obligatorio BACEN)", evidence: "C024, S38" },
    bcp: { level: 2, label: "BCP Xplore (en desarrollo)", evidence: "S15" },
    note: "Diferencia regulatoria (H4) — Brasil obligatorio desde 2021",
  },
  {
    dimension: "Instant payments",
    bradesco: { level: 4, label: "Pix (nacional, maduro)", evidence: "—" },
    bcp: { level: 3, label: "Yape (app, escalando)", evidence: "C015" },
    note: "Pix es sistema nacional; Yape es app dentro de BCP — estructuras distintas",
  },
  {
    dimension: "Fraude / AML",
    bradesco: { level: 4, label: "FICO — 1B tx/mes, -25% rechazos", evidence: "C022, S32" },
    bcp: { level: 2, label: "AI-driven risk analytics", evidence: "C023" },
    note: "Bradesco tiene métricas cuantificadas via FICO; BCP menciona AI risk analytics",
  },
  {
    dimension: "Biometría / Identidad",
    bradesco: { level: 4, label: "Facial + voz (VERIFIED)", evidence: "C024, S34" },
    bcp: { level: 3, label: "Estándar banca peruana", evidence: "—" },
    note: "Bradesco confirmado por sitio oficial; BCP inferido de contexto SBS",
  },
  {
    dimension: "Innovación lab",
    bradesco: { level: 4, label: "Inovabra habitat (230 startups)", evidence: "C009, C020" },
    bcp: { level: 3, label: "CIX (+1 década, activo)", evidence: "C025" },
    note: "Modelos distintos: habitat abierto vs laboratorio interno — ambos MATURE",
  },
  {
    dimension: "DLT / Stablecoin",
    bradesco: { level: 3, label: "Parfin pilot + R$10B capital", evidence: "C019" },
    bcp: { level: 1, label: "No evidencia pública", evidence: "—" },
    note: "Bradesco escalando hacia custodia digital; BCP sin evidence pública equivalente",
  },
  {
    dimension: "Quantum-safe",
    bradesco: { level: 2, label: "IBM Research pilot", evidence: "C018" },
    bcp: { level: 0, label: "No evidencia", evidence: "—" },
    note: "Bradesco tiene piloto confirmado; BCP sin evidence pública",
  },
];

const LEVEL_CFG = [
  { color: "#6B7280", label: "N/A", bg: "bg-gray-100 dark:bg-gray-900/40" },
  { color: "#F59E0B", label: "Básico", bg: "bg-amber-50 dark:bg-amber-950/30" },
  { color: "#FB923C", label: "En desarrollo", bg: "bg-orange-50 dark:bg-orange-950/30" },
  { color: "#22C55E", label: "Producción", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  { color: "#16A34A", label: "Maduro/Escala", bg: "bg-green-50 dark:bg-green-950/30" },
];

export function MaturityMatrix() {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Grid2x2 className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Matriz de Madurez Comparativa</h3>
            <p className="text-[11px] text-muted-foreground">{MATRIX.length} dimensiones · Bradesco vs BCP · niveles 0-4</p>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-2 text-left font-semibold text-muted-foreground">Dimensión</th>
              <th className="px-2 py-2 text-center font-semibold text-[#B91C3C]">Bradesco</th>
              <th className="px-2 py-2 text-center font-semibold text-[#0F766E]">BCP</th>
              <th className="px-2 py-2 text-left font-semibold text-muted-foreground">Nota comparativa</th>
            </tr>
          </thead>
          <tbody>
            {MATRIX.map((row) => {
              const diff = row.bradesco.level - row.bcp.level;
              return (
                <tr key={row.dimension} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-2 py-2 font-medium">{row.dimension}</td>
                  <td className="px-2 py-2">
                    <div className={cn("rounded-md border p-1.5", LEVEL_CFG[row.bradesco.level].bg)} style={{ borderColor: `${LEVEL_CFG[row.bradesco.level].color}40` }}>
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {[0, 1, 2, 3].map((i) => (
                            <span key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: i < row.bradesco.level ? LEVEL_CFG[row.bradesco.level].color : "transparent", border: `1px solid ${LEVEL_CFG[row.bradesco.level].color}40` }} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: LEVEL_CFG[row.bradesco.level].color }}>{LEVEL_CFG[row.bradesco.level].label}</span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-foreground/80">{row.bradesco.label}</p>
                      <p className="text-[9px] text-muted-foreground">{row.bradesco.evidence}</p>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className={cn("rounded-md border p-1.5", LEVEL_CFG[row.bcp.level].bg)} style={{ borderColor: `${LEVEL_CFG[row.bcp.level].color}40` }}>
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {[0, 1, 2, 3].map((i) => (
                            <span key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: i < row.bcp.level ? LEVEL_CFG[row.bcp.level].color : "transparent", border: `1px solid ${LEVEL_CFG[row.bcp.level].color}40` }} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: LEVEL_CFG[row.bcp.level].color }}>{LEVEL_CFG[row.bcp.level].label}</span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-foreground/80">{row.bcp.label}</p>
                      <p className="text-[9px] text-muted-foreground">{row.bcp.evidence}</p>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-start gap-1.5">
                      {diff > 0 && <span className="mt-0.5 shrink-0 rounded bg-red-100 px-1 text-[9px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">BRA +{diff}</span>}
                      {diff < 0 && <span className="mt-0.5 shrink-0 rounded bg-emerald-100 px-1 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">BCP +{-diff}</span>}
                      {diff === 0 && <span className="mt-0.5 shrink-0 rounded bg-gray-100 px-1 text-[9px] font-bold text-gray-600 dark:bg-gray-900/40 dark:text-gray-400">=</span>}
                      <span className="text-[10px] text-muted-foreground">{row.note}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3">
        <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-center dark:border-red-800 dark:bg-red-950/30">
          <p className="text-[9px] font-bold uppercase text-red-600">Bradesco lidera</p>
          <p className="text-lg font-black text-red-600">{MATRIX.filter((r) => r.bradesco.level - r.bcp.level > 0).length}</p>
          <p className="text-[9px] text-muted-foreground">dimensiones</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
          <p className="text-[9px] font-bold uppercase text-emerald-600">BCP lidera</p>
          <p className="text-lg font-black text-emerald-600">{MATRIX.filter((r) => r.bradesco.level - r.bcp.level < 0).length}</p>
          <p className="text-[9px] text-muted-foreground">dimensiones</p>
        </div>
        <div className="rounded-lg border border-border p-2 text-center">
          <p className="text-[9px] font-bold uppercase text-muted-foreground">Paridad</p>
          <p className="text-lg font-black text-muted-foreground">{MATRIX.filter((r) => r.bradesco.level - r.bcp.level === 0).length}</p>
          <p className="text-[9px] text-muted-foreground">dimensiones</p>
        </div>
      </div>
    </Card>
  );
}
