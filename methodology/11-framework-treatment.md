# 11 — Framework Treatment Methodology

**Task ID:** METHODOLOGY-DOC (this file)
**Source framework tasks:** Macrocycle 2 (theory and scientific
foundations), EC-001 / EC-002 / EC-003 (expert challenges)
**Audit date:** 2026-08-01
**Data artifact:** `research/expert-evidence.json`,
`research/expert-challenges.json`
**Live rendering:** `#/growth` (Hormozi + Sutherland adaptation grids,
Ehrenberg-Bass distinctive-assets section in `#/brand`),
`#/loyalty` (Endowed Progress Effect)

This document records how each marketing / behavioral-science framework
was sourced, what claims the dossier makes on its behalf, what evidence
supports and challenges those claims, how the framework applies (and
does not apply) to Ursa, and the final evidence grade assigned. It is
the reproducible recipe behind every framework citation in the dossier.

---

## 1. The grading rubric

Every framework is graded on a four-point scale.

| Grade | Definition | Required evidence |
|---|---|---|
| `strong` | Decades of independent empirical replication across many categories; peer-reviewed; reproducible by independent researchers | Ehrenberg-Bass / How Brands Grow (single-source panel data, 40+ categories, double-jeopardy law) |
| `moderate` | Multiple supporting studies (peer-reviewed or rigorous industry research), some replication, but limited to specific contexts | Sutherland (Kahneman & Tversky backing + Sutherland case studies); Endowed Progress (Kivetz et al. 2006 + replications) |
| `suggestive` | Anecdotal case studies, popular frameworks without independent empirical validation, "bro frameworks" | Hormozi Value Equation (entrepreneurial case studies, no peer-reviewed RCTs) |
| `insufficient` | No evidence found; or evidence actively contradicts the framework | (none currently at this grade) |

### 1.1 The grading process

1. **Identify the framework's actual principle.** Strip away the marketing
   language and write the principle in one sentence.
2. **Locate independent empirical support.** Search peer-reviewed
   journals (Google Scholar, JSTOR) and rigorous industry research
   (Ehrenberg-Bass Institute publications, Kantar reports).
3. **Locate challenging evidence.** Search for critiques,
   non-replications, and context-limits.
4. **Test applicability to Ursa.** Does the framework's mechanism map
   to a real Ursa lever? Where does it overreach?
5. **Design an uncertainty experiment.** If the framework is adopted,
   what test would confirm or refute its effect for Ursa specifically?
6. **Assign the grade.** Apply the rubric above.

### 1.2 Grade distribution (post-audit)

| Grade | Count | Frameworks |
|---|---|---|
| strong | 1 | Ehrenberg-Bass / How Brands Grow |
| moderate | 2 | Sutherland Perceived Value, Endowed Progress Effect |
| suggestive | 1 | Hormozi Value Equation |
| insufficient | 0 | — |

Total: 4 frameworks audited.

### 1.3 The primary-scientific-frame designation

The audit promoted **Ehrenberg-Bass / How Brands Grow** to **primary
scientific frame**:

> Ursa's strategy should be reframed around mental availability
> (distinctive assets) and physical availability (distribution /
> discoverability), with Hormozi and Sutherland as tactical
> supplements, not primary theory.

Hormozi and Sutherland remain in the dossier as tactical levers
(testable hypotheses, not proven principles). Each Hormozi-derived and
Sutherland-derived recommendation in the growth view carries an
explicit test method and stop rule.

---

## 2. Hormozi Value Equation

| Field | Value |
|---|---|
| Framework ID | FW-001 |
| Source | Acquisition.com / `$100M Offers` (Alex Hormozi) |
| Evidence grade | **suggestive** |
| Independent empirical support | weak |
| Disposition | `label_as_suggestive` |

### 2.1 Actual principle

```
Value = (Dream Outcome × Perceived Likelihood of Achievement) /
        (Time Delay + Effort & Sacrifice)
```

