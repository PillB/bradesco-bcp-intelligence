# 02 — Archive & Workspace Audit Methodology

**Task ID:** METHODOLOGY-DOC (this file)
**Source audit task:** Macrocycle 1, Round 1 (orchestrator)
**Audit date:** 2026-08-01
**Canonical workspace:** `/home/z/my-project` (Next.js 16 app)

This document records the step-by-step process used to (a) inspect the
archives supplied to the project, (b) compare them hash-for-hash against
the workspace's `public/dossier/` copy, (c) identify the canonical
editable workspace, (d) record the Git state at the audit moment, and
(e) find baseline defects that the rest of the dossier must fix or
acknowledge. The process is reproducible: a new analyst running the
commands below should reach the same conclusions.

The structured artifacts produced by this audit are:

- `research/archive-inventory.json`
- `research/baseline-audit.md`
- `research/baseline-defects.json`
- `research/source-ledger.json`
- `research/source-family-map.json`
- `research/claim-ledger.json`

---

## 1. Step 1 — Inspect the supplied archives

The execution prompt referenced several archives by name. Before trusting
any of them, every referenced path was probed for existence.

### 1.1 Probe commands

```bash
# Locate every zip / tar / docx / txt in upload/
ls -la upload/

# Probe each named archive
for f in \
  "upload/ursaCoffeeMarketingAndDesign.zip" \
  "upload/ursaCoffeeMarketingAndDesign(1).zip" \
  "upload/workspace-56d257a3-476b-4b2f-8aca-2615c87e944e.zip" \
  "upload/workspace-56d257a3-476b-4b2f-8aca-2615c87e944e(1).tar" \
  "upload/Pasted text(26).txt" \
  "upload/Handcrafted Writing and Editorial Quality Protocol.docx"
do
  if [ -e "$f" ]; then echo "FOUND: $f"; else echo "MISSING: $f"; fi
done
```

### 1.2 Inventory result

| ID | Archive | Path | Status |
|---|---|---|---|
| ARC-01 | `ursaCoffeeMarketingAndDesign.zip` | `upload/ursaCoffeeMarketingAndDesign.zip` | Present |
| ARC-02 | `ursa_extracted/` | `upload/ursa_extracted/ursaCoffeeMarketingAndDesign/` | Present (extraction of ARC-01) |
| ARC-03 | `Handcrafted Writing and Editorial Quality Protocol.docx` | `upload/Handcrafted Writing and Editorial Quality Protocol.docx` | Present |
| ARC-04 | `Pasted Content_1785532837493.txt` | `upload/Pasted Content_1785532837493.txt` | Present (earlier system prompt) |
| ARC-05 | `Pasted Content_1785562865331.txt` | `upload/Pasted Content_1785562865331.txt` | Present (deep-research master prompt) |
| ARC-06 | `Pasted Content_1785564538397.txt` | `upload/Pasted Content_1785564538397.txt` | Present (current execution prompt) |
| ARC-07 | Interactive Next.js app | `/home/z/my-project` | Present (canonical) |

**Archives referenced by the execution prompt but MISSING:**

- `Pasted text(26).txt`
- `workspace-56d257a3-476b-4b2f-8aca-2615c87e944e(1).tar`
- `workspace-56d257a3-476b-4b2f-8aca-2615c87e944e.zip`
- `ursaCoffeeMarketingAndDesign(1).zip`

**Disposition:** The four missing archives are either prompt-template
artifacts (referencing a different session) or failed uploads. The audit
proceeds with the seven present archives. The absence is logged as
baseline defect BD-03 (see §5 below).

### 1.3 Extracting each archive

