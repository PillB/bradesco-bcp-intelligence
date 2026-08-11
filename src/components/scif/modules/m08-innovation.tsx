"use client";
import { ViewHero, ViewSection, Card, Grid, Callout, StatBlock } from "@/components/scif/view-shell";
import { ContextTooltip } from "@/components/scif/context-tooltip";
import { EvidenceTag, SourcePill, LifecycleTag, ClaimRef } from "@/components/scif/evidence";
import { CLAIMS } from "@/lib/scif/data";
import { Lightbulb, Building, Users, FlaskConical } from "lucide-react";

export function Module08Innovation() {
  return (
    <>
      <ViewHero number="08" title="Innovación, I+D y Open Innovation" subtitle="Inovabra, cartera disruptiva, Krealo"
        description="BCP (Banco de Crédito del Perú). Comparación de modelos de innovación: Inovabra (habitat abierto, co-innovación física) vs Credicorp (cartera de iniciativas disruptivas con métricas de venture). Estructuras distintas — no comparables como el mismo instrumento." />
      <div className="space-y-8">
        <ViewSection eyebrow="Modelo Bradesco" title="Inovabra habitat — co-innovación abierta">
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#B08D57] text-white">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">Inovabra habitat</h3>
                <p className="text-xs text-muted-foreground">Espacio físico de co-innovación · São Paulo · 22.000 m² · operado con WeWork desde feb-2018</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatBlock label="Startups conectadas (2026)" value="230" sub="190 en 2019" accent="gold" />
              <StatBlock label="Empresas (2026)" value="80" sub="~70 en 2019" accent="gold" />
              <StatBlock label="Hubs (2026)" value="8" accent="gold" />
              <StatBlock label="Visitantes 2019" value="65.000" accent="muted" />
            </div>
            <div className="mt-3">
              <LifecycleTag status="MATURE_PRODUCTION" />
              <EvidenceTag status="VERIFIED" />
              <span className="ml-2 text-xs text-muted-foreground"><SourcePill sourceId="S08" /> <SourcePill sourceId="S09" /><ClaimRef claimId="C009" /></span>
            </div>
          </Card>
          <Callout type="info" title="Curaduría — plataforma de escalamiento, no incubadora">
            Inovabra exige que las startups admitidas <strong>ya tengan producto y servicio maduro en el mercado</strong>.
            Es decir, opera como plataforma de escalamiento comercial más que como incubadora temprana.
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Modelo Credicorp" title="Cartera de iniciativas disruptivas + Krealo">
          <Grid>
            <Card>
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-[#0F766E]" />
                <h3 className="font-bold text-sm">Cartera disruptiva</h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Yape, Tenpo, Culqi, iO — gestionadas como cartera de venture capital corporativo con métricas de contribución a ingresos.</p>
              <div className="mt-3 rounded-md border border-teal-200 bg-teal-50 p-2 dark:border-teal-800 dark:bg-teal-950/30">
                <p className="text-xs text-teal-700 dark:text-teal-300"><strong>Meta 2026:</strong> 10% de los ingresos ajustados por riesgo del grupo</p>
                <p className="text-xs text-teal-700 dark:text-teal-300">Yape: 65% de los ingresos de disrupción</p>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground"><SourcePill sourceId="S12" /><ClaimRef claimId="C015" /></p>
            </Card>
            <Card>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#0F766E]" />
                <h3 className="font-bold text-sm"><ContextTooltip term="KREALO">Krealo</ContextTooltip></h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Fondo de venture corporativo del grupo, con enfoque "hands-on" tipo VC y salidas estructuradas.</p>
              <p className="mt-2 text-[11px] text-muted-foreground"><SourcePill sourceId="S14" /></p>
            </Card>
            <Card>
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-[#0F766E]" />
                <h3 className="mt-2 font-bold text-sm">BCP Xplore</h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Unidad de Open Banking/APIs de BCP. Recaudación, pagos automáticos, financiamiento flexible exclusivos para clientes del programa.</p>
              <p className="mt-2 text-[11px] text-muted-foreground"><SourcePill sourceId="S15" /></p>
            </Card>
            <Card>
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-[#0F766E]" />
                <h3 className="mt-2 font-bold text-sm">CIX — Centro de Innovación del BCP</h3>
                <span className="ml-auto rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">ACTIVO · RESUELTO</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Laboratorio interno del BCP con <strong>más de una década</strong> de operación. Proceso: Exploración → Ideación → Creación. #InnovationDay2025.</p>
              <div className="mt-2 flex items-center gap-2">
                <LifecycleTag status="MATURE_PRODUCTION" />
                <EvidenceTag status="INDEPENDENTLY_CORROBORATED" />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground"><SourcePill sourceId="S36" /> <SourcePill sourceId="S37" /> · C025 · OQ06 RESUELTO</p>
              <p className="mt-1 text-[10px] italic text-emerald-600">UPGRADE: CIX no es un proyecto histórico de GitHub — es un centro de innovación activo, comparable con Inovabra habitat.</p>
            </Card>
          </Grid>
        </ViewSection>

        <ViewSection eyebrow="Comparación de modelos" title="Inovabra (habitat) vs Credicorp (portfolio) — categoría distinta">
          <Card>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="font-bold text-sm text-[#B91C3C]">Inovabra — Habitat abierto</h4>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• Espacio físico de co-innovación</li>
                  <li>• Startups externas con producto maduro</li>
                  <li>• Co-innovación con corporaciones (80 empresas)</li>
                  <li>• Métrica: participantes + contratos firmados</li>
                  <li>• No hay ROI agregado público (OQ02)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0F766E]">Credicorp — Cartera de venture</h4>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• Iniciativas internas semi-independientes</li>
                  <li>• Yape/Tenpo/Culqi/iO con P&L propio</li>
                  <li>• Métrica: contribución a ingresos del grupo</li>
                  <li>• Meta explícita: 10% revenue ajustado 2026</li>
                  <li>• Krealo como fondo de venture dedicado</li>
                </ul>
              </div>
            </div>
          </Card>
          <Callout type="danger" title="Error de categoría — no comparar como el mismo instrumento">
            Comparar Inovabra (habitat) y la cartera disruptiva de Credicorp (portfolio) como "cuál innova más" es un
            <strong> error de categoría</strong>. Son respuestas a contextos de mercado distintos, con métricas de éxito
            distintas. No hay evidencia comparativa de retorno que permita recomendar la transferencia de un modelo sobre el otro.
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="SIGNAL → SCALE" title="Funnel de innovación — ambos modelos">
          <Card>
            <div className="space-y-3">
              {[
                { stage: "SIGNAL", bradesco: "Inovabra habitat curation; startups con producto maduro", credicorp: "Krealo scouting; BCP Xplore API ecosystem" },
                { stage: "RESEARCH", bradesco: "Equipos internos; método BTRL no públicamente formalizado (OQ05)", credicorp: "Equipos de producto por iniciativa" },
                { stage: "EXPERIMENT", bradesco: "Bridge sandbox para GenAI use cases", credicorp: "Cada iniciativa corre semi-independiente" },
                { stage: "PILOT", bradesco: "BIA evolution; Bridge 500+ use cases (70 a escala)", credicorp: "Yape alcanzó rentabilidad antes de lo proyectado" },
                { stage: "PRODUCTION", bradesco: "Bridge centralized; BIA 24M usuarios", credicorp: "Yape a escala; BCP Xplore APIs en producción" },
                { stage: "SCALE", bradesco: "Tech +22% 2025; 10.500 profesionales", credicorp: "Meta 10% ingresos ajustados 2026" },
              ].map((s) => (
                <div key={s.stage} className="grid grid-cols-[100px_1fr_1fr] items-start gap-2 border-l-2 border-primary/30 pl-3">
                  <span className="font-mono text-xs font-bold text-primary">{s.stage}</span>
                  <span className="text-xs text-muted-foreground"><strong className="text-[#B91C3C]">BRA:</strong> {s.bradesco}</span>
                  <span className="text-xs text-muted-foreground"><strong className="text-[#0F766E]">BCP:</strong> {s.credicorp}</span>
                </div>
              ))}
            </div>
          </Card>
        </ViewSection>

        <ViewSection eyebrow="Open Question" title="BTRL / readiness method">
          <Callout type="warn" title="OQ05 — ¿Existe un método BTRL formal en Bradesco?">
            El prompt maestro asume BTRL/readiness. No se encontró evidencia pública de un radar formal o método de
            evaluación de madurez tecnológica publicado por Bradesco en esta ronda. Los grados de madurez en este dossier
            son <strong>inferidos</strong> de disclosures ejecutivos, no de un método publicado. Pendiente de documentación oficial.
          </Callout>
        </ViewSection>
      </div>
    </>
  );
}
