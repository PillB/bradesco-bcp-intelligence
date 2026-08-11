# Task 2-H — Sources & Evidence View + Origin Atlas Tool

## Task
Build TWO React view files for the Ursa Coffee Strategic Command Center:
1. `/src/components/ursa/views/sources-view.tsx` — `SourcesView` (Appendix · Sources & Evidence)
2. `/src/components/ursa/tools/origin-atlas-view.tsx` — `OriginAtlasView` (Extra Tool T7 · Interactive Coffee Origin Atlas)

## Context Reads
- `/home/z/my-project/worklog.md` (prior tasks 2-A through 2-D)
- `/home/z/my-project/BUILD_SPEC.md` (shared component API, palette, typography, quality bar)
- `src/components/ursa/view-shell.tsx` — ViewHero, ViewSection, Card, Grid, DossierLinkBanner
- `src/components/ursa/ursa-brand.tsx` — BearMark, ArtNouveauDivider, CupGlyph, SectionBadge, EvidenceTag, Pill, Callout, StatBlock, ProgressBar
- `src/lib/ursa-data.ts` — SOURCES (10 entries), OPEN_QUESTIONS (6 entries), URSA_FACTS
- `src/lib/ursa-nav.ts` — useNavigate + ROUTES
- `src/components/ursa/views/market-view.tsx` and `src/components/ursa/tools/competitors-view.tsx` — pattern reference

## Work Log

### File 1 — `sources-view.tsx` (SourcesView, `"use client"`)
All 10 required sections built:
1. **Hero** — eyebrow "Appendix · Sources & Evidence", title "Every claim in this dossier is traceable to a public source.", lede about inferred-vs-flagged and missing-vs-named, meta: Snapshot 2026-08-01 / Public sources only / No proprietary material. `tone="forest"`.
2. **§1 Sources at a glance** — 4 StatBlocks (verified/partial/unverified/gap counts computed from SOURCES) + a forest Callout explaining why gaps don't block launch.
3. **§2 Source list** — `SOURCES` rendered in a 2-col Card grid. Each card: `S1`–`S10` ID (gold label), label, EvidenceTag, clickable URL (opens new tab via `target="_blank" rel="noopener noreferrer"`), note. ArtNouveauDivider closes the section.
4. **§3 Evidence status legend** — 2×2 Card grid with all four EvidenceTag variants as live examples, plus a one-paragraph definition for each (Verified / Partial / Unverified / Gap).
5. **§4 Disambiguation** — prominent stop-tone Callout warning about the unrelated URSA in Bridgeport, CT, USA; followed by a 3-col Card grid: Subject (Ursa Miraflores — highlighted), Unrelated (URSA Bridgeport — dashed border, muted), How to verify (3 confirmations: Miraflores address, @ursacoffeeperu handle, Spanish bio).
6. **§5 Open questions for the owner** — highlighted Card rendering `OPEN_QUESTIONS` as a numbered list with green numbered chips, an intro explaining "single grouped clarification" and that none blocks the 72-hour launch, plus a gold Callout on why these don't gate launch.
7. **§6 Missing business data** — 2-col Card grid listing all 10 missing items (monthly budget, average ticket, best/worst sellers, ingredient cost, gross margin, peak capacity, staff capacity, repeat rate, customer database, campaign history) each with CircleSlash icon + note on how scenarios absorb the gap. Forest Callout closes the section.
8. **§7 Conflicting information** — stacked Cards covering: hours across platforms, follower count fluctuation, TripAdvisor ~0 reviews, cross-platform menu pricing. Each with AlertTriangle icon.
9. **§8 Methodology** — 2-col Card grid with 8 numbered methodology steps (public sources only, Instagram cover sampling, Rappi extraction, CoffeePass cross-reference, TripAdvisor check, competitor website survey, Acquisition.com + FS.blog framework references, Premios Somos + Fresh Cup industry context) + a gold Callout listing 5 things deliberately NOT done.
10. **§9 Structured data files** — 2-col Card grid with `evidence.json` and `experiments.json` linked via custom anchor tags (`/dossier/assets/evidence.json` and `/dossier/assets/experiments.json`, target `_blank`). Each card has icon, description, and an inline link with ExternalLink icon. Forest Callout explains they are the source of truth.
11. **§10 DossierLinkBanner** — for `sources-and-evidence`, plus a "Appendix complete" Pill (forest) and a navigate button to the Experiment Tracker.

