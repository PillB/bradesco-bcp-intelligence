# Catálogo Maestro de Iniciativas — Bradesco × BCP
# One-Stop Shop Estratégico Comparativo

**Fecha de corte:** 2026-08-11
**Framework:** SCIF v1.0 · Solarize v2.2
**Idioma:** Español (contenido sustantivo) · PT-BR (seguimiento bilingüe)

---

## [BRADESCO:BIA] — Bradesco Inteligência Artificial

**Entidad responsable:** Banco Bradesco S.A.
**Relación corporativa:** Subsidiaria directa — asistente virtual del banco matriz
**Categoría:** IA conversacional / Asistente virtual

**Qué es:**
BIA es el asistente virtual de Bradesco, lanzado en 2016 sobre el motor IBM Watson. Es el primer asistente virtual bancario de Brasil a escala. Hoy está 100% integrada con IA generativa.

**Problema que busca resolver / por qué se creó:**
Reducir la carga de atención al cliente en canales digitales, automatizar respuestas frecuentes, y proporcionar asistencia 24/7 sin intervención humana para la mayoría de consultas.

**Cómo funciona:**
BIA utiliza procesamiento de lenguaje natural (PLN) para interpretar consultas de clientes en lenguaje natural. Originalmente entrenada sobre IBM Watson (2016), evolucionó a una arquitectura de IA generativa (100% GenAI desde 2025). Procesa voz y texto, y está disponible en la app del banco, WhatsApp y portales web.

**Usuarios o áreas objetivo:**
Clientes minoristas (retail) de Bradesco. 24M+ usuarios activos en la app. También sirve a áreas internas de operaciones.

**Tecnologías identificadas:**
- IBM Watson (2016-2024, motor original)
- IA generativa / LLM (2025-presente, evolución)
- Procesamiento de voz y texto
- Integración con Azure AI Services (Microsoft)
- RAG (Retrieval-Augmented Generation) para base de conocimiento

**Cronología:**
- 2016: Lanzamiento sobre IBM Watson. Bradesco fue la primera empresa en Brasil en entrenar Watson.
- 2018: 78K nuevas cuentas abiertas vía app, 9M clientes usaron BIA
- Feb/2019: 87M interacciones acumuladas (IBM Newsroom)
- Jun/2025: 100% integrada con IA generativa, 85-90% retención
- Oct/2024: +80% resolución integrando Azure AI (Microsoft case study)
- 4T25: 90% de retención en chat digital, ~40× reducción en costo directo de atención

**Estado actual:** PRODUCTION_SCALING
**Escala:** 24M+ usuarios activos · 90% retención de demandas digitales · ~40× reducción de costo de atención

**Valor para cliente:**
Atención instantánea 24/7, resolución sin espera humana para el 90% de consultas, disponible en múltiples canales (app, WhatsApp, web).

**Valor para el banco:**
Reducción masiva de costo de atención (~40×), liberación de agentes humanos para casos complejos, datos de comportamiento de clientes, mejora continua del modelo.

**Métricas verificadas:**
- 87M interacciones (feb/2019) — IBM Newsroom S49
- 9M clientes (2018) — IBM Newsroom S49
- 78K nuevas cuentas via app (2018) — IBM Newsroom S49
- 90% retención (4T25) — Earnings call S03
- 82% resolución al primer nivel (oct/2024) — Microsoft S31
- 89% retención (oct/2024) — Microsoft S31
- +80% resolución (oct/2024) — Microsoft S31

**Evidencia de funcionamiento actual:**
INDEPENDENTLY_CORROBORATED — IBM Newsroom (Tier A), Microsoft case study (Tier B), earnings calls (Tier B), Forbes Brasil (Tier C), Bain & Company (Tier C)

**Fuentes:** S49, S31, S03, S05, S52
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.88)
**Vacíos pendientes:** Definición exacta de "retención" puede haber cambiado entre 2019 y 2025

---

## [BRADESCO:BRIDGE] — Plataforma GenAI Corporativa

**Entidad responsable:** Banco Bradesco S.A.
**Relación corporativa:** Plataforma interna del banco matriz
**Categoría:** IA generativa / Plataforma corporativa

