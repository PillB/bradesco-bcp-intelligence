"use client";
import { ViewHero, ViewSection, Card, Grid, Callout } from "@/components/scif/view-shell";
import { EvidenceTag, TierBadge, SourcePill, ConfidenceMeter, ClaimRef } from "@/components/scif/evidence";
import { SOURCES, CLAIMS, CONTRADICTIONS, OPEN_QUESTIONS } from "@/lib/scif/data";
import { ConfidenceDashboard } from "@/components/scif/tools/confidence-dashboard";
import { ClaimExplorer } from "@/components/scif/tools/claim-explorer";
import { FreshnessMonitor } from "@/components/scif/tools/freshness-monitor";
import { KnowledgeGraph } from "@/components/scif/tools/knowledge-graph";
import { EvidenceHeatmap } from "@/components/scif/tools/evidence-heatmap";
import { EvidenceScatter } from "@/components/scif/tools/evidence-scatter";
import * as React from "react";

export function Module16Sources() {
  const [tab, setTab] = React.useState<"sources" | "claims" | "contradictions" | "oq" | "genealogy">("sources");

  return (
    <>
      <ViewHero number="16" title="Fuentes, Claims, Contradicciones y Preguntas Abiertas" subtitle="Trazabilidad y genealogía"
        description="Source registry (17 fuentes), claim graph (17 claims), contradiction register (4), open questions (8), source genealogy (12 clusters de independencia). Trazabilidad completa del dossier." />
      <div className="space-y-8">
        <ViewSection eyebrow="Navegación" title="Explorador de evidencia">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "sources", label: `Fuentes (${SOURCES.length})` },
              { id: "claims", label: `Claims (${CLAIMS.length})` },
              { id: "contradictions", label: `Contradicciones (${CONTRADICTIONS.length})` },
              { id: "oq", label: `Preguntas abiertas (${OPEN_QUESTIONS.length})` },
              { id: "genealogy", label: "Genealogía (12 clusters)" },
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id as typeof tab)} className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${tab === t.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </ViewSection>

        <ViewSection eyebrow="Grafo de conocimiento" title="Visualización interactiva — Claims ↔ Fuentes">
          <KnowledgeGraph />
        </ViewSection>

        <ViewSection eyebrow="Dashboard" title="Confianza de evidencia — vista consolidada">
          <ConfidenceDashboard />
        </ViewSection>

        <ViewSection eyebrow="Monitor de frescura" title="Staleness de fuentes — detección de evidencia desactualizada">
          <FreshnessMonitor />
        </ViewSection>

        <ViewSection eyebrow="Scatter plot" title="Confianza × Diversidad de fuentes — calidad de evidencia">
          <EvidenceScatter />
        </ViewSection>

        <ViewSection eyebrow="Heatmap temporal" title="Densidad de evidencia por mes — patrón de publicación">
          <EvidenceHeatmap />
        </ViewSection>

        <ViewSection eyebrow="Explorador interactivo" title="Grafo de claims y fuentes">
          <ClaimExplorer />
        </ViewSection>

        {tab === "sources" && (
          <ViewSection title="Source Registry">
            <div className="space-y-2">
              {SOURCES.map((s) => (
                <Card key={s.source_id}>
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-sm font-bold text-primary">{s.source_id}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-sm">{s.publisher}</h3>
                        <TierBadge tier={s.source_tier} />
                        {s.entity_match && s.entity_match !== "CONFIRMED" && (
                          <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">{s.entity_match}</span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{s.original_origin}</p>
                      <p className="text-[11px] text-muted-foreground">Publicación: {s.publication_date} · Recuperado: {s.retrieved_at}</p>
                      <p className="text-[11px] text-muted-foreground">Cluster: <span className="font-mono">{s.independence_cluster}</span></p>
                      {s.notes && <p className="mt-1 text-[11px] italic text-foreground/70">{s.notes}</p>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ViewSection>
        )}

        {tab === "claims" && (
          <ViewSection title="Claim Graph">
            <div className="space-y-2">
              {CLAIMS.map((c) => (
                <Card key={c.claim_id}>
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-sm font-bold text-primary">{c.claim_id}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{c.claim}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <EvidenceTag status={c.evidence_status} />
                        <ConfidenceMeter value={c.confidence} />
                        <span className="text-[10px] text-muted-foreground">As-of: {c.as_of_date}</span>
                        <span className="text-[10px] text-muted-foreground">Entity: {c.entity.replace(/_/g, " ")}</span>
                      </div>
                      {c.evidence_excerpt && <p className="mt-2 rounded bg-muted/30 p-2 text-[11px] italic text-foreground/70">"{c.evidence_excerpt}"</p>}
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        <span className="text-[10px] font-semibold text-muted-foreground">Fuentes:</span>
                        {c.source_ids.map((s) => <SourcePill key={s} sourceId={s} />)}
                      </div>
                      {c.inference && <p className="mt-1 text-[11px] text-muted-foreground"><strong>Inferencia:</strong> {c.inference}</p>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ViewSection>
        )}

        {tab === "contradictions" && (
          <ViewSection title="Contradiction Register">
            <div className="space-y-2">
              {CONTRADICTIONS.map((ct) => (
                <Card key={ct.ct_id}>
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-sm font-bold text-primary">{ct.ct_id}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">{ct.type.replace(/_/g, " ")}</span>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold">{ct.status.replace(/_/g, " ")}</span>
                      </div>
                      <p className="mt-2 text-sm">{ct.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        <span className="text-[10px] font-semibold text-muted-foreground">Claims:</span>
                        {ct.claim_ids.map((c) => <ClaimRef key={c} claimId={c} />)}
                      </div>
                      <p className="mt-2 rounded bg-muted/30 p-2 text-[11px] text-foreground/70"><strong>Resolución:</strong> {ct.resolution_note}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ViewSection>
        )}

        {tab === "oq" && (
          <ViewSection title="Open Questions Register">
            <div className="space-y-2">
              {OPEN_QUESTIONS.map((oq) => (
                <Card key={oq.oq_id}>
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-sm font-bold text-primary">{oq.oq_id}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${oq.priority === "HIGH" ? "bg-red-500" : oq.priority === "MEDIUM" ? "bg-amber-500" : "bg-gray-500"}`}>{oq.priority}</span>
                      </div>
                      <p className="mt-2 text-sm font-medium">{oq.question}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{oq.context}</p>
                      <p className="mt-2 rounded bg-muted/30 p-2 text-[11px] text-foreground/70"><strong>Resolvería:</strong> {oq.what_would_resolve}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ViewSection>
        )}

        {tab === "genealogy" && (
          <ViewSection title="Source Genealogy — Independence Clusters">
            <Callout type="info" title="Diez sitios repitiendo un press release son UN origen">
              La genealogía de fuentes previene confundir sindicación con corroboración. Una claim es
              INDEPENDENTLY_CORROBORATED solo cuando está soportada por fuentes en <strong>dos o más clusters distintos</strong>,
              al menos uno de Tier A o B.
            </Callout>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {Array.from(new Set(SOURCES.map((s) => s.independence_cluster))).map((cluster) => {
                const sources = SOURCES.filter((s) => s.independence_cluster === cluster);
                return (
                  <Card key={cluster}>
                    <p className="font-mono text-xs font-bold text-primary">{cluster}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{sources.length} fuente(s) · tiers: {sources.map((s) => s.source_tier).join(", ")}</p>
                    <div className="mt-2 space-y-1">
                      {sources.map((s) => (
                        <div key={s.source_id} className="flex items-center gap-1 text-[11px]">
                          <span className="font-mono font-bold">{s.source_id}</span>
                          <span className="text-muted-foreground">— {s.publisher}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </ViewSection>
        )}

        <ViewSection>
          <Callout type="info" title="Independencia y alcance metodológico">
            Este dossier aplica los principios de resolución de entidades, jerarquía de fuentes, gate de comparabilidad y
            calibración de confianza del framework SCIF. Donde la evidencia pública es insuficiente, se declara UNKNOWN en
            lugar de inferir. Ver docs/framework/ para la metodología completa.
          </Callout>
        </ViewSection>
      </div>
    </>
  );
}
