# Task 2-B · Market & Competitor Views Agent

**Agent:** Subagent 2-B (Market + Competitor Intelligence views)
**Task:** Build two React view files for the Ursa Coffee Strategic Command Center:
1. `src/components/ursa/views/market-view.tsx` — `MarketView` (Module 02 — Market, Competitors & Customer Voice)
2. `src/components/ursa/tools/competitors-view.tsx` — `CompetitorsView` (Extra Tool T2 — Competitor Intelligence Dashboard, interactive)

## Context reviewed
- `/home/z/my-project/worklog.md` — project overview, tech stack, hash-route map.
- `/home/z/my-project/BUILD_SPEC.md` — shared components (`ViewHero`, `ViewSection`, `Card`, `Grid`, `DossierLinkBanner`, `BearMark`, `ArtNouveauDivider`, `Pill`, `Callout`, `StatBlock`, `SectionBadge`, `EvidenceTag`, `ProgressBar`), data (`COMPETITORS`, `CUSTOMER_VOICE`, `URSA_FACTS`), palette, typography classes, quality bar.
- `src/components/ursa/view-shell.tsx`, `src/components/ursa/ursa-brand.tsx` — confirmed API surface.
- `src/components/ui/table.tsx`, `select.tsx`, `input.tsx` — confirmed shadcn primitives.
- `src/lib/ursa-nav.ts` — `useNavigate()` + `ROUTES`.
- `src/components/ursa/views/dashboard-view.tsx`, `tools/calculator-view.tsx` — pattern reference for hero/section/Card usage.

## Files produced

### 1. `market-view.tsx` (`MarketView`)
Sections (in order):
1. **Hero** — eyebrow "Module 02 · Market, Competitors & Customer Voice"; meta = 10 competitors, Miraflores + Lima, snapshot 2026-08-01.
2. **At-a-glance stats** — 4 StatBlocks: competitors tracked, Miraflores presence, with-website count, ownable positions.
3. **Competitor landscape** — 3-col grid of CompetitorCard for each of 10 COMPETITORS; each shows name, area (MapPin), strength, weakness, Ursa implication callout, and a Pill for hasWebsite.
4. **Ownable space analysis** — 2-col split: narrative + Callout ("orthogonality principle") + "Who owns what" Card listing Punto Café=awards, Neira=scale, Bisetti=escuela, Puku Puku=microlotes, Terrua=premium tasting, Ursa=the bear (gold-highlighted).
5. **Customer voice** — 2-col grid rendering CUSTOMER_VOICE (4 themes); each Card has icon + label, theme title, bulleted points.
6. **Conversion to action** — 6 ActionCards in a 3-col grid: Standards to match, Problems to avoid, Areas to lead, CX improvements, Product opportunities, Marketing proof points. Each traceable to a finding.
7. **The website gap** — terracotta Callout naming all 5 main Miraflores competitors (Punto Café, Neira, Terrua, True Artisan, Café Verde) with websites; Ursa has none. Marked as 30-day priority. Buttons navigate to Brand Audit and Competitor Dashboard.
8. **Dossier link** — `DossierLinkBanner` for `02-market-competitors-and-customer-voice` + verified evidence tag.

### 2. `competitors-view.tsx` (`CompetitorsView`)
Interactive dashboard with `"use client"`, `useState`, `useMemo`:
1. **Hero** — eyebrow "Extra Tool T2 · Interactive"; title "Competitor Intelligence Dashboard".
2. **Summary stats** — 4 StatBlocks: total competitors, with website, Miraflores presence, Ursa distinctiveness score (qualitative %).
3. **Filter controls** — Card with search Input (by name), Select for area (All/Miraflores/Barranco/Multiple Lima/Lima), Select for website (All/Yes/No). Live status pills + Reset button. Ursa stays pinned at top of every filter result.
4. **Comparison matrix** — shadcn Table inside an overflow-x-auto Card; columns Name, Area, Strength, Weakness, Ursa Implication, Website. Name/Area/Website headers are sortable (toggle asc/desc). Ursa's row is gold-highlighted with a BearMark and pinned. Local Coffee icon component (since lucide-react's Coffee was unused elsewhere in this file).
5. **Positioning matrix** — 2D quadrant visualization. CSS-positioned dots inside an aspect-square container with crosshair axes and four quadrant labels. Each competitor plotted on Scale (x) vs Craft identity (y). Ursa marked with BearMark and gold dot. Side panel: "How to read this" card + "open quadrant" Callout.
6. **Head-to-head cards** — 3-col grid for each of 10 competitors. Each Card: name, area, Pill with verdict (lead=ok/green, match=warn/gold, trail=stop/terracotta), implication in colored panel, one-line verdict description.
7. **Synthesis** — 2 callouts: website gap (stop) + bear uncontested (forest) + navigation buttons to Market module and Brand Audit.
8. **Dossier link** — `DossierLinkBanner` for `02-market-competitors-and-customer-voice`.

## Implementation notes
- `URSA_PROFILE` constant added to give the comparison table a baseline Ursa row (hasWebsite: false).
- `VERDICT` map qualitatively codes each competitor's Ursa implication.
- `MATRIX_POSITIONS` map records qualitative scale (0-100) and craft (0-100) scores per competitor; Ursa placed at (12, 95) — high-craft, low-scale.
- `SortIcon` defined at module scope (not inside render) to satisfy `react-hooks/static-components` lint rule.
- `matchesArea` helper: "Miraflores" filter matches any area containing "Miraflores" (covers "Miraflores", "Miraflores + 3 more", "Miraflores cluster"); other filters exact-match.
- Sort keeps Ursa pinned to the top of the table regardless of sort key/direction.
- All Ursa palette classes used (no blue/indigo). Bear mark, Art Nouveau dividers, terracotta/gold/forest tones throughout.
- Mobile: table scrolls horizontally; matrix uses aspect-square; grids collapse from 3-col to 1-col; filter controls stack.

## Quality checks
- `bun run lint` — both files pass cleanly (the only remaining lint error is an unrelated macOS metadata file at `upload/ursa_extracted/__MACOSX/._ursa.js`, not in scope).
- Dev server compiles without errors for these views; `GET / 200` confirmed.
- Every section has substantive, sourced content (no placeholders).
- All competitor claims traceable to `COMPETITORS` / `CUSTOMER_VOICE` data in `@/lib/ursa-data`.

## Stage summary
Both files complete and lint-clean. MarketView renders a full 8-section narrative module. CompetitorsView renders an interactive dashboard with working filters, sortable table, quadrant matrix, and color-coded head-to-head cards. Ready for orchestrator integration.
