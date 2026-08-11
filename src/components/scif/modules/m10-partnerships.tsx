"use client";
import { ViewHero, ViewSection, Card, Grid, Callout } from "@/components/scif/view-shell";
import { EvidenceTag, SourcePill } from "@/components/scif/evidence";
import { PARTNERSHIPS } from "@/lib/scif/data";

function evidenceList(e: string | string[]): string[] {
  if (Array.isArray(e)) return e;
  return e.split(",").map((s) => s.trim()).filter(Boolean);
}

export function Module10Partnerships() {
  return (
    <>
      <ViewHero number="10" title="Alianzas, Startups y Adquisiciones" subtitle="Red de socios y M&A"
        description="Mapa de partnerships: cloud providers (Azure, AWS, Oracle), data vendor (Teradata), operating partner (WeWork), open innovation (230 startups Inovabra), corporate venture (Krealo). M&A: Ágora (2008), Digio (2021-22), Culqi." />
      <div className="space-y-8">
        <ViewSection eyebrow="Red de partnerships" title="Bradesco — socios estratégicos">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PARTNERSHIPS.filter((p) => p.perimeter !== "CREDICORP" && p.perimeter !== "BCP").map((p) => (
              <Card key={p.partner}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm">{p.partner}</h3>
                  <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">{p.type.replace(/_/g, " ")}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{p.scope}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-muted-foreground">Status:</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold">{p.status.replace(/_/g, " ")}</span>
                </div>
                {p.bias_note && <p className="mt-2 text-[10px] italic text-amber-600">⚠ {p.bias_note}</p>}
                <div className="mt-2">
                  {evidenceList(p.evidence).map((s) => <SourcePill key={s} sourceId={s} />)}
                </div>
              </Card>
            ))}
          </div>
        </ViewSection>

        <ViewSection eyebrow="Red de partnerships" title="Credicorp / BCP — socios estratégicos">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PARTNERSHIPS.filter((p) => p.perimeter === "CREDICORP" || p.perimeter === "BCP").map((p) => (
              <Card key={p.partner}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm">{p.partner}</h3>
                  <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">{p.type.replace(/_/g, " ")}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{p.scope}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-muted-foreground">Status:</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold">{p.status.replace(/_/g, " ")}</span>
                </div>
                <div className="mt-2">
                  {evidenceList(p.evidence).map((s) => <SourcePill key={s} sourceId={s} />)}
                </div>
              </Card>
            ))}
          </div>
        </ViewSection>

        <ViewSection eyebrow="M&A histórico" title="Adquisiciones y divestitures clave">
          <Grid>
            <Card>
              <h3 className="font-bold text-sm">Ágora Corretora (2008)</h3>
              <p className="mt-1 text-xs text-muted-foreground">Adquisición que dio entrada a Bradesco en corretaje y wealth management.</p>
            </Card>
            <Card>
              <h3 className="font-bold text-sm">Digio (2021-2022)</h3>
              <p className="mt-1 text-xs text-muted-foreground">Compra del 49,99% de Banco do Brasil por R$625M → consolidación 100%.</p>
            </Card>
            <Card>
              <h3 className="font-bold text-sm">Culqi</h3>
              <p className="mt-1 text-xs text-muted-foreground">Payment gateway adquirida por Credicorp; integrada al grupo.</p>
            </Card>
          </Grid>
        </ViewSection>

        <ViewSection eyebrow="Open innovation" title="Inovabra network vs Krealo portfolio">
          <Callout type="info" title="Estructuras distintas">
            Inovabra conecta con <strong>230 startups externas</strong> con producto maduro (co-innovación abierta).
            Krealo es un <strong>fondo de venture corporativo</strong> con inversiones de equity en startups (venture capital).
            Ambos son mecanismos de open innovation pero con estructuras legales y de retorno distintas.
          </Callout>
        </ViewSection>
      </div>
    </>
  );
}
