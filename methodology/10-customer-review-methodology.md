# 10 — Customer Review Methodology

**Task ID:** METHODOLOGY-DOC (this file)
**Source review tasks:** REV-ENRICH (subagent), CENSUS-1 (orchestrator)
**Snapshot date:** 2026-08-01
**Data artifact:** `CUSTOMER_REVIEWS`, `REVIEW_AGGREGATE_RATINGS`,
`REVIEW_RESEARCH_LOG`, `CUSTOMER_VOICE` (all in `src/lib/ursa-data.ts`)
**Live rendering:** `#/market` ("Real customer reviews & external voice"
section + 5 customer-voice themes)

This document records how customer-review research was conducted: which
platforms were searched, how reviews were sampled, how themes were
coded, how sample sizes are reported, what was found versus what was
not, and what platform-access limitations were encountered. It is the
reproducible recipe behind every customer-voice claim in the dossier.

---

## 1. Platforms searched

The review search covered 16 platforms. Every platform was probed on
2026-08-01 (the snapshot date) using the query set documented in
methodology 09 §3. The full list lives in
`REVIEW_RESEARCH_LOG.platformsChecked`.

### 1.1 Platform inventory and outcomes

| # | Platform | Query type | Outcome |
|---|---|---|---|
| 1 | Google Search | `web_search` via z-ai SDK | Returned snippets quoting IG posts and editorial mentions |
| 2 | Google Maps (indirect via addagio.io schema.org data) | Aggregator scrape | aggregateRating: 4.5★, ~56 Google reviews |
| 3 | Instagram (public posts + reels tagging `@ursacoffeeperu`) | Snippet recovery | 5 real customer mentions found |
| 4 | TripAdvisor (.com, .pe, .es, .mx mirrors) | Direct page visit | Listing exists; ~0 Ursa-specific reviews (captcha-blocked) |
| 5 | Facebook (UrsaCoffeePeru page) | Direct page visit | 0 ratings |
| 6 | Yelp | Direct search | Returned an unrelated Bridgeport, CT "Ursa Coffee Roasters" — different business |
| 7 | Corner.inc listing | Direct page visit | Editorial summary (no individual user reviews visible) |
| 8 | mindtrip.ai listing | Direct page visit | 4.8★ aggregate, 66 reviews (aggregator-scraped) |
| 9 | NovaCircle spot profile | Direct page visit | AI-generated pros/cons (no real user reviews) |
| 10 | addagio.io directory | Direct page visit | schema.org LocalBusiness aggregateRating |
| 11 | Lima Gourmet Company travel guide | Editorial article | Positive editorial mention |
| 12 | Barista Magazine (Feb 2025 Lima cafés article) | Editorial article | Ursa NOT mentioned |
| 13 | Wanderlog (34 best coffee roasters in Lima) | Editorial list | Ursa NOT in list |
| 14 | Coffee Pass Peru brand page | Platform listing | Active membership-platform presence |
| 15 | Rappi (delivery menu) | Direct page visit | Active delivery menu; no public reviews visible |
| 16 | TikTok (`#ursacafe` tag) | Hashtag browse | Visible but not text-mineable via search |

### 1.2 What was found vs what was not

**Found:** 8 real Ursa-specific mentions (Instagram + editorial) + 4
aggregate ratings (Google via addagio, mindtrip.ai, plus 0-rating
TripAdvisor and Facebook as honest nulls).

**Not found:** TripAdvisor reviews (captcha-blocked; snippet evidence is
consistent: ~0 reviews), Facebook ratings (0), Yelp (wrong business),
Barista Magazine mention (Ursa not in article), Wanderlog listing (Ursa
not in 34-roaster list).

### 1.3 The REV-ENRICH correction

The prior dossier claimed Ursa's Google Business Profile was
"missing/unverified." The review search contradicted this:

- addagio.io's schema.org `LocalBusiness.aggregateRating` shows 4.5★
  with ~56 Google reviews (234 total across all platforms).
