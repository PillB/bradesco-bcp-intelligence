# Source Genealogy

## 1. Purpose

Ten websites repeating one press release are **one** origin, not ten independent confirmations. Source genealogy tracking prevents mistaking syndication for corroboration.

## 2. SourceGenealogy Record

Fields: `source_id, publisher, original_origin, upstream_url, publication_date, retrieved_at, independence_cluster, source_tier`.

## 3. Detected Patterns

- `PRESS_RELEASE_SYNDICATION` — multiple outlets republishing one release with light rewriting.
- `COPY_CHAIN` — outlet B cites outlet A, which cites outlet C, without new reporting.
- `VENDOR_CASE_STUDY_DEPENDENCE` — all "independent" coverage traces to a vendor-authored case study.
- `SEARCH_SNIPPET_REPETITION` — near-identical snippets appearing across search results from a single indexed origin.
- `AI_CITATION_LOOP` — an AI-generated artifact cites another AI-generated artifact, which cites the first.
- `CIRCULAR_REFERENCE` — any cycle in the citation graph.

## 4. Independence Clustering

Every source is assigned to an `independence_cluster`. Two sources belong to the same cluster if they share an `original_origin` or are linked by any of the patterns above. A claim is `INDEPENDENTLY_CORROBORATED` only when it is supported by sources in **two or more distinct clusters**, at least one of which is Tier A or B. A claim supported by many sources in a single cluster remains `PARTIAL` or `STRONGLY_SUPPORTED` at best — never `INDEPENDENTLY_CORROBORATED`.

## 5. Rule for Strategic Claims

Strategic claims require primary evidence **plus** independent corroboration from a different cluster before they can support a recommendation with high confidence. Absent that, the claim graph must show the claim as `PARTIAL` or `HYPOTHESIS` and any recommendation built on it must disclose the limitation.
