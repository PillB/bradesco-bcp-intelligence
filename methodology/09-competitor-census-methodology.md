# 09 — Competitor Census Methodology

**Task ID:** METHODOLOGY-DOC (this file)
**Source census task:** CENSUS-1 (worklog)
**Census ID:** CENSUS-1
**Snapshot date:** 2026-08-01
**Census artifact:** `research/competitor-census.json`
**Live rendering:** `#/market` (census table) + `#/competitors` (interactive dashboard)

This document records how the 1km competitor census around Ursa Coffee
was designed, executed, and verified. It is the reproducible recipe
behind the 18-competitor census that anchors the dossier's market view.

---

## 1. The 1km study area definition

### 1.1 Anchor

| Field | Value |
|---|---|
| Business | Ursa Coffee Roasters |
| Address | Alcanfores 183, Miraflores, Lima 15074, Peru |
| Approx. coordinates | lat -12.1186, lng -77.0347 (Google-Maps-derived, ±50 m) |
| District | Miraflores |

### 1.2 Radius

**1km walking radius from the anchor.**

### 1.3 Why 1km?

1km is the practical walk-up catchment for an espresso bar / café in a
dense, walkable district like Miraflores. Beyond 1km, customers tend to
drive or take a cab, and the choice set widens to all of Lima — at which
point a 1km census is meaningless. Within 1km, the customer is making a
walk-up decision based on what is visible from the sidewalk.

### 1.4 District boundary

The census is bounded to **Miraflores**. Barranco (immediately south)
and San Isidro (immediately east) are excluded from the 1km catchment
but included as **Lima-wide benchmarks** when a competitor there is a
direct award-race rival (e.g., Monótono Coffee, Barranco — 1st place
CAM Café 2025) or a category-defining reference (e.g., Bisetti,
Barranco — owns the "escuela de café" position).

Lima-wide benchmarks are flagged `distanceBand: "out-of-area-lima-wide"`
and are not counted in the 1km-catchment totals.

---

## 2. The 15-street grid search plan

### 2.1 Method

A **street-radiating grid** from Parque Kennedy (Miraflores' central
plaza). Every named street within a 1km walk of Alcanfores 183 was
walked virtually via Google Maps Street View and cross-referenced
against Google Places, TripAdvisor, and Instagram location tags.

### 2.2 The 15 streets

| # | Street | Role | Direction |
|---|---|---|---|
| 1 | Alcanfores | Ursa's street; same-street competitors here are critical proximity | N-S from Parque Kennedy to Av. Arequipa |
| 2 | Av. Larco | Main commercial spine of Miraflores | E-W |
| 3 | Calle Recavarren | Parallel to Larco, café-dense | E-W |
| 4 | Calle Enrique Palacios | Specialty-coffee corridor | N-S |
| 5 | Calle Piura | Punto Café street, terrace overlooking San Martín park | N-S |
| 6 | Calle Bolívar | Secondary café street | N-S |
| 7 | Calle Diez Canseco | Connector between Larco and Parque Kennedy | E-W |
| 8 | Calle Santa Cruz | Residential edge of catchment | N-S |
| 9 | Av. Mariscal La Mar | Bakery/cafe corridor on western edge | N-S |
| 10 | Pasaje Tello | Pedestrian lane behind Larco; home to Terrua | Short E-W |
| 11 | Calle Schell | Tourist spine off Parque Kennedy | E-W |
| 12 | Calle Manuel Bañón | Connector | Short |
| 13 | Calle San Ramón | Café-adjacent residential | Short |
| 14 | Av. Diagonal | Western boundary of catchment | N-S |
| 15 | Calle de las Pizzas | Tourist lane off Parque Kennedy; excludes pure bars/pizzerias | Short |

### 2.3 Excluded lanes

Two lanes were considered and explicitly excluded:

| Lane | Reason |
|---|---|
| Calle de las Pizzas | Pure pizzerias and bars; no specialty coffee presence (listed in coverage ledger as `excluded` for transparency) |
| Av. Arequipa | Major arterial; transit-only on Ursa's side at the relevant block |

### 2.4 Why a street-radiating grid (not a circular buffer)?

A circular 1km buffer would overcount hard-to-reach blocks (across
Av. Arequipa's transit-only lanes, across the Parque Kennedy park
itself) and undercount along the walkable commercial spines. The street
grid respects pedestrian reality: it walks the actual paths a customer
walks from Alcanfores 183.

---

## 3. Search queries used

The census combined Spanish and English search queries across Google
Search, Google Maps, TripAdvisor, Instagram, and editorial travel
guides.