### File 2 — `origin-atlas-view.tsx` (OriginAtlasView, `"use client"`, useState + useMemo)
All 8 required sections built:
1. **Hero** — eyebrow "Extra Tool T7 · Interactive", title "Coffee Origin Atlas", lede, meta: 6 plotted origins / Verified: Utcubamba → Filtrado Lonya / Snapshot 2026-08-01. `tone="forest"`.
2. **Origin data** — local `ORIGINS` array with all 6 required Peruvian coffee regions: Utcubamba (Amazonas, 1750m, washed, Bourbon, stone fruit/floral/bright, Filtrado Lonya, verified), Chirinos (Cajamarca, 1650m, washed, Caturra, caramel/citrus/clean), La Coipa (Cajamarca, 1800m, natural, Bourbon, berry/chocolate/heavy body), Satipo (Junín, 1550m, washed, Catimor, nutty/smooth/mild), Quillabamba (Cusco, 1700m, washed, Typica, sweet/apple/balanced), Rodriguez de Mendoza (Amazonas, 1900m, honey, Bourbon, honey/peach/syrupy). Each entry includes hand-written story paragraph, harvest peak, map x/y coordinates, and `verified` flag for Utcubamba.
3. **Interactive map** — custom SVG (viewBox 0 0 320 480) with a stylized Peru polygon path (wide top, diagonal Pacific coast, eastern bulge, SE hook). All 6 origin dots positioned by approximate lat/lng → x/y mapping. Clicking a dot sets `selectedId`. Utcubamba wears a gold ring (verified); selected dot gets a dashed forest selection ring. Country labels (Ecuador/Colombia/Brazil/Bolivia/Chile/Pacific Ocean) and city reference markers (Lima, Cusco) included. Below the map: a fallback list of clickable origin buttons (mobile/accessibility-friendly) for picking origins without clicking dots.
4. **Origin detail panel** — gold-highlighted Card showing selected origin: department eyebrow + (if verified) "Verified · Filtrado Lonya" Pill, region name as h3, BearMark in forest-deep, 2×2 spec grid (altitude, process, varietal, Ursa drink) each in tinted mini-tiles with appropriate icons (Mountain/Droplet/Sparkles/Coffee), tasting notes as gold pills, story paragraph, and a forest Callout describing the selected process (washed/natural/honey).
5. **Flavour wheel** — 6-column CSS grid (Fruit / Floral / Sweet / Nutty / Chocolate / Body-Balance). Each column lists origins whose tasting notes fall in that category as clickable pills. Verified origins (Utcubamba) shown in gold; selected non-verified origin in forest-deep. Clicking a chip loads that origin in the detail panel.
6. **Seasonality** — horizontal-scroll grid (12 months × 6 origins) with cells highlighted when in that origin's harvest window. May–Sep pattern. Verified origin (Utcubamba) highlighted in gold; others in forest-deep. Legend below. Each origin row label is a clickable button that selects that origin.
7. **Altitude comparison** — recharts horizontal BarChart (layout="vertical") with XAxis 1400–2000m domain, YAxis listing origin names, color-coded bars (gold for verified Utcubamba, forest for others), LabelList showing `${altitude}m` to the right of each bar, Tooltip. Followed by a gold Callout explaining altitude's effect on bean density and acidity.
8. **Educational note** — 3-col Card grid (Altitude / Process / Varietal) each with icon, definition, and 3 example Pills. Followed by a forest Callout "How Ursa uses this atlas".
9. **§7 DossierLinkBanner** — for `03-menu-and-product-development` (the menu module is the closest fit since origins feed the menu), plus an "Atlas complete" Pill and onward nav buttons to Menu & Product and Menu Engineering Studio.

### Lint & Compile
- `bun run lint`: zero errors and zero warnings on both new files. (Only remaining project-wide errors are pre-existing: 3 unused eslint-disable warnings in `experiments-view.tsx` and 1 parsing error in `upload/ursa_extracted/__MACOSX/._ursa.js`.)
- `npx eslint` on the two files directly: clean (no output).
- Dev server: multiple `✓ Compiled` entries after writes; `GET / 200` confirms route renders.

### Design discipline
- Both files use only the verified Ursa palette (forest greens, gold, cream, brown, terracotta — NO blue/indigo).
- Both use shared ViewHero / ViewSection / Card / Grid / DossierLinkBanner + BearMark / ArtNouveauDivider / Pill / Callout / StatBlock / EvidenceTag components.
- OriginAtlasView is genuinely interactive: clicking a map dot OR a list button OR a flavour-wheel chip OR a seasonality row label all select the same origin via useState.
- Responsive: mobile-first grids collapse to single column on small screens; the map maintains aspect ratio; the seasonality grid scrolls horizontally on narrow viewports with min-w-[640px].

## Stage Summary
- Both files created with exact named exports (`SourcesView`, `OriginAtlasView`) and `"use client"` directive.
- SourcesView delivers the full appendix: 10 substantive sections covering source list, evidence legend, disambiguation warning, open questions, missing data, conflicts, methodology, structured data files, and the dossier link banner.
- OriginAtlasView is a genuinely interactive atlas: clickable SVG Peru map with verified-origin gold ring, detail panel with specs/story, flavour wheel, harvest seasonality grid, recharts altitude comparison, and an educational primer on altitude/process/varietal.
- Both follow the Ursa palette and shared component API. No test files created. No other files modified.
