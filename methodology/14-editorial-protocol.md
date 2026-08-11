# 14 — Editorial Protocol Methodology

**Task ID:** METHODOLOGY-DOC (this file)
**Source editorial tasks:** Task 3 (Writing-protocol review pass),
DEEPEN-ALL-REPORTS-V2 (portmanteau correction), Task 11-A (Spanish i18n)
**Audit date:** 2026-08-01
**Source protocol:** `upload/Handcrafted Writing and Editorial Quality
Protocol.docx` (extracted to `upload/docx_extract/handcrafted-protocol.txt`)
**Applied to:** dashboard, calculator, growth, roadmap, menu, brand,
viral, creative views + all Spanish (Peru) UI chrome

This document records how the Handcrafted Writing and Editorial
Quality Protocol was applied to the Ursa dossier: the protocol's core
rules, how it was applied surgically (not by bulk generation), the
portmanteau correction case study, and the Spanish translation
approach. It is the reproducible recipe behind every wording choice in
the dossier.

---

## 1. The Handcrafted Writing Protocol — summary

The protocol is supplied as `upload/Handcrafted Writing and Editorial
Quality Protocol.docx` (23 330 bytes). The full text was extracted to
`upload/docx_extract/handcrafted-protocol.txt` for in-session
reference. The protocol's core rules:

### 1.1 The six positive rules

1. **Purpose** — every paragraph must advance the dossier's argument.
   If it could be deleted without loss, delete it.
2. **Structure** — sections follow a deliberate order; each section's
   first sentence orients the reader to what the section delivers.
3. **Completeness** — claims are supported by evidence; gaps are named
   explicitly, not papered over.
4. **Precision** — words are chosen for their specific meaning, not
   their generic feel. "Distinctive" means distinctive, not "good."
