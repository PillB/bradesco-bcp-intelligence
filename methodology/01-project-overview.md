# 01 — Project Overview

**Project:** Ursa Coffee — Strategic Dossier & Command Center
**Owner workspace:** `/home/z/my-project`
**Canonical URL (dev):** `http://localhost:3000`
**Snapshot date:** 2026-08-01
**Methodology document version:** 1.0

This document is the front cover for the Ursa Coffee methodology series. It
establishes what the project is, where it lives, what stack it runs on, and
the inventory of artifacts a future analyst should expect to find before
opening any of the deeper methodology files (02 → 15).

---

## 1. What the project is

Ursa Coffee — Strategic Dossier & Command Center is a single-route Next.js
web application that serves two functions on one domain:

1. **A browsable, printable static reference dossier** — eight long-form
   HTML modules plus a sources page, copied verbatim into `public/dossier/`
   so an owner or printer can open them at `/dossier/01-brand-audit-and-design-system.html`
   without running JavaScript.
2. **An interactive "command center"** — twenty-five hash-routed React
   views at `/` that present the same strategy as the static dossier, but
   with live calculators, sortable tables, sensitivity matrices, and an
   interactive brand style guide.

The project brief was: *"Build a Next.js command center website for Ursa
Coffee Roasters (Miraflores, Lima) that presents a researched brand,
product, graphic, and marketing plan. Preserves the verified Art Nouveau /
bear / roastery identity. No rebrand."*

The dossier and command center are designed to be **mutually reinforcing**:
every interactive claim in the React app links back to a static dossier
section, and every static dossier recommendation links forward to an
interactive tool the owner can use to test or implement it.

---

## 2. The business

| Field | Value |
|---|---|
| Legal name | Ursa Coffee Roasters |
| Public-facing brand | Ursa Coffee |
| Address | Alcanfores 183, Miraflores, Lima 15074, Peru |
| Approx. coordinates | lat -12.1186, lng -77.0347 (Google-Maps-derived, ±50 m) |
| District | Miraflores |
| City / Country | Lima, Peru |
| Format | In-house roastery + two-bar espresso bar |
| Hours (observed) | Mon–Sat, opens 7:30 am, closes 9:00 pm |
| Instagram | `@ursacoffeeperu` |
| Rappi | Active delivery menu |
| TripAdvisor | Listing exists; ~0 Ursa-specific reviews at snapshot |
| Google Business Profile | Active — aggregator evidence (addagio.io schema.org
  `LocalBusiness.aggregateRating`) shows ~56 Google reviews at 4.5★;
  the prior dossier's "missing/unverified" claim was corrected (see
  methodology 10). |
| Tagline (verified) | "Un gramo a la vez" (Instagram bio) |
| Verified drinks | Ursagroni (espresso-tonic), Maracumango Coldbrew
  (passionfruit + mango), Filtrado Lonya (pour-over, Utcubamba /
  Amazonas), Durazno Clarificado Coldbrew (peach-clarified) |
| Verified pastries | Financier de pera, empanada de carne con bechamel,
  house-made cookies |
| Award status | CAM Café Perú 2025 — top-5 finisher |
| Owner-asset pack | Open question (Q6) — official logo files, brand
  guidelines, and signage assets not yet supplied |

The bear motif, Art Nouveau lean, in-house roastery, and "Un gramo a la
vez" tagline are the four identity markers the dossier commits to
preserving. The dossier explicitly does NOT rebrand; every recommendation
is checked against "the bear, the gram, and the green" before it ships.

---

## 3. Technology stack

| Layer | Choice | Version / Notes |
|---|---|---|
| Framework | Next.js | 16 (App Router) |
| Language | TypeScript | strict |
| Styling | Tailwind CSS | 4 (CSS-first `@theme` config) |
| Components | shadcn/ui | latest; installed via `components.json` |
| Charts | Recharts | ^2.15.4 |
| Icons | lucide-react | latest |
| Package manager | Bun | `bun.lock` |
| Lint | ESLint | flat config (`eslint.config.mjs`) |
| Build target | Static-friendly SSR | App Router with `"use client"` on
  interactive views |
