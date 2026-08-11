"use client";

import { useState, useMemo, useCallback, useSyncExternalStore } from "react";
import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import {
  BearMark,
  ArtNouveauDivider,
  Pill,
  Callout,
  StatBlock,
  SectionBadge,
} from "../ursa-brand";
import { EXPERIMENTS } from "@/lib/ursa-data";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import {
  Beaker,
  FlaskConical,
  Play,
  Check,
  X,
  Banknote,
  Filter,
  RotateCcw,
  NotebookPen,
  ArrowRight,
  CircleDot,
  Target,
  Crosshair,
  AlertTriangle,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Status = "proposed" | "running" | "passed" | "killed";

type StatusMeta = {
  labelKey: string;
  pillTone: "gold" | "forest" | "ok" | "stop";
  text: string;
  bg: string;
  border: string;
  bar: string;
  barText: string;
  dot: string;
  icon: React.ReactNode;
};

const STATUS_META: Record<Status, StatusMeta> = {
  proposed: {
    labelKey: "content.experiments.filter.proposed",
    pillTone: "gold",
    text: "text-ursa-gold-text",
    bg: "bg-ursa-gold/8",
    border: "border-ursa-gold/40",
    bar: "bg-ursa-gold",
    barText: "text-ursa-espresso",
    dot: "bg-ursa-gold",
    icon: <CircleDot size={12} />,
  },
  running: {
    labelKey: "content.experiments.filter.running",
    pillTone: "forest",
    text: "text-ursa-forest-deep",
    bg: "bg-ursa-dark-roast/8",
    border: "border-ursa-forest-deep/30",
    bar: "bg-ursa-forest-deep",
    barText: "text-ursa-cream",
    dot: "bg-ursa-forest-deep",
    icon: <Play size={12} />,
  },
  passed: {
    labelKey: "content.experiments.filter.passed",
    pillTone: "ok",
    text: "text-ursa-forest-deep",
    bg: "bg-ursa-dark-roast/12",
    border: "border-ursa-forest-deep/45",
    bar: "bg-ursa-forest-deep",
    barText: "text-ursa-cream",
    dot: "bg-ursa-forest-deep",
    icon: <Check size={12} />,
  },
  killed: {
    labelKey: "content.experiments.filter.killed",
    pillTone: "stop",
    text: "text-ursa-terracotta-text",
    bg: "bg-ursa-terracotta/8",
    border: "border-ursa-terracotta/35",
    bar: "bg-ursa-terracotta",
    barText: "text-ursa-espresso",
    dot: "bg-ursa-terracotta",
    icon: <X size={12} />,
  },
};

const STATUS_ORDER: Status[] = ["proposed", "running", "passed", "killed"];

const STORAGE_KEY_STATUS = "ursa-experiments-status-v1";
const STORAGE_KEY_NOTES = "ursa-experiments-notes-v1";

/** Experiment timeline (Gantt-like) ranges derived from stop rules + roadmap phasing. */
const TIMELINE: Record<string, { start: number; end: number; phase: string }> = {
  "EXP-01": { start: 1, end: 14, phase: "Lean · 30-day" },
  "EXP-02": { start: 1, end: 7, phase: "Lean · 72h" },
  "EXP-03": { start: 7, end: 37, phase: "Lean · 30-day" },
  "EXP-04": { start: 1, end: 22, phase: "Lean · 30-day" },
  "EXP-05": { start: 1, end: 14, phase: "Lean · 30-day" },
  "EXP-06": { start: 30, end: 90, phase: "Moderate · 60-day" },
  "EXP-07": { start: 30, end: 60, phase: "Moderate · 60-day" },
  "EXP-08": { start: 1, end: 60, phase: "Lean → Moderate" },
  "EXP-09": { start: 30, end: 60, phase: "Moderate · 60-day" },
  "EXP-10": { start: 1, end: 30, phase: "Lean · 30-day" },
  "EXP-11": { start: 60, end: 90, phase: "Growth · 90-day" },
};

const FILTER_OPTIONS: { value: "all" | Status; labelKey: string }[] = [
  { value: "all", labelKey: "content.experiments.filter.all" },
  { value: "proposed", labelKey: "content.experiments.filter.proposed" },
  { value: "running", labelKey: "content.experiments.filter.running" },
  { value: "passed", labelKey: "content.experiments.filter.passed" },
  { value: "killed", labelKey: "content.experiments.filter.killed" },
];

/** Parse a cost range string like "S/. 1,200–3,000" into {min, max} numbers. */
function parseCost(cost: string): { min: number; max: number } {
  const cleaned = cost.replace(/S\/\.\s*/g, "").replace(/,/g, "");
  const match = cleaned.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (match) {
    return { min: parseInt(match[1], 10), max: parseInt(match[2], 10) };
  }
  const single = cleaned.match(/(\d+)/);
  if (single) {
    const n = parseInt(single[1], 10);
    return { min: n, max: n };
  }
  return { min: 0, max: 0 };
}

const PEN = (n: number) => `S/. ${n.toLocaleString("en-US")}`;

/** Custom event dispatched whenever this tab writes to localStorage.
 *  The native `storage` event only fires in *other* tabs, so we dispatch a
 *  sibling event to make `useSyncExternalStore` re-read in the same tab. */
const URSA_LS_EVENT = "ursa-local-storage-change";

function subscribeLocalStorage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(URSA_LS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(URSA_LS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Hook to load + persist a JSON value to localStorage.
 *  Uses `useSyncExternalStore` so SSR renders with `initial` and the client
 *  re-hydrates from localStorage without an extra setState-in-effect render. */
function usePersistentState<T>(
  key: string,
  initial: T
): [T, (next: T | ((prev: T) => T)) => void, boolean] {
  const getSnapshot = useCallback((): string => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem(key) ?? "";
    } catch {
      return "";
    }
  }, [key]);

  const raw = useSyncExternalStore(
    subscribeLocalStorage,
    getSnapshot,
    () => ""
  );

  const value = useMemo<T>(() => {
    if (!raw) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  }, [raw, initial]);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      try {
        const currentRaw = localStorage.getItem(key);
        const current: T = currentRaw
          ? (JSON.parse(currentRaw) as T)
          : initial;
        const resolved =
          typeof next === "function"
            ? (next as (p: T) => T)(current)
            : next;
        localStorage.setItem(key, JSON.stringify(resolved));
        // Notify same-tab subscribers.
        window.dispatchEvent(new Event(URSA_LS_EVENT));
      } catch {
        // Storage may be unavailable (private mode, quota). Silently fail.
      }
    },
    [key, initial]
  );

  return [value, setValue, !!raw];
}

