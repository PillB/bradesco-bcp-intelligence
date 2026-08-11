"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { Calculator, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricRow {
  id: string;
  label: string;
  bradesco: number;
  bradescoUnit: string;
  bradescoDisplay: string;
  bcp: number;
  bcpUnit: string;
  bcpDisplay: string;
  source: string;
}

const METRICS: MetricRow[] = [
  { id: "assets", label: "Activos totales", bradesco: 2.33e12, bradescoUnit: "BRL", bradescoDisplay: "R$ 2,33T", bcp: 204.9e9, bcpUnit: "PEN", bcpDisplay: "S/ 204,9B", source: "S01/S13" },
  { id: "recurrent_income", label: "Resultado recurrente", bradesco: 24.7e9, bradescoUnit: "BRL", bradescoDisplay: "R$ 24,7B", bcp: 0, bcpUnit: "PEN", bcpDisplay: "n/d", source: "S02" },
  { id: "loan_book", label: "Cartera de crédito", bradesco: 1.089e12, bradescoUnit: "BRL", bradescoDisplay: "R$ 1,089T", bcp: 0, bcpUnit: "PEN", bcpDisplay: "n/d", source: "S02" },
  { id: "deposits", label: "Depósitos", bradesco: 727.9e9, bradescoUnit: "BRL", bradescoDisplay: "R$ 727,9B", bcp: 0, bcpUnit: "PEN", bcpDisplay: "n/d", source: "S01" },
];

const FX_RATES: Record<string, number> = {
  BRL_USD: 0.18,
  PEN_USD: 0.27,
};

const POPULATION: Record<string, number> = { Brazil: 216, Peru: 34 };
const GDP: Record<string, number> = { Brazil: 2170, Peru: 282 };

export function MetricNormalizer() {
  const [fxBrl, setFxBrl] = React.useState(FX_RATES.BRL_USD);
  const [fxPen, setFxPen] = React.useState(FX_RATES.PEN_USD);

  const convert = (val: number, unit: string) => {
    if (unit === "BRL") return val * fxBrl;
    if (unit === "PEN") return val * fxPen;
    return val;
  };

  const fmt = (v: number) => {
    if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
    if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
    if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`;
    return `$${v.toFixed(0)}`;
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Normalizador de Métricas Interactivo</h3>
            <p className="text-[11px] text-muted-foreground">Ajusta el FX para comparar Bradesco vs BCP en USD · per cápita · % del PIB</p>
          </div>
        </div>
      </div>

      {/* FX controls */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-border p-2.5">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">FX BRL → USD</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="range" min="0.10" max="0.25" step="0.01"
              value={fxBrl}
              onChange={(e) => setFxBrl(Number(e.target.value))}
              className="flex-1 accent-[#B91C3C]"
            />
            <span className="font-mono text-sm font-bold tabular-nums">{fxBrl.toFixed(2)}</span>
          </div>
          <p className="mt-0.5 text-[9px] text-muted-foreground">1 BRL = ${fxBrl.toFixed(2)} USD</p>
        </div>
        <div className="rounded-lg border border-border p-2.5">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">FX PEN → USD</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="range" min="0.20" max="0.35" step="0.01"
              value={fxPen}
              onChange={(e) => setFxPen(Number(e.target.value))}
              className="flex-1 accent-[#0F766E]"
            />
            <span className="font-mono text-sm font-bold tabular-nums">{fxPen.toFixed(2)}</span>
          </div>
          <p className="mt-0.5 text-[9px] text-muted-foreground">1 PEN = ${fxPen.toFixed(2)} USD</p>
        </div>
      </div>

      {/* Metrics table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              <th className="px-2 py-1.5 font-semibold">Métrica</th>
              <th className="px-2 py-1.5 text-right font-semibold text-[#B91C3C]">Bradesco (orig.)</th>
              <th className="px-2 py-1.5 text-right font-semibold">Bradesco USD</th>
              <th className="px-2 py-1.5 text-right font-semibold">Bradesco per cápita</th>
              <th className="px-2 py-1.5 text-right font-semibold">Bradesco % PIB</th>
              <th className="px-2 py-1.5 text-right font-semibold text-[#0F766E]">BCP (orig.)</th>
              <th className="px-2 py-1.5 text-right font-semibold">BCP USD</th>
              <th className="px-2 py-1.5 text-right font-semibold">BCP per cápita</th>
              <th className="px-2 py-1.5 text-right font-semibold">BCP % PIB</th>
              <th className="px-2 py-1.5 text-center font-semibold">Ratio BCP/BRA</th>
            </tr>
          </thead>
          <tbody>
            {METRICS.filter((m) => m.bcp > 0).map((m) => {
              const braUsd = convert(m.bradesco, m.bradescoUnit);
              const bcpUsd = convert(m.bcp, m.bcpUnit);
              const braPerCap = braUsd / (POPULATION.Brazil * 1e6);
              const bcpPerCap = bcpUsd / (POPULATION.Peru * 1e6);
              const braGdpPct = (braUsd / (GDP.Brazil * 1e9)) * 100;
              const bcpGdpPct = (bcpUsd / (GDP.Peru * 1e9)) * 100;
              const ratio = braUsd > 0 ? bcpUsd / braUsd : 0;
              return (
                <tr key={m.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-2 py-2 font-medium">{m.label}</td>
                  <td className="px-2 py-2 text-right font-mono text-[#B91C3C]">{m.bradescoDisplay}</td>
                  <td className="px-2 py-2 text-right font-mono font-bold tabular-nums">{fmt(braUsd)}</td>
                  <td className="px-2 py-2 text-right font-mono tabular-nums text-muted-foreground">${braPerCap.toFixed(0)}</td>
                  <td className="px-2 py-2 text-right font-mono tabular-nums text-muted-foreground">{braGdpPct.toFixed(1)}%</td>
                  <td className="px-2 py-2 text-right font-mono text-[#0F766E]">{m.bcpDisplay}</td>
                  <td className="px-2 py-2 text-right font-mono font-bold tabular-nums">{fmt(bcpUsd)}</td>
                  <td className="px-2 py-2 text-right font-mono tabular-nums text-muted-foreground">${bcpPerCap.toFixed(0)}</td>
                  <td className="px-2 py-2 text-right font-mono tabular-nums text-muted-foreground">{bcpGdpPct.toFixed(1)}%</td>
                  <td className="px-2 py-2 text-center">
                    <span className={cn("rounded px-1.5 py-0.5 font-mono text-[10px] font-bold", ratio < 0.15 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : ratio < 0.5 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300")}>
                      1:{(1 / ratio).toFixed(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Insight:</strong> Ajusta los sliders de FX para ver cómo cambia la comparación. A tipo de cambio actual,
          Bradesco es ~8-9× mayor que BCP en USD absoluto, pero en % del PIB ambos rondan el 19-21% — dominancia doméstica comparable.
          <span className="mt-1 block text-[10px] italic">FX y PIB son aproximados (ago-2025). Clasificación PARTIAL.</span>
        </div>
      </div>
    </Card>
  );
}
