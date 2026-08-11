"use client";
import { cn } from "@/lib/utils";
import { theme } from "@/lib/scif/theme";
import type { EvidenceStatus, SourceTier, LifecycleStatus, TechMaturity } from "@/lib/scif/types";
import { getSource } from "@/lib/scif/data";

export function EvidenceTag({ status, className }: { status: EvidenceStatus; className?: string }) {
  const cfg = theme.evidence[status] ?? theme.evidence.UNRESOLVED;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap",
        className
      )}
      style={{ backgroundColor: cfg.bg, color: cfg.fg, borderColor: cfg.border }}
      title={`Estado de evidencia: ${cfg.label}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

export function TierBadge({ tier, className }: { tier: SourceTier; className?: string }) {
  const cfg = theme.tier[tier];
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase", className)}
      style={{ color: cfg.color, borderColor: cfg.color, backgroundColor: `${cfg.color}10` }}
      title={`${cfg.label} — ${cfg.desc}`}
    >
      {cfg.label}
    </span>
  );
}

export function LifecycleTag({ status, className }: { status: LifecycleStatus | TechMaturity; className?: string }) {
  const cfg = theme.lifecycle[status as LifecycleStatus] ?? theme.lifecycle.UNKNOWN;
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap text-white", className)}
      style={{ backgroundColor: cfg.color }}
      title={`Ciclo de vida: ${cfg.label}`}
    >
      {cfg.label}
    </span>
  );
}

export function ConfidenceMeter({ value, className }: { value: number; className?: string }) {
  const pct = Math.round(value * 100);
  const color = pct >= 85 ? "#16A34A" : pct >= 70 ? "#F59E0B" : pct >= 50 ? "#FB923C" : "#DC2626";
  return (
    <div className={cn("flex items-center gap-1.5", className)} title={`Confianza: ${pct}%`}>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">{pct}%</span>
    </div>
  );
}

export function SourcePill({ sourceId, className }: { sourceId: string; className?: string }) {
  const s = getSource(sourceId);
  if (!s) return <span className="text-[10px] text-muted-foreground">{sourceId}</span>;
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium", className)}
      title={`${s.publisher}\n${s.notes ?? ""}\nPublicación: ${s.publication_date}\nCluster: ${s.independence_cluster}`}
    >
      <TierBadge tier={s.source_tier} className="px-1 py-0" />
      <span className="font-mono">{sourceId}</span>
    </span>
  );
}

export function ClaimRef({ claimId }: { claimId: string }) {
  return (
    <sup className="ml-0.5 cursor-help text-[10px] font-bold text-primary" title={`Claim ${claimId} — ver módulo 16`}>
      [{claimId}]
    </sup>
  );
}

export function ProvenanceLine({
  sourceIds,
  asOf,
  confidence,
  className,
}: {
  sourceIds: string[];
  asOf?: string;
  confidence?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground", className)}>
      <span className="font-semibold uppercase tracking-wide">Fuente:</span>
      {sourceIds.map((id) => (
        <SourcePill key={id} sourceId={id} />
      ))}
      {asOf && (
        <span className="border-l border-border pl-2">
          <span className="font-semibold uppercase tracking-wide">As-of:</span> {asOf}
        </span>
      )}
      {confidence !== undefined && <ConfidenceMeter value={confidence} className="border-l border-border pl-2" />}
    </div>
  );
}