- The Google Business Profile appears **active and well-rated**; the
  real friction is **weak SEO/GBP optimization** — Ursa's GBP is not
  surfaced in Google's own "best Lima cafés" guides, while Neira (911
  reviews) and Puku Puku (658 reviews) dominate.

This correction is documented in the `REVIEW_RESEARCH_LOG` intro
narrative and surfaced in the market view's "What is made difficult or
frustrating" theme (CUSTOMER_VOICE theme 3, point 1).

---

## 2. Review sampling approach

### 2.1 The sampling rule

The review search used a **purposive sample** of every Ursa-specific
public mention discoverable through the 16 platforms above. This is not
a random sample and not a representative sample — it is a census of
*what is publicly visible*. The honest framing:

> Ursa's public review footprint is THIN but NOT ZERO. TripAdvisor still
> shows ~0 Ursa-specific reviews and Facebook shows 0 ratings, but
> Instagram carries several real customer mentions (verified via web
> search snippets), and aggregator platforms (addagio.io, mindtrip.ai)
> report an active Google Business Profile with 56–66 reviews averaging
> 4.5–4.8 stars.

### 2.2 Inclusion criteria

A mention is included in `CUSTOMER_REVIEWS` if it meets all of:

1. **Ursa-specific** — names `@ursacoffeeperu` or "Ursa Coffee Roasters"
   (Miraflores) explicitly.
2. **Public** — accessible without login, on a public URL.
3. **Verbatim or near-verbatim** — the review text is quoted directly
   (not paraphrased by an aggregator). NovaCircle's AI-generated
   pros/cons is included but flagged as `notes: "AI-aggregated
   profile... Treat as direction, not evidence."`.
4. **Dated** — has a publication or observation date, or a clear
   "snapshot" label.

### 2.3 Exclusion criteria

- Mentions of other businesses named "Ursa Coffee Roasters" (Yelp's
  Bridgeport, CT listing — different business).
- Mentions that paraphrase Ursa without direct attribution (e.g., "Lima
  has some great cafés like Neira, Puku Puku, and others" — Ursa not
  named).
- Mentions behind login walls (Instagram requires login for full post
  view; review text was recovered from Google/Bing search-result
  snippets that quote IG posts verbatim).

### 2.4 The 8 real Ursa-specific mentions

| # | Platform | Author | Date | Theme |
|---|---|---|---|---|
| 1 | Instagram | `@flying__espresso` | 2025-05-15 | Quality ("el mejor espresso que he probado en Lima") |
| 2 | Instagram | `@rutadelcafeperuano` | 2025-08-23 | Barista skill / Competition (Paulo Sierra Aeropress champion) |
| 3 | Instagram | Coffee reviewer (reel) | 2026-01-03 | Return visits / Tasting experience |
| 4 | Instagram | Customer (tagged Ursa in launch post) | 2026-06-02 | Quality / Recommendation ("Absolutamente todo 10/10") |
| 5 | Instagram | `@ursacoffeeperu` (own post) | 2026-06-13 | Specialty beans / Patient craft (Kangal bean) |
| 6 | Corner.inc | Editorial listing | 2026 (snapshot) | Atmosphere / Education / Quality |
| 7 | NovaCircle | AI-generated profile | 2025-12-19 (updated 2026-01-07) | Mixed (quality + service vs seating + price) |
| 8 | Lima Gourmet Company | Editorial | 2026 (snapshot) | Quality / Craft / Espresso |

### 2.5 The 4 aggregate ratings

| Platform | Rating | Review count | Caveat |
|---|---|---|---|
| Google (via addagio.io schema.org) | 4.5★ | ~56 Google / 234 total | Aggregator-scraped; underlying GBP not directly accessible |
| mindtrip.ai | 4.8★ | 66 | Aggregator-scraped |
| TripAdvisor | ~0★ | ~0 | Listing exists; reviews not directly accessible (captcha) |
| Facebook | 0★ | 0 | Page exists; no ratings |

