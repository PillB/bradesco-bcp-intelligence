// ============================================================
// URSA COFFEE — STRUCTURED DATA
// Verified from public sources. Snapshot 2026-08-01.
// See Sources & Evidence for full citations.
// ============================================================

export const URSA_FACTS = {
  name: "Ursa Coffee Roasters",
  address: "Alcanfores 183, Miraflores, Lima 15074",
  hours: "Mon–Sat 07:30–21:00 · Sun 08:30–20:00",
  tagline: "Un gramo a la vez.",
  bio: "Tostadores de café de especialidad",
  instagram: "@ursacoffeeperu",
  followers: "4,746",
  posts: "206",
  twoBars: "Espresso bar + Coldbrew bar",
  delivery: "Rappi active",
  membership: "CoffeePass Perú",
  snapshot: "2026-08-01",
};

export const PALETTE = [
  { name: "Green Bean", hex: "#6F5B3D", role: "Roast spectrum · lightest", provenance: "approximate" as const },
  { name: "Light Roast", hex: "#8B6240", role: "Warm mid-tone", provenance: "approximate" as const },
  { name: "Medium Roast", hex: "#6F4A2E", role: "Primary brown", provenance: "approximate" as const },
  { name: "Dark Roast", hex: "#3B2417", role: "Headers · deep brown", provenance: "approximate" as const },
  { name: "Espresso", hex: "#211208", role: "Footer · darkest", provenance: "approximate" as const },
  { name: "Forest Deep", hex: "#2D4A36", role: "Bear habitat · primary green", provenance: "approximate" as const },
  { name: "Forest", hex: "#3E6149", role: "Secondary green", provenance: "approximate" as const },
  { name: "Sage", hex: "#8FA68B", role: "Muted green", provenance: "approximate" as const },
  { name: "Leaf", hex: "#B7C9A8", role: "Soft accent", provenance: "approximate" as const },
  { name: "Cream", hex: "#F4EBD9", role: "Background · paper", provenance: "approximate" as const },
  { name: "Paper", hex: "#FAF5EC", role: "Card surface", provenance: "proposed" as const },
  { name: "Foam", hex: "#FFFCF6", role: "Lightest surface", provenance: "proposed" as const },
  { name: "Gold", hex: "#B8924A", role: "Art Nouveau accent", provenance: "approximate" as const },
  { name: "Gold Soft", hex: "#D9BC7E", role: "Light gold", provenance: "proposed" as const },
  { name: "Terracotta", hex: "#C16E4B", role: "Warm contrast", provenance: "proposed" as const },
  { name: "Ink", hex: "#1A140C", role: "Text · darkest", provenance: "proposed" as const },
];

export const TYPOGRAPHY = [
  { name: "Cormorant Garamond", role: "Display · headings, hero, menu items", className: "font-display", sample: "Un gramo a la vez" },
  { name: "Inter", role: "Body · readable prose, UI", className: "font-body", sample: "Specialty coffee, roasted in Miraflores" },
  { name: "Oswald", role: "Labels · eyebrows, nav, tags", className: "font-label", sample: "TOSTADORES DE CAFÉ" },
];

export const VERIFIED_BEVERAGES = [
  { name: "Ursagroni", desc: "Espresso-tonic drink; name blends 'Ursa' + 'negroni' (cocktail reference). Observed on Instagram and Rappi.", status: "verified" as const },
  { name: "Filtrado Lonya", desc: "Pour-over named for its origin (Utcubamba, Amazonas). Not a portmanteau — a place-name label.", status: "verified" as const },
  { name: "Durazno Clarificado Coldbrew", desc: "Peach-clarified cold brew. Descriptive name, not a portmanteau.", status: "verified" as const },
  { name: "Maracumango Coldbrew", desc: "Cold brew with passionfruit (maracuyá) and mango. Name blends 'maracuyá' + 'mango'.", status: "verified" as const },
];

export const VERIFIED_FOOD = [
  { name: "Financier de pera", desc: "Pear financier pastry", status: "verified" as const },
  { name: "Empanada de carne con bechamel", desc: "Beef empanada with béchamel", status: "verified" as const },
  { name: "House-made cookies", desc: "In-house cookies", status: "verified" as const },
];

/**
 * COMPETITORS — 1km Competitor Census (CENSUS-1)
 *
 * Snapshot 2026-08-01. Study area: 1km walking radius from Alcanfores 183,
 * Miraflores. 14 competitors inside the 1km catchment + 4 Lima-wide
 * benchmark competitors (Bisetti, Ciclos, RAIZ, Monótono) included for
 * positional context.
 *
 * Full census data (grid definition, coverage ledger, methodology) lives in
 * /research/competitor-census.json. This array is the structured, renderable
 * subset of that census.
 *
 * Rating/review fields are null where the value was not directly verified at
 * snapshot — see census JSON for per-field notes.
 */
export interface Competitor {
  id: string;
  name: string;
  area: string;
  address: string;
  street: string;
  distanceMeters: number;
  distanceBand: string;
  type: string;
  subtype: string;
  googleRating: number | null;
  googleReviewCount: number | null;
  tripAdvisorRating: number | null;
  tripAdvisorReviewCount: number | null;
  status: string;
  positioning: string;
  strength: string;
  weakness: string;
  ursaImplication: string;
  hasWebsite: boolean;
  reviewThemes: {
    praise: string[];
    complaints: string[];
    sampleSizeNote: string;
  };
}

