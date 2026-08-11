# 03 — Brand Audit Methodology

**Task ID:** METHODOLOGY-DOC (this file)
**Source audit tasks:** 2-A (Brand Audit view), DEEPEN-BRAND-VIRAL-CREATIVE,
BEAR-LOGO-CONTRAST-FIX, WHITE-BEAR-PAIRWISE, BEAR-OUTLINE-FIX, CENSUS-1
**Audit date:** 2026-08-01
**Methodology owner:** brand audit (worklog Task 2-A onward)

This document records how every brand-element claim in the Ursa dossier
was verified, graded, and labeled. It covers: the surfaces inspected
(Instagram, Rappi, TripAdvisor, Corner.inc, CoffeePass), the four-tier
evidence grading system, the five-value provenance labeling system, the
WCAG 2.2 palette contrast calculation method, and the BearMark design
process.

The brand audit itself lives at `#/brand` (view file
`src/components/ursa/views/brand-audit-view.tsx`) with an interactive
companion at `#/style-guide` (`src/components/ursa/tools/style-guide-view.tsx`).
This methodology file is the audit trail behind both views.

---

## 1. Brand-element verification: surfaces inspected

The brand audit verifies each brand element against the public surfaces
where it should be visible. Six surfaces were inspected at the snapshot
date (2026-08-01):

| # | Surface | URL / handle | What it shows | Inspection method |
|---|---|---|---|---|
| 1 | Instagram | `@ursacoffeeperu` | Avatar (bear), bio ("Un gramo a la vez"), post covers, Story covers, Reels | Public profile via search-engine snippet (Instagram returns JS-only SPA; review text recovered from Google/Bing snippets that quote IG posts verbatim) |
| 2 | Rappi | Ursa Coffee Roasters listing | Menu items (drinks, pastries), prices, category structure | Direct page visit |
| 3 | TripAdvisor | Ursa Coffee Roasters (Miraflores) | Listing exists; review count and rating | Mirror inspection (.com, .pe, .es, .mx) |
| 4 | Corner.inc | `corner.inc/place/pqGK5KMpViS2` | Editorial summary (atmosphere, education, quality) | Direct page visit (Vercel security checkpoint bypassed via search snippet) |
| 5 | CoffeePass Perú | brand page listing | Membership-platform presence | Direct page visit |
| 6 | mindtrip.ai | Ursa listing | Aggregated rating (4.8★, 66 reviews) | Direct page visit |

Plus four supporting platforms checked for completeness:

| Platform | Result |
|---|---|
| NovaCircle | AI-generated pros/cons profile (no real user reviews) |
| addagio.io | schema.org `LocalBusiness.aggregateRating`: 4.5★, ~56 Google reviews (used to correct the prior "missing GBP" claim) |
| Lima Gourmet Company | Editorial mention (positive) |
| Barista Magazine (Feb 2025 Lima cafés article) | Ursa NOT mentioned |
| Wanderlog (34 best coffee roasters in Lima) | Ursa NOT in list |

### 1.1 The 8 verified brand elements

Each verified element in the brand audit (`VERIFIED_ELEMENTS` in
`ursa-data.ts`) carries an `evidence` string that cites *where* the
element was verified and *what* was observed. The eight elements:

1. **Bear motif** — appears in the IG avatar (observed 2026-08-01) but is
   NOT visible in the Rappi menu imagery and does NOT appear on the
   TripAdvisor listing photo. The bear is inconsistently applied across
   surfaces.
2. **"Un gramo a la vez" tagline** — verified in the IG bio. Not visible
   on Rappi, TripAdvisor, or Corner.inc.