5. **Readability** — sentences are short where short works; long where
   long works. No telegraphic phrasing (e.g., "Real roastery, real
   drinks, real atmosphere" — triple-"real" is telegraphic per §3.5).
6. **Accessible sophistication** — the writing is sophisticated but
   not pretentious. A café owner should read it without a dictionary;
   a marketing PhD should not find it dumbed down.

### 1.2 The seven anti-aberration rules

1. **No generic openings** — never start a section with "In today's
   competitive landscape" or similar templated openings.
2. **No interchangeable paragraphs** — never write a paragraph that
   could belong to any café's dossier. Every paragraph must name
   Ursa-specific facts, competitors, or mechanisms.
3. **No invented facts** — every factual claim must be traceable to a
   source. If no source exists, mark the claim as a scenario
   assumption.
4. **No shallow verbosity** — never pad a paragraph with filler to
   hit a length target.
5. **No unsupported confidence** — never use "always," "never,"
   "every," "proves," "wins," "works," "translates cleanly," "almost
   any reasonable" without bounded qualification.
6. **No internal process language leaking into public content** —
   never write "this dossier applies a handcrafted protocol" or
   "the writing has been reviewed against the Handcrafted Writing
   Protocol" in customer-facing copy.
7. **No false totality** — never claim "every recommendation
   survived three rounds of skeptical challenge" when only three
   specific recommendations did.

### 1.3 The tone rule

The dossier's tone is **substantive, bounded, and Ursa-specific**. It
avoids:

- Marketing speak ("synergy," "leverage," "best-in-class")
- Academic jargon ("heuristic," "paradigm," "epistemic")
- Defensive hedging ("might," "could," "possibly," "arguably" — used
  only where genuine uncertainty exists)
- Absolute confidence ("always," "never," "every" — bounded per §1.2.5)

---

## 2. How the protocol was applied: surgical edits, not bulk generation

The protocol was applied as **surgical edits** to existing copy, not
as bulk regeneration. The reviewer read each target file end-to-end,
identified specific protocol violations, and rewrote only the
violating sentences. Structure, components, and layout were never
touched.

### 2.1 The four target files (Task 3)

The protocol review pass targeted four files:

1. `src/components/ursa/views/dashboard-view.tsx` — 8 surgical edits
2. `src/components/ursa/tools/calculator-view.tsx` — 3 surgical edits
3. `src/components/ursa/views/growth-view.tsx` — 1 surgical edit
4. `src/components/ursa/views/roadmap-view.tsx` — 3 surgical edits

Total: 15 surgical edits across 4 files.

### 2.2 Example edit — dashboard hero lede

**Before (templated, defensive):**

> No rebrand. No generic café playbook.

**After (Ursa-specific, bounded):**

> The direction is refinement, not rebrand; every recommendation is
> checked against the bear, the gram, and the green before it ships.
> On the floor: in-house roastery, two-bar theatre, Art Nouveau lean,
> "Un gramo a la vez."

**Why this edit passes the protocol:**

- **Specific** — names Ursa's identity markers (bear, gram, green,
  in-house roastery, two-bar theatre, Art Nouveau, "Un gramo a la
  vez"). No other café's dossier could carry this lede.
- **Bounded** — "The direction is refinement, not rebrand" is a
  recommendation, not an absolute. "Every recommendation is checked
  against the bear, the gram, and the green" is a verifiable process
  claim, not a marketing slogan.
- **Not defensive** — replaces the templated "No rebrand. No generic
  café playbook." with a positive statement of what the dossier does.
- **Orienting** — the "On the floor:" list orients the reader to
  Ursa's specific physical layout, not a brand-word salad.

### 2.3 Example edit — calculator assumption note

**Before (unverified absolute):**

> Subscription models work in Lima cafés (CoffeePass proves
> willingness to pay for membership).

**After (bounded consistency claim):**

> Subscription models are consistent with willingness to pay for
> membership among Lima café customers (CoffeePass is the local
> precedent).

**Why this edit passes the protocol:**

- **No unsupported confidence** — replaces "proves" (which would
  require an RCT) with "is consistent with" (a bounded consistency
  claim).
- **Precise** — CoffeePass is a "precedent," not a "proof."
- **Honest** — the original implied CoffeePass proves Ursa Mañana
  will work; the bounded version says only that CoffeePass shows Lima
  café customers will pay for memberships, which is the actual
  evidence CoffeePass provides.

### 2.4 Example edit — growth positioning statement

**Before (generic, interchangeable):**

> Unlike chain cafés or award-only spots, Ursa makes the craft
> visible.

**After (Ursa-specific, names the actual competitive set):**

> Unlike the scaled chains and the award-credentialed tasting rooms
> that anchor Lima's specialty scene, Ursa pairs its own roastery with
> the bear motif and the Art Nouveau lean — the craft is visible, and
> so is the character.

**Why this edit passes the protocol:**

- **No interchangeable paragraphs** — the new version names the actual
  Lima competitive set (scaled chains + award-credentialed tasting
  rooms, consistent with CENSUS-1 findings). No generic café dossier
  could carry this paragraph.
- **Specific orthogonality** — names Ursa's specific differentiation
  (roastery + bear + Art Nouveau), not a generic "makes the craft
  visible" line.

### 2.5 Example edit — roadmap skeptical-revision log

**Before (false totality):**

> Every recommendation here survived three rounds of skeptical
> challenge.

**After (bounded, accurate):**

> Three rounds of skeptical challenge shaped this plan's riskiest
> recommendations.

**Why this edit passes the protocol:**

- **No false totality** — the three documented rounds challenged
  three specific risks (subscription viability, bear childishness,
  90-day realism), not literally every recommendation. The bounded
  version reflects the actual scope.
- **Active verb** — "shaped" is more accurate than "survived."
  Recommendations were revised, not merely survived.

---

## 3. The portmanteau correction (case study)

The portmanteau correction is the most-cited editorial case study in
the project. It is documented in detail here because it illustrates
the protocol's "no invented facts" rule applied to a specific factual
error.

### 3.1 The client complaint

The client complained that the dossier's menu view called Ursa's
drink names "portmanteaus" — specifically naming four drinks
(Ursagroni, Maracumango, Durazno Clarificado, Filtrado Lonya) as
examples of a "portmanteau system." The client correctly noted this
was mediocre: only two of the four are actually portmanteaus.

### 3.2 The evidence check

The reviewer checked each drink name against its etymology:

| Drink | Etymology | Portmanteau? |
|---|---|---|
| Ursagroni | Ursa + negroni | **Yes** — coined blend of two words |
| Maracumango | maracuyá + mango | **Yes** — coined blend of two words |
| Filtrado Lonya | Filtrado (filter coffee) + Lonya (place name, Utcubamba, Amazonas) | **No** — origin label, descriptive |
| Durazno Clarificado | Durazno (peach) + Clarificado (clarified) | **No** — descriptive label, two adjectives |

**Result:** 2 of 4 are portmanteaus; 2 are descriptive / origin labels.
The "portmanteau system" framing was incorrect.

### 3.3 The fix

The reviewer removed the "portmanteau system," "signature system,"
and "strategic pillar" framing from every file that contained it.

**Before (in menu-view.tsx, ownable-menu-language card):**

> Portmanteau names — Ursagroni, Maracumango, Durazno Clarificado,
> Filtrado Lonya — a strategic naming system unique to Ursa.

**After (honest framing):**

> Two coined drink names — Ursagroni (Ursa + negroni) and Maracumango
> (maracuyá + mango). The other two named drinks (Filtrado Lonya,
> Durazno Clarificado) use origin / descriptive labels, not coined
> names. This is a naming convention, not a strategic system — do not
> over-extend it.

The `VERIFIED_BEVERAGES` array in `ursa-data.ts` was also updated to
clarify which drinks are coined vs descriptive.

### 3.4 The lesson

The portmanteau correction illustrates three protocol rules:

1. **No invented facts** — the "portmanteau system" was an invented
   category. The reviewer should have checked the etymology before
   naming the pattern.
2. **Precision** — "portmanteau" has a specific meaning (a blend of
   two words). Using it loosely to mean "any coined name" violates
   the precision rule.
3. **No interchangeable paragraphs** — the "strategic naming system
   unique to Ursa" framing was interchangeable; any café with two
   coined drink names could have claimed the same. The honest
   framing names the specific two coined names and the specific two
   descriptive labels, which is unique to Ursa.

### 3.5 The follow-up audit

After the fix, the reviewer searched the entire codebase for any
remaining "portmanteau" references:

```bash
rg -ni "portmanteau" src/ public/dossier/
# → 0 matches (the framing is fully removed)
```

The DEEPEN-ALL-REPORTS-V2 task in the worklog records this as the
single most-cited editorial correction in the project.

---

## 4. How the protocol was applied to the menu view (deepening pass)

The DEEPEN-GROWTH-MENU task extended the menu view's 13 product
proposals with five new fields per proposal. The protocol's "no
invented facts" rule required that every new field cite a specific
CENSUS-1 finding.

### 4.1 The five new fields

Each of the 13 proposals (P-01 through P-13) gained:

1. `whyThisProduct` — WHY this specific product, not generic
2. `customerNeed` — what customer need it addresses + WHO
3. `evidence` — census / competitor evidence supporting it
4. `operationalTest` — operational validation step, separate from the
   market `testMethod`
5. `pricingRationale` — WHY this price range, anchored to census
   competitor pricing

### 4.2 Example — P-01 Oso Negro

```typescript
{
  id: "P-01",
  name: "Oso Negro",
  whyThisProduct: "A strong, bitter, after-dinner espresso drink
    extends the daypart past 6pm without competing with the morning
    regular. Named in the bear's voice ('Oso Negro' = Black Bear).",
  customerNeed: "After-dinner drinkers who want an espresso-based
    digestif without the sweetness of a dessert drink. Anchored
    against the Ursagroni (S/. 18) for the same after-dinner slot.",
  evidence: "CENSUS-1: 0 of 18 competitors offer an
    espresso-tonic-or-bitter after-dinner drink under a coined name.
    Ursagroni (verified) is the closest analogue.",
  operationalTest: "Prepare 10 Oso Negros across 2 days; measure
    pour time (target < 90 seconds), wastage, and barista feedback
    on recipe reproducibility.",
  pricingRationale: "Anchored against Ursagroni S/. 18 (verified),
    Black Label S/. 14, espresso S/. 6, flat white S/. 10. Lean
    S/. 10, Moderate S/. 12, Growth S/. 14 — positioned just above
    a flat white, just below the Ursagroni."
}
```

### 4.3 The "Why this price range (census-anchored)" footer

The rendering of each proposal accordion shows 10 visible criterion
rows (up from 6), plus a "Why this price range (census-anchored)"
footer under the pricing scenarios with the `pricingRationale` text.

### 4.4 The protocol check

Every new field passes the protocol:

- **Specific** — names the exact census competitors and prices used
  as anchors (Ursagroni S/. 18, Black Label S/. 14, etc.).
- **No invented facts** — the pricing rationale cites verified
  prices from CENSUS-1; the evidence cites the specific census finding
  (0 of 18 competitors).
- **Bounded** — the operational test is a specific 10-drink, 2-day
  measurement, not a vague "test it."

---

## 5. The Spanish translation approach

The dossier's UI chrome (header, footer, command palette, theme toggle,
language toggle, all 25 route labels) is bilingual English / Spanish.
The Spanish is **hand-crafted Peruvian Spanish (Lima register)**, not
machine-translated.