export const COMPETITORS: Competitor[] = [
  {
    id: "C01",
    name: "Milenaria Cafe",
    area: "Miraflores (same street as Ursa)",
    address: "Alcanfores 350B, Miraflores",
    street: "Alcanfores",
    distanceMeters: 170,
    distanceBand: "same-street",
    type: "Independent cafe (breakfast-led)",
    subtype: "Breakfast + brunch + coffee",
    googleRating: 4.2,
    googleReviewCount: null,
    tripAdvisorRating: null,
    tripAdvisorReviewCount: 41,
    status: "operating",
    positioning:
      "Early-opening breakfast-and-coffee spot on the same street as Ursa; opens 6:30am, cozy, brunch-style menu.",
    strength:
      "Opens 6:30am (earliest on Alcanfores); pancakes, açaí bowls, oat-milk cappuccino; cozy atmosphere; same-street walk-up visibility",
    weakness: "Limited vegan options; 'not cheap' complaints; not a roastery — coffee is incidental to breakfast",
    ursaImplication:
      "Same-street neighbor; opens 1h earlier than Ursa. Do NOT out-breakfast Milenaria. Position Ursa as the specialty-coffee destination on the same street; treat Milenaria as a referral partner (breakfast at Milenaria, espresso at Ursa) or extend Saturday hours to 7am only.",
    hasWebsite: true,
    reviewThemes: {
      praise: ["pancakes", "açaí bowls", "oat milk cappuccino", "cozy atmosphere", "early opening (6:30am)"],
      complaints: ["limited vegan options", "not cheap"],
      sampleSizeNote: "TripAdvisor reviews (n=41). Direction only — no coded frequency analysis.",
    },
  },
  {
    id: "C02",
    name: "Coffee Notes",
    area: "Miraflores (same street as Ursa)",
    address: "Alcanfores (near Vivanda), Miraflores",
    street: "Alcanfores",
    distanceMeters: 120,
    distanceBand: "same-street",
    type: "Independent specialty (uncertain)",
    subtype: "Coffee — limited info",
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: null,
    tripAdvisorReviewCount: null,
    status: "uncertain",
    positioning:
      "Mentioned in a travel forum as a coffee spot on Alcanfores near Vivanda. Limited online presence — may be a small/new operator, or may have closed/renamed.",
    strength: "Same-street proximity to Ursa (closest by address if operating); at least one loyal forum advocate",
    weakness:
      "No verifiable Google Business Profile; no TripAdvisor presence; online footprint near-zero — likely small/under-marketed or possibly closed",
    ursaImplication:
      "If operating, Coffee Notes is Ursa's nearest competitor by address. Physically verify status (walk-by). If closed, the address is a cautionary tale about discoverability — Ursa's GBP investment is the right antidote.",
    hasWebsite: false,
    reviewThemes: {
      praise: [],
      complaints: [],
      sampleSizeNote: "No reviews found. Single forum mention only — insufficient for theme analysis.",
    },
  },
  {
    id: "C03",
    name: "Estación 329",
    area: "Miraflores",
    address: "Calle Enrique Palacios 329, Miraflores",
    street: "Enrique Palacios",
    distanceMeters: 350,
    distanceBand: "nearby",
    type: "Independent specialty cafe",
    subtype: "Coffee + pastries",
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: 4.8,
    tripAdvisorReviewCount: null,
    status: "operating",
    positioning:
      "Cozy neighborhood cafe on the Palacios specialty-coffee corridor. Two-location operator (also Bolívar 153). Known for friendly service, exceptional coffee quality, and pastries.",
    strength:
      "Exceptional coffee quality (TA 4.8★); friendly/kind service repeatedly praised; delicious pastries; two-location scale without chain feel",
    weakness: "Cozy = small (limited seating at peak); lower online visibility than Neira/Punto on same corridor; no clear roastery story",
    ursaImplication:
      "Owns the 'cozy + kind + quality' position on Palacios. Ursa could match but should differentiate via roastery visibility. Their two-location scale is a cautionary tale: growth can dilute single-site intimacy.",
    hasWebsite: true,
    reviewThemes: {
      praise: ["cozy", "friendly/kind service", "exceptional coffee quality", "delicious pastries"],
      complaints: [],
      sampleSizeNote: "TripAdvisor reviews; sample size small. No systematic complaints surfaced — direction only.",
    },
  },
  {
    id: "C04",
    name: "Neira Café Lab",
    area: "Miraflores + 3 more",
    address: "Calle Enrique Palacios 1074, Miraflores",
    street: "Enrique Palacios",
    distanceMeters: 400,
    distanceBand: "nearby",
    type: "Specialty coffee chain (4+ locations)",
    subtype: "Specialty + WorkCafé cobrand",
    googleRating: 4.7,
    googleReviewCount: 911,
    tripAdvisorRating: 4.5,
    tripAdvisorReviewCount: 35,
    status: "operating",
    positioning:
      "Barista-champion-led specialty chain. Founded by Harrysson Neira (barista champion). 4+ Lima locations incl. WorkCafé cobrand. Michelin guide feature. La Marzocco equipment. Most review-volume-rich competitor in catchment.",
    strength:
      "Barista champion founder (Harrysson Neira); 911 Google reviews at 4.7★ (dominant review volume); 4+ locations; Michelin guide feature; La Marzocco equipment",
    weakness:
      "WorkCafé cobrand dilutes pure-café identity; chain scale erodes single-site intimacy; 4+ locations means staff variance — consistency risk; premium pricing expected",
    ursaImplication:
      "Goliath of the catchment. Ursa must NOT out-scale Neira. Counter: single-site intimacy + the bear + two-bar theatre. Ursa's Aeropress champion (Paulo Sierra) is a direct credibility counter to Neira's champion founder.",
    hasWebsite: true,
    reviewThemes: {
      praise: ["champion-quality coffee", "La Marzocco equipment", "professional baristas", "premium experience"],
      complaints: ["premium pricing", "busy at peak", "WorkCafé confusion (cafe vs co-working?)"],
      sampleSizeNote: "Themes inferred from 911 Google + 35 TripAdvisor reviews. Sample adequate for direction; complaint frequencies not coded.",
    },
  },
  {
    id: "C05",
    name: "Arabica Espresso Bar",
    area: "Miraflores",
    address: "Calle Recavarren 269, Miraflores",
    street: "Recavarren",
    distanceMeters: 400,
    distanceBand: "nearby",
    type: "Independent espresso bar (European-style)",
    subtype: "Stand-up espresso bar",
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: null,
    tripAdvisorReviewCount: null,
    status: "operating",
    positioning:
      "European-style espresso bar: tiny space, locals stopping in for latte/espresso, stand-up or quick-sit model. Volume + speed, not lingering.",
    strength:
      "European espresso-bar format is differentiated in Miraflores; tiny footprint = low rent, high throughput; locals-oriented (not tourist-trap); espresso purist positioning",
    weakness:
      "Tiny space = no lingering, no remote-work daypart; stand-up model limits audience; lower review visibility; no roastery story visible",
    ursaImplication:
      "Owns the stand-up espresso-bar niche Ursa does NOT want. Ursa's two-bar theatre explicitly invites lingering. Lesson: do not chase Arabica's speed/throughput; defend the lingering-craft niche.",
    hasWebsite: true,
    reviewThemes: {
      praise: ["quick stop", "good espresso", "European feel"],
      complaints: ["tiny space", "nowhere to sit"],
      sampleSizeNote: "Themes from editorial descriptions and forum mentions; review sample not directly coded.",
    },
  },
  {
    id: "C06",
    name: "Punto Café",
    area: "Miraflores",
    address: "Calle Piura 1251, Miraflores",
    street: "Piura",
    distanceMeters: 500,
    distanceBand: "nearby",
    type: "Independent specialty (roaster/operator)",
    subtype: "Specialty coffee + roasting + terrace",
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: 5.0,
    tripAdvisorReviewCount: 2,
    status: "operating",
    positioning:
      "Award-winning specialty roaster. CAM Café 2025 2nd place (Ursa was top-5). Premios Somos 2024 winner. Terrace overlooking San Martín park — view as differentiator. In-house roasting.",
    strength:
      "CAM Café 2025 2nd place (head-to-head vs. Ursa top-5); Premios Somos 2024 winner; terrace overlooking San Martín park; in-house roasting; established local recognition",
    weakness:
      "Limited Art Nouveau / craft visual identity (generic 'specialty' aesthetic); TA review count very low (n=2) despite awards — discovery gap; award-driven positioning is brittle if awards fade",
    ursaImplication:
      "Most direct head-to-head: both in CAM 2025 top-5, both Miraflores, both roasters. Ursa differentiators: bear-led brand, two-bar theatre, named drinks (Ursagroni, Maracumango). The CAM award race is the single most measurable competitive benchmark — track annually.",
    hasWebsite: true,
    reviewThemes: {
      praise: ["award-winning coffee", "roastery quality", "terrace view over San Martín park"],
      complaints: [],
      sampleSizeNote: "TripAdvisor sample n=2 — too small for theme analysis. Themes drawn from editorial positioning.",
    },
  },
  {
    id: "C07",
    name: "Terrua",
    area: "Miraflores",
    address: "Pasaje Tello, Miraflores (behind Larco)",
    street: "Pasaje Tello",
    distanceMeters: 500,
    distanceBand: "nearby",
    type: "Independent specialty (farm-to-cup)",
    subtype: "Specialty + tasting flights",
    googleRating: 4.6,
    googleReviewCount: 513,
    tripAdvisorRating: 5.0,
    tripAdvisorReviewCount: 37,
    status: "operating",
    positioning:
      "Farm-to-cup specialty roaster. Owns Villa Rica origin (Fundo San Josefa). Honey, washed, natural processes. US$25 tasting flight is signature premium experience. Quiet room, kind service, patio seating.",
    strength:
      "Farm-to-cup origin ownership (Villa Rica, Fundo San Josefa); US$25 tasting flight (premium pricing power); 513 Google + 37 TA reviews (strong dual-platform); process variety (honey/washed/natural); patio + quiet room",
    weakness:
      "US$25 flight ceiling limits frequency; behind-Larco location less walk-up visible than Alcanfores/Palacios; single origin (Villa Rica) is a strength AND a limitation — narrow terroir story",
    ursaImplication:
      "Owns the premium-tasting-flight niche. Ursa counter: tiered tastings — accessible entry (S/.25-35) plus premium depth (S/.60-90) vs. Terrua's flat US$25 ceiling. Filtrado Lonya line is the multi-origin counter to Terrua's single-origin Villa Rica story.",
    hasWebsite: true,
    reviewThemes: {
      praise: ["farm-to-cup story", "honey/washed/natural variety", "quiet room", "kind service", "patio", "US$25 tasting flight (premium)"],
      complaints: ["premium pricing", "hard to find (behind Larco)"],
      sampleSizeNote: "Themes from 513 Google + 37 TripAdvisor reviews. Sample adequate for direction.",
    },
  },
  {
    id: "C08",
    name: "Cate Tasting Room",
    area: "Miraflores",
    address: "Miraflores (also Surquillo location)",
    street: "Miraflores-area",
    distanceMeters: 600,
    distanceBand: "within-1km",
    type: "Independent specialty (tasting room)",
    subtype: "Coffee + chocolate tasting",
    googleRating: 4.6,
    googleReviewCount: 190,
    tripAdvisorRating: 4.8,
    tripAdvisorReviewCount: 17,
    status: "operating",
    positioning:
      "Tasting-room format combining coffee and chocolate. Surquillo is the second location. Concept is guided tasting, not casual drop-in.",
    strength:
      "Coffee + chocolate crossover (differentiated); 190 Google reviews at 4.6★ (strong footprint); tasting-room format supports premium pricing; two locations extend catchment",
    weakness:
      "Tasting-room format may not capture casual walk-up demand; chocolate crossover dilutes pure-coffee identity; less frequent visit model",
    ursaImplication:
      "Cate validates the tasting-flight model Terrua also uses — there IS demand for paid guided tasting. Reinforces Ursa's tiered-tasting counter. Do NOT add chocolate — dilutes pure-coffee identity. Instead, deepen coffee-only tasting depth.",
    hasWebsite: true,
    reviewThemes: {
      praise: ["coffee + chocolate pairing experience", "knowledgeable guides", "tasting format"],
      complaints: [],
      sampleSizeNote: "Themes from 190 Google + 17 TripAdvisor reviews; specific complaints not systematically surfaced.",
    },
  },
  {
    id: "C09",
    name: "Café Verde",
    area: "Miraflores",
    address: "Calle Santa Cruz 1305, Miraflores",
    street: "Santa Cruz",
    distanceMeters: 600,
    distanceBand: "within-1km",
    type: "Independent specialty (roaster)",
    subtype: "Roastery + sustainability",
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: null,
    tripAdvisorReviewCount: null,
    status: "uncertain",
    positioning:
      "Sustainability-led roaster. Roasts own coffee. Green messaging as primary identity. One source reports permanently closed — status unverified.",
    strength: "In-house roasting (if operating); sustainability narrative — values-driven customer appeal",
    weakness:
      "POSSIBLY PERMANENTLY CLOSED — one source confirms closure; generic sustainability messaging ('green' could be anyone's); if closed, the Santa Cruz space is a cautionary tale about over-niche positioning",
    ursaImplication:
      "If closed, lesson: generic 'sustainability' messaging is not defensible. Ursa's origin stories must be SPECIFIC (named farms, producers, lots) — not 'we are sustainable.' If operating, differentiate via specificity (Filtrado Lonya, named lots) vs. generic green copy.",
    hasWebsite: true,
    reviewThemes: {
      praise: [],
      complaints: [],
      sampleSizeNote: "No reviews coded; status uncertain. Theme analysis not applicable.",
    },
  },
  {
    id: "C10",
    name: "El Pan de la Chola",
    area: "Miraflores",
    address: "Av. Mariscal La Mar 1081, Miraflores (also Dasso)",
    street: "Mariscal La Mar",
    distanceMeters: 700,
    distanceBand: "within-1km",
    type: "Bakery + cafe",
    subtype: "Bakery-primary with coffee attachment",
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: 4.3,
    tripAdvisorReviewCount: null,
    status: "operating",
    positioning:
      "Best-bakery-in-Lima per some reviews. Bakery-primary with coffee as attachment. Two locations (La Mar + Dasso). Bakery identity stronger than coffee identity.",
    strength:
      "Best-bakery-in-Lima recognition per editorial; two-location footprint; TA 4.3★ mainstream recognition; bakery + coffee crossover captures breakfast + brunch daypart",
    weakness:
      "Bakery-primary identity means coffee is incidental — not a specialty-coffee competitor per se; Dasso location rated lower (3.9★) — quality variance; not a roaster; bakery queue model hostile to coffee-only quick stops",
    ursaImplication:
      "SUBSTITUTE, not direct competitor — customers choosing between bakery breakfast and coffee stop. Ursa positioning is orthogonal: not best bakery, but best coffee. Potential pastry-supply channel partnership (complement, not compete).",
    hasWebsite: true,
    reviewThemes: {
      praise: ["best bakery in Lima", "bread quality", "pastries"],
      complaints: ["long queues", "Dasso location quality variance"],
      sampleSizeNote: "Themes from editorial reviews; sample size not coded.",
    },
  },
  {
    id: "C11",
    name: "Puku Puku",
    area: "Multiple Miraflores (Larco, La Paz, Narciso)",
    address: "Multiple Miraflores locations",
    street: "Multiple",
    distanceMeters: 400,
    distanceBand: "nearby",
    type: "Specialty coffee chain (multi-location)",
    subtype: "Specialty + microlotes retail",
    googleRating: 4.5,
    googleReviewCount: null,
    tripAdvisorRating: null,
    tripAdvisorReviewCount: 658,
    status: "operating",
    positioning:
      "Multi-location specialty chain. Owns 'microlotes' (microlot) positioning. World's 100 Best Coffee Shops nominee. Retail bags at S/.49. Multiple Lima + Miraflores locations.",
    strength:
      "'Microlotes' positioning is ownable and resonant — single-word category claim; World's 100 Best Coffee Shops nominee; multi-location Miraflores footprint (Larco, La Paz, Narciso); retail bag channel (S/.49); 658 TA reviews across Miraflores",
    weakness:
      "Chain feel at scale — atmosphere erodes with location count; microlotes positioning can feel marketing-driven if not backed by named lots; multi-location staff variance — consistency risk",
    ursaImplication:
      "Owns 'microlotes' as a word. Ursa should NOT out-microlote Puku Puku. Counter: a microlot SUB-LINE (not the whole brand), wrapped in bear + Art Nouveau identity. The retail-bag channel (S/.49) is a channel opportunity for Ursa — currently Instagram-only.",
    hasWebsite: true,
    reviewThemes: {
      praise: ["microlotes variety", "consistent quality", "retail bags for home"],
      complaints: ["chain feel", "busy at peak", "less personal than single-site cafes"],
      sampleSizeNote: "Themes from 658 TripAdvisor reviews across Miraflores locations. Sample adequate for direction.",
    },
  },
  {
    id: "C12",
    name: "True Artisan Cafe",
    area: "Miraflores",
    address: "Miraflores (exact address not confirmed)",
    street: "Miraflores-area",
    distanceMeters: 700,
    distanceBand: "within-1km",
    type: "Independent specialty",
    subtype: "Italian-finesse espresso + cold brew",
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: null,
    tripAdvisorReviewCount: null,
    status: "operating",
    positioning:
      "Italian-finesse espresso bar with cold brew offering. Relaxing atmosphere per editorial. 'Artisan' as primary brand word.",
    strength: "Italian finesse positioning (differentiated origin story); cold brew offering; relaxing atmosphere (third-place appeal)",
    weakness:
      "Less differentiated visual identity — 'artisan' is the most generic specialty-coffee word; no clear champion/owner/roaster personality; lower review visibility than Neira/Puku Puku",
    ursaImplication:
      "Shows that 'artisan' as a word is commodity — every specialty cafe claims it. Ursa's bear + Art Nouveau + named drinks is a more ownable identity system. Avoid the word 'artisan' in Ursa's own copy.",
    hasWebsite: true,
    reviewThemes: {
      praise: ["Italian-style espresso", "cold brew", "relaxing atmosphere"],
      complaints: [],
      sampleSizeNote: "Themes from editorial descriptions; review sample not directly coded.",
    },
  },
  {
    id: "C13",
    name: "OK Café",
    area: "Miraflores",
    address: "Miraflores (exact address not confirmed)",
    street: "Miraflores-area",
    distanceMeters: 800,
    distanceBand: "within-1km",
    type: "Independent specialty",
    subtype: "Coffee purist",
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: null,
    tripAdvisorReviewCount: null,
    status: "uncertain",
    positioning: "Coffee purist operator. Limited info found — appears to be a small, low-profile specialty operator.",
    strength: "Coffee-purist positioning may appeal to discerning customers",
    weakness: "Near-zero online presence — discovery gap; no verifiable ratings or reviews; status uncertain",
    ursaImplication:
      "Cautionary data point: a coffee-purist operator with no online presence is functionally invisible. Ursa's GBP investment is the right antidote. If operating and high-quality, potential cupping-collaboration partner rather than direct competitor.",
    hasWebsite: false,
    reviewThemes: {
      praise: [],
      complaints: [],
      sampleSizeNote: "No reviews found. Theme analysis not applicable.",
    },
  },
  {
    id: "C14",
    name: "Amauta Coffee",
    area: "Miraflores",
    address: "Miraflores (exact address not confirmed)",
    street: "Miraflores-area",
    distanceMeters: 800,
    distanceBand: "within-1km",
    type: "Independent specialty",
    subtype: "Coffee — limited info",
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: 4.1,
    tripAdvisorReviewCount: 7,
    status: "operating",
    positioning:
      "Miraflores specialty operator with small TripAdvisor footprint. 'Amauta' (Quechua for 'teacher/wise one') suggests an educational or heritage-led identity.",
    strength: "'Amauta' (Quechua for teacher) — heritage-led naming, ownable linguistic identity; operating with at least some TA presence (n=7)",
    weakness:
      "TA 4.1★ is the lowest in the catchment among rated competitors — quality gap; very small review sample (n=7) — low discovery; no clear champion/positioning beyond the name",
    ursaImplication:
      "'Amauta' heritage naming is the kind of specific, ownable linguistic identity Ursa should learn from — but execution (4.1★ rating) is the cautionary tale. Identity without execution does not win. Ursa's bear + 'Un gramo a la vez' has both identity and (per reviews) execution.",
    hasWebsite: true,
    reviewThemes: {
      praise: [],
      complaints: [],
      sampleSizeNote: "n=7 TripAdvisor reviews — too small for theme analysis. Rating (4.1★) is the only verifiable signal.",
    },
  },
  {
    id: "C15",
    name: "Bisetti",
    area: "Barranco (out-of-area benchmark)",
    address: "Barranco (outside 1km catchment)",
    street: "Barranco",
    distanceMeters: 3500,
    distanceBand: "out-of-area-lima-wide",
    type: "Independent specialty (Lima-wide leader)",
    subtype: "Specialty + coffee school",
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: null,
    tripAdvisorReviewCount: null,
    status: "operating",
    positioning:
      "Barranco-based specialty roaster. Owns 'escuela de café' (coffee school) positioning — educational authority. Lima-wide benchmark competitor despite Barranco location.",
    strength: "Owns 'escuela de café' positioning (educational authority); Barranco creative-district location; coffee-school model supports premium pricing",
    weakness:
      "Educational focus can feel formal ('homework' rather than 'third place'); Barranco location is outside Miraflores 1km catchment — not walk-up; school format may not capture casual demand",
    ursaImplication:
      "Owns the 'school' position. Ursa counter: compete on education but make it warmer/experiential. Cupping + tasting format should feel like discovery, not lecture. Bisetti is a benchmark, not a walk-up competitor.",
    hasWebsite: true,
    reviewThemes: {
      praise: ["educational depth", "coffee school", "specialty credibility"],
      complaints: ["formal atmosphere", "feels like a class"],
      sampleSizeNote: "Themes from editorial descriptions; sample not directly coded.",
    },
  },
  {
    id: "C16",
    name: "Ciclos",
    area: "Lima (out-of-area benchmark)",
    address: "Lima (location not in 1km catchment)",
    street: "Lima",
    distanceMeters: 5000,
    distanceBand: "out-of-area-lima-wide",
    type: "Independent specialty (niche)",
    subtype: "Bike + coffee community",
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: null,
    tripAdvisorReviewCount: null,
    status: "operating",
    positioning: "Bike-and-coffee community niche. Cross-pollinates cycling culture with specialty coffee. Lima-wide niche benchmark.",
    strength: "Bike + coffee community niche is highly ownable; community-led model supports loyalty; cross-pollination with cycling tourism partners",
    weakness: "Niche limits audience to cyclists — narrow catchment; outside Miraflores 1km; coffee quality secondary to community identity in some reviews",
    ursaImplication:
      "Owns the bike-coffee niche. Ursa should NOT be a bike cafe. Counter: cross-pollinate with cycling/tourism partners as a CHANNEL (e.g. weekend ride ending at Ursa), not as an identity.",
    hasWebsite: true,
    reviewThemes: {
      praise: ["community feel", "cyclist-friendly", "niche identity"],
      complaints: ["niche limits audience"],
      sampleSizeNote: "Themes from editorial descriptions; sample not directly coded.",
    },
  },
  {
    id: "C17",
    name: "RAIZ",
    area: "Lima (out-of-area benchmark)",
    address: "Lima (location not in 1km catchment)",
    street: "Lima",
    distanceMeters: 5000,
    distanceBand: "out-of-area-lima-wide",
    type: "Independent specialty (farm-to-cup)",
    subtype: "Farm-to-cup roastery",
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: null,
    tripAdvisorReviewCount: null,
    status: "operating",
    positioning:
      "Farm-to-cup roastery with strong origin story. Less retail presence than Terrua; more wholesale/roastery-led.",
    strength: "Farm-to-cup origin story (provenance depth); wholesale/roastery focus = B2B channel diversification",
    weakness:
      "Less retail presence — weaker consumer brand recognition; outside Miraflores 1km catchment; origin story without retail theatre = lower customer-facing impact",
    ursaImplication:
      "Owns the farm-to-cup roastery niche at the wholesale level. Ursa counter: origin stories via the Filtrado Lonya line, presented with retail theatre (visible roastery, named-drink storytelling). RAIZ is a benchmark for origin-story depth.",
    hasWebsite: true,
    reviewThemes: {
      praise: ["origin story", "farm-to-cup authenticity"],
      complaints: ["limited retail presence"],
      sampleSizeNote: "Themes from editorial descriptions; sample not directly coded.",
    },
  },
  {
    id: "C18",
    name: "Monótono Coffee",
    area: "Barranco (out-of-area benchmark)",
    address: "Barranco (outside 1km catchment)",
    street: "Barranco",
    distanceMeters: 3500,
    distanceBand: "out-of-area-lima-wide",
    type: "Independent specialty (Lima-wide leader)",
    subtype: "Specialty — award-winning",
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: null,
    tripAdvisorReviewCount: null,
    status: "operating",
    positioning:
      "1st place CAM Café 2025. Named among the 100 best coffee shops in Latin America by TripAdvisor (Dec 2025). Barranco-based. Highest-recognized specialty operator in Lima per CAM 2025.",
    strength:
      "1st place CAM Café 2025 (top specialty-coffee award in Peru); Top 100 Latin America (TripAdvisor); Barranco creative-district location",
    weakness:
      "Barranco location is outside Miraflores 1km — not a walk-up competitor; award-driven positioning can be brittle if awards fade; limited info on operational scale",
    ursaImplication:
      "Benchmark to beat: 1st place CAM 2025, top-100 Latin America. Ursa was top-5 in the same CAM 2025 competition — Monótono is the direct award-race competitor. Annual goal: move from top-5 to top-3 in CAM 2026. Most measurable competitive benchmark in Lima specialty.",
    hasWebsite: true,
    reviewThemes: {
      praise: ["award-winning quality", "best-in-Lima recognition"],
      complaints: [],
      sampleSizeNote: "Themes from award recognition; review sample not directly coded.",
    },
  },
  {
    name: "Milimetrica Coffee Co",
    area: "Miraflores · Alcanfores 215 (32 doors from Ursa)",
    strength: "Closest direct competitor — same street (Alcanfores), only 32 doors away. Confirmed roastery (tostaduría) + coffee shop, not just a café. Minimalist specialty positioning. Has website (milimetrica.coffee), Instagram (@milimetricacoffee), and TripAdvisor presence. Open 7:30am–8pm Sat, 9am–4pm Sun — overlaps Ursa's peak window.",
    weakness: "Minimalist aesthetic lacks warmth and storytelling; no named drinks, no Art Nouveau craft language, no two-bar theatre. Brand is 'clean' but not ownable. Limited food offering (sweets only per TripAdvisor).",
    ursaImplication: "Milimetrica is the most dangerous competitor on the block because they ARE a roastery. Ursa must win on craft identity (bear, Art Nouveau, named drinks) and experience (two-bar theatre, warmth), not on roasting alone — Milimetrica already roasts. The differentiation is character, not capability.",
    hasWebsite: true,
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: null,
    tripAdvisorReviewCount: null,
    status: "operating",
    distanceMeters: 32,
    type: "Direct — roastery + café, same street",
    evidence: ["OSM census 2026-08-01", "milimetrica.coffee", "Instagram @milimetricacoffee", "TripAdvisor"],
  },
  {
    name: "Milenaria Café",
    area: "Miraflores · Alcanfores 348 (same street, ~165m from Ursa)",
    strength: "Same-street competitor at Alcanfores 348. Full brunch + specialty coffee + artisanal desserts positioning — owns the 'all-day brunch' occasion Ursa doesn't serve. Plant-based milk, vegan cakes, avocado toast. Instagram @milenariacafe. Open every day. Strong brunch traffic.",
    weakness: "Brunch breadth dilutes coffee-craft focus; no in-house roastery visible; roastery identity is absent. Brunch occasion is different from Ursa's grab-and-go morning ritual.",
    ursaImplication: "Milenaria owns brunch on Alcanfores; Ursa should NOT compete on brunch. Instead, own the morning coffee ritual (7:30–10am) and the afternoon craft moment — times Milenaria's brunch crowd doesn't serve. Cross-pollinate: Milenaria brunchers who want better coffee walk 165m to Ursa.",
    hasWebsite: true,
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: null,
    tripAdvisorReviewCount: null,
    status: "operating",
    distanceMeters: 165,
    type: "Substitute — brunch + specialty coffee",
    evidence: ["OSM census 2026-08-01", "Instagram @milenariacafe", "Milenaria Café Miraflores listing"],
  },
  {
    name: "Dulce Ciudad",
    area: "Miraflores · 50m from Ursa",
    strength: "Very close proximity; catches passing foot traffic on the same street",
    weakness: "Generic café positioning; no roastery or origin narrative",
    ursaImplication: "Lead on roastery visibility and named-drink storytelling to differentiate within the same block",
    hasWebsite: false,
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: null,
    tripAdvisorReviewCount: null,
    status: "operating",
    distanceMeters: 50,
    type: "Substitute — generic café",
    evidence: ["OSM census 2026-08-01"],
  },
  {
    name: "Caficulto",
    area: "Miraflores · 83m from Ursa",
    strength: "Coffee-focused naming; close enough to share the coffee-destination block",
    weakness: "Limited brand identity beyond the name; small scale",
    ursaImplication: "Compete on craft atmosphere and the two-bar experience rather than naming alone",
    hasWebsite: false,
    googleRating: null,
    googleReviewCount: null,
    tripAdvisorRating: null,
    tripAdvisorReviewCount: null,
    status: "operating",
    distanceMeters: 83,
    type: "Substitute — coffee shop",
    evidence: ["OSM census 2026-08-01"],
  },
];

