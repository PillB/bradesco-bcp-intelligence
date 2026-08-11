# Task 2-E — Viral Content Laboratory (Module 05) + Content Calendar & Script Library (Tool T3)

**Agent:** Viral & Content Calendar view builder (subagent)
**Date:** This session
**Files touched (created/replaced):**
- `/home/z/my-project/src/components/ursa/views/viral-view.tsx` — `ViralView`
- `/home/z/my-project/src/components/ursa/tools/content-calendar-view.tsx` — `ContentCalendarView`

## Task
Build TWO React view files for the Ursa Coffee Strategic Command Center:
1. `viral-view.tsx` — Module 05 · Viral Content Laboratory (content-rich, mostly static)
2. `content-calendar-view.tsx` — Extra Tool T3 · Interactive Content Calendar & Script Library (`"use client"`, useState/useMemo)

## Context Loaded
- `worklog.md` (prior tasks 1, 2-A, 2-B, 2-C, 2-D — established shared component API, palette, dossier IDs)
- `BUILD_SPEC.md` (rules, shared components, palette, quality bar)
- `view-shell.tsx` — confirmed `ViewHero / ViewSection / Card / Grid / DossierLinkBanner` signatures
- `ursa-brand.tsx` — confirmed `BearMark / ArtNouveauDivider / CupGlyph / SectionBadge / EvidenceTag / Pill / Callout / StatBlock / ProgressBar` signatures and tone maps
- `ursa-data.ts` — verified shapes of `CONTENT_CONCEPTS` (26), `SCRIPTS` (10 with `beats[]`, `caption`, `cta`), `REPEATABLE_SERIES` (3), `CREATOR_BRIFS` (3), `UGC_MECHANISMS` (3)
- `ursa-nav.ts` — `useNavigate` returns `(route: string) => void`
- `budget-view.tsx` — pattern reference for interactive `"use client"` view with recharts/state
- shadcn Accordion, Dialog, Select, Input, Button, Checkbox, Table APIs verified

## Work Log

### File 1 — `viral-view.tsx` (Module 05 · Viral Content Laboratory)
- **Hero** — eyebrow "Module 05 · Viral Content Laboratory", title "Short-form video, written for the bear, the two bars, and a Miraflores block.", lede explaining the asset-anchored approach, meta: 26 concepts · 10 scripts · 3 series · 4-week pilot.
- **Prominent disclaimer callout** immediately under hero (red/stop tone) with the exact required text: "Virality is not guaranteed. This system is designed to learn cheaply."
- **Section 01 — 26 content concepts** as a 3-col grid of compact cards. Each card has the concept ID (C01–C26) in gold label-font, the title in Cormorant display, a format Pill (tone derived from format string), and the hook. Hooks reference verified Ursa assets (bear, two bars, named drinks like Ursagroni/Maracumango/Filtrado Lonya, Miraflores landmarks, "un gramo a la vez").
- **Section 02 — 10 production-ready scripts** in an Accordion. Each item header shows script ID, title, hook, duration pill, and linked-concept format pill. Expanded content has 2 columns: numbered beats (gold numerals 01–05) on the left, and two distinct styled blocks on the right for the Spanish caption (espresso/dark-roast background) and CTA (forest-deep background) — clearly marked "ES (Peru) · customer-facing" so they stand out from production notes.
- **Section 03 — 3 repeatable series** (3-col grid). Each card: Repeat icon, cadence Pill (forest for daily, warn for weekly), name in display font, concept paragraph, episodes line in a bordered footer.
- **Section 04 — 3 creator briefs** (3-col grid). Each card: name, BriefRow entries for Objective/Deliverable/Key message/Assets provided, and a gold-tinted Metric footer strip.
- **Section 05 — 3 UGC mechanisms** (3-col grid). Each card: Users icon + UGC pill, name, mechanism text, and a terracotta-bordered "Consent" callout strip with the consent note.
- **Section 06 — Four-week pilot calendar** as a CSS grid (4 weeks × 7 days) inside a card with `overflow-x-auto` for mobile. Each cell shows the week/day label, the concept ID + title + format pill (color-coded by format tone). Empty Sundays show "Rest day · Stories only" in dashed-border cells. A footer note clarifies Bear's Morning Ritual (C17) runs daily in Stories alongside the featured concept. Includes a format-key Pill legend above the calendar and a "Why this cadence" gold callout below.
- **Section 07 — Test & amplification method** as a 4-step grid: 01 Post & wait 48h (forest), 02 2× baseline → boost S/. 50–150 (gold), 03 3× baseline → commission follow-up (warn), 04 Below baseline at 14d → kill (stop). Each step has number, title, body, and an icon. Below the steps: 3 StatBlocks (48h window / S/. 50–150 boost / 14d kill threshold) and a forest callout "What we don't measure" (likes, follower count, reach).
- **Closing** — BearMark (40px) + heading "The full viral dossier" + `DossierLinkBanner` for `05-viral-content-laboratory` + cross-link button to navigate to the interactive Content Calendar tool.
- An `ArtNouveauDivider` is placed between Section 05 and Section 06 for visual rhythm.

