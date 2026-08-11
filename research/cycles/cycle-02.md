# Macrocycle 2 — Theory and Scientific Foundations

**Status:** COMPLETE
**Date:** 2026-08-01

## Research rounds completed: 4/6

### Round 1: Marketing science foundations
- Researched Ehrenberg-Bass Institute / Byron Sharp "How Brands Grow": distinctive brand assets, mental availability, physical availability, double jeopardy law, duplication of purchase law. Decades of single-source panel data across 40+ categories. Independently replicated. The strongest evidence-based marketing science framework.
- **Finding:** Ursa's strategy should be reframed around mental availability (the bear, Art Nouveau, "Un gramo a la vez" as distinctive assets) and physical availability (Google, reviews, hotel cards as distribution). The "distribution gap" finding (CL-002) is an Ehrenberg-Bass physical-availability problem.

### Round 2: Framework challenge (Hormozi)
- Researched Hormozi Value Equation criticism. A 2026 academic paper ("Bro frameworks and the changing logics of managerial capitalism") classifies it as a "bro framework" — a neat formula translating sales psychology without independent empirical validation. No peer-reviewed RCTs in café/hospitality contexts.
- **Finding:** Hormozi should be labeled "suggestive," not "verified." The growth view's EvidenceTag for Hormozi principles was changed from "verified" to "partial."

### Round 3: Framework challenge (Sutherland)
- Researched Rory Sutherland's perceived-value principles. Draws on behavioral economics (Kahneman, Thaler) but largely anecdotal case studies (train toilets, Eurostar, cereal). Few controlled experiments in hospitality contexts.
- **Finding:** Sutherland should be labeled "moderate, testable." Each Sutherland-derived recommendation should have a test method and stop rule.

### Round 4: Loyalty psychology
- Researched Endowed Progress Effect (Kivetz, Urminsky & Zheng 2006, JCR). Original study used 10-stamp cards; the ~82% lift figure applies to 10-stamp cards specifically. The effect on 8-visit cards (Ursa's itsloyaleats mechanic) is not separately validated.
- **Finding:** The loyalty view's claim of 82% lift should be narrowed: "found ~82% lift on 10-stamp cards; the effect on 8-visit cards is not separately validated and should be tested." (Deferred to next implementation pass — EC-003.)

## Expert challenges completed: 3/3

### Challenge 1 (EC-001): Hormozi framework overclaim
**ACCEPTED.** Re-graded Hormozi from "verified" to "partial/suggestive." Added a framework-grade callout to the growth view explaining the limitation and foregrounding Ehrenberg-Bass as the stronger scientific frame.

### Challenge 2 (EC-002): Sutherland framework overclaim
**ACCEPTED.** Re-graded Sutherland from "verified" to "partial." Added a framework-grade callout explaining the anecdotal basis and the need to test each lever.

### Challenge 3 (EC-003): Loyalty 82% lift overclaim
**ACCEPTED but DEFERRED.** The loyalty view claims 82% lift based on Kivetz et al. 2006, but that study used 10-stamp cards, not 8-visit cards. The claim needs narrowing. Implementation deferred to the next pass (requires editing loyalty-view.tsx).

## Implementation: 2 fixes applied

### Fix 1: Hormozi framework labeling
- Added a "Framework grade: suggestive, not proven" callout to the growth view's Hormozi section.
- Changed Hormozi EvidenceTag from "verified" to "partial."
- Changed section meta to "Suggestive framework · not café-specific empirical evidence."

### Fix 2: Sutherland framework labeling
- Added a "Framework grade: moderate, testable" callout to the growth view's Sutherland section.
- Added EvidenceTag "partial" to each Sutherland principle card.
- Changed section meta to "Moderate evidence · largely anecdotal case studies · test each lever."

## Artifacts created
- `research/expert-evidence.json` — 4 frameworks audited with evidence grades
- `research/expert-challenges.json` — 3 expert challenges, all accepted

## Validation
- `bun run lint`: PASS
- Growth view: framework labels confirmed present ("suggestive" and "Ehrenberg-Bass" visible)
- All 25 views: 0 console errors

## Remaining for next macrocycles
- EC-003: Narrow the loyalty view's 82% lift claim (deferred)
- Add Ehrenberg-Bass as a primary framework section in the growth view (the callout mentions it but no full section exists yet)
- Macrocycle 3: Customer, competitor, market evidence — document the review-sample method, verify competitor positions
