"use client";
import { ViewHero, ViewSection, Card, Grid, Callout, EntityBadge } from "@/components/scif/view-shell";
import { ContextTooltip } from "@/components/scif/context-tooltip";
import { EvidenceTag, SourcePill, ClaimRef } from "@/components/scif/evidence";
import { SEGMENTS, CHANNELS, CLAIMS } from "@/lib/scif/data";

export function Module03Customers() {
  return (
    <>
      <ViewHero number="03" title="Clientes, Segmentos y Canales" subtitle="Mapa de segmentos y canales"
        description="BACEN = Banco Central do Brasil (regulador bancario brasileño). Segmentos (retail, affluent, private, SME, corporate, digital-native, microfinanzas, seguros) y canales (sucursales, app, WhatsApp, BIA, ATMs, Open Finance, Pix/Yape). Comparación estructural Bradesco vs BCP." />
      <div className="space-y-8">
        <ViewSection eyebrow="Mapa de segmentos" title="Bradesco vs BCP — por segmento de cliente">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-3 py-2 font-semibold">Segmento</th>
                  <th className="px-3 py-2 font-semibold">Bradesco</th>
                  <th className="px-3 py-2 font-semibold">BCP</th>
                  <th className="px-3 py-2 font-semibold">Nota comparativa</th>
                </tr>
              </thead>
              <tbody>
                {SEGMENTS.map((s) => (
                  <tr key={s.name} className="border-b border-border/50 align-top">
                    <td className="px-3 py-2 font-medium">{s.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{s.bradesco}</td>
                    <td className="px-3 py-2 text-muted-foreground">{s.bcp}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground italic">{s.note ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ViewSection>

        <ViewSection eyebrow="Señal de escala digital" title="Clientes plenamente digitales — Bradesco">
          <Grid>
            <Card>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Fin-2025</p>
              <p className="mt-1 text-3xl font-black text-primary">19 M</p>
              <p className="text-xs text-muted-foreground">clientes plenamente digitales</p>
            </Card>
            <Card>
              <p className="text-xs font-semibold uppercase text-muted-foreground">1T26</p>
              <p className="mt-1 text-3xl font-black text-primary">28 M</p>
              <p className="text-xs text-muted-foreground">+47% en un trimestre (auto-reportado)</p>
            </Card>
            <Card>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Comparación</p>
              <p className="mt-1 text-sm font-bold text-foreground">Yape meta 2026: 16,5M</p>
              <p className="text-xs text-muted-foreground">Definición de 'digital customer' no reconciliada — NOT_DIRECTLY_COMPARABLE</p>
            </Card>
          </Grid>
          <Callout type="warn" title="Definición no reconciliada">
            La cifra de Bradesco (28M) usa la definición interna de Bradesco de 'cliente plenamente digital'. La meta de Yape
            (16,5M usuarios activos) usa la definición de Credicorp. <strong>No son comparables sin reconciliación de definición</strong>
            (¿qué cuenta como 'digital'? ¿activo mensual? ¿transaccional?).<ClaimRef claimId="C016" />
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Mapa de canales" title="Bradesco vs BCP — por canal de atención">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-3 py-2 font-semibold">Canal</th>
                  <th className="px-3 py-2 font-semibold">Bradesco</th>
                  <th className="px-3 py-2 font-semibold">BCP</th>
                </tr>
              </thead>
              <tbody>
                {CHANNELS.map((c) => (
                  <tr key={c.channel} className="border-b border-border/50 align-top">
                    <td className="px-3 py-2 font-medium whitespace-nowrap">{c.channel}</td>
                    <td className="px-3 py-2 text-muted-foreground">{c.bradesco}</td>
                    <td className="px-3 py-2 text-muted-foreground">{c.bcp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ViewSection>

        <ViewSection eyebrow="Comparación estructural" title="Diferencias de infraestructura de mercado">
          <Grid>
            <Card>
              <EntityBadge entity="BRADESCO" />
              <h3 className="mt-2 font-bold text-sm">Brasil: infraestructura madura obligatoria</h3>
              <p className="mt-1 text-xs text-muted-foreground">Open Finance obligatorio (BACEN, desde 2021); Pix (instant payments nacional, 2020). Genera casos de uso digital observables independientemente de la capacidad interna.</p>
            </Card>
            <Card>
              <EntityBadge entity="BCP" />
              <h3 className="mt-2 font-bold text-sm">Perú: marco menos maduro</h3>
              <p className="mt-1 text-xs text-muted-foreground">Open Banking peruano en desarrollo; Yape como equivalente de facto de instant payments pero no como sistema nacional obligatorio. Diferencia regulatoria, no de capacidad.</p>
            </Card>
          </Grid>
          <Callout type="info" title="Hipótesis H4 — diferencia regulatoria">
            Parte de la brecha observada en casos de uso digital puede explicarse por la madurez del marco regulatorio brasileño
            (H4), no solo por la capacidad interna relativa de cada organización. Esta hipótesis está PARTIALLY_SUPPORTED.
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Claims de soporte" title="Trazabilidad">
          <div className="space-y-2">
            {CLAIMS.filter((c) => ["C016"].includes(c.claim_id)).map((c) => (
              <Card key={c.claim_id}>
                <p className="text-sm font-medium">{c.claim}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <EvidenceTag status={c.evidence_status} />
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