**Qué es:**
Bridge ("Bradesco Inteligência de Data Generativa") es la plataforma corporativa de IA generativa de Bradesco, lanzada en junio de 2025. Centraliza el procesamiento de documentos, voz, texto, desarrollo de asistentes y aplicación de guardrails de IA responsable.

**Problema que busca resolver / por qué se creó:**
Centralizar la adopción de GenAI en toda la organización con gobernanza única, evitando fragmentación de iniciativas de IA y asegurando cumplimiento regulatorio (LGPD, BACEN).

**Cómo funciona:**
Bridge usa una arquitectura multi-LLM (múltiples proveedores de modelos) con GuardRail (filtros de seguridad, PII, compliance), RAG (Retrieval-Augmented Generation) para base de conocimiento, y 7 Guardrails de seguridad. Conecta datos, modelos, agentes y canales en arquitectura multi-cloud. Permite que unidades de negocio creen y gestionen agentes de IA.

**Usuarios o áreas objetivo:**
Unidades de negocio internas (operaciones, tecnología, atención al cliente, desarrollo de software). 500+ casos de uso en producción, 70 a escala.

**Tecnologías identificadas:**
- Multi-LLM (múltiples proveedores)
- RAG (Retrieval-Augmented Generation)
- 7 Guardrails de seguridad (PII, filtros, compliance)
- Multi-cloud (Azure, AWS, Oracle)
- Azure AI Services
- Red Hat OpenShift
- Microsoft 365 Copilot + GitHub Copilot (productividad desarrollador, +35%)

**Cronología:**
- 2024 (aprox.): Experimentación GenAI pre-Bridge
- Jun/2025: Lanzamiento oficial de Bridge (Forbes Brasil, Funds Society)
- Feb/2026: CTO Cíntia Scovine confirma 500+ casos de uso, 70 a escala
- May/2026: StartSe documenta arquitectura multi-LLM + GuardRail

**Estado actual:** PRODUCTION
**Escala:** 500+ casos de uso en producción · 70 a escala · 10.500 profesionales de tecnología

**Valor para cliente:**
Mejora en speed de resolución, procesamiento de documentos más rápido, asistentes más inteligentes, mejores experiencias de atención.

**Valor para el banco:**
Gobernanza centralizada de IA, reutilización de componentes, cumplimiento regulatorio, +22% inversión tech 2025, +16% proyectado 2026, lead time -43%, features +118% vs 2023.

**Métricas verificadas:**
- 500+ casos de uso (CTO feb/2026) — S04, corroborado por Forbes S18, Red Hat S19, Funds Society S20
- 70 a escala — S04
- +35% productividad con Copilot (Microsoft nov/2025) — S31
- Lead time -43% (fin-2025 vs fin-2023) — S04
- Features +118% (fin-2025 vs fin-2023) — S04
- Terraform: 80 días → 5 días provisionamiento (abr/2026) — S53

**Evidencia de funcionamiento actual:**
INDEPENDENTLY_CORROBORATED — CTO interview (Tier B), Forbes Brasil (Tier C), Red Hat (Tier B), Funds Society (Tier C), StartSe (Tier C), DIO (Tier C), Convergencia Digital (Tier C), Bain (Tier C)

**Fuentes:** S04, S18, S19, S20, S50, S51, S57, S52, S53
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.88)
**Vacíos pendientes:** Definición exacta de "caso de uso" es interna de Bradesco; no hay auditoría externa del conteo

---

## [BRADESCO:NEXT] — Banco Digital (INTEGRADO)

**Entidad responsable:** Banco Bradesco S.A. (originalmente subsidiaria separada)
**Relación corporativa:** Marca digital dentro del banco matriz (reincorporada 2023-2024)
**Categoría:** Banca digital / Banco 100% digital

**Qué es:**
Next fue lanzado en junio de 2017 como el primer banco 100% digital de Bradesco, dirigido a público joven (generación Z y millennials). Ofrecía cuenta digital, tarjeta sin anualidad, marketplace (Next Shop) con cashback.

**Problema que busca resolver / por qué se creó:**
Competir con fintechs digitales (Nubank, Inter) captando al público joven que no se identificaba con la propuesta tradicional de Bradesco.

**Cómo funciona:**
App móvil nativa con onboarding 100% digital, cuenta sin tarifas, tarjeta de débito virtual, marketplace Next Shop con cashback instantáneo. Infraestructura sobre Microsoft Azure (separada del banco matriz).