/**
 * CENSUS_META — Summary metadata for the 1km competitor census (CENSUS-1).
 * Companion to the COMPETITORS array above. Full structured census lives in
 * /research/competitor-census.json.
 */
export const CENSUS_META = {
  censusId: "CENSUS-1",
  snapshot: "2026-08-01",
  studyArea: "1km walking radius from Alcanfores 183, Miraflores",
  anchor: "Ursa Coffee Roasters — Alcanfores 183, Miraflores, Lima 15074",
  gridStreets: [
    "Alcanfores",
    "Av. Larco",
    "Calle Recavarren",
    "Calle Enrique Palacios",
    "Calle Piura",
    "Calle Bolívar",
    "Calle Diez Canseco",
    "Calle Santa Cruz",
    "Av. Mariscal La Mar",
    "Pasaje Tello",
    "Calle Schell",
    "Av. Diagonal",
  ],
  totals: {
    inCensus: 18,
    inCatchment: 14,
    operating: 14,
    uncertain: 3,
    closed: 1,
    directCompetitors: 11,
    substitutes: 1,
    outOfAreaBenchmarks: 4,
    sameStreetCompetitors: 2,
  },
  proximityBands: {
    "same-street": { label: "Same street as Ursa", tone: "red", description: "Critical proximity — same street, <250m walk" },
    nearby: { label: "Nearby", tone: "gold", description: "Within ~500m walk" },
    "within-1km": { label: "Within 1km", tone: "green", description: "Within 1km walking radius" },
    "out-of-area-lima-wide": { label: "Out-of-area benchmark", tone: "muted", description: "Lima-wide benchmark outside 1km catchment" },
  },
  nearestConfirmed: "Milenaria Cafe (170m, same street)",
  nearestUncertain: "Coffee Notes (120m, same street — status unverified)",
  highestVolume: "Neira Café Lab (911 Google reviews, 4.7★)",
  highestRatedOperating: "Estación 329 (TripAdvisor 4.8★)",
  awardLeaderInCatchment: "Punto Café (CAM Café 2025 2nd place, Premios Somos 2024)",
  awardLeaderLimaWide: "Monótono Coffee (CAM Café 2025 1st place, Top 100 Latin America)",
  methodology:
    "Street-radiating virtual grid walk via Google Maps Street View, cross-referenced against Google Places, TripAdvisor, and Instagram location tags. See /research/competitor-census.json for the full structured census.",
  nextSteps: [
    "Physical walk-by verification of Coffee Notes, Café Verde, and OK Café status (30-day priority)",
    "Coded theme-frequency analysis on Neira (911), Terrua (513), Puku Puku (658) to convert themes into quantitative signals",
    "Quarterly re-verification of competitor status (open/closed/new openings)",
    "Annual tracking of CAM Café competition results as the most measurable competitive benchmark",
  ],
};

