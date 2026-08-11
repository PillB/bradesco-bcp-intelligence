# Source Methodology

## 1. Source Hierarchy

- **Tier A — Authoritative primary**: regulatory filings, central bank / market-regulator publications, audited annual reports, official filings (e.g., 20-F equivalents), investor relations, official product documentation, official help centers/APIs, official corporate and R&D documentation.
- **Tier B — Direct corporate evidence**: executive interviews, official conference presentations, official technology blogs, official social accounts, earnings calls, job postings, engineering posts, partner announcements. Treated as potentially promotional — never sufficient alone for a material claim.
- **Tier C — Independent professional evidence**: major financial/specialist press, academic publications, international standard-setting bodies, reputable consulting research and industry studies.
- **Tier D — Market/customer/employee signals**: app store reviews, consumer complaint platforms, forums, social comments, employee/startup testimonials. Used as *signals*, never as population estimates.
- **Tier E — AI-generated public artifacts**: shared AI chat/report pages. Used only to discover keywords, hypotheses, and new research edges — never as evidence for a material claim.

## 2. Rules of Use

- Material strategic claims require Tier A or independently corroborated Tier B/C evidence — never Tier D/E alone.
- Tier D signals must be explicitly framed as signals ("customer reviews suggest...") — never presented as measured population statistics.
- Private AI conversations (e.g., a user's private Claude/ChatGPT session) are never claimed as accessible; they are used only if explicitly supplied by the user or exposed via an authorized connector.
- If no reliable public AI artifact is found for a topic, the record states `NO_RELIABLE_PUBLIC_AI_ARTIFACT_FOUND` rather than fabricating one.

## 3. Freshness

Every source records `publication_date` and `retrieved_at`. A `Source Freshness Monitor` (see `interactive-tools.md`) flags any source underpinning a "current status" claim that is older than a sector-appropriate staleness threshold (e.g., 12–18 months for fast-moving tech claims, longer for structural/legal facts). Stale sources trigger a visible warning wherever their claim is displayed; they cannot silently support a "current" status label.

## 4. Redaction & Copyright

Sources must never expose passwords, tokens, private communications, customer/employee personal data, or proprietary material without permission. Facts, metadata, and brief permissible excerpts may be extracted from copyrighted reports; bulk reproduction is prohibited. See `redaction-protocol.md`.
