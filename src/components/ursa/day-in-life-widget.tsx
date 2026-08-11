"use client";

import { useState, useEffect, useRef } from "react";
import { BearMark } from "./ursa-brand";
import { cn } from "@/lib/utils";

/**
 * "Day in the Life of Ursa" — an interactive 24-hour timeline showing
 * a typical day at the Miraflores café: opening, peak hours, staffing,
 * and the rhythm of the two bars. Hours are verified from public sources
 * (Mon–Sat 07:30–21:00, Sun 08:30–20:00).
 */
type DayPhase = {
  hour: number; // decimal, 7.5 = 7:30
  label: string;
  desc: string;
  intensity: number; // 0–100, how busy
  bar: "espresso" | "coldbrew" | "both" | "closed";
  staffing: string;
  tone: "calm" | "rising" | "peak" | "winding";
};

const WEEKDAY_PHASES: DayPhase[] = [
  { hour: 7.5, label: "Apertura", desc: "Luces, molino encendido, primer shot descartado. El oso despierta.", intensity: 10, bar: "espresso", staffing: "1 barista + 1 cajero", tone: "calm" },
  { hour: 8, label: "Club de las 7am", desc: "Los regulares de la mañana entran antes de oficina. Ursagroni y filtrado del día.", intensity: 35, bar: "both", staffing: "2 baristas + 1 cajero", tone: "rising" },
  { hour: 9, label: "Pico matutino", desc: "Pico de oficina y delivery. La coldbrew bar acelera el throughput.", intensity: 85, bar: "both", staffing: "2 baristas + 1 cajero + 1 runner", tone: "peak" },
  { hour: 10, label: "Mañana media", desc: "Ritmo sostenido. Suscripción Ursa Mañana cierra su ventana 7–10am.", intensity: 60, bar: "both", staffing: "2 baristas + 1 cajero", tone: "rising" },
  { hour: 11, label: "Respiro", desc: "Caída breve. Limpieza de barra, reposición de pastelería, cambio de lote.", intensity: 30, bar: "espresso", staffing: "2 baristas + 1 cajero", tone: "calm" },
  { hour: 12.5, label: "Almuerzo", desc: "Empanadas y bebidas frías. Mesa compartida llena.", intensity: 70, bar: "both", staffing: "2 baristas + 1 cajero + 1 runner", tone: "peak" },
  { hour: 14, label: "Tarde de trabajo", desc: "Remote workers con laptop. Filtrados y aeropress. Wi-Fi al límite.", intensity: 50, bar: "espresso", staffing: "2 baristas + 1 cajero", tone: "rising" },
  { hour: 16, label: "Merienda", desc: "Financier de pera + café. Familias y turistas.", intensity: 55, bar: "both", staffing: "2 baristas + 1 cajero", tone: "rising" },
  { hour: 18, label: "Pico vespertino", desc: "Post-oficina. Coldbrew y Ursagroni. El segundo pico del día.", intensity: 80, bar: "both", staffing: "2 baristas + 1 cajero + 1 runner", tone: "peak" },
  { hour: 19.5, label: "Cena-café", desc: "Última ola. Conversación larga, mesas llenas.", intensity: 45, bar: "espresso", staffing: "2 baristas + 1 cajero", tone: "winding" },
  { hour: 21, label: "Cierre", desc: "Backflush, limpieza, nota del cierre. El oso duerme.", intensity: 5, bar: "closed", staffing: "1 barista + 1 cajero", tone: "calm" },
];

const TONE_COLORS = {
  calm: "var(--color-ursa-sage)",
  rising: "var(--color-ursa-gold)",
  peak: "var(--color-ursa-terracotta)",
  winding: "var(--color-ursa-forest)",
};

// Text-safe variants — the bright TONE_COLORS above are designed for fills /
// strokes and fail WCAG AA when used as text on a light card surface. The
// *-text tokens are the same hue family but darker, so the large display
// time numerals (text-3xl) on the active-phase card remain legible.
const TONE_TEXT_COLORS = {
  calm: "var(--color-ursa-sage-text)",
  rising: "var(--color-ursa-gold-text)",
  peak: "var(--color-ursa-terracotta-text)",
  winding: "var(--color-ursa-forest-deep)",
};

