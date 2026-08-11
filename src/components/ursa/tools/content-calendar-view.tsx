"use client";

import { useState, useMemo } from "react";
import type { ComponentType } from "react";
import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import {
  BearMark,
  ArtNouveauDivider,
  Pill,
  Callout,
  StatBlock,
} from "../ursa-brand";
import {
  CONTENT_CONCEPTS,
  SCRIPTS,
  REPEATABLE_SERIES,
} from "@/lib/ursa-data";
import { useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Copy,
  Check,
  Trash2,
  ClipboardList,
  ArrowRight,
  BookOpen,
  Microscope,
  Target,
  Lightbulb,
  Eye,
  Video,
  CalendarDays,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Concept = (typeof CONTENT_CONCEPTS)[number];

const FILTERS = ["All", "Reel", "Carousel", "Series", "UGC", "Event"] as const;
type FilterKey = (typeof FILTERS)[number];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKS = 4;

function formatTone(
  format: string
): "default" | "forest" | "gold" | "warn" | "stop" | "ok" {
  const f = format.toLowerCase();
  if (f.includes("carousel")) return "gold";
  if (f.includes("series") || f.includes("story")) return "warn";
  if (f.includes("ugc")) return "stop";
  if (f.includes("event")) return "ok";
  if (f.includes("reel")) return "forest";
  return "default";
}

function matchesFilter(format: string, filter: FilterKey): boolean {
  if (filter === "All") return true;
  return format.toLowerCase().includes(filter.toLowerCase());
}

// Pre-populated planner schedule (Mon–Sat featured concept, Sun Stories)
const INITIAL_ASSIGNMENTS: Record<string, string[]> = (() => {
  const a: Record<string, string[]> = {};
  const sched: [number, number, string][] = [
    [0, 0, "C01"], [0, 1, "C10"], [0, 2, "C03"], [0, 3, "C04"], [0, 4, "C05"], [0, 5, "C15"],
    [1, 0, "C09"], [1, 1, "C26"], [1, 2, "C06"], [1, 3, "C11"], [1, 4, "C13"], [1, 5, "C16"],
    [2, 0, "C14"], [2, 1, "C21"], [2, 2, "C18"], [2, 3, "C12"], [2, 4, "C22"], [2, 5, "C07"],
    [3, 0, "C19"], [3, 1, "C24"], [3, 2, "C25"], [3, 3, "C08"], [3, 4, "C20"], [3, 5, "C23"],
  ];
  sched.forEach(([w, d, id]) => {
    a[`${w}-${d}`] = [id];
  });
  for (let w = 0; w < WEEKS; w++) {
    a[`${w}-6`] = ["C17"];
  }
  return a;
})();

function conceptById(id: string): Concept | undefined {
  return CONTENT_CONCEPTS.find((c) => c.id === id);
}

export function ContentCalendarView() {
  const navigate = useNavigate();
  const { t } = useI18n();

  // Filter state for concept library
  const [filter, setFilter] = useState<FilterKey>("All");
  const [query, setQuery] = useState("");
  const [dialogConcept, setDialogConcept] = useState<Concept | null>(null);

  // Copy caption state (per-script)
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Planner state
  const [assignments, setAssignments] = useState<Record<string, string[]>>(
    INITIAL_ASSIGNMENTS
  );
  const [plannerDay, setPlannerDay] = useState<string | null>(null);
  const [plannerFilter, setPlannerFilter] = useState<FilterKey>("All");
  const [plannerQuery, setPlannerQuery] = useState("");

  // Series tracker state
  const [seriesLog, setSeriesLog] = useState<Record<string, string>>({});

  // Filtered concept library
  const filteredConcepts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CONTENT_CONCEPTS.filter((c) => {
      if (!matchesFilter(c.format, filter)) return false;
      if (q && !`${c.title} ${c.hook} ${c.id}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filter, query]);

  // Format counts (overlapping — a concept may match several formats)
  const formatCounts = useMemo(
    () =>
      FILTERS.map((f) => ({
        filter: f,
        count:
          f === "All"
            ? CONTENT_CONCEPTS.length
            : CONTENT_CONCEPTS.filter((c) => matchesFilter(c.format, f)).length,
      })),
    []
  );

  // Planner day parsing
  const plannerParts = plannerDay ? plannerDay.split("-").map(Number) : [0, 0];
  const plannerWeekNum = plannerParts[0] ?? 0;
  const plannerDayNum = plannerParts[1] ?? 0;
  const dayAssignments = plannerDay ? assignments[plannerDay] ?? [] : [];

  const plannerFiltered = useMemo(() => {
    const q = plannerQuery.trim().toLowerCase();
    return CONTENT_CONCEPTS.filter((c) => {
      if (!matchesFilter(c.format, plannerFilter)) return false;
      if (q && !`${c.title} ${c.hook} ${c.id}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [plannerFilter, plannerQuery]);

  const toggleConcept = (id: string) => {
    if (!plannerDay) return;
    setAssignments((prev) => {
      const cur = prev[plannerDay] ?? [];
      const next = cur.includes(id)
        ? cur.filter((x) => x !== id)
        : [...cur, id];
      return { ...prev, [plannerDay]: next };
    });
  };

  const clearDay = () => {
    if (!plannerDay) return;
    setAssignments((prev) => ({ ...prev, [plannerDay]: [] }));
  };

  const resetPlanner = () => setAssignments(INITIAL_ASSIGNMENTS);

  const totalAssigned = useMemo(
    () => Object.values(assignments).reduce((sum, arr) => sum + arr.length, 0),
    [assignments]
  );

  // Copy caption — silent fail on insecure context
  const copyCaption = async (scriptId: string, caption: string) => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopiedId(scriptId);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      /* no-op */
    }
  };

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.content-calendar.eyebrow")}
        title={<>{t("content.view.content-calendar.title")}</>}
        lede={<>{t("content.content-calendar.hero.lede")}</>}
        meta={[
          { label: t("content.content-calendar.meta.concepts"), value: "26" },
          { label: t("content.content-calendar.meta.scripts"), value: "10" },
          { label: t("content.content-calendar.meta.series"), value: "3" },
          { label: t("content.content-calendar.meta.pilot"), value: t("content.content-calendar.meta.pilot-value") },
        ]}
      />

      {/* Section 01 — Stats */}
      <ViewSection
        badge={t("content.content-calendar.section.1.badge")}
        title={t("content.content-calendar.section.1.title")}
        meta={t("content.content-calendar.section.1.meta")}
      >
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <Card className="p-5">
            <StatBlock
              value="26"
              label={t("content.content-calendar.stat.concepts")}
              tone="forest"
            />
          </Card>
          <Card className="p-5">
            <StatBlock
              value="10"
              label={t("content.content-calendar.stat.scripts")}
              tone="gold"
            />
          </Card>
          <Card className="p-5">
            <StatBlock
              value="3"
              label={t("content.content-calendar.stat.series")}
              tone="terracotta"
            />
          </Card>
        </div>
        <div className="bg-card border border-ursa-line-soft rounded-xl p-5">
          <div className="font-label text-[0.66rem] tracking-[0.16em] uppercase text-muted-foreground mb-3">
            {t("content.content-calendar.section.1.formats-label")}
          </div>
          <div className="space-y-2.5">
            {formatCounts.map((f) => {
              const pct = (f.count / CONTENT_CONCEPTS.length) * 100;
              const tone =
                f.filter === "All" ? "forest" : formatTone(f.filter);
              const barColor: Record<string, string> = {
                forest: "bg-ursa-forest-deep",
                gold: "bg-ursa-gold",
                warn: "bg-ursa-gold-soft",
                stop: "bg-ursa-terracotta",
                ok: "bg-ursa-forest",
                default: "bg-muted-foreground/40",
              };
              return (
                <div key={f.filter} className="flex items-center gap-3">
                  <div className="w-20 font-label text-[0.66rem] tracking-[0.14em] uppercase text-ursa-medium-roast">
                    {t(`content.content-calendar.filter.${f.filter.toLowerCase()}`)}
                  </div>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        barColor[tone]
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-10 text-right font-display text-[0.95rem] font-semibold text-ursa-dark-roast">
                    {f.count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-6">
          <Callout tone="gold" title={t("content.content-calendar.section.1.callout-title")}>
            {t("content.content-calendar.section.1.callout-body")}
          </Callout>
        </div>
      </ViewSection>

      {/* Section 02 — Filterable concept library */}
      <ViewSection
        badge={t("content.content-calendar.section.2.badge")}
        title={t("content.content-calendar.section.2.title")}
        meta={t("content.content-calendar.section.2.meta", { n: filteredConcepts.length })}
      >
        <p className="text-[0.95rem] text-muted-foreground max-w-[68ch] mb-5 m-0">
          {t("content.content-calendar.section.2.intro")}
        </p>
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder={t("content.content-calendar.section.2.search-placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "font-label text-[0.66rem] tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border transition",
                    active
                      ? "bg-ursa-dark-roast text-ursa-cream border-ursa-dark-roast"
                      : "bg-card text-ursa-medium-roast border-ursa-line hover:border-ursa-gold hover:text-ursa-gold-text"
                  )}
                >
                  {t(`content.content-calendar.filter.${f.toLowerCase()}`)}
                </button>
              );
            })}
          </div>
        </div>

        {filteredConcepts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-ursa-line rounded-xl">
            {t("content.content-calendar.section.2.empty")}
          </div>
        ) : (
          <Grid cols={3}>
            {filteredConcepts.map((c) => (
              <button
                key={c.id}
                onClick={() => setDialogConcept(c)}
                className="text-left bg-card border border-ursa-line-soft rounded-xl p-5 hover:border-ursa-gold hover:shadow-[0_8px_24px_-12px_rgba(59,36,23,0.28)] transition group flex flex-col gap-3 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-label text-[0.7rem] tracking-[0.18em] uppercase text-ursa-gold-text">
                    {c.id}
                  </span>
                  <Pill tone={formatTone(c.format)}>{c.format}</Pill>
                </div>
                <h3 className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast leading-snug m-0">
                  {c.title}
                </h3>
                <p className="text-[0.85rem] text-muted-foreground leading-relaxed m-0 line-clamp-3">
                  {c.hook}
                </p>
                <span className="mt-auto text-[0.7rem] font-label tracking-[0.14em] uppercase text-ursa-gold-text opacity-0 group-hover:opacity-100 transition">
                  {t("content.content-calendar.section.2.view-details")}
                </span>
              </button>
            ))}
          </Grid>
        )}

        <Dialog
          open={!!dialogConcept}
          onOpenChange={(o) => !o && setDialogConcept(null)}
        >
          <DialogContent className="sm:max-w-[560px]">
            {dialogConcept && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-label text-[0.7rem] tracking-[0.18em] uppercase text-ursa-gold-text">
                      {dialogConcept.id}
                    </span>
                    <Pill tone={formatTone(dialogConcept.format)}>
                      {dialogConcept.format}
                    </Pill>
                  </div>
                  <DialogTitle className="font-display text-[1.4rem] text-ursa-dark-roast">
                    {dialogConcept.title}
                  </DialogTitle>
                </DialogHeader>
                <div>
                  <div className="font-label text-[0.66rem] tracking-[0.18em] uppercase text-ursa-forest-deep mb-2">
                    {t("content.content-calendar.section.2.dialog.hook-label")}
                  </div>
                  <p className="text-[0.95rem] text-ursa-dark-roast leading-relaxed m-0">
                    {dialogConcept.hook}
                  </p>
                </div>
                <div className="bg-ursa-cream/60 rounded-lg p-4 border border-ursa-line-soft">
                  <div className="font-label text-[0.66rem] tracking-[0.16em] uppercase text-muted-foreground mb-2">
                    {t("content.content-calendar.section.2.dialog.use-label")}
                  </div>
                  <ul className="text-[0.85rem] text-ursa-dark-roast space-y-1.5 list-disc pl-4 m-0">
                    <li>{t("content.content-calendar.section.2.dialog.use-1")}</li>
                    <li>{t("content.content-calendar.section.2.dialog.use-2")}</li>
                    <li>{t("content.content-calendar.section.2.dialog.use-3")}</li>
                    <li>{t("content.content-calendar.section.2.dialog.use-4")}</li>
                  </ul>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogConcept(null)}>
                    {t("content.content-calendar.section.2.dialog.close")}
                  </Button>
                  <Button
                    onClick={() => {
                      setDialogConcept(null);
                      navigate("viral");
                    }}
                  >
                    {t("content.content-calendar.section.2.dialog.open-module")}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </ViewSection>

      {/* Section 03 — Script reader */}
      <ViewSection
        badge={t("content.content-calendar.section.3.badge")}
        title={t("content.content-calendar.section.3.title")}
        meta={t("content.content-calendar.section.3.meta")}
      >
        <p className="text-[0.95rem] text-muted-foreground max-w-[68ch] mb-5 m-0">
          {t("content.content-calendar.section.3.intro")}
        </p>
        <Accordion
          type="single"
          collapsible
          className="bg-card border border-ursa-line-soft rounded-xl px-5"
        >
          {SCRIPTS.map((s) => {
            const concept = conceptById(s.concept);
            return (
              <AccordionItem key={s.id} value={s.id} className="border-0">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-start gap-4 flex-1 text-left">
                    <span className="font-label text-[0.7rem] tracking-[0.18em] uppercase text-ursa-gold-text mt-1 shrink-0">
                      {s.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-[1.1rem] font-semibold text-ursa-dark-roast leading-snug">
                        {s.title}
                      </div>
                      <div className="text-[0.88rem] text-muted-foreground mt-1">
                        {s.hook}
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Pill tone="default">{s.duration}</Pill>
                        {concept && (
                          <Pill tone={formatTone(concept.format)}>
                            {concept.format}
                          </Pill>
                        )}
                        <Pill tone="forest">Linked: {s.concept}</Pill>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-2 gap-6 pt-2">
                    <div>
                      <div className="font-label text-[0.66rem] tracking-[0.18em] uppercase text-ursa-forest-deep mb-3">
                        {t("content.content-calendar.section.3.beats-label")}
                      </div>
                      <ol className="list-none space-y-2.5 m-0 p-0">
                        {s.beats.map((b, i) => (
                          <li
                            key={i}
                            className="flex gap-3 text-[0.95rem] leading-relaxed"
                          >
                            <span className="font-display font-semibold text-ursa-gold-text w-6 shrink-0 text-base">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-ursa-dark-roast">{b}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="bg-ursa-dark-roast text-ursa-cream rounded-lg p-4 border border-ursa-espresso">
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <div className="font-label text-[0.66rem] tracking-[0.18em] uppercase text-ursa-gold-text-soft">
                            {t("content.content-calendar.section.3.caption-label")}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-ursa-gold-text-soft hover:text-ursa-cream hover:bg-ursa-espresso/40"
                            onClick={() => copyCaption(s.id, s.caption)}
                          >
                            {copiedId === s.id ? (
                              <>
                                <Check size={14} className="mr-1" />
                                {t("content.content-calendar.section.3.copied-button")}
                              </>
                            ) : (
                              <>
                                <Copy size={14} className="mr-1" />
                                {t("content.content-calendar.section.3.copy-button")}
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="font-body text-[1rem] leading-relaxed m-0">
                          {s.caption}
                        </p>
                      </div>
                      <div className="bg-ursa-dark-roast text-ursa-cream rounded-lg p-4">
                        <div className="font-label text-[0.66rem] tracking-[0.18em] uppercase text-ursa-leaf mb-2">
                          {t("content.content-calendar.section.3.cta-label")}
                        </div>
                        <p className="font-body text-[1rem] leading-relaxed m-0">
                          {s.cta}
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ViewSection>

      <ArtNouveauDivider />

      {/* Section 04 — Interactive weekly planner */}
      <ViewSection
        badge={t("content.content-calendar.section.4.badge")}
        title={t("content.content-calendar.section.4.title")}
        meta={t("content.content-calendar.section.4.meta", { n: totalAssigned })}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <p className="text-[0.9rem] text-muted-foreground max-w-[64ch] m-0">
            {t("content.content-calendar.section.4.intro")}
          </p>
          <Button variant="outline" size="sm" onClick={resetPlanner}>
            <ClipboardList size={14} className="mr-2" />
            {t("content.content-calendar.section.4.reset")}
          </Button>
        </div>

        <div className="bg-card border border-ursa-line-soft rounded-xl p-4 md:p-6 overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 min-w-[680px]">
            {DAYS.map((d) => (
              <div
                key={d}
                className="font-label text-[0.66rem] tracking-[0.16em] uppercase text-ursa-medium-roast text-center pb-2 border-b border-ursa-line-soft"
              >
                {t(`content.content-calendar.day.${d}`)}
              </div>
            ))}
            {[...Array(WEEKS)].map((_, w) =>
              DAYS.map((_, d) => {
                const key = `${w}-${d}`;
                const ids = assignments[key] ?? [];
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setPlannerDay(key);
                      setPlannerFilter("All");
                      setPlannerQuery("");
                    }}
                    className="text-left rounded-lg p-2.5 border min-h-[110px] flex flex-col gap-1.5 hover:border-ursa-gold hover:shadow-[0_4px_12px_-4px_rgba(59,36,23,0.2)] transition bg-ursa-cream/30 cursor-pointer"
                    style={{
                      borderColor:
                        ids.length > 0
                          ? "var(--color-ursa-line)"
                          : "var(--color-ursa-line-soft)",
                      borderStyle: ids.length > 0 ? "solid" : "dashed",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
                        {t("content.content-calendar.section.4.cell-label", {
                          week: w + 1,
                          day: t(`content.content-calendar.day.${DAYS[d]}`),
                        })}
                      </span>
                      {ids.length > 0 && (
                        <span className="font-label text-[0.55rem] tracking-[0.1em] uppercase text-ursa-gold-text">
                          {ids.length}
                        </span>
                      )}
                    </div>
                    {ids.length === 0 ? (
                      <span className="text-[0.7rem] text-muted-foreground italic mt-auto">
                        {t("content.content-calendar.section.4.add-concept")}
                      </span>
                    ) : (
                      <div className="flex flex-col gap-1 mt-auto">
                        {ids.slice(0, 3).map((id) => {
                          const c = conceptById(id);
                          if (!c) return null;
                          return (
                            <div
                              key={id}
                              className="text-[0.72rem] leading-tight line-clamp-2"
                            >
                              <span className="font-label text-[0.55rem] text-ursa-gold-text mr-1">
                                {c.id}
                              </span>
                              <span className="text-ursa-dark-roast">{c.title}</span>
                            </div>
                          );
                        })}
                        {ids.length > 3 && (
                          <span className="text-[0.65rem] text-muted-foreground">
                            {t("content.content-calendar.section.4.more", {
                              n: ids.length - 3,
                            })}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-ursa-line-soft text-[0.78rem] text-muted-foreground">
            <strong className="text-ursa-dark-roast">
              {t("content.content-calendar.section.4.tip-prefix")}
            </strong>{" "}
            {t("content.content-calendar.section.4.tip-body")}
          </div>
        </div>

        {/* Planner day dialog */}
        <Dialog
          open={!!plannerDay}
          onOpenChange={(o) => !o && setPlannerDay(null)}
        >
          <DialogContent className="sm:max-w-[640px] max-h-[88vh] overflow-hidden flex flex-col">
            {plannerDay && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-[1.3rem] text-ursa-dark-roast">
                    {t("content.content-calendar.section.4.dialog-title", {
                      week: plannerWeekNum + 1,
                      day: t(`content.content-calendar.day.${DAYS[plannerDayNum]}`),
                    })}
                  </DialogTitle>
                  <DialogDescription>
                    {t("content.content-calendar.section.4.dialog-desc", {
                      n: dayAssignments.length,
                    })}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      placeholder={t("content.content-calendar.section.4.dialog-search-placeholder")}
                      value={plannerQuery}
                      onChange={(e) => setPlannerQuery(e.target.value)}
                      className="pl-9 h-8"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {FILTERS.map((f) => (
                      <button
                        key={f}
                        onClick={() => setPlannerFilter(f)}
                        className={cn(
                          "font-label text-[0.6rem] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full border transition",
                          plannerFilter === f
                            ? "bg-ursa-dark-roast text-ursa-cream border-ursa-dark-roast"
                            : "bg-card text-ursa-medium-roast border-ursa-line hover:border-ursa-gold"
                        )}
                      >
                        {t(`content.content-calendar.filter.${f.toLowerCase()}`)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="overflow-y-auto flex-1 -mx-1 px-1 space-y-1.5 max-h-[50vh]">
                  {plannerFiltered.map((c) => {
                    const checked = dayAssignments.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleConcept(c.id)}
                        className={cn(
                          "w-full text-left flex items-start gap-3 rounded-lg p-3 border transition cursor-pointer",
                          checked
                            ? "border-ursa-gold bg-ursa-gold/10"
                            : "border-ursa-line-soft hover:border-ursa-gold/60"
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0",
                            checked
                              ? "bg-ursa-gold border-ursa-gold"
                              : "border-ursa-line"
                          )}
                        >
                          {checked && (
                            <Check size={12} className="text-ursa-dark-roast" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="font-label text-[0.62rem] tracking-[0.16em] uppercase text-ursa-gold-text">
                              {c.id}
                            </span>
                            <Pill
                              tone={formatTone(c.format)}
                              className="text-[0.55rem] px-1.5 py-0.5"
                            >
                              {c.format}
                            </Pill>
                          </div>
                          <div className="text-[0.9rem] font-medium text-ursa-dark-roast leading-snug">
                            {c.title}
                          </div>
                          <div className="text-[0.78rem] text-muted-foreground leading-snug line-clamp-2">
                            {c.hook}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={clearDay}>
                    <Trash2 size={14} className="mr-2" />
                    {t("content.content-calendar.section.4.dialog-clear")}
                  </Button>
                  <Button onClick={() => setPlannerDay(null)}>
                    {t("content.content-calendar.section.4.dialog-done")}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </ViewSection>

      {/* Section 05 — Series tracker */}
      <ViewSection
        badge={t("content.content-calendar.section.5.badge")}
        title={t("content.content-calendar.section.5.title")}
        meta={t("content.content-calendar.section.5.meta")}
      >
        <p className="text-[0.9rem] text-muted-foreground max-w-[64ch] mb-5 m-0">
          {t("content.content-calendar.section.5.intro")}
        </p>
        <Grid cols={3}>
          {REPEATABLE_SERIES.map((s) => {
            const lastPosted = seriesLog[s.name] ?? "";
            const overdue = (() => {
              if (!lastPosted) return true;
              const cadenceDays = s.cadence
                .toLowerCase()
                .includes("daily")
                ? 1
                : 7;
              const d = new Date(lastPosted);
              const diff = Math.floor(
                (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)
              );
              return diff > cadenceDays;
            })();
            return (
              <Card key={s.name} className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <Pill
                    tone={s.cadence.toLowerCase().includes("daily") ? "forest" : "warn"}
                  >
                    {s.cadence}
                  </Pill>
                  <Pill tone={overdue ? "stop" : "ok"}>
                    {overdue
                      ? t("content.content-calendar.section.5.overdue")
                      : t("content.content-calendar.section.5.on-cadence")}
                  </Pill>
                </div>
                <h3 className="font-display text-[1.1rem] font-semibold text-ursa-dark-roast m-0">
                  {s.name}
                </h3>
                <p className="text-[0.85rem] text-muted-foreground leading-relaxed m-0">
                  {s.concept}
                </p>
                <div className="border-t border-ursa-line-soft pt-3 mt-auto">
                  <div className="font-label text-[0.62rem] tracking-[0.16em] uppercase text-muted-foreground mb-1.5">
                    {t("content.content-calendar.section.5.last-posted-label")}
                  </div>
                  <Input
                    type="date"
                    value={lastPosted}
                    onChange={(e) =>
                      setSeriesLog((prev) => ({
                        ...prev,
                        [s.name]: e.target.value,
                      }))
                    }
                    className="h-9 text-[0.85rem]"
                  />
                  <div className="text-[0.7rem] text-muted-foreground mt-1.5">
                    {lastPosted
                      ? `${t("content.content-calendar.section.5.last-prefix")} ${new Date(lastPosted).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}`
                      : t("content.content-calendar.section.5.not-logged")}
                  </div>
                </div>
              </Card>
            );
          })}
        </Grid>

        <Callout tone="gold" title={t("content.content-calendar.section.5.callout-title")}>
          {t("content.content-calendar.section.5.callout-body")}
        </Callout>
      </ViewSection>

      {/* ============================================================
          SCIENCE — the research behind the calendar
         ============================================================ */}
      <ViewSection
        badge={t("content.content-calendar.science.badge")}
        title={t("content.content-calendar.science.title")}
        meta={t("content.content-calendar.science.meta")}
      >
        <p className="text-[0.92rem] text-muted-foreground max-w-[78ch] m-0 mb-6">
          {t("content.content-calendar.science.intro")}
        </p>

        {/* Group 1 — Content marketing science */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-ursa-gold-text" />
          {t("content.content-calendar.science.group.content-marketing")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {SCIENCE_MARKETING.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        {/* Group 2 — Short-form video effectiveness */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <Video size={16} className="text-ursa-gold-text" />
          {t("content.content-calendar.science.group.video")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
          {SCIENCE_VIDEO.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        {/* Group 3 — Calendar methodology */}
        <h3 className="font-display text-lg font-semibold text-ursa-dark-roast mt-2 mb-3 flex items-center gap-2">
          <CalendarDays size={16} className="text-ursa-gold-text" />
          {t("content.content-calendar.science.group.methodology")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
          {SCIENCE_METHOD.map((s) => (
            <ScienceCard key={s.id} id={s.id} icon={s.icon} tone={s.tone} />
          ))}
        </div>

        <Callout tone="gold" title={t("content.content-calendar.science.synthesis.title")}>
          {t("content.content-calendar.science.synthesis.body")}
        </Callout>
      </ViewSection>

      {/* Closing */}
      <ViewSection className="border-b-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <BearMark size={40} className="text-ursa-dark-roast shrink-0 mt-1" />
            <div>
              <h3 className="font-display text-[1.4rem] font-semibold text-ursa-dark-roast mb-2 m-0">
                {t("content.content-calendar.closing.title")}
              </h3>
              <p className="text-[0.9rem] text-muted-foreground max-w-[58ch] m-0">
                {t("content.content-calendar.closing.body")}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start md:items-end">
            <DossierLinkBanner moduleId="05-viral-content-laboratory" />
            <button
              onClick={() => navigate("viral")}
              className="inline-flex items-center gap-2 text-[0.8rem] text-ursa-gold-text hover:text-ursa-dark-roast transition font-label tracking-[0.12em] uppercase"
            >
              {t("content.content-calendar.closing.back")}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </ViewSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Science cards — research that backs the Content Calendar view.
// Strings live under content.content-calendar.science.card.{id}.{field} in
// i18n.ts.
// ---------------------------------------------------------------------------

type ScienceTone = "gold" | "forest" | "terracotta";

type ScienceEntry = {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone: ScienceTone;
};

const SCIENCE_MARKETING: ScienceEntry[] = [
  { id: "cmi-2024", icon: Target, tone: "forest" },
  { id: "pulizzi-2012", icon: BookOpen, tone: "gold" },
  { id: "hall-2014", icon: Sparkles, tone: "forest" },
  { id: "coschedule-2024", icon: Microscope, tone: "gold" },
];

const SCIENCE_VIDEO: ScienceEntry[] = [
  { id: "cisco-2022", icon: Video, tone: "forest" },
  { id: "wyzowl-2024", icon: Eye, tone: "gold" },
  { id: "reels-benchmarks", icon: Target, tone: "terracotta" },
  { id: "three-second-hook", icon: Lightbulb, tone: "gold" },
];

const SCIENCE_METHOD: ScienceEntry[] = [
  { id: "editorial-calendar", icon: BookOpen, tone: "forest" },
  { id: "batching", icon: Clock, tone: "gold" },
  { id: "seasonal-timing", icon: CalendarDays, tone: "terracotta" },
];

function ScienceCard({
  id,
  icon: Icon,
  tone,
}: {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone: ScienceTone;
}) {
  const { t } = useI18n();
  const toneClasses: Record<ScienceTone, string> = {
    gold: "bg-ursa-gold/10 text-ursa-gold-text border-ursa-gold/30",
    forest: "bg-ursa-dark-roast/10 text-ursa-forest-deep border-ursa-forest-deep/25",
    terracotta: "bg-ursa-terracotta/10 text-ursa-terracotta-text border-ursa-terracotta/30",
  };
  const accentBorder: Record<ScienceTone, string> = {
    gold: "border-ursa-gold/40",
    forest: "border-ursa-forest-deep/35",
    terracotta: "border-ursa-terracotta/40",
  };
  return (
    <Card className="flex flex-col gap-2 p-4 h-full">
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "w-8 h-8 rounded-lg grid place-items-center shrink-0 border",
            toneClasses[tone],
          )}
        >
          <Icon size={16} />
        </span>
        <div className="min-w-0">
          <h4 className="font-display text-[0.98rem] font-semibold text-ursa-dark-roast m-0 leading-tight">
            {t(`content.content-calendar.science.card.${id}.name`)}
          </h4>
          <p className="font-label text-[0.58rem] tracking-[0.14em] uppercase text-muted-foreground m-0 mt-0.5">
            {t(`content.content-calendar.science.card.${id}.source`)}
          </p>
        </div>
      </div>
      <div className={cn("border-l-2 pl-2.5 py-1", accentBorder[tone])}>
        <p className="text-[0.82rem] italic text-ursa-dark-roast m-0 leading-snug">
          {t(`content.content-calendar.science.card.${id}.finding`)}
        </p>
      </div>
      <p className="text-[0.84rem] leading-relaxed text-foreground/85 m-0">
        {t(`content.content-calendar.science.card.${id}.apply`)}
      </p>
    </Card>
  );
}