| Dev server | `next dev` | port 3000 |
| Hash router | Custom (`useHashRoute` hook) | The project constraint
  is "single route" — every view is reached via `#/route`, not via a
  Next.js dynamic segment. This keeps deployment on GitHub Pages
  trivial (see methodology 15). |

### 3.1 Design tokens

Ursa brand tokens are defined in `src/app/globals.css` inside a `@theme`
block (NOT `@theme inline` — a prior version broke utility-class
generation; the fix is documented in the worklog under Task FINAL). The
palette is 16 tokens: 5 roast browns (Green Bean → Espresso), 4 greens
(Forest Deep, Forest, Sage, Leaf), 3 creams (Cream, Paper, Foam), 2 golds
(Gold, Gold Soft), 1 Terracotta, 1 Ink. Every palette token carries a
`provenance` field in `src/lib/ursa-data.ts` (official / observed /
approximate / proposed / unknown) — see methodology 03 §3.

Text-safe variants (`--color-ursa-gold-text`, `--color-ursa-terracotta-text`,
`--color-ursa-sage-text`, `--color-ursa-gold-text-soft`) are darker (light
mode) and brighter (dark mode) than the fill tokens; this is the core
contrast strategy documented in methodology 13.

### 3.2 Fonts

| Role | Family | Class |
|---|---|---|
| Display | Cormorant Garamond | `font-display` |
| Body | Inter | `font-sans` |
| Labels | Oswald | `font-label` |

Spanish (Peru) accents are handled by the native fonts — no font
subsetting beyond the standard Latin Extended set is required.

### 3.3 Hash router

`src/hooks/use-hash-route.ts` reads `window.location.hash` and emits the
current route name. `src/app/page.tsx` dispatches on that name and renders
the matching view. There is no Next.js dynamic segment and no `next/link`
prefetch — the constraint is "stay on the single `/` route." The
architecture is portable to GitHub Pages without server rewrites.

---

## 4. The 25 views

The interactive app exposes 25 hash routes:

| # | Route | View | Type |
|---|---|---|---|
| 1 | `#/` | Dashboard | Home |
| 2 | `#/brand` | Brand Audit & Design System | Dossier module 01 |
| 3 | `#/market` | Market, Competitors & Customer Voice | Dossier module 02 |
| 4 | `#/menu` | Menu & Product Development | Dossier module 03 |
| 5 | `#/growth` | Marketing, Growth & Retention | Dossier module 04 |
| 6 | `#/viral` | Viral Content Laboratory | Dossier module 05 |
| 7 | `#/creative` | Creative Campaign Prototypes | Dossier module 06 |
| 8 | `#/roadmap` | Implementation Roadmap & KPIs | Dossier module 07 |
| 9 | `#/calculator` | Subscription Economics Calculator | Dossier module 08 (interactive) |
| 10 | `#/menu-studio` | Menu Engineering Studio | Tool T1 |
| 11 | `#/competitors` | Competitor Intelligence Dashboard | Tool T2 |
| 12 | `#/content-calendar` | Content Calendar & Script Library | Tool T3 |
| 13 | `#/experiments` | Experiment Tracker | Tool T4 |
| 14 | `#/style-guide` | Brand Style Guide Explorer | Tool T5 |
| 15 | `#/budget` | Marketing Budget Allocator | Tool T6 |
| 16 | `#/campaign-builder` | Campaign Builder Wizard | Tool T7 |
| 17 | `#/roi` | ROI Dashboard | Tool T8 |
| 18 | `#/origin-atlas` | Coffee Origin Atlas | Tool T9 |
| 19 | `#/pilot` | Pilot Dashboard | Tool T10 |
| 20 | `#/spirit-checker` | Spirit Checker (bear/gram/green test) | Tool T11 |
| 21 | `#/swot` | SWOT Matrix | Tool T12 |
| 22 | `#/scorecard` | Brand Scorecard | Tool T13 |
| 23 | `#/loyalty` | Loyalty Wallet Card Analysis | Tool T14 |
| 24 | `#/sources` | Sources & Evidence | Methodology |
| 25 | `#/landing` | Customer-facing landing page | Public |

Total: **1 dashboard + 8 dossier modules + 15 interactive tools + 1
landing = 25 views.**