**Estado actual:** INTEGRADO (no sunset, no fracaso)
Reincorporado al banco matriz como segmento de atención entre fines de 2023 y 2024. La marca y el app continúan operando y siendo actualizados (Google Play, jun/2026).

**Escala:** 10M+ clientes (jan/2022, antes de reincorporación)

**Valor para cliente:** Banca digital simplificada para jóvenes, sin tarifas, cashback
**Valor para el banco:** Captura de segmento joven, aprendizaje digital, infraestructura Azure

**Cronología:**
- Jun/2017: Lanzamiento
- Nov/2020: Presencia TikTok
- 2021-2022: Next Shop marketplace con cashback
- Ene/2022: 10M+ clientes (O Globo)
- Fines 2023-2024: Reincorporación al banco matriz como segmento

**Métricas verificadas:**
- 10M+ clientes (ene/2022) — S44
- App activo y actualizado (jun/2026) — S10
- Presencia TikTok (nov/2020) — S40

**Evidencia:** INDEPENDENTLY_CORROBORATED — O Globo (Tier C), Google Play (Tier D), Bradesco IR (Tier B)

**Fuentes:** S44, S10, S40, S03
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.85)
**Vacíos:** Métricas de adopción post-reincorporación (2024-2026) no públicamente detalladas

---

## [BRADESCO:BITZ] — Cartera Digital (SUNSET)

**Entidad responsable:** Banco Bradesco S.A.
**Relación corporativa:** Producto digital del banco matriz (absorbido por Digio)
**Categoría:** Cartera digital / Wallet

**Qué es:**
Bitz fue una cartera digital lanzada en septiembre de 2020, con cartão virtual Elo, cartão físico de débito, y pago via QR Code. Meta ambiciosa: 25% del segmento en 3 años.

**Problema que busca resolver / por qué se creó:**
Competir en el segmento de carteras digitales (Mercado Pago, PicPay) captando clientes no bancarizados o sub-bancarizados.

**Cómo funciona:**
App móvil con cuenta de pago, tarjeta virtual Elo para compras online, tarjeta física de débito, pagos QR Code. En diciembre de 2020 adquirió la fintech 4ward para expandir capacidades.

**Estado actual:** SUNSET (confirmado, marzo 2023)
Bitz fue formalmente absorbida por Digio en marzo de 2023. Clientes migrados a Digio. Decisión consciente de consolidación de marcas digitales.

**Cronología:**
- Sep/2020: Lanzamiento (Mobile Time)
- Dic/2020: Adquisición de fintech 4ward (Finsiders)
- Mar/2023: Absorbida por Digio, sunset confirmado (Estadão)

**Valor para cliente:** Cartera digital simple para pagos y compras online
**Valor para el banco:** Experimento de captura de segmento no bancarizado; consolidado en Digio

**Métricas verificadas:**
- Meta 25% segmento en 3 años (no alcanzada públicamente) — S42
- Adquisición de 4ward (dic/2020) — S43

**Evidencia:** INDEPENDENTLY_CORROBORATED — Estadão (Tier C), Mobile Time (Tier C), Finsiders (Tier C)

**Fuentes:** S41, S42, S43
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.88)
**Vacíos:** No hay métricas de adopción final de Bitz antes del sunset

---

## [BRADESCO:INOVABRA] — Habitat de Co-innovación

**Entidad responsable:** Organização Bradesco
**Relación corporativa:** Laboratorio de innovación del grupo
**Categoría:** Laboratorio de innovación / Hub / Open innovation

**Qué es:**
Inovabra habitat es un espacio físico de co-innovación de 22.000 m² en São Paulo, inaugurado en febrero de 2018 en sociedad con WeWork. Conecta startups, corporaciones y hubs en un ecosistema de coinvención.

**Problema que busca resolver / por qué se creó:**
Acelerar la innovación abierta conectando Bradesco con el ecosistema startup de forma estructurada, superando la innovación interna aislada.

**Cómo funciona:**
Startups con producto maduro son admitidas al habitat (no es incubadora temprana — es plataforma de escalamiento comercial). Corporaciones co-innovan con startups en proyectos conjuntos. Eventos, workshops y networking continuo.