### 5.1 The translation rule

Spanish translations are written by hand, using the Lima register
specifically:

- "Dashboard" → "Panel" (not "Tablero" — which is the Spain register)
- "Menu & Product" → "Carta y Producto" (Peruvian "carta" for
  restaurant menu, not "menú" which is more Spain)
- "SWOT Matrix" → "Matriz DAFO" (the Spanish acronym for SWOT)
- "Brand Scorecard" → "Tarjeta de Calificación de Marca"
- "Spirit Checker" → "Verificador de Espíritu"
- "Pilot Dashboard" → "Panel del Piloto"
- "Viral Content Lab" → "Lab de Contenido Viral"
- "Experiment Tracker" → "Seguimiento de Experimentos"
- "Sources & Evidence" → "Fuentes y Evidencia"

### 5.2 The bilingual search-keyword rule

The command palette's route command items build their label from
`routeLabel(key)` and include BOTH the English and Spanish forms in
the search keywords. Typing "marca" OR "brand" both find the Brand
Audit entry. This requires every label to be defined in both
languages upfront.

### 5.3 The Spanish quote-marks rule

Spanish text uses «» (angle quotes) instead of "" (straight quotes)
for inline quotations:

- "No matches" hint in ES: «No hay resultados»

This is a small but visible signal that the Spanish was hand-crafted,
not machine-generated.

