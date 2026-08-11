"use client";
import * as React from "react";
import { CONTEXT_REGISTRY, type ContextEntry } from "@/lib/scif/context-registry";
import { cn } from "@/lib/utils";

const ENTITY_COLORS: Record<string, string> = {
  BRADESCO: "#B91C3C",
  BCP: "#0F766E",
  CREDICORP: "#7C3AED",
  AMBIOS: "#B08D57",
  SISTEMA: "#6B7280",
};

const ENTITY_LABELS: Record<string, string> = {
  BRADESCO: "BRADESCO",
  BCP: "BCP",
  CREDICORP: "CREDICORP",
  AMBIOS: "AMBOS",
  SISTEMA: "SISTEMA",
};

export function ContextTooltip({ term, children }: { term: string; children: React.ReactNode }) {
  const [show, setShow] = React.useState(false);
  const context = CONTEXT_REGISTRY[term.toUpperCase().replace(/\s+/g, "_")] ?? CONTEXT_REGISTRY[term];

  if (!context) return <>{children}</>;

  return (
    <span
      className="relative inline-block cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow((s) => !s)}
    >
      <span className="border-b border-dotted border-primary/50">{children}</span>
      <span
        className={cn(
          "ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded text-[8px] font-bold text-white",
          show ? "opacity-100" : "opacity-60"
        )}
        style={{ backgroundColor: ENTITY_COLORS[context.entity] }}
        title={context.shortDef}
      >
        {ENTITY_LABELS[context.entity].slice(0, 1)}
      </span>
      {show && (
        <div className="absolute left-0 top-full z-50 mt-1 w-80 max-w-[90vw] rounded-lg border border-border bg-popover p-3 shadow-xl">
          <div className="mb-1.5 flex items-center gap-2">
            <span
              className="rounded px-1.5 py-0.5 text-[9px] font-bold text-white"
              style={{ backgroundColor: ENTITY_COLORS[context.entity] }}
            >
              [{context.entity}:{context.term}]
            </span>
            <span className="text-[9px] font-bold uppercase text-muted-foreground">{context.category}</span>
          </div>
          <p className="text-[11px] font-medium leading-snug text-foreground">{context.fullDef}</p>
          {context.comparison && (
            <div className="mt-2 rounded-md border border-sky-200 bg-sky-50 p-2 dark:border-sky-800 dark:bg-sky-950/30">
              <p className="text-[10px] font-bold uppercase text-sky-600">Comparación</p>
              <p className="mt-0.5 text-[10px] leading-snug text-foreground/80">{context.comparison}</p>
            </div>
          )}
          {context.estado && (
            <p className="mt-1.5 text-[10px]">
              <span className="font-bold text-muted-foreground">Estado:</span> {context.estado}
            </p>
          )}
          {context.valor && (
            <p className="mt-0.5 text-[10px]">
              <span className="font-bold text-muted-foreground">Valor:</span> {context.valor}
            </p>
          )}
          {context.fuentes && (
            <p className="mt-0.5 text-[9px] text-muted-foreground">
              <span className="font-bold">Fuentes:</span> {context.fuentes.join(", ")}
            </p>
          )}
          {context.confianza && (
            <p className="mt-0.5 text-[9px] text-muted-foreground">
              <span className="font-bold">Confianza:</span> {context.confianza}
            </p>
          )}
        </div>
      )}
    </span>
  );
}

// Convenience wrapper for tagged terms
export function TaggedTerm({ entity, term, children }: { entity: string; term: string; children: React.ReactNode }) {
  const tag = `${entity}:${term}`;
  const color = ENTITY_COLORS[entity] ?? "#6B7280";
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="rounded px-1 py-0.5 text-[9px] font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {entity}
      </span>
      <ContextTooltip term={term}>{children}</ContextTooltip>
    </span>
  );
}
