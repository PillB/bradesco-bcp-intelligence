"use client";
import { ViewHero, ViewSection, Card, Grid, Callout } from "@/components/scif/view-shell";
import { TierBadge } from "@/components/scif/evidence";
import { EXTERNAL_SIGNALS } from "@/lib/scif/data";

const TYPE_COLORS: Record<string, string> = {
  CUSTOMER_SIGNAL: "#0F766E",
  TALENT_SIGNAL: "#1D4ED8",
  UNVERIFIED: "#6B7280",
};

export function Module11Signals() {
  return (
    <>
      <ViewHero number="11" title="Señales Externas" subtitle="Clientes, empleados, talento"
        description="Señales clasificadas por independencia: Tier D (market/customer/employee signals) — usadas como señales, nunca como estimaciones poblacionales. Tier E (AI artifacts) — solo para descubrimiento, nunca como evidencia material." />
      <div className="space-y-8">
        <ViewSection eyebrow="Taxonomía de señales" title="Clasificación por tipo y tier">
          <Card>
            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div className="rounded-md border border-border p-2">
                <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: TYPE_COLORS.CUSTOMER_SIGNAL }}>CUSTOMER_SIGNAL</span>
                <p className="mt-1 text-xs text-muted-foreground">App store reviews, Reclame Aqui, social comments — señales de fricción, no estadísticas.</p>
              </div>
              <div className="rounded-md border border-border p-2">
                <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: TYPE_COLORS.TALENT_SIGNAL }}>TALENT_SIGNAL</span>
                <p className="mt-1 text-xs text-muted-foreground">LinkedIn job postings, Glassdoor — consistencia con inversión declarada.</p>
              </div>
              <div className="rounded-md border border-border p-2">
                <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: TYPE_COLORS.UNVERIFIED }}>UNVERIFIED</span>
                <p className="mt-1 text-xs text-muted-foreground">Fuentes ambiguas o sin evidencia reciente — logged for transparency.</p>
              </div>
            </div>
          </Card>
        </ViewSection>

        <ViewSection eyebrow="Registro de señales" title="Señales externas recolectadas">
          <div className="space-y-3">
            {EXTERNAL_SIGNALS.map((s) => (
              <Card key={s.signal}>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: TYPE_COLORS[s.type] ?? "#6B7280" }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm">{s.signal}</h3>
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: TYPE_COLORS[s.type] ?? "#6B7280" }}>{s.type.replace(/_/g, " ")}</span>
                      <TierBadge tier={s.tier as "A" | "B" | "C" | "D" | "E"} />
                      <span className="text-[10px] text-muted-foreground">Entity: {s.entity.replace(/_/g, " ")}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{s.content}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">Source: {s.source}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ViewSection>

        <ViewSection eyebrow="Reglas de uso" title="Cómo se tratan las señales Tier D/E">
          <Callout type="warn" title="Señales ≠ estimaciones poblacionales">
            Las señales Tier D (app stores, Reclame Aqui, redes sociales) se usan para <strong>detectar fricción y
            consistencia</strong>, nunca como estimaciones poblacionales. No se puede inferir "X% de clientes están
            insatisfechos" de reseñas de app store sin metodología de muestreo.
          </Callout>
          <Callout type="danger" title="Tier E — artefactos de IA (solo descubrimiento)">
            Los artefactos de IA públicos (Claude Artifacts, ChatGPT compartido) se usan <strong>únicamente</strong> para
            descubrir keywords, hipótesis, posibles iniciativas y nuevas aristas de investigación. <strong>Nunca</strong>
            como evidencia para un claim material. Si no se encuentra un artefacto útil, se registra
            NO_RELIABLE_PUBLIC_AI_ARTIFACT_FOUND y se continúa. No se fabrica.
          </Callout>
        </ViewSection>
      </div>
    </>
  );
}