export function ExperimentsView() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [statuses, setStatuses] = usePersistentState<Record<string, Status>>(
    STORAGE_KEY_STATUS,
    {}
  );
  const [notes, setNotes] = usePersistentState<Record<string, string>>(
    STORAGE_KEY_NOTES,
    {}
  );
  const [filter, setFilter] = useState<"all" | Status>("all");

  const getStatus = (id: string): Status => statuses[id] ?? "proposed";

  const counts = useMemo(() => {
    const c: Record<Status, number> = { proposed: 0, running: 0, passed: 0, killed: 0 };
    EXPERIMENTS.forEach((e) => {
      c[getStatus(e.id)]++;
    });
    return c;
  }, [statuses]);

  const filteredExperiments = useMemo(() => {
    if (filter === "all") return EXPERIMENTS;
    return EXPERIMENTS.filter((e) => getStatus(e.id) === filter);
  }, [filter, statuses]);

  const costSummary = useMemo(() => {
    let minTotal = 0;
    let maxTotal = 0;
    let count = 0;
    EXPERIMENTS.forEach((e) => {
      const status = getStatus(e.id);
      if (status === "proposed" || status === "running") {
        const { min, max } = parseCost(e.cost);
        minTotal += min;
        maxTotal += max;
        count++;
      }
    });
    return { minTotal, maxTotal, count };
  }, [statuses]);

  const activeCount = counts.proposed + counts.running;
  const graduatedPct = EXPERIMENTS.length
    ? Math.round(((counts.passed + counts.killed) / EXPERIMENTS.length) * 100)
    : 0;

  const updateStatus = (id: string, status: Status) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const updateNote = (id: string, text: string) => {
    setNotes((prev) => ({ ...prev, [id]: text }));
  };

  const resetAll = () => {
    setStatuses({});
    setNotes({});
  };

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.experiments.eyebrow")}
        tone="forest"
        title={<>{t("content.view.experiments.title")}</>}
        lede={<>{t("content.experiments.hero.lede")}</>}
        meta={[
          {
            label: t("content.experiments.hero.meta.experiments"),
            value: t("content.experiments.hero.meta.experiments-value", { n: EXPERIMENTS.length }),
          },
          {
            label: t("content.experiments.hero.meta.statuses"),
            value: t("content.experiments.hero.meta.statuses-value"),
          },
          {
            label: t("content.experiments.hero.meta.persistence"),
            value: t("content.experiments.hero.meta.persistence-value"),
          },
        ]}
      />

      {/* Section 1 — Summary stats ============================================== */}
      <ViewSection
        badge={t("content.experiments.section.status.badge")}
        title={<>{t("content.experiments.section.status")}</>}
        meta={t("content.experiments.section.status.meta")}
      >
        <Grid cols={4}>
          <StatBlock
            value={String(EXPERIMENTS.length)}
            label={t("content.experiments.stat.total")}
            tone="forest"
          />
          <StatBlock
            value={String(counts.proposed)}
            label={t("content.experiments.stat.proposed")}
            tone="gold"
          />
          <StatBlock
            value={String(counts.running)}
            label={t("content.experiments.stat.running")}
            tone="forest"
          />
          <StatBlock
            value={String(counts.passed + counts.killed)}
            label={t("content.experiments.stat.graduated")}
            tone="terracotta"
          />
        </Grid>

        <div className="mt-6 grid sm:grid-cols-2 gap-5">
          <Card className="bg-ursa-foam">
            <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
              <FlaskConical size={16} className="text-ursa-gold-text" /> {t("content.experiments.legend.heading")}
            </h4>
            <ul className="m-0 p-0 list-none space-y-1.5">
              {STATUS_ORDER.map((s) => {
                const m = STATUS_META[s];
                return (
                  <li key={s} className="flex items-center gap-2.5">
                    <span className={cn("h-3 w-3 rounded-full", m.dot)} aria-hidden="true" />
                    <span className="font-label text-[0.7rem] tracking-[0.14em] uppercase text-ursa-dark-roast">
                      {t(m.labelKey)}
                    </span>
                    <span className="text-[0.82rem] text-muted-foreground">
                      {t(`content.experiments.legend.${s}`)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>
          <Card>
            <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
              <Trophy size={16} className="text-ursa-gold-text" /> {t("content.experiments.graduation.heading")}
            </h4>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-display text-3xl font-semibold text-ursa-forest-deep">
                {graduatedPct}%
              </span>
              <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">
                {t("content.experiments.graduation.subtitle", { n: EXPERIMENTS.length })}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-ursa-forest to-ursa-forest-deep rounded-full transition-all duration-500"
                style={{ width: `${graduatedPct}%` }}
              />
            </div>
            <p className="text-[0.82rem] text-muted-foreground m-0">
              {t("content.experiments.graduation.summary", {
                passed: counts.passed,
                killed: counts.killed,
                active: activeCount,
              })}
            </p>
            <p className="text-[0.82rem] text-muted-foreground mt-3 m-0">
              {t("content.experiments.graduation.note")}
            </p>
          </Card>
        </div>
      </ViewSection>

      {/* Section 2 — Filter ==================================================== */}
      <ViewSection
        badge={t("content.experiments.section.filter.badge")}
        title={<>{t("content.experiments.section.filter")}</>}
        meta={t("content.experiments.section.filter.meta", {
          shown: filteredExperiments.length,
          total: EXPERIMENTS.length,
        })}
      >
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_OPTIONS.map((opt) => {
            const isActive = filter === opt.value;
            const count =
              opt.value === "all"
                ? EXPERIMENTS.length
                : counts[opt.value];
            return (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full border font-label text-[0.72rem] tracking-[0.12em] uppercase transition",
                  isActive
                    ? "bg-ursa-dark-roast text-ursa-cream border-ursa-forest-deep"
                    : "bg-card text-ursa-dark-roast border-ursa-line-soft hover:border-ursa-gold/60 hover:text-ursa-gold-text"
                )}
              >
                <Filter size={12} />
                {t(opt.labelKey)}
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[1.4rem] h-5 px-1.5 rounded-full font-body text-[0.66rem]",
                    isActive ? "bg-ursa-gold text-ursa-dark-roast" : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetAll}
              className="font-label text-[0.7rem] tracking-[0.12em] uppercase border-ursa-terracotta/40 text-ursa-terracotta-text hover:bg-ursa-terracotta hover:text-ursa-cream"
            >
              <RotateCcw size={12} className="mr-1.5" /> {t("content.experiments.filter.reset")}
            </Button>
          </div>
        </div>

        {filter !== "all" && (
          <p className="text-[0.84rem] text-muted-foreground mt-3">
            {t("content.experiments.filter.active-note", { status: t(STATUS_META[filter].labelKey) })}
          </p>
        )}
      </ViewSection>

      {/* Section 3 — Experiment cards ========================================== */}
      <ViewSection
        badge={t("content.experiments.section.cards.badge")}
        title={<>{t("content.experiments.section.cards")}</>}
        meta={t("content.experiments.section.cards.meta")}
      >
        {filteredExperiments.length === 0 ? (
          <Card className="bg-ursa-foam text-center">
            <p className="text-[0.95rem] text-muted-foreground m-0">
              {t("content.experiments.section.cards.empty")}
            </p>
          </Card>
        ) : (
          <Grid cols={2}>
            {filteredExperiments.map((e) => (
              <ExperimentCard
                key={e.id}
                experiment={e}
                status={getStatus(e.id)}
                onStatusChange={(s) => updateStatus(e.id, s)}
              />
            ))}
          </Grid>
        )}
      </ViewSection>

      {/* Section 4 — Cost summary ============================================== */}
      <ViewSection
        badge={t("content.experiments.section.cost.badge")}
        title={<>{t("content.experiments.section.cost")}</>}
        meta={t("content.experiments.section.cost.meta")}
      >
        <Grid cols={3}>
          <Card highlight className="bg-ursa-foam">
            <StatBlock
              value={`${PEN(costSummary.minTotal)} – ${PEN(costSummary.maxTotal)}`}
              label={t("content.experiments.cost.exposure.label", { count: costSummary.count })}
              tone="gold"
            />
            <p className="text-[0.82rem] text-muted-foreground mt-3 m-0">
              {t("content.experiments.cost.exposure.body")}
            </p>
          </Card>
          <Card>
            <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
              <Banknote size={16} className="text-ursa-gold-text" /> {t("content.experiments.cost.counted.heading")}
            </h4>
            <ul className="m-0 p-0 list-none space-y-1.5 text-[0.84rem] text-muted-foreground">
              <li>
                <strong className="text-ursa-gold-text">{t("content.experiments.filter.proposed")}</strong>{" "}
                {t("content.experiments.cost.counted.proposed")}
              </li>
              <li>
                <strong className="text-ursa-forest-deep">{t("content.experiments.filter.running")}</strong>{" "}
                {t("content.experiments.cost.counted.running")}
              </li>
              <li className="text-muted-foreground/70 italic">
                <strong>{t("content.experiments.filter.passed")} / {t("content.experiments.filter.killed")}</strong>{" "}
                {t("content.experiments.cost.counted.excluded")}
              </li>
            </ul>
          </Card>
          <Card>
            <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
              <AlertTriangle size={16} className="text-ursa-terracotta-text" /> {t("content.experiments.cost.caveats.heading")}
            </h4>
            <p className="text-[0.84rem] text-muted-foreground m-0">
              {t("content.experiments.cost.caveats.body")}
            </p>
            <button
              onClick={() => navigate("calculator")}
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ursa-gold/60 text-ursa-gold-text hover:bg-ursa-gold hover:text-ursa-dark-roast transition font-label text-[0.7rem] tracking-[0.1em] uppercase"
            >
              <ArrowRight size={12} /> {t("content.experiments.cost.caveats.button")}
            </button>
          </Card>
        </Grid>

        <Callout tone="forest" title={t("content.experiments.cost.cheapest.title")}>
          {t("content.experiments.cost.cheapest.body")}
        </Callout>
      </ViewSection>

      {/* Section 5 — Timeline (Gantt-like) ===================================== */}
      <ViewSection
        badge={t("content.experiments.section.gantt.badge")}
        title={<>{t("content.experiments.section.gantt")}</>}
        meta={t("content.experiments.section.gantt.meta")}
      >
        <p className="text-[0.95rem] text-muted-foreground leading-relaxed max-w-[68ch] mb-6">
          {t("content.experiments.gantt.intro")}
        </p>

        <div className="rounded-xl border border-ursa-line-soft bg-card p-4 md:p-5 overflow-x-auto">
          {/* Day axis */}
          <div className="grid items-center mb-2" style={{ gridTemplateColumns: "minmax(180px, 220px) 1fr" }}>
            <div className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground pr-3">
              {t("content.experiments.gantt.col.experiment")}
            </div>
            <div className="relative h-5">
              {[0, 15, 30, 45, 60, 75, 90].map((d) => (
                <span
                  key={d}
                  className="absolute top-0 font-label text-[0.6rem] tracking-[0.1em] uppercase text-muted-foreground"
                  style={{ left: `${(d / 90) * 100}%`, transform: d === 0 ? "none" : "translateX(-50%)" }}
                >
                  {t("content.experiments.gantt.day-label", { n: d })}
                </span>
              ))}
            </div>
          </div>

          {/* Rows */}
          <div className="space-y-2">
            {EXPERIMENTS.map((e) => {
              const tl = TIMELINE[e.id];
              const status = getStatus(e.id);
              const m = STATUS_META[status];
              const leftPct = (tl.start / 90) * 100;
              const widthPct = ((tl.end - tl.start) / 90) * 100;
              return (
                <div
                  key={e.id}
                  className="grid items-center group hover:bg-muted/30 rounded-lg -mx-1 px-1 py-0.5 transition-colors"
                  style={{ gridTemplateColumns: "minmax(180px, 220px) 1fr" }}
                >
                  <div className="pr-3 flex items-baseline gap-2 min-w-0">
                    <span className="font-label text-[0.64rem] tracking-[0.12em] uppercase text-ursa-gold shrink-0 font-semibold">
                      {e.id}
                    </span>
                    <span className="text-[0.84rem] text-ursa-dark-roast truncate font-medium" title={e.name}>
                      {e.name}
                    </span>
                  </div>
                  <div className="relative h-8 bg-muted/40 rounded-md border border-ursa-line-soft/50">
                    {/* Phase gridlines */}
                    {[30, 60, 90].map((d) => (
                      <div
                        key={d}
                        className="absolute top-0 bottom-0 border-l border-dashed border-ursa-line/60"
                        style={{ left: `${(d / 90) * 100}%` }}
                      />
                    ))}
                    {/* Bar */}
                    <div
                      className={cn(
                        "absolute top-1 bottom-1 rounded shadow-sm flex items-center px-2.5 transition-all group-hover:brightness-110",
                        m.bar,
                        status === "killed" && "opacity-50"
                      )}
                      style={{
                        left: `${leftPct}%`,
                        width: `max(${widthPct}%, 36px)`,
                      }}
                      title={`${e.id} · ${t(m.labelKey)} · day ${tl.start}–${tl.end}`}
                    >
                      <span className="font-label text-[0.62rem] tracking-[0.08em] uppercase text-ursa-cream truncate font-semibold">
                        d{tl.start}–{tl.end}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 pt-4 border-t border-ursa-line-soft flex flex-wrap items-center gap-x-5 gap-y-2">
            {STATUS_ORDER.map((s) => (
              <span key={s} className="inline-flex items-center gap-2">
                <span className={cn("h-2.5 w-4 rounded-sm", STATUS_META[s].bar)} />
                <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">
                  {t(STATUS_META[s].labelKey)}
                </span>
              </span>
            ))}
            <span className="ml-auto font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground">
              {t("content.experiments.gantt.legend-phases")}
            </span>
          </div>
        </div>

        <Callout tone="warn" title={t("content.experiments.gantt.short-bars.title")}>
          {t("content.experiments.gantt.short-bars.body")}
        </Callout>
      </ViewSection>

      {/* Section 6 — Learning log ============================================== */}
      <ViewSection
        badge={t("content.experiments.section.notes.badge")}
        title={<>{t("content.experiments.section.notes.title")}</>}
        meta={t("content.experiments.section.notes.meta")}
      >
        <p className="text-[0.95rem] text-muted-foreground leading-relaxed max-w-[68ch] mb-6">
          {t("content.experiments.notes.intro")}
        </p>

        <Grid cols={2}>
          {EXPERIMENTS.map((e) => {
            const status = getStatus(e.id);
            const m = STATUS_META[status];
            return (
              <Card key={e.id} className={cn("flex flex-col gap-2", m.border)}>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-ursa-gold-text shrink-0">
                      {e.id}
                    </span>
                    <span className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast truncate">
                      {e.name}
                    </span>
                  </div>
                  <Pill tone={m.pillTone}>
                    <span className="inline-flex items-center gap-1">{m.icon}{t(m.labelKey)}</span>
                  </Pill>
                </div>
                <Textarea
                  value={notes[e.id] ?? ""}
                  onChange={(ev) => updateNote(e.id, ev.target.value)}
                  placeholder={t("content.experiments.notes.placeholder", { id: e.id })}
                  className="min-h-[80px] resize-y font-body text-[0.85rem] bg-ursa-foam/50 border-ursa-line-soft focus-visible:ring-ursa-gold"
                />
                <div className="flex items-center justify-between text-[0.72rem] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <NotebookPen size={11} />
                    {notes[e.id] && notes[e.id].trim().length > 0
                      ? t("content.experiments.notes.saved-chars", { n: notes[e.id].trim().length })
                      : t("content.experiments.notes.empty")}
                  </span>
                  <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase">
                    {t("content.experiments.notes.stop-rule-label")} · {e.stopRule}
                  </span>
                </div>
              </Card>
            );
          })}
        </Grid>

        <Callout tone="ok" title={t("content.experiments.notes.callout.title")}>
          {t("content.experiments.notes.callout.body")}
        </Callout>
      </ViewSection>

      {/* Section 7 — Cross-links + dossier ===================================== */}
      <ViewSection>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <DossierLinkBanner moduleId="07-implementation-roadmap-and-kpis" />
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("roadmap")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ursa-dark-roast text-ursa-cream hover:bg-ursa-medium-roast transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
            >
              <ArrowRight size={14} /> {t("content.experiments.section.crossref.button-roadmap")}
            </button>
            <button
              onClick={() => navigate("calculator")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ursa-gold/60 text-ursa-gold-text hover:bg-ursa-gold hover:text-ursa-dark-roast transition font-label text-[0.74rem] tracking-[0.1em] uppercase"
            >
              <Banknote size={14} /> {t("content.experiments.section.crossref.button-calculator")}
            </button>
          </div>
        </div>

        <ArtNouveauDivider />

        <Grid cols={4}>
          <StatBlock
            value={String(EXPERIMENTS.length)}
            label={t("content.experiments.section.crossref.stat.1")}
            tone="forest"
          />
          <StatBlock
            value={String(activeCount)}
            label={t("content.experiments.section.crossref.stat.2")}
            tone="gold"
          />
          <StatBlock
            value={`${PEN(costSummary.minTotal)}–${PEN(costSummary.maxTotal)}`}
            label={t("content.experiments.section.crossref.stat.3")}
            tone="terracotta"
          />
          <StatBlock
            value={`${graduatedPct}%`}
            label={t("content.experiments.section.crossref.stat.4")}
            tone="forest"
          />
        </Grid>
      </ViewSection>
    </>
  );
}

// ---- Experiment card ---------------------------------------------------------
function ExperimentCard({
  experiment,
  status,
  onStatusChange,
}: {
  experiment: {
    id: string;
    name: string;
    hypothesis: string;
    cost: string;
    metric: string;
    stopRule: string;
  };
  status: Status;
  onStatusChange: (next: Status) => void;
}) {
  const { t } = useI18n();
  const m = STATUS_META[status];
  return (
    <Card className={cn("flex flex-col gap-3", m.border)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-ursa-gold-text">
              {experiment.id}
            </span>
            <Pill tone={m.pillTone}>
              <span className="inline-flex items-center gap-1">{m.icon}{t(m.labelKey)}</span>
            </Pill>
          </div>
          <h4 className="font-display text-[1.15rem] font-semibold text-ursa-dark-roast m-0 leading-snug">
            {experiment.name}
          </h4>
        </div>
      </div>

      {/* Hypothesis */}
      <div className="rounded-lg bg-ursa-foam/60 border border-ursa-line-soft px-3.5 py-3">
        <span className="font-label text-[0.6rem] tracking-[0.14em] uppercase text-muted-foreground block mb-1">
          {t("content.experiments.card.hypothesis")}
        </span>
        <p className="text-[0.9rem] text-ursa-dark-roast leading-relaxed m-0">
          {experiment.hypothesis}
        </p>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-1 gap-2.5">
        <div className="flex items-baseline gap-2.5">
          <span className="inline-flex items-center gap-1.5 font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground shrink-0 w-20">
            <Banknote size={11} /> {t("content.experiments.card.cost")}
          </span>
          <Pill tone="gold">{experiment.cost}</Pill>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="inline-flex items-center gap-1.5 font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground shrink-0 w-20">
            <Target size={11} /> {t("content.experiments.card.metric")}
          </span>
          <span className="text-[0.86rem] text-ursa-forest-deep leading-snug">
            {experiment.metric}
          </span>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="inline-flex items-center gap-1.5 font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground shrink-0 w-20">
            <Crosshair size={11} /> {t("content.experiments.card.stop-rule")}
          </span>
          <span className="text-[0.84rem] text-ursa-terracotta-text italic leading-snug">
            {experiment.stopRule}
          </span>
        </div>
      </div>

      {/* Status selector */}
      <div className="mt-auto pt-3 border-t border-ursa-line-soft">
        <label className="font-label text-[0.62rem] tracking-[0.14em] uppercase text-muted-foreground block mb-1.5">
          {t("content.experiments.card.status")}
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {STATUS_ORDER.map((s) => {
            const sm = STATUS_META[s];
            const isActive = status === s;
            return (
              <button
                key={s}
                onClick={() => onStatusChange(s)}
                aria-pressed={isActive}
                title={t(sm.labelKey)}
                className={cn(
                  "inline-flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-md border font-label text-[0.6rem] tracking-[0.1em] uppercase transition",
                  isActive
                    ? cn(sm.bg, sm.border, sm.text, "shadow-sm")
                    : "bg-card border-ursa-line-soft text-muted-foreground hover:border-ursa-gold/50 hover:text-ursa-dark-roast"
                )}
              >
                {sm.icon}
                {t(sm.labelKey)}
              </button>
            );
          })}
        </div>
        <p className="text-[0.72rem] text-muted-foreground mt-2 mb-0">
          {t(`content.experiments.card.status.${status}`)}
        </p>
      </div>
    </Card>
  );
}