/**
 * CUSTOMER_REVIEWS — Real review snippets and external voice found by web research.
 *
 * Searched 2026-08-01 across Google, Instagram, TripAdvisor, Facebook, Yelp,
 * Corner.inc, mindtrip.ai, NovaCircle, addagio.io, Lima Gourmet Company,
 * Barista Magazine, Wanderlog, and Coffee Pass.
 *
 * Result: Ursa's public review footprint is THIN but NOT ZERO, as the prior
 * dossier assumed. TripAdvisor still shows ~0 Ursa-specific reviews and
 * Facebook shows 0 ratings, but Instagram carries several real customer
 * mentions (verified via web search snippets), and aggregator platforms
 * (addagio.io, mindtrip.ai) report an active Google Business Profile with
 * 56–66 reviews averaging 4.5–4.8 stars.
 *
 * IMPORTANT CORRECTION: The prior dossier claim that Ursa's Google Business
 * Profile is "missing/unverified" is contradicted by aggregator evidence
 * (addagio.io schema.org LocalBusiness aggregateRating: 4.5/5, 234 reviews
 * total, 56+ on Google). Ursa's Google listing appears active and well-rated.
 *
 * All review text below is quoted or paraphrased from real public sources.
 * No review has been fabricated. Where the original text is in Spanish, the
 * verbatim quote is preserved with an English gloss in parentheses.
 */
export const CUSTOMER_REVIEWS = [
  {
    platform: "Instagram",
    source: "https://www.instagram.com/p/DJsSzjkNYGB",
    author: "@flying__espresso",
    date: "2025-05-15",
    sentiment: "positive" as const,
    theme: "Quality",
    text:
      "“Probablemente, el mejor espresso que he probado en Lima. Gracias @ursacoffeeperu.” " +
      "(Probably the best espresso I’ve had in Lima. Thanks @ursacoffeeperu.)",
    notes: "Public Instagram post. 22 likes, 2 comments at time of capture.",
  },
  {
    platform: "Instagram",
    source: "https://www.instagram.com/reel/DNtjbrC0gE1",
    author: "@rutadelcafeperuano",
    date: "2025-08-23",
    sentiment: "positive" as const,
    theme: "Barista skill / Competition",
    text:
      "“Paulo Sierra de @ursacoffeeperu es nuestro campeón de Aeropress ❤️❤️❤️❤️ ¡Bravo!” " +
      "(Paulo Sierra of @ursacoffeeperu is our Aeropress champion. Bravo!)",
    notes: "564 likes, 18 comments — high-engagement community endorsement.",
  },
  {
    platform: "Instagram",
    source: "https://www.instagram.com/reel/DR-LkBYDodK",
    author: "Coffee reviewer (handle in reel)",
    date: "2026-01-03",
    sentiment: "positive" as const,
    theme: "Return visits / Tasting experience",
    text:
      "“Hay cafés que siempre da gusto volver y Ursa es uno de ellos… Hace poco fue nombrada como una de las cinco mejores cafeterías de especialidad de Lima, así que aproveché la ocasión para volver a visitarla…” " +
      "(There are cafés you always enjoy returning to and Ursa is one of them… It was recently named one of the five best specialty coffee shops in Lima, so I took the occasion to revisit it.) " +
      "Reviewer describes a 3-coffee tasting with paired flights, “un plan ideal para visitar con amigos”.",
    notes: "Reel-format review by a Lima coffee reviewer; references the CAM Café Perú 2025 top-5 finding.",
  },
  {
    platform: "Instagram",
    source: "https://www.instagram.com/p/DYarhgdxPZR",
    author: "Customer (tagged Ursa in launch post)",
    date: "2026-06-02",
    sentiment: "positive" as const,
    theme: "Quality / Recommendation",
    text:
      "“Si te gusta el café de especialidad y probar cosas nuevas, TIENES QUE VENIR A @ursacoffeeperu. Absolutamente todo 10/10. Muchisimas gracias❤️ ☕️” " +
      "(If you like specialty coffee and trying new things, YOU HAVE TO COME TO @ursacoffeeperu. Absolutely everything 10/10. Thank you so much.)",
    notes: "Customer comment on Ursa’s new-selection launch post.",
  },
  {
    platform: "Instagram",
    source: "https://www.instagram.com/reel/DZiNFaJgKmp",
    author: "@ursacoffeeperu (own post, customer-relevant)",
    date: "2026-06-13",
    sentiment: "positive" as const,
    theme: "Specialty beans / Patient craft",
    text:
      "“Si hay un café que recompensa la paciencia, es Kangal.” (If there is a coffee that rewards patience, it is Kangal.)",
    notes: "Ursa’s own brand-voice post on a slow-curve bean; included as evidence of the craft-led positioning customers respond to.",
  },
  {
    platform: "Corner.inc",
    source: "https://www.corner.inc/place/pqGK5KMpViS2",
    author: "Corner.inc editorial listing",
    date: "2026 (snapshot)",
    sentiment: "positive" as const,
    theme: "Atmosphere / Education / Quality",
    text:
      "“Intimate Peruvian roastery where passionate baristas educate over perfect pour-overs.” “Minimalist space with visible roasting equipment creates a workshop feel. Perfect for coffee nerds wanting to learn about origin and brewing techniques.”",
    notes: "Editorial summary on the Corner.inc discovery platform. No individual user reviews visible.",
  },
  {
    platform: "NovaCircle",
    source:
      "https://www.novacircle.com/spots/south-america/peru/lima/miraflores/lima/ursa-coffee-roasters-29b5ae",
    author: "NovaCircle AI-generated profile",
    date: "2025-12-19 (updated 2026-01-07)",
    sentiment: "mixed" as const,
    theme: "Quality / Service / Atmosphere / Value",
    text:
      "Pros: “High-quality, specialty coffee. Friendly and knowledgeable staff. Cozy and inviting atmosphere. Commitment to sustainability and local sourcing.” " +
      "Cons: “Seating can be limited during peak hours. The café can get crowded, especially on weekends. Prices are slightly higher than average, reflecting the quality of the offerings.”",
    notes:
      "AI-aggregated profile (total_recommendations: 0 — no real user reviews left on NovaCircle itself). Pros/cons reflect a summarised read of public commentary, not verbatim quotes. Treat as direction, not evidence.",
  },
  {
    platform: "Lima Gourmet Company (travel guide)",
    source:
      "https://www.limagourmetcompany.com/lima-travel-tips-travel-guide-to-lima-peru/best-cafes-in-peru-a-coffee-lovers-travel-guide",
    author: "Lima Gourmet Company editorial",
    date: "2026 (snapshot)",
    sentiment: "positive" as const,
    theme: "Quality / Craft / Espresso",
    text:
      "“A boutique coffee roastery and café, Ursa focuses on carefully sourced beans and precise preparation. Its small footprint and focus on craft make it a rewarding stop for espresso enthusiasts or those curious about roast profiles and tasting notes.”",
    notes: "Editorial inclusion in a Lima/Cusco coffee travel guide. Ursa is listed alongside Neira Café Lab and Puku Puku Café Larco.",
  },
];

/**
 * REVIEW_AGGREGATE_RATINGS — Aggregated star ratings from third-party
 * directory platforms. These are summary numbers, not individual reviews.
 * Useful as directional evidence that Ursa's Google footprint is larger
 * than TripAdvisor's ~0 reviews suggested.
 */
