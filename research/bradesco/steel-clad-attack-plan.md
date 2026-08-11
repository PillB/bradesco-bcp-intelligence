# Steel-Clad Attack Plan — Open Claims, Questions & Gates
# Plan de Ataque Reforzado — Claims, Preguntas y Gates Abiertos

**Fecha:** 2026-08-11
**Framework:** SCIF v1.0 · Solarize v2.2 · Sistema BANK-INTEL-v1.0

---

## 1. INVENTARIO DE CLAIMS POR ESTADO

### VERIFICADOS (21 claims)
C001, C002, C004, C008, C009, C013, C014, C020, C023, C024, C025, C028, C029, C031*, C034*, C035*, C036, C037, C041, C043, C044, C045, C048, C051, C053, C054, C055

### INDEPENDENTLY_CORROBORATED (28 claims)
C003, C005, C006, C007, C010, C011, C012, C015, C017, C018, C019, C021, C022, C026, C027, C030, C032, C033, C039, C040, C042, C046, C047, C049, C050, C052

### STRONGLY_SUPPORTED (26 claims)
C016, C017, C033, C046, C047, C049 + otros con vendor case studies

### PARTIAL (2 claims)
C017 (lead time metrics self-reported), Agentic AI (EXPERIMENT_PILOT mentioned but no scale)

### UNRESOLVED (2 claims)
GNN (no Bradesco-specific evidence), Synthetic data (no Bradesco-specific evidence)

---

## 2. OPEN QUESTIONS — ESTADO Y PLAN DE ATAQUE

| OQ | Pregunta | Estado | Prioridad | Plan de ataque |
|---|---|---|---|---|
| OQ01 | ¿Cuántos casos de uso IA tiene BCP vs 500 de Bradesco? | Parcialmente resuelto | MEDIUM | Buscar en Credicorp IR, LinkedIn empleos, conferencias BCP |
| OQ02 | ¿ROI agregado de Inovabra habitat? | Parcialmente resuelto | LOW | Buscar reporte impacto post-2022 Inovabra |
| OQ03 | ¿Estado real de Bridge (500 casos)? | RESUELTO | LOW | Cerrado — corroborado por 3 clusters independientes |
| OQ04 | Normalización PIB/población Brasil vs Perú | Parcialmente resuelto | MEDIUM | Market share encontrado: Bradesco 16.6%, BCP 33.43% |
| OQ05 | ¿Existe BTRL/TRL formal en Bradesco? | Abierto | MEDIUM | Buscar en documentación oficial, Inovabra, metodologías |
| OQ06 | ¿Estado actual de CIX-BCP? | RESUELTO | LOW | Cerrado — CIX activo, +1 década |
| OQ07 | Deep-dive GNN, synthetic data, biometría, quantum, DLT | Parcialmente resuelto | LOW | Quantum=EXPERIMENT, DLT=PILOT, biometría=VERIFIED. GNN/synthetic=UNKNOWN |
| OQ08 | ¿Diferencia IA = madurez real o comunicación? | Parcialmente resuelto | MEDIUM | Outcomes documentados para ambos. H1 y H2 ambos parcialmente confirmados |

---

## 3. GATES CONDICIONALES — ESTADO

| Gate | Estado | Evidencia | Acción |
|---|---|---|---|
| GNN | UNKNOWN | 8+ búsquedas en PT/ES/EN, sin evidencia Bradesco-específica | PendingRecord — no inferir ausencia |
| Synthetic data | UNKNOWN | 4+ búsquedas, sin evidencia Bradesco-específica | PendingRecord |
| Adversarial ML | UNKNOWN | NIST guía 2025; Bradesco 7 Guardrails podrían incluir | PendingRecord |
| SLM | UNKNOWN | Sin evidencia para ningún banco | PendingRecord |
| BTRL/TRL formal | OQ05 MEDIUM | No es término Bradesco — general TRL concept | Buscar doc oficial |
| Entity resolution | PASSED | EntityRegistry con 16 entidades, homónimos excluidos | Cerrado |
| Comparability gate | PASSED | Comparison A/B separadas, NOT_DIRECTLY_COMPARABLE etiquetado | Cerrado |
| Source genealogy | PASSED | 85 fuentes en 30+ clusters, patrones detectados | Cerrado |

---

## 4. PLAN DE VALIDACIÓN DE TOOLTIPS

### Elementos a validar via agent-browser:
1. Hover sobre cada término con ContextTooltip en módulo 00 (exec)
2. Hover sobre cada término en módulo 07 (AI)
3. Hover sobre cada término en módulo 13 (compare)
4. Click (mobile) sobre términos en módulo 05 (platforms)
5. Verificar que el panel de contexto aparece con: etiqueta entidad, definición, comparación, estado, valor, fuentes, confianza
6. Verificar que términos sin entrada de contexto no rompen

### Criterios de aceptación:
- Todo término mencionado que tenga entrada en CONTEXT_REGISTRY muestra tooltip al hover/click
- El tooltip incluye etiqueta de entidad con color correcto
- El tooltip incluye frase de comparación con el otro banco
- El tooltip no se corta en mobile (375px)
- El tooltip es keyboard-accessible (Tab + Enter)

---

## 5. PLAN DE DEPLOYMENT

1. Verificar gh auth status
2. Si auth completado: git add + commit + push
3. Si auth no completado: mantener proceso vivo, recordar código
4. Validar paridad local vs repo

---

## Seguimiento ES / PT-BR

**ES** — Validar tooltips en todos los módulos via agent-browser
**PT-BR** — Validar tooltips em todos os módulos via agent-browser
- Prioridad: ALTA
- Estado: EN PROGRESO

**ES** — Completar GitHub auth (código 08BE-BC13) y hacer commit+push
**PT-BR** — Completar GitHub auth (código 08BE-BC13) e fazer commit+push
- Prioridad: ALTA
- Estado: ESPERANDO USUARIO

**ES** — GNN/synthetic data/adversarial ML permanecen como PendingRecords
**PT-BR** — GNN/synthetic data/adversarial ML permanecem como PendingRecords
- Prioridad: BAJA (no hay evidencia pública disponible)
- Estado: CERRADO HASTA NUEVA EVIDENCIA