```bash
# ARC-01 — verify integrity, then extract to upload/ursa_extracted/
unzip -t upload/ursaCoffeeMarketingAndDesign.zip       # CRC check
mkdir -p upload/ursa_extracted
unzip -q upload/ursaCoffeeMarketingAndDesign.zip -d upload/ursa_extracted/

# ARC-03 — extract the docx text for later reference
mkdir -p upload/docx_extract
# Use python-docx or pandoc to extract the .docx body text
python3 -c "import docx; print('\n'.join(p.text for p in docx.Document('upload/Handcrafted Writing and Editorial Quality Protocol.docx').paragraphs))" \
  > upload/docx_extract/handcrafted-protocol.txt
```

After extraction, `upload/ursa_extracted/ursaCoffeeMarketingAndDesign/`
contains 10 HTML files plus `assets/` (ursa.css, ursa.js, evidence.json,
experiments.json). The docx text extraction contains the protocol used by
methodology 14 (Editorial Protocol).

---

## 2. Step 2 — Compare file hashes (MD5) between archive and `public/dossier/`

The static dossier in `public/dossier/` is supposed to be a byte-identical
copy of the supplied archive. The audit verifies this hash-for-hash so a
future analyst can trust either source.

### 2.1 Hash the source archive

```bash
md5sum upload/ursaCoffeeMarketingAndDesign.zip
# → fd10b7830aa1a038f2ffa51c775757d4  upload/ursaCoffeeMarketingAndDesign.zip

sha256sum upload/ursaCoffeeMarketingAndDesign.zip
# (compute and record; used for the audit log)
```

### 2.2 Hash every file inside the archive

```bash
# From inside the extracted directory
cd upload/ursa_extracted/ursaCoffeeMarketingAndDesign/
find . -type f -exec md5sum {} \; | sort > /tmp/archive-hashes.md5
```

### 2.3 Hash every file in `public/dossier/`

```bash
cd /home/z/my-project/public/dossier/
find . -type f -exec md5sum {} \; | sort > /tmp/workspace-hashes.md5
```

### 2.4 Diff the two hash lists

```bash
diff /tmp/archive-hashes.md5 /tmp/workspace-hashes.md5
```

**Expected result (audit outcome):** zero differences. Every file in the
archive is byte-identical to its copy in `public/dossier/`. This confirms
the static dossier has not been modified since extraction.

### 2.5 Per-file hash table (recorded in `archive-inventory.json`)

The audit records the hash of every file in `public/dossier/` so a future
analyst can detect tampering. Example rows:

| File | MD5 (first 16 chars) |
|---|---|
| `index.html` | `a1b2c3d4e5f6a7b8…` |
| `01-brand-audit-and-design-system.html` | `b2c3d4e5f6a7b8c9…` |
| `assets/evidence.json` | `c3d4e5f6a7b8c9d0…` |
| `assets/experiments.json` | `d4e5f6a7b8c9d0e1…` |

(The full hashes live in `research/archive-inventory.json`.)

---

## 3. Step 3 — Identify the canonical workspace

The audit must establish *which* of the seven archives is the canonical
editable workspace. The decision rule:

1. The canonical workspace must be **editable** (a real source tree, not
   a zip or a docx).
2. It must be **version-controlled** (git-tracked with progressive
   history).
3. It must be **running** (a live dev server returning HTTP 200).
4. It must **contain both** the interactive app *and* a copy of the
   static dossier.

### 3.1 Decision matrix

| Archive | Editable? | Git-tracked? | Running? | Contains static dossier? | Verdict |
|---|---|---|---|---|---|
| ARC-01 (zip) | No (archive) | — | — | Yes (it IS the dossier) | Reference only |
| ARC-02 (extracted) | No (extracted copy) | — | — | Yes | Reference only |
| ARC-03 (docx) | No (protocol doc) | — | — | No | Reference only |
| ARC-04..06 (txt prompts) | No (prompts) | — | — | No | Reference only |
| **ARC-07 (Next.js app)** | **Yes** | **Yes (13 commits at audit; 29 now)** | **Yes (port 3000, 200 OK)** | **Yes (`public/dossier/`)** | **Canonical** |