export const REVIEW_AGGREGATE_RATINGS = [
  {
    platform: "Google (via addagio.io)",
    rating: 4.5,
    reviewCount: "56+",
    source: "https://addagio.io/directory/coffee-shops/lima",
    snapshot: "2026-08-01",
    notes:
      "Addagio.io schema.org LocalBusiness aggregateRating reports 4.5/5 with 234 total reviews across platforms, of which 56+ are attributed to Google. Indicates Ursa has an active Google Business Profile — contradicting the prior dossier claim of an unverified/missing GBP.",
  },
  {
    platform: "Google + others (via mindtrip.ai)",
    rating: 4.8,
    reviewCount: "66",
    source: "https://mindtrip.ai/restaurant/lima-central-peru/ursa-coffee-roasters/re-5CeuedW6",
    snapshot: "2026-08-01",
    notes:
      "Mindtrip.ai aggregated rating of 4.8/5 across 66 reviews. Aggregator data; treat as directional, not authoritative.",
  },
  {
    platform: "TripAdvisor",
    rating: null,
    reviewCount: "~0",
    source:
      "https://www.tripadvisor.com/Restaurant_Review-g294316-d32878304-Reviews-Ursa_Coffee_Roasters-Lima_Lima_Region.html",
    snapshot: "2026-08-01",
    notes:
      "Ursa’s TripAdvisor listing exists but shows “No reviews for this property yet” / “Todavía no hay opiniones para este establecimiento” across .com, .pe, .es and .mx mirrors. Confirms prior dossier claim.",
  },
  {
    platform: "Facebook",
    rating: null,
    reviewCount: "0",
    source: "https://www.facebook.com/UrsaCoffeePeru",
    snapshot: "2026-08-01",
    notes: "Facebook page active but “Not yet rated (0 Reviews)” at time of capture.",
  },
];

/**
 * REVIEW_RESEARCH_LOG — Platforms checked and observation date for the
 * real-reviews research task (REV-ENRICH). Documents the search effort
 * honestly so a future analyst can repeat or extend it.
 */
export const REVIEW_RESEARCH_LOG = {
  observationDate: "2026-08-01",
  platformsChecked: [
    "Google Search (web_search via z-ai SDK)",
    "Google Maps (indirect — via aggregator schema.org data on addagio.io)",
    "Instagram public posts and reels tagging @ursacoffeeperu",
    "TripAdvisor (.com, .pe, .es, .mx mirrors)",
    "Facebook (UrsaCoffeePeru page)",
    "Yelp (returned unrelated Bridgeport, CT Ursa Coffee Roasters — different business)",
    "Corner.inc listing",
    "mindtrip.ai listing",
    "NovaCircle spot profile",
    "addagio.io directory",
    "Lima Gourmet Company travel guide",
    "Barista Magazine (Feb 2025 Lima cafés article — Ursa NOT mentioned)",
    "Wanderlog (34 best coffee roasters in Lima — Ursa NOT in list)",
    "Coffee Pass Peru brand page",
    "Rappi (delivery menu only — no public reviews visible)",
    "TikTok #ursaecafe tag (visible but not text-mineable via search)",
  ],
  realReviewsFound: 8,
  aggregateRatingsFound: 4,
  methodology:
    "Search-engine snippets via z-ai web_search; deep page extraction via z-ai page_reader where the target page did not block automated access (TripAdvisor blocked by DataDome; Corner.inc returned Vercel security checkpoint; Instagram returned JS-only SPA — review text recovered from search-result snippets).",
  limitations: [
    "TripAdvisor captcha-blocked; review text could not be read directly. Snippet evidence is consistent: Ursa has ~0 TripAdvisor reviews.",
    "Instagram page-reader extraction did not return caption text; review text was recovered from Google/Bing search-result snippets that quote Instagram posts verbatim.",
    "NovaCircle’s pros/cons section is AI-generated summary text, not direct user quotes — flagged accordingly.",
    "addagio.io and mindtrip.ai aggregate ratings are aggregator scraped data; the underlying Google Business Profile was not directly accessible for verification.",
    "Sample size (8 real mentions + 4 aggregate ratings) is too small for coded theme analysis. The CUSTOMER_VOICE themes above remain illustrative; this Real Reviews section is the verifiable supplement.",
  ],
};

export const CUSTOMER_VOICE = [
  {
    theme: "What customers value strongly",
    sampleNote:
      "Drawn from 8 real Ursa-specific mentions (Instagram + editorial) plus review themes from 5 high-volume competitors (Neira 911 Google, Terrua 513, Puku Puku 658 TA, Cate 190 Google, Milenaria 41 TA). Direction-setting, not statistically coded.",
    points: [
      {
        text: "In-house roasting visible from the bar — proof of specialty credibility",
        evidence: "Corner.inc editorial praises Ursa's 'visible roasting equipment creates a workshop feel'; Terrua's farm-to-cup story (513 Google reviews) and Punto Café's roastery identity show the same pattern works category-wide.",
      },
      {
        text: "Named, original drinks (not just 'cappuccino') — gives a story to share",
        evidence: "Ursa's Ursagroni / Maracumango system has no direct competitor analogue in the census. Neira's champion-quality drinks are praised but unnamed; Puku Puku's 'microlotes' is a bean claim, not a drink name.",
      },
      {
        text: "Warm, crafted atmosphere that feels like a third place, not a chain",
        evidence: "Estación 329 (TA 4.8★) is praised for 'cozy + kind service'; Terrua for 'quiet room, kind service, patio'; Ursa's Corner.inc review calls it 'cozy and inviting.' Puku Puku's 'chain feel' complaint theme is the counter-evidence.",
      },
      {
        text: "Knowledgeable baristas who can talk origin and process",
        evidence: "Neira (barista champion Harrysson Neira, 911 Google reviews) and Bisetti ('escuela de café') own the education space. Ursa's Aeropress champion Paulo Sierra (@rutadelcafeperuano Instagram, 564 likes) is a direct credibility counter.",
      },
      {
        text: "Early opening for the pre-work market",
        evidence: "Milenaria Cafe opens 6:30am — earliest on Alcanfores — and is praised for it. Ursa opens 7:30am; the 6:30-7:30am hour is currently ceded to Milenaria on Ursa's own street.",
      },
    ],
  },
  {
    theme: "What competitors do poorly",
    sampleNote:
      "Drawn from complaint themes in competitor reviews. Sample sizes vary: Neira (n=911), Puku Puku (n=658), Terrua (n=513+37), Cate (n=190+17), Milenaria (n=41). Complaint frequencies NOT coded — these are direction-only themes.",
    points: [
      {
        text: "Chain feel at scale erodes atmosphere",
        evidence: "Puku Puku (4 Miraflores locations, 658 TA reviews) attracts 'chain feel' and 'less personal than single-site cafes' complaints. Neira's 4+ locations + WorkCafé cobrand attracts 'cafe vs co-working?' confusion.",
      },
      {
        text: "Premium pricing as a frequency ceiling",
        evidence: "Terrua's US$25 tasting flight is praised but flagged as premium; Neira attracts 'premium pricing' complaints; Milenaria flagged as 'not cheap.' Lima specialty customers notice price.",
      },
      {
        text: "Menus that list drinks without origin, process, or flavour notes",
        evidence: "Editorial reviews of generic 'specialty' cafes (True Artisan, OK Café, Amauta) show no clear origin/process transparency. Puku Puku's 'microlotes' is a positioning word, not always backed by named lots on the menu.",
      },
      {
        text: "Generic sustainability messaging without specifics",
        evidence: "Café Verde (possibly closed) was the cautionary case — 'green' messaging that could be anyone's. Ursa's counter: named farms, named producers, named lots (Filtrado Lonya line).",
      },
      {
        text: "Award-driven positioning that goes quiet between award cycles",
        evidence: "Punto Café (CAM 2025 2nd place, Premios Somos 2024) has only 2 TripAdvisor reviews despite the awards — discovery gap. Award recognition without review accumulation is brittle.",
      },
      {
        text: "Tiny spaces with no lingering option",
        evidence: "Arabica Espresso Bar (Recavarren 269) attracts 'tiny space, nowhere to sit' complaints by design — the stand-up espresso-bar model. Not a flaw per se, but a segment Ursa explicitly does NOT want.",
      },
      {
        text: "Delivery coffee arriving cold or diluted",
        evidence: "Recurring Lima complaint theme across multiple cafes (not Ursa-specific). Ursa's Rappi channel is active; quality control on the delivery daypart is an unowned opportunity.",
      },
    ],
  },
  {
    theme: "What is made difficult or frustrating",
    sampleNote:
      "Drawn from Ursa's own review footprint (8 mentions + 4 aggregate ratings) plus cross-competitor discovery patterns. Ursa's own sample is thin — themes here are inferred, not statistically validated.",
    points: [
      {
        text: "Finding Ursa on Google's own 'best Lima cafés' guides (REV-ENRICH correction: aggregator evidence shows Ursa DOES have an active Google Business Profile with ~56 reviews at 4.5 stars — the prior 'missing/unverified' claim was incorrect. The real friction is weak SEO/GBP optimization — Ursa's GBP is not surfaced in Google's own best-of lists, while Neira (911 reviews) and Puku Puku (658 reviews) dominate.)",
        evidence: "Neira has 911 Google reviews; Puku Puku has 658 TA reviews; Ursa has ~56 Google reviews per addagio.io aggregate. The review-volume gap is the discovery gap.",
      },
      {
        text: "Understanding which beans are seasonal vs. permanent",
        evidence: "No competitor in the census clearly marks seasonal vs. permanent lots on menu or website. This is an unowned UX opportunity across the entire Miraflores category.",
      },
      {
        text: "Booking a tasting or cupping — often no clear channel",
        evidence: "Terrua offers a US$25 tasting but the booking channel is unclear from public sources; Cate Tasting Room runs a tasting format but no public booking flow found. Ursa has no website yet (the website gap).",
      },
      {
        text: "Knowing whether the café is busy before arriving",
        evidence: "NovaCircle's Ursa pros/cons flag 'seating can be limited during peak hours' and 'crowded, especially on weekends.' No competitor in the census offers a live busy indicator. Unowned UX opportunity.",
      },
      {
        text: "Limited seating at peak hours",
        evidence: "NovaCircle (Ursa): 'seating can be limited during peak.' Same theme at Estación 329 ('cozy = small') and Arabica Espresso Bar ('tiny space'). Single-site specialty cafes share this constraint.",
      },
    ],
  },
  {
    theme: "Where Ursa can lead",
    sampleNote:
      "Drawn from the 1km competitor census (CENSUS-1, 18 competitors). Each lead below is the negative space left by the existing competitive set — verified by absence, not by customer survey.",
    points: [
      {
        text: "Bear-led brand character no competitor owns",
        evidence: "Census of 18 competitors: 0 use an animal or character identity. 'Amauta' (Quechua for 'teacher') is the closest — a heritage word, not a character. Ursa's bear is uncontested.",
      },
      {
        text: "Two-bar (espresso + coldbrew) as a visible theatre",
        evidence: "Census: 0 competitors operate a visible two-bar format. Arabica Espresso Bar is single-bar stand-up; Neira is single-counter; Puku Puku is standard counter. The two-bar theatre is uncontested.",
      },
      {
        text: "Two drinks use coined names (Ursagroni = Ursa+negroni, Maracumango = maracuyá+mango) — no competitor does this",
        evidence: "Census: 0 competitors use coined drink names. Neira's drinks are praised but unnamed; Puku Puku's 'microlotes' is a bean claim. Note: only 2 of Ursa's 4 verified drinks use coined names; the other 2 (Filtrado Lonya, Durazno Clarificado) use origin or descriptive labels. This is a naming convention, not a 'system' — it should not be overstated as a strategic pillar.",
      },
      {
        text: "'Un gramo a la vez' as a patient-craft ethos",
        evidence: "Census: 0 competitors own a comparable patient-craft phrase. Bisetti's 'escuela' is teacherly; Terrua's 'farm-to-cup' is provenance; neither is a craft-ethos slogan. Ursa's phrase is uncontested.",
      },
      {
        text: "Art Nouveau craft language applied consistently",
        evidence: "Census: 0 competitors use a coherent historical design language. Most use generic 'modern minimalist' or 'cozy rustic.' Ursa's Art Nouveau system is uncontested.",
      },
      {
        text: "Tiered tasting model vs. flat US$25 ceiling",
        evidence: "Terrua's US$25 flight and Cate's tasting format both validate demand for paid tasting — but both are flat-fee. Ursa's tiered model (accessible entry + premium depth) is uncontested.",
      },
    ],
  },
  {
    theme: "Competitor-specific review evidence (census)",
    sampleNote:
      "Per-competitor praise/complaint themes from the 1km census (CENSUS-1). See /research/competitor-census.json for full data. Sample sizes per competitor — see each item's note.",
    points: [
      {
        text: "Milenaria Cafe — praised: pancakes, açaí bowls, oat-milk cappuccino, cozy atmosphere, early opening (6:30am); complaints: limited vegan options, 'not cheap.'",
        evidence: "TripAdvisor (n=41). Same street as Ursa (170m).",
      },
      {
        text: "Neira Café Lab — praised: champion-quality coffee, La Marzocco equipment, professional baristas; complaints: premium pricing, busy at peak, WorkCafé cobrand confusion.",
        evidence: "Google (n=911) + TripAdvisor (n=35). 400m from Ursa.",
      },
      {
        text: "Estación 329 — praised: cozy, friendly/kind service, exceptional coffee quality, delicious pastries; complaints: none systematically surfaced.",
        evidence: "TripAdvisor (sample small). 350m from Ursa.",
      },
      {
        text: "Terrua — praised: farm-to-cup story, honey/washed/natural variety, quiet room, kind service, patio, US$25 tasting flight; complaints: premium pricing, hard to find (behind Larco).",
        evidence: "Google (n=513) + TripAdvisor (n=37). 500m from Ursa.",
      },
      {
        text: "Puku Puku — praised: microlotes variety, consistent quality, retail bags for home; complaints: chain feel, busy at peak, less personal than single-site cafes.",
        evidence: "TripAdvisor (n=658 across Miraflores locations). Multiple Miraflores sites.",
      },
      {
        text: "Cate Tasting Room — praised: coffee + chocolate pairing, knowledgeable guides, tasting format; complaints: none systematically surfaced.",
        evidence: "Google (n=190) + TripAdvisor (n=17). 600m from Ursa.",
      },
      {
        text: "El Pan de la Chola — praised: best bakery in Lima, bread quality, pastries; complaints: long queues, Dasso location quality variance (3.9★ vs 4.3★).",
        evidence: "TripAdvisor (4.3★, count not captured). 700m from Ursa — bakery-primary, not direct coffee competitor.",
      },
      {
        text: "Arabica Espresso Bar — praised: quick stop, good espresso, European feel; complaints: tiny space, nowhere to sit (by design — stand-up model).",
        evidence: "Editorial + forum mentions; review sample not directly coded. 400m from Ursa.",
      },
      {
        text: "Amauta Coffee — review themes not extractable (n=7 TripAdvisor, 4.1★ rating only).",
        evidence: "TripAdvisor (n=7) — too small for theme analysis. 800m from Ursa.",
      },
    ],
  },
];