### 3.1 Spanish queries

| Query | Platform | Purpose |
|---|---|---|
| `cafeterías Miraflores Lima` | Google Search | Broad discovery |
| `café de especialidad Miraflores` | Google Search | Specialty filter |
| `cafeterías cerca de Parque Kennedy` | Google Maps | Proximity filter |
| `cafeterías Alcanfores Miraflores` | Google Maps | Same-street filter |
| `mejores cafeterías Lima 2025` | Google Search | Award lists |
| `campeón café Perú 2025` | Google Search | CAM Café 2025 award verification |
| `cafés Lima reseñas` | TripAdvisor | Review-volume check |
| `tostadero café Lima` | Google Search | Roastery filter |
| `cat café Lima` | Google Search | Tasting-flight filter |

### 3.2 English queries

| Query | Platform | Purpose |
|---|---|---|
| `best coffee shops Miraflores Lima` | Google Search | English-language travel guides |
| `specialty coffee Lima Peru` | Google Search | International coverage |
| `Lima coffee roasters` | Wanderlog | Editorial lists |
| `top 100 coffee shops Latin America TripAdvisor` | TripAdvisor | Award verification |
| `Lima cafés travel guide` | Lima Gourmet Company | Editorial travel content |
| `Peru coffee roaster review` | Barista Magazine | Trade-press coverage |

### 3.3 Query logging

Every query was logged with: timestamp, platform, query string, top-10
results returned, results flagged for inclusion. The full log lives in
`research/search-log.json` (used by both this methodology and
methodology 10).

---

## 4. Classification system

Each discovered business was classified on three axes:

### 4.1 Type (business model)

| Type | Definition |
|---|---|
| Specialty coffee (independent) | Single-site, roastery-led or specialty-led café |
| Specialty coffee (chain) | 2+ Lima locations; scaled specialty |
| Independent cafe (breakfast-led) | Coffee is incidental to a breakfast/brunch menu |
| Bakery (coffee-adjacent) | Bakery primary, coffee as attachment |
| Independent specialty (niche) | Niche identity (bike + coffee, etc.) |
| Independent specialty (Lima-wide leader) | Out-of-area award winner / benchmark |

### 4.2 Subtype (positioning)

Free-text field capturing the specific positioning, e.g.:

- "Breakfast + brunch + coffee" (Milenaria)
- "Roastery + tasting room" (Terrua)
- "Bike + coffee community" (Ciclos)
- "Stand-up espresso bar" (Arabica)
- "Award-winning — CAM 2025 winner" (Monótono)

### 4.3 Distance band

| Band | Range | Color code |
|---|---|---|
| `same-street` | On Alcanfores itself | red (critical proximity) |
| `nearby` | ≤ 250 m walking | gold |
| `within-1km` | 250 m – 1 km walking | green |
| `out-of-area-lima-wide` | > 1 km, Lima-wide benchmark | muted |

The distance band drives the left-border color on the census table rows
and the badge on the competitor name cell. The color logic is in
`PROXIMITY_TONE_CLASSES` in `market-view.tsx`.

---

## 5. Data collected per competitor

Each of the 18 competitors in the census carries the following fields
(see the `Competitor` TypeScript interface in `ursa-data.ts`):

| Field | Type | Notes |
|---|---|---|
| `id` | string | `C01` → `C18` |
| `name` | string | Public-facing name |
| `area` | string | `Miraflores` or `Lima` (for out-of-area) |
| `address` | string | Street address, or "Lima (location not in 1km catchment)" |
| `street` | string | Street name |
| `distanceMeters` | number | Walking distance from Alcanfores 183, ±50 m |
| `distanceBand` | enum | `same-street` / `nearby` / `within-1km` / `out-of-area-lima-wide` |
| `type` | string | Business-model type (see §4.1) |
| `subtype` | string | Positioning subtype (see §4.2) |
| `googleRating` | number \| null | Star rating (1-5); null if not directly verified |
| `googleReviewCount` | number \| null | Review count; null if not directly verified |
| `googleReviewCountNote` | string | Caveat when count is approximate or unverified |
| `tripAdvisorRating` | number \| null | TA star rating |
| `tripAdvisorReviewCount` | number \| null | TA review count |
| `status` | enum | `operating` / `uncertain` / `closed` |
| `positioning` | string | One-sentence positioning description |
| `strength` | string | Single primary strength |
| `weakness` | string | Single primary weakness |
| `ursaImplication` | string | What this competitor means for Ursa |
| `hasWebsite` | boolean | Whether the competitor has a website (the website-gap finding) |
| `reviewThemes` | object | `{ praise: string[], complaints: string[], sampleSizeNote: string }` |
| `hours` | string | Opening hours (when verified) |
| `awards` | string[] | Award list (when applicable) |

