"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function ViewHero({
  number,
  title,
  subtitle,
  description,
  children,
}: {
  number: string;
  title: string;
  subtitle: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-border/60 bg-gradient-to-br from-card to-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-2xl font-black text-primary-foreground shadow-sm">
            {number}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{subtitle}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
            {description && <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}

export function ViewSection({
  id,
  title,
  eyebrow,
  children,
  className,
  collapsible = false,
}: {
  id?: string;
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
}) {
  const [open, setOpen] = React.useState(true);
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      {title && (
        <div className="mb-3 flex items-center gap-3">
          <div className="h-6 w-1 rounded-full bg-primary" />
          <div>
            {eyebrow && <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">{eyebrow}</p>}
            <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
          </div>
          {collapsible && (
            <button
              onClick={() => setOpen((o) => !o)}
              className="ml-auto rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              {open ? "Contraer" : "Expandir"}
            </button>
          )}
        </div>
      )}
      {open && <div>{children}</div>}
    </section>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5", className)}>{children}</div>
  );
}

export function Grid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>{children}</div>;
}

export function StatBlock({
  label,
  value,
  sub,
  accent = "primary",
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent?: "primary" | "teal" | "gold" | "muted";
  className?: string;
}) {
  const colorMap = {
    primary: "border-l-primary",
    teal: "border-l-[#0F766E]",
    gold: "border-l-[#B08D57]",
    muted: "border-l-muted-foreground",
  };
  return (
    <div className={cn("rounded-lg border border-border border-l-4 bg-card p-4", colorMap[accent], className)}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function DossierLinkBanner({ moduleId }: { moduleId: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
      <span className="font-semibold text-primary">Módulo {moduleId}</span>
      <span>·</span>
      <span>Dossier estático / exportación disponible en la versión imprimible</span>
    </div>
  );
}

export function Pill({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium"
      style={color ? { borderColor: color, color, backgroundColor: `${color}10` } : undefined}
    >
      {children}
    </span>
  );
}

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "warn" | "danger" | "success";
  title?: string;
  children: React.ReactNode;
}) {
  const cfg = {
    info: { bg: "bg-sky-50 dark:bg-sky-950/30", border: "border-sky-300 dark:border-sky-800", icon: "ℹ", color: "text-sky-700 dark:text-sky-300" },
    warn: { bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-300 dark:border-amber-800", icon: "⚠", color: "text-amber-700 dark:text-amber-300" },
    danger: { bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-300 dark:border-red-800", icon: "✕", color: "text-red-700 dark:text-red-300" },
    success: { bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-300 dark:border-emerald-800", icon: "✓", color: "text-emerald-700 dark:text-emerald-300" },
  }[type];
  return (
    <div className={cn("flex gap-3 rounded-lg border p-3", cfg.bg, cfg.border)}>
      <span className={cn("text-sm font-bold", cfg.color)}>{cfg.icon}</span>
      <div className="min-w-0 flex-1 text-sm">
        {title && <p className={cn("font-semibold", cfg.color)}>{title}</p>}
        <div className="text-foreground/90">{children}</div>
      </div>
    </div>
  );
}

export function EntityBadge({ entity, label }: { entity: "BRADESCO" | "BCP" | "CREDICORP" | "INOVABRA"; label?: string }) {
  const colors: Record<string, string> = {
    BRADESCO: "#B91C3C",
    BCP: "#0F766E",
    CREDICORP: "#7C3AED",
    INOVABRA: "#B08D57",
  };
  const c = colors[entity];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
      style={{ backgroundColor: c }}
    >
      {label ?? entity}
    </span>
  );
}
