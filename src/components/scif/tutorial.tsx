"use client";
import * as React from "react";
import { X, ChevronRight, ChevronLeft, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODULES } from "@/lib/scif/data";

interface TutorialStep {
  moduleId: string;
  title: string;
  description: string;
  highlight: string;
  visual: React.ReactNode;
}

const STEPS: TutorialStep[] = [
  {
    moduleId: "exec",
    title: "00 · Centro de Comando Ejecutivo",
    description: "Bienvenido al dossier de inteligencia estratégica de Banco Bradesco (Brasil) vs BCP Perú. Este módulo muestra la visión consolidada: escala, rentabilidad, IA, innovación y preguntas abiertas en una sola pantalla. Usa el panel izquierdo para navegar entre los 17 módulos.",
    highlight: "sidebar",
    visual: (
      <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <p className="text-[11px] text-muted-foreground">← Usa el panel izquierdo para navegar entre los 17 módulos</p>
        <p className="mt-1 text-[10px] text-primary">Cada módulo se carga al hacer clic — el tutorial te guiará por cada uno.</p>
      </div>
    ),
  },
  {
    moduleId: "exec",
    title: "00 · Resumen Ejecutivo Exportable",
    description: "El módulo 00 incluye un resumen ejecutivo exportable con KPIs (fuentes, claims, confianza), hallazgos clave verificados, y botones para imprimir o descargar en .txt. Es el punto de partida para distribuidores ejecutivos.",
    highlight: "exec-summary",
    visual: (
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">📊 85 fuentes</span>
        <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">📋 56 claims</span>
        <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">🔍 44 términos</span>
        <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">🛠️ 30 herramientas</span>
      </div>
    ),
  },
  {
    moduleId: "history",
    title: "01 · Compañía, Perímetro e Historia",
    description: "Mapa de entidades de Organização Bradesco (banco, seguros, Next, Digio, Ágora, Inovabra) vs BCP/Credicorp (BCP, Yape, Mibanco, Krealo, CIX). Línea temporal estratégica 1943-2026 con hitos clave. Gate de resolución de entidades: homónimos excluidos.",
    highlight: "entity-gate",
    visual: (
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-md border border-[#B91C3C]/30 bg-[#B91C3C]/5 p-2">
          <p className="text-[10px] font-bold text-[#B91C3C]">BRADESCO</p>
          <p className="text-[9px] text-muted-foreground">Banco · Seguros · Next · Digio · Ágora · Inovabra · BBI</p>
        </div>
        <div className="rounded-md border border-[#0F766E]/30 bg-[#0F766E]/5 p-2">
          <p className="text-[10px] font-bold text-[#0F766E]">BCP/CREDICORP</p>
          <p className="text-[9px] text-muted-foreground">BCP · Yape · Mibanco · Krealo · CIX · Tenpo · Culqi</p>
        </div>
      </div>
    ),
  },
  {
    moduleId: "scale",
    title: "02 · Escala, Economía y Posición",
    description: "Scorecard interactivo de escala: activos, ROAE, eficiencia. Comparador con normalización (% del PIB vs USD absoluto). Waterfall financiero y diagrama Sankey de flujo entidad→segmento→rentabilidad. Gate de comparabilidad: métricas no comparables etiquetadas.",
    highlight: "scale-comparator",
    visual: (
      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-[10px]"><span className="text-[#B91C3C] font-bold">Bradesco</span><span>R$ 2,33T</span></div>
        <div className="flex justify-between text-[10px]"><span className="text-[#0F766E] font-bold">BCP</span><span>S/ 204,9B</span></div>
        <div className="flex justify-between text-[10px] text-muted-foreground"><span>ROAE</span><span>15,2% vs 24,7%</span></div>
      </div>
    ),
  },
  {
    moduleId: "customers",
    title: "03 · Clientes, Segmentos y Canales",
    description: "Mapa de segmentos (retail, affluent, private, SME, corporate, digital-native, microfinanzas) y canales (sucursales, app, WhatsApp, BIA, Clara, ATMs, Open Finance, Pix/Yape). BCP: 320 oficinas, 1000 cajeros, 3000 agentes. Bradesco: 28M clientes digitales.",
    highlight: "segments",
    visual: (
      <div className="mt-4 grid grid-cols-3 gap-1.5">
        {["Retail", "SME", "Corporate", "Private", "Digital", "Microfinanzas"].map((s) => (
          <div key={s} className="rounded border border-border bg-muted/30 p-1.5 text-center text-[9px] font-medium">{s}</div>
        ))}
      </div>
    ),
  },
  {
    moduleId: "products",
    title: "04 · Ecosistema de Productos",
    description: "Explorador de productos filtrable por categoría (depósitos, crédito, tarjetas, seguros, wealth, pagos). Cada producto muestra Bradesco vs BCP con etiqueta de entidad. Incluye Mibanco (microfinanzas, ventaja Credicorp) y Bradesco Seguros (ROAE 21,9%).",
    highlight: "products",
    visual: (
      <div className="mt-4 flex flex-wrap gap-1">
        {["Cuentas", "Tarjetas", "Crédito", "Seguros", "Inversión", "Pagos"].map((c) => (
          <span key={c} className="rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-[9px] font-semibold">{c}</span>
        ))}
      </div>
    ),
  },
  {
    moduleId: "platforms",
    title: "05 · Plataformas Digitales y Journeys",
    description: "Estado actual de cada plataforma: [BRADESCO:BIA] (24M+ usuarios, 90% retención), [BRADESCO:BRIDGE] (500+ casos GenAI), [BRADESCO:NEXT] (INTEGRATED, no fracaso), [BRADESCO:BITZ] (SUNSET 2023), [BRADESCO:DIGIO] (PRODUCTION). BCP: [BCP:YAPE] (20M+ usuarios), [BCP:CLARA] (IA Gen), [BCP:BCP_XPLORE] (Open Banking).",
    highlight: "platforms",
    visual: (
      <div className="mt-4 space-y-1">
        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500"></span><span className="text-[10px]">PRODUCTION: BIA, Bridge, Digio, Yape, Clara</span></div>
        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan-500"></span><span className="text-[10px]">INTEGRATED: Next (no fracaso)</span></div>
        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500"></span><span className="text-[10px]">SUNSET: Bitz (2023 → Digio)</span></div>
      </div>
    ),
  },
  {
    moduleId: "tech",
    title: "06 · Arquitectura Tecnológica",
    description: "Estrategia multicloud de Bradesco: Azure (Next), AWS (Digio), Oracle (Seguros), mixed (banco matriz). 35% workloads en cloud. Terraform: 80 días → 5 días. Microsoft Copilot: +35% productividad. BCP: $650M inversión IT en 5 años. Heatmap de capacidades tecnológicas.",
    highlight: "cloud",
    visual: (
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded border border-sky-300/30 bg-sky-50/50 p-1.5 text-center dark:bg-sky-950/20">
          <p className="text-[10px] font-bold text-sky-600">Azure</p>
          <p className="text-[9px] text-muted-foreground">Bradesco Next</p>
        </div>
        <div className="rounded border border-amber-300/30 bg-amber-50/50 p-1.5 text-center dark:bg-amber-950/20">
          <p className="text-[10px] font-bold text-amber-600">AWS</p>
          <p className="text-[9px] text-muted-foreground">Bradesco Digio</p>
        </div>
      </div>
    ),
  },
  {
    moduleId: "ai",
    title: "07 · IA, Datos y Tecnologías Emergentes",
    description: "[BRADESCO:BIA]: asistente virtual 24M+ usuarios, 90% retención, evolución Watson→GenAI. [BRADESCO:BRIDGE]: plataforma GenAI multi-LLM, RAG, 7 guardrails, 500+ casos uso. [BCP:CLARA]: asistente IA Gen vía WhatsApp. [BCP:GENIA]: pionero Perú IA gen software. Outcome metrics: 82% resolución, -25% fraude. Radar tecnológico versionado (2022/2024/2026).",
    highlight: "ai-radar",
    visual: (
      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="rounded-lg bg-[#B91C3C] px-2 py-1 text-[10px] font-bold text-white">BIA</span>
        <span className="text-muted-foreground text-[10px]">vs</span>
        <span className="rounded-lg bg-[#0F766E] px-2 py-1 text-[10px] font-bold text-white">CLARA</span>
      </div>
    ),
  },
  {
    moduleId: "innovation",
    title: "08 · Innovación, I+D e Inovabra",
    description: "[BRADESCO:INOVABRA]: habitat 22.000 m², 230 startups, 80 empresas, 8 hubs, R$400M fondo. [BCP:CIX]: +1 década activo, proceso Exploración→Ideación→Creación. [CREDICORP:KREALO]: 16 startups, 8 transacciones 2025, Tenpo primer neobanco Chile. Partnership Bradesco-USP (quantum, AI, cybersecurity). Modelos distintos: habitat abierto vs CVC.",
    highlight: "innovation",
    visual: (
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded border border-[#B08D57]/30 bg-[#B08D57]/5 p-1.5">
          <p className="text-[10px] font-bold text-[#B08D57]">Inovabra (Bradesco)</p>
          <p className="text-[9px] text-muted-foreground">Habitat abierto · 230 startups</p>
        </div>
        <div className="rounded border border-[#0F766E]/30 bg-[#0F766E]/5 p-1.5">
          <p className="text-[10px] font-bold text-[#0F766E]">CIX + Krealo (BCP)</p>
          <p className="text-[9px] text-muted-foreground">Lab interno + CVC · 16 startups</p>
        </div>
      </div>
    ),
  },
  {
    moduleId: "lifecycle",
    title: "09 · Ciclo de Vida de Iniciativas",
    description: "Funnel SIGNAL→EXPERIMENT→PILOT→PRODUCTION→MATURE→EXIT. Cada iniciativa con promesa original vs resultado posterior. [BRADESCO:NEXT]: INTEGRATED (no fracaso). [BRADESCO:BITZ]: SUNSET (absorbida por Digio). [BRADESCO:BIA]: SUCCESS (10 años evolución). Tasa de conversión y explorador interactivo.",
    highlight: "funnel",
    visual: (
      <div className="mt-4 space-y-0.5">
        {["SIGNAL", "EXPERIMENT", "PILOT", "PRODUCTION", "MATURE"].map((s, i) => (
          <div key={s} className="flex items-center gap-1.5" style={{marginLeft: `${i*8}px`}}>
            <span className="h-2 w-2 rounded-full" style={{backgroundColor: `hsl(${120 - i*20}, 60%, 45%)`}}></span>
            <span className="text-[9px] font-medium">{s}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    moduleId: "partnerships",
    title: "10 · Alianzas, Startups y Adquisiciones",
    description: "Grafo de alianzas: Bradesco ↔ Microsoft, IBM, Oracle, AWS, Teradata, WeWork, USP. BCP ↔ FICO, Lynx Tech, BitGo, Fireblocks. M&A: Ágora (2008), Digio R$625M (2021), Cielo delisting (2024). CriptoCocos (BCP, primera plataforma cripto bancaria Perú).",
    highlight: "partnerships",
    visual: (
      <div className="mt-4 flex flex-wrap gap-1">
        {["Microsoft", "IBM", "AWS", "Oracle", "FICO", "USP", "BitGo"].map((p) => (
          <span key={p} className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 text-[9px] font-medium">{p}</span>
        ))}
      </div>
    ),
  },
  {
    moduleId: "signals",
    title: "11 · Señales Externas",
    description: "Señales clasificadas por independencia: Tier D (app stores, Reclame Aqui, redes sociales). Bradesco: YouTube 4.69M subs, TikTok desde nov/2020, Instagram. BCP: Yape señales, CIX Instagram. Regla: señales ≠ estimaciones poblacionales.",
    highlight: "signals",
    visual: (
      <div className="mt-4 flex items-center justify-center gap-2">
        {["YouTube", "TikTok", "Instagram", "LinkedIn"].map((p) => (
          <span key={p} className="rounded-md border border-border p-1.5 text-[10px]">{p}</span>
        ))}
      </div>
    ),
  },
  {
    moduleId: "risk",
    title: "12 · Riesgo, Regulación, Cyber y Resilencia",
    description: "Open Finance Brasil (obligatorio BACEN desde 2021) vs Perú (en desarrollo). Pix: 68.7B transacciones 2024. Bradesco: CVM proceso, R$38B contingencias fiscales. Credicorp: SUNAT S/1.568B disputa (~23% utilidad). ESG: ambos MSCI AA. Heatmap de riesgos (probabilidad × impacto). [BCP:CRIPTOCOCOS]: primera plataforma cripto bancaria Perú.",
    highlight: "risk",
    visual: (
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded border border-purple-300/30 bg-purple-50/30 p-1.5 dark:bg-purple-950/20">
          <p className="text-[10px] font-bold text-purple-600">BRADESCO</p>
          <p className="text-[9px] text-muted-foreground">CVM · R$38B fiscal · Open Finance obligatorio</p>
        </div>
        <div className="rounded border border-orange-300/30 bg-orange-50/30 p-1.5 dark:bg-orange-950/20">
          <p className="text-[10px] font-bold text-orange-600">CREDICORP</p>
          <p className="text-[9px] text-muted-foreground">SUNAT S/1.568B · ~23% utilidad anual</p>
        </div>
      </div>
    ),
  },
  {
    moduleId: "compare",
    title: "13 · Bradesco vs BCP — Comparación Estratégica",
    description: "Gate de comparabilidad: Comparison A (banco vs banco) y B (grupo vs grupo). Matriz de madurez (10 dimensiones, niveles 0-4). SWOT comparativo. Gráficos recharts (escala, rentabilidad, crecimiento, IA). Mapa de posicionamiento competitivo. Bubble chart 3D. Hipótesis alternativas H1-H4.",
    highlight: "compare",
    visual: (
      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="rounded-lg bg-[#B91C3C] px-3 py-1 text-xs font-bold text-white">BRADESCO</span>
        <span className="text-muted-foreground">vs</span>
        <span className="rounded-lg bg-[#0F766E] px-3 py-1 text-xs font-bold text-white">BCP</span>
      </div>
    ),
  },
  {
    moduleId: "lessons",
    title: "14 · Lecciones y Opciones Estratégicas",
    description: "5 recomendaciones con claim-graph: supporting_claim_ids[], contradicting_claim_ids[], what_would_change_my_mind. Árbol de decisiones estratégicas para BCP. Constructor de escenarios interactivo (8 acciones seleccionables). Recomendaciones: centralizar GenAI (REC01), no usar cifras Bradesco como benchmark directo (REC04).",
    highlight: "lessons",
    visual: (
      <div className="mt-4 space-y-1">
        <div className="flex items-center gap-1.5"><Check className="h-3 w-3 text-emerald-500"/><span className="text-[10px]">REC01: Centralizar GenAI (tipo Bridge)</span></div>
        <div className="flex items-center gap-1.5"><Check className="h-3 w-3 text-emerald-500"/><span className="text-[10px]">REC05: Preparar Open Finance</span></div>
        <div className="flex items-center gap-1.5"><X className="h-3 w-3 text-red-500"/><span className="text-[10px]">REC04: No usar cifras sin ajuste</span></div>
      </div>
    ),
  },
  {
    moduleId: "roadmap",
    title: "15 · Roadmap, Experimentos y KPIs",
    description: "Roadmap: Bradesco meta eficiencia 40% (2028), inversión tech +16% (2026). Credicorp: Yape meta 16,5M usuarios (2026), 10% ingresos disruptivos. Gauges animados de KPIs: ROAE, eficiencia, retención BIA, casos Bridge, reducción fraude, NPS BCP. Stop rules del framework.",
    highlight: "roadmap",
    visual: (
      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-[10px]"><span>Eficiencia Bradesco</span><span className="font-bold">50% → 40% (2028)</span></div>
        <div className="flex justify-between text-[10px]"><span>Yape usuarios</span><span className="font-bold">20M+ → 16,5M meta</span></div>
        <div className="flex justify-between text-[10px]"><span>ROAE Bradesco</span><span className="font-bold">16,2% (2T26)</span></div>
      </div>
    ),
  },
  {
    moduleId: "sources",
    title: "16 · Fuentes, Claims y Contradicciones",
    description: "89 fuentes en 30+ clusters de independencia. 56 claims con trazabilidad completa. Grafo de conocimiento interactivo (claims ↔ fuentes). Dashboard de confianza. Monitor de frescura. Matriz de calidad (topics × estado). Explorador de claims con filtros. Registro de contradicciones y preguntas abiertas. Todas las preguntas abiertas están en LOW.",
    highlight: "sources",
    visual: (
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded border border-emerald-300/30 bg-emerald-50/30 p-1.5 text-center dark:bg-emerald-950/20">
          <p className="text-sm font-black text-emerald-600">89</p>
          <p className="text-[9px] text-muted-foreground">Fuentes</p>
        </div>
        <div className="rounded border border-primary/30 bg-primary/5 p-1.5 text-center">
          <p className="text-sm font-black text-primary">56</p>
          <p className="text-[9px] text-muted-foreground">Claims</p>
        </div>
        <div className="rounded border border-amber-300/30 bg-amber-50/30 p-1.5 text-center dark:bg-amber-950/20">
          <p className="text-sm font-black text-amber-600">0</p>
          <p className="text-[9px] text-muted-foreground">HIGH/MED OQ</p>
        </div>
      </div>
    ),
  },
  {
    moduleId: "exec",
    title: "¡Listo para explorar!",
    description: "Has completado el tutorial. El sitio es un one-stop shop de inteligencia estratégica: cada término tiene etiqueta de entidad [BRADESCO:xxx] o [BCP:xxx], cada claim tiene fuentes verificables, cada módulo tiene herramientas interactivas. Usa el modo oscuro (🌙), imprime (🖨️), o busca módulos desde la barra superior. ¡Explora libremente!",
    highlight: "header",
    visual: (
      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="rounded-md border border-border p-1.5" title="Modo oscuro">🌙</span>
        <span className="rounded-md border border-border p-1.5" title="Imprimir">🖨️</span>
        <span className="rounded-md border border-border p-1.5" title="Buscar">🔍</span>
      </div>
    ),
  },
];

export function Tutorial() {
  const [show, setShow] = React.useState(false);
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const seen = localStorage.getItem("scif-tutorial-seen-v2");
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("scif-tutorial-seen-v2", "true");
  };

  const goToStep = (newStep: number) => {
    setStep(newStep);
    const stepData = STEPS[newStep];
    if (stepData.moduleId) {
      window.location.hash = `#/${stepData.moduleId}`;
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) goToStep(step + 1);
    else dismiss();
  };

  const prev = () => {
    if (step > 0) goToStep(step - 1);
  };

  if (!show) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={dismiss}>
      <div
        className="metallic-card relative mx-4 w-full max-w-lg rounded-2xl border border-border/40 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 overflow-hidden rounded-t-2xl bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button onClick={dismiss} className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Cerrar tutorial">
          <X className="h-4 w-4" />
        </button>

        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Tutorial · Paso {step + 1} de {STEPS.length}</p>
            <p className="text-[9px] text-muted-foreground">{Math.round(progress)}% completado</p>
          </div>
        </div>

        <h3 className="text-base font-bold tracking-tight text-foreground">{current.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.description}</p>

        {current.visual}

        {current.highlight === "header" && (
          <div className="mt-3 rounded-md border border-sky-200 bg-sky-50 p-2 text-[11px] text-sky-700 dark:border-sky-800 dark:bg-sky-950/30 dark:text-sky-300">
            💡 <strong>Consejo:</strong> Usa los botones de la barra superior para modo oscuro, imprimir y buscar.
          </div>
        )}

        {/* Navigation */}
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={step === 0}
            className={cn("flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors", step === 0 ? "cursor-not-allowed text-muted-foreground/30" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Anterior
          </button>

          {/* Dots — compressed for 19 steps */}
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className={cn("rounded-full transition-all", i === step ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50")}
                title={`Paso ${i + 1}: ${STEPS[i].title}`}
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
          Saltar tutorial ({STEPS.length} pasos)
        </button>
      </div>
    </div>
  );
}
