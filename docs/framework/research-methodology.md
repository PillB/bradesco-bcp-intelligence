# Research Methodology

## 1. Operating Loop (per phase)

Every material phase of work — repository archaeology, each research cycle, each report section, each release round — runs the same loop:

CURRENT-STATE REBASELINE → GRAPH MEMORY QUERY → PRE-ROUND RESEARCH → PREAMBLE → PLAN → RED → GREEN → REFACTOR → ADVERSARIAL VERIFICATION → RETROSPECTION → GRAPH MEMORY WRITE → EVIDENCE GATE.

For research specifically:
- **RED** = write falsifiable questions, the evidence that would answer them, explicit rejection criteria, and a coverage test (what counts as "enough").
- **GREEN** = collect evidence sufficient to answer RED's questions — not merely plausible-sounding prose.
- **REFACTOR** = improve organization, schema, or explanation without altering the evidentiary content or its status.
- **VERIFY** = actively try to disprove the interpretation just produced (negative search, alternative hypotheses, contradiction search). This step is never skipped and never satisfied by the same agent's self-assessment alone.

## 2. Round Structure (exactly three major rounds after Round Zero)

- **Round Zero — Repository Archaeology**: resolve project identity, inventory state/context files, mine commit history for PROBLEM/HYPOTHESIS/IMPLEMENTATION/FEATURE/RESULT/REMAINING_DEBT, and produce a Preservation Manifest (REUSE/ADAPT/REPLACE/ARCHIVE/NOT_APPLICABLE) before any mutation.
- **Round 1 — Repository / Framework / Evidence Truth**: confirm architecture, agent state, worklog, feature preservation, and the generalized ontology/data model/claim schema/perimeter are sound before target research begins.
- **Round 2 — Research / Analysis / Product**: execute all ten Diverge→Converge research cycles (§3) against the target company and comparators.
- **Round 3 — Adversarial Release**: hunt hallucinations, entity collisions, stale data, source duplication, circular citations, false comparisons, lifecycle misclassification, pilot/production confusion, causality errors, metric-definition drift, UX/accessibility/responsive/technical QA, and live-vs-repo parity.

No unbounded Round 4: unresolved findings after Round 3 become `PendingRecord`s, not new rounds.

Before every round: re-fetch the default branch, record the HEAD SHA, inspect the newest meaningful commits and open PRs, inspect the live deployment, reload agent state and worklog, query Graph Memory, and check whether external research sources have changed. Record a `RoundBaseline`. If HEAD changes mid-round: stop, reconcile, diff, update the baseline, then resume.

## 3. The Ten Diverge → Converge Research Cycles

Each cycle runs: REBASELINE → MEMORY → PERSPECTIVES → QUERY PLAN → DIVERGE → RETRIEVE → SOURCE CHASE → SUBSOURCE CHASE → NEGATIVE SEARCH → CONTRADICTION SEARCH → TEMPORAL CHECK → CONVERGE → VERIFIER → MEMORY → GATE.

1. **Entity & strategic history** — corporate structure, brands, subsidiaries, leadership, M&A, transformation programs, strategic eras. Outputs: `entity-map.json`, `strategic-timeline.json`, `comparison-perimeters.json`.
2. **Scale & economics** — assets, loans/deposits or sector-equivalent volume metrics, revenue, earnings, efficiency, customers, employees, market share, physical footprint. Output: `scale-scorecard.json`.
3. **Customers & channels** — segment map and channel map across all discovered customer types and access channels. Outputs: `segment-map.json`, `channel-map.json`.
4. **Product & service ecosystem** — relationships among all discovered products/services. Output: `product-ecosystem.json`.
5. **Digital platforms & journeys** — apps, wallets, assistants, APIs, onboarding/authentication/service/cross-sell journeys; verify CURRENT STATUS of any historical brand. Outputs: `platform-map.json`, `journey-map.json`.
6. **Technology / AI / data / cloud / cyber** — classify each discovered technology by maturity (RADAR/RESEARCH/EXPERIMENT/PILOT/PRODUCTION/SCALE). Outputs: `technology-capabilities.json`, `radar-history.json`.
7. **Innovation operating system** — labs, R&D, technology radar process, readiness methods, sandboxes, open innovation, startups, partnerships, training, governance; reconstruct SIGNAL→RESEARCH→EXPERIMENT→PILOT→PRODUCTION→SCALE. Output: `innovation-operating-system.json`.
8. **Historical archaeology** — multi-year search comparing ORIGINAL PROMISE vs LATER OUTCOME for products, brands, platforms, pilots. Output: `initiative-lifecycle.json`.
9. **External intelligence** — official, independent, customer, employee, partner, and unverified signals, explicitly classified. Outputs: `external-signals.json`, `customer-friction.json`, `talent-signals.json`.
10. **Comparative synthesis / red team** — only after 1–9; compare across every dimension found, controlling for country/regulatory/market-maturity/group-structure differences, and run the red-team question set (see `comparability-methodology.md`). Outputs: `comparative-strategy.json`, `contradiction-register.json`, `research-gap-register.json`.

## 4. Section-Level Research Gates

Global research does not license immediate report writing. For **each** final report section: define its research questions → query existing `ClaimRecord`s → identify gaps → run section-specific searches → chase new edges → run negative search → resolve contradictions → validate freshness/entity/perimeter → draft an outline → adversarially review the outline → draft prose → fact-check the draft → freeze the section. Only then move to the next section.

## 5. Search Engineering

Search in every language relevant to the target's jurisdiction(s) (for a Brazil/Peru pair: Portuguese, Spanish, English). For each major topic, generate queries across: canonical name, aliases, legal name, product name, old/former product name, executive names, technology, partner, startup, regulator, launch, pilot, production, migration, sunset, closed, discontinued, failure, problem, complaint, architecture, API, security, jobs, and historical year. Log every query and outcome in `search-ledger.jsonl`; every useful result creates new edges to chase — never stop at the first query.

## 6. Multi-Layer Source Chasing & Negative Search

From any primary document, follow: initiative → product → executive → technology → partner → prior filing → current status. From secondary analysis (consultancy, press), trace claims back to primary evidence. From vendor/partner case studies, verify independently. From social media, search for official product evidence. From any technology claim, search architecture docs, job listings, engineering posts, vendor documentation, production metrics, and regulatory implications.

For every strong claim, search its negation explicitly (e.g., a claim of "production" status must be checked against "pilot", "PoC", "discontinued", "security issue", "migration/replacement" for the same technology or product). For every reported improvement, ask: what baseline, what period, what population, what metric, gross or net, what causal attribution, and is there independent confirmation.

## 7. Alternative Hypotheses

Every major strategic judgment must carry at least one plausible competing explanation, and the research must actively search for evidence that discriminates between them (see `comparability-methodology.md` §4 for the standard red-team hypothesis set).
