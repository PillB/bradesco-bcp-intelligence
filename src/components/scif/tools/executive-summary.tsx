"use client";
import * as React from "react";
import { Card } from "@/components/scif/view-shell";
import { EvidenceTag } from "@/components/scif/evidence";
import { CLAIMS, SOURCES, OPEN_QUESTIONS, RECOMMENDATIONS, TECH_CAPABILITIES } from "@/lib/scif/data";
import { FileText, Download, Printer } from "lucide-react";

export function ExecutiveSummary() {
  const verifiedCount = CLAIMS.filter((c) => c.evidence_status === "VERIFIED" || c.evidence_status === "INDEPENDENTLY_CORROBORATED").length;
  const productionTech = TECH_CAPABILITIES.filter((t) => ["PRODUCTION", "PRODUCTION_SCALING", "MATURE", "MATURE_PRODUCTION"].includes(t.maturity)).length;
  const avgConfidence = (CLAIMS.reduce((s, c) => s + c.confidence, 0) / CLAIMS.length * 100).toFixed(0);
  const tierACount = SOURCES.filter((s) => s.source_tier === "A").length;
  const openHIGH = OPEN_QUESTIONS.filter((o) => o.priority === "HIGH").length;
  const openMEDIUM = OPEN_QUESTIONS.filter((o) => o.priority === "MEDIUM").length;

  const summaryRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (summaryRef.current) {
      const content = summaryRef.current.innerHTML;
      const win = window.open("", "_blank", "width=900,height=700");
      if (win) {
        win.document.write(`
          <!DOCTYPE html><html><head><title>Resumen Ejecutivo — Bradesco × BCP</title>
          <style>
            body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1a1a1a; line-height: 1.6; }
            h1 { color: #B91C3C; border-bottom: 3px solid #B91C3C; padding-bottom: 10px; }
            h2 { color: #B91C3C; margin-top: 30px; }
            .kpi { display: inline-block; margin: 5px; padding: 10px 15px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9; }
            .kpi-value { font-size: 24px; font-weight: bold; color: #B91C3C; }
            .kpi-label { font-size: 11px; color: #666; text-transform: uppercase; }
            .section { margin: 20px 0; }
            .claim { padding: 8px; margin: 5px 0; border-left: 3px solid #B91C3C; background: #faf5f6; }
            .meta { font-size: 10px; color: #666; }
            .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 10px; color: #999; font-style: italic; }
          </style></head><body>${content}</body></html>
        `);
        win.document.close();
        setTimeout(() => win.print(), 500);
      }
    }
  };

  const handleDownload = () => {
    if (summaryRef.current) {
      const text = `
BRADESCO × BCP STRATEGIC INTELLIGENCE COMMAND CENTER
RESUMEN EJECUTIVO
================================================

EVIDENCE BASE
- Total sources: ${SOURCES.length} (${tierACount} Tier A primarias)
- Total claims: ${CLAIMS.length} (${verifiedCount} verified/corroborated)
- Avg confidence: ${avgConfidence}%
- Tech capabilities: ${TECH_CAPABILITIES.length} (${productionTech} in production/mature)

KEY FINDINGS
${CLAIMS.filter((c) => c.evidence_status === "VERIFIED" || c.evidence_status === "INDEPENDENTLY_CORROBORATED").slice(0, 8).map((c) => `• [${c.claim_id}] ${c.claim}`).join("\n")}

OPEN QUESTIONS
${OPEN_QUESTIONS.map((o) => `• [${o.oq_id}] ${o.question} (${o.priority})`).join("\n")}

RECOMMENDATIONS
${RECOMMENDATIONS.map((r) => `• [${r.rec_id}] ${r.title} (${r.transferability}, confidence ${(r.confidence * 100).toFixed(0)}%)`).join("\n")}

VERDICT: CONDITIONALLY_READY (strong)
Independence: Análisis estratégico independiente. No implica afiliación ni respaldo por parte de Bradesco, BCP o Credicorp.
Generated: ${new Date().toISOString()}
`;
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bradesco-bcp-executive-summary.txt";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">Resumen Ejecutivo — Exportable</h3>
            <p className="text-[11px] text-muted-foreground">Síntesis del dossier para distribución ejecutiva</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={handlePrint} className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[10px] font-semibold hover:bg-muted">
            <Printer className="h-3 w-3" /> Imprimir
          </button>
          <button onClick={handleDownload} className="flex items-center gap-1 rounded-md border border-primary bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground hover:bg-primary/90">
            <Download className="h-3 w-3" /> Descargar .txt
          </button>
        </div>
      </div>

      <div ref={summaryRef} className="mt-4 space-y-4">
        {/* KPIs */}
        <div className="flex flex-wrap gap-2">
          {[
            { value: SOURCES.length, label: "Fuentes", sub: `${tierACount} Tier A` },
            { value: CLAIMS.length, label: "Claims", sub: `${verifiedCount} verificadas` },
            { value: `${avgConfidence}%`, label: "Confianza avg", sub: "sobre claims" },
            { value: productionTech, label: "Tech PROD", sub: `${TECH_CAPABILITIES.length} total` },
            { value: openHIGH + openMEDIUM, label: "Open Q", sub: `${openHIGH} HIGH, ${openMEDIUM} MED` },
          ].map((kpi, i) => (
            <div key={i} className="rounded-lg border border-border bg-gradient-to-br from-card to-muted/20 p-2.5 text-center">
              <p className="text-xl font-black text-primary">{kpi.value}</p>
              <p className="text-[9px] font-bold uppercase text-muted-foreground">{kpi.label}</p>
              <p className="text-[9px] text-muted-foreground">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Key findings */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Hallazgos clave (verificados/corroborados)</p>
          <div className="space-y-1.5">
            {CLAIMS.filter((c) => c.evidence_status === "VERIFIED" || c.evidence_status === "INDEPENDENTLY_CORROBORATED").slice(0, 6).map((c) => (
              <div key={c.claim_id} className="rounded-md border-l-2 border-primary bg-primary/5 px-3 py-1.5">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[9px] font-bold text-primary">{c.claim_id}</span>
                  <p className="flex-1 text-[11px] leading-snug">{c.claim}</p>
                  <EvidenceTag status={c.evidence_status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verdict */}
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-300">VEREDICTO: CONDITIONALLY_READY (fuerte)</p>
          <p className="mt-1 text-[11px] text-foreground/80">
            Base de evidencia sólida: {verifiedCount} de {CLAIMS.length} claims verificadas o corroboradas independientemente,
            {" "}{tierACount} fuentes Tier A primarias, confianza promedio {avgConfidence}%.
            Acercándose a READY_FOR_EXECUTIVE_REVIEW. Pendientes: {openHIGH + openMEDIUM} open questions de prioridad HIGH/MEDIUM.
          </p>
        </div>

        {/* Footer */}
        <p className="border-t border-border pt-2 text-[10px] italic text-muted-foreground">
          Análisis estratégico independiente. No implica afiliación ni respaldo por parte de Bradesco, BCP o Credicorp.
          Generado: {new Date().toLocaleDateString("es-PE")}
        </p>
      </div>
    </Card>
  );
}
