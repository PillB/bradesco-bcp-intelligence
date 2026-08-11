"use client";
import * as React from "react";
import { ViewHero, ViewSection, Card, Grid, StatBlock, Callout, EntityBadge, DossierLinkBanner } from "@/components/scif/view-shell";
import { EvidenceTag, ConfidenceMeter, SourcePill, ClaimRef } from "@/components/scif/evidence";
import { SCALE_ENTITIES, CLAIMS, OPEN_QUESTIONS, RECOMMENDATIONS, TECH_CAPABILITIES, INITIATIVES, SOURCES, PROJECT } from "@/lib/scif/data";
import { ExecutiveSummary } from "@/components/scif/tools/executive-summary";
import { TrendingUp, TrendingDown, AlertCircle, Brain, Cloud, Lightbulb, GitBranch, FileQuestion } from "lucide-react";

export function Module00Exec() {
  const bradesco = SCALE_ENTITIES[0];
  const bcp = SCALE_ENTITIES[2];
  const highPriorityOQ = OPEN_QUESTIONS.filter((o) => o.priority === "HIGH");
  const verifiedClaims = CLAIMS.filter((c) => c.evidence_status === "VERIFIED" || c.evidence_status === "INDEPENDENTLY_CORROBORATED").length;
  const prodTech = TECH_CAPABILITIES.filter((t) => t.maturity === "PRODUCTION" || t.maturity === "PRODUCTION_SCALING" || t.maturity === "MATURE").length;
  const unknownTech = TECH_CAPABILITIES.filter((t) => t.maturity === "UNKNOWN").length;
  const activeInitiatives = INITIATIVES.filter((i) => ["PRODUCTION","PRODUCTION_SCALING","MATURE","MATURE_PRODUCTION","INTEGRATED"].includes(i.lifecycle)).length;
  const sunsetInitiatives = INITIATIVES.filter((i) => i.lifecycle === "SUNSET").length;

  return (
    <>
      <ViewHero
        number="00"
        title="Centro de Comando Ejecutivo"
        subtitle="Visión consolidada del dossier estratégico"
        description={`Auditable strategic intelligence: Banco Bradesco S.A. (primario, Brasil) vs Banco de Crédito del Perú — BCP (comparador operativo), con Credicorp como comparador de grupo donde es analíticamente válido. Evidence as-of ${PROJECT.asOf}.`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            Veredicto: CONDITIONALLY_READY
          </span>
          <EntityBadge entity="BRADESCO" label="Bradesco" />
          <EntityBadge entity="BCP" label="BCP Perú" />
          <EntityBadge entity="CREDICORP" label="Credicorp (grupo)" />
        </div>
      </ViewHero>

      <div className="space-y-8">
        <ViewSection eyebrow="Exportable" title="Resumen ejecutivo — síntesis del dossier">
          <ExecutiveSummary />
        </ViewSection>

        <ViewSection eyebrow="Pregunta maestra" title="¿Qué es Bradesco hoy?">
          <Card>
            <p className="text-sm leading-relaxed text-foreground/90">
              Banco Bradesco S.A. es un banco múltiple brasileño con sede en Osasco (São Paulo), que opera bajo
              dos segmentos reportables: <strong>banca</strong> y <strong>seguros/previsión/capitalización</strong>. Al cierre de 2025,
              los activos totales consolidados bajo IFRS alcanzaron <strong>R$2,33 billones</strong> (trillion en nomenclatura anglosajona),
              con un resultado recurrente de <strong>R$24,7 mil millones</strong> (+26,1% a/a) y un ROAE de 4T25 de <strong>15,2%</strong> —
              la primera vez, según management, que dicho retorno supera el costo de capital de la entidad.
              <ClaimRef claimId="C001" /><ClaimRef claimId="C002" />
            </p>
            <div className="mt-4">
              <EvidenceTag status="VERIFIED" />
              <span className="ml-2 text-xs text-muted-foreground">Fuentes: 20-F + 6-K 4T25 (SEC EDGAR)</span>
            </div>
          </Card>
        </ViewSection>

        <ViewSection eyebrow="Scorecard de escala" title="Bradesco vs BCP — dimensiones clave">
          <Grid>
            <StatBlock label="Activos totales Bradesco" value="R$ 2,33 T" sub="+12,6% a/a · dic-2025" accent="primary" />
            <StatBlock label="Activos totales BCP" value="S/ 204,9 mm" sub="+3,8% a/a · dic-2025" accent="teal" />
            <StatBlock label="ROAE Bradesco (4T25)" value="15,2%" sub="Primera vez > costo de capital" accent="primary" />
            <StatBlock label="ROAE BCP (2025)" value="24,7%" sub="Costo de riesgo 2,13%→1,28%" accent="teal" />
            <StatBlock label="Índice eficiencia Bradesco" value="50%" sub="Meta: 40% en 2028" accent="gold" />
            <StatBlock label="Clientes digitales Bradesco" value="28 M" sub="19M (fin-2025) → 28M (1T26)" accent="primary" />
          </Grid>
          <div className="mt-3">
            <Callout type="warn" title="Gate de comparabilidad — bloqueante">
              La comparación de tamaño absoluto (R$2,33T vs S/204,9B) mezcla moneda (BRL vs PEN) y escala de mercado
              (PIB Brasil ≈ 10× Perú). Etiquetado <strong>NOT_DIRECTLY_COMPARABLE</strong> sin normalización. La comparación
              analíticamente defendible es de <strong>rentabilidad y eficiencia relativa dentro de cada mercado</strong>, no de tamaño absoluto.
            </Callout>
          </div>
        </ViewSection>

        <ViewSection eyebrow="Madurez tecnológica" title="Estado de IA, datos y cloud">
          <Grid>
            <Card>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="font-bold">BIA — Asistente IA</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">24M+ usuarios · 90% retención 4T25 · 100% GenAI</p>
              <div className="mt-2 flex items-center gap-2">
                <EvidenceTag status="STRONGLY_SUPPORTED" />
                <ConfidenceMeter value={0.85} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground"><SourcePill sourceId="S03" /> <SourcePill sourceId="S05" /></p>
            </Card>
            <Card>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Bridge — Plataforma GenAI</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">500+ casos de uso · 70 a escala · multiagente</p>
              <div className="mt-2 flex items-center gap-2">
                <EvidenceTag status="STRONGLY_SUPPORTED" />
                <ConfidenceMeter value={0.7} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground"><SourcePill sourceId="S04" /> (fuente única — OQ03)</p>
            </Card>
            <Card>
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Multicloud</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">35% cargas cloud (feb-2024) · cloud-first nuevos sistemas · Azure/AWS/Oracle</p>
              <div className="mt-2 flex items-center gap-2">
                <EvidenceTag status="STRONGLY_SUPPORTED" />
                <ConfidenceMeter value={0.75} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground"><SourcePill sourceId="S06" /></p>
            </Card>
          </Grid>
          <div className="mt-3">
            <Callout type="info" title="Radar de tecnología — versionado">
              Bradesco <strong>no publica un Technology Radar formal</strong> (estilo ThoughtWorks). Las versiones en este dossier
              están reconstruidas a partir de disclosures públicos (2022, 2024, 2026). {prodTech} capacidades en producción/maduras,
              {" "}{unknownTech} clasificadas UNKNOWN (PendingRecords: GNN, synthetic data, quantum/QKD, DLT/tokenization).
            </Callout>
          </div>
        </ViewSection>

        <ViewSection eyebrow="Ciclo de vida de iniciativas" title="Éxitos, integraciones, sunsets">
          <Grid>
            <StatBlock label="Iniciativas activas / integradas" value={String(activeInitiatives)} sub="Next, Digio, BIA, Bridge, Inovabra, Seguros" accent="primary" />
            <StatBlock label="Sunsets confirmados" value={String(sunsetInitiatives)} sub="Bitz (cerrada 2023 → Digio)" accent="primary" />
            <StatBlock label="Lanzamientos fallidos" value="0" sub="Silencio ≠ fracaso (principio del framework)" accent="muted" />
          </Grid>
          <div className="mt-3">
            <Callout type="success" title="Distinción crítica: INTEGRATED ≠ FAILED">
              Next fue reincorporado al banco matriz como segmento de atención (fines 2023-2024) — <strong>no es un sunset ni un fracaso</strong>.
              La marca y el app continúan operando y actualizados (Google Play, jun-2026). Bitz sí fue formalmente cerrada (SUNSET),
              con clientes migrados a Digio. Esta distinción es un requisito del framework: nunca clasificar silencio o
              reorganización como fracaso.
            </Callout>
          </div>
        </ViewSection>

        <ViewSection eyebrow="Comparación estratégica" title="Bradesco vs BCP — hipótesis alternativas">
          <Card>
            <p className="text-sm text-foreground/90">
              <strong>Observación:</strong> Bradesco comunica públicamente un volumen mayor de iniciativas de IA/tecnología
              (Bridge, BIA, 500+ casos de uso) que Credicorp para BCP en el mismo período.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-start gap-2"><span className="font-bold text-primary">H1</span><span>Madurez real superior (mayor inversión absoluta justificada por escala)</span></div>
              <div className="flex items-start gap-2"><span className="font-bold text-primary">H2</span><span>Diferencia de estilo de comunicación (NYSE vs IR peruano)</span></div>
              <div className="flex items-start gap-2"><span className="font-bold text-primary">H3</span><span>Mayor volumen de experimentación, no mejor conversión por unidad</span></div>
              <div className="flex items-start gap-2"><span className="font-bold text-primary">H4</span><span>Diferencias regulatorias (Open Finance obligatorio + Pix en Brasil)</span></div>
            </div>
            <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              No se encontró evidencia pública que permita discriminar concluyentemente entre H1–H4. Declaradas como OPEN_QUESTIONS (OQ08).
            </div>
          </Card>
        </ViewSection>

        <ViewSection eyebrow="Lecciones transferibles" title="Qué podría aprender BCP/Perú de Bradesco">
          <Grid>
            {RECOMMENDATIONS.slice(0, 3).map((r) => (
              <Card key={r.rec_id}>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">{r.rec_id}</p>
                <h3 className="mt-1 text-sm font-bold leading-snug">{r.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{r.audience}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-bold">{r.transferability.replace(/_/g, " ")}</span>
                  <ConfidenceMeter value={r.confidence} />
                </div>
              </Card>
            ))}
          </Grid>
        </ViewSection>

        <ViewSection eyebrow="Preguntas abiertas de alta prioridad" title="Qué falta por resolver">
          <div className="space-y-2">
            {highPriorityOQ.map((oq) => (
              <Card key={oq.oq_id}>
                <div className="flex items-start gap-3">
                  <FileQuestion className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{oq.oq_id}</span>
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">{oq.priority}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-foreground">{oq.question}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{oq.context}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ViewSection>

        <ViewSection eyebrow="Trazabilidad" title="Estado de la base de evidencia">
          <Grid>
            <StatBlock label="Total de fuentes registradas" value={String(SOURCES.length)} sub="Tier A: regulatorias + 20-F; Tier B: corporativas" accent="muted" />
            <StatBlock label="Claims verificadas / corroboradas" value={String(verifiedClaims)} sub={`de ${CLAIMS.length} claims totales`} accent="primary" />
            <StatBlock label="Clusters de independencia" value="12" sub="Detección de sindicación y circularidad" accent="gold" />
          </Grid>
          <DossierLinkBanner moduleId="00" />
        </ViewSection>

        <ViewSection>
          <Callout type="info" title="Independencia">
            {PROJECT.independence}
          </Callout>
        </ViewSection>
      </div>
    </>
  );
}