Increase value by raising the numerator (dream outcome, perceived
likelihood) or lowering the denominator (time delay, effort and
sacrifice).

### 2.2 Supporting evidence

Popular in entrepreneurial / gym / SaaS contexts; anecdotal case
studies from Hormozi's own businesses.

### 2.3 Challenging evidence

A 2026 academic paper ("Bro frameworks and the changing logics of
managerial capitalism") classifies Hormozi's Value Equation as a "bro
framework" — a neat formula translating sales psychology without
independent empirical validation. No peer-reviewed RCTs in café or
hospitality contexts.

This challenge was raised in **EC-001** (round 1, marketing-science
validator) and accepted. The action: re-grade Hormozi from "verified"
to "partial/suggestive" in `SOURCES`, add Ehrenberg-Bass as the primary
scientific frame, and label every Hormozi reference in the growth view
as a "suggestive framework" with a link to the challenge.

### 2.4 Applicability to Ursa

**Where it applies:**

- The denominator reduction (decrease time / effort) maps to Ursa's
  fast morning service (the 7-10am Ursa Mañana window).
- The numerator (dream outcome) is a stretch for coffee — "become a
  person who knows good coffee" is plausible but unverified.

**Where it does NOT apply:**

- The "grand slam offer" / value-stacking approach risks eroding
  specialty-coffee credibility if applied as discount stacking. Ursa's
  craft positioning requires restraint.
- Hormozi's gym/SaaS context assumes a transactional buyer who compares
  offers on a spreadsheet. Coffee is a category-buyer, habit-driven
  context — Ehrenberg-Bass is the better fit.

### 2.5 Uncertainty experiment

A/B test: offer a bundled pairing (drink + side + story card) vs à la
carte control. Measure attach rate and ticket lift over 14 days. **Stop
if attach rate < 40%.**

### 2.6 How it is rendered in the UI

The growth view's Hormozi adaptation grid renders `HORMOZI_PRINCIPLES`
with adapted text + an explicit "Do not" caveat per principle. The
section header carries a pill labeled "Suggestive framework — testable,
not proven" linking to the EC-001 challenge.

---

## 3. Sutherland Perceived Value

| Field | Value |
|---|---|
| Framework ID | FW-002 |
| Source | FS.blog Knowledge Project / Ogilvy (Rory Sutherland) |
| Evidence grade | **moderate** |
| Independent empirical support | moderate |
| Disposition | `adopt_with_caveats` |

### 3.1 Actual principle

Perceived value can be as satisfying as objective value; low-cost
psychological changes (framing, context, story) often beat expensive
rational improvements.

### 3.2 Supporting evidence

Behavioral economics literature broadly supports framing effects
(Kahneman & Tversky prospect theory; Thaler endowment and mental
accounting). Sutherland's case studies (train toilets, Eurostar,
cereal box redesign) are illustrative applications.

### 3.3 Challenging evidence

Largely anecdotal; few controlled experiments in hospitality contexts.
Perceived-value interventions can feel manipulative if overused. Risk
of "psychological tricks" eroding trust if customers detect them.

This challenge was raised in **EC-002** (round 2, behavioral-economics
validator) and accepted. The action: re-grade Sutherland from "verified"
to "partial" in `SOURCES`. Each Sutherland-derived recommendation in
the growth view now has a test method and stop rule.

### 3.4 Applicability to Ursa

**Where it applies:**

- Story cards, named preparations, the bear as a recurring character —
  these are perceived-value levers at near-zero cost.
- The Art Nouveau context (the two-bar theatre, the visible roaster) is
  exactly the kind of environmental design Sutherland advocates.

**Where it does NOT apply:**

- Sutherland's "irrationality is rational" framing should not be used
  to justify deceptive pricing or artificial scarcity.
- Ursa's craft credibility requires honesty about what the customer is
  paying for. The story card must be true, not invented.

### 3.5 Uncertainty experiment

