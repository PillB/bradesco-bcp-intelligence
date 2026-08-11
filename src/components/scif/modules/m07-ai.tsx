"use client";
import { ViewHero, ViewSection, Card, Grid, Callout, StatBlock } from "@/components/scif/view-shell";
import { EvidenceTag, SourcePill, ConfidenceMeter, ClaimRef, LifecycleTag } from "@/components/scif/evidence";
import { RADAR_VERSIONS, CLAIMS } from "@/lib/scif/data";
import { RadarChart } from "@/components/scif/tools/radar-chart";
import { BrainCircuit, Bot, MessageSquare, ShieldCheck, GitBranch, Database as DatabaseIcon, Cpu } from "lucide-react";
import { theme } from "@/lib/scif/theme";

export function Module07AI() {
  return (
    <>
      <ViewHero number="07" title="IA, Datos y Tecnologías Emergentes" subtitle="BIA, Bridge, GenAI, agentic, radar versionado"
        description="Capacidades de IA: BIA (asistente, PRODUCTION_SCALING), Bridge (plataforma GenAI, PRODUCTION). Radar de tecnología versionado (2022, 2024, 2026). Temas UNKNOWN (quantum, GNN, synthetic data) son PendingRecords explícitos." />
      <div className="space-y-8">
        <ViewSection eyebrow="Estado de IA" title="BIA y Bridge — núcleo de IA de Bradesco">
          <Grid>
            <Card>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h3 className="font-bold">BIA — Asistente virtual</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Lanzado en 2016 sobre IBM Watson; hoy 100% integrada con IA generativa.</p>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Usuarios en app:</span><span className="font-bold">24M+</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Retención 4T25:</span><span className="font-bold">90%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Reducción costo atención:</span><span className="font-bold">~40×</span></div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <LifecycleTag status="PRODUCTION_SCALING" />
                <EvidenceTag status="STRONGLY_SUPPORTED" />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground"><SourcePill sourceId="S03" /> <SourcePill sourceId="S05" /><ClaimRef claimId="C005" /></p>
            </Card>
            <Card>
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-6 w-6 text-primary" />
                <h3 className="font-bold">Bridge — Plataforma GenAI</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Plataforma corporativa de IA generativa. Centraliza documentos, voz, texto, asistentes y guardrails.</p>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Casos de uso en producción:</span><span className="font-bold">500+</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">A escala:</span><span className="font-bold">70</span></div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <LifecycleTag status="PRODUCTION" />
                <EvidenceTag status="STRONGLY_SUPPORTED" />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground"><SourcePill sourceId="S04" /> (fuente única — OQ03)<ClaimRef claimId="C006" /></p>
            </Card>
          </Grid>
          <Callout type="warn" title="Distinción de evidencia — BIA vs Bridge">
            BIA tiene <strong>consistencia multi-fuente</strong> (2016→2026, múltiples disclosures) — STRONGLY_SUPPORTED.
            Bridge tiene <strong>fuente primaria única</strong> (CTO feb-2026) — también STRONGLY_SUPPORTED, pero
            pendiente de corroboración independiente (OQ03). La cifra de "500 casos de uso" <strong>no debe usarse como
            benchmark objetivo</strong> para BCP sin reconciliación de definición.
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Arquitecturas agentic" title="Multi-agente y guardrails">
          <Grid>
            <Card>
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-sm">Multi-agent architectures</h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">La CTO mencionó servicios reutilizables multi-agente dentro de Bridge. No se discloseó escala específica de producción.</p>
              <div className="mt-2 flex items-center gap-2">
                <LifecycleTag status="EXPERIMENT_PILOT" />
                <EvidenceTag status="PARTIAL" />
                <ConfidenceMeter value={0.5} />
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-sm">AI observability / guardrails</h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Bridge descrito con guardrails centralizados de IA responsable. Sin detalle técnico disclosed.</p>
              <div className="mt-2 flex items-center gap-2">
                <LifecycleTag status="PRODUCTION" />
                <EvidenceTag status="PARTIAL" />
                <ConfidenceMeter value={0.6} />
              </div>
            </Card>
          </Grid>
        </ViewSection>

        <ViewSection eyebrow="Outcome metrics (OQ08)" title="Resultados medibles de IA — no solo comunicación">
          <Grid>
            <StatBlock label="Resolución al primer nivel" value="82%" sub="Bradesco + Azure AI (oct-2024)" accent="primary" />
            <StatBlock label="Retención digital" value="89%" sub="Bradesco + Azure AI (oct-2024)" accent="primary" />
            <StatBlock label="Reducción de rechazos (fraude)" value="-25%" sub="FICO Platform · 1B tx/mes" accent="primary" />
            <StatBlock label="NPS improvement (BCP)" value="+3 pts" sub="Credicorp 4Q25 — digital + IA" accent="teal" />
          </Grid>
          <Callout type="success" title="OQ08 parcialmente resuelto — outcomes reales en ambos bancos">
            La diferencia Bradesco vs BCP en IA <strong>no es solo comunicación</strong>. Bradesco tiene outcomes cuantificados
            (82% resolución, 89% retención, -25% rechazos fraude via FICO con 1B transacciones mensuales). BCP tiene NPS +3 puntos
            atribuido a digital + IA. Ambos bancos tienen resultados medibles — las métricas no son directamente comparables
            (resolution rate vs NPS), pero la hipótesis H1 (madurez real) y H2 (comunicación) están ambas parcialmente confirmadas.
            <span className="mt-1 block text-[10px] italic">Fuentes: Microsoft case study (S31), FICO case study (S32), Credicorp 4Q25 (S33). Vendor bias risk en S31/S32.</span>
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Visualización interactiva" title="Radar de tecnología — comparación versionada">
          <RadarChart />
        </ViewSection>

        <ViewSection eyebrow="Radar versionado" title="Historia del radar de tecnología (reconstruido)">
          <Callout type="info" title="Bradesco no publica un radar formal">
            Bradesco no publica un "Technology Radar" formal (estilo ThoughtWorks). Las versiones aquí están
            <strong> reconstruidas</strong> a partir de disclosures públicos (2022, 2024, 2026). Cada versión es un snapshot
            con fecha de evidencia explícita. Las comparaciones son siempre versión-a-versión, nunca una lista "actual" plana.
          </Callout>
          <div className="mt-4 space-y-4">
            {RADAR_VERSIONS.map((v) => (
              <Card key={v.version_id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{v.version_id.replace(/_/g, " ")}</h3>
                    <p className="text-xs text-muted-foreground">Evidence date: {v.evidence_date} · {v.source}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {v.technology_items.map((t) => {
                    const cfg = theme.lifecycle[t.maturity as keyof typeof theme.lifecycle] ?? theme.lifecycle.UNKNOWN;
                    return (
                      <div key={t.name} className="rounded-md border border-border p-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold">{t.name}</p>
                          <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-white" style={{ backgroundColor: cfg.color }}>{cfg.label}</span>
                        </div>
                        {t.changed_from && <p className="mt-1 text-[10px] text-sky-600">↑ {t.changed_from}</p>}
                        {t.note && <p className="mt-1 text-[10px] text-muted-foreground italic">{t.note}</p>}
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </ViewSection>

        <ViewSection eyebrow="Análisis de desaparición" title="Tecnologías que desaparecieron del radar">
          <Grid>
            <Card>
              <h3 className="font-bold text-sm">Watson-primary BIA</h3>
              <p className="mt-1 text-xs text-muted-foreground">Presente en RADAR_2022, ausente en 2024/2026.</p>
              <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                <strong>NOT_FAILURE</strong> — graduó a GenAI-integrated BIA. La plataforma evolucionó (Watson→GenAI), no desapareció.
              </div>
            </Card>
            <Card>
              <h3 className="font-bold text-sm">Bitz wallet</h3>
              <p className="mt-1 text-xs text-muted-foreground">Presente implícitamente en 2022, ausente en 2024/2026.</p>
              <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                <strong>SUNSET confirmado</strong> (cerrada 2023). Desaparición genuina.
              </div>
            </Card>
          </Grid>
          <Callout type="info" title="Principio del framework (technology-radar-versioning.md)">
            Una tecnología que desaparece de un radar posterior <strong>nunca se interpreta automáticamente como fracaso</strong>.
            Explicaciones alternativas que deben chequearse activamente: graduó a mainstream, fue renombrada, fusionada en categoría
            más amplia, su madurez cambió, fue depriorizada, o simplemente dejó de reportarse públicamente. Sin evidencia de una
            de estas, el status correcto es UNKNOWN, no FAILED.
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="PendingRecords" title="Tecnologías emergentes — UNKNOWN">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Quantum / QKD", icon: Cpu },
              { name: "GNN (fraude)", icon: GitBranch },
              { name: "Synthetic data", icon: DatabaseIcon },
              { name: "DLT / tokenization", icon: GitBranch },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <Card key={t.name}>
                  <Icon className="h-6 w-6 text-muted-foreground" />
                  <h3 className="mt-2 font-bold text-sm">{t.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">No hay evidencia pública específica de Bradesco en esta ronda.</p>
                  <div className="mt-2"><LifecycleTag status="UNKNOWN" /></div>
                </Card>
              );
            })}
          </div>
        </ViewSection>

        <ViewSection eyebrow="Claims de soporte" title="Trazabilidad">
          <div className="space-y-2">
            {CLAIMS.filter((c) => ["C005","C006","C007","C017"].includes(c.claim_id)).map((c) => (
              <Card key={c.claim_id}>
                <p className="text-sm font-medium">{c.claim}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <EvidenceTag status={c.evidence_status} />
                  <ConfidenceMeter value={c.confidence} />
                  {c.source_ids.map((s) => <SourcePill key={s} sourceId={s} />)}
                </div>
              </Card>
            ))}
          </div>
        </ViewSection>
      </div>
    </>
  );
}