3. **Two-bar theatre layout** — verified in the IG bio ("dos barras") and
   in the Corner.inc editorial ("visible roasting equipment creates a
   workshop feel"). Not visible on Rappi.
4. **In-house roastery** — verified in IG bio and Corner.inc.
5. **Art Nouveau ornamentation** — observed in 3 of 5 sampled IG Story
   covers (botanical curve) and in post templates. NOT verified on
   physical signage (open question Q6 — owner asset pack).
6. **Brown-to-green palette** — sampled from IG post covers (brown
   headers, green foliage backgrounds). Approximate, not from official
   guidelines.
7. **Ursagroni drink name** — verified on Instagram and Rappi.
8. **Filtrado Lonya drink name** — verified on Instagram and Rappi;
   origin label (Utcubamba, Amazonas, 1,750 m, Bourbon lavado).

### 1.2 The Ehrenberg-Bass "distinctive assets" lens

The brand audit applies the Ehrenberg-Bass distinctive-assets framework
(see methodology 11 §3) to four candidate assets:

1. Bear character
2. Art Nouveau ornamentation
3. "Un gramo a la vez" tagline
4. Brown-to-green palette

Each candidate is scored on two axes — **uniqueness** (verified by the
CENSUS-1 finding: 0 of 18 in-catchment competitors use an animal
character, etc.) and **prevalence** (cross-surface application). The
bear is flagged as a **potential** distinctive asset, not a confirmed
one, because prevalence is unverified. The "promote to distinctive
asset only if" gate requires:

- 90 days of consistent cross-surface application (avatar, menu,
  signage, packaging, receipts), AND
- A customer-recall survey (n ≥ 40) showing ≥ 30% unprompted recall of
  the bear when shown the Ursa logo.

This is a deliberate, Ehrenberg-Bass-faithful application of the
framework: distinctive assets build mental availability through
consistent repetition on two axes. Uniqueness without prevalence is a
creative idea, not a distinctive asset.

---

## 2. The evidence grading system

The audit replaces the inflated `verified` default (see BD-02 in
methodology 02) with a four-tier grading system. Every claim, every
brand element, and every evidence item is labeled with exactly one of
the four grades.

| Grade | Definition | Required evidence | Example |
|---|---|---|---|
| `verified` | First-party confirmation OR multiple independent corroborating sources | Official brand asset, owner-confirmed fact, OR ≥ 2 independent platforms showing the same fact | Ursagroni appears on both Instagram and Rappi → verified |
| `partial` | Single credible source, awaiting corroboration | One platform shows the fact; no contradicting evidence; no second corroborating source yet found | The two-bar layout is in the IG bio but not on Rappi → partial (verified on one surface, gap on another) |
| `unverified` | Observation only, no independent corroboration | An observation (e.g., Instagram bio text, Rappi menu item) that has not been cross-checked against a second source | The "Art Nouveau ornamentation" claim based only on IG Story covers → unverified until physical signage is checked |
| `gap` | No evidence found; explicit absence | Searched for the fact; found nothing | TripAdvisor reviews for Ursa → gap (listing exists but ~0 Ursa-specific reviews) |

### 2.1 How grades are assigned

1. Identify the claim (e.g., "Ursa uses an Art Nouveau ornamentation
   system").
2. List the surfaces inspected (IG, Rappi, TripAdvisor, Corner.inc,
   CoffeePass, mindtrip.ai).
3. For each surface, record: observed / not observed / not applicable.
4. Apply the rule:
   - All "observed" and ≥ 2 surfaces → `verified`
   - All "observed" and 1 surface → `partial`
   - Single observation with no cross-check → `unverified`
   - No surface shows it → `gap`

### 2.2 How grades are displayed

The `EvidenceTag` component (`src/components/ursa/ursa-brand.tsx`)
renders a pill for each grade with the four tones:

| Grade | Pill tone | Icon |
|---|---|---|
| `verified` | `forest` (green) | CheckCircle |
| `partial` | `gold` (amber) | CircleHalf |
| `unverified` | `terracotta` (warm) | AlertCircle |
| `gap` | `muted` (grey) | MinusCircle |

The `Pill` "stop" tone and `EvidenceTag` "unverified" status both use
`text-ursa-terracotta-text` (not `text-ursa-terracotta`) to satisfy
WCAG AA contrast — see methodology 13 §3.

### 2.3 Re-grade audit (post-fix)

After re-grading, the 29 evidence items distribute as:

| Grade | Count | % |
|---|---|---|
| verified | 8 | 28% (down from 96.6%) |
| partial | 11 | 38% |
| unverified | 7 | 24% |
| gap | 3 | 10% |

The drop from 96.6% verified to 28% verified is the single largest
audit correction in the project. It is the foundation for the
"Every claim is traceable; every gap is named" meta-claim (CL-009).

---

## 3. The provenance labeling system

Separate from the *evidence grade* (how well-verified is this claim?) is
the *provenance* of a brand asset (where did this specific value come
from?). The palette tokens in particular need provenance labeling
because some hex values are sampled from social media, some are
proposed, and none are from official owner guidelines.

The five-value provenance system:

| Provenance | Definition | When to use |
|---|---|---|
| `official` | Supplied by the owner in an official brand-guideline document, logo file, or asset pack | Only when the owner asset pack (Q6) is supplied |
| `observed` | Sampled directly from a verified public surface (e.g., eyedropped from an Instagram post) | When the value is read off a real surface but the owner has not confirmed it as canonical |
| `approximate` | Sampled from a low-fidelity source (e.g., a JPEG thumbnail) and adjusted perceptually | When the source image is too compressed to eyedrop precisely; the value is a best-guess |
| `proposed` | Invented by the dossier as a candidate for the owner to confirm or reject | When no public surface shows the value; the dossier proposes it as a starting point |
| `unknown` | Provenance not yet established | Default before the audit runs |

### 3.1 Application to the 16-color palette

Every palette token in `ursa-data.ts` carries a `provenance` field. The
current distribution:

| Token | Hex | Provenance |
|---|---|---|
| Green Bean | `#6F5B3D` | approximate |
| Light Roast | `#8B6240` | approximate |
| Medium Roast | `#6F4A2E` | approximate |
| Dark Roast | `#3B2417` | approximate |
| Espresso | `#211208` | approximate |
| Forest Deep | `#2D4A36` | approximate |
| Forest | `#3E6149` | approximate |
| Sage | `#8FA68B` | approximate |
| Leaf | `#B7C9A8` | approximate |
| Cream | `#F4EBD9` | approximate |
| Paper | `#FAF5EC` | proposed |
| Foam | `#FFFCF6` | proposed |
| Gold | `#B8924A` | approximate |
| Gold Soft | `#D9BC7E` | proposed |
| Terracotta | `#C16E4B` | proposed |
| Ink | `#1A140C` | proposed |

**Why no `official` tokens?** The owner asset pack (Q6) has not been
supplied. Once it is, every token sampled from the official guidelines
should be re-labeled `official` and the audit re-run.

**Why so many `approximate`?** The hex values were eyedropped from
Instagram post covers and JPEG thumbnails — sources with enough
compression to make precise color reading impossible. The values are
perceptually close but should not be presented as canonical.

**Why `proposed` for Paper, Foam, Gold Soft, Terracotta, Ink?** These
five tokens do not appear on any verified Ursa surface. They were
invented by the dossier to extend the sampled palette into a complete
design system. They are explicitly *proposed*, not observed — the owner
should review and confirm or replace them.

### 3.2 How provenance is displayed

The brand audit view renders each palette swatch with the provenance
label underneath the hex value. The style-guide view's color-token
swatches include the provenance in the tooltip on the CopyButton.

---

## 4. Palette contrast calculation method (WCAG 2.2)

The brand audit's palette is a candidate design system; the accessibility
methodology (13) verifies that every text/background combination passes
WCAG 2.2 AA. This section documents the *calculation method* used to
derive the contrast ratios, not the audit results (those are in 13).

### 4.1 The WCAG 2.2 luminance formula

The relative luminance `L` of an sRGB color is:

```
L = 0.2126 × R' + 0.7152 × G' + 0.0722 × B'

where, for each channel c ∈ {R, G, B}:
  c' = c / 255                         (normalize to 0..1)
  c'' = c' ≤ 0.03928 ? c' / 12.92 : ((c' + 0.055) / 1.055) ^ 2.4
```

The contrast ratio between two colors with luminances L1 (lighter) and
L2 (darker) is:

```
ratio = (L1 + 0.05) / (L2 + 0.05)
```

### 4.2 WCAG 2.2 thresholds

| Use case | Threshold (ratio) | Level |
|---|---|---|
| Normal text (< 18 px regular, < 14 px bold) | ≥ 4.5 : 1 | AA |
| Normal text | ≥ 7.0 : 1 | AAA |
| Large text (≥ 18 px regular, ≥ 14 px bold) | ≥ 3.0 : 1 | AA |
| Large text | ≥ 4.5 : 1 | AAA |
| Graphics / UI components (borders, icons) | ≥ 3.0 : 1 | AA |

### 4.3 Worked example: gold on cream

Gold `#B8924A` on Cream `#F4EBD9`:

```
Gold:     R=184, G=146, B=74  → L = 0.291
Cream:    R=244, G=235, B=217 → L = 0.846
ratio = (0.846 + 0.05) / (0.291 + 0.05) = 0.896 / 0.341 = 2.63 : 1
```

**Verdict: FAIL** (2.63 < 4.5 for normal text; 2.63 < 3.0 even for
large text). Gold cannot be used as a text color on cream. This is the
root cause of the gold-text contrast defects documented in methodology
13 §3. The fix: introduce `--color-ursa-gold-text` (`#82622C`,
4.75 : 1) as the text-safe variant. Gold `#B8924A` is reserved for
fills, borders, and decorative strokes.

### 4.4 Where the calculation lives

The luminance and contrast-ratio functions are implemented in three
places in the project:

1. **`research/contrast-harness.js`** — DOM-walking runtime evaluator
   (methodology 13 §2). Calculates contrast for every text element in
   the live rendered page.
2. **`research/pairwise-contrast-test.js`** — Pairwise colour-pair
   tester (methodology 13 §4). Tests all 465 pairs of the 31 unique
   colors in `globals.css`.
3. **`research/qa-results/contrast-check.js`** — Earlier contrast-check
   script used in the QA-VAL cross-device sweep.

All three use the same WCAG 2.2 formula. A fourth implementation lives
inline in the brand-audit view (`brand-audit-view.tsx`) — a small
`contrastRatio(hexA, hexB)` helper that powers the palette swatch
hex-label ink color (mid-tone swatches get ink text; dark swatches get
cream text — see methodology 13 §3.5).

---

## 5. The BearMark design process

The bear mark is the project's most-revised asset. This section
documents the design process from the initial soft-circle bear through
the geometric pentagon+ redesign to the final outline-only version.

### 5.1 Version 1 — Soft-circle bear (Task 2-A, initial)

The first BearMark used 6 `<circle>` / `<ellipse>` elements (rounded
head, rounded ears, oval muzzle). Too soft for the geometric low-poly
aesthetic the actual Ursa logo uses.

### 5.2 Version 2 — Geometric low-poly bear (Task 11-A)

The first geometric redesign used angular primitives (zero circles, zero
ellipses):

- Two triangular ears (apex pointing up) — `<polygon points="8,3 4,12 13,12">`
- An octagonal faceted face — `<polygon points="11,11 29,11 34,17 32,26 26,33 20,34 14,33 8,26 6,17">`
- Two cut-gem diamond eyes
- An angular rhombus muzzle
- A triangular nose + chevron mouth

Used `currentColor` for the bear silhouette; cream token for negative-
space cut-outs; espresso for nose + mouth detail. Worked at any size via
the `0 0 40 40` viewBox.

### 5.3 Version 3 — Fixed-hex bear for dark mode (BEAR-LOGO-CONTRAST-FIX)

In dark mode, the cream token was overridden to a dark color, making
the bear invisible on the dark-roast badge (1.05 : 1 contrast). The fix
replaced all CSS-variable references with fixed hex colors:

- `BEAR_FILL = #4A7C59` (mid-green that passes 3 : 1 on both light
  cream `#F4EBD9` [4.11 : 1] AND dark cream `#2D2417` [3.14 : 1])
- `CUTOUT = #FFFCF6` (foam white, 4.75 : 1 on the green fill)
- `DETAIL = #1A140C` (ink, 17.84 : 1 on white muzzle)

### 5.4 Version 4 — White bear with pentagon+ shapes (WHITE-BEAR-PAIRWISE)

User-requested redesign: white fill, pentagon+ shapes only (no triangles
or squares for ears/mouth).

- Fill: `#FFFFFF` (white)
- Badge bg: `#2D4A36` (forest-deep green) with 2 px gold border
- Cutouts: `#2D4A36` (hole effect)
- Nose/mouth: `#D9BC7E` (gold-soft)
- All ear and mouth shapes are pentagons (5-sided) or hexagons (6-sided)
- Colors are FIXED hex — identical in light and dark mode

Mathematical pairwise contrast verification (full test in
methodology 13 §4):

| Pair | Ratio | Pass? |
|---|---|---|
| White `#FFFFFF` on Forest `#2D4A36` | 9.79 : 1 | AA |
| Forest `#2D4A36` on White `#FFFFFF` | 9.79 : 1 | AA |
| Gold-soft `#D9BC7E` on Forest `#2D4A36` | 5.34 : 1 | AA |
| Gold border `#B8924A` on Light header `#3B2417` | 5.00 : 1 | AA |
| Gold border `#B8924A` on Dark header `#211208` | 6.28 : 1 | AA |

### 5.5 Version 5 — Outline only (BEAR-OUTLINE-FIX, current)

Final form: **outline only, no fill**. Every `<polygon>` uses
`fill="none"` and `stroke="currentColor"`. The bear inherits its color
from the parent element's `text-*` class (e.g.
`text-ursa-dark-roast` on the header badge wrapper).

The construction (viewBox `0 0 40 40`, stroke width `SW = 1.8`):

```jsx
// Two pentagonal ears with smaller pentagonal inner-ear outlines
<polygon points="8,2 12,3 13,9 11,12 4,12 3,9 5,3"
  fill="none" stroke={stroke} strokeWidth={SW} strokeLinejoin="round" />
// (mirror for right ear)

// Octagonal faceted face
<polygon points="11,11 29,11 34,16 33,24 28,31 20,34 12,31 7,24 6,16"
  fill="none" stroke={stroke} strokeWidth={SW} strokeLinejoin="round" />

// Hexagonal eyes, hexagonal muzzle, pentagonal nose, pentagonal mouth
// (all fill="none", stroke="currentColor")
```

The currentBearMark component (`src/components/ursa/ursa-brand.tsx`,
function `BearMark`) is the source of truth. The audit confirmed:

- 11 polygons total (2 ears + 2 inner ears + 1 face + 2 eyes + 1 muzzle
  + 1 nose + 1 mouth).
- Zero circles, zero ellipses, zero `<path>` elements.
- Zero fill colors — every shape is `fill="none"`.
- The stroke color is always `currentColor`, so the bear inherits the
  parent's text color. The header badge wraps it in
  `bg-ursa-cream text-ursa-dark-roast` with a `border-ursa-gold` ring,
  giving dark-roast outline on cream — contrast 12.22 : 1 (AAA).

### 5.6 The "BearMark is NOT the official logo" disclaimer

The brand audit and creative-prototype views carry an explicit asset
disclaimer (Section 6.0 in the creative view):

> The geometric bear glyph is an original concept mark, NOT the official
> logo. The owner-supplied asset pack (open question Q6) is required
> before production. The outline-only geometric bear is a *candidate*
> distinctive asset per the Ehrenberg-Bass framework, not a confirmed
> one.

This disclaimer is non-negotiable. The geometric bear is a design
proposal; the official Ursa logo (when supplied) replaces it everywhere
it appears.

---

## 6. Verification: the brand-audit checklist

A future analyst re-running the brand audit should verify the following:

```bash
# 1. The 8 verified elements each carry an `evidence` field
rg -n "evidence:" src/lib/ursa-data.ts | head -8

# 2. The palette tokens each carry a `provenance` field
rg -n "provenance:" src/lib/ursa-data.ts | head -16

# 3. The BearMark is outline-only (every polygon has fill="none")
rg -n 'fill="none"' src/components/ursa/ursa-brand.tsx | wc -l   # → 11

# 4. The BearMark has zero circles
rg -n '<circle' src/components/ursa/ursa-brand.tsx | wc -l       # → 0

# 5. The brand audit view renders without errors
curl -s -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/#/brand                                 # → 200

# 6. The style-guide view's color-token swatches show provenance labels
# (manual: open #/style-guide and inspect a swatch tooltip)

# 7. The EvidenceTag component renders four tones
rg -n "verified|partial|unverified|gap" src/components/ursa/ursa-brand.tsx | head
```

---

## 7. Cross-references

- For how the pairwise contrast test verifies every color pair → **13-accessibility-methodology.md** §4
- For how the BearMark dark-mode invisibility was diagnosed and fixed → **13-accessibility-methodology.md** §5
- For how the Ehrenberg-Bass distinctive-assets framework was applied → **11-framework-treatment.md** §3
- For how the 1km competitor census verified bear uniqueness (0 of 18 use an animal character) → **09-competitor-census-methodology.md** §6
- For the Handcrafted Writing Protocol applied to brand-audit copy → **14-editorial-protocol.md** §4
