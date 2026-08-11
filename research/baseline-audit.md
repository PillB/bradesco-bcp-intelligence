# Baseline Audit — Ursa Coffee Strategic Command Center

**Compiled:** 2026-08-01 (execution-time)
**Auditor:** Orchestrator (Macrocycle 1, Round 1)
**Canonical workspace:** `/home/z/my-project` (Next.js 16 app at `/`)

## 1. Archive inventory

| Archive | Location | MD5 | Status |
|---|---|---|---|
| `ursaCoffeeMarketingAndDesign.zip` | `upload/` | `fd10b7830aa1a038f2ffa51c775757d4` | Original static dossier (8 HTML + CSS/JS + 2 JSON) |
| `ursa_extracted/` | `upload/` | — | Extraction of the above; identical content |
| `Handcrafted Writing and Editorial Quality Protocol.docx` | `upload/` | — | Editorial protocol (extracted to `upload/docx_extract/`) |

**Archives mentioned in the execution prompt but NOT present on the filesystem:**
- `Pasted text(26).txt` — not found
- `workspace-56d257a3-476b-4b2f-8aca-2615c87e944e(1).tar` — not found
- `workspace-56d257a3-476b-4b2f-8aca-2615c87e944e.zip` — not found
- `ursaCoffeeMarketingAndDesign(1).zip` — not found

**Disposition:** The execution prompt references archives that do not exist in the environment. The only supplied archives are the original static dossier zip and the writing protocol. The interactive Next.js app in `/home/z/my-project/src` is the canonical workspace, built across prior execution rounds and tracked in Git (13 commits).

## 2. Workspace selection

**Canonical editable workspace:** `/home/z/my-project` (the Next.js 16 app)

**Justification:**
- 13 Git commits with progressive feature history
- 95 TypeScript/TSX source files
- 25 view components (1 dashboard + 8 dossier + 15 tools + 1 landing)
- 10 static HTML dossier files in `public/dossier/` (identical to archive — no divergence)
- Dev server running on port 3000, returning HTTP 200
- `bun run lint` passes with zero errors

**Untouched reference copy:** `upload/ursa_extracted/ursaCoffeeMarketingAndDesign/` preserved as the original static dossier reference. Not modified.

## 3. Git state

**Branch:** `main`
**Starting commit:** `cc99ad4` (most recent)
**Total commits:** 13
**Untracked files:** 2 (the two prompt `.txt` files in `upload/`)
**Uncommitted code changes:** 0

The repository is clean. All code work from prior rounds is committed.

## 4. Static vs interactive divergence

**Static dossier** (`public/dossier/`): 10 HTML files + `assets/` (evidence.json, experiments.json, ursa.css, ursa.js) — all byte-identical to the original archive.

**Interactive app** (`src/`): 25 React views with their own data in `src/lib/ursa-data.ts`.

**Divergence findings:**

| Data point | Static dossier | Interactive app | Divergence |
|---|---|---|---|
| Evidence items | 29 (in evidence.json) | 10 (SOURCES in ursa-data.ts) | **MAJOR: interactive undercounts by 19** |
| Experiments | 11 (in experiments.json) | 11 (EXPERIMENTS in ursa-data.ts) | Match |
| Evidence status "verified" | 28/29 (96.6%) | — | **INFLATED: nearly all marked verified** |
| Content concepts | — | 26 | Interactive-only |
| Competitors | — | 10 | Interactive-only |

## 5. Baseline defects detected

### Defect 1: Evidence count mismatch (CONFIRMED)
The static `evidence.json` contains 29 evidence items; the interactive `ursa-data.ts` SOURCES array contains only 10. The interactive app undercounts the evidence base by 19 items. Owners viewing the interactive Sources view see less evidence than the static dossier provides.

### Defect 2: Evidence status inflation (CONFIRMED)
28 of 29 evidence items (96.6%) in `evidence.json` are marked `status: "verified"`. The system prompt explicitly warns: "Evidence statuses may be inflated toward 'verified'." A 96.6% verified rate on public-source research is not credible — many items are based on Instagram bios, Rappi listings, and search snippets, which are observations, not verifications. The bar for "verified" should require first-party confirmation or multiple independent corroborating sources.

