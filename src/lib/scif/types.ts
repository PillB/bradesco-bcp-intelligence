// SCIF — Strategic Company Intelligence Framework
// Typed registries (Layer 0). Company-agnostic schema.
// Bradesco/BCP/Credicorp content lives in data.ts; this file is pure system code.

export type EvidenceStatus =
  | "VERIFIED"
  | "INDEPENDENTLY_CORROBORATED"
  | "STRONGLY_SUPPORTED"
  | "PARTIAL"
  | "INFERRED"
  | "HYPOTHESIS"
  | "CONTRADICTED"
  | "STALE"
  | "HISTORICAL_ONLY"
  | "UNRESOLVED";

export type EntityMatch = "CONFIRMED" | "PROBABLE" | "AMBIGUOUS" | "WRONG_ENTITY";

export type SourceTier = "A" | "B" | "C" | "D" | "E";

export type LifecycleStatus =
  | "DISCOVERED"
  | "ANNOUNCED"
  | "RESEARCH"
  | "EXPERIMENT"
  | "POC"
  | "PILOT"
  | "BETA"
  | "PRODUCTION"
  | "PRODUCTION_SCALING"
  | "MATURE"
  | "MATURE_PRODUCTION"
  | "INTEGRATED"
  | "REPOSITIONED"
  | "PAUSED"
  | "SUNSET"
  | "SOLD"
  | "FAILED"
  | "UNKNOWN";

export type TechMaturity =
  | "RADAR"
  | "RESEARCH"
  | "EXPERIMENT"
  | "PILOT"
  | "EXPERIMENT_PILOT"
  | "PRODUCTION"
  | "PRODUCTION_SCALING"
  | "SCALING"
  | "MATURE"
  | "UNKNOWN";

export interface SourceRecord {
  source_id: string;
  publisher: string;
  original_origin: string;
  upstream_url: string;
  publication_date: string;
  retrieved_at: string;
  independence_cluster: string;
  source_tier: SourceTier;
  entity_match?: EntityMatch;
  notes?: string;
}

export interface ClaimRecord {
  claim_id: string;
  entity: string;
  entity_perimeter: string;
  topic: string;
  claim: string;
  metric?: string;
  value?: string | number;
  unit?: string;
  currency?: string | null;
  period_start?: string;
  period_end?: string;
  event_date?: string;
  publication_date: string;
  as_of_date: string;
  geography: string;
  source_ids: string[];
  independence_clusters: string[];
  evidence_excerpt?: string;
  confidence: number;
  evidence_status: EvidenceStatus;
  comparability?: string;
  contradictions?: string[];
  assumptions?: string[];
  inference?: string;
  report_sections?: string[];
  last_verified_at: string;
}

export interface EntityRecord {
  entity_id: string;
  official_legal_name: string;
  common_name: string;
  aliases: string[];
  country: string;
  domains: string[];
  parent: string | null;
  subsidiaries: string[];
  known_brands: string[];
  excluded_homonyms: string[];
  perimeter: string;
  entity_match_default: EntityMatch;
  lifecycle_status?: LifecycleStatus;
  lifecycle_note?: string;
}

export interface TimelineEvent {
  year: number;
  event: string;
  type: string;
  significance: string;
}

export interface ScaleMetric {
  metric: string;
  value: number;
  display: string;
  yoy?: string;
  target?: string;
  note?: string;
  source: string;
}

export interface ScaleEntity {
  entity_id: string;
  perimeter: string;
  geography: string;
  currency: string;
  as_of: string;
  metrics: ScaleMetric[];
}

export interface TechnologyCapability {
  tech_id: string;
  name: string;
  category: string;
  maturity: TechMaturity;
  maturity_evidence: string;
  source_ids: string[];
  confidence: number;
  evidence_status: EvidenceStatus;
  notes?: string;
}

export interface InitiativeRecord {
  initiative_id: string;
  name: string;
  category: string;
  lifecycle: LifecycleStatus;
  first_seen: string;
  last_seen: string;
  original_promise: string;
  later_outcome: string;
  interpretation: string;
  evidence_status: EvidenceStatus;
  source_ids: string[];
}

export interface RecommendationRecord {
  rec_id: string;
  title: string;
  audience: string;
  transferability: "REASONABLE_TO_TRANSFER" | "CONDITIONAL" | "NOT_EVIDENCE_BASED" | "DO_NOT_TRANSFER" | "REASONABLE_TO_LEARN_FROM";
  supporting_claim_ids: string[];
  contradicting_claim_ids: string[];
  assumptions: string[];
  confidence: number;
  what_would_change_my_mind: string;
  action: string;
}

export interface OpenQuestionRecord {
  oq_id: string;
  question: string;
  context: string;
  what_would_resolve: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export interface ContradictionRecord {
  ct_id: string;
  claim_ids: string[];
  type: string;
  description: string;
  status: "UNRESOLVED" | "PARTIALLY_RESOLVED" | "RESOLVED_BY_LABELING";
  resolution_note: string;
}

export interface ModuleDef {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
}

export interface BankSegment {
  name: string;
  bradesco: string;
  bcp: string;
  note?: string;
}

export interface ChannelMap {
  channel: string;
  bradesco: string;
  bcp: string;
}

export interface ProductEcosystemNode {
  name: string;
  category: string;
  bradesco: string;
  bcp: string;
  note?: string;
}

export interface PlatformRecord {
  name: string;
  type: string;
  owner: string;
  status: LifecycleStatus;
  cloud: string;
  note: string;
}

export interface RadarItem {
  name: string;
  maturity: TechMaturity;
  category: string;
  changed_from?: string;
  first_seen?: boolean;
  note?: string;
}

export interface RadarVersion {
  version_id: string;
  organization: string;
  publication_date: string;
  evidence_date: string;
  source: string;
  technology_items: RadarItem[];
}
