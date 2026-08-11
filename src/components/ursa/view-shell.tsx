"use client";

import { cn } from "@/lib/utils";
import { SectionBadge } from "./ursa-brand";
import { ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

/** Standard hero header for each view. */
export function ViewHero({
  eyebrow,
  title,
  lede,
  meta,
  tone = "gold",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  meta?: { label: string; value: string }[];
  tone?: "gold" | "forest";
}) {
  return (
    <section
      className="relative overflow-hidden border-b border-ursa-line"
      style={{
        background:
          "radial-gradient(ellipse at top right, rgba(143,166,139,0.18), transparent 60%), radial-gradient(ellipse at bottom left, rgba(184,146,74,0.18), transparent 60%), linear-gradient(180deg, var(--color-ursa-paper) 0%, var(--color-ursa-cream) 100%)",
      }}
    >
      {/* Art Nouveau texture overlay */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><g fill='none' stroke='%23B8924A' stroke-width='0.6' opacity='0.18'><path d='M0 60 Q30 30 60 60 T120 60'/><path d='M0 90 Q30 60 60 90 T120 90'/><circle cx='60' cy='60' r='2'/></g></svg>\")",
        }}
      />
      {/* Art Nouveau corner ornaments */}
      <svg className="absolute top-4 left-4 opacity-30 pointer-events-none hidden md:block" width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path d="M2 2 Q18 4 24 18 Q28 26 18 30 Q6 34 2 50" stroke="var(--color-ursa-gold)" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
        <circle cx="8" cy="8" r="1.5" fill="var(--color-ursa-gold)" />
        <path d="M2 18 Q10 20 14 26" stroke="var(--color-ursa-gold)" strokeWidth="0.5" fill="none" opacity="0.7"/>
      </svg>
      <svg className="absolute top-4 right-4 opacity-30 pointer-events-none hidden md:block scale-x-[-1]" width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path d="M2 2 Q18 4 24 18 Q28 26 18 30 Q6 34 2 50" stroke="var(--color-ursa-gold)" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
        <circle cx="8" cy="8" r="1.5" fill="var(--color-ursa-gold)" />
        <path d="M2 18 Q10 20 14 26" stroke="var(--color-ursa-gold)" strokeWidth="0.5" fill="none" opacity="0.7"/>
      </svg>
      <div className="relative max-w-[1180px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <span
          className={cn(
            "inline-block font-label text-[0.72rem] tracking-[0.28em] uppercase mb-4",
            tone === "gold" ? "text-ursa-gold-text" : "text-ursa-forest-deep"
          )}
        >
          {eyebrow}
        </span>
        <h1 className="font-display font-semibold text-ursa-dark-roast leading-[1.1] mb-4 text-[2.1rem] sm:text-[2.6rem] md:text-[3.2rem] max-w-[20ch]">
          {title}
        </h1>
        {lede && (
          <p className="text-[1.05rem] md:text-[1.15rem] text-muted-foreground max-w-[62ch] leading-relaxed mb-6">
            {lede}
          </p>
        )}
        {meta && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-label text-[0.78rem] tracking-[0.06em] uppercase text-muted-foreground">
            {meta.map((m) => (
              <span key={m.label}>
                <b className="text-ursa-dark-roast font-medium">{m.label}</b> · {m.value}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Section with consistent padding and max width. */
export function ViewSection({
  children,
  className,
  badge,
  title,
  meta,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  badge?: string;
  title?: React.ReactNode;
  meta?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-12 border-b border-ursa-line-soft", className)}>
      <div className="max-w-[1180px] mx-auto px-4 md:px-6">
        {(badge || title) && (
          <div className="flex items-baseline gap-4 flex-wrap mb-6">
            {badge && <SectionBadge>{badge}</SectionBadge>}
            {title && <h2 className="font-display text-[1.6rem] md:text-[2.1rem] font-semibold text-ursa-dark-roast m-0 flex-1">{title}</h2>}
            {meta && (
              <span className="font-label text-[0.7rem] tracking-[0.16em] uppercase text-muted-foreground">
                {meta}
              </span>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** Card. */
export function Card({
  children,
  className,
  href,
  highlight = false,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  highlight?: boolean;
}) {
  const cls = cn(
    "bg-card border rounded-xl p-6 h-full min-w-0 overflow-hidden shadow-[0_1px_0_rgba(59,36,23,0.06),0_8px_24px_-12px_rgba(59,36,23,0.18)] ursa-card-hover hover:border-ursa-gold/60 hover:shadow-[0_2px_0_rgba(59,36,23,0.08),0_16px_40px_-18px_rgba(59,36,23,0.28)]",
    href ? "block no-underline text-inherit" : "",
    highlight ? "border-ursa-gold shadow-[0_0_0_4px_rgba(184,146,74,0.15),0_1px_0_rgba(59,36,23,0.06),0_8px_24px_-12px_rgba(59,36,23,0.18)]" : "border-ursa-line-soft",
    className
  );
  if (href) {
    const external = href.startsWith("http");
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={cls}>
        {children}
      </a>
    );
  }
  return <div className={cls}>{children}</div>;
}

/** Static dossier link banner. */
export function DossierLinkBanner({ moduleId }: { moduleId: string }) {
  return (
    <a
      href={`/AIMarket-Design-Consulting-Reports/dossier/${moduleId}.html`}
      target="_blank"
      rel="noopener noreferrer"
      className="no-print inline-flex items-center gap-2 text-[0.8rem] text-muted-foreground hover:text-ursa-gold-text transition border border-dashed border-ursa-line rounded-lg px-3 py-2"
    >
      <ExternalLink size={14} />
      Open the full printable HTML dossier for this module
    </a>
  );
}

/** Grid utility. */
export function Grid({ children, cols = 2, className }: { children: React.ReactNode; cols?: 2 | 3 | 4; className?: string }) {
  const colMap = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };
  return <div className={cn("grid gap-5 items-stretch [grid-template-columns:minmax(0,1fr)]", colMap[cols], className)}>{children}</div>;
}

/** Reveal-on-scroll wrapper. Children fade up when they enter the viewport. */
export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn("ursa-reveal", inView && "ursa-reveal--in", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