**Usuarios o áreas objetivo:** Startups (230), corporaciones (80), 8 hubs conectados
**Estado actual:** MATURE_PRODUCTION (operando desde 2018, crecimiento sostenido)

**Escala:**
- 2019: 190+ startups, ~70 corporaciones, 65.000 visitantes, 85 contratos firmados
- 2021: 206 startups, 79 corporaciones, 500 contratos firmados
- 2026: 230 startups, 80 empresas, 8 hubs
- Inovabra Ventures: R$400M fondo propio (40% de inversiones PE del banco)
- Startups en habitat: +55% faturamento en promedio (2019)

**Valor para cliente:** Acceso a soluciones innovadoras, ecosistema de co-innovación
**Valor para el banco:** Pipeline de innovación, acceso a tecnologías emergentes, ROI cuantificable (R$400M fondo, 500 contratos)

**Cronología:**
- Feb/2018: Inauguración (22.000 m², São Paulo, con WeWork)
- 2019: 190 startups, 65K visitantes, 85 contratos
- 2021: 206 startups, 500 contratos, R$400M Inovabra Ventures
- 2023: Parceria com Acate (expansión ecosistema)
- 2026: 230 startups, 80 empresas, 8 hubs

**Métricas verificadas:**
- 230 startups, 80 empresas, 8 hubs (2026) — S08
- R$400M Inovabra Ventures — S27
- +55% faturamento startups (2019) — S26
- 500 contratos (2021) — S25

**Evidencia:** VERIFIED — Sitio oficial Inovabra (Tier A), Mobile Time (Tier C), CEBDS (Tier C), Finsiders (Tier C)

**Fuentes:** S08, S09, S25, S26, S27
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.85)
**Vacíos:** ROI agregado post-2022 no actualizado públicamente

---

## [BRADESCO:DIGIO] — Banco Digital Subsidiario

**Entidad responsable:** Banco Bradesco S.A. (100% controlado)
**Relación corporativa:** Subsidiaria 100%, infraestructura AWS separada
**Categoría:** Banco digital

**Qué es:**
Digio es un banco digital subsidiario de Bradesco, adquirido inicialmente como JV con Banco do Brasil (50/50). Bradesco compró el 49,99% restante a Banco do Brasil por R$625M en 2021-2022, consolidando 100%.

**Problema que busca resolver / por qué se creó:**
Operar un banco digital low-cost con infraestructura propia separada (AWS), permitiendo agilidad y costos menores que el banco matriz.

**Cómo funciona:**
Banco digital con infraestructura en AWS (separada de Next/Azure). Management declaró intención de mantenerlo como unidad independiente.

**Estado actual:** PRODUCTION
**Cronología:**
- 2021-2022: Aquisição do 49,99% (Banco do Brasil) por R$625M
- 2023: Absorve clientes de Bitz (sunset)
- 2024-2026: Operação independente mantida

**Métricas:** R$625M valor de aquisição — S06, S01
**Evidencia:** INDEPENDENTLY_CORROBORATED — Bradesco IR (Tier A), Terra (Tier C)

**Fuentes:** S06, S01
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.88)

---

## [BRADESCO:DREX] — Piloto de Real Digital (EXPERIMENT)

**Entidad responsable:** Banco Bradesco S.A.
**Categoría:** CBDC / Tokenización / Blockchain

**Qué es:**
Bradesco participa en el piloto del Drex (real digital del Banco Central do Brasil), probando préstamos con garantías tokenizadas, debêntures digitales y crédito colateralizado en CDB mediante smart contracts.

**Estado actual:** EXPERIMENT
El Banco Central anunció en agosto de 2025 que Drex abandonará blockchain/DLT en su fase de corto plazo, lanzando una versión simplificada sin tokenización para el segundo semestre de 2026.

**Fuentes:** S61 (BCB), colleague report
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.82)

---

## [BRADESCO:QUANTUM] — Computación Cuántica (EXPERIMENT)

**Entidad responsable:** Banco Bradesco S.A. + IBM Research + USP
**Categoría:** Quantum computing / Post-quantum cryptography

