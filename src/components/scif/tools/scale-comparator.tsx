"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { SourcePill } from "@/components/scif/evidence";
import { Scale, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Bank Scale Comparator with normalization
// Addresses OPEN_QUESTION OQ04 — normalization of absolute size by GDP / market

interface BankData {
  id: string;
  name: string;
  color: string;
  totalAssets: number; // in native currency billions
  currency: string;
  gdpCountry: number; // nominal GDP in USD billions (2025 approx)
  gdpNote: string;
  population: number; // millions
  fxFallback: number; // approx USD per native unit
  source: string;
}

const BANKS: BankData[] = [
  { id: "bradesco", name: "Banco Bradesco", color: "#B91C3C", totalAssets: 463, currency: "BRL bn", gdpCountry: 2170, gdpNote: "Brazil GDP 2025 (~US$2.17T)", population: 216, fxFallback: 0.18, source: "S01 · R$2.33T @ ~5.03 BRL/USD" },
  { id: "bcp", name: "BCP Perú", color: "#0F766E", totalAssets: 54, currency: "PEN bn", gdpCountry: 282, gdpNote: "Peru GDP 2025 (~US$282B)", population: 34, fxFallback: 0.27, source: "S13 · S/204.9B @ ~3.78 PEN/USD" },
  { id: "credicorp", name: "Credicorp (grupo)", color: "#7C3AED", totalAssets: 71, currency: "PEN bn", gdpCountry: 282, gdpNote: "Peru GDP 2025 (~US$282B)", population: 34, fxFallback: 0.27, source: "S11 · S/267.4B @ ~3.78 PEN/USD" },
];

export function ScaleComparator() {
  const [showNormalized, setShowNormalized] = React.useState(true);

  const usdAssets = (b: BankData) => b.totalAssets * b.fxFallback; // approx USD bn
  const assetsToGdp = (b: BankData) => (usdAssets(b) / b.gdpCountry) * 100;
  const assetsPerCapita = (b: BankData) => (usdAssets(b) * 1e9) / (b.population * 1e6); // USD per person

  const sorted = [...BANKS].sort((a, b) => (showNormalized ? assetsToGdp(b) - assetsToGdp(a) : usdAssets(b) - usdAssets(a)));
  const maxVal = showNormalized ? Math.max(...BANKS.map(assetsToGdp)) : Math.max(...BANKS.map(usdAssets));

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Comparador de Escala con Normalización</h3>
            <p className="text-[11px] text-muted-foreground">Resuelve OQ04 — comparación absoluta vs ajustada por PIB/población</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
          <button
            onClick={() => setShowNormalized(true)}
            className={cn("rounded-md px-3 py-1 text-xs font-semibold transition-colors", showNormalized ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            % del PIB
          </button>
          <button
            onClick={() => setShowNormalized(false)}
            className={cn("rounded-md px-3 py-1 text-xs font-semibold transition-colors", !showNormalized ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            USD absoluto
          </button>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        {sorted.map((b, idx) => {
          const val = showNormalized ? assetsToGdp(b) : usdAssets(b);
          const pct = (val / maxVal) * 100;
          const usd = usdAssets(b);
          const perCap = assetsPerCapita(b);
          return (
            <div key={b.id} className="group">
              <div className="mb-1 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white" style={{ backgroundColor: b.color }}>{idx + 1}</span>
                  <span className="font-semibold">{b.name}</span>
                  {showNormalized && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">NORMALIZADO</span>}
                </div>
                <span className="font-mono font-bold tabular-nums">
                  {showNormalized ? `${val.toFixed(2)}% del PIB` : `US$ ${val.toFixed(0)} bn`}
                </span>
              </div>
              <div className="relative h-8 overflow-hidden rounded-lg bg-muted/50">
                <div
                  className="h-full rounded-lg transition-all duration-700 ease-out group-hover:brightness-110"
                  style={{
                    width: `${Math.max(pct, 2)}%`,
                    background: `linear-gradient(90deg, ${b.color}cc, ${b.color})`,
                    boxShadow: `0 0 12px ${b.color}40`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-end px-3">
                  <span className="text-[10px] font-medium text-foreground/70">
                    {showNormalized ? `${usd.toFixed(0)} bn USD` : `${assetsToGdp(b).toFixed(1)}% PIB`}
                  </span>
                </div>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-muted-foreground">
                <span>Activos: {b.totalAssets} {b.currency}</span>
                <span>≈ US$ {usd.toFixed(0)} bn</span>
                <span>Per cápita: US$ {perCap.toFixed(0)}</span>
                <span className="italic">{b.gdpNote}</span>
                <SourcePill sourceId={b.source.split(" · ")[0]} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <ArrowLeftRight className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Insight de normalización:</strong> Bajo % del PIB, BCP (~19%) y Bradesco (~21%) están en rangos comparables
          de dominancia doméstica, a pesar de que Bradesco es ~8.5× mayor en USD absoluto. Credicorp grupo (~25%) tiene la mayor
          penetración relativa al PIB de su país. <strong>Esto cambia la lectura de "quién es más grande"</strong>: en términos
          absolutos Bradesco domina; en términos de peso en su economía doméstica, los tres son estructuralmente comparables.
          <div className="mt-1 text-[10px] italic">FX aproximado a ago-2025; GDP nominal 2025 (estimado). Clasificación PARTIAL — cifras de FX y GDP son aproximadas.</div>
        </div>
      </div>
    </Card>
  );
}