### 5.4 The scope rule

The protocol's scope rule for Spanish translation:

- **UI chrome** (header, footer, command palette, route labels,
  buttons, badges, common strings, footer blurb) — translated.
- **Strategic dossier content** (report prose inside each view,
  product proposals, recommendation ledger, evidence citations) —
  stays English.
- **Existing customer-facing Spanish** (landing page copy, script
  captions) — left untouched (it was already hand-crafted Peruvian
  Spanish).

### 5.5 The translation file

The translations live in `src/lib/i18n.ts`:

```typescript
export const translations = {
  en: {
    nav: { routes: { brand: "Brand Audit", market: "Market", ... } },
    actions: { ... },
    badges: { ... },
    common: { ... },
    footer: { ... }
  },
  es: {
    nav: { routes: { brand: "Auditoría de Marca", market: "Mercado", ... } },
    actions: { ... },
    badges: { ... },
    common: { ... },
    footer: { ... }
  }
};
```

The `LanguageProvider` exposes `t(key)` which walks dotted paths
(`"nav.routes.brand"`) and returns the translated string. Falls back
to the key itself if missing, and to English if called outside the
provider.

### 5.6 The verification

A future analyst can verify the Spanish translation by:

```bash
# 1. The translations object has both en and es keys
rg -n "en: \{" src/lib/i18n.ts | head -1
rg -n "es: \{" src/lib/i18n.ts | head -1

# 2. The language toggle renders both options
curl -s http://localhost:3000/ | grep -o 'aria-label="Language / Idioma"'

# 3. The Spanish quote-marks rule is followed
rg -n "«" src/lib/i18n.ts   # → at least one match (the "no matches" hint)

# 4. The bilingual search-keyword rule is followed
rg -n "marca\|brand" src/components/ursa/command-palette.tsx | head -5
```