### 5.1 Honesty about unknowns

The census explicitly uses `null` and caveat strings rather than
fabricated values. Examples:

- Coffee Notes (C02): `googleRating: null`, `googleReviewCount: null`,
  `googleReviewCountNote: "Mentioned in travel forum; no verified Google
  Business Profile surfaced."`
- Milenaria Cafe (C01): `googleReviewCount: null`,
  `googleReviewCountNote: "Not directly verified; TripAdvisor shows 41
  reviews. Google count likely higher."`

A future analyst running the census should preserve this discipline: it
is better to record `null` than to guess.

---

## 6. Coverage ledger

The coverage ledger is the census's audit trail. It records what was
searched, what was discovered, what was included, what was excluded,
and why.

### 6.1 Streets searched

15 streets (see §2.2 above; full list in
`competitor-census.json.coverageLedger.streetsSearched`).

### 6.2 Businesses discovered

**18** total.

### 6.3 Included

**18** total. Of those:

| Bucket | Count |
|---|---|
| Included in 1km catchment | 14 |
| Included as Lima-wide benchmark | 4 |

### 6.4 Excluded

| Excluded | Reason |
|---|---|
| Starbucks (multiple Miraflores locations) | Chain with >10 Lima locations; city-wide catchment, not Miraflores-specific |
| Juan Valdez (Miraflores locations) | Chain with >10 Lima locations; city-wide catchment |
| Calle de las Pizzas venues | Pizzerias and bars; coffee is incidental, not specialty |
| Hotel restaurants with coffee service (Marriott, Belmond) | Coffee is incidental to hotel F&B; not specialty-cafe competitors |

### 6.5 Status breakdown

| Status | Count | List |
|---|---|---|
| Operating | 14 | (the in-catchment operating set) |
| Uncertain | 3 | Coffee Notes (C02), Café Verde (C09), OK Café (C13) |
| Closed | 1 | Café Verde (C09) — one source reports permanently closed; flagged uncertain pending physical verification |

### 6.6 Category breakdown

| Category | Count | List |
|---|---|---|
| Direct competitors (specialty, 1km) | 11 | C01, C03-C08, C11-C14 |
| Substitutes (bakery-primary) | 1 | El Pan de la Chola (C10) |
| Out-of-area benchmarks | 4 | Bisetti (C15), Ciclos (C16), RAIZ (C17), Monótono Coffee (C18) |
| Same-street competitors | 2 | Milenaria (C01, 170 m), Coffee Notes (C02, 120 m, uncertain) |

### 6.7 Anchor findings

| Anchor | Competitor | Detail |
|---|---|---|
| Nearest confirmed | Milenaria Cafe | 170 m, same street |
| Nearest uncertain | Coffee Notes | 120 m, same street — status uncertain |
| Highest Google review volume | Neira Café Lab | 911 reviews |
| Highest TripAdvisor rated | Estación 329 | TA 4.8★ |
| Award leader (in catchment) | Punto Café | CAM 2025 2nd place, Premios Somos 2024 winner |
| Award leader (Lima-wide) | Monótono Coffee | CAM 2025 1st place, Top 100 Latin America (TA Dec 2025) |
| Same-street proximity | Milenaria + Coffee Notes | Both on Alcanfores |

---

## 7. Limitations and what "not exhaustive" means

The census is honest about its limits. The `limitations` array in
`competitor-census.json` records:

1. **Distances are walking-distance estimates from Google Maps, not
   surveyed measurements.** Accuracy ±50 m.
2. **Google ratings and review counts are point-in-time snapshots
   (2026-08-01); they fluctuate daily.** A re-census in 90 days will
   show different numbers.
3. **Three operators (Coffee Notes, Café Verde, OK Café) have uncertain
   status and require physical walk-by verification.** The census records
   them with `status: "uncertain"`; they are not removed.
4. **Café Verde may be permanently closed;** one source reports closure
   but conflicting evidence was not resolved at snapshot.
5. **Review themes are inferred from review text and editorial
   summaries; coded theme-frequency analysis was NOT performed.** Sample
   sizes are too small for most competitors (only Neira n=911, Terrua
   n=513, Puku Puku n=658 support anything close to coded analysis).
