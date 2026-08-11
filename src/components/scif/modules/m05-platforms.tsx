"use client";
import { ViewHero, ViewSection, Card, Grid, Callout } from "@/components/scif/view-shell";
import { EvidenceTag, LifecycleTag, SourcePill, ClaimRef } from "@/components/scif/evidence";
import { PLATFORMS, CLAIMS } from "@/lib/scif/data";

export function Module05Platforms() {
  return (
    <>
      <ViewHero number="05" title="Plataformas Digitales y Journeys" subtitle="Apps, wallets, asistentes, APIs"
        description="Mapa de plataformas: App Bradesco+BIA, Next, Digio, Bridge, Bradesco Seguros, Inovabra. BCP: App BCP+Yape, BCP Xplore, Krealo. Verificación de estado actual de marcas históricas (Next=INTEGRATED, Bitz=SUNSET)." />
      <div className="space-y-8">
        <ViewSection eyebrow="Mapa de plataformas" title="Estado actual de cada plataforma">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PLATFORMS.map((p) => (
              <Card key={p.name}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm">{p.name}</h3>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">{p.type}</p>
                  </div>
                  <LifecycleTag status={p.status} />
                </div>
                <div className="mt-3 space-y-1 text-xs">
                  <p><span className="font-semibold text-muted-foreground">Owner:</span> {p.owner.replace(/_/g, " ")}</p>
                  <p><span className="font-semibold text-muted-foreground">Cloud:</span> {p.cloud}</p>
                </div>
                <p className="mt-2 text-[11px] italic text-muted-foreground">{p.note}</p>
              </Card>
            ))}
          </div>
        </ViewSection>

        <ViewSection eyebrow="Caso crítico — Next" title="INTEGRATED ≠ FAILED">
          <Card>
            <h3 className="font-bold">Next — banco digital de Bradesco</h3>
            <p className="mt-2 text-sm text-foreground/90">
              Lanzado en junio de 2017 como el primer banco 100% digital de Bradesco dirigido a público joven.
              Formalmente reincorporado a la estructura operativa del banco matriz hacia fines de 2023-2024, pasando
              de operación separada a <strong>segmento de atención</strong> — una decisión estratégica explícita de la
              administración, <strong>no un fracaso comercial</strong>.
              <ClaimRef claimId="C010" />
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <LifecycleTag status="INTEGRATED" />
              <EvidenceTag status="INDEPENDENTLY_CORROBORATED" />
              <SourcePill sourceId="S03" />
              <SourcePill sourceId="S10" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              La marca y el app continúan operando y siendo actualizados (Google Play, última actualización junio 2026).
              Esto confirma que la reincorporación fue organizacional, no un cierre de producto.
            </p>
          </Card>
          <Callout type="success" title="Principio del framework: silencio ≠ fracaso">
            Una marca que desaparece de comunicaciones posteriores puede haber: graduado a mainstream, sido renombrada,
            fusionada, reposicionada, o simplemente dejó de reportarse públicamente. Antes de clasificar como FAILED,
            se exige evidencia activa de cierre. Next = INTEGRATED (decisión organizacional), no SUNSET.
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Caso crítico — Bitz" title="SUNSET confirmado">
          <Card>
            <h3 className="font-bold">Bitz — cartera digital de Bradesco</h3>
            <p className="mt-2 text-sm text-foreground/90">
              Lanzada en 2020, formalmente cerrada en 2023, con sus clientes migrados a Digio.
              Este es un caso <strong>SUNSET confirmado explícitamente por management</strong>, distinto del caso Next.
              <ClaimRef claimId="C011" />
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <LifecycleTag status="SUNSET" />
              <EvidenceTag status="INDEPENDENTLY_CORROBORATED" />
              <SourcePill sourceId="S03" />
              <SourcePill sourceId="S06" />
            </div>
          </Card>
        </ViewSection>

        <ViewSection eyebrow="Caso crítico — Digio" title="Subsidiaria 100% con infraestructura propia">
          <Card>
            <h3 className="font-bold">Digio — banco digital subsidiario</h3>
            <p className="mt-2 text-sm text-foreground/90">
              Adquirido en su totalidad en 2021-2022 (comprando el 49,99% que pertenecía a Banco do Brasil por R$625 millones).
              La administración declaró explícitamente su intención de mantenerlo como unidad independiente, con
              <strong> infraestructura en AWS separada de la de Next (Azure)</strong>.
              <ClaimRef claimId="C012" />
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <LifecycleTag status="PRODUCTION" />
              <EvidenceTag status="INDEPENDENTLY_CORROBORATED" />
              <SourcePill sourceId="S06" />
              <SourcePill sourceId="S01" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              La estrategia dual-cloud (Next/Azure + Digio/AWS) fue deliberada antes de la reincorporación de Next.
            </p>
          </Card>
        </ViewSection>

        <ViewSection eyebrow="Comparación BCP" title="Yape y BCP Xplore">
          <Grid>
            <Card>
              <h3 className="font-bold text-sm">Yape</h3>
              <p className="mt-1 text-xs text-muted-foreground">App de pagos que opera dentro del perímetro de BCP. Alcanzó rentabilidad antes de lo proyectado. Meta 2026: 16,5M usuarios activos y S/600 mil millones en transacciones anuales.</p>
              <div className="mt-2"><LifecycleTag status="PRODUCTION_SCALING" /></div>
            </Card>
            <Card>
              <h3 className="font-bold text-sm">BCP Xplore</h3>
              <p className="mt-1 text-xs text-muted-foreground">Unidad de Open Banking/APIs de BCP. Servicios de recaudación, pagos automáticos y financiamiento flexible exclusivos para clientes de ese programa.</p>
              <div className="mt-2"><LifecycleTag status="PRODUCTION" /></div>
            </Card>
          </Grid>
          <Callout type="warn" title="Estructuras distintas — no comparar directamente">
            Next = <strong>marca-dentro-banco</strong> (banco digital completo); Yape = <strong>app-de-pagos-dentro-BCP</strong>
            (producto de pagos, no banco completo). Compararlos como equivalentes es un error de perímetro. Ambos son
            apuestas digitales, pero en categorías distintas.
          </Callout>
        </ViewSection>

        <ViewSection eyebrow="Claims de soporte" title="Trazabilidad de plataformas">
          <div className="space-y-2">
            {CLAIMS.filter((c) => ["C005","C010","C011","C012","C015","C016"].includes(c.claim_id)).map((c) => (
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