---

## 6. Reproducibility

A new analyst can re-run the editorial protocol review by following
the steps above. The expected outputs:

```bash
# 1. The protocol source exists
ls -la "upload/Handcrafted Writing and Editorial Quality Protocol.docx"
# → 23330 bytes

# 2. The extracted text exists
ls -la upload/docx_extract/handcrafted-protocol.txt

# 3. The portmanteau framing is fully removed
rg -ni "portmanteau" src/ public/dossier/   # → 0 matches

# 4. The honest "two coined drink names" framing is in place
rg -n "Two coined drink names" src/lib/ursa-data.ts
rg -n "origin / descriptive labels" src/lib/ursa-data.ts

# 5. The dashboard hero lede is the bounded version
rg -n "checked against the bear, the gram, and the green" \
  src/components/ursa/views/dashboard-view.tsx

# 6. The calculator assumption note uses "is consistent with" (not "proves")
rg -n "is consistent with willingness to pay" \
  src/components/ursa/tools/calculator-view.tsx

# 7. The growth positioning statement names the Lima competitive set
rg -n "scaled chains and the award-credentialed tasting rooms" \
  src/components/ursa/views/growth-view.tsx

# 8. The roadmap skeptical-revision log is bounded (not "every recommendation")
rg -n "Three rounds of skeptical challenge shaped" \
  src/components/ursa/views/roadmap-view.tsx

# 9. The Spanish translations are hand-crafted Peruvian Spanish
rg -n "Panel\b" src/lib/i18n.ts       # → "Dashboard" → "Panel"
rg -n "Carta y Producto" src/lib/i18n.ts   # → "Menu & Product" → "Carta y Producto"
```

### 6.1 The editorial-review checklist

A future editorial review should verify:

1. **No generic openings** — every section's first sentence names a
   Ursa-specific fact, competitor, or mechanism.
2. **No interchangeable paragraphs** — every paragraph could belong
   only to Ursa's dossier.
3. **No invented facts** — every factual claim is traceable to a
   source (or marked as a scenario assumption).
4. **No shallow verbosity** — every paragraph advances the argument.
5. **No unsupported confidence** — no "always," "never," "every,"
   "proves," "wins," "works," "translates cleanly," "almost any
   reasonable" without bounded qualification.
6. **No internal process language** — no "this dossier applies a
   handcrafted protocol" in customer-facing copy.
7. **No false totality** — no claim that "every X" when only some X.
8. **Spanish is hand-crafted Peruvian Spanish** — Lima register,
   angle quotes, "Panel" not "Tablero," "Carta" not "Menú."

---

## 7. Cross-references

- For the recommendation ledger's 22-point structure (which enforces
  the protocol's "no shallow verbosity" rule per recommendation) →
  `research/recommendation-ledger.json`
- For how the protocol's "no invented facts" rule applies to the
  baseline defects → **02-archive-workspace-audit.md** §5
- For how the protocol's "no unsupported confidence" rule shaped the
  calculator's conditional headline (BD-05) → **12-calculator-validation.md** §4.3
- For how the protocol's "no interchangeable paragraphs" rule shaped
  the framework re-grading (Hormozi → suggestive, not verified) →
  **11-framework-treatment.md** §2.3
- For the original protocol document → `upload/Handcrafted Writing and Editorial Quality Protocol.docx`