6. **Same-street proximity to Ursa (Milenaria, Coffee Notes) is
   address-based;** actual storefront visibility and foot-flow overlap
   require on-site verification.
7. **The census captures named, public-facing competitors.** Informal
   or unnamed coffee vendors (carts, market stalls) are excluded by
   design — see §4 of methodology 02.

### 7.1 What "not exhaustive" means in practice

The census is **a systematic, reproducible 1km sample**, not an
exhaustive enumeration of every place that serves coffee in Miraflores.
Specifically:

- **Excluded by design:** Starbucks, Juan Valdez, hotel restaurants,
  pizzerias, bakeries without a specialty-coffee identity, food courts,
  unnamed carts and stalls.
- **Excluded by reach:** Any operator with no Google, TripAdvisor,
  Instagram, or editorial presence (i.e., truly invisible online). The
  census cannot find what has no public footprint.
- **Excluded by recency:** Any operator that opened after 2026-08-01
  (the snapshot date).
- **Excluded by status:** Any operator that closed between the search
  date and the snapshot compilation — the census records these as
  `status: "closed"` when one source reports closure, but does not
  remove them.

### 7.2 The "not exhaustive" disclaimer in the UI

The market view renders the coverage methodology callout with this
disclaimer verbatim:

> The census captures named, public-facing competitors within a 1km
> walking radius of Alcanfores 183. It is systematic but not
> exhaustive: informal vendors, hotel restaurants, and chains with
> city-wide catchment are excluded by design. Three operators have
> uncertain status and require physical walk-by verification.

---

## 8. Next steps (the `nextSteps` field)

The census's `nextSteps` array records what a follow-up audit should do:

1. **Physical walk-by verification of Coffee Notes, Café Verde, and OK
   Café status** (30-day priority).
2. **Coded theme-frequency analysis** on the 3 highest-volume
   competitors (Neira 911, Terrua 513, Puku Puku 658) to convert
   themes into quantitative signals.
3. **Quarterly re-verification** of Google and TripAdvisor ratings and
   review counts (the snapshot will be stale within 90 days).
4. **Annual CAM Café Perú competition tracking** (Monótono is the
   benchmark to beat; Ursa was top-5 in 2025, target top-3 in 2026).

---

## 9. Reproducibility

A new analyst can re-run the census by following the steps above. The
expected outputs:

```bash
# 1. The census artifact exists and is valid JSON
jq '.' research/competitor-census.json > /dev/null   # → no errors
jq '.competitors | length' research/competitor-census.json   # → 18

# 2. The interactive app renders the census
curl -s -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/#/market                          # → 200

# 3. The competitors dashboard renders
curl -s -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/#/competitors                     # → 200

# 4. The Competitor interface in ursa-data.ts matches the JSON
rg -n "interface Competitor" src/lib/ursa-data.ts
rg -n "CENSUS_META" src/lib/ursa-data.ts

# 5. The coverage ledger totals add up
jq '.coverageLedger | {included, includedInCatchment, includedLimaWide, operating, uncertain, closed, directCompetitors, substitutes, outOfAreaBenchmarks}' \
  research/competitor-census.json
# → { "included": 18, "includedInCatchment": 14, "includedLimaWide": 4,
#     "operating": 14, "uncertain": 3, "closed": 1,
#     "directCompetitors": 11, "substitutes": 1, "outOfAreaBenchmarks": 4 }
```

### 9.1 The census → UI sync check

The census JSON is the source of truth. The `COMPETITORS` array in
`src/lib/ursa-data.ts` should match it field-for-field. The audit
recorded a sync check (worklog Task CENSUS-1, VERIFICATION section):

```bash
jq '.competitors | map({id, name})' research/competitor-census.json > /tmp/census.json
rg -n "id: \"C[0-9]+\"" src/lib/ursa-data.ts > /tmp/data.txt
# Compare the two lists — they should match (18 entries each, same IDs,
# same names).
```

If the two ever diverge, the census JSON wins; the UI must be updated.

---

## 10. Cross-references

- For how the census informs the brand audit (bear uniqueness, 0 of 18) → **03-brand-audit-methodology.md** §1.2
- For how the census anchors the customer-voice themes → **10-customer-review-methodology.md** §3.3
- For how the census maps to the competitor dashboard's 2D matrix → `/home/z/my-project/src/components/ursa/tools/competitors-view.tsx` (`MATRIX_POSITIONS`, Ursa at scale 12, craft 95)
- For how the census findings anchor the recommendation ledger → `research/recommendation-ledger.json` (each REC cites CENSUS-1 findings)