---

## 3. Theme coding method

### 3.1 The coding rule

Themes are coded by **direct extraction**, not by frequency analysis.
A review's theme is the single most prominent topic of the review text.
If a review covers multiple topics equally, each topic is recorded as a
separate theme entry.

### 3.2 The 5 customer-voice themes

The `CUSTOMER_VOICE` array in `ursa-data.ts` organizes findings into
five themes:

1. **What customers value strongly** — 5 points
2. **What competitors do poorly** — 7 points
3. **What is made difficult or frustrating** — 5 points
4. **What Ursa is positioned to own** — 6 points
5. **Competitor-specific review evidence (census)** — 9 per-competitor review theme summaries

### 3.3 How each theme is supported

Every theme point is a `{ text, evidence }` object. The `text` field is
the claim; the `evidence` field cites specific competitor data (from
CENSUS-1) or specific Ursa review data (from `CUSTOMER_REVIEWS`).

**Example (theme 1, point 1):**

```typescript
{
  text: "In-house roasting visible from the bar — proof of specialty credibility",
  evidence: "Corner.inc editorial praises Ursa's 'visible roasting equipment creates a workshop feel';
   Terrua's farm-to-cup story (513 Google reviews) and Punto Café's roastery identity show the same
   pattern works category-wide."
}
```

**Example (theme 5, point 1 — Milenaria):**

```typescript
{
  praise: ["pancakes", "açaí bowls", "oat milk cappuccino", "cozy atmosphere", "early opening (6:30am)"],
  complaints: ["limited vegan options", "not cheap"],
  sampleSizeNote: "Themes drawn from TripAdvisor reviews (n=41). Sample adequate for direction, not
   for coded frequency analysis."
}
```

### 3.4 What "direction-only" means

The theme coding is **direction-only**, not quantitative. The
`sampleNote` field on every theme honestly states the limit:

> Drawn from 8 real Ursa-specific mentions (Instagram + editorial) plus
> review themes from 5 high-volume competitors (Neira 911 Google,
> Terrua 513, Puku Puku 658 TA, Cate 190 Google, Milenaria 41 TA).
> Direction-setting, not statistically coded.

A "direction-only" theme is a hypothesis supported by review text, not
a frequency-tested finding. The next step (see §6 below) is to perform
coded theme-frequency analysis on the 3 highest-volume competitors.

---

## 4. Sample size reporting

### 4.1 The sample-size honesty rule

Every theme, every per-competitor review summary, and every aggregate
rating carries an explicit sample size. The rule:

- If the sample size is **directly counted** (e.g., "911 Google
  reviews"), record the number.
- If the sample size is **estimated** (e.g., "~56 Google reviews via
  aggregator scrape"), record the number with a tilde and the source.
- If the sample size is **too small to support coded analysis**, say so
  explicitly. The phrase "Direction only — no coded frequency analysis"
  is the standard caveat.
- If the sample size is **zero**, record zero and the platform checked.

### 4.2 Sample sizes by competitor (CENSUS-1)

| Competitor | Google reviews | TripAdvisor reviews | Total |
|---|---|---|---|
| Neira Café Lab | 911 | — | 911 |
| Puku Puku | — | 658 | 658 |
| Terrua | 513 | 37 | 550 |
| Cate Tasting Room | 190 | 17 | 207 |
| Milenaria Cafe | — | 41 | 41 |
| Estación 329 | — | (TA 4.8★) | — |
| Punto Café | — | 2 | 2 |
| Amauta Coffee | — | 7 | 7 |
| Ursa Coffee | ~56 | ~0 | ~56 |

Three competitors (Neira 911, Terrua 513, Puku Puku 658) have enough
reviews to support future coded theme-frequency analysis. The rest are
direction-only.

### 4.3 The sample-size note in the UI

The market view renders `theme.sampleNote` as a footer under each theme
card with a "Sample ·" label. The footer is intentionally understated
(it does not draw attention to itself) but always present. A future
analyst can scan the page and read every sample-size caveat without
leaving the view.

---

## 5. What was found vs what was not

### 5.1 What was found

- **8 real Ursa-specific mentions** (Instagram + editorial) — quoted
  verbatim in `CUSTOMER_REVIEWS` with platform, URL, author, date,
  sentiment, theme, text, notes.
- **4 aggregate ratings** (Google via addagio, mindtrip.ai, TripAdvisor,
  Facebook) — recorded in `REVIEW_AGGREGATE_RATINGS` with platform,
  rating, count, caveat.
- **5 customer-voice themes** with 32 supporting points, each citing
  specific competitor or Ursa evidence.
- **9 per-competitor review theme summaries** (theme 5) — praise themes,
  complaint themes, sample size note.

### 5.2 What was not found

- **TripAdvisor reviews** for Ursa — captcha-blocked; snippet evidence
  is consistent: ~0 Ursa-specific reviews. This is recorded as a `gap`
  per the four-tier evidence grading system (methodology 03 §2).
- **Facebook ratings** for Ursa — 0 ratings on the UrsaCoffeePeru page.
  Recorded as a `gap`.
- **Yelp reviews** — Yelp returned an unrelated Bridgeport, CT "Ursa
  Coffee Roasters" (different business). Ursa Miraflores has no Yelp
  presence.
- **Barista Magazine mention** — Ursa is NOT mentioned in the Feb 2025
  Lima cafés article. Recorded as absence.
- **Wanderlog listing** — Ursa is NOT in Wanderlog's 34 best coffee
  roasters in Lima list. Recorded as absence.
- **Coded theme-frequency analysis** — not performed; sample sizes too
  small for most competitors. Documented as a `nextSteps` item.

### 5.3 Honest absence reporting

Every "not found" outcome is recorded in `REVIEW_RESEARCH_LOG.limitations`:

```typescript
limitations: [
  "TripAdvisor captcha-blocked; review text could not be read directly. Snippet evidence is consistent:
   Ursa has ~0 TripAdvisor reviews.",
  "Instagram page-reader extraction did not return caption text; review text was recovered from
   Google/Bing search-result snippets that quote Instagram posts verbatim.",
  "NovaCircle's pros/cons section is AI-generated summary text, not direct user quotes — flagged accordingly.",
  "addagio.io and mindtrip.ai aggregate ratings are aggregator scraped data; the underlying Google Business
   Profile was not directly accessible for verification.",
  "Sample size (8 real mentions + 4 aggregate ratings) is too small for coded theme analysis. The
   CUSTOMER_VOICE themes above remain illustrative; this Real Reviews section is the verifiable supplement."
]
```

---

## 6. Platform access limitations

The review search encountered specific platform-access limitations.
These are documented so a future analyst knows what to expect.

### 6.1 TripAdvisor — DataDome captcha

TripAdvisor blocks automated access via DataDome captcha. Direct
page-reader extraction failed for every TripAdvisor URL probed.

**Workaround:** Search-engine snippets (Google, Bing) return quoted
review text in their result cards. The snippets are consistent across
queries: Ursa has ~0 TripAdvisor reviews. This is recorded as a `gap`,
not as a verified absence.

**Recommendation:** A future analyst with TripAdvisor API access
(business-partner tier) should re-verify Ursa's review count and rating
directly.

### 6.2 Instagram — JS-only SPA, no caption text

Instagram is a JavaScript single-page application. Direct page-reader
extraction returned the page shell but not the post caption text (which
is injected by client-side JavaScript).

**Workaround:** Search-engine snippets return the caption text verbatim
in their result cards (Instagram allows search-engine crawlers to read
captions for indexing). The 5 Instagram-sourced reviews in
`CUSTOMER_REVIEWS` were recovered this way.

**Limitation:** Snippet text is truncated at ~150-300 characters. Longer
reviews are partial. The `notes` field records the engagement count
(likes, comments) where visible.

### 6.3 Corner.inc — Vercel security checkpoint

Corner.inc returns a Vercel security checkpoint for automated requests.

**Workaround:** The editorial summary was recovered from
search-engine snippets. No individual user reviews are visible on the
Corner.inc listing (the platform is editorial-only for this entry).

### 6.4 addagio.io / mindtrip.ai — Aggregator-scraped data

addagio.io and mindtrip.ai display aggregate ratings scraped from
Google Business Profile. The underlying GBP was not directly accessible
for verification.

**Workaround:** The schema.org `LocalBusiness.aggregateRating` markup
on addagio.io is machine-readable and was parsed to extract the 4.5★ /
56-review data point. This is the basis for the "REV-ENRICH correction"
(Ursa's GBP is active, not missing).

**Limitation:** Aggregator data is a snapshot. The underlying GBP rating
may have changed since the aggregator's last scrape.

### 6.5 NovaCircle — AI-generated profile

NovaCircle's pros/cons section is AI-generated summary text, not direct
user quotes. `total_recommendations: 0` — no real user reviews left on
NovaCircle itself.

**Workaround:** Included in `CUSTOMER_REVIEWS` as entry #7 with an
explicit `notes` flag: "Treat as direction, not evidence." The sentiment
is `mixed` (pros + cons both recorded).

### 6.6 TikTok — Not text-mineable

The `#ursacafe` hashtag is visible on TikTok but TikTok's search does
not return caption text via web search. The hashtag was browsed manually
(no text extracted).

**Limitation:** TikTok is a major content platform for café discovery
in Lima. A future analyst with TikTok API access should re-verify
Ursa-specific content volume.

---

## 7. Reproducibility

A new analyst can re-run the review search by following the steps above.
The expected outputs:

```bash
# 1. The review data exports exist
rg -n "export const CUSTOMER_REVIEWS|export const REVIEW_AGGREGATE_RATINGS|export const REVIEW_RESEARCH_LOG|export const CUSTOMER_VOICE" \
  src/lib/ursa-data.ts
# → 4 matches

# 2. The review count matches the methodology
rg -n "realReviewsFound" src/lib/ursa-data.ts   # → 8
rg -n "aggregateRatingsFound" src/lib/ursa-data.ts   # → 4

# 3. The market view renders the Real Reviews section
curl -s -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/#/market                          # → 200

# 4. The REVIEW_RESEARCH_LOG limitations are present
rg -n "TripAdvisor captcha|Instagram page-reader|NovaCircle" src/lib/ursa-data.ts
# → 3 matches (one per documented limitation)

# 5. Every CUSTOMER_VOICE theme has a sampleNote
rg -n "sampleNote:" src/lib/ursa-data.ts | wc -l   # → 5 (one per theme)
```

### 7.1 The honest-narrative test

The market view's "Real customer reviews & external voice" section
should pass this honest-narrative test:

1. **Reads its own limitations.** The section explicitly states the
   sample size (8 real mentions + 4 aggregate ratings) and the
   direction-only caveat.
2. **Cites platform + date + author for every review.** Each review
   card shows platform, URL, author handle, date, sentiment, theme.
3. **Distinguishes verbatim quotes from AI-generated summaries.** The
   NovaCircle entry is flagged "AI-aggregated... Treat as direction,
   not evidence."
4. **Records what was not found.** The limitations are surfaced in the
   section's methodology callout, not buried in a footnote.
5. **Links the correction.** The REV-ENRICH correction (Ursa's GBP is
   active, not missing) is recorded in the narrative.

---

## 8. Cross-references

- For the 1km competitor census that anchors the per-competitor review themes → **09-competitor-census-methodology.md** §5
- For the four-tier evidence grading applied to each review finding → **03-brand-audit-methodology.md** §2
- For the baseline defect that motivated this methodology (BD-06) → **02-archive-workspace-audit.md** §5.6
- For how customer-voice findings inform the recommendation ledger → `research/recommendation-ledger.json` (each REC cites customer-voice themes)