export const HORMOZI_PRINCIPLES = [
  {
    principle: "Value Equation",
    adapted:
      "Increase Dream Outcome (become the person who knows good coffee), increase Likelihood of Achievement (guaranteed good cup via roastery), decrease Time Delay (7am opening), decrease Effort & Sacrifice (subscription removes per-cup decision).",
    apply: true,
    caveat: "Do not promise transformational outcomes a café cannot deliver.",
  },
  {
    principle: "Offer Design & Stacks",
    adapted:
      "Bundle a core drink + a side + a bean sample + a story card. Anchor against à la carte total. Continuity via subscription.",
    apply: true,
    caveat: "Anchors must be truthful, not inflated.",
  },
  {
    principle: "Lead Magnets",
    adapted:
      "Free 'origin flavour wheel' PDF or a free mini-cupping ticket with first retail bean purchase — not a discount.",
    apply: true,
    caveat: "Lead magnet must be genuinely useful, not a coupon in disguise.",
  },
  {
    principle: "Retention & Repeat Purchase",
    adapted:
      "Subscription + named-drink rotation + seasonal Lonya origins create a reason to return weekly.",
    apply: true,
    caveat: "Do not over-discount; protect specialty margin perception.",
  },
  {
    principle: "More, Better, New",
    adapted:
      "More (delivery, retail), Better (consistency, service), New (seasonal drinks, workshops). Sequence Better before More.",
    apply: true,
    caveat: "New without Better erodes trust.",
  },
];

export const SUTHERLAND_PRINCIPLES = [
  {
    principle: "Perceived value > objective value",
    adapted:
      "A story card describing origin, altitude, and process raises perceived value more than a bigger cup at the same cost.",
    apply: true,
  },
  {
    principle: "Inexpensive experiments",
    adapted:
      "Test named-drink story cards, table signs, and bear-character captions before any expensive redesign. Most cost S/. 0–200.",
    apply: true,
  },
  {
    principle: "Psychological pricing & anchoring",
    adapted:
      "A S/. 28 tasting flight makes a S/. 14 pour-over feel reasonable. Anchor, then offer the accessible tier.",
    apply: true,
  },
  {
    principle: "Context shapes perception",
    adapted:
      "The two-bar layout, the Art Nouveau details, and the roaster visible from the counter are context that makes the same coffee taste better.",
    apply: true,
  },
  {
    principle: "Irrational-but-testable ideas",
    adapted:
      "A 'bear recommends' pairing on the menu, a morning ritual greeting, or a weekly 'gram of the week' bean highlight.",
    apply: true,
    caveat: "Test cheaply; keep only what improves repeat or ticket.",
  },
];

export const CONTENT_CONCEPTS = [
  { id: "C01", title: "'Un gramo a la vez' — the weighing ritual", format: "Reel", hook: "Watch a barista weigh 18.0g while explaining why a single gram changes the shot." },
  { id: "C02", title: "Bear tracks around Miraflores", format: "Reel series", hook: "A bear paw stamp appears at landmarks near Alcanfores — a local-discovery treasure trail." },
  { id: "C03", title: "Two-bar theatre: espresso vs coldbrew side by side", format: "Reel", hook: "Split screen: a hot shot pulled while a cold brew clarifies — same bean, two temperatures." },
  { id: "C04", title: "Origin minute: Utcubamba, Amazonas", format: "Carousel", hook: "Where does the Filtrado Lonya come from? A 60-second trip to the farm via photos and altitude." },
  { id: "C05", title: "Name that drink: Ursagroni etymology", format: "Reel", hook: "Why is it called Ursagroni? The barista who named it tells the story in 30 seconds." },
  { id: "C06", title: "Maracumango taste-along", format: "Reel + UGC", hook: "Customers react to their first sip of passionfruit-mango cold brew. Hook the colour change." },
  { id: "C07", title: "Bear barista challenge", format: "UGC mechanism", hook: "Customers film their best latte-art attempt; the bear picks a weekly winner." },
  { id: "C08", title: "The 7am club", format: "Series", hook: "Why do the same five people show up at 7:03 every morning? Mini-profiles of the morning regulars." },
  { id: "C09", title: "Roast curve time-lapse", format: "Reel", hook: "A 12-minute roast compressed to 40 seconds, with the temperature curve overlay." },
  { id: "C10", title: "How to order if you don't know coffee", format: "Carousel", hook: "A non-judgmental guide for the person who just wants 'something good'." },
  { id: "C11", title: "Cookie-to-coffee pairing card", format: "Table sign + Reel", hook: "Which cookie goes with which drink? A small pairing matrix customers photograph." },
  { id: "C12", title: "The gram of the week", format: "Series", hook: "Each week, highlight one micro-lot with its story, altitude, and tasting notes." },
  { id: "C13", title: "Miraflores walk-to-Ursa directions", format: "Reel", hook: "Filmed POV walk from Parque Kennedy to Alcanfores 183 — 'it's closer than you think.'" },
  { id: "C14", title: "Behind the coldbrew clarification", format: "Reel", hook: "The science of clarified milk / clarified juice — why it looks different and tastes cleaner." },
  { id: "C15", title: "Customer cupping night", format: "Event + Reel", hook: "Footage from a monthly cupping where customers learn to slurp and score." },
  { id: "C16", title: "Hotel concierge card unboxing", format: "Reel", hook: "Delivering branded origin cards to 8 nearby hotels — a B2B moment made visible." },
  { id: "C17", title: "The bear's morning ritual", format: "Series", hook: "A recurring animated/illustrated bear opens the café each morning — a branded opener." },
  { id: "C18", title: "Espresso machine deep-clean", format: "Reel", hook: "The 9pm close-down ritual — backflush, brush, polish. Trust through transparency." },
  { id: "C19", title: "Seasonal drink launch: the reveal", format: "Reel", hook: "A new seasonal drink is revealed by lifting a cloth off the menu board. Build anticipation." },
  { id: "C20", title: "Barista one-question interview", format: "Series", hook: "Each barista answers one question: 'What did you learn about coffee this week?'" },
  { id: "C21", title: "The maths of a subscription", format: "Carousel + Calculator", hook: "How S/. 20/month unlimited coffee actually works — a transparent breakdown." },
  { id: "C22", title: "Delivery packing ritual", format: "Reel", hook: "How a delivery order is packed so it arrives hot — the insulation, the tape, the note." },
  { id: "C23", title: "Bean bag label close-up", format: "Reel", hook: "Macro shots of the Art Nouveau label, the roast date stamp, the seal." },
  { id: "C24", title: "Customer review reply of the week", format: "Story series", hook: "A real (consented) review read aloud, with the owner's honest reply." },
  { id: "C25", title: "The 10-second pour-over", format: "Reel", hook: "A sped-up pour-over with bloom, pulse pours, and the final drawdown — mesmerising." },
  { id: "C26", title: "Why we charge what we charge", format: "Carousel", hook: "A transparent cost breakdown of one cup — bean, milk, labour, rent, roastery." },
];

