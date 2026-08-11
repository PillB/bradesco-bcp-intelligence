# Comparability Methodology

## 1. Comparability Gate (Blocking)

No comparative number may be presented until the following are all recorded and reconciled: `ENTITY, PERIMETER, GEOGRAPHY, PERIOD, CURRENCY, METRIC DEFINITION, ACCOUNTING BASIS`. If any of these cannot be reconciled between the entities being compared, the pair is labeled `NOT_DIRECTLY_COMPARABLE` and is not ranked.

## 2. Perimeter Discipline

Comparisons must specify which legal/organizational perimeter is being compared, and must not silently mix perimeters (e.g., comparing a single operating bank against an entire multi-business group, or comparing a bank against one specific product/subsidiary of a different group without disclosure).

Two canonical comparison types illustrate the pattern for any two-market case:
- **Comparison A**: the primary target's core operating entity vs. the comparator's stand-alone core operating entity (same perimeter level).
- **Comparison B**: the primary target's consolidated parent organization vs. the comparator's consolidated parent group — only when analytically justified, and clearly labeled as a different (group-level) comparison from Comparison A.

## 3. Metric Dictionary Discipline

Every metric used in a comparison must resolve to a single entry in `metric-dictionary.json` with an explicit definition, unit, and accounting basis. Two entities reporting a similarly named metric (e.g., "active users," "efficiency ratio") under different definitions are not comparable until normalized or explicitly flagged as non-comparable.

## 4. Red-Team Question Set (run in Cycle 10 and again in Round 3)

- Are we mistaking size for capability?
- Are we mistaking publicity for production?
- Are we mistaking pilot count for value?
- Are we comparing a group against a single operating entity?
- Are the reporting periods aligned?
- Are the metrics semantically identical, not just similarly named?
- Does a difference in country infrastructure or regulation explain the observed gap better than a difference in company capability?
- Could the opposite conclusion plausibly fit the same evidence?

## 5. Output Discipline

Any dashboard, table, or chart comparing entities must expose entity, perimeter, metric definition, unit, period, source, and confidence alongside the number. Visualizations must never place semantically different metrics on the same comparable axis without a explicit "not directly comparable" annotation.