export function DayInTheLifeWidget() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [currentHour, setCurrentHour] = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Detect current Lima time and map to the timeline
  useEffect(() => {
    const update = () => {
      const now = new Date();
      // Approximate Lima time (UTC-5)
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const lima = new Date(utc - 5 * 3600000);
      const h = lima.getHours() + lima.getMinutes() / 60;
      setCurrentHour(h);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  const activeIdx = hovered !== null
    ? hovered
    : currentHour !== null
      ? WEEKDAY_PHASES.findIndex((p, i) => {
          const next = WEEKDAY_PHASES[i + 1];
          return currentHour >= p.hour && (next ? currentHour < next.hour : currentHour < 21);
        })
      : -1;
  // Fallback: if currentHour is before opening, show apertura
  const safeIdx = activeIdx >= 0 ? activeIdx : 0;
  const active = WEEKDAY_PHASES[safeIdx];

  // Find current phase for the "now" marker
  const nowInTimeline = currentHour !== null && currentHour >= 7 && currentHour <= 21;

  return (
    <div className="space-y-5">
      {/* The timeline visualization */}
      <div className="bg-card border border-ursa-line-soft rounded-2xl p-5 md:p-6 shadow-[0_1px_0_rgba(59,36,23,0.06),0_8px_24px_-12px_rgba(59,36,23,0.18)]">
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
          <h3 className="font-display text-lg font-semibold text-ursa-dark-roast m-0 flex items-center gap-2">
            <BearMark size={20} className="text-ursa-dark-roast" /> Un día en Alcanfores 183
          </h3>
          {nowInTimeline && (
            <span className="font-label text-[0.62rem] tracking-[0.16em] uppercase text-ursa-gold-text flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-ursa-terracotta ursa-breathe" /> Ahora en Lima
            </span>
          )}
        </div>

        {/* Hour axis */}
        <div className="flex justify-between font-label text-[0.58rem] tracking-[0.12em] uppercase text-muted-foreground mb-1.5 px-0.5">
          <span>7am</span><span>9</span><span>11</span><span>1pm</span><span>3</span><span>5</span><span>7</span><span>9pm</span>
        </div>

        {/* The intensity bar */}
        <div
          ref={barRef}
          className="relative h-28 md:h-32 rounded-xl overflow-hidden bg-gradient-to-b from-ursa-foam to-ursa-bg-alt border border-ursa-line-soft"
        >
          {/* Intensity columns — one per phase */}
          {WEEKDAY_PHASES.map((phase, i) => {
            const left = ((phase.hour - 7.5) / (21 - 7.5)) * 100;
            const width = i < WEEKDAY_PHASES.length - 1 ? ((WEEKDAY_PHASES[i + 1].hour - phase.hour) / (21 - 7.5)) * 100 : 4;
            const isActive = i === safeIdx;
            return (
              <button
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                aria-label={`${phase.label} — ${phase.desc}`}
                className="absolute top-0 bottom-0 group cursor-pointer transition-opacity"
                style={{ left: `${left}%`, width: `${width}%`, opacity: isActive ? 1 : 0.72 }}
              >
                {/* Intensity fill */}
                <div
                  className="absolute bottom-0 left-0 right-0 transition-all duration-300 group-hover:brightness-110"
                  style={{
                    height: `${phase.intensity}%`,
                    background: `linear-gradient(180deg, ${TONE_COLORS[phase.tone]}, ${TONE_COLORS[phase.tone]}40)`,
                    boxShadow: isActive ? `0 0 0 1px ${TONE_COLORS[phase.tone]}` : "none",
                  }}
                />
                {/* Bar indicator */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {(phase.bar === "espresso" || phase.bar === "both") && (
                    <span className="w-1 h-1 rounded-full bg-ursa-dark-roast" title="Espresso bar" />
                  )}
                  {(phase.bar === "coldbrew" || phase.bar === "both") && (
                    <span className="w-1 h-1 rounded-full bg-ursa-forest-deep" title="Coldbrew bar" />
                  )}
                  {phase.bar === "closed" && (
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" title="Closed" />
                  )}
                </div>
              </button>
            );
          })}

          {/* Now marker */}
          {nowInTimeline && currentHour !== null && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-ursa-terracotta z-10 pointer-events-none"
              style={{ left: `${((currentHour - 7.5) / (21 - 7.5)) * 100}%` }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-ursa-terracotta border-2 border-card" />
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-label text-[0.6rem] tracking-[0.08em] uppercase whitespace-nowrap bg-ursa-terracotta text-ursa-espresso px-1.5 py-0.5 rounded font-bold">
                {Math.floor(currentHour)}:{String(Math.round((currentHour % 1) * 60)).padStart(2, "0")}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 font-label text-[0.6rem] tracking-[0.1em] uppercase text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{background: TONE_COLORS.calm}} /> Calm</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{background: TONE_COLORS.rising}} /> Rising</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{background: TONE_COLORS.peak}} /> Peak</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{background: TONE_COLORS.winding}} /> Winding</span>
          <span className="flex items-center gap-1.5 ml-auto"><span className="w-1 h-1 rounded-full bg-ursa-dark-roast" /> Espresso bar</span>
          <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-ursa-forest-deep" /> Coldbrew bar</span>
        </div>
      </div>

      {/* Active phase detail */}
      <div className="bg-card border border-ursa-line-soft rounded-2xl p-5 md:p-6 shadow-[0_1px_0_rgba(59,36,23,0.06),0_8px_24px_-12px_rgba(59,36,23,0.18)] ursa-fade-up" key={safeIdx}>
        <div className="grid md:grid-cols-[auto_1fr_auto] gap-4 md:gap-6 items-start">
          {/* Time block */}
          <div className="flex md:flex-col items-baseline md:items-start gap-2 md:gap-0">
            <span className="font-display text-3xl font-semibold leading-none" style={{ color: TONE_TEXT_COLORS[active.tone] }}>
              {Math.floor(active.hour)}:{String(Math.round((active.hour % 1) * 60)).padStart(2, "0")}
            </span>
            <span className="font-label text-[0.62rem] tracking-[0.16em] uppercase text-muted-foreground">{active.label}</span>
          </div>
          {/* Description */}
          <div className="min-w-0">
            <p className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast m-0 mb-1">{active.label}</p>
            <p className="text-[0.9rem] text-muted-foreground m-0 leading-relaxed">{active.desc}</p>
          </div>
          {/* Stats */}
          <div className="flex md:flex-col gap-3 md:gap-2 md:text-right md:min-w-[120px]">
            <div>
              <div className="font-label text-[0.56rem] tracking-[0.14em] uppercase text-muted-foreground">Intensity</div>
              <div className="flex md:justify-end items-center gap-1 mt-0.5">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((n) => (
                    <span key={n} className={cn("w-1.5 h-3 rounded-sm", n <= Math.ceil(active.intensity / 20) ? "" : "bg-muted")} style={n <= Math.ceil(active.intensity / 20) ? {background: TONE_COLORS[active.tone]} : {}} />
                  ))}
                </div>
                <span className="font-label text-[0.7rem] text-ursa-dark-roast">{active.intensity}%</span>
              </div>
            </div>
            <div>
              <div className="font-label text-[0.56rem] tracking-[0.14em] uppercase text-muted-foreground">Staffing</div>
              <p className="font-body text-[0.78rem] text-ursa-dark-roast m-0 mt-0.5 leading-tight">{active.staffing}</p>
            </div>
          </div>
        </div>

        {/* Operational insight */}
        <div className="mt-4 pt-4 border-t border-ursa-line-soft grid sm:grid-cols-3 gap-3 text-[0.82rem]">
          <Insight label="Best for" value={active.intensity < 50 ? "Quiet work, meetings" : active.intensity > 70 ? "Energy, people-watching" : "Balanced visit"} />
          <Insight label="Ursa Mañana window" value={active.hour >= 7 && active.hour < 10 ? "Active now" : "7–10am only"} highlight={active.hour >= 7 && active.hour < 10} />
          <Insight label="Recommended drink" value={active.bar === "coldbrew" || (active.bar === "both" && active.intensity > 60) ? "Coldbrew (fast)" : active.bar === "closed" ? "—" : "Filtrado del día"} />
        </div>
      </div>

      {/* Phase chips — quick jump */}
      <div className="flex flex-wrap gap-1.5">
        {WEEKDAY_PHASES.map((phase, i) => (
          <button
            key={i}
            onClick={() => setHovered(i)}
            onMouseEnter={() => setHovered(i)}
            className={cn(
              "px-2.5 py-1 rounded-full font-label text-[0.6rem] tracking-[0.08em] uppercase border transition",
              i === safeIdx ? "bg-ursa-dark-roast text-ursa-cream border-ursa-dark-roast" : "bg-card text-muted-foreground border-ursa-line-soft hover:border-ursa-gold/60 hover:text-ursa-dark-roast"
            )}
          >
            {Math.floor(phase.hour)}:{String(Math.round((phase.hour % 1) * 60)).padStart(2, "0")} · {phase.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Insight({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("rounded-lg p-2.5 border", highlight ? "bg-ursa-gold/10 border-ursa-gold/40" : "bg-ursa-foam/60 border-ursa-line-soft")}>
      <div className="font-label text-[0.56rem] tracking-[0.14em] uppercase text-muted-foreground">{label}</div>
      <p className={cn("font-display text-[0.85rem] font-semibold m-0 mt-0.5", highlight ? "text-ursa-gold-text" : "text-ursa-dark-roast")}>{value}</p>
    </div>
  );
}