### Defect 3: Missing archives (CONFIRMED)
The execution prompt references `workspace-*.tar`, `workspace-*.zip`, `ursaCoffeeMarketingAndDesign(1).zip`, and `Pasted text(26).txt`. None exist on the filesystem. This is either a prompt-template artifact (referencing archives from a different session) or the archives failed to upload. Work proceeds with the available files.

### Defect 4: Social statistics may be stale (RISK — not yet confirmed)
The dashboard reports "4,746 followers · 206 posts" for @ursacoffeeperu. These are hardcoded in `ursa-data.ts` from a 2026-08-01 snapshot and will become stale. No retrieval-date mechanism refreshes them.

### Defect 5: Financial headline strength (RISK — requires calculator audit)
The dashboard headline states "net profit is S/. 35.60/subscriber/month" for the Ursa Mañana subscription. This is a default-scenario output, not a validated range. The system prompt requires: "A phrase such as 'the math says yes' is not allowed unless actual validated Ursa data supports it across reasonable sensitivity ranges." The headline needs a conditional qualifier ("at default assumptions") which was added in a prior round but may still be too prominent.

### Defect 6: Review-sample method absent (CONFIRMED)
The market view reports customer-voice themes ("What customers value strongly", "What competitors do poorly") but documents no reproducible sampling method — no sample size, no observation period, no coding methodology, no inclusion/exclusion criteria. The system prompt requires a documented method before reporting customer conclusions.

### Defect 7: Proposed colors presented as verified (RISK)
The brand audit presents a 16-color palette with hex values. Some are sampled from social media observations, not official brand guidelines. The system prompt requires labeling these "approximate" or "observed", not presenting them as canonical. The palette page does not distinguish official vs observed vs proposed tokens.

## 6. Claim extraction (initial)

The dashboard makes 9 headline claims. Initial claim ledger extraction:

| Claim ID | Claim | Evidence status | Action |
|---|---|---|---|
| CL-001 | "Ursa is more distinctive than it looks" | Partially supported (bear/gram/green are observed) | Narrow: "more distinctive than its distribution suggests" |
| CL-002 | "The biggest gap is distribution, not product" | Supported (no website, unclaimed GBP) | Keep |
| CL-003 | "Hormozi + Sutherland adapt, with caveats" | Framework-level, not empirically tested | Label as suggestive, not proven |
| CL-004 | "Conservative refinement is the recommended direction" | Strategic recommendation, not empirical | Keep as recommendation |
| CL-005 | "Each risky assumption has a test and a stop rule" | Verifiable (11 experiments documented) | Keep |
| CL-006 | "The 90-day plan is owned, not aspirational" | Verifiable (owners/metrics/stop-rules in roadmap) | Keep |
| CL-007 | "Ownable space sits orthogonal to competitors" | Partially supported (competitor analysis is observational) | Narrow |
| CL-008 | "Ursa Mañana works on marginal-cost math" | Default-scenario output, not validated range | Add conditional + sensitivity link |
| CL-009 | "Every claim is traceable; every gap is named" | Methodological claim | Audit in progress |

## 7. Canonical workspace state

- **Dev server:** Running on port 3000, HTTP 200
- **Lint:** `bun run lint` passes, zero errors
- **Views:** 25 (1 dashboard + 8 dossier + 15 tools + 1 landing)
- **Static dossier:** 10 HTML files in `public/dossier/`, identical to archive
- **Research directory:** `research/` created this round; empty except for this file
- **Worklog:** 1036 lines, documenting 10 prior cron rounds

## 8. Next steps (Macrocycle 1 remaining rounds)

1. Create `archive-inventory.json` and `baseline-defects.json` (structured)
2. Create `claim-ledger.json` with all 9 headline claims
3. Create `source-ledger.json` and `source-family-map.json`
4. Audit the 29 evidence.json items for source-family deduplication
5. Expert-challenge round 1: challenge the "verified" status inflation
6. Implementation: fix the evidence count mismatch (add missing 19 items to interactive SOURCES or link to static evidence.json)
7. Validation: confirm interactive and static counts agree