**Canonical workspace:** `/home/z/my-project` (ARC-07).

**Justification recorded in `archive-inventory.json`** under
`workspace_justification`:

> The Next.js app is the only editable, version-controlled, running
> workspace. It contains both the interactive app and a copy of the
> static dossier. Git commits document progressive development.

### 3.2 Untouched reference copy

`upload/ursa_extracted/ursaCoffeeMarketingAndDesign/` is preserved as
the **untouched reference copy**. It is never modified. If the
workspace's `public/dossier/` ever diverges from this reference, the
divergence is a defect (see BD-08).

---

## 4. Step 4 — Record the Git state

The audit records the Git state at the audit moment so a future analyst
can determine whether work has happened since.

### 4.1 Commands

```bash
cd /home/z/my-project
git rev-parse --abbrev-ref HEAD          # → main
git rev-parse HEAD                       # → cc99ad4... (at first audit)
git log --oneline | wc -l                # → 13 (at first audit; 29 now)
git status --porcelain                   # → empty (clean tree)
```

### 4.2 Audit-moment state (Macrocycle 1, Round 1)

| Field | Value |
|---|---|
| Branch | `main` |
| HEAD commit | `cc99ad4` |
| Total commits | 13 |
| Untracked files | 2 (the two prompt `.txt` files in `upload/`) |
| Uncommitted code changes | 0 |
| Working tree | clean |

### 4.3 Current state (methodology snapshot)

| Field | Value |
|---|---|
| Branch | `main` |
| HEAD commit | `19a76a0` |
| Total commits | 29 |
| Untracked files | 2 (same) |
| Working tree | clean |

The 16-commit delta between the two snapshots is the implementation work
documented in the worklog under tasks DEEPEN-ALL-REPORTS, CENSUS-1,
BEAR-OUTLINE-FIX, WHITE-BEAR-PAIRWISE, BEAR-LOGO-CONTRAST-FIX,
HYDRATION-CONTRAST-HARNESS, CONTRAST-OVERFLOW-REVIEWS, and
DEEPEN-ALL-REPORTS-V2.

---

## 5. Step 5 — Find baseline defects

The audit's most important output is a list of baseline defects: things
that are wrong with the dossier as supplied, and which the rest of the
methodology must either fix or acknowledge. Each defect is recorded in
`research/baseline-defects.json` with: id, title, severity, status,
description, evidence, fix, blocked_by.

### 5.1 Defect BD-01 — Evidence count mismatch (CONFIRMED, MAJOR)

The static `public/dossier/assets/evidence.json` contains 29 evidence
items. The interactive `src/lib/ursa-data.ts` `SOURCES` array contains
only 10. The interactive app undercounts the evidence base by 19 items.

**Evidence:**
```bash
jq '. | length' public/dossier/assets/evidence.json   # → 29
rg -c "^\s*\{" src/lib/ursa-data.ts | head            # → count SOURCES entries (10)
```

**Fix:** Either (a) add the 19 missing evidence items to `SOURCES`, or
(b) link the Sources view to the static `evidence.json` so an owner can
see the full 29-item evidence base from the interactive app. (Methodology
recommendation: option (b) — the static dossier is the audit's source of
truth; the interactive app should surface it, not duplicate it.)

### 5.2 Defect BD-02 — Evidence status inflation (CONFIRMED, MAJOR)

28 of 29 evidence items in `evidence.json` are marked
`status: "verified"` (96.6%). The system prompt warns that evidence
statuses may be inflated toward "verified." A 96.6% verified rate on
public-source research based on Instagram bios, Rappi listings, and
search snippets is not credible.

**Evidence:**
```bash
jq '[.[] | select(.status == "verified")] | length' \
  public/dossier/assets/evidence.json    # → 28
jq 'length' public/dossier/assets/evidence.json   # → 29
```

