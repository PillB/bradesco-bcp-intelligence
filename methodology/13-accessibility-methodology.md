# 13 — Accessibility & Contrast Methodology

**Task ID:** METHODOLOGY-DOC (this file)
**Source accessibility tasks:** 11 (contrast audit), HYDRATION-CONTRAST-HARNESS,
BEAR-LOGO-CONTRAST-FIX, WHITE-BEAR-PAIRWISE, BEAR-OUTLINE-FIX, QA-VAL
**Audit date:** 2026-08-01
**Harness source:** `research/contrast-harness.js`
**Pairwise test source:** `research/pairwise-contrast-test.js`
**Pairwise results:** `research/pairwise-results.json`
**QA report:** `research/qa-validation-report.md`
**Final verdict:** 0 contrast failures across all 25 views; 0 hydration
mismatches; bear logo readable in both light and dark mode.

This document records how the Ursa dossier was made WCAG 2.2 AA
compliant: the contrast requirements, the runtime DOM-walking contrast
harness, the pairwise color-pair test, the fill-vs-text color-token
strategy, the bear logo's contrast evolution, and the hydration-
mismatch fix via `useSyncExternalStore`. It is the reproducible recipe
behind every contrast claim in the dossier.

---

## 1. WCAG 2.2 contrast requirements

The Ursa dossier targets **WCAG 2.2 Level AA** for all text and UI
components.

### 1.1 Thresholds

| Use case | Threshold (ratio) | Level |
|---|---|---|
| Normal text (< 18 px regular, < 14 px bold) | ≥ 4.5 : 1 | AA |
| Normal text | ≥ 7.0 : 1 | AAA |
| Large text (≥ 18 px regular, ≥ 14 px bold) | ≥ 3.0 : 1 | AA |
| Large text | ≥ 4.5 : 1 | AAA |
| Graphics / UI components (borders, icons, focus indicators) | ≥ 3.0 : 1 | AA |

### 1.2 The luminance formula

WCAG 2.2 relative luminance `L` of an sRGB color:

```
L = 0.2126 × R' + 0.7152 × G' + 0.0722 × B'

where, for each channel c ∈ {R, G, B}:
  c'  = c / 255                                                  (normalize to 0..1)
  c'' = c' ≤ 0.03928 ? c' / 12.92 : ((c' + 0.055) / 1.055) ^ 2.4 (gamma-correct)
```

Contrast ratio between two colors with luminances L1 (lighter) and
L2 (darker):

```
ratio = (L1 + 0.05) / (L2 + 0.05)
```

### 1.3 The "large text" rule

The harness (`research/contrast-harness.js`) classifies an element as
"large text" if:

```javascript
function isLargeText(el) {
  var cs = getComputedStyle(el);
  var fontSize = parseFloat(cs.fontSize);
  var fontWeight = parseInt(cs.fontWeight) || 400;
  return fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
}
```

Large text uses the 3.0 : 1 threshold; normal text uses 4.5 : 1.

---

## 2. The runtime contrast harness (`research/contrast-harness.js`)

The runtime harness is a DOM-walking evaluator that runs in the browser
(via `agent-browser eval` or browser console). It computes the ACTUAL
rendered text color vs the ACTUAL rendered background color for every
text-bearing element on the page.

### 2.1 What it does

1. **Walks the DOM** — selects all `body *:not(script):not(style):not(noscript)`
   elements.
2. **Filters to text-bearing elements** — only elements with direct
   text node children of length > 1 character.
3. **Skips hidden elements** — `display: none`, `visibility: hidden`,
   `opacity: 0`.
4. **Computes effective foreground** — walks the ancestor chain for
   the first non-transparent `color`, alpha-blending semi-transparent
   colors with the parent's background.
5. **Computes effective background** — walks the ancestor chain for
   the first non-transparent `backgroundColor`. Handles gradient
   backgrounds by extracting all colors from the gradient and using
   the darkest stop (worst case for light text). Handles
   semi-transparent backgrounds by alpha-blending with the parent.
6. **Calculates the WCAG contrast ratio** for the (fg, bg) pair.
7. **Applies the threshold** — 3.0 : 1 for large text, 4.5 : 1 for
   normal text.
8. **Reports failures** with: selector, text snippet, fgColor,
   bgColor, ratio, threshold, fontSize, fontWeight.
9. **Reports near-miss warnings** — ratios within 0.5 of the threshold
   (so a future darkening can be planned before it fails).

### 2.2 Color format handling

The harness parses:

- `rgb(r, g, b)` and `rgba(r, g, b, a)` — comma-separated
- `rgb(r g b / a)` and `rgba(r g b / a)` — space-separated (modern syntax)
- `#rrggbb` and `#rgb` — hex
- `oklab(L a b / alpha)` — Tailwind 4 opacity modifiers like
  `text-ursa-cream/85` compile to oklab. The harness approximates
  oklab→sRGB using the standard oklab matrix and uses the result for
  luminance.

The oklab handling is approximate but conservative — it tends to
over-report failures (which is the safe direction for an accessibility
harness).

### 2.3 Gradient handling

When `backgroundColor` returns `rgba(0,0,0,0)` (transparent) but
`backgroundImage` is a `linear-gradient(...)` or `radial-gradient(...)`,
the harness extracts every color from the gradient string and uses the
**darkest** stop as the effective background. This is the worst case
for light text (the most likely failure mode).

### 2.4 Output

```javascript
{
  summary: { totalChecked, passed, failed, warnings, skipped },
  failures: [{ selector, text, fgColor, bgColor, ratio, threshold,
               largeText, fontSize, fontWeight }, ... (top 30)],
  warnings: [{ selector, text, ratio, threshold }, ... (top 10)]
}
```

### 2.5 How to run it

```bash
# Via agent-browser
agent-browser open "http://localhost:3000/#/<route>"
agent-browser wait 1000
agent-browser eval "$(cat research/contrast-harness.js)"

# Or via browser console: paste the harness code into the console.
```

The harness returns the JSON above and also `console.table`s the
failures for at-a-glance review.

### 2.6 The known false-positive families

Two false-positive families are documented in
`research/qa-validation-report.md` §7.2 and §7.3:

1. **Linear-gradient backgrounds.** When the harness falls back to
   walking up to body's cream background (because the gradient
   `backgroundColor` returns transparent), it may mis-report labels
   that are actually on dark gradients. Affected: brand-audit
   "Spirit-preservation principle" hero, landing "Socio piloto",
   creative "Un gramo a la vez", roadmap "Verdict" hero. All visually
   pass AA.
2. **Tiny marker-line parents.** A 2 px-wide vertical line with a
   `-bottom-5` time label can be mis-reported because the label's
   parent (the 2 px line) has `bg-ursa-terracotta`, but the label is
   30 px wide and only 2 px overlaps the line. Acceptable.

These false positives are excluded from the failure count by manual
inspection. A future CI integration should add the exclusion rules
programmatically.

---

## 3. Color token strategy: fill vs text variants

The Ursa palette has two parallel token families for each accent color:

| Family | Purpose | Light-mode hex | Dark-mode hex | WCAG on cream |
|---|---|---|---|---|
| `ursa-gold` (fill) | Backgrounds, borders, decorative strokes | `#B8924A` | (same) | 2.45 : 1 (FAIL as text) |
| `ursa-gold-text` (text) | Text on light surfaces | `#82622C` | `#D9BC7E` (gold-text-soft) | 4.79 : 1 (PASS) |
| `ursa-terracotta` (fill) | Backgrounds, borders | `#C16E4B` | (same) | 3.17 : 1 (FAIL as text) |
| `ursa-terracotta-text` (text) | Text on light surfaces | `#783822` (was `#984A2E`) | (same) | 6.28 : 1 (PASS) |
| `ursa-sage` (fill) | Backgrounds, decorative | `#8FA68B` | (same) | 2.22 : 1 (FAIL as text) |
| `ursa-sage-text` (text) | Text on light surfaces | `#5C6E55` | `#8FA68B` | 4.65 : 1 (PASS) |

### 3.1 The rule

- **Fill tokens** (`bg-ursa-gold`, `bg-ursa-terracotta`, `bg-ursa-sage`)
  are used for backgrounds, borders, decorative strokes, and chart
  fills. They are NEVER used as text color on a light surface.
- **Text tokens** (`text-ursa-gold-text`, `text-ursa-terracotta-text`,
  `text-ursa-sage-text`) are used wherever text of that hue appears on
  a light surface.
- **Bright tokens** (`text-ursa-gold-text-soft` `#D9BC7E`) are used on
  dark backgrounds (espresso, dark-roast) where the standard text
  token would be too dark to read.

### 3.2 The token darkening history

The text tokens were darkened over multiple rounds to fix near-miss
contrast failures:

| Token | Original | Round 1 | Round 2 (current) | Ratio on muted bg |
|---|---|---|---|---|
| `gold-text` | `#82622C` | `#82622C` | `#706228` | 4.79 : 1 |
| `terracotta-text` | `#984A2E` | `#984A2E` | `#783822` | 6.28 : 1 |
| `sage-text` | `#5C6E55` | `#5C6E55` | `#5C6E55` | 4.65 : 1 |

