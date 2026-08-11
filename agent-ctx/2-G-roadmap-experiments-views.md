# Task 2-G — Roadmap View + Experiments Tracker

**Agent:** Subagent 2-G (Roadmap + Experiment Tracker builder)
**Task:** Build TWO React view files for the Ursa Coffee Strategic Command Center:
1. `src/components/ursa/views/roadmap-view.tsx` — `RoadmapView` (Module 07 · Implementation Roadmap & KPIs)
2. `src/components/ursa/tools/experiments-view.tsx` — `ExperimentsView` (Extra Tool T4 · Interactive Experiment Tracker)

## Work Log

### Context gathering
- Read `/home/z/my-project/worklog.md` (full) for prior agent work — established shared component API, palette, layout pattern, and quality bar set by Tasks 2-A → 2-D.
- Read `/home/z/my-project/BUILD_SPEC.md` for the standard view contract, data exports, and Ursa palette tokens.
- Inspected shared components: `view-shell.tsx` (ViewHero, ViewSection, Card, Grid, DossierLinkBanner) and `ursa-brand.tsx` (BearMark, ArtNouveauDivider, CupGlyph, SectionBadge, EvidenceTag, Pill, Callout, StatBlock, ProgressBar).
- Inspected `ursa-nav.ts` for the `useNavigate` hash-router API and the `experiments` + `roadmap` + `calculator` + `budget` + `roi` route keys.
- Read `ursa-data.ts` for the four data exports I'd consume: `ROADMAP` (4 phases), `TWELVE_MONTH_ROADMAP` (4 quarters), `BUDGET_SCENARIOS` (lean/moderate/growth), and `EXPERIMENTS` (11 tracked tests with id/name/hypothesis/cost/metric/stopRule/status).
- Confirmed shadcn `Table`, `Button`, `Textarea`, `Select` primitives are installed; only `Button` + `Textarea` ultimately needed (the status selector became a 4-button segmented control for clearer UX and zero Select/useState coupling overhead).
- Read `growth-view.tsx` (sections 8–11 + closing stat row + navigate buttons) as the established pattern for cross-tool navigation and the spirit-preservation callout.
- Read `budget-view.tsx` for interactive localStorage-free pattern, and `competitors-view.tsx` for the filterable-table + 2D matrix pattern.

### File 1 — `src/components/ursa/views/roadmap-view.tsx` (`RoadmapView`, `"use client"`)
Twelve sections exactly as the task specified:

