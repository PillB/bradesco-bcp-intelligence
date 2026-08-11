"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { Grid2x2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwotItem {
  text: string;
  evidence?: string;
  priority?: "high" | "med" | "low";
}

const SWOT: {
  bradesco: { strengths: SwotItem[]; weaknesses: SwotItem[]; opportunities: SwotItem[]; threats: SwotItem[] };
  bcp: { strengths: SwotItem[]; weaknesses: SwotItem[]; opportunities: SwotItem[]; threats: SwotItem[] };
} = {
  bradesco: {
    strengths: [
      { text: "Escala absoluta — R$2,33T activos, ~8.5× mayor que BCP en USD", evidence: "C001", priority: "high" },
      { text: "Plataforma GenAI centralizada (Bridge) con 500+ casos de uso declarados", evidence: "C006", priority: "high" },
      { text: "BIA consolidado — 24M usuarios, 90% retención, evolución Watson→GenAI en 10 años", evidence: "C005", priority: "high" },
      { text: "Bradesco Seguros con ROAE 21,9% — más rentable que el banco", evidence: "C004", priority: "med" },
      { text: "Multicloud deliberada — Azure/AWS/Oracle por unidad de negocio", evidence: "C008", priority: "med" },
      { text: "Inovabra habitat — 230 startups, 8 hubs, programa MATURE", evidence: "C009", priority: "med" },
    ],
    weaknesses: [
      { text: "ROAE (15,2%) significativamente menor que BCP (24,7%) — eficiencia 50%", evidence: "C002,C003", priority: "high" },
      { text: "Fragmentación histórica de marcas (Next, Bitz, Digio) con costos de coordinación", evidence: "C010,C011", priority: "med" },
      { text: "Métricas de productividad auto-reportadas sin auditoría externa", evidence: "C017", priority: "med" },
      { text: "Cifra de Bridge (500 use cases) es fuente única — pendiente corroboración", evidence: "C006", priority: "high" },
    ],
    opportunities: [
      { text: "Meta eficiencia 40% en 2028 — 10pp de mejora estructural", evidence: "C003", priority: "high" },
      { text: "Inversión tech +16% en 2026, 10.500 profesionales, +35% desarrolladores", evidence: "C007", priority: "high" },
      { text: "Pix y Open Finance maduros en Brasil habilitan nuevos casos de uso digital", priority: "med" },
      { text: "Bridge puede expandir multi-agent y agentic architectures (EXPERIMENT_PILOT hoy)", priority: "med" },
    ],
    threats: [
      { text: "Competencia de fintechs digitales brasileñas (Nubank, Inter)", priority: "med" },
      { text: "Regulación de IA en Brasil (Marco Legal da IA) puede imponer costos de cumplimiento", priority: "med" },
      { text: "Ciclo de crédito brasileño volátil puede afectar rentabilidad", priority: "low" },
    ],
  },
  bcp: {
    strengths: [
      { text: "ROAE 24,7% — superior a Bradesco; costo de riesgo cayó 2,13%→1,28%", evidence: "C013", priority: "high" },
      { text: "Yape rentable antes de lo proyectado — meta 16,5M usuarios 2026", evidence: "C015", priority: "high" },
      { text: "Mibanco — liderazgo estructural en microfinanzas (ventaja de portafolio)", priority: "high" },
      { text: "BCP Xplore — Open Banking/APIs propia en producción", priority: "med" },
      { text: "Cartera disruptiva con meta 10% de ingresos ajustados 2026", priority: "med" },
    ],
    weaknesses: [
      { text: "Escala absoluta menor — ~US$54B activos vs US$463B Bradesco", evidence: "C013", priority: "high" },
      { text: "No hay métrica pública equivalente de casos de uso de IA (OQ01)", priority: "high" },
      { text: "Marco regulatorio peruano menos maduro (Open Finance, instant payments)", priority: "med" },
      { text: "Comunicación de innovación menos granular que Bradesco (H2)", priority: "med" },
    ],
    opportunities: [
      { text: "Aprender de plataforma GenAI centralizada tipo Bridge (REC01)", evidence: "REC01", priority: "high" },
      { text: "Preparar capacidades equivalentes a Open Finance Brasil para horizonte peruano (REC05)", priority: "med" },
      { text: "Yape puede expandir a servicios financieros más allá de pagos", priority: "med" },
      { text: "Krealo puede escalar portfolio de venture", priority: "low" },
    ],
    threats: [
      { text: "Bradesco y otros bancos brasileños pueden replicar modelo de innovación de Credicorp", priority: "low" },
      { text: "Entrada de fintechs globales en Perú (Mercado Pago, etc.)", priority: "med" },
      { text: "Dependencia del ciclo económico peruano", priority: "low" },
    ],
  },
};

const QUADRANT = {
  S: { label: "Fortalezas", color: "#16A34A", bg: "bg-emerald-50 dark:bg-emerald-950/20", border: "border-emerald-300 dark:border-emerald-800" },
  W: { label: "Debilidades", color: "#DC2626", bg: "bg-red-50 dark:bg-red-950/20", border: "border-red-300 dark:border-red-800" },
  O: { label: "Oportunidades", color: "#2563EB", bg: "bg-sky-50 dark:bg-sky-950/20", border: "border-sky-300 dark:border-sky-800" },
  T: { label: "Amenazas", color: "#D97706", bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-300 dark:border-amber-800" },
};

const PRIORITY_DOT: Record<string, string> = { high: "#DC2626", med: "#F59E0B", low: "#6B7280" };

export function ComparativeSWOT() {
  const [active, setActive] = React.useState<"bradesco" | "bcp">("bradesco");
  const data = SWOT[active];

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Grid2x2 className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">SWOT Comparativo</h3>
            <p className="text-[11px] text-muted-foreground">Análisis cruzado con trazabilidad de claims</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
          <button onClick={() => setActive("bradesco")} className={cn("rounded-md px-3 py-1 text-xs font-semibold transition-colors", active === "bradesco" ? "bg-[#B91C3C] text-white shadow-sm" : "text-muted-foreground hover:text-foreground")}>Bradesco</button>
          <button onClick={() => setActive("bcp")} className={cn("rounded-md px-3 py-1 text-xs font-semibold transition-colors", active === "bcp" ? "bg-[#0F766E] text-white shadow-sm" : "text-muted-foreground hover:text-foreground")}>BCP / Credicorp</button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(["S", "W", "O", "T"] as const).map((q) => {
          const cfg = QUADRANT[q];
          const items = q === "S" ? data.strengths : q === "W" ? data.weaknesses : q === "O" ? data.opportunities : data.threats;
          return (
            <div key={q} className={cn("rounded-lg border p-3", cfg.bg, cfg.border)}>
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-black text-white" style={{ backgroundColor: cfg.color }}>{q}</span>
                <h4 className="font-bold text-sm" style={{ color: cfg.color }}>{cfg.label}</h4>
                <span className="ml-auto text-[10px] text-muted-foreground">{items.length}</span>
              </div>
              <ul className="space-y-1.5">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs">
                    {item.priority && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: PRIORITY_DOT[item.priority] }} />}
                    <span className="text-foreground/90">{item.text}</span>
                    {item.evidence && (
                      <span className="ml-auto shrink-0 rounded bg-background/60 px-1 py-0 font-mono text-[9px] font-bold text-primary" title="Claims de soporte">{item.evidence}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
