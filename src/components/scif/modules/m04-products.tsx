"use client";
import { ViewHero, ViewSection, Card, Grid, Callout, EntityBadge } from "@/components/scif/view-shell";
import { ContextTooltip } from "@/components/scif/context-tooltip";
import { PRODUCTS } from "@/lib/scif/data";
import * as React from "react";

const CATEGORIES = ["Depósitos", "Crédito", "Tarjetas", "Seguros", "Pensiones", "Wealth", "Microfinanzas", "Pagos", "Corporate"];

export function Module04Products() {
  const [filter, setFilter] = React.useState<string>("ALL");
  const filtered = filter === "ALL" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  return (
    <>
      <ViewHero number="04" title="Ecosistema de Productos y Servicios" subtitle="Cuentas, crédito, tarjetas, seguros, wealth"
        description="Mapa relacional de productos Bradesco vs BCP. Estructura multi-negocio: banca + seguros + pensions + wealth en ambos grupos. Mibanco es ventaja estructural de Credicorp en microfinanzas." />
      <div className="space-y-8">
        <ViewSection eyebrow="Explorador de productos" title="Filtrar por categoría">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilter("ALL")} className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${filter === "ALL" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}>Todas</button>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setFilter(c)} className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${filter === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}>{c}</button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.map((p) => (
              <Card key={p.name}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm">{p.name}</h3>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">{p.category}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <EntityBadge entity="BRADESCO" />
                    <p className="mt-1 text-muted-foreground">{p.bradesco}</p>
                  </div>
                  <div>
                    <EntityBadge entity="BCP" />
                    <p className="mt-1 text-muted-foreground">{p.bcp}</p>
                  </div>
                </div>
                {p.note && <p className="mt-2 text-[11px] italic text-muted-foreground">{p.note}</p>}
              </Card>
            ))}
          </div>
        </ViewSection>

        <ViewSection eyebrow="Análisis de cobertura" title="Diferencias estructurales del portafolio">
          <Grid>
            <Card>
              <h3 className="font-bold text-sm">Microfinanzas — ventaja Credicorp</h3>
              <p className="mt-2 text-xs text-muted-foreground">Mibanco (subsidiaria de Credicorp) es líder en microfinanzas en Perú. Bradesco no tiene equivalente histórico en este segmento. Es una diferencia estructural del portafolio del grupo, no una capacidad operativa comparable banco-a-banco.</p>
            </Card>
            <Card>
              <h3 className="font-bold text-sm">Banca de inversión — Bradesco BBI</h3>
              <p className="mt-2 text-xs text-muted-foreground">Bradesco BBI es banca de inversión dedicada. Credicorp tiene Credicorp Capital. Ambos grupos tienen brazos de wealth/capital markets, estructuralmente comparables.</p>
            </Card>
            <Card>
              <h3 className="font-bold text-sm">Adquisición / acquiring</h3>
              <p className="mt-2 text-xs text-muted-foreground">Bradesco fue socio fundador histórico de Cielo. Credicorp adquirió Culqi (payment gateway). Estructuras distintas: Bradesco con partnership histórico, Credicorp con adquisición directa.</p>
            </Card>
          </Grid>
        </ViewSection>

        <ViewSection eyebrow="Cartera de crédito" title="Volumen y crecimiento — Bradesco">
          <Grid>
            <Card>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Cartera de crédito ampliada</p>
              <p className="mt-1 text-2xl font-black text-primary">R$ 1,089 T</p>
              <p className="text-xs text-emerald-600 font-semibold">+11,0% a/a (2025)</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Fuente: 6-K 4T25 (S02)</p>
            </Card>
            <Card>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Depósitos totales</p>
              <p className="mt-1 text-2xl font-black text-primary">R$ 727,9 B</p>
              <p className="text-xs text-emerald-600 font-semibold">+12,2% a/a (2025)</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Fuente: 20-F FY2025 (S01)</p>
            </Card>
          </Grid>
          <Callout type="info" title="Comparabilidad">
            Las cifras de cartera y depósitos de Bradesco están en BRL; BCP reporta en PEN. La comparación absoluta es
            NOT_DIRECTLY_COMPARABLE sin conversión. La comparación relevante es la trayectoria de crecimiento (% a/a)
            y la calidad de cartera (costo de riesgo): BCP mejoró su costo de riesgo de 2,13% a 1,28% en 2025.
          </Callout>
        </ViewSection>
      </div>
    </>
  );
}