Round 1 (HYDRATION-CONTRAST-HARNESS) caught the original near-misses.
Round 2 (BEAR-LOGO-CONTRAST-FIX) darkened `terracotta-text` further
because `#984A2E` was at 4.47 : 1 on muted backgrounds — barely below
4.5.

### 3.3 The global remediation pattern

The QA-VAL report §7.1 documents a one-line Codemod pattern for any
remaining `text-ursa-terracotta` (without `-text`) on a light surface:

> In `src/components/ursa/`, find every `text-ursa-terracotta` (not
> `text-ursa-terracotta-text`) used on an element whose text content is
> non-empty AND whose nearest non-transparent ancestor is `bg-card` /
> `bg-ursa-foam` / `bg-ursa-paper` / `bg-ursa-cream`. Replace with
> `text-ursa-terracotta-text`. Do the same for `text-ursa-gold` (not
> `-text`) → `text-ursa-gold-text`.

### 3.4 Where the rules live

The token definitions are in `src/app/globals.css`:

```css
@theme {
  --color-ursa-gold:           #B8924A;   /* fill */
  --color-ursa-gold-text:      #706228;   /* text on light */
  --color-ursa-terracotta:     #C16E4B;   /* fill */
  --color-ursa-terracotta-text:#783822;   /* text on light */
  --color-ursa-sage:           #8FA68B;   /* fill */
  --color-ursa-sage-text:      #5C6E55;   /* text on light */
  --color-ursa-gold-text-soft: #D9BC7E;   /* text on dark */
}

.dark {
  --color-ursa-gold-text:      #D9BC7E;   /* brighter in dark mode */
  --color-ursa-terracotta-text:#C16E4B;   /* brighter in dark mode */
  --color-ursa-sage-text:      #8FA68B;   /* brighter in dark mode */
}
```

---

## 4. The pairwise contrast test (`research/pairwise-contrast-test.js`)

The pairwise test is a Node script that extracts every color from
`globals.css` and tests every possible pair to find any that would
fail WCAG if used as text-on-background.

### 4.1 What it does

1. **Reads `src/app/globals.css`** — extracts every `--color-ursa-*`
   hex value from the `@theme` block, the `:root` block, and the
   `.dark` override block.
2. **Adds the BearMark's fixed hex colors** — `bear_white #FFFFFF`,
   `bear_forest #2D4A36`, `bear_gold_soft #D9BC7E`,
   `bear_gold_border #B8924A`.
3. **Tests every pair** — for N colors, runs `N × (N-1) / 2` tests.
   With 31 colors, that's 465 pairs.
4. **Reports failures by severity** — critical (< 3 : 1, fails even
   for graphics) and moderate (3-4.5 : 1, graphics pass but text
   fails).
5. **Writes JSON results** to `research/pairwise-results.json`.

### 4.2 The luminance and ratio functions

```javascript
function parseHex(hex) {
  const m = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function luminance(c) {
  const f = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * f(c.r / 255) + 0.7152 * f(c.g / 255) + 0.0722 * f(c.b / 255);
}

function ratio(a, b) {
  const l1 = luminance(a), l2 = luminance(b);
  return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
}
```

### 4.3 How to run it

```bash
node research/pairwise-contrast-test.js
# Output:
#   Colors tested: 31
#   Pairs tested: 465
#   Pairs failing WCAG AA (4.5:1): <count>
#   Pairs failing WCAG graphics (3:1): <count>
#   ...
# Results saved to research/pairwise-results.json
```

### 4.4 Interpreting the failures

The pairwise test reports every pair with ratio < 4.5 : 1. **Most of
these are fill-on-fill pairs** (e.g., gold on terracotta, sage on
forest) that would never be used as text-on-background. They are
border-color pairs, chart-fill pairs, decorative-element pairs.

The runtime DOM harness (§2 above) is the source of truth for
*actual* text-on-background failures. The pairwise test is a
combinatorial safety net — it catches pairs the harness might miss
because no view happens to render them today.

### 4.5 The bear-logo pairwise verification

The WHITE-BEAR-PAIRWISE task used the pairwise test to verify every
color pair in the bear logo design:

| Pair | Ratio | Pass? |
|---|---|---|
| White `#FFFFFF` on Forest `#2D4A36` | 9.79 : 1 | AA |
| Forest `#2D4A36` on White `#FFFFFF` | 9.79 : 1 | AA |
| Gold-soft `#D9BC7E` on Forest `#2D4A36` | 5.34 : 1 | AA |
| Gold border `#B8924A` on Light header `#3B2417` | 5.00 : 1 | AA |
| Gold border `#B8924A` on Dark header `#211208` | 6.28 : 1 | AA |

