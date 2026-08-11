"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { BarChart3, TrendingUp, Info } from "lucide-react";

interface WaterfallStep {
  label: string;
  value: number; // BRL billions
  type: "start" | "positive" | "negative" | "end";
  color: string;
  note?: string;
}

// Bradesco FY2025 waterfall (approximate, BRL billions)
const STEPS: WaterfallStep[] = [
  { label: "Resultado\nrecurrente\n2024", value: 19.6, type: "start", color: "#6B7280", note: "Base año anterior" },
  { label: "Crecimiento\ningresos", value: 8.2, type: "positive", color: "#16A34A", note: "+26.1% YoY" },
  { label: "Reducción\ncosto riesgo", value: 2.1, type: "positive", color: "#16A34A", note: "Mejora calidad cartera" },
  { label: "Inversión\ntecnología", value: -3.5, type: "negative", color: "#DC2626", note: "+22% tech investment" },
  { label: "Eficiencia\noperacional", value: -1.7, type: "negative", color: "#DC2626", note: "Índice 50%" },
  { label: "Resultado\nrecurrente\n2025", value: 24.7, type: "end", color: "#B91C3C", note: "+26.1% YoY final" },
];

export function FinancialWaterfall() {
  const [hovered, setHovered] = React.useState<number | null>(null);

  const W = 620, H = 340, padX = 50, padY = 40, barW = 70, gap = 20;

  // Compute running total and bar positions (pure function, no mutation)
  const data = React.useMemo(() => {
    let running = 0;
    const result: (WaterfallStep & { idx: number; startY: number; endY: number; absVal: number })[] = [];
    STEPS.forEach((step, i) => {
      let startY: number, endY: number, absVal: number;
      if (step.type === "start" || step.type === "end") {
        startY = 0;
        endY = step.value;
        running = step.value;
        absVal = step.value;
      } else {
        startY = running;
        endY = running + step.value;
        running = endY;
        absVal = Math.abs(step.value);
      }
      result.push({ ...step, idx: i, startY: Math.min(startY, endY), endY: Math.max(startY, endY), absVal });
    });
    return result;
  }, []);

  const maxVal = Math.max(...data.map((d) => d.endY)) * 1.15;
  const toY = (v: number) => H - padY - (v / maxVal) * (H - 2 * padY);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Waterfall Financiero — Bradesco FY2025</h3>
            <p className="text-[11px] text-muted-foreground">Resultado recurrente 2024 → 2025 · descomposición drivers (BRL bn)</p>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="min-w-[580px]">
          {/* Y axis */}
          <line x1={padX} y1={padY} x2={padX} y2={H - padY} stroke="currentColor" strokeWidth={1} className="text-border" />
          <line x1={padX} y1={H - padY} x2={W - 10} y2={H - padY} stroke="currentColor" strokeWidth={1} className="text-border" />

          {/* Y axis labels */}
          {[0, 10, 20, 30].map((v) => (
            <g key={v}>
              <line x1={padX - 4} y1={toY(v)} x2={W - 10} y2={toY(v)} stroke="currentColor" strokeWidth={0.5} strokeDasharray="2 4" className="text-border" />
              <text x={padX - 8} y={toY(v) + 3} textAnchor="end" className="fill-muted-foreground text-[9px]">{v}</text>
            </g>
          ))}
          <text x={15} y={H / 2} textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold" transform={`rotate(-90, 15, ${H / 2})`}>BRL bn →</text>

          {/* Connecting lines between bars */}
          {data.slice(0, -1).map((d, i) => {
            const next = data[i + 1];
            const x1 = padX + (i + 1) * (barW + gap) - gap / 2;
            const x2 = padX + (i + 1) * (barW + gap) + gap / 2;
            const y = toY(d.type === "start" || d.type === "end" ? d.endY : d.endY);
            return <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" className="text-muted-foreground/50" />;
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const x = padX + i * (barW + gap) + gap / 2;
            const y = toY(d.endY);
            const h = toY(d.startY) - y;
            const isHovered = hovered === i;
            return (
              <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
                <rect
                  x={x} y={y} width={barW} height={Math.max(h, 1)}
                  fill={d.color} fillOpacity={isHovered ? 0.95 : 0.75} rx={3}
                  stroke={d.color} strokeWidth={isHovered ? 2 : 1}
                  className="transition-all"
                />
                {/* Value label */}
                <text x={x + barW / 2} y={y - 6} textAnchor="middle" className="fill-foreground text-[11px] font-bold">
                  {d.type === "positive" ? "+" : d.type === "negative" ? "" : ""}{d.type === "start" || d.type === "end" ? d.value.toFixed(1) : d.value > 0 ? `+${d.value.toFixed(1)}` : d.value.toFixed(1)}
                </text>
                {/* X axis label */}
                <text x={x + barW / 2} y={H - padY + 14} textAnchor="middle" className="fill-muted-foreground text-[8px] font-medium whitespace-pre-line">
                  {d.label}
                </text>
                {isHovered && d.note && (
                  <g>
                    <rect x={x + barW / 2 - 45} y={y + h + 18} width={90} height={16} rx={3} fill="hsl(var(--popover))" stroke="hsl(var(--border))" />
                    <text x={x + barW / 2} y={y + h + 29} textAnchor="middle" className="fill-foreground text-[8px] font-semibold">{d.note}</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Summary stats */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-border pt-3">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-center dark:border-gray-800 dark:bg-gray-950/30">
          <p className="text-[9px] font-bold uppercase text-muted-foreground">Base 2024</p>
          <p className="text-lg font-black text-gray-600">R$ 19,6B</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
          <p className="text-[9px] font-bold uppercase text-emerald-600">Drivers positivos</p>
          <p className="text-lg font-black text-emerald-600">+R$ 10,3B</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-center dark:border-red-800 dark:bg-red-950/30">
          <p className="text-[9px] font-bold uppercase text-red-600">Inversiones/costos</p>
          <p className="text-lg font-black text-red-600">-R$ 5,2B</p>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Lectura:</strong> El waterfall descompone el crecimiento de R$19,6B (2024) a R$24,7B (2025) en drivers.
          Los positivos (+R$10,3B: crecimiento ingresos + reducción costo de riesgo) superan las inversiones (-R$5,2B: tecnología + eficiencia operacional).
          <span className="mt-1 block text-[10px] italic">Cifras aproximadas — descomposición inferida de disclosures 6-K/4T25. No auditable como estados financieros.</span>
        </div>
      </div>
    </Card>
  );
}