Add an origin story card to pour-over service for 14 days. Measure
perceived-value proxy (willingness to pay, social shares, return rate)
vs control period. **Stop if return-rate uplift < 5% after 14 days.**

### 3.6 How it is rendered in the UI

The growth view's Sutherland adaptation grid renders
`SUTHERLAND_PRINCIPLES` with adapted application + caveats. A
"try-it-first" callout names the three cheapest perceived-value levers
(story card, named preparation, bear character) and links each to its
test method in the experiment tracker (`#/experiments`).

---

## 4. Ehrenberg-Bass / How Brands Grow

| Field | Value |
|---|---|
| Framework ID | FW-003 |
| Source | `How Brands Grow` (Byron Sharp, Ehrenberg-Bass Institute, 2010) |
| Evidence grade | **strong** |
| Independent empirical support | strong |
| Disposition | `adopt_as_primary_scientific_frame` |

### 4.1 Actual principle

Brands grow by building **mental availability** (being thought of in
buying situations) and **physical availability** (being easy to buy).
**Distinctive brand assets** (colors, characters, logos) are shortcuts
to mental availability. **Category buyers** are more important than
loyal buyers (the "double jeopardy" law: small brands have fewer
buyers *and* those buyers buy slightly less often).

### 4.2 Supporting evidence

Decades of single-source panel data across 40+ categories. Replicated
by independent researchers. The "double jeopardy" law and "duplication
of purchase" law are empirical regularities, not theoretical claims.

### 4.3 Challenging evidence

Some critics argue it underweights emotional / loyalty effects; less
tested in B2B and experiential / hospitality contexts. May not fully
apply to neighborhood cafés where loyalty and frequency matter more
than in FMCG categories.

### 4.4 Applicability to Ursa

**Where it applies (and where it is the primary lens):**

- The bear, the Art Nouveau language, the two-bar layout, "Un gramo a
  la vez" — these are **distinctive brand assets**. Ursa's job is to
  make them consistently recognizable (mental availability) and easy
  to find (physical availability via Google, reviews, hotel cards).