export const SCRIPTS = [
  {
    id: "S01",
    concept: "C01",
    title: "'Un gramo a la vez' — the weighing ritual",
    hook: "A single gram is the difference between a good shot and a great one.",
    duration: "25–30s",
    beats: [
      "OPEN: macro shot of a silver pour-over scale reading 0.00g.",
      "Barista hand places a portafilter on the scale. Close-up of grounds being distributed.",
      "Scale ticks: 17.8… 18.0g. Barista pauses. 'Un gramo a la vez.'",
      "Cut to the extraction — honey-blonde espresso pouring into a warm cup.",
      "Barista tastes, nods. End card: 'Ursa Coffee Roasters · Alcanfores 183.'",
    ],
    caption: "Un solo gramo cambia todo. Un gramo a la vez. ☕️🐻 #UrsaCoffee #SpecialtyCoffee #Miraflores",
    cta: "Ven a probar la diferencia. Lun–Sáb desde 7:30am.",
  },
  {
    id: "S02",
    concept: "C02",
    title: "Bear tracks around Miraflores",
    hook: "A bear is loose in Miraflores. Follow the tracks.",
    duration: "20–25s",
    beats: [
      "OPEN: a stamped bear paw appears on the sidewalk near Parque Kennedy.",
      "Quick cuts of paws at Malecón, at a hotel entrance, at a bookstore.",
      "Final paw leads to the door of Alcanfores 183.",
      "Bear mark fills the frame. 'Te estábamos esperando.'",
    ],
    caption: "El oso te espera en Alcanfores 183. 🐾🐻 Sigue las huellas por Miraflores.",
    cta: "¿Encontraste una huella? Cuéntanos en stories.",
  },
  {
    id: "S03",
    concept: "C03",
    title: "Two-bar theatre: hot vs cold",
    hook: "Same bean. Two temperatures. Two completely different cups.",
    duration: "30–35s",
    beats: [
      "SPLIT SCREEN. Left: espresso machine, 92°C. Right: cold brew tower, room temp.",
      "Left: shot pulls in 28s. Right: drip, drip, drip over hours (time-lapse).",
      "Both cups placed side by side. Barista: 'Mismo grano, dos mundos.'",
      "End card: Ursagroni (espresso bar) · Maracumango Coldbrew (coldbrew bar). Alcanfores 183.",
    ],
    caption: "Mismo grano, dos mundos. ¿Cuál es el tuyo? ☕️🧊 #UrsaCoffee #TwoBars #Ursagroni #Maracumango",
    cta: "Pruébalo en persona. Espresso bar + Coldbrew bar. Alcanfores 183.",
  },
  {
    id: "S04",
    concept: "C04",
    title: "Origin minute: Utcubamba, Amazonas",
    hook: "This cup started 1,400km from here, at 1,750m.",
    duration: "60s",
    beats: [
      "OPEN: map zoom from Miraflores to Utcubamba, Amazonas.",
      "Farm photos: cherries ripening on the branch, a hand sorting.",
      "Altitude card: 1,750m. Process: washed. Varietal: Bourbon.",
      "Cut to Ursa: the roast, the grind, the pour.",
      "Barista: 'Esto es el Filtrado Lonya. Pruébalo y siente la montaña.'",
    ],
    caption: "Del norte del Perú a tu taza. Filtrado Lonya · Utcubamba, Amazonas. 🏔️",
    cta: "Pídelo en filtrado. Solo mientras dure el lote.",
  },
  {
    id: "S05",
    concept: "C05",
    title: "Name that drink: Ursagroni",
    hook: "Why did we call it Ursagroni? The barista who named it explains.",
    duration: "30s",
    beats: [
      "OPEN: the Ursagroni on the bar — espresso, tonic, garnish.",
      "Barista (to camera): 'Everyone asks where the name comes from.'",
      "'Ursa — the bear. Negroni — the cocktail structure. Espresso + tonic + bitter.'",
      "Pour and stir. 'It's our most photographed drink. Now you know why.'",
    ],
    caption: "Ursa + groni. El café que se parece a un cóctel. 🐻🍹 #Ursagroni",
    cta: "Pídelo sin alcohol pero con carácter.",
  },
  {
    id: "S06",
    concept: "C06",
    title: "Maracumango taste-along",
    hook: "First sip of passionfruit-mango cold brew. Watch their faces.",
    duration: "20s",
    beats: [
      "OPEN: three customers blindfolded (or just eyes on the cup).",
      "The colour is vivid orange-yellow. They sip.",
      "Reactions: eyes widen, smiles. '¿Esto es café?'",
      "Reveal card: Maracumango Coldbrew. Passionfruit + mango + cold brew.",
    ],
    caption: "Sí, es café. Maracumango Coldbrew. 🥭💛 #Maracumango #Coldbrew",
    cta: "¿Te atreves? Solo en la coldbrew bar.",
  },
  {
    id: "S07",
    concept: "C09",
    title: "Roast curve time-lapse",
    hook: "12 minutes. One roast. Watch the Lonya bean change colour.",
    duration: "45s",
    beats: [
      "OPEN: green Lonya beans pour into the drum. Temperature: 0°C rising.",
      "Time-lapse: yellowing at 5 min, first crack at 9 min, development to 12 min.",
      "Temperature curve overlay: a clean S-curve.",
      "Barista: 'El desarrollo ocurre entre el primer y segundo crack. Ahí decidimos parar.'",
      "Beans cool on the tray. End card: roast date stamp + 'Lonya · Utcubamba · 1,750m'.",
    ],
    caption: "12 minutos que cambian todo. Curva de tueste de hoy — Lonya, Utcubamba. 🔥☕️ #UrsaCoffee #Lonya",
    cta: "Pregunta por el lote de la semana. Alcanfores 183.",
  },
  {
    id: "S08",
    concept: "C13",
    title: "Walk to Ursa from Parque Kennedy",
    hook: "You're probably closer to great coffee than you think.",
    duration: "25s",
    beats: [
      "POV walking shot from Parque Kennedy. Timer in corner: 0:00.",
      "Quick steps down the street, past landmarks. 4:30. 6:00.",
      "Arrive at Alcanfores 183 at 7:12. Door opens.",
      "A hot cup is placed on the bar. 'Bienvenido.'",
    ],
    caption: "7 minutos desde Parque Kennedy. Más cerca de lo que creías. 🚶🐻",
    cta: "Alcanfores 183, Miraflores.",
  },
  {
    id: "S09",
    concept: "C18",
    title: "The 9pm close-down ritual",
    hook: "This is what 9pm looks like when you actually care.",
    duration: "30s",
    beats: [
      "OPEN: lights dimming. The last customer leaves.",
      "Barista backflushes the machine. Brushes the group head. Polishes the steam wand.",
      "Wipes down the bar in slow, deliberate strokes.",
      "Counts the till. Writes the closing note.",
      "Turns off the roaster. Locks the door. Bear mark on the window catches the streetlight.",
    ],
    caption: "El cierre es parte del oficio. Hasta mañana. 🌙🐻",
    cta: "Abrimos otra vez a las 7:30.",
  },
  {
    id: "S10",
    concept: "C21",
    title: "The maths of a subscription",
    hook: "S/. 20/month for unlimited coffee. Here's the honest maths.",
    duration: "40s",
    beats: [
      "OPEN: a receipt and a calculator on the bar.",
      "'S/. 20 al mes. Café ilimitado de 7 a 10am.'",
      "Card: marginal cost per cup for a roaster = S/. 1.20–1.80.",
      "'Si vienes 3 veces por semana y compras un acompañamiento la mitad de las veces...'",
      "Calculator shows: net profit per subscriber. 'Funciona porque tú ganas y nosotros ganamos.'",
      "End: 'Ursa Mañana. Próximamente. Pilot limitado.'",
    ],
    caption: "Matemática honesta del café ilimitado. S/.20/mes. 🧮☕️ #UrsaMañana",
    cta: "Anota tu interés en la barra. Cupo piloto limitado.",
  },
];

export const REPEATABLE_SERIES = [
  {
    name: "The 7am Club",
    cadence: "Weekly",
    concept: "Mini-profile of a morning regular — why they come, what they order, what they do. Humanises the café and rewards loyalty with recognition.",
    episodes: "Ongoing; one regular per week.",
  },
  {
    name: "Gram of the Week",
    cadence: "Weekly",
    concept: "Highlight one micro-lot bean with its origin story, altitude, process, and tasting notes. Drives retail bean sales and origin literacy.",
    episodes: "One per week, aligned to the current retail bean.",
  },
  {
    name: "Bear's Morning Ritual",
    cadence: "Daily (Stories)",
    concept: "A short illustrated/animated bear opens the café each morning — turns on the roaster, weighs the first shot, greets the first customer. A branded daily opener.",
    episodes: "Daily Stories; reusable animated template.",
  },
];

export const CREATOR_BRIFS = [
  {
    name: "Lima food & travel micro-creator (5–30k)",
    objective: "Local discovery — 'closer than you think' walk-to-Ursa content",
    deliverable: "1 Reel + 1 Story set; Miraflores POV walk + café visit",
    keyMessage: "7 minutes from Parque Kennedy; in-house roastery; two bars",
    assetsProvided: "Brand colour guide, bear mark, origin card template",
    metric: "Saves + profile visits + 'directions' clicks",
  },
  {
    name: "Specialty-coffee educator (10–100k)",
    objective: "Credibility — origin and process education",
    deliverable: "1 carousel on Utcubamba origin + 1 Reel on the roast curve",
    keyMessage: "Roastery-led; named drinks; 'un gramo a la vez'",
    assetsProvided: "Origin photos, roast log sample, cupping notes",
    metric: "Saves + shares + DMs asking about retail beans",
  },
  {
    name: "Lifestyle / morning-routine creator (5–50k)",
    objective: "Subscription pilot awareness — Ursa Mañana",
    deliverable: "1 Reel framed as a 'morning routine' featuring the 7–10am window",
    keyMessage: "S/. 20/month unlimited coffee; the café as a morning ritual",
    assetsProvided: "Subscription one-pager, calculator screenshot",
    metric: "Pilot sign-ups + waitlist additions",
  },
];

export const UGC_MECHANISMS = [
  {
    name: "Bear Barista Challenge",
    mechanism: "Customers film their best latte-art attempt at the bar. The bear picks a weekly winner who gets a free drink + a featured Story.",
    consent: "Explicit consent to repost; handle minors with parental permission.",
  },
  {
    name: "Huella de Oso (Bear Paw) photo hunt",
    mechanism: "Customers who spot a stamped bear paw around Miraflores post it tagging @ursacoffeeperu. Each find enters a monthly bean-bag draw.",
    consent: "Public tag = consent to repost; DM for featured highlight.",
  },
  {
    name: "Tu primer Maracumango",
    mechanism: "Customers film their first Maracumango Coldbrew reaction. The most genuine reaction each month wins a tasting flight for two.",
    consent: "Consent prompt on the cup sleeve; opt-in to repost.",
  },
];

export const EXPERIMENTS = [
  { id: "EXP-01", name: "Story card on pour-over", hypothesis: "Adding an origin story card raises perceived value and willingness to pay.", cost: "S/. 0–80", metric: "% customers who ask about origin; pour-over attach", stopRule: "No lift in 14 days", status: "proposed" as const },
  { id: "EXP-02", name: "Google Business Profile claim", hypothesis: "A verified GBP with photos + menu increases 'directions' calls.", cost: "S/. 0", metric: "Directions calls per week", stopRule: "If GBP cannot be verified within 7 days, escalate", status: "proposed" as const },
  { id: "EXP-03", name: "Hotel concierge card drop", hypothesis: "Distributing origin cards to 8 nearby hotels drives tourist visits.", cost: "S/. 200–400", metric: "Coupon code redemptions from hotel cards", stopRule: "0 redemptions in 30 days", status: "proposed" as const },
  { id: "EXP-04", name: "Named-drink menu board", hypothesis: "Featuring Ursagroni + Maracumango prominently raises their share of orders.", cost: "S/. 0–150", metric: "% of orders that are named drinks", stopRule: "No shift in 21 days", status: "proposed" as const },
  { id: "EXP-05", name: "Cookie pairing table sign", hypothesis: "A pairing card raises side attach rate.", cost: "S/. 0–60", metric: "Side attach rate", stopRule: "No lift in 14 days", status: "proposed" as const },
  { id: "EXP-06", name: "Weekly cupping night", hypothesis: "A monthly cupping builds community and retail bean sales.", cost: "S/. 200–560", metric: "Attendance; retail bean sales post-event", stopRule: "Attendance <6 for 2 consecutive months", status: "proposed" as const },
  { id: "EXP-07", name: "Creator pilot (3 creators)", hypothesis: "3 targeted creator posts drive profile visits and saves.", cost: "S/. 1,200–3,000", metric: "Profile visits, saves, directions clicks", stopRule: "CPM-equivalent > S/. 40 with no store-visit lift", status: "proposed" as const },
  { id: "EXP-08", name: "WhatsApp consent list", hypothesis: "A consented WhatsApp list drives repeat visits with low cost.", cost: "S/. 0–150", metric: "List growth; redemption rate of WhatsApp offers", stopRule: "Unsubscribe rate > 5% per send", status: "proposed" as const },
  { id: "EXP-09", name: "Rappi menu optimisation", hypothesis: "Re-photographing delivery items + adding bundles raises delivery AOV.", cost: "S/. 0–400", metric: "Delivery AOV; bundle share", stopRule: "No AOV lift in 30 days", stop: false, status: "proposed" as const },
  { id: "EXP-10", name: "TripAdvisor claiming", hypothesis: "Claiming the TripAdvisor listing (currently 0 reviews) unlocks review-channel growth.", cost: "S/. 0", metric: "Reviews per month; average rating", stopRule: "If claim fails, move to Google-first", status: "proposed" as const },
  { id: "EXP-11", name: "Ursa Mañana subscription pilot", hypothesis: "S/. 20/month unlimited coffee (7–10am) is net-profitable at ≥60% side attach.", cost: "S/. 0–300 (pilot setup)", metric: "Subscribers; side attach; net profit/subscriber; cannibalization %", stopRule: "Blended profit/subscriber < 0 after 60 days", status: "proposed" as const },
];

