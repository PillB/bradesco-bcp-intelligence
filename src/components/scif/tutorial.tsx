"use client";
import * as React from "react";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODULES } from "@/lib/scif/data";

interface Step {
  title: string;
  description: string;
  highlight?: string;
}

const STEPS: Step[] = [
  {
    title: "Centro de Comando Estratégico",
    description: "Este dossier es un centro de inteligencia estratégica auditable sobre Banco Bradesco vs BCP Perú. Navega los 17 módulos desde el panel izquierdo.",
    highlight: "sidebar",
  },
  {
    title: "Trazabilidad de Evidencia",
    description: "Cada claim está respaldado por fuentes verificables (Tier A/B/C). Busca los badges de evidencia: VERIFIED, CORROBORATED, STRONGLY_SUPPORTED. Explora el módulo 16 para ver el grafo de conocimiento.",
    highlight: "evidence",
  },
  {
    title: "30 Herramientas Interactivas",
    description: "Mapas de posicionamiento, heatmaps de tecnología, grafo de dependencias, dashboards de KPIs, escenarios estratégicos y más. Cada módulo contiene herramientas analíticas profundas.",
    highlight: "tools",
  },
  {
    title: "Comparación Bradesco × BCP",
    description: "El módulo 13 contiene la comparación estratégica con gate de comparabilidad, matriz de madurez, SWOT, gráficos recharts y mapa de posicionamiento competitivo.",
    highlight: "compare",
  },
  {
    title: "Modo Oscuro y Exportación",
    description: "Usa los botones de modo oscuro y impresión en la barra superior. El resumen ejecutivo (módulo 00) permite exportar a .txt para distribución.",
    highlight: "header",
  },
];

export function Tutorial() {
  const [show, setShow] = React.useState(false);
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const seen = localStorage.getItem("scif-tutorial-seen");
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("scif-tutorial-seen", "true");
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else dismiss();
  };

  const prev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  if (!show) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={dismiss}>
      <div
        className="metallic-card relative mx-4 w-full max-w-md rounded-2xl border border-border/40 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden rounded-t-2xl bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <button onClick={dismiss} className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Cerrar tutorial">
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Tutorial · Paso {step + 1} de {STEPS.length}</p>
          </div>
        </div>

        <h3 className="text-lg font-bold tracking-tight text-foreground">{current.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.description}</p>

        {current.highlight === "sidebar" && (
          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-[11px] text-muted-foreground">← Mira el panel izquierdo para navegar entre los 17 módulos</p>
          </div>
        )}
        {current.highlight === "evidence" && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {["VERIFIED", "CORROBORATED", "STRONGLY_SUPPORTED", "UNRESOLVED"].map((s) => (
              <span key={s} className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-bold">{s}</span>
            ))}
          </div>
        )}
        {current.highlight === "tools" && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {["📊 Charts", "🔮 Radar", "🌐 Graph", "📈 KPIs", "🎯 SWOT", "📋 Matrix"].map((t) => (
              <div key={t} className="rounded-md border border-border bg-muted/30 p-2 text-center text-[10px] font-medium">{t}</div>
            ))}
          </div>
        )}
        {current.highlight === "compare" && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="rounded-lg bg-[#B91C3C] px-3 py-1 text-xs font-bold text-white">BRADESCO</span>
            <span className="text-muted-foreground">vs</span>
            <span className="rounded-lg bg-[#0F766E] px-3 py-1 text-xs font-bold text-white">BCP</span>
          </div>
        )}
        {current.highlight === "header" && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="rounded-md border border-border p-1.5">🌙</span>
            <span className="rounded-md border border-border p-1.5">🖨️</span>
            <span className="text-[10px] text-muted-foreground">Modo oscuro · Imprimir · Buscar</span>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={step === 0}
            className={cn("flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors", step === 0 ? "cursor-not-allowed text-muted-foreground/30" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Anterior
          </button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={cn("h-1.5 rounded-full transition-all", i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50")}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="metallic-btn flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            {isLast ? "Comenzar" : "Siguiente"} <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <button onClick={dismiss} className="mt-3 w-full text-center text-[10px] text-muted-foreground/60 hover:text-muted-foreground">
          Saltar tutorial
        </button>
      </div>
    </div>
  );
}