- The "distribution gap" finding (CL-002: "The biggest gap is
  distribution, not product") is an Ehrenberg-Bass physical-availability
  problem. The REV-ENRICH correction (Ursa's GBP is active, just
  under-optimized) sharpens this: the problem is mental availability
  (Google doesn't surface Ursa in best-of lists) + physical
  availability (no website, weak review velocity).

**Where it does NOT apply (or needs adaptation):**

- The "reach all category buyers, not just loyalists" prescription
  needs adaptation — Ursa is a single-site café, not an FMCG brand.
  Physical availability = local discoverability (GBP, Rappi, hotel
  cards), not national distribution.
- The "duplication of purchase" law (your buyers also buy competitors)
  is true for cafés but the right interpretation is: Ursa's regulars
  also drink at Neira / Terrua / Milenaria. Loyalty is shared, not
  exclusive — and that's normal, not a defect.

### 4.5 Uncertainty experiment

Track branded search volume ("ursa coffee miraflores") and Google
Business Profile interactions monthly. If branded search grows after
the GBP + review push, mental availability is improving.

### 4.6 How it is rendered in the UI

The brand audit view (`#/brand`) renders the **Distinctive Assets
section** with 4 candidate assets (bear character, Art Nouveau
ornamentation, "Un gramo a la vez" tagline, brown-to-green palette).
Each candidate carries:

- `uniqueness` — verified by CENSUS-1 (0 of 18 competitors use an
  animal character, etc.)
- `prevalence` — cross-surface application (avatar yes, Rappi no,
  TripAdvisor no, etc.)
- `censusEvidence` — specific CENSUS-1 findings
- `verdict` — confirmed / potential / rejected
- `promoteToDistinctiveAssetOnlyIf` — the gate (90 days of consistent
  application + customer-recall survey n≥40 with ≥30% unprompted
  recall)

The growth view's positioning evidence grid cites CENSUS-1 findings
(0/18 competitors use bear character; 0/18 use two-bar format) as
direct Ehrenberg-Bass evidence for Ursa's mental-availability
opportunity.

---

## 5. Endowed Progress Effect

| Field | Value |
|---|---|
| Framework ID | FW-004 |
| Source | Kivetz, Urminsky & Zheng (2006, Journal of Consumer Research) |
| Evidence grade | **moderate** |
| Independent empirical support | moderate |
| Disposition | `adopt` (with context-narrowing) |

### 5.1 Actual principle

Giving customers a head start on a loyalty card (e.g., 2 free stamps
on a 10-stamp card) increases completion rates by ~82% because it
creates the illusion of progress toward a goal.

### 5.2 Supporting evidence

Original Kivetz et al. (2006) experiments replicated in multiple
contexts (car wash, coffee, software trials). The goal-gradient effect
(customers accelerate effort as they near the goal) is well-documented
in the behavioral-economics literature.

### 5.3 Challenging evidence

Effect sizes vary by context; may not replicate identically in digital
wallet contexts. Some customers may perceive "free stamps" as
manipulative if not framed honestly.

This challenge was raised in **EC-003** (round 3, loyalty-science
validator) and accepted. The action: narrow the loyalty view claim
from "82% lift on the 8-visit card" to:

> The Endowed Progress Effect (Kivetz et al. 2006) found ~82% lift on
> 10-stamp cards; the effect on 8-visit cards is not separately
> validated and should be tested.

**Implementation status:** EC-003 is the one challenge that was
accepted but not yet fully implemented in the loyalty-view code
(`blocked_by: "requires edit to loyalty-view.tsx — deferred to next
implementation pass"`). The current loyalty view still references the
82% figure without the 10-stamp caveat. This is a known follow-up.

### 5.4 Applicability to Ursa

**Where it applies:**

- Directly applicable to the itsloyaleats 8-visit wallet card (Apple
  Wallet + Google Pay). Giving 1-2 "welcome" stamps to new members is
  a low-cost, evidence-based retention lever.

**Where it does NOT apply:**

- The effect assumes the customer values the reward. If the free coffee
  is unattractive (e.g., restricted to a drink they don't like), the
  effect weakens.
- The effect assumes a single-step goal (one free coffee after 8
  visits). Multi-tier loyalty programs (silver / gold / platinum) do
  not benefit from endowed progress in the same way.

### 5.5 Uncertainty experiment

A/B test: new wallet-card members get 0 stamps (control) vs 1
"welcome" stamp (treatment). Track completion rate over 90 days.
**Stop if treatment completion rate is not at least 15 percentage
points higher than control after 90 days.**

### 5.6 How it is rendered in the UI

The loyalty view (`#/loyalty`) renders the Endowed Progress Effect as
the first of four behavioral-science principles, with: source
citation, italic finding quote (the narrowed version), application to
Ursa's 8-visit card, and a specific recommendation block. An 82%-
context callout cites Kivetz–Urminsky–Zheng 2006.

**Known follow-up:** The loyalty-view copy should be updated to carry
the 10-stamp caveat per EC-003. The methodology recommendation is to
make this edit in the next implementation pass; the framework grade
and disposition are already correct in `expert-evidence.json`.

---

## 6. The expert-challenge round (Macrocycle 2)

The framework re-grading was driven by three expert challenges,
recorded in `research/expert-challenges.json`:

| ID | Round | Challenger | Challenge (short) | Disposition |
|---|---|---|---|---|
| EC-001 | 1 | marketing-science-validator | Hormozi lacks independent empirical validation; should be labeled suggestive, with Ehrenberg-Bass as primary | ACCEPTED, implemented |
| EC-002 | 2 | behavioral-economics-validator | Sutherland is largely anecdotal; should be framed as testable hypotheses, not proven levers | ACCEPTED, implemented |
| EC-003 | 3 | loyalty-science-validator | The 82% endowed-progress lift was on 10-stamp cards, not 8; the dossier should not claim 82% lift for an 8-visit card specifically | ACCEPTED, deferred to next implementation pass |

### 6.1 The challenge process

Each challenge follows a four-step process:

1. **Identify the challenger's role.** Each round has a different
   validator persona (marketing-science, behavioral-economics,
   loyalty-science).
2. **State the challenge.** The challenger writes a one-paragraph
   challenge naming the specific claim or framework being contested.
3. **Identify the target.** The challenge names the `target_claims`
   (e.g., CL-003) and `target_frameworks` (e.g., FW-001) it contests.
4. **Disposition.** The orchestrator records `ACCEPTED` or `REJECTED`
   with a reason. If ACCEPTED, an `action` and `implemented` boolean
   follow. If `implemented: false`, a `blocked_by` reason is recorded.

### 6.2 Challenge summary

```json
{
  "total_challenges": 3,
  "accepted": 3,
  "rejected": 0,
  "implemented": 2,
  "deferred": 1
}
```

The single deferred challenge (EC-003) is the loyalty-view copy edit
documented in §5.3 above. The framework grade and disposition are
already correct in `expert-evidence.json`; the UI copy lags.

---

## 7. Reproducibility

A new analyst can re-run the framework audit by following the steps
above. The expected outputs:

```bash
# 1. The framework audit artifacts exist
ls -la research/expert-evidence.json research/expert-challenges.json

# 2. The framework count matches
jq '.total_frameworks_audited' research/expert-evidence.json   # → 4
jq '.total_challenges' research/expert-challenges.json         # → 3

# 3. The grade distribution matches the methodology
jq '.grade_distribution' research/expert-evidence.json
# → { "strong": 1, "moderate": 2, "suggestive": 1 }

# 4. The primary-scientific-frame is Ehrenberg-Bass
jq '.primary_scientific_frame' research/expert-evidence.json
# → "Ehrenberg-Bass (How Brands Grow) — the strongest evidence-based
#    marketing science framework. Ursa's strategy should be reframed
#    around mental availability (distinctive assets) and physical
#    availability (distribution/dicoverability), with Hormozi and
#    Sutherland as tactical supplements, not primary theory."

# 5. The EC-003 follow-up is documented
jq '.challenges[] | select(.id == "EC-003") | .implemented' \
  research/expert-challenges.json   # → false (deferred)
```

### 7.1 The framework-rendering test

The growth view (`#/growth`) and brand audit view (`#/brand`) should
pass this framework-rendering test:

1. **Hormozi** is labeled "Suggestive framework — testable, not proven"
   in the section header.
2. **Sutherland** is labeled with an explicit "try it first" callout
   naming the three cheapest perceived-value levers.
3. **Ehrenberg-Bass** appears in the brand audit as a Distinctive
   Assets section with 4 candidate assets, each carrying the
   `promoteToDistinctiveAssetOnlyIf` gate.
4. **Endowed Progress** appears in the loyalty view with the source
   citation (Kivetz et al. 2006) and the narrowed claim (the 10-stamp
   caveat is a known follow-up — EC-003).

---

## 8. Cross-references

- For how the evidence-grading system (verified / partial / unverified /
  gap) applies to non-framework claims → **03-brand-audit-methodology.md** §2
- For how the 9 headline claims (CL-001 → CL-009) were re-graded → **02-archive-workspace-audit.md** §6
- For how Hormozi's "Dream Outcome" maps to Ursa Mañana's marginal-cost
  math → **12-calculator-validation.md** §3
- For how the Endowed Progress Effect informs the loyalty calculator's
  "endowed stamps" slider → `/home/z/my-project/src/components/ursa/tools/loyalty-view.tsx`
- For how the recommendation ledger cites each framework → `research/recommendation-ledger.json` (each REC cites the relevant FW-00x)
