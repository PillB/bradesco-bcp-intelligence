"use client";
import { ViewHero, ViewSection, Card, Grid, Callout } from "@/components/scif/view-shell";
import { ContextTooltip } from "@/components/scif/context-tooltip";
import { EvidenceTag, LifecycleTag, SourcePill } from "@/components/scif/evidence";
import { ShieldCheck, Lock, Fingerprint, Scale, AlertTriangle } from "lucide-react";
import { RiskHeatmap } from "@/components/scif/tools/risk-heatmap";

export function Module12Risk() {
  return (
    <>
      <ViewHero number="12" title="Riesgo, Regulación, Cyber y Resiliencia" subtitle="Fraude, AML, identidad digital"
        description="Marco regulatorio: Brasil (BACEN, Open Finance obligatorio, Pix) vs Perú (SBS). Capacidades de fraude, AML, cyber, identidad digital. Algunos temas (GNN, synthetic data, quantum) son PendingRecords." />
      <div className="space-y-8">
        <ViewSection eyebrow="Marco regulatorio" title="Brasil vs Perú — diferencia estructural">
          <Grid>
            <Card>
              <ShieldCheck className="h-6 w-6 text-[#B91C3C]" />
              <h3 className="mt-2 font-bold text-sm">Brasil — BACEN</h3>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>• Open Finance obligatorio (desde 2021)</li>
                <li>• Pix — instant payments nacional (2020, maduro)</li>
                <li>• Sandbox regulatorio para cryptoassets</li>
                <li>• Biometría facial requerida para consent Open Finance</li>
              </ul>
              <div className="mt-2"><LifecycleTag status="MATURE" /></div>
            </Card>
            <Card>
              <ShieldCheck className="h-6 w-6 text-[#0F766E]" />
              <h3 className="mt-2 font-bold text-sm">Perú — SBS / SMV</h3>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>• SBS — superintendencia de banca</li>
                <li>• Open Banking en desarrollo</li>
                <li>• Yape como equivalente de facto de instant payments</li>
                <li>• Marco menos maduro que Brasil (H4)</li>
              </ul>
            </Card>
          </Grid>
          <Callout type="info" title="Diferencia regulatoria explica parte de la brecha (H4)">
            Brasil tiene un ecosistema de Open Finance y Pix más maduro y de adopción obligatoria más temprana que el marco
            peruano. Esto genera más casos de uso digital observables independientemente de la capacidad interna relativa
            de cada organización. H4 está PARTIALLY_SUPPORTED.
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Identidad digital y biometría" title="Capacidades — Bradesco (VERIFICADO)">
          <Grid>
            <Card>
              <Fingerprint className="h-6 w-6 text-primary" />
              <h3 className="mt-2 font-bold text-sm">Biometría facial + voz</h3>
              <p className="mt-1 text-xs text-muted-foreground">ATMs con biometría facial, Fone Fácil (reconocimiento de voz), biometria por voz en app. Confirmado por sitio oficial de seguridad.</p>
              <div className="mt-2 flex items-center gap-2">
                <LifecycleTag status="PRODUCTION" />
                <EvidenceTag status="VERIFIED" />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">UPGRADE from INFERRED → VERIFIED. Fuente: S34 (seguranca.bradesco.com.br).</p>
            </Card>
            <Card>
              <Lock className="h-6 w-6 text-primary" />
              <h3 className="mt-2 font-bold text-sm">Cyber / resilience</h3>
              <p className="mt-1 text-xs text-muted-foreground">No se encontró evidencia pública específica de Bradesco en esta ronda.</p>
              <div className="mt-2"><LifecycleTag status="UNKNOWN" /></div>
            </Card>
          </Grid>
        </ViewSection>

        <ViewSection eyebrow="Fraude y AML" title="Capacidades — FICO Platform en producción">
          <Grid>
            <Card>
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
              <h3 className="mt-2 font-bold text-sm">FICO Platform — fraude</h3>
              <p className="mt-1 text-xs text-muted-foreground">Bradesco implementó FICO Platform para detección de fraude. <strong>1B transacciones mensuales</strong>, <strong>-25% rechazos</strong>.</p>
              <div className="mt-2 flex items-center gap-2">
                <LifecycleTag status="PRODUCTION" />
                <EvidenceTag status="STRONGLY_SUPPORTED" />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">Fuente: S32 (FICO case study). Vendor bias risk pero métricas cuantificadas.</p>
            </Card>
            <Card>
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <h3 className="mt-2 font-bold text-sm">GNN (Graph Neural Networks) para fraude</h3>
              <p className="mt-1 text-xs text-muted-foreground">Común en bancos grandes para detección de fraude por red. No se verificó claim público específico de Bradesco en esta ronda.</p>
              <div className="mt-2"><LifecycleTag status="UNKNOWN" /></div>
            </Card>
            <Card>
              <Scale className="h-6 w-6 text-primary" />
              <h3 className="mt-2 font-bold text-sm">AML</h3>
              <p className="mt-1 text-xs text-muted-foreground">Requisito regulatorio en ambos países. No se profundizó en capacidades específicas de Bradesco/BCP en esta ronda.</p>
              <div className="mt-2"><LifecycleTag status="UNKNOWN" /></div>
            </Card>
          </Grid>
          <Callout type="warn" title="PendingRecords — riesgo y cyber">
            Los temas de cyber resilience, AML capabilities específicas, y GNN para fraude no fueron investigados en
            profundidad en esta ronda por restricción de alcance (OQ07). Clasificados UNKNOWN — no inferir presencia ni
            ausencia.
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Heatmap de riesgos" title="Matriz Probabilidad × Impacto — riesgos mapeados">
          <RiskHeatmap />
        </ViewSection>

        <ViewSection eyebrow="Open Finance / Open Banking" title="Capacidades comparadas">
          <Grid>
            <Card>
              <h3 className="font-bold text-sm">Bradesco — Open Finance Brasil</h3>
              <p className="mt-1 text-xs text-muted-foreground">Participante obligatorio del framework BACEN. APIs de datos de cliente, cuentas, transacciones.</p>
              <div className="mt-2"><LifecycleTag status="MATURE" /></div>
            </Card>
            <Card>
              <h3 className="font-bold text-sm">BCP — BCP Xplore</h3>
              <p className="mt-1 text-xs text-muted-foreground">Unidad de Open Banking/APIs propia. Recaudación, pagos automáticos, financiamiento flexible.</p>
              <div className="mt-2"><LifecycleTag status="PRODUCTION" /></div>
              <p className="mt-2 text-[10px] text-muted-foreground"><SourcePill sourceId="S15" /></p>
            </Card>
          </Grid>
        </ViewSection>
      </div>
    </>
  );
}