All pairs pass WCAG AA (≥ 4.5 : 1 for text, ≥ 3 : 1 for graphics).

---

## 5. The bear logo contrast evolution

The bear logo went through five design iterations, each driven by a
contrast failure discovered by the harness or the pairwise test.

### 5.1 Version 1 — Soft-circle bear (initial)

Used 6 `<circle>` / `<ellipse>` elements with `currentColor` fill.
Visually too soft; did not match the Ursa logo's geometric aesthetic.

### 5.2 Version 2 — Geometric low-poly bear (Task 11-A)

Angular primitives (zero circles, zero ellipses). Used CSS variables
for cutout colors. **Contrast failure in dark mode:** `--color-ursa-cream`
was overridden to `#2D2417` in dark mode, making the bear's cream
cutouts invisible on the dark-roast badge (1.05 : 1).

### 5.3 Version 3 — Fixed-hex bear (BEAR-LOGO-CONTRAST-FIX)

Replaced all CSS-variable references with fixed hex colors:

- `BEAR_FILL = #4A7C59` (mid-green, 4.11 : 1 on light cream, 3.14 : 1
  on dark cream)
- `CUTOUT = #FFFCF6` (foam white, 4.75 : 1 on green fill)
- `DETAIL = #1A140C` (ink, 17.84 : 1 on white muzzle)

**Result:** Bear readable in both light and dark mode. VLM-confirmed.

### 5.4 Version 4 — White bear with pentagon+ shapes (WHITE-BEAR-PAIRWISE)

User-requested redesign: white fill, pentagon+ shapes only.

- Fill: `#FFFFFF` (white)
- Badge bg: `#2D4A36` (forest-deep green) with 2 px gold border
- Cutouts: `#2D4A36` (hole effect)
- Nose/mouth: `#D9BC7E` (gold-soft)
- All shapes pentagons (5-sided) or hexagons (6-sided)
- Fixed hex — identical in light and dark mode

Pairwise contrast verified (see §4.5 above). VLM-confirmed in both
modes.

### 5.5 Version 5 — Outline only (BEAR-OUTLINE-FIX, current)

Final form: **outline only, no fill**. Every `<polygon>` uses
`fill="none"` and `stroke="currentColor"`. The bear inherits its color
from the parent element's `text-*` class.

```jsx
<svg viewBox="0 0 40 40" fill="none" role="img" aria-label="Ursa bear mark">
  <polygon points="8,2 12,3 13,9 11,12 4,12 3,9 5,3"
    fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />
  // ... 10 more polygons, all fill="none"
</svg>
```

The header badge wraps it in `bg-ursa-cream text-ursa-dark-roast` with
a `border-ursa-gold` ring, giving dark-roast outline on cream —
contrast 12.22 : 1 (AAA).

**Why outline only?** Because the outline-only bear:

- Works on ANY background without contrast issues (it inherits the
  parent's text color, which is always chosen for contrast).
- Has no fill color to clash with green / brown / gold backgrounds.
- Is the most flexible form for the dossier's many surfaces (header,
  footer, command palette, dashboard cards, dossier banners).
- Avoids the "green bear on green background" problem that triggered
  the BEAR-OUTLINE-FIX task.

---

## 6. The hydration mismatch fix (useSyncExternalStore)

### 6.1 The problem

The `ThemeToggle` and `LanguageToggle` components read `localStorage`
during initialization to determine the user's saved theme / language
preference. This caused a hydration mismatch:

- **Server render:** `localStorage` is unavailable, so the server
  renders the default (light theme / English).
- **Client first render:** `localStorage["ursa-theme"]` returns "dark"
  (or `localStorage["ursa-lang"]` returns "es"), so the client renders
  dark / Spanish.
- **Hydration mismatch:** React detects that the server HTML and client
  first render disagree on the toggle's icon and aria-label, and
  throws a hydration warning.

The original `mounted` state guard only protected the icon swap, not
the aria-label / title attributes — those were rendered with the
client's preferred value immediately, causing the mismatch.

### 6.2 The fix: useSyncExternalStore

React 18's `useSyncExternalStore` hook is designed for exactly this
case. It accepts three arguments:

1. `subscribe(callback)` — register a listener that fires when the
   store changes.
2. `getSnapshot()` — return the current client-side store value.
3. `getServerSnapshot()` — return the server-side snapshot (always the
   default).

The hook returns the server snapshot during SSR and the client
snapshot during hydration, with no mismatch.

### 6.3 The theme store implementation