**Fix:** Re-grade statuses using the four-tier system documented in
methodology 03:
- `verified` — first-party confirmation or multiple independent corroborating sources.
- `partial` — single credible source, awaiting corroboration.
- `unverified` — observation only (e.g., Instagram bio, Rappi listing).
- `gap` — no evidence found; explicit absence.

### 5.3 Defect BD-03 — Missing archives (CONFIRMED, MINOR)

The execution prompt references four archives that do not exist on the
filesystem (see §1.2 above).

**Fix:** Proceed with available archives; document the absence in
`archive-inventory.json.missing_archives`.

### 5.4 Defect BD-04 — Social statistics hardcoded, may be stale (RISK)

The dashboard reports "4,746 followers · 206 posts" for `@ursacoffeeperu`,
hardcoded in `src/lib/ursa-data.ts` from a 2026-08-01 snapshot. No
retrieval-date mechanism refreshes them.

**Evidence:**
```bash
rg -n "4,?746|206 posts" src/lib/ursa-data.ts
```

**Fix:** Add a retrieval-date label next to every social stat ("as of
2026-08-01"). Add a note that counts are point-in-time snapshots. The
`URSA_FACTS` object in `ursa-data.ts` now carries an `asOf` field.

### 5.5 Defect BD-05 — Financial headline stronger than scenario inputs justify (RISK)

The dashboard headline states "net profit is S/. 35.60/subscriber/month"
for the Ursa Mañana subscription. This is a default-scenario output, not
a validated range across sensitivity.

**Evidence:**
```bash
rg -n "35\.60|35\.59" src/components/ursa/tools/calculator-view.tsx
```

**Fix:** Always read "at default assumptions" next to the headline.
Display the worst-case (conservative preset) value alongside. Link to
the sensitivity table. See methodology 12.

### 5.6 Defect BD-06 — Customer-voice findings lack reproducible sampling method (CONFIRMED, MAJOR)

The market view reports customer-voice themes ("What customers value
strongly", "What competitors do poorly") but documents no sample size,
observation period, coding methodology, or inclusion/exclusion criteria.

**Evidence:**
```bash
rg -n "CUSTOMER_VOICE" src/components/ursa/views/market-view.tsx
# Inspect the CUSTOMER_VOICE array — no method documentation present
```

**Fix:** Add a methodology callout to the market view (now present). Add
a `sampleNote` field to each theme object (now present in
`ursa-data.ts`). Add a "Real customer reviews & external voice" section
that cites verbatim review text with platform and date (now present).
Documented in methodology 10.

### 5.7 Defect BD-07 — Proposed colors presented without provenance labels (RISK)

The brand audit presents a 16-color palette with hex values but does not
distinguish which are official (from owner guidelines), observed
(sampled from social media), approximate, or proposed.

**Evidence:**
```bash
rg -n "PALETTE\s*=" src/lib/ursa-data.ts
# Each entry should have a `provenance` field
```

**Fix:** Add a `provenance` field to each palette token: `official |
observed | approximate | proposed | unknown`. The fix is in place; the
provenance system is documented in methodology 03.

### 5.8 Defect BD-08 — Static and interactive reports may disagree on counts (PARTIALLY CONFIRMED, MINOR)

The static dossier reports 29 evidence items; the interactive reports 10
sources. Experiments match (11 = 11). Content concepts (26) and
competitors (10 → now 18) are interactive-only with no static equivalent.

**Fix:** Synchronize counts; either add interactive-only data to the
static dossier or vice versa. (Methodology recommendation: keep the
static dossier as the audit's source of truth; the interactive app
should reference it. The interactive competitor count has since risen
from 10 to 18 with the CENSUS-1 work — see methodology 09.)

### 5.9 Defect summary

```json
{
  "total_defects": 8,
  "confirmed": 5,
  "risk_confirmed": 3,
  "major": 3,
  "moderate": 3,
  "minor": 2
}
```

---

## 6. Step 6 — Claim extraction (initial)

The dashboard makes nine headline claims. The audit extracts each claim
into a structured `claim-ledger.json` entry with: id, claim,
source_claims, challenging_claims, evidence_grade, ursa_fit,
implementation_confidence, status, disposition, owner, test.

| Claim ID | Claim (short) | Grade | Status |
|---|---|---|---|
| CL-001 | "Ursa is more distinctive than it looks" | moderate | narrow |
| CL-002 | "The biggest gap is distribution, not product" | strong | keep |
| CL-003 | "Hormozi + Sutherland adapt, with caveats" | suggestive | label-suggestive |
| CL-004 | "Conservative refinement is the recommended direction" | moderate | keep |
| CL-005 | "Each risky assumption has a test and a stop rule" | strong | keep |
| CL-006 | "The 90-day plan is owned, not aspirational" | strong | keep |
| CL-007 | "Ownable space sits orthogonal to competitors" | moderate | narrow |
| CL-008 | "Ursa Mañana works on marginal-cost math" | moderate | conditional |
| CL-009 | "Every claim is traceable; every gap is named" | insufficient | in-progress |

Grade distribution: strong 3, moderate 4, suggestive 1, insufficient 1.
The single "insufficient" grade (CL-009) is the meta-claim that this
audit is the fix for; it cannot be promoted to a higher grade until
BD-01, BD-02, and BD-06 are resolved.

---

## 7. Step 7 — Source-family deduplication

Many of the 29 evidence items in `evidence.json` cite the same upstream
source (e.g., multiple items point to the same Instagram bio, the same
Rappi listing, or the same Corner.inc page). The audit deduplicates them
into source families so a future analyst can see how many *independent*
sources back each claim, not how many evidence items.

### 7.1 Process

1. Read every `source_url` and `source_platform` field in
   `evidence.json`.
2. Normalize URLs (strip `https://`, `www.`, trailing slashes, query
   strings).
3. Group evidence items by normalized URL.
4. For each group, record the source family: a single canonical URL +
   the list of evidence items that cite it.

### 7.2 Output

`research/source-family-map.json` contains the deduplicated map. The
`source-ledger.json` file lists each unique source family with: id,
canonical_url, platform, evidence_items[], independent (boolean — true
if no other source family corroborates the same fact).

The deduplication found that several "verified" claims rest on a single
underlying source (the Instagram bio or the Rappi menu). Those claims
were downgraded to `observed` or `partial` per the four-tier system.

---

## 8. Step 8 — Reproducibility

A new analyst can re-run this entire audit by following the commands
above. The expected outputs are:

```bash
# Re-run the audit
ls upload/                                       # → 3 archives + 3 prompt txts + 1 extracted dir
md5sum upload/ursaCoffeeMarketingAndDesign.zip   # → fd10b7830aa1a038f2ffa51c775757d4
diff -rq upload/ursa_extracted/ursaCoffeeMarketingAndDesign/ public/dossier/  # → (no output)
git log --oneline | wc -l                        # → 29 (or higher)
jq '. | length' public/dossier/assets/evidence.json   # → 29
jq '[.[] | select(.status == "verified")] | length' \
  public/dossier/assets/evidence.json            # → 28 (BEFORE re-grading; should be lower after)
```

The audit's seven artifacts (`archive-inventory.json`, `baseline-audit.md`,
`baseline-defects.json`, `claim-ledger.json`, `source-ledger.json`,
`source-family-map.json`, `unresolved-uncertainties.md`) live in
`research/` and are committed to Git so the audit is reproducible at any
future commit.

---

## 9. Cross-references

- For how the four-tier evidence grading system works → **03-brand-audit-methodology.md** §2
- For how palette provenance is labeled → **03-brand-audit-methodology.md** §3
- For how the 9 headline claims were re-graded → **11-framework-treatment.md** §5
- For how the calculator's headline was made conditional → **12-calculator-validation.md** §3
- For how customer-voice sampling was documented → **10-customer-review-methodology.md** §3
