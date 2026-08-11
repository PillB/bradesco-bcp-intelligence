---
Task ID: 2-A
Agent: Brand Audit + Style Guide view builder (subagent)

Task:
Build TWO React view files for the Ursa Coffee Strategic Command Center:
1. `/src/components/ursa/views/brand-audit-view.tsx` — `BrandAuditView` (Module 01 · Brand Audit & Design System)
2. `/src/components/ursa/tools/style-guide-view.tsx` — `StyleGuideView` (Extra Tool T5 · Interactive Brand Style Guide Explorer)

Work Log:
- Read `/home/z/my-project/worklog.md` and `/home/z/my-project/BUILD_SPEC.md` for project context, shared component API, palette, typography, and quality bar.
- Inspected shared components in `src/components/ursa/view-shell.tsx` and `src/components/ursa/ursa-brand.tsx` (ViewHero, ViewSection, Card, Grid, DossierLinkBanner, BearMark, ArtNouveauDivider, CupGlyph, SectionBadge, EvidenceTag, Pill, Callout, StatBlock, ProgressBar).
- Inspected data exports in `src/lib/ursa-data.ts` (PALETTE 16 tokens, TYPOGRAPHY 3 voices, URSA_FACTS) and the `useNavigate` hook in `src/lib/ursa-nav.ts`.
- Inspected `dashboard-view.tsx` as a reference for the established visual pattern (Pill/EvidenceTag usage, Card grids, Callouts, StatBlock rows, ArtNouveauDivider, DossierLinkBanner).
- Wrote `brand-audit-view.tsx` with all 10 required sections:
  1. Hero (eyebrow, title "Preserve the bear, the gram, and the green", snapshot/address/direction meta).
  2. Verified elements — 4-col grid of 8 cards each with BearMark + EvidenceTag (Art Nouveau lean, palette, bear motif, in-house roastery, tagline, two-bar layout, named drinks, cross-surface application = partial).
  3. Color palette — full 16-token PALETTE as swatch cards (colored top portion + name/hex/role metadata).
  4. Typography — 3-col grid of TYPOGRAPHY with sample rendered in each font's className, plus a type-scale demonstration block.
  5. Bear motif analysis — 4-col grid (consistent / inconsistent / distinctive / missing) with Pill tones, plus a 4-tint bear row.
  6. Art Nouveau components — 4-col grid of ornamental borders / serif display / gold accents / botanical-wavy motifs, plus a live ArtNouveauDivider demonstration block.
  7. Three brand-evolution levels — 3-col cards with Level 1 highlighted/recommended, Level 2 (6-month skin), Level 3 (seasonal), plus a gold Callout explaining the recommendation.
  8. Consistent / Inconsistent / Distinctive / Missing — 2×2 summary grid with Pill tones and diamond bullets.
  9. Spirit-preservation callout — forest-toned full-bleed block on a forest-deep→espresso gradient with Art Nouveau texture overlay, gold bear, headline "Never choose a generic growth tactic over the bear", guardrail pills.
  10. DossierLinkBanner for `01-brand-audit-and-design-system` + onward nav button to style-guide + StatBlock row.
- Wrote `style-guide-view.tsx` (client component, useState for copy feedback) with all 7 required sections:
  1. Hero (eyebrow "Extra Tool T5 · Interactive", title, palette/type/mode meta).
  2. Color tokens — 16 interactive swatches with a `CopyButton` component using `navigator.clipboard.writeText` and a 1.5s "Copied!" confirmation toggle. Failure path is silent (insecure context fallback).
  3. Typography specimens — 3-col grid with each font at Display/Body/Label sizes, plus an applied type-scale demonstration block (3.2rem → 0.72rem) with width-aligned labels.
  4. Component library preview — Pills (all 6 tones), EvidenceTags (all 4 statuses), Callouts (all 5 tones), Card default + Card highlight, ProgressBar (3 tones), StatBlock (3 tones), BearMark at 24/32/48/64, ArtNouveauDivider, CupGlyph (3 tints).
  5. Spacing & radius — 2-col grid visualising 5 radius tokens (with sample rounded boxes) and 6 spacing tokens (with proportional gold bars).
  6. Bear mark variants — 2-col grid: on cream (dark-roast small + forest-deep large) and on espresso (gold small + cream large) at 24/32/48/64, plus a forest Callout with the tint rules.
  7. Usage do's and don'ts — 2-col list (6 DOs with CheckCircle2, 6 DON'Ts with XCircle) covering bear surface, type roles, gold usage, tint palette, divider placement, label tracking.
  Plus footer with DossierLinkBanner + onward nav button to Module 01 + StatBlock row + verified-snapshot footer line.
- Ran `bun run lint` on the two files: clean (zero errors). The only project-wide lint error is in an unrelated pre-existing zip-extraction artifact at `upload/ursa_extracted/__MACOSX/._ursa.js` — not in my code.
- Verified the dev server compiles successfully (`✓ Compiled in ...` in dev.log, GET / 200 responses).

Stage Summary:
- `BrandAuditView` and `StyleGuideView` are both implemented, fully responsive, use only the verified Ursa palette (browns, greens, cream, gold, terracotta — no blue/indigo), and integrate the shared BearMark / ArtNouveauDivider / CupGlyph / Pill / EvidenceTag / Callout / StatBlock / ProgressBar / Card / Grid components.
- `BrandAuditView` delivers the full Module 01 audit (verified elements, palette, typography, bear-motif analysis, Art Nouveau components, three evolution levels with recommendation, 2×2 summary, spirit-preservation callout, dossier link).
- `StyleGuideView` is a genuinely useful interactive reference: copy-to-clipboard tokens, type specimens at scale, every shared component in every tone, visualised spacing/radius tokens, the bear mark across all approved sizes and surfaces, and a do/don't guardrail list.
- No other files modified. No test files created.
- Next agent: can view this work record in `/agent-ctx/2-A-brand-audit-style-guide.md`.
