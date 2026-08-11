# Technology Radar Versioning

## 1. No Single Timeless Radar

A technology radar is never modeled as one static list. It is modeled as a sequence of `TechnologyRadarVersion` snapshots, each tied to a specific evidence date.

## 2. TechnologyRadarVersion Record

`{ organization, publication_date, evidence_date, technology_items[], taxonomy, source }`.

## 3. Per-Technology Tracking Across Versions

For each tracked technology: `first_seen, last_seen, renamed_from, renamed_to, merged_into, removed, maturity_changed, evidence`.

## 4. Interpreting Disappearance

A technology's disappearance from a later radar version is never automatically interpreted as failure. Plausible alternative explanations that must be actively checked before any interpretation is asserted: it graduated to mainstream/production and stopped being "radar" material; it was renamed; it merged into a broader category; its maturity assessment simply changed; it was deprioritized; or the organization simply stopped publicly reporting on it. Absent evidence for one of these, the correct status is `UNKNOWN`, not `FAILED`.

## 5. Comparing Radar Versions Over Time

Radar comparisons are always version-to-version (`TechnologyRadarVersion[t]` vs `TechnologyRadarVersion[t+1]`, etc.), never a single flattened "current radar" claim spanning years of publications.