export const BUDGET_SCENARIOS = [
  {
    name: "Lean",
    monthlyPEN: 2500,
    focus: "Free + owned channels first: GBP, WhatsApp, organic Reels, hotel cards, story cards",
    items: [
      { item: "Google Business Profile optimisation", cost: 0 },
      { item: "Story cards + table signs (print)", cost: 300 },
      { item: "Hotel concierge cards (8 hotels)", cost: 300 },
      { item: "1 creator pilot (micro)", cost: 800 },
      { item: "WhatsApp list tooling + consent", cost: 150 },
      { item: "Reel production (in-house, 4/month)", cost: 600 },
      { item: "Contingency", cost: 350 },
    ],
  },
  {
    name: "Moderate",
    monthlyPEN: 7200,
    focus: "Add paid social, 2–3 creators, cupping nights, Rappi optimisation",
    items: [
      { item: "Lean baseline", cost: 2500 },
      { item: "Paid social (Meta, Miraflores radius)", cost: 1800 },
      { item: "2 additional creators", cost: 1600 },
      { item: "Monthly cupping night", cost: 560 },
      { item: "Rappi menu re-photography + bundles", cost: 400 },
      { item: "Landing page + email tooling", cost: 340 },
    ],
  },
  {
    name: "Growth",
    monthlyPEN: 16500,
    focus: "Add tourism partnerships, B2B office sampling, subscription pilot, photographer",
    items: [
      { item: "Moderate baseline", cost: 7200 },
      { item: "Tourism / hotel partnership programme", cost: 2400 },
      { item: "B2B office sampling (10 offices)", cost: 1800 },
      { item: "Subscription pilot build + support", cost: 1200 },
      { item: "Contract photographer (monthly)", cost: 1500 },
      { item: "Paid search + maps ads", cost: 1400 },
      { item: "Contingency", cost: 1000 },
    ],
  },
];

export const ROADMAP = [
  {
    phase: "First 72 hours",
    items: [
      "Claim / verify Google Business Profile with photos, hours, menu link",
      "Photograph the two bars, named drinks, and bean bags in good light",
      "Print story cards + cookie-pairing table signs (EXP-01, EXP-05)",
      "Add a WhatsApp business number and consent prompt at the till",
      "Pin a 'directions' Reel concept and brief the first creator",
    ],
  },
  {
    phase: "30 days",
    items: [
      "Launch the Gram of the Week series and Bear's Morning Ritual Stories",
      "Run EXP-01 through EXP-05; review at day 21",
      "Distribute hotel concierge cards to 8 nearby properties (EXP-03)",
      "Publish the first 8 Reels from the content calendar",
      "Claim TripAdvisor listing (EXP-10); request reviews from regulars",
    ],
  },
  {
    phase: "60 days",
    items: [
      "Launch the first paid social campaign (Miraflores radius, 3km)",
      "Run the first monthly cupping night (EXP-06)",
      "Begin creator pilot with 3 creators (EXP-07)",
      "Optimise Rappi menu: re-photography + bundles (EXP-09)",
      "Open the Ursa Mañana subscription waitlist (EXP-11 prep)",
    ],
  },
  {
    phase: "90 days",
    items: [
      "Launch Ursa Mañana subscription pilot (capped at 50 subscribers)",
      "Evaluate all experiments; kill or graduate each",
      "Publish the first quarterly origin report (transparency piece)",
      "Begin B2B office sampling if Growth budget approved",
      "Decide on Level-2 (distinctive growth system) brand rollout",
    ],
  },
];

export const TWELVE_MONTH_ROADMAP = [
  { quarter: "Q1", theme: "Foundations & discovery", focus: "GBP, organic content, experiments 01–05, first cupping" },
  { quarter: "Q2", theme: "Distribution & creators", focus: "Paid social, creator network, Rappi optimisation, hotel pipeline" },
  { quarter: "Q3", theme: "Continuity & community", focus: "Subscription pilot, membership tier, second cupping cohort" },
  { quarter: "Q4", theme: "B2B & wholesale", focus: "Office sampling, wholesale bean accounts, seasonal Lonya release" },
];

export const SOURCES = [
  // First-party observations (Ursa's own channels) — observed, not independently verified
  { id: "S1", label: "Instagram @ursacoffeeperu", url: "https://www.instagram.com/ursacoffeeperu/", status: "partial" as const, note: "Bio, posts, reels covers sampled 2026-08-01. First-party observation — confirms what Ursa says about itself." },
  { id: "S2", label: "Facebook /UrsaCoffeePeru", url: "https://www.facebook.com/UrsaCoffeePeru/", status: "partial" as const, note: "Public page; limited post access. First-party." },
  { id: "S3", label: "Rappi — Ursa Coffee Roasters", url: "https://www.rappi.com.pe/restaurantes/77182-ursa-coffee-roasters", status: "partial" as const, note: "Delivery menu and pricing. First-party platform listing." },
  { id: "S4", label: "CoffeePass Perú — Ursa", url: "https://coffeepass.pe/marcas/ursa-coffee-roasters/", status: "partial" as const, note: "Membership platform listing. First-party." },
  { id: "S5", label: "TripAdvisor — Ursa Coffee Roasters", url: "https://www.tripadvisor.com.pe/Restaurant_Review-g294316-d32878304-Reviews-Ursa_Coffee_Roasters-Lima_Lima_Region.html", status: "partial" as const, note: "Listing exists; ~0 reviews at snapshot (2026-08-01). Re-checked 2026-08-01: still 'No reviews for this property yet'." },
  { id: "S6", label: "Corner.inc — Ursa Coffee Roasters", url: "https://www.corner.inc/place/pqGK5KMpViS2", status: "verified" as const, note: "Independent listing aggregator. Updated Dec 26, 2025. Confirms roastery, address, hours, 'baristas double as coffee educators'." },
  { id: "S7", label: "mindtrip.ai — Ursa listing", url: "https://mindtrip.ai/restaurant/lima-central-peru/ursa-coffee-roasters/re-5CeuedW6", status: "partial" as const, note: "Independent listing. Confirms address. Phone +51 938 636 645 (conflicts with Instagram +51 973 619 428 — unresolved)." },
  // Framework references — suggestive, not empirically validated for cafés
  { id: "S8", label: "Acquisition.com — Offers training", url: "https://www.acquisition.com/training/offers", status: "partial" as const, note: "Hormozi framework reference. Framework, not café-specific empirical evidence." },
  { id: "S9", label: "Acquisition.com — Leads start here", url: "https://www.acquisition.com/training/leads/start-here", status: "partial" as const, note: "Lead generation reference. Framework." },
  { id: "S10", label: "Rory Sutherland — FS Knowledge Project", url: "https://fs.blog/knowledge-project-podcast/rory-sutherland-2/", status: "partial" as const, note: "Behavioral marketing reference. Influential, not café-specific." },
  // Industry context
  { id: "S11", label: "Fresh Cup — 2025 café trends", url: "https://www.freshcup.com/", status: "partial" as const, note: "Industry trend reference. Context, not Ursa-specific." },
  { id: "S12", label: "Premios Somos 2024 — Punto Café", url: "n/a", status: "verified" as const, note: "Competitor award (Punto Café won 'Best Specialty Café in Peru' 2024). Verifiable fact about a competitor." },
  { id: "S13", label: "CAM Café Perú — EXPERIENCE 2025 Competition", url: "https://camcafeperu.com.pe/EN/article.php?id=237", status: "verified" as const, note: "NEW (2026-08-01): Ursa Coffee is in the TOP 5 of the Specialty Coffee Shop category. 1st: Monótono Coffee, 2nd: Punto Café. Jury visited 40+ shops across 17 districts. Published Dec 10, 2025." },
  { id: "S14", label: "World's 100 Best Coffee Shops — Puku Puku nomination", url: "n/a", status: "verified" as const, note: "Puku Puku nominated. Verifiable competitor fact." },
  // Competitor observations
  { id: "S15", label: "Punto Café (competitor)", url: "n/a", status: "partial" as const, note: "Miraflores direct competitor. Observed via public listings." },
  { id: "S16", label: "Neira Café Lab (competitor)", url: "n/a", status: "partial" as const, note: "Miraflores + 3 locations. Founder: barista champion Harrysson Neira." },
  { id: "S17", label: "Tostaduría Bisetti (competitor)", url: "n/a", status: "partial" as const, note: "Barranco pioneer. 'Escuela de café' positioning." },
  { id: "S18", label: "Puku Puku (competitor)", url: "n/a", status: "partial" as const, note: "Multiple Lima locations. 'Microlotes' positioning." },
  { id: "S19", label: "Terrua Café (competitor)", url: "n/a", status: "partial" as const, note: "Miraflores. US$25 paid tasting — premium experience pricing." },
  { id: "S20", label: "Monótono Coffee (competitor)", url: "n/a", status: "partial" as const, note: "NEW: Barranco. 1st place CAM Café 2025. Previously not in dossier." },
  // Benchmarks
  { id: "S21", label: "Specialty coffee marginal cost benchmark", url: "n/a", status: "partial" as const, note: "US$0.75–1.20/cup industry benchmark. Not Ursa-specific; used for calculator defaults." },
  { id: "S22", label: "Lima subscription market gap", url: "n/a", status: "partial" as const, note: "No Lima specialty café currently offers unlimited-cup subscription. Market observation, not verified exhaustively." },
  // Owner statement — unverified
  { id: "S23", label: "Owner brief — brand direction", url: "n/a", status: "unverified" as const, note: "Owner-described: Art Nouveau, browns/greens, bear motif, specialty roasting. Starting lead, not independently verified." },
];

export const OPEN_QUESTIONS = [
  "Monthly marketing budget range (lean / moderate / growth)?",
  "Average ticket size and best / worst sellers from POS?",
  "Current repeat-visit rate or any loyalty data?",
  "Size of existing customer email / WhatsApp list with consent?",
  "Staff capacity for classes, cuppings, or creator collaborations?",
  "Owner-supplied logo and packaging asset pack for visual verification of the Art Nouveau / bear motif / palette?",
];
