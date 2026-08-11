# Entity Resolution

## 1. Blocking Gate

Before trusting any search result for a material claim, an `EntityRegistry` entry must exist for the entity in question. This gate is blocking: no material claim may cite a source whose entity match has not been assessed.

## 2. EntityRegistry Record

Per entity: `official_legal_name, common_name, aliases[], country, domains[], parent, subsidiaries[], known_brands[], excluded_homonyms[]`.

## 3. ENTITY_MATCH Classification

Every questionable source is tagged:
- `CONFIRMED` — the source unambiguously refers to the target entity (matching domain, legal name, or explicit disambiguation in text).
- `PROBABLE` — strong contextual match, minor ambiguity remains.
- `AMBIGUOUS` — plausible but unconfirmed match; cannot support a material claim alone.
- `WRONG_ENTITY` — confirmed mismatch (a homonym or unrelated company).

`AMBIGUOUS` and `WRONG_ENTITY` sources are excluded from supporting material claims; they may still be logged for transparency in the source ledger with their classification visible.

## 4. Disambiguation Is Mandatory, Not Optional

For any target with a common brand-name collision (banking examples: a bank's abbreviation reused by unrelated firms; a group holding company vs. its listed bank subsidiary vs. its insurance arm vs. its digital-only spinoffs), the registry must explicitly enumerate every subsidiary/brand and every known unrelated homonym, and mark the homonyms `WRONG_ENTITY` by default until proven otherwise.

## 5. Perimeter Discipline

Resolving an entity also fixes its **perimeter** (see `comparability-methodology.md`): a bank vs. its holding group vs. a single product/app owned by an affiliate are different perimeters even when the natural-language name is identical or similar. Every `Claim` must record which perimeter it describes, not just which brand name appeared in the source.
