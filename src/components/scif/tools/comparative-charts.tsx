"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { BarChart3, Download } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";

const profitabilityData = [
  { metric: "ROAE (%)", Bradesco: 15.2, BCP: 24.7, Credicorp: 19.0, "Bradesco Seguros": 21.9 },
];

const growthData = [
  { metric: "Activos YoY (%)", Bradesco: 12.6, BCP: 3.8 },
  { metric: "Resultado recurrente YoY (%)", Bradesco: 26.1, BCP: 0 },
  { metric: "Cartera crédito YoY (%)", Bradesco: 11.0, BCP: 0 },
  { metric: "Depósitos YoY (%)", Bradesco: 12.2, BCP: 0 },
];

const scaleData = [
  { metric: "Activos (USD bn)", Bradesco: 463, BCP: 54, Credicorp: 71 },
  { metric: "% del PIB doméstico", Bradesco: 21, BCP: 19, Credicorp: 25 },
  { metric: "Per cápita (USD)", Bradesco: 2144, BCP: 1588, Credicorp: 2088 },
];

const aiMaturityData = [
  { metric: "Casos de uso IA (count)", Bradesco: 500, BCP: 10 },
  { metric: "Retención digital (%)", Bradesco: 90, BCP: 0 },
  { metric: "Resolución 1er nivel (%)", Bradesco: 82, BCP: 0 },
  { metric: "Reducción fraude (%)", Bradesco: 25, BCP: 0 },
];

const radialData = [
  { name: "Escala", Bradesco: 85, BCP: 25, fill: "#B91C3C" },
  { name: "Rentabilidad", Bradesco: 60, BCP: 95, fill: "#0F766E" },
  { name: "IA maturity", Bradesco: 80, BCP: 40, fill: "#7C3AED" },
  { name: "Innovación", Bradesco: 75, BCP: 65, fill: "#B08D57" },
];

const COLORS = { Bradesco: "#B91C3C", BCP: "#0F766E", Credicorp: "#7C3AED", "Bradesco Seguros": "#B08D57" };

function ChartCard({ title, children, subtitle }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-xs font-bold text-foreground">{title}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function ComparativeCharts() {
  const [view, setView] = React.useState<"scale" | "profitability" | "growth" | "ai">("scale");

  const views = [
    { id: "scale", label: "Escala", data: scaleData },
    { id: "profitability", label: "Rentabilidad", data: profitabilityData },
    { id: "growth", label: "Crecimiento", data: growthData },
    { id: "ai", label: "IA maturity", data: aiMaturityData },
  ] as const;

  const activeView = views.find((v) => v.id === view)!;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Gráficos Comparativos Interactivos (recharts)</h3>
            <p className="text-[11px] text-muted-foreground">Visualización profesional Bradesco vs BCP/Credicorp</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${view === v.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Main bar chart */}
        <ChartCard title={`Comparación: ${activeView.label}`} subtitle="Click en leyenda para toggle">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={activeView.data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="metric" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              {Object.keys(activeView.data[0]).filter((k) => k !== "metric").map((key) => (
                <Bar key={key} dataKey={key} fill={COLORS[key as keyof typeof COLORS] ?? "#6B7280"} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Radial comparison */}
        <ChartCard title="Perfil estratégico radial" subtitle="4 dimensiones normalizadas (0-100)">
          <ResponsiveContainer width="100%" height={260}>
            <RadialBarChart innerRadius="25%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background dataKey="Bradesco" cornerRadius={6} fill="#B91C3C" />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* BCP radial overlay */}
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {radialData.map((d) => (
          <div key={d.name} className="rounded-lg border border-border p-2.5">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">{d.name}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-black" style={{ color: "#B91C3C" }}>{d.Bradesco}</span>
              <span className="text-xs text-muted-foreground">vs</span>
              <span className="text-lg font-black" style={{ color: "#0F766E" }}>{d.BCP}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full" style={{ width: `${d.Bradesco}%`, backgroundColor: "#B91C3C" }} />
            </div>
            <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full" style={{ width: `${d.BCP}%`, backgroundColor: "#0F766E" }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs dark:border-sky-800 dark:bg-sky-950/30">
        <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <div className="text-sky-900 dark:text-sky-200">
          <strong>Lectura:</strong> Bradesco domina en escala e IA maturity; BCP domina en rentabilidad (ROAE 24.7% vs 15.2%).
          Innovación es comparable (Inovabra habitat vs CIX+Krealo). Las puntuaciones radiales son <strong>normalizadas cualitativamente</strong>,
          no métricas directas — ver módulo 13 para el gate de comparabilidad completo.
          <span className="mt-1 block text-[10px] italic">Fuentes: S01-S04, S13, S33. Datos FY2025. Per cápita y % PIB aproximados.</span>
        </div>
      </div>
    </Card>
  );
}
