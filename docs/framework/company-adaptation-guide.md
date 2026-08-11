# Company Adaptation Guide

## 1. Goal

Allow another agent to stand up a full StrategicCompanyIntelligenceFramework (SCIF) dossier for an unrelated company/sector without reverse-engineering Ursa or any prior case again. Adaptation touches only Layer 0–2 (registries, ontology extension, research artifacts) and a thin skin at Layer 4; it never touches Layer 3 (claim graph engine) or the core Layer 4 view-shell components.

## 2. Step-by-Step Adaptation

1. **Instantiate `COMPANY_REGISTRY`**: primary target, operating comparator(s), group-level comparator (only if valid — see `comparability-methodology.md`).
2. **Run Entity Resolution (blocking gate)**: populate `ENTITY_REGISTRY` per `entity-resolution.md` before trusting any search result. Explicitly blacklist homonyms.
3. **Select or write a domain ontology extension**: reuse the generic core schema (`Company, Product, Initiative, Technology, ...` from `company-intelligence-blueprint.md` §4) and add only the entity types the sector actually needs (e.g., banking's `DepositProduct`, `AgenticAIUseCase`; for another sector, e.g. `Formulation`, `SKU`, `Franchise` — whatever is discovered, not assumed).
4. **Define `MODULE_REGISTRY`**: the 17-section report architecture (00 Executive Command Center … 16 Sources/Claims/Contradictions/Open Questions) is sector-agnostic; only the section subtitles and seed topics change.
5. **Define `TOOL_REGISTRY`**: select only decision-useful interactive tools from the candidate set in `interactive-tools.md`; do not build decorative tools.
6. **Run the ten research cycles** (`research-methodology.md` §3) against the new ontology, writing to `research/<company-slug>/`.
7. **Build the claim graph** (`claim-schema.md`) before writing any prose.
8. **Skin Layer 4**: create a `ThemeTokens` object (palette, type scale, motif) appropriate to the new company/sector — never reuse Ursa's palette or bear motif, and never reuse Bradesco's or any other target's palette for a subsequent target.
9. **Write the report** following `writing-protocol.md`, gated section-by-section.
10. **Run Round 3 adversarial release checks** (`testing-guide.md`) and assign one of the Final Verdicts (§AO of the originating brief) — never lower the evidence bar to force `READY_FOR_EXECUTIVE_REVIEW`.

## 3. What Is Reused Unchanged Across Companies

- View-shell primitives, routing, claim graph engine, entity-resolution gate logic, comparability gate logic, source-tier/genealogy logic, worklog format, methodology numbering convention, accessibility/testing checklists.

## 4. What Must Be Rebuilt Per Company

- Ontology extension, palette/theme, competitor taxonomy, KPI set, seed topic list, module subtitles, all research artifacts and claims, all recommendations.

## 5. Anti-Pattern: Template Content Leakage

A common failure mode is copying a prior target's *content* (terminology, recommendations, comparator framing) into a new target's dossier because it is structurally convenient. The adaptation gate for this is explicit: before merging any new module, diff its prose against the previous target's corresponding module and confirm zero shared factual content beyond genuinely reusable methodology boilerplate (e.g., "Source: ... | As-of: ... | Confidence: ...").