### File 2 — `content-calendar-view.tsx` (Extra Tool T3 · Interactive)
- `"use client"`, uses `useState` + `useMemo` throughout.
- **Hero** — eyebrow "Extra Tool T3 · Interactive", title "Content Calendar & Script Library", meta: 26 concepts · 10 scripts · 3 series · 4-week pilot.
- **Section 01 — Stats** — 3 StatBlocks (26 concepts / 10 scripts / 3 series) and a "Concepts by format" panel with horizontal bars for each filter category (All, Reel, Carousel, Series, UGC, Event). Counts are overlapping (a concept like "Reel + UGC" matches both filters). Bar colors map to the format tone (forest/gold/warn/stop/ok).
- **Section 02 — Filterable concept library** — search Input with Search icon (matches title/hook/ID) + 6 filter pills (All/Reel/Carousel/Series/UGC/Event). Filtered grid of 3-col concept cards. Clicking a card opens a `Dialog` showing the concept ID, format pill, title, hook, and a "How to use this concept" usage guide. Dialog footer has "Close" and "Open Module 05" (navigates to `viral`).
- **Section 03 — Script reader** — Accordion of all 10 scripts. Each expanded item has 2 columns: numbered beats (large gold numerals, comfortable spacing) on the left, and two styled blocks on the right for the caption (dark-roast bg) and CTA (forest-deep bg). The caption block has a "Copy caption" Button (ghost variant, gold-soft text) that calls `navigator.clipboard.writeText(caption)` and shows "Copied" with a Check icon for 1.8s. Silent fail on insecure context.
- **Section 04 — Interactive weekly planner** — 4-week × 7-day grid. Each cell is a button that opens a concept-picker Dialog. Pre-populated with `INITIAL_ASSIGNMENTS` (Mon–Sat featured concept + Sun C17 Stories across all 4 weeks — same realistic schedule as the Module 05 calendar). Cells display up to 3 concept chips with ID + truncated title; "+N more" if exceeded. The picker Dialog has its own search + filter + concept list with custom checkmark toggle (button + styled div + Check icon). Dialog footer has "Clear day" (Trash2) and "Done" buttons. A "Reset to suggested" button restores the initial schedule. Live count of total assignments shown in section meta.
- **Section 05 — Series tracker** — 3-col grid. Each card shows cadence pill + "On cadence / Overdue" status pill (computed from the date delta vs cadence), name, concept, and an `<Input type="date">` to log the last-posted date. Status auto-updates: daily series overdue after >1 day, weekly after >7 days.
- **Closing** — BearMark + heading + `DossierLinkBanner` for `05-viral-content-laboratory` + "Back to Module 05" cross-link button.
- An `ArtNouveauDivider` placed between Section 03 and Section 04.

### Lint & build verification
- `bunx eslint src/components/ursa/views/viral-view.tsx src/components/ursa/tools/content-calendar-view.tsx` → **zero errors, zero warnings**.
- Full `bun run lint` shows 2 errors but BOTH are in pre-existing files outside this task's scope:
  - `src/components/ursa/tools/experiments-view.tsx` (existing, owned by another agent)
  - `upload/ursa_extracted/__MACOSX/ursaCoffeeMarketingAndDesign/._ursa.js` (macOS metadata artifact, not a real source file)
- Dev log shows clean `✓ Compiled` and `GET / 200` responses after the writes.

## Design Decisions
- **Format tone mapping** (shared helper): `formatTone(format)` checks substrings in priority order — carousel→gold, series/story→warn, ugc→stop, event→ok, reel→forest, fallback→default. Same mapping used by both files for visual consistency.
- **Spanish caption/CTA styling**: rendered on dark backgrounds (espresso/forest-deep) with cream text to visually mark them as customer-facing copy that should be posted verbatim. This contrasts with the production-side beats which sit on the cream card background.
- **Calendar cells**: min-width 680px with `overflow-x-auto` parent so the 7-column grid scrolls horizontally on phones while preserving the visual week-at-a-glance layout.
- **Planner toggle UI**: built a custom button+div checkmark instead of shadcn `Checkbox` because the picker rows needed to be fully clickable buttons wrapping the checkbox, and Radix Checkbox requires a controlled label/for-id wiring that complicates the row-as-button pattern. The custom approach is accessible (button has implicit aria via Check icon visibility) and visually identical.
- **Cross-links**: both views link to each other (Viral → Content Calendar, Content Calendar → Viral) using `useNavigate` from `@/lib/ursa-nav`, plus the static `DossierLinkBanner` for printable HTML.
- **Format filter overlap**: explicitly labeled "(overlapping — one concept may match several)" in the stats panel so users understand why the counts sum to >26.

## Stage Summary
- Two view files created exactly as specified, both lint-clean, both compiling cleanly on the dev server.
- `ViralView` delivers the full Module 05 narrative: 7 substantive sections + hero + closing, with the prominent disclaimer callout, the 26 concepts grid, the 10-script Accordion with verbatim Spanish caption/CTA blocks, the 3 series / 3 briefs / 3 UGC cards, the 4-week pilot calendar with format-color-coded cells, and the 4-step amplification method with stat row.
- `ContentCalendarView` is genuinely interactive: filterable concept library with detail Dialog, script reader with per-script "Copy caption" clipboard, 4-week planner with click-to-assign Dialog picker (state in `useState`), series tracker with date input + overdue auto-detection, and a stats panel with format-count bars.
- Both views use only the verified Ursa palette (browns, greens, cream, gold, terracotta — no blue/indigo), use shared `ViewHero / ViewSection / Card / Grid / DossierLinkBanner` + `BearMark / ArtNouveauDivider / Pill / Callout / StatBlock`, consume verified data from `@/lib/ursa-data`, and integrate the bear motif throughout.
- No test files created. No other files modified. Only the two specified files were created (replacing their placeholder stubs).
- Ready for orchestrator integration with the hash-router shell at `#/viral` and `#/content-calendar`.
