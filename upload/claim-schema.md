# Claim Schema

## 1. Why Claims Precede Prose

No narrative section is drafted directly from raw search results. Every material fact is first captured as a discrete, machine-checkable `ClaimRecord`; report prose is then generated as an interpretation layer *on top of* the claim graph, never as a substitute for it.

## 2. ClaimRecord — Minimum Fields

`claim_id, entity, entity_perimeter, topic, claim, metric, metric_definition, value, unit, currency, period_start, period_end, event_date, publication_date, as_of_date, geography, source_ids[], independence_clusters[], evidence_excerpt, confidence, evidence_status, comparability, contradictions[], assumptions[], inference, report_sections[], last_verified_at`.

## 3. Evidence Status Enum

`VERIFIED, INDEPENDENTLY_CORROBORATED, STRONGLY_SUPPORTED, PARTIAL, INFERRED, HYPOTHESIS, CONTRADICTED, STALE, HISTORICAL_ONLY, UNRESOLVED`.

Status transitions must be explicit and logged; in particular, `INFERRED → VERIFIED` is never a silent transition — it requires new primary evidence to be added to `source_ids` and a note explaining the upgrade.

## 4. Temporal Fields Are Distinct

`event_date` (when the underlying fact happened), `period_start/period_end` (the reporting period a metric covers), `publication_date` (when the source was published), `as_of_date` (the date the claim is asserted to describe), and `last_verified_at` (when an agent last re-checked the claim) are never collapsed into one date. A press release's `publication_date` does not establish a product's `as_of_date` status years later.

## 5. Claim → Conclusion Graph

Every strategic conclusion exposes its reasoning chain explicitly: `SOURCE → CLAIM → INTERMEDIATE FINDING → COMPARISON → INTERPRETATION → STRATEGIC IMPLICATION`. Every recommendation record carries `supporting_claim_ids[], contradicting_claim_ids[], assumptions[], confidence, what_would_change_my_mind`. A recommendation with no `contradicting_claim_ids` disclosed and no `what_would_change_my_mind` is incomplete.

## 6. Contradiction Handling

A `Contradiction` record links two or more claim IDs that cannot both be true as stated, records the nature of the disagreement (definitional, temporal, factual), and is either resolved (with the resolving evidence) or left `UNRESOLVED` and surfaced in the report's open-questions module — never silently dropped.