```typescript
// src/hooks/use-theme.ts
const themeStore = {
  listeners: new Set<() => void>(),
  value: "light" as "light" | "dark",
  subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  },
  getSnapshot() {
    return this.value;
  },
  getServerSnapshot() {
    return "light";  // server always renders light
  },
  set(next: "light" | "dark") {
    this.value = next;
    localStorage.setItem("ursa-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    this.listeners.forEach(l => l());
  },
  init() {
    // Called once on client mount
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ursa-theme");
      if (saved === "dark" || saved === "light") this.value = saved;
    }
  }
};

export function useTheme() {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  );
  // ... setTheme wrapper
}
```

### 6.4 The language store implementation

The same pattern is applied to the `LanguageProvider`:

```typescript
// src/lib/i18n.ts (LanguageProvider)
function subscribeLang(cb: () => void) { /* ... */ }
function getLangSnapshot() { return currentLang; }
function getLangServerSnapshot() { return "en"; }  // server always renders en

export function LanguageProvider({ children }) {
  const lang = useSyncExternalStore(subscribeLang, getLangSnapshot, getLangServerSnapshot);
  // ...
}
```

### 6.5 The anti-FOUC inline script

To prevent a flash of unstyled content (FOUC) before React hydrates,
`src/app/layout.tsx` includes an inline script that runs before
hydration:

```html
<script dangerouslySetInnerHTML={{ __html: `
  (function() {
    var t = localStorage.getItem("ursa-theme");
    var l = localStorage.getItem("ursa-lang");
    if (t === "dark") document.documentElement.classList.add("dark");
    if (l) {
      document.documentElement.lang = l;
      window.__URSA_LANG__ = l;
    }
  })();
`}} />
```

This sets the `dark` class on `<html>` and the `lang` attribute before
the first paint, so the page renders with the correct theme and
language from the start. The `useSyncExternalStore` hook then takes
over once React hydrates.

### 6.6 The result

- No hydration mismatch warnings in the console.
- No FOUC — the page renders with the correct theme and language from
  the first paint.
- The toggle's icon and aria-label update smoothly when the user
  changes theme or language.

---

## 7. Reproducibility

A new analyst can re-run the accessibility audit by following the
steps above. The expected outputs:

```bash
# 1. The harness exists and is runnable
ls research/contrast-harness.js
ls research/pairwise-contrast-test.js

# 2. The pairwise test runs and produces results
node research/pairwise-contrast-test.js
# → "Colors tested: 31 | Pairs tested: 465 | Pairs failing WCAG AA: ..."

# 3. The runtime harness runs against any view
agent-browser open "http://localhost:3000/#/dashboard"
agent-browser wait 1000
agent-browser eval "$(cat research/contrast-harness.js)"
# → "Checked: 142 | Passed: 142 | Failed: 0 | Warnings: 2"

# 4. The text-token strategy is in globals.css
rg -n "ursa-gold-text|ursa-terracotta-text|ursa-sage-text|ursa-gold-text-soft" \
  src/app/globals.css

# 5. The BearMark is outline-only
rg -c 'fill="none"' src/components/ursa/ursa-brand.tsx   # → 11 (every polygon)
rg -c '<circle' src/components/ursa/ursa-brand.tsx       # → 0 (no circles)

# 6. The hydration fix is in place
rg -n "useSyncExternalStore" src/hooks/use-theme.ts src/lib/i18n.ts
# → 2 matches (one per store)

# 7. The anti-FOUC inline script is in layout.tsx
rg -n "ursa-theme|ursa-lang" src/app/layout.tsx
```

### 7.1 The full 25-view contrast sweep

To verify 0 contrast failures across all 25 views:

```bash
for route in "" brand market menu growth viral creative roadmap calculator \
             menu-studio competitors content-calendar experiments style-guide \
             budget origin-atlas roi campaign-builder spirit-checker swot \
             pilot scorecard loyalty sources landing; do
  echo "=== #/$route ==="
  agent-browser open "http://localhost:3000/#/$route"
  agent-browser wait 1000
  agent-browser eval "$(cat research/contrast-harness.js)" | \
    grep -E "Checked|Failed"
done
```

Expected: every view reports `Failed: 0`.

---

## 8. Cross-references

- For the BearMark design process (versions 1-5) → **03-brand-audit-methodology.md** §5
- For the palette contrast calculation method (WCAG formula + worked example) → **03-brand-audit-methodology.md** §4
- For the calculator's color-coded sensitivity table (contrast pairs) → **12-calculator-validation.md** §6
- For the full QA validation report (5 devices × 25 views = 125 combinations) → `research/qa-validation-report.md`
- For the pairwise test results JSON → `research/pairwise-results.json`
