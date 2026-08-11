// Bradesco × BCP Command Center — Theme Tokens
// Banking intelligence palette. NOT Ursa (no bear/coffee).
// Primary: deep crimson (Bradesco-adjacent but neutral). Evidence-status color system.

export const theme = {
  primary: {
    DEFAULT: "#B91C3C", // deep crimson — banking, not Ursa
    foreground: "#FFFFFF",
  },
  accent: {
    gold: "#B08D57", // executive accent
    teal: "#0F766E", // comparator accent (BCP-side)
  },
  evidence: {
    VERIFIED: { bg: "#DCFCE7", fg: "#166534", border: "#86EFAC", label: "Verificado", dot: "#16A34A" },
    INDEPENDENTLY_CORROBORATED: { bg: "#BBF7D0", fg: "#14532D", border: "#4ADE80", label: "Corroborado independiente", dot: "#22C55E" },
    STRONGLY_SUPPORTED: { bg: "#FEF3C7", fg: "#92400E", border: "#FCD34D", label: "Fuertemente respaldado", dot: "#F59E0B" },
    PARTIAL: { bg: "#FED7AA", fg: "#9A3412", border: "#FDBA74", label: "Parcial", dot: "#FB923C" },
    INFERRED: { bg: "#E0E7FF", fg: "#3730A3", border: "#A5B4FC", label: "Inferido", dot: "#6366F1" },
    HYPOTHESIS: { bg: "#F3E8FF", fg: "#6B21A8", border: "#D8B4FE", label: "Hipótesis", dot: "#A855F7" },
    CONTRADICTED: { bg: "#FEE2E2", fg: "#991B1B", border: "#FCA5A5", label: "Contradicho", dot: "#DC2626" },
    STALE: { bg: "#E5E7EB", fg: "#374151", border: "#9CA3AF", label: "Desactualizado", dot: "#6B7280" },
    HISTORICAL_ONLY: { bg: "#E5E7EB", fg: "#1F2937", border: "#9CA3AF", label: "Solo histórico", dot: "#6B7280" },
    UNRESOLVED: { bg: "#F1F5F9", fg: "#475569", border: "#CBD5E1", label: "No resuelto", dot: "#94A3B8" },
  },
  tier: {
    A: { label: "Tier A", desc: "Primaria autoritativa", color: "#166534" },
    B: { label: "Tier B", desc: "Evidencia corporativa", color: "#1D4ED8" },
    C: { label: "Tier C", desc: "Profesional independiente", color: "#6D28D9" },
    D: { label: "Tier D", desc: "Señal de mercado", color: "#B45309" },
    E: { label: "Tier E", desc: "Artefacto IA (solo descubrimiento)", color: "#9CA3AF" },
  },
  lifecycle: {
    PRODUCTION: { color: "#16A34A", label: "Producción" },
    PRODUCTION_SCALING: { color: "#22C55E", label: "Producción · Escalando" },
    MATURE: { color: "#15803D", label: "Maduro" },
    MATURE_PRODUCTION: { color: "#166534", label: "Maduro · Producción" },
    INTEGRATED: { color: "#0891B2", label: "Integrado" },
    PILOT: { color: "#F59E0B", label: "Piloto" },
    EXPERIMENT: { color: "#FB923C", label: "Experimento" },
    EXPERIMENT_PILOT: { color: "#F59E0B", label: "Experimento/Piloto" },
    RESEARCH: { color: "#A855F7", label: "Investigación" },
    RADAR: { color: "#C084FC", label: "Radar" },
    BETA: { color: "#8B5CF6", label: "Beta" },
    DISCOVERED: { color: "#94A3B8", label: "Descubierto" },
    ANNOUNCED: { color: "#7DD3FC", label: "Anunciado" },
    POC: { color: "#FBBF24", label: "PoC" },
    SCALING: { color: "#84CC16", label: "Escalando" },
    REPOSITIONED: { color: "#06B6D4", label: "Reposicionado" },
    PAUSED: { color: "#A1A1AA", label: "Pausado" },
    SUNSET: { color: "#EF4444", label: "Sunset" },
    SOLD: { color: "#F97316", label: "Vendido" },
    FAILED: { color: "#DC2626", label: "Fallido" },
    UNKNOWN: { color: "#6B7280", label: "Desconocido" },
  },
  entity: {
    BRADESCO: "#B91C3C",
    BCP: "#0F766E",
    CREDICORP: "#7C3AED",
    INOVABRA: "#B08D57",
  },
} as const;