**Qué es:**
Desde 2023, Bradesco contrató IBM Quantum Safe Explorer para mapear vulnerabilidades criptográficas y se unió a la IBM Quantum Network. Partnership con USP (INOVA USP) para R&D en quantum computing, IA y cybersecurity.

**Estado actual:** EXPERIMENT (criptografía post-cuántica en mapeo/piloto; computación cuántica en exploración)

**Fuentes:** S21 (IBM Research), S77 (TI Inside USP), S78 (Security Leaders USP)
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.82)

---

## [BRADESCO:FICO_SAFER] — Plataforma de Fraude

**Entidad responsable:** Banco Bradesco S.A.
**Categoría:** Fraude / AML / Decisioning

**Qué es:**
Bradesco implementó FICO Platform para detección de fraude en tiempo real. Procesa hasta 25M transacciones Pix por día, con -89% en revisiones manuales y -25% en rechazos de transacciones.

**Estado actual:** PRODUCTION
**Escala:** 25M Pix tx/día · -89% revisiones manuales · -25% rechazos · 1B tx/mes

**Fuentes:** S32 (FICO), S72 (FICO SAFER detail)
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.80)

---

## [BRADESCO:CIELO] — Adquirencia (Controlador)

**Entidad responsable:** Bradesco + Banco do Brasil (controladores de Cielo)
**Categoría:** Adquirencia / Procesamiento de pagos

**Qué es:**
Bradesco fue socio fundador histórico de Cielo, la mayor adquirente de Brasil. En febrero de 2024, Bradesco y Banco do Brasil decidieron hacer OPA para retirar a Cielo de la bolsa.

**Estado actual:** DELISTED (feb/2024, retirada de bolsa)
**Fuentes:** Valor International S35
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.80)

---

## [BCP:YAPE] — App de Pagos / Superapp

**Entidad responsable:** Banco de Crédito del Perú (BCP)
**Relación corporativa:** App de pagos dentro del perímetro de BCP / Credicorp
**Categoría:** Pagos / Billetera digital / Superapp

**Qué es:**
Yape es la app de pagos móviles de BCP, lanzada en febrero de 2017. Evolucionó de billetera digital a superapp, impulsando la inclusión financiera en Perú. Es la tercera app más usada en Perú.

**Problema que busca resolver / por qué se creó:**
Mejorar la inclusión financiera, facilitar pagos entre personas y comercios sin necesidad de cuenta bancaria tradicional, reducir fricción en transacciones del día a día.

**Cómo funciona:**
App móvil que permite pagos QR, transferencias P2P, recargas, pago de servicios. Los usuarios no necesitan cuenta bancaria BCP para usar Yape. Participa en piloto CBDC del BCRP.

**Estado actual:** PRODUCTION_SCALING
**Escala:**
- 20M+ usuarios totales (2025)
- 15M+ usuarios mensuales activos
- ~75% de la población de Perú
- 23M+ usuarios diarios
- 541K personas recibieron primer crédito via Yape (2024)
- Breakeven alcanzado con 12.3M+ usuarios
- Tercera app más usada en Perú (McKinsey)

**Valor para cliente:** Pagos instantáneos, inclusión financiera, acceso a crédito
**Valor para el banco:** 65% de ingresos de disrupción del grupo, motor de inclusión, datos de comportamiento

**Métricas verificadas:**
- 20M+ users, 15M+ MAU, ~75% pop. (Nuvei) — S54
- 23M+ daily users (Credicorp) — S47
- 541K primer crédito (2024) — Credicorp IR
- Tercera app más usada Perú (McKinsey) — S55

**Fuentes:** S47, S54, S55, S12
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.85)
**Vacíos:** Definición de "usuario diario" vs "usuario activo mensual" no estandarizada

---

## [BCP:CRIPTOCOCOS] — Plataforma Cripto (PILOT)

**Entidad responsable:** Banco de Crédito del Perú (BCP)
**Categoría:** Criptoactivos / Sandbox regulatorio

**Qué es:**
CriptoCocos es la primera plataforma bancaria de criptoactivos del Perú, lanzada en octubre de 2025. Permite comprar/vender Bitcoin y USDC con custodia de BitGo, autorizada por SBS dentro del sandbox regulatorio.

**Problema que busca resolver / por qué se creó:**
Ofrecer acceso regulado y seguro a criptoactivos desde la banca tradicional, capturando demanda de clientes sin recurrir a exchanges no regulados.

