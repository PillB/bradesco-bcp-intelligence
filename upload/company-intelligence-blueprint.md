# Company Intelligence Blueprint

## 1. Purpose

This document generalizes the architecture observed in the reference implementation — the Ursa Coffee Strategic Command Center, built on the `PillB/AIMarket-Design-Consulting-Reports` codebase — into a reusable **StrategicCompanyIntelligenceFramework** (SCIF) that can produce an auditable strategic intelligence dossier for *any* company in *any* sector, without re-deriving the pattern from scratch each time.

The blueprint separates **system** (routing, components, data contracts, evidence machinery) from **content** (a specific company's facts, sector vocabulary, competitors). Ursa is treated strictly as a system-pattern donor. Its coffee-specific vocabulary, palette, bear mark, and menu-KPI logic are explicitly out of scope for reuse (see §5).

## 2. What Was Recovered From Ursa (Reusable System Patterns)

Inspection of the reference repository shows a Next.js (App Router, client-hash-routed single page) command center with these system-level patterns, confirmed directly from `BUILD_SPEC.md` and the `src/`, `methodology/`, `research/` directory structure:

| Pattern | Where observed | Generalization |
|---|---|---|
| Hash-based single-page router with per-module client views | `src/app`, `useNavigate()` from `@/lib/ursa-nav` | `useNavigate()` + `MODULE_REGISTRY` keyed router, company-agnostic |
| Shared "view-shell" primitives (`ViewHero`, `ViewSection`, `Card`, `Grid`, `DossierLinkBanner`) | `@/components/ursa/view-shell` | `ViewHero/ViewSection/Card/Grid/DossierLinkBanner` promoted to a generic `@/components/scif/view-shell`, no brand coupling |
| Brand-specific UI atoms (badges, evidence tags, pills, callouts, stat blocks, progress bars) | `@/components/ursa/ursa-brand` | Same atoms, re-skinned per company via a `ThemeTokens` object instead of hardcoded Tailwind classes |
| Central typed data module per project | `@/lib/ursa-data` (`URSA_FACTS`, `COMPETITORS`, `SOURCES`, `OPEN_QUESTIONS`, `ROADMAP`, ...) | `@/lib/company-data` populated from `COMPANY_REGISTRY`, `SOURCE_REGISTRY`, `CLAIM_REGISTRY`, etc. (see `claim-schema.md`) |
| Numbered methodology library | `methodology/01-project-overview.md` … `methodology/15-deployment-github.md` | Same numbering convention, contents genericized (this document set) |
| Append-only worklog with structured entries | `worklog.md` (Task ID, Agent, Task, Work Log, Stage Summary) | Preserved verbatim as the Graph Memory / worklog discipline (§6) |
| Research artifact directory per investigation | `research/` | `research/<company-slug>/` populated per `AK` artifact list |
| Subagent build contract (`BUILD_SPEC.md`) describing exact exports, shared components, and a "Handcrafted Writing Protocol" | `BUILD_SPEC.md` | Reused near-verbatim; palette/company facts swapped |
| Evidence/status vocabulary in UI (`EvidenceTag`: verified/partial/unverified/gap) | `ursa-brand.tsx` | Expanded into the full claim-status enum in `claim-schema.md`, still rendered through an `EvidenceTag` component |
| Static "dossier" pages linked from interactive views | `DossierLinkBanner({ moduleId })` | Preserved; `moduleId` maps to `MODULE_REGISTRY` entries |
| Quality bar: 4–8 real sections per view, no placeholder text, responsive/mobile-checked | `BUILD_SPEC.md` "Quality Bar" | Preserved as a non-negotiable acceptance gate for every module |

These are the elements the SCIF **must preserve**: command-center architecture, modular dossiers, executive summaries, evidence status, source traceability, interactive tools, experimentation registries, stop rules, roadmaps, metrics/dashboards, responsive design, keyboard accessibility, print/export, bilingual/multilingual architecture, shared UI components, handcrafted writing discipline, and worklog/memory discipline.

## 3. Layered Architecture

```
Layer 0 — Registries (data, company-agnostic schema)
  COMPANY_REGISTRY, ENTITY_REGISTRY, SOURCE_REGISTRY, CLAIM_REGISTRY,
  METRIC_DICTIONARY, TECHNOLOGY_REGISTRY, INITIATIVE_REGISTRY,
  COMPARATOR_REGISTRY, MODULE_REGISTRY, TOOL_REGISTRY

Layer 1 — Domain ontology extension (sector-specific entities)
  e.g. Banking Domain Ontology (BankingSegment, DepositProduct, ...)
  Loaded as a plugin on top of the generic Company/Product/Initiative core.

Layer 2 — Research artifacts (JSON/JSONL, produced by the 10 research cycles)
  research/<company-slug>/*.json, *.jsonl

Layer 3 — Claim graph & conclusion graph
  claim-ledger.jsonl -> claim-graph.json -> recommendations.json

Layer 4 — Presentation (Next.js command center)
  src/app (routes) -> src/components/scif/view-shell (generic) ->
  src/components/scif/<company>-theme (skin) -> src/lib/company-data (typed access)

Layer 5 — Static dossiers & exports
  Print/export-ready long-form pages mirrored 1:1 to each interactive module.
```

Each layer only depends on the layer below it. Content (a specific company) only ever populates Layer 0–2; Layers 3–5 are pure system code that must run unchanged for Ursa, Bradesco, or any future target.

## 4. Minimum Conceptual Schema (Company-Agnostic Core)

`Company, CompanyAlias, CompanyPerimeter, LegalEntity, ParentGroup, Subsidiary, Brand, BusinessUnit, Geography, CustomerSegment, Channel, Product, Service, Platform, Capability, Technology, Initiative, Experiment, StrategicPriority, Acquisition, Divestiture, Partnership, Competitor, FinancialMetric, KPI, Risk, Regulation, Source, Claim, Contradiction, OpenQuestion, Recommendation, Scenario, RoadmapItem.`

Field-level definitions for `Source` and `Claim` are specified in `claim-schema.md`; entity fields are specified in `entity-resolution.md`. Sector ontologies (e.g., banking) extend this core additively — see `company-adaptation-guide.md` for the extension mechanism.

## 5. What Must Never Transfer From Ursa

Coffee terminology, bear imagery, café-menu KPIs, the Ursa color palette, Ursa's specific competitor taxonomy, Ursa's marketing frameworks (Hormozi/Sutherland content angles), and Ursa's specific recommendations are **content**, not system. A new target company must generate its own ontology, palette, KPI set, competitor taxonomy and recommendations from its own evidence — never inherited from Ursa.

## 6. Relationship to Solarize / Graph Memory

The blueprint assumes the Solarize operating loop (Rebaseline → Graph Memory Query → Pre-Round Research → Preamble → Plan → Red → Green → Refactor → Adversarial Verification → Retrospection → Graph Memory Write → Evidence Gate) governs every phase of work on top of this architecture. The worklog and Graph Memory are the durable record; this blueprint and its sibling documents are the durable *method*. See `research-methodology.md` for how the ten research cycles populate the registries defined here.
