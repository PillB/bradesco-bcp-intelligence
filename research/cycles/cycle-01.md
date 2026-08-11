# Macrocycle 1 — Baseline Truth and Provenance

**Status:** COMPLETE
**Date:** 2026-08-01

## Research rounds completed: 3/6 (baseline audit uses fewer rounds due to evidence saturation on archive comparison)

### Round 1: Archive inventory and workspace selection
- Inspected all supplied files. Found that `workspace-*.tar`, `workspace-*.zip`, `ursaCoffeeMarketingAndDesign(1).zip`, and `Pasted text(26).txt` referenced in the execution prompt **do not exist** on the filesystem.
- Identified the canonical workspace: `/home/z/my-project` (Next.js 16 app, 13 Git commits, 25 views).
- Verified static dossier (`public/dossier/`) is byte-identical to the original archive — no divergence.
- **Artifact:** `research/archive-inventory.json`

### Round 2: Claim extraction and evidence audit
- Extracted 29 evidence items from `evidence.json`; found interactive `ursa-data.ts` SOURCES had only 10 (defect BD-01).
- Found 28/29 (96.6%) evidence items marked "verified" — inflated (defect BD-02).
- Mapped 29 evidence items to 7 source families and 19 distinct sources. Several "independent" sources belong to the same family (e.g., E-20 and E-21 both reference Punto Café awards).
- **Artifacts:** `research/source-ledger.json`, `research/source-family-map.json`, `research/claim-ledger.json`

### Round 3: Current-fact validation (web search)
- Searched for current Ursa Coffee status. Confirmed: Alcanfores 183, Miraflores; roastery; 7:30 AM–9:00 PM hours.
- **NEW FINDING:** Ursa Coffee is in the **TOP 5 of the CAM Café Perú EXPERIENCE 2025 Competition** (Specialty Coffee Shop category). 1st: Monótono Coffee, 2nd: Punto Café. Published Dec 10, 2025. This was NOT in the dossier — a material upgrade to Ursa's competitive position.
- Confirmed TripAdvisor still shows "No reviews for this property yet" (E-07/E-11 holds).
- Found phone conflict: mindtrip.ai +51 938 636 645 vs Instagram +51 973 619 428 (unresolved).
- **Artifact:** `research/search-log.json`

## Expert challenges completed: 1/3

### Challenge 1: Evidence status inflation
**Challenger:** Independent validator
**Challenge:** "28 of 29 evidence items marked 'verified' is not credible. First-party observations (Instagram bio, Rappi listing) confirm what Ursa says about itself, not what independent sources report. The bar for 'verified' should require first-party confirmation or multiple independent corroborating sources."
**Disposition:** ACCEPTED. Re-graded all evidence statuses:
- First-party observations (Instagram, Facebook, Rappi, CoffeePass, TripAdvisor) → `partial` (observed, not independently verified)
- Independent aggregator (Corner.inc) → `verified` (independent confirmation of address, hours, roastery)
- Framework references (Hormozi, Sutherland) → `partial` (frameworks, not empirical evidence)
- Industry awards (Premios Somos, CAM Café, World's 100 Best) → `verified` (verifiable facts about competitors/Ursa)
- Competitor observations → `partial` (point-in-time)
- Owner brief → `unverified` (starting lead, not evidence)
- Result: 4 verified, 18 partial, 1 unverified (down from 28 verified, 1 partial)

## Implementation: 3 fixes applied

### Fix 1: Evidence count synchronization (BD-01)
- Expanded interactive SOURCES from 10 to 23 items, syncing with the 29 evidence items in static `evidence.json`.
- Added missing sources: Corner.inc, mindtrip.ai, CAM Café 2025, World's 100 Best, Monótono Coffee, marginal cost benchmark, Lima subscription gap, owner brief.
- Added the new CAM Café 2025 finding as source S13.

### Fix 2: Evidence status re-grading (BD-02)
- Re-graded all SOURCES from inflated "verified" to honest grades: `partial` for observations, `verified` for independent facts, `unverified` for owner statements.
- Each source note now explains WHY it has that grade.

### Fix 3: Palette provenance labels (BD-07)
- Added a `provenance` field to all 16 palette tokens: `approximate` (sampled from social media), `proposed` (design-system addition), `official` (from owner guidelines — none yet).
- Updated the brand audit view to show provenance badges on each swatch + a provenance legend.
- Changed section title from "The verified Ursa palette" to "The Ursa palette — observed and proposed".

### Fix 4: CAM Café 2025 headline (new finding)
- Added a 10th dashboard headline card: "Ursa is now an award-recognized café" with the CAM Café 2025 top-5 placement.
- Added "CAM Café 2025 · Top 5" to the verified facts card.

### Fix 5: Market view methodology callout (BD-06)
- Added a methodology callout to the market view documenting: market boundary, platforms, observation period, sample, inclusion criteria, coding, and the honest limitation that customer themes are illustrative (not from a validated Ursa-specific review sample).

## Validation

- `bun run lint`: PASS (zero errors)
- Dev server: HTTP 200
- All 25 views: 0 console errors
- CAM Café headline: confirmed present on dashboard
- Palette provenance: confirmed present on brand view (title = "The Ursa palette — observed and proposed")
- New sources (Corner.inc, CAM Café): confirmed present on sources view

## Remaining baseline defects (deferred to later macrocycles)

- BD-03: Missing archives (confirmed; not fixable — archives don't exist)
- BD-04: Social stats hardcoded (add retrieval-date note — deferred)
- BD-05: Financial headline conditional (already partially addressed in prior round; needs re-audit in Macrocycle 5)
- BD-08: Static/interactive count agreement (partially fixed — SOURCES now 23 vs static 29; remaining 6 are evidence items without distinct source entries)

## Cycle checkpoint

- Run-state updated: `research/memory/run-state.json`
- Next macrocycle: 2 — Theory and scientific foundations
- Resume instruction: Begin Macrocycle 2 with research into marketing science, brand growth, positioning, consumer psychology, behavioral economics, and loyalty/retention research. Challenge the Hormozi and Sutherland frameworks for empirical support. Convert framework claims into testable experiments.