Each view is implemented as a single React component exporting a named
function (e.g. `BrandAuditView`, `CalculatorView`). All interactive
views use the `"use client"` directive. The view files live in:

```
src/components/ursa/views/        ← dossier modules + dashboard + landing + sources
src/components/ursa/tools/        ← the 15 interactive tools
```

The router, header, footer, command palette, and shared primitives live
in `src/components/ursa/`. The data layer is `src/lib/ursa-data.ts`.

---

## 5. The static HTML dossiers in `public/dossier/`

The static dossier is the project's source-of-truth reference document.
It was supplied as `ursaCoffeeMarketingAndDesign.zip` (MD5
`fd10b7830aa1a038f2ffa51c775757d4`, 154 252 bytes) and copied verbatim
into `public/dossier/` so the Next.js app can serve it under `/dossier/`.

Files in `public/dossier/`:

| File | Module |
|---|---|
| `index.html` | Index / cover |
| `01-brand-audit-and-design-system.html` | Module 01 — Brand Audit |
| `02-market-competitors-and-customer-voice.html` | Module 02 — Market |
| `03-menu-and-product-development.html` | Module 03 — Menu |
| `04-marketing-growth-and-retention-plan.html` | Module 04 — Growth |
| `05-viral-content-laboratory.html` | Module 05 — Viral |
| `06-creative-campaign-prototypes.html` | Module 06 — Creative |
| `07-implementation-roadmap-and-kpis.html` | Module 07 — Roadmap |
| `08-subscription-economics-and-calculator.html` | Module 08 — Subscription |
| `sources-and-evidence.html` | Sources & evidence page |
| `assets/ursa.css` | Dossier stylesheet |
| `assets/ursa.js` | Dossier interactive script (calculator) |
| `assets/evidence.json` | 29 evidence items (static side) |
| `assets/experiments.json` | 11 experiment definitions |

The static dossier is **byte-identical** to the supplied archive. The
next methodology file (02) documents the hash comparison.

---

## 6. Research artifacts in `research/`

The `research/` directory is the methodology's evidence layer. Every
file in it is referenced by one or more methodology documents. Inventory:

| File | Purpose | Methodology doc |
|---|---|---|
| `archive-inventory.json` | Structured archive catalog (7 archives + 4 missing) | 02 |
| `baseline-audit.md` | Human-readable baseline audit narrative | 02 |
| `baseline-defects.json` | 8 baseline defects (BD-01 → BD-08) | 02 |
| `claim-ledger.json` | 9 headline claims (CL-001 → CL-009) with grades | 02, 11 |
| `source-ledger.json` | Source-family map (source deduplication) | 02 |
| `source-family-map.json` | Source-family deduplication map | 02 |
| `expert-evidence.json` | 4 frameworks with evidence grades | 11 |
| `expert-challenges.json` | 3 expert challenges (EC-001 → EC-003) | 11 |
| `recommendation-ledger.json` | 10 recommendations × 22-point structure | (used by 12) |
| `competitor-census.json` | CENSUS-1 — 18 competitors, full structure | 09 |
| `unresolved-uncertainties.md` | Open questions / unresolved items | 02 |
| `contrast-harness.js` | Runtime contrast evaluator (DOM-walking) | 13 |
| `pairwise-contrast-test.js` | Pairwise colour-pair contrast tester | 13 |
| `pairwise-results.json` | Output of pairwise test | 13 |
| `qa-validation-report.md` | Cross-device Playwright validation report | 13 |
| `qa-results/contrast-check.js` | Earlier contrast-check script | 13 |
| `qa-results/{device}.txt` | Raw per-device QA output (5 devices) | 13 |
| `qa-results/run-device.sh` | 25-route per-device runner | 13 |
| `search-log.json` | Web-search log for the census + reviews work | 09, 10 |
| `cycles/cycle-01.md` … `cycle-10.md` | Ten-cycle research journal | (background) |
| `memory/run-state.json` | Orchestrator run-state | (background) |

Total research artifacts: 21 files across `research/`, `research/qa-results/`,
and `research/cycles/`.

---

## 7. Git history summary

The repository is `git`-tracked on branch `main`. As of the
methodology snapshot:

- **Total commits:** 29
- **Latest commit:** `19a76a0` (deepen all reports — portmanteau fix + evidence/risk/test)
- **First commit:** `b8931dc` (Initial commit)
- **Working tree state:** clean (all changes committed; the only untracked
  files are the prompt `.txt` archives in `upload/`)

Notable commit milestones (chronological):

1. `b8931dc` — Initial commit (static dossier copied to `public/dossier/`,
   Next.js app skeleton, design-system tokens).
2. `42fcceb` — Macrocycle 1: baseline audit, evidence re-grading, CAM
   Café 2025 finding, palette provenance.
3. `184cc63` — Macrocycle 2: theory and scientific foundations,
   framework re-grading (Ehrenberg-Bass promoted to primary).
4. `cc99ad4` — Macrocycle 3-10: research cycles, EC-003 loyalty claim
   fix, unresolved uncertainties.
5. `6ef137b` — Contrast fixes, overflow fix, review enrichment, QA
   validation.
6. `d98f34e` — Fix hydration mismatch + zero contrast failures across
   all 25 views.
7. `bbdaaba` — Fix bear logo dark mode + darken text tokens for WCAG
   compliance.
8. `286059c` — White bear with pentagon+ shapes, comprehensive pairwise
   contrast test.
9. `ea8ca5e` — Deepen reports: 1km competitor census, outline bear,
   remove green backgrounds.
10. `41d1103` — Deepen all reports: fix portmanteau overclaim, add
    evidence / risk / test to every recommendation.

A subset of intermediate commits carry only orchestrator run-state
metadata (UUIDs); these are bookmark commits between macrocycles.

### 7.1 Reproducing the working tree

```bash
cd /home/z/my-project
git status                      # → "working tree clean"
git log --oneline | wc -l       # → 29
git log --oneline | head -5     # → latest 5 commits
```

### 7.2 The worklog

The full work history is in `/home/z/my-project/worklog.md` (1832 lines).
It is a chronological record of every task, subagent, defect, fix, and
verdict. New methodology work is appended to it under a `---` separator
with a `Task ID:` header.

---

## 8. Cross-references

- For how archives were inspected and hashes compared → **02-archive-workspace-audit.md**
- For brand-element verification and palette contrast → **03-brand-audit-methodology.md**
- For the 1km competitor census method → **09-competitor-census-methodology.md**
- For the customer-review sampling approach → **10-customer-review-methodology.md**
- For how each framework was graded → **11-framework-treatment.md**
- For the subscription calculator formula and stop rules → **12-calculator-validation.md**
- For the WCAG 2.2 contrast harness and pairwise test → **13-accessibility-methodology.md**
- For the Handcrafted Writing Protocol → **14-editorial-protocol.md**
- For the GitHub CLI auth and Pages deployment checklist → **15-deployment-github.md**

---

## 9. Reproducibility checklist

A new analyst opening this project should be able to verify the
following in under five minutes:

```bash
# 1. Workspace is the canonical Next.js app
cd /home/z/my-project
ls src/components/ursa/views/ | wc -l   # → 10 (8 modules + dashboard + sources + landing = 11 actually)
ls src/components/ursa/tools/  | wc -l   # → 15

# 2. Dev server runs
bun run dev                              # → "Ready in ... on http://localhost:3000"
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/  # → 200

# 3. Lint passes
bun run lint                             # → 0 errors (one known exception:
                                         #   research/pairwise-contrast-test.js
                                         #   uses CommonJS require() by design)

# 4. Git is clean
git status                               # → "working tree clean"
git log --oneline | wc -l                # → 29 (or higher if new methodology commits exist)

# 5. Static dossier exists and is identical to the archive
diff -rq upload/ursa_extracted/ursaCoffeeMarketingAndDesign/ public/dossier/
# → (no output if identical; only the assets/evidence.json and experiments.json
#    files match exactly)
md5sum upload/ursaCoffeeMarketingAndDesign.zip
# → fd10b7830aa1a038f2ffa51c775757d4

# 6. Methodology files exist
ls methodology/                          # → 10 files (README + 9 numbered docs)
```

If any of the above fails, the workspace has diverged from the
methodology snapshot and the divergence must be reconciled before
trusting the dossier's claims.