1. **Hero** — eyebrow "Module 07 · Implementation Roadmap & KPIs", forest tone. Title "An owned, not aspirational, 90-day plan — with owners, metrics, and stop rules." Meta: "72h / 30 / 60 / 90 day plans", "12-month roadmap", "Owners, metrics, stop rules".
2. **Section 01 · First 72 hours** — renders `ROADMAP[0]` as a PhasePhase card (terracotta accent) with 5 numbered commitments (claim GBP, photograph bars, print story cards, set up WhatsApp, brief first creator). Includes a "Why these five, in this order" terracotta callout explaining the no-vendor constraint.
3. **Section 02 · 30-day plan** — `ROADMAP[1]` as gold-accented PhasePhase.
4. **Section 03 · 60-day plan** — `ROADMAP[2]` as forest-accented PhasePhase.
5. **Section 04 · 90-day plan** — `ROADMAP[3]` as forest-accented PhasePhase + a "Day 90 graduation ritual" callout linking to the Experiment Tracker + navigate buttons to `experiments` and `calculator`.
6. **Section 05 · 12-month innovation roadmap** — `TWELVE_MONTH_ROADMAP` rendered as 4 Cards (Q1 highlighted) with quarter, theme, focus, and a layer label ("Foundations ship first" / "Distribution layer" / "Continuity layer" / "Commercial layer"). Plus a forest callout on the single-theme-per-quarter discipline.
7. **Section 06 · Budget scenarios summary** — `BUDGET_SCENARIOS` rendered as 3 cards (Moderate highlighted). Each card shows monthlyPEN StatBlock, progress bar relative to Growth baseline, focus text, top-4 line items with PEN costs, and a phase-tag footer ("Funds the 30/60/90-day plan"). Navigate buttons to `budget` (gold) and `roi` (forest outline).
8. **Section 07 · Owners & dependencies** — shadcn Table with 8 workstreams (Brand & Identity, Content & Social, Paid Media, Creator Programme, Delivery (Rappi), Community & Events, Retail Beans, B2B & Wholesale). Columns: Workstream (with icon-medallion), Owner role, Dependency, Primary metric (forest), Stopping rule (terracotta italic). Plus a gold "What this table deliberately does not include" callout explaining no Marketing Director row.
9. **Section 08 · KPI dashboard** — 6 StatBlocks/cards: qualified awareness (profile visits), store visits, average ticket, repeat visits, referrals, distinctive brand recognition. Each card shows metric label, EvidenceTag (unverified — honest), baseline (Unknown) → day-90 target (color-coded), and a methodology note. Plus a forest callout on why baselines are honestly Unknown.
10. **Section 09 · Skeptical revision log** — 3 round cards (Round 1 gold = subscription viability → added cannibalization model; Round 2 forest = bear too childish → confirmed as asset; Round 3 terracotta = 90 days realistic → scoped down to owned channels first). Each card shows Challenge + What changed. Plus a gold "Round 4 is yours" callout keeping the log open.
11. **Section 10 · Final spirit-preservation verdict** — full-bleed forest-deep gradient panel with Art Nouveau texture overlay, BearMark, headline "The plan preserves the bear, the gram, and the green", and three preserve pills (Bear / Gram / Green). Below: 3 cards for the permanent system (Level 1), 6-month reversible skin (Level 2), seasonal only (Level 3).
12. **Section 11** — DossierLinkBanner for `07-implementation-roadmap-and-kpis` + navigate buttons to `experiments`, `calculator`, `budget` + ArtNouveauDivider + closing StatBlock row (72h / 90d / 11 experiments / 8 workstreams).

PhasePhase is a module-scope sub-component (so it satisfies the React Compiler static-components rule) taking `{ phase, meta, index }`.

### File 2 — `src/components/ursa/tools/experiments-view.tsx` (`ExperimentsView`, `"use client"`)
Seven sections, fully interactive with localStorage persistence:

1. **Hero** — eyebrow "Extra Tool T4 · Interactive", forest tone. Title "Experiment Tracker — eleven tests, four outcomes, one source of truth." Meta: experiments count, statuses enumeration, "localStorage (per device)".
2. **Section 01 · Status** — 4 StatBlocks (total / proposed / running / graduated) + 2 detail cards (Status legend explaining each of the 4 statuses; Graduation rate with a forest progress bar showing passed+killed % of 11).
3. **Section 02 · Filter** — 5 toggle buttons (All / Proposed / Running / Passed / Killed) each showing live count + a Reset all button (terracotta outline) that clears both statuses and notes. Active state uses forest-deep background.
4. **Section 03 · Board** — all 11 `EXPERIMENTS` rendered as 2-col grid of `ExperimentCard` sub-components. Each card: ID + status pill (top), name (display), hypothesis (foam-tinted block), three meta rows (Cost pill, Metric forest, Stop rule terracotta italic), and a 4-button segmented status selector at the bottom (Proposed → Running → Passed → Killed) with active state color-coded (gold/forest/forest-deep/terracotta). Each button has aria-pressed and a contextual hint text below. Empty-state card if filter yields zero.
5. **Section 04 · Budget** — 3 cards: highlighted live cost-summary StatBlock showing min–max PEN exposure across all Proposed + Running experiments (with count); a "What is counted" card; an "Honest caveats" card with navigate button to `calculator` for EXP-11. Plus a forest callout on the cheapest experiment (EXP-02 GBP, free).
6. **Section 05 · Timeline** — 90-day Gantt-like CSS grid. Day axis at top (Day 0/15/30/45/60/75/90), 11 rows (one per experiment), each with a label column (EXP-XX + name) and a 90-day track with phase gridlines at 30/60/90 + an absolutely-positioned bar colored by current status. Bars show "d{start}–{end}" label. Killed bars are 50% opacity. Legend below. Includes a warn callout on why some bars are short.
7. **Section 06 · Notes** — 2-col grid of 11 cards, one per experiment. Each has ID + status pill + name + a Textarea (auto-saved to localStorage) + a footer showing char count and stop rule. Plus an ok callout on "a note is worth a thousand dashboards".
8. **Section 07** — DossierLinkBanner + navigate buttons to `roadmap` and `calculator` + ArtNouveauDivider + 4 closing StatBlocks (total / active / cost range / graduated %).