**Cómo funciona:**
Plataforma dentro del ecosistema BCP, con custodia institucional de BitGo. Limitada a ~3.000 clientes en fase piloto (sandbox SBS).

**Estado actual:** PILOT (sandbox SBS, escala limitada deliberada)
**Escala:** ~3.000 clientes piloto

**Valor para cliente:** Acceso regulado a Bitcoin y USDC desde banco tradicional
**Valor para el banco:** Posicionamiento pionero en cripto bancario LatAm, aprendizaje regulatorio

**Fuentes:** S62 (BitGo), S63 (BusinessWire)
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.85)
**Nota:** BCP ahead de Bradesco en cripto retail regulado — no hay equivalente público en Bradesco

---

## [BCP:CIX] — Centro de Innovación

**Entidad responsable:** Banco de Crédito del Perú (BCP)
**Categoría:** Laboratorio de innovación

**Qué es:**
CIX (Centro de Innovación del BCP) es un laboratorio interno con más de una década de operación. Sigue el proceso: Exploración → Ideación → Creación.

**Estado actual:** MATURE_PRODUCTION (activo, #InnovationDay2025)
**Fuentes:** S36 (Instagram @cix.bcp), S37 (Viabcp)
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.85)

---

## [BCP:GENIA] — Herramienta IA Generativa

**Entidad responsable:** BCP / Credicorp
**Categoría:** IA generativa

**Qué es:**
GenIA es la herramienta de IA generativa de Credicorp/BCP, anunciada en 2025. BCP es pionero en Perú en uso de IA generativa para desarrollar software (Forbes Perú, dic/2024), con marco de 10+ prácticas (revisiones código, pruebas automatizadas).

**Estado actual:** PRODUCTION
**Escala:** No hay conteo público de casos de uso comparable a los 500 de Bradesco Bridge

**Fuentes:** S28 (Forbes Perú), S30 (Credicorp GenIA), S33 (Credicorp 4Q25)
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.82)

---

## [BCP:BLOCKCHAIN_GIFTS] — Pago Cripto Interno (EXPERIMENT)

**Entidad responsable:** BCP
**Categoría:** Blockchain / Cripto / Laboratorio

**Qué es:**
Blockchain Gifts es el primer pago con criptoactivos dentro de la banca regulada peruana (sep/2025). Token GIFT en Polygon, custodia Fireblocks, limitado a cafeterías internas como laboratorio de aprendizaje.

**Estado actual:** EXPERIMENT
**Fuentes:** S73
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.80)

---

## [BCP:BCRP_CBDC] — Piloto Dinero Digital (PILOT)

**Entidad responsable:** BCP/Yape (uno de 10 participantes)
**Categoría:** CBDC / Dinero digital

**Qué es:**
BCP/Yape participa en el Piloto de Innovación con Dinero Digital del BCRP (Banco Central de Reserva del Perú), lanzado el 10 de marzo de 2025.

**Estado actual:** PILOT
**Escala:** 107.226 usuarios activos, ~41.000 transacciones diarias (jul/2025)

**Fuentes:** S74
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.85)

---

## [BCP:FICO_PLATFORM] — Plataforma de Decisioning

**Entidad responsable:** BCP
**Categoría:** Fraude / Decisioning / ML

**Qué es:**
BCP usa FICO Platform (al igual que Bradesco) para maximizar rentabilidad, reducir carga operativa, y onboarding de nuevos segmentos. También implementó Lynx Tech AI (-30% fraude documentado).

**Estado actual:** PRODUCTION
**Fuentes:** S84 (FICO BCP), S71 (Lynx Tech)
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.80)
**Nota:** Ambos bancos usan FICO — misma plataforma, diferentes outcomes documentados

---

## [BCP:BCP_XPLORE] — Open Banking / APIs

**Entidad responsable:** BCP
**Categoría:** Open Banking / APIs

**Qué es:**
BCP Xplore es la unidad de Open Banking/APIs de BCP, con servicios de recaudación, pagos automáticos y financiamiento flexible exclusivos para clientes del programa.

**Estado actual:** PRODUCTION
**Fuentes:** S15
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.85)

---

## [CREDICORP:KREALO] — Corporate Venture Capital

