# Testing Guide

## 1. RED Tests Before Material Implementation Changes

Minimum required behaviors, written as failing tests before implementation:

- No unintended content from a prior target's dossier leaks into the current target's report.
- Sources classified `WRONG_ENTITY` or `AMBIGUOUS` are rejected as support for material claims.
- Metrics flagged `NOT_DIRECTLY_COMPARABLE` cannot be rendered in a ranked comparison.
- Every material number displayed has a traceable `source_ids` chain back to a `ClaimRecord`.
- Sources past their freshness threshold display a visible staleness warning wherever cited.
- Sources of Tier E (AI-generated artifacts) can never cause a claim's `evidence_status` to become `VERIFIED`.
- Every initiative lifecycle status links to its supporting evidence.
- Every technology maturity level links to its supporting evidence.
- Every recommendation links to `supporting_claim_ids` and discloses `contradicting_claim_ids`.
- All routes render without error; all internal links resolve; mobile viewport does not overflow; full keyboard navigation reaches every interactive control; print stylesheet produces a complete, legible document; automated accessibility smoke tests (landmarks, contrast, focus order, alt text) pass.

## 2. GREEN → REFACTOR → ADVERSARIAL TEST

After RED tests are written and failing for the right reason, implement the minimum to pass (GREEN), refactor for clarity without changing evidentiary content, then run an adversarial pass explicitly trying to break the entity-resolution gate, the comparability gate, and the claim-status transitions.

## 3. Final Validation Checklist (before any READY verdict)

Lint, typecheck, unit/integration tests, build, route smoke tests, source-link checks, claim-source checks, entity-resolution checks, comparability tests, freshness tests, mobile QA, desktop QA, keyboard QA, accessibility audit, print check, live deployment check, and deployment-vs-repository SHA parity check. Run two independent, quiet verification passes; no new material issue may appear in either pass before issuing a `READY_FOR_EXECUTIVE_REVIEW` verdict.

## 4. Verdict Vocabulary

`READY_FOR_EXECUTIVE_REVIEW, CONDITIONALLY_READY, AUDIT_ONLY, NOT_READY, BLOCKED_BY_SOURCE_GAP, BLOCKED_BY_ENTITY_AMBIGUITY, BLOCKED_BY_COMPARABILITY, BLOCKED_BY_REPOSITORY_STATE, BLOCKED_BY_IMPLEMENTATION, BLOCKED_BY_DEPLOYMENT`. The evidence standard is never lowered to force a `READY` verdict, and no test, search, source review, commit, merge, or deployment may be reported as executed unless it was actually executed.