### State + persistence architecture
- Built a `usePersistentState<T>(key, initial)` hook using `useSyncExternalStore` (the React 18 canonical pattern for external mutable stores).
- Subscribes to both the native `storage` event (cross-tab) and a custom `ursa-local-storage-change` event (same-tab, dispatched on every `setValue` because the native storage event only fires in *other* windows/tabs).
- `getServerSnapshot` returns `""` so SSR renders with `initial` and the client re-hydrates cleanly without setState-in-effect (avoids the `react-hooks/set-state-in-effect` lint error).
- Two stores: `ursa-experiments-status-v1` (Record<id, Status>) and `ursa-experiments-notes-v1` (Record<id, string>).
- All updates functional and immutable; `setValue` accepts both raw values and updater functions.

### Color coding (all in the verified Ursa palette, no blue/indigo)
- **Proposed** = `ursa-gold` (#B8924A)
- **Running** = `ursa-forest-deep` (#2D4A36)
- **Passed** = `ursa-forest-deep` (slightly different bg opacity to distinguish from Running)
- **Killed** = `ursa-terracotta` (#C16E4B)

### Cost parsing
- `parseCost("S/. 1,200–3,000")` → `{ min: 1200, max: 3000 }` via regex on the en-dash range.
- Falls back to single-number parsing for costs like "S/. 0" (EXP-02, EXP-10) → `{ min: 0, max: 0 }`.

### Lint
- `bun run lint` reports zero errors in both new files (only the pre-existing `upload/ursa_extracted/__MACOSX/._ursa.js` parsing error remains, which this agent does not own).
- Resolved a `react-hooks/set-state-in-effect` error by migrating from `useState + useEffect(localStorage.getItem)` to `useSyncExternalStore`.
- Resolved 3 `Unused eslint-disable directive` warnings by removing stale `// eslint-disable-next-line react-hooks/exhaustive-deps` comments (the linter was not actually flagging exhaustive-deps for those useMemo blocks because `getStatus` only depends on `statuses`).
- Dev server logs show clean `✓ Compiled` runs and `GET / 200` after each write.

## Stage Summary
- Two view files created exactly as specified, both with `"use client"` directive and the exact named exports `RoadmapView` and `ExperimentsView`.
- RoadmapView delivers the full Module 07 narrative across 12 substantive sections: hero + 4 phased plans (72h/30/60/90) + 12-month roadmap + budget scenarios + owners table + KPI dashboard + 3-round skeptical revision log + forest spirit-preservation verdict + dossier link.
- ExperimentsView is a genuinely useful interactive tracking tool: 4 StatBlocks summary, 5-way filter, 11 experiment cards with status selectors, cost summary, 90-day Gantt timeline, per-experiment notes textarea, and full localStorage persistence via `useSyncExternalStore` (no setState-in-effect cascading renders).
- Both views consume only the verified Ursa palette (browns, greens, cream, gold, terracotta — no blue/indigo), use the shared ViewHero/ViewSection/Card/Grid/DossierLinkBanner + BearMark/ArtNouveauDivider/Pill/Callout/StatBlock/SectionBadge/EvidenceTag/ProgressBar components, and cross-link to `experiments`, `calculator`, `budget`, `roi`, and `roadmap` where contextually appropriate.
- No test files created. No other files modified. Only the two specified files were touched.