**Entidad responsable:** Credicorp Ltd.
**Categoría:** Corporate Venture Capital

**Qué es:**
Krealo es el fondo de venture corporativo de Credicorp, con enfoque "hands-on" tipo VC. Portfolio regional de 16 startups, foco en fintech AI solutions.

**Estado actual:** PRODUCTION
**Escala:** 16 startups en portfolio · 8 transacciones en 2025 · Expansión a Ecuador (Jelou, mar/2026) · Tenpo autorizado como banco en Chile (ene/2026)

**Fuentes:** S46, S56
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.82)

---

## [CREDICORP:TENPO] — Neobanco de Chile

**Entidad responsable:** Credicorp (via Krealo)
**Categoría:** Neobanco / Digital wallet

**Qué es:**
Tenpo es una fintech impulsada por Krealo (Credicorp) en Chile. En enero de 2026 se convirtió en el primer neobanco autorizado en Chile.

**Estado actual:** PRODUCTION (primer neobanco Chile, ene/2026)
**Escala:** 754K clientes (fin 2024)

**Fuentes:** S56 (Krealo), Credicorp Annual Report 2024
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.82)

---

## [CREDICORP:MIBANCO] — Microfinanzas

**Entidad responsable:** Credicorp Ltd. (subsidiaria)
**Categoría:** Microfinanzas / Inclusión financiera

**Qué es:**
Mibanco es el líder de microfinanzas en Perú, subsidiaria de Credicorp. Incluyó a 4.1M personas en el sistema financiero, con enfoque en mujeres (56% de clientes).

**Estado actual:** PRODUCTION
**Escala:** 4.1M personas incluidas · 64K clientes (56% mujeres) · S/108.5M desembolsados a 63.6K clientes

**Fuentes:** S81
**Última verificación:** 2026-08-11
**Confianza:** ALTA (0.82)
**Nota:** Bradesco no tiene equivalente en microfinanzas — ventaja estructural de Credicorp

---

## Seguimiento ES / PT-BR

**ES — Próximo paso:** Investigar GNN y synthetic data específicos de Bradesco en patentes y publicaciones académicas
**PT-BR — Próximo passo:** Investigar GNN e synthetic data específicos do Bradesco em patentes e publicações acadêmicas
- Prioridad: MEDIA
- Claim/gap asociado: OQ07 (GNN, synthetic data)
- Fuente objetivo: INPI, Google Patents, arXiv, CAPES
- Criterio de cierre: Evidencia primaria de uso o no-uso
- Estado: PENDIENTE

**ES — Próximo paso:** Documentar arquitectura técnica detallada de Bridge (modelos LLM específicos, pipeline RAG)
**PT-BR — Próximo passo:** Documentar arquitetura técnica detalhada do Bridge (modelos LLM específicos, pipeline RAG)
- Prioridad: ALTA
- Claim/gap asociado: C032 (Bridge architecture)
- Fuente objetivo: StartSe, DIO, Convergencia Digital (fuentes técnicas)
- Criterio de cierre: Nombres de modelos LLM, configuración de guardrails
- Estado: PENDIENTE

**ES — Próximo paso:** Investigar BCP app funcionalidades detalladas (asistente, IA, personalización)
**PT-BR — Próximo passo:** Investigar BCP app funcionalidades detalhadas (assistente, IA, personalização)
- Prioridad: ALTA
- Claim/gap asociado: OQ01 (BCP AI use cases)
- Fuente objetivo: App Store reviews, Viabcp, LinkedIn empleos
- Criterio de cierre: Funcionalidades IA BCP documentadas con evidencia
- Estado: PENDIENTE

---

## Checkpoint y versión

```json
{
  "research_version": "BANK-INTEL-v1.0",
  "fecha_corte": "2026-08-11",
  "banks": ["Banco Bradesco", "Banco de Crédito del Perú"],
  "claims_verificados": 55,
  "claims_pendientes": 3,
  "contradicciones": 4,
  "fuentes_primarias": 25,
  "fuentes_secundarias": 60,
  "revision_rounds": 3,
  "quiet_rounds": 1,
  "status": "PARTIAL"
}
```

*Análisis estratégico independiente. No implica afiliación ni respaldo por parte de Bradesco, BCP o Credicorp.*
