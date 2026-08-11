"use client";
import { ViewHero, ViewSection, Card, Grid, Callout, StatBlock } from "@/components/scif/view-shell";
import { EvidenceTag, SourcePill, ConfidenceMeter, ClaimRef } from "@/components/scif/evidence";
import { TECH_CAPABILITIES, CLAIMS } from "@/lib/scif/data";
import { TechHeatmap } from "@/components/scif/tools/tech-heatmap";
import { Cloud, Database, Server, GitBranch, Cpu } from "lucide-react";
import { theme } from "@/lib/scif/theme";

export function Module06Tech() {
  return (
    <>
      <ViewHero number="06" title="Arquitectura Tecnológica" subtitle="Multicloud, datos, ingeniería"
        description="Estrategia multicloud declarada feb-2024 (cloud-first para sistemas nuevos; legado migrado solo por necesidad). Migración híbrida del entorno analítico Teradata→Azure (400+ TB, QueryGrid). Métricas de productividad de ingeniería auto-reportadas." />
      <div className="space-y-8">
        <ViewSection eyebrow="Estrategia cloud" title="Multicloud declarada (feb-2024)">
          <Grid>
            <Card>
              <Cloud className="h-6 w-6 text-sky-500" />
              <h3 className="mt-2 font-bold text-sm">Microsoft Azure</h3>
              <p className="mt-1 text-xs text-muted-foreground">Next (banco digital) + entorno analítico (migración Teradata→Azure)</p>
              <p className="mt-2 text-[11px] text-muted-foreground"><SourcePill sourceId="S06" /></p>
            </Card>
            <Card>
              <Cloud className="h-6 w-6 text-amber-500" />
              <h3 className="mt-2 font-bold text-sm">Amazon Web Services</h3>
              <p className="mt-1 text-xs text-muted-foreground">Digio y (anteriormente) Bitz — infraestructura deliberadamente separada</p>
              <p className="mt-2 text-[11px] text-muted-foreground"><SourcePill sourceId="S06" /></p>
            </Card>
            <Card>
              <Cloud className="h-6 w-6 text-red-500" />
              <h3 className="mt-2 font-bold text-sm">Oracle Cloud</h3>
              <p className="mt-1 text-xs text-muted-foreground">Bradesco Seguros — brazo de seguros con ROAE 21,9%</p>
              <p className="mt-2 text-[11px] text-muted-foreground"><SourcePill sourceId="S06" /></p>
            </Card>
            <Card>
              <Cloud className="h-6 w-6 text-blue-500" />
              <h3 className="mt-2 font-bold text-sm">Banco matriz (mixed)</h3>
              <p className="mt-1 text-xs text-muted-foreground">Azure + IBM + AWS combinados para el banco matriz</p>
              <p className="mt-2 text-[11px] text-muted-foreground"><SourcePill sourceId="S06" /></p>
            </Card>
          </Grid>
          <Callout type="info" title="Cloud-first pragmático, no 100% cloud">
            Bradesco declaró que los sistemas nuevos nacen "cloud-first" (100% en la nube), pero el legado de 80 años de
            operación <strong>no se migra salvo necesidad efectiva de negocio</strong>. En feb-2024, 35% de las cargas de
            trabajo ya estaban en la nube. No hay fecha objetivo pública de "100% cloud" — cualquier afirmación en ese
            sentido sería HYPOTHESIS, no VERIFIED.<ClaimRef claimId="C008" />
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Arquitectura de datos" title="Migración híbrida Teradata → Azure">
          <Card>
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-orange-500" />
              <div>
                <h3 className="font-bold">QueryGrid — virtualización de datos on-premise ↔ cloud</h3>
                <p className="text-xs text-muted-foreground">Caso de estudio Teradata / Possible event (jul-2025)</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatBlock label="Datos migrados" value="400+ TB" accent="primary" />
              <StatBlock label="Tablas migradas" value="190.000" accent="primary" />
              <StatBlock label="Modelo" value="Híbrido" sub="on-prem + Azure" accent="gold" />
              <StatBlock label="Capa" value="QueryGrid" sub="virtualización" accent="gold" />
            </div>
            <div className="mt-3">
              <EvidenceTag status="STRONGLY_SUPPORTED" />
              <span className="ml-2 text-xs text-muted-foreground"><SourcePill sourceId="S07" /> (vendor case study — sesgo promocional)</span>
            </div>
          </Card>
          <Callout type="warn" title="Vendor case study dependence">
            La evidencia de la migración proviene de un caso de estudio de Teradata (Tier B, vendor). Existe sesgo
            promocional inherente. Debe leerse como tal y, para claims materiales, corroborarse con evidencia del lado
            de Bradesco (no encontrada en esta ronda).
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Capacidad de ingeniería" title="Inversión y talento tecnológico">
          <Grid>
            <StatBlock label="Inversión tech 2025" value="+22%" sub="vs 2024" accent="primary" />
            <StatBlock label="Inversión tech 2026 (proy.)" value="+16%" sub="vs 2025" accent="primary" />
            <StatBlock label="Profesionales de tecnología" value="10.500" sub="~6.500 internos" accent="primary" />
            <StatBlock label="Desarrolladores" value="+35%" sub="desde 2024" accent="primary" />
          </Grid>
          <Card>
            <h3 className="font-bold text-sm">Productividad de ingeniería (auto-reportada)</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                <p className="text-xs text-muted-foreground">Lead time de desarrollo</p>
                <p className="text-2xl font-black text-emerald-600">-43%</p>
                <p className="text-[11px] text-muted-foreground">fin-2025 vs fin-2023</p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                <p className="text-xs text-muted-foreground">Volumen de features de negocio</p>
                <p className="text-2xl font-black text-emerald-600">+118%</p>
                <p className="text-[11px] text-muted-foreground">fin-2025 vs fin-2023</p>
              </div>
            </div>
            <div className="mt-3">
              <EvidenceTag status="STRONGLY_SUPPORTED" />
              <ConfidenceMeter value={0.65} />
              <span className="ml-2 text-xs text-muted-foreground"><SourcePill sourceId="S04" /> — auto-reportado, sin auditoría externa, sin definición de baseline<ClaimRef claimId="C017" /></span>
            </div>
          </Card>
        </ViewSection>

        <ViewSection eyebrow="Herramienta interactiva" title="Heatmap de capacidades tecnológicas">
          <TechHeatmap />
          <div className="mt-3">
          <Callout type="warn" title="PendingRecords — tecnologías UNKNOWN">
            GNN (fraude), datos sintéticos, quantum/QKD, y DLT/tokenization están clasificados UNKNOWN. No hay evidencia
            pública específica de Bradesco en esta ronda. <strong>Silencio no es evidencia de ausencia</strong> — estos temas
            quedan como PendingRecords (OQ07) para futuras rondas de investigación.
          </Callout>
          </div>
        </ViewSection>

        <ViewSection eyebrow="Claims de soporte" title="Trazabilidad">
          <div className="space-y-2">
            {CLAIMS.filter((c) => ["C007","C008","C017"].includes(c.claim_id)).map((c) => (
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
