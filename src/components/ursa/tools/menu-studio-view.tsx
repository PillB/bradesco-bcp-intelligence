"use client";

import { useState, useMemo } from "react";
import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import {
  Pill,
  Callout,
  StatBlock,
  SectionBadge,
  ProgressBar,
  BearMark,
  ArtNouveauDivider,
} from "../ursa-brand";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, fmtNum, fmtPEN, fmtPct } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";
import {
  Plus,
  Trash2,
  ArrowUpDown,
  Star,
  Puzzle,
  Truck,
  Dog,
  Copy,
  Check,
  Coffee,
  TrendingUp,
  Clock,
  Percent,
  Wallet,
  Sparkles,
  Eye,
  Beaker,
  AlertTriangle,
  Ruler,
  Target,
  Scale,
  Layers,
  Tag,
  ArrowRight,
} from "lucide-react";

// ---------------------------------------------------------------
// Types
// ---------------------------------------------------------------

type Category =
  | "Espresso"
  | "Coldbrew"
  | "Filtrado"
  | "Coffee cocktail"
  | "Pastry"
  | "Savory"
  | "Non-coffee";

type PopularityScore = 1 | 2 | 3 | 4 | 5;

type MenuItem = {
  id: string;
  name: string;
  category: Category;
  price: number; // PEN
  cost: number; // PEN
  prepTime: number; // minutes — preparation burden
  popularityScore: PopularityScore; // 1-5, editable
  description: string; // customer-facing description
  recommended: boolean; // "star" marker / "recommended" badge
  pairingIds: string[]; // which other items complement this one
  attachRate: number; // 0-100, % of customers who add this item
};

const CATEGORIES: Category[] = [
  "Espresso",
  "Coldbrew",
  "Filtrado",
  "Coffee cocktail",
  "Pastry",
  "Savory",
  "Non-coffee",
];

// Map category value → translation key suffix (kept lowercase, hyphen-safe)
const CATEGORY_KEY: Record<Category, string> = {
  Espresso: "espresso",
  Coldbrew: "coldbrew",
  Filtrado: "filtrado",
  "Coffee cocktail": "cocktail",
  Pastry: "pastry",
  Savory: "savory",
  "Non-coffee": "non-coffee",
};

// Display order for the menu template / preview (matches a real café flow:
// espresso bar first, then cold drinks, then food).
const CATEGORY_ORDER: Category[] = [
  "Espresso",
  "Coldbrew",
  "Filtrado",
  "Coffee cocktail",
  "Non-coffee",
  "Pastry",
  "Savory",
];

// ---------------------------------------------------------------
// Initial menu — 12 plausible items anchored to Ursa's verified
// drinks (Ursagroni, Maracumango, Filtrado Lonya) plus the
// reconstructed espresso bar and food. Each item carries a
// customer-facing description, a 1-5 popularity score, an attach
// rate, and one or two pairing suggestions.
// ---------------------------------------------------------------

const INITIAL_ITEMS: MenuItem[] = [
  {
    id: "i-ursagroni",
    name: "Ursagroni",
    category: "Coffee cocktail",
    price: 18,
    cost: 4.5,
    prepTime: 3,
    popularityScore: 4,
    description:
      "Espresso-infused pisco, vermouth, amaro, orange oils — stirred over a single rock. The house signature.",
    recommended: true,
    pairingIds: ["i-financier"],
    attachRate: 35,
  },
  {
    id: "i-maracumango",
    name: "Maracumango Coldbrew",
    category: "Coldbrew",
    price: 14,
    cost: 3.8,
    prepTime: 4,
    popularityScore: 5,
    description:
      "Coldbrew nitrogenated, maracuyá reduction, mango foam — Ursa's most photographed drink.",
    recommended: true,
    pairingIds: ["i-cookie"],
    attachRate: 55,
  },
  {
    id: "i-durazno",
    name: "Durazno Clarificado",
    category: "Coldbrew",
    price: 14,
    cost: 3.5,
    prepTime: 4,
    popularityScore: 2,
    description:
      "Coldbrew clarified with durazno milk — floral, light, summer-only. Drink it slow.",
    recommended: false,
    pairingIds: ["i-financier"],
    attachRate: 25,
  },
  {
    id: "i-lonya",
    name: "Filtrado Lonya",
    category: "Filtrado",
    price: 14,
    cost: 2.8,
    prepTime: 5,
    popularityScore: 3,
    description:
      "Single-origin Lonya pour-over, served in a small carafe — the roaster's daily pick.",
    recommended: false,
    pairingIds: ["i-financier"],
    attachRate: 30,
  },
  {
    id: "i-v60",
    name: "V60 del día",
    category: "Filtrado",
    price: 12,
    cost: 2.5,
    prepTime: 5,
    popularityScore: 2,
    description:
      "Hario V60 of the rotating single-origin — bright, clean, no milk, no sugar.",
    recommended: false,
    pairingIds: [],
    attachRate: 20,
  },
  {
    id: "i-espresso",
    name: "Espresso",
    category: "Espresso",
    price: 6,
    cost: 1.2,
    prepTime: 1,
    popularityScore: 4,
    description:
      "Double shot, house blend — chocolate, hazelnut, brown-sugar finish.",
    recommended: true,
    pairingIds: ["i-cookie"],
    attachRate: 40,
  },
  {
    id: "i-cappuccino",
    name: "Cappuccino",
    category: "Espresso",
    price: 10,
    cost: 2.0,
    prepTime: 2,
    popularityScore: 5,
    description:
      "Double shot, velveted milk, dense foam — the morning default.",
    recommended: true,
    pairingIds: ["i-cookie", "i-financier"],
    attachRate: 60,
  },
  {
    id: "i-flatwhite",
    name: "Flat White",
    category: "Espresso",
    price: 10,
    cost: 2.1,
    prepTime: 2,
    popularityScore: 4,
    description:
      "Double ristretto, micro-foam, no foam crown — Antipodean style.",
    recommended: false,
    pairingIds: ["i-cookie"],
    attachRate: 50,
  },
  {
    id: "i-cortado",
    name: "Cortado",
    category: "Espresso",
    price: 8,
    cost: 1.6,
    prepTime: 2,
    popularityScore: 2,
    description:
      "Equal espresso and warm milk — small, strong, balanced.",
    recommended: false,
    pairingIds: [],
    attachRate: 25,
  },
  {
    id: "i-cookie",
    name: "House-made Cookie",
    category: "Pastry",
    price: 5,
    cost: 1.5,
    prepTime: 0,
    popularityScore: 5,
    description:
      "Brown-butter chocolate chunk, sea-salt finish — baked daily in-house.",
    recommended: true,
    pairingIds: [],
    attachRate: 65,
  },
  {
    id: "i-financier",
    name: "Financier de Pera",
    category: "Pastry",
    price: 6,
    cost: 2.0,
    prepTime: 0,
    popularityScore: 2,
    description:
      "Almond brown-butter cake, poached pear, light glaze — pairs with filtration.",
    recommended: false,
    pairingIds: [],
    attachRate: 30,
  },
  {
    id: "i-empanada",
    name: "Empanada de Carne",
    category: "Savory",
    price: 12,
    cost: 5.0,
    prepTime: 4,
    popularityScore: 2,
    description:
      "Slow-braised beef, ají amarillo, olives — baked to order, served warm.",
    recommended: false,
    pairingIds: [],
    attachRate: 25,
  },
];

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

let idCounter = 100;
const nextId = () => `i-${++idCounter}`;

// Margin thresholds (Kasavana & Smith 1982 use the menu-average as
// the dividing line; we use a 55% absolute threshold that matches
// the specialty-coffee industry rule of thumb baked into the live
// metrics section).
const MARGIN_HIGH = 65; // > 65% — healthy
const MARGIN_MID = 55; // 55–65% — watch
const POPULARITY_HIGH = 3; // score >= 3 counts as "popular"

function marginPct(item: MenuItem): number {
  if (item.price <= 0) return 0;
  return ((item.price - item.cost) / item.price) * 100;
}

function marginPEN(item: MenuItem): number {
  return item.price - item.cost;
}

function marginTone(pct: number): "forest" | "gold" | "terracotta" {
  if (pct > MARGIN_HIGH) return "forest";
  if (pct >= MARGIN_MID) return "gold";
  return "terracotta";
}

// FILL tokens — kept brown / gold / terracotta only, per design
// rule "no green fills". Green stays for TEXT (marginTextClass).
function marginColorClass(pct: number) {
  const t = marginTone(pct);
  if (t === "forest") return "bg-ursa-dark-roast";
  if (t === "gold") return "bg-ursa-gold";
  return "bg-ursa-terracotta";
}

function marginTextClass(pct: number) {
  const t = marginTone(pct);
  if (t === "forest") return "text-ursa-forest-deep";
  if (t === "gold") return "text-ursa-medium-roast";
  return "text-ursa-terracotta-text";
}

// Stars & Puzzles classification (Kasavana & Smith 1982). Popularity
// uses the 1-5 score; >= 3 counts as high.
type Quadrant = "star" | "puzzle" | "plowhorse" | "dog";
function classify(item: MenuItem): Quadrant {
  const pct = marginPct(item);
  const highMargin = pct >= MARGIN_MID;
  const highPopularity = item.popularityScore >= POPULARITY_HIGH;
  if (highPopularity && highMargin) return "star";
  if (!highPopularity && highMargin) return "puzzle";
  if (highPopularity && !highMargin) return "plowhorse";
  return "dog";
}

const QUADRANT_META: Record<
  Quadrant,
  { icon: React.ReactNode; tone: "gold" | "forest" | "terracotta" }
> = {
  star: { icon: <Star size={14} />, tone: "forest" },
  puzzle: { icon: <Puzzle size={14} />, tone: "gold" },
  plowhorse: { icon: <Truck size={14} />, tone: "gold" },
  dog: { icon: <Dog size={14} />, tone: "terracotta" },
};

// ---------------------------------------------------------------
// Psychology techniques — testable hypotheses, not laws.
// Each entry pairs a stable id with an evidence-strength rating;
// all copy (mechanism, ethical risk, measurement, stop-condition,
// citation) lives in the i18n dictionary.
// ---------------------------------------------------------------

type Evidence = "strong" | "moderate" | "weak" | "mixed";

type Hypothesis = {
  id: string;
  evidence: Evidence;
};

const HYPOTHESES: Hypothesis[] = [
  { id: "star-markers", evidence: "mixed" },
  { id: "menu-ordering", evidence: "mixed" },
  { id: "descriptive-names", evidence: "strong" },
  { id: "price-anchoring", evidence: "moderate" },
  { id: "decoy-pricing", evidence: "strong" },
  { id: "pairing-suggestions", evidence: "moderate" },
  { id: "bundle-offers", evidence: "moderate" },
  { id: "font-hierarchy", evidence: "weak" },
];

const EVIDENCE_TONE: Record<Evidence, "forest" | "gold" | "terracotta"> = {
  strong: "forest",
  moderate: "gold",
  weak: "terracotta",
  mixed: "gold",
};

const EVIDENCE_ICON: Record<Evidence, React.ReactNode> = {
  strong: <Scale size={14} />,
  moderate: <Scale size={14} />,
  weak: <AlertTriangle size={14} />,
  mixed: <AlertTriangle size={14} />,
};

// ---------------------------------------------------------------
// Main component
// ---------------------------------------------------------------

export function MenuStudioView() {
  const { t } = useI18n();
  const [items, setItems] = useState<MenuItem[]>(INITIAL_ITEMS);
  const [sortKey, setSortKey] = useState<
    "marginPct" | "marginPEN" | "price" | "prepTime" | "popularityScore" | "attachRate" | "name"
  >("marginPct");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [primaryId, setPrimaryId] = useState<string>("i-ursagroni");
  const [sideId, setSideId] = useState<string>("i-cookie");
  const [primaryVolume, setPrimaryVolume] = useState<number>(100);
  const [attachRate, setAttachRate] = useState<number>(60);
  const [exportOpen, setExportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // -----------------------------------------------------------
  // Mutations
  // -----------------------------------------------------------
  const updateItem = (id: string, patch: Partial<MenuItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const togglePairing = (id: string, otherId: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const has = it.pairingIds.includes(otherId);
        return {
          ...it,
          pairingIds: has
            ? it.pairingIds.filter((p) => p !== otherId)
            : [...it.pairingIds, otherId],
        };
      }),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setItems((prev) =>
      prev.map((it) => ({
        ...it,
        pairingIds: it.pairingIds.filter((p) => p !== id),
      })),
    );
    if (primaryId === id && items.length > 1) {
      const fallback = items.find((it) => it.id !== id);
      if (fallback) setPrimaryId(fallback.id);
    }
    if (sideId === id && items.length > 1) {
      const fallback = items.find((it) => it.id !== id);
      if (fallback) setSideId(fallback.id);
    }
  };

  const addItem = () => {
    const newItem: MenuItem = {
      id: nextId(),
      name: t("content.menu-studio.template.new-item-name"),
      category: "Espresso",
      price: 10,
      cost: 3,
      prepTime: 2,
      popularityScore: 3,
      description: "",
      recommended: false,
      pairingIds: [],
      attachRate: 30,
    };
    setItems((prev) => [...prev, newItem]);
  };

  // -----------------------------------------------------------
  // Derived: live metrics (header strip)
  // -----------------------------------------------------------
  const metrics = useMemo(() => {
    if (items.length === 0) {
      return {
        count: 0,
        minPrice: 0,
        maxPrice: 0,
        avgPrice: 0,
        avgMarginPct: 0,
        avgPopularity: 0,
        avgAttach: 0,
        totalPrepTime: 0,
        categoryCounts: {} as Record<string, number>,
      };
    }
    const prices = items.map((i) => i.price).filter((p) => p > 0);
    const margins = items.map((i) => marginPct(i));
    const prepSum = items.reduce((acc, i) => acc + i.prepTime, 0);
    const popSum = items.reduce((acc, i) => acc + i.popularityScore, 0);
    const attachSum = items.reduce((acc, i) => acc + i.attachRate, 0);
    const categoryCounts: Record<string, number> = {};
    for (const c of CATEGORIES) categoryCounts[c] = 0;
    for (const it of items) categoryCounts[it.category] = (categoryCounts[it.category] || 0) + 1;
    return {
      count: items.length,
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
      avgPrice: prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
      avgMarginPct: margins.reduce((a, b) => a + b, 0) / margins.length,
      avgPopularity: popSum / items.length,
      avgAttach: attachSum / items.length,
      totalPrepTime: prepSum,
      categoryCounts,
    };
  }, [items]);

  // -----------------------------------------------------------
  // Derived: items grouped by category (for template & preview)
  // -----------------------------------------------------------
  const itemsByCategory = useMemo(() => {
    const map: Record<Category, MenuItem[]> = {
      Espresso: [],
      Coldbrew: [],
      Filtrado: [],
      "Coffee cocktail": [],
      Pastry: [],
      Savory: [],
      "Non-coffee": [],
    };
    for (const it of items) map[it.category].push(it);
    return map;
  }, [items]);

  // -----------------------------------------------------------
  // Derived: category dashboard aggregates
  // -----------------------------------------------------------
  const categoryAggregates = useMemo(() => {
    return CATEGORY_ORDER.map((c) => {
      const list = itemsByCategory[c];
      if (list.length === 0) {
        return { category: c, count: 0, avgMargin: 0, avgPopularity: 0, avgPrep: 0, avgAttach: 0 };
      }
      const avgMargin = list.reduce((a, i) => a + marginPct(i), 0) / list.length;
      const avgPopularity = list.reduce((a, i) => a + i.popularityScore, 0) / list.length;
      const avgPrep = list.reduce((a, i) => a + i.prepTime, 0) / list.length;
      const avgAttach = list.reduce((a, i) => a + i.attachRate, 0) / list.length;
      return { category: c, count: list.length, avgMargin, avgPopularity, avgPrep, avgAttach };
    }).filter((row) => row.count > 0);
  }, [itemsByCategory]);

  // -----------------------------------------------------------
  // Derived: transparent-calculations sortable rows
  // -----------------------------------------------------------
  const sortedItems = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      let av: number | string;
      let bv: number | string;
      switch (sortKey) {
        case "marginPct":
          av = marginPct(a);
          bv = marginPct(b);
          break;
        case "marginPEN":
          av = marginPEN(a);
          bv = marginPEN(b);
          break;
        case "price":
          av = a.price;
          bv = b.price;
          break;
        case "prepTime":
          av = a.prepTime;
          bv = b.prepTime;
          break;
        case "popularityScore":
          av = a.popularityScore;
          bv = b.popularityScore;
          break;
        case "attachRate":
          av = a.attachRate;
          bv = b.attachRate;
          break;
        case "name":
          av = a.name;
          bv = b.name;
          break;
        default:
          av = 0;
          bv = 0;
      }
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return copy;
  }, [items, sortKey, sortDir]);

  const toggleSort = (
    key: typeof sortKey,
  ) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  // -----------------------------------------------------------
  // Derived: attach-rate modeler
  // -----------------------------------------------------------
  const primary = items.find((i) => i.id === primaryId);
  const side = items.find((i) => i.id === sideId);
  const sidesSold = primary && side ? Math.round((primaryVolume * attachRate) / 100) : 0;
  const sideMarginPEN = side ? marginPEN(side) : 0;
  const attachMarginTotal = sidesSold * sideMarginPEN;
  const primaryRevenue = primary ? primary.price * primaryVolume : 0;
  const attachRevenue = side ? side.price * sidesSold : 0;
  const blendedMarginPct =
    primaryRevenue + attachRevenue > 0
      ? ((attachMarginTotal + (primary ? marginPEN(primary) * primaryVolume : 0)) /
          (primaryRevenue + attachRevenue)) *
        100
      : 0;

  // -----------------------------------------------------------
  // Derived: Stars & Puzzles
  // -----------------------------------------------------------
  const quadrants = useMemo(() => {
    const q: Record<Quadrant, MenuItem[]> = { star: [], puzzle: [], plowhorse: [], dog: [] };
    for (const it of items) q[classify(it)].push(it);
    return q;
  }, [items]);

  // -----------------------------------------------------------
  // Export text — plain text snapshot
  // -----------------------------------------------------------
  const exportText = (() => {
    const lines: string[] = [];
    lines.push("URSA COFFEE · MENU ENGINEERING STUDIO — EXPORT");
    lines.push("=".repeat(60));
    lines.push("");
    lines.push("HEADLINE METRICS");
    lines.push(`- Items on menu: ${metrics.count}`);
    lines.push(`- Price range: ${fmtPEN(metrics.minPrice)} – ${fmtPEN(metrics.maxPrice)}`);
    lines.push(`- Average price: ${fmtPEN(metrics.avgPrice)}`);
    lines.push(`- Average margin: ${fmtPct(metrics.avgMarginPct)}`);
    lines.push(`- Average popularity (1-5): ${fmtNum(metrics.avgPopularity, 1)}`);
    lines.push(`- Average attach rate: ${fmtPct(metrics.avgAttach, 0)}`);
    lines.push("");
    lines.push("ITEMS — name | category | price | cost | margin PEN | margin % | pop | prep | attach % | quadrant | pairings");
    for (const it of sortedItems) {
      const pct = marginPct(it);
      const pairings = it.pairingIds
        .map((pid) => items.find((x) => x.id === pid)?.name)
        .filter(Boolean)
        .join(", ");
      lines.push(
        `${it.name} | ${it.category} | ${fmtPEN(it.price)} | ${fmtPEN(it.cost)} | ${fmtPEN(marginPEN(it))} | ${fmtPct(pct)} | ${it.popularityScore}/5 | ${it.prepTime} min | ${fmtPct(it.attachRate, 0)} | ${classify(it).toUpperCase()} | ${pairings || "—"}`,
      );
    }
    lines.push("");
    lines.push("STARS & PUZZLES");
    (["star", "puzzle", "plowhorse", "dog"] as Quadrant[]).forEach((q) => {
      lines.push(`- ${q.toUpperCase()} (${quadrants[q].length}): ${quadrants[q].map((i) => i.name).join(", ") || "—"}`);
    });
    lines.push("");
    lines.push("CATEGORY DASHBOARD");
    for (const row of categoryAggregates) {
      lines.push(
        `- ${row.category} · ${row.count} items · avg margin ${fmtPct(row.avgMargin)} · avg pop ${fmtNum(row.avgPopularity, 1)}/5 · avg prep ${fmtNum(row.avgPrep, 1)} min · avg attach ${fmtPct(row.avgAttach, 0)}`,
      );
    }
    lines.push("");
    lines.push("ATTACH-RATE MODEL");
    if (primary && side) {
      lines.push(`- Primary: ${primary.name} × ${primaryVolume} = ${fmtPEN(primaryRevenue)}`);
      lines.push(`- Side: ${side.name} @ ${attachRate}% attach = ${sidesSold} units = ${fmtPEN(attachRevenue)}`);
      lines.push(`- Side margin contribution: ${fmtPEN(attachMarginTotal)}`);
      lines.push(`- Blended margin %: ${fmtPct(blendedMarginPct)}`);
    }
    lines.push("");
    lines.push("PSYCHOLOGY HYPOTHESES (testable, not laws)");
    for (const h of HYPOTHESES) {
      lines.push(
        `- ${t(`content.menu-studio.psych.technique.${h.id}.title`)} [evidence: ${h.evidence}]`,
      );
    }
    lines.push("");
    lines.push("— end of export —");
    return lines.join("\n");
  })();

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback: the textarea inside the dialog is selectable
    }
  };

  // Category label helper (localised)
  const categoryLabel = (c: Category) =>
    t(`content.menu-studio.category.${CATEGORY_KEY[c]}`);

  return (
    <>
      <ViewHero
        eyebrow={t("content.view.menu-studio.eyebrow")}
        title={t("content.view.menu-studio.title")}
        lede={<>{t("content.menu-studio.lede")}</>}
        meta={[
          { label: t("content.menu-studio.meta.default"), value: t("content.menu-studio.meta.default-value") },
          { label: t("content.menu-studio.meta.thresholds"), value: t("content.menu-studio.meta.thresholds-value") },
          { label: t("content.menu-studio.meta.outputs"), value: t("content.menu-studio.meta.outputs-value") },
        ]}
        tone="forest"
      />

      <ViewSection>
        <DossierLinkBanner moduleId="03-menu-and-product-development" />
      </ViewSection>

      {/* ---------- Section 01 · Live menu metrics ---------- */}
      <ViewSection
        badge={t("content.menu-studio.section.01.badge")}
        title={t("content.menu-studio.section.01.title")}
        meta={t("content.menu-studio.section.01.meta")}
      >
        <Grid cols={4}>
          <StatBlock
            value={`${metrics.count}`}
            label={t("content.menu-studio.stat.count")}
            tone="forest"
          />
          <StatBlock
            value={metrics.count > 0 ? `${fmtPEN(metrics.minPrice)}–${fmtPEN(metrics.maxPrice)}` : "—"}
            label={t("content.menu-studio.stat.range")}
            tone="gold"
          />
          <StatBlock
            value={metrics.count > 0 ? fmtPEN(metrics.avgPrice) : "—"}
            label={t("content.menu-studio.stat.avg-price")}
            tone="forest"
          />
          <StatBlock
            value={fmtPct(metrics.avgMarginPct)}
            label={t("content.menu-studio.stat.avg-margin")}
            tone={marginTone(metrics.avgMarginPct) === "forest" ? "forest" : marginTone(metrics.avgMarginPct) === "gold" ? "gold" : "terracotta"}
          />
        </Grid>

        <div className="mt-6 grid lg:grid-cols-[1fr_1fr_1fr] gap-6">
          {/* Avg margin progress */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-display text-base font-semibold text-ursa-dark-roast m-0 flex items-center gap-2">
                <Percent size={16} className="text-ursa-gold-text" /> {t("content.menu-studio.avg-margin.title")}
              </h4>
              <Pill tone={marginTone(metrics.avgMarginPct) === "forest" ? "forest" : marginTone(metrics.avgMarginPct) === "gold" ? "gold" : "stop"}>
                {fmtPct(metrics.avgMarginPct)}
              </Pill>
            </div>
            <ProgressBar value={metrics.avgMarginPct} tone={marginTone(metrics.avgMarginPct)} />
            <div className="flex justify-between mt-2 font-label text-[0.66rem] tracking-[0.12em] uppercase text-muted-foreground">
              <span>0%</span>
              <span className="text-ursa-terracotta-text">{t("content.menu-studio.avg-margin.threshold-leak")}</span>
              <span className="text-ursa-gold-text">{t("content.menu-studio.avg-margin.threshold-healthy")}</span>
              <span>100%</span>
            </div>
            <p className="text-[0.85rem] text-muted-foreground mt-3 m-0">
              {t("content.menu-studio.avg-margin.body")}
            </p>
          </Card>

          {/* Average popularity & attach */}
          <Card>
            <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-3 flex items-center gap-2">
              <Star size={16} className="text-ursa-gold-text" /> {t("content.menu-studio.popularity.title")}
            </h4>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-display text-3xl font-semibold text-ursa-dark-roast">
                {fmtNum(metrics.avgPopularity, 1)}
              </span>
              <span className="text-[0.8rem] text-muted-foreground">{t("content.menu-studio.popularity.subtitle")}</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-label text-[0.7rem] tracking-[0.1em] uppercase text-muted-foreground w-28 shrink-0">
                {t("content.menu-studio.popularity.attach-avg")}
              </span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-ursa-medium-roast to-ursa-dark-roast rounded-full transition-all"
                  style={{ width: `${Math.min(100, metrics.avgAttach)}%` }}
                />
              </div>
              <span className="font-display text-sm font-semibold text-ursa-dark-roast w-12 text-right shrink-0">
                {fmtPct(metrics.avgAttach, 0)}
              </span>
            </div>
            <p className="text-[0.85rem] text-muted-foreground mt-3 m-0">
              {t("content.menu-studio.popularity.body")}
            </p>
          </Card>

          {/* Total prep time + category mix */}
          <Card>
            <h4 className="font-display text-base font-semibold text-ursa-dark-roast mt-0 mb-3 flex items-center gap-2">
              <Clock size={16} className="text-ursa-gold-text" /> {t("content.menu-studio.prep.title")}
            </h4>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-display text-3xl font-semibold text-ursa-dark-roast">
                {metrics.totalPrepTime}
              </span>
              <span className="text-[0.8rem] text-muted-foreground">{t("content.menu-studio.prep.subtitle")}</span>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto ursa-scroll pr-1">
              {CATEGORIES.map((c) => {
                const n = metrics.categoryCounts[c] || 0;
                const pct = metrics.count > 0 ? (n / metrics.count) * 100 : 0;
                return (
                  <div key={c} className="flex items-center gap-3">
                    <span className="font-label text-[0.7rem] tracking-[0.1em] uppercase text-muted-foreground w-28 shrink-0">
                      {categoryLabel(c)}
                    </span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-ursa-medium-roast to-ursa-dark-roast rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-display text-sm font-semibold text-ursa-dark-roast w-6 text-right shrink-0">
                      {n}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[0.78rem] text-muted-foreground mt-3 m-0">
              {t("content.menu-studio.prep.body")}
            </p>
          </Card>
        </div>
      </ViewSection>

      {/* ---------- Section 02 · Editable menu template + live preview ---------- */}
      <ViewSection
        badge={t("content.menu-studio.section.02.badge")}
        title={t("content.menu-studio.section.02.title")}
        meta={t("content.menu-studio.section.02.meta")}
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <p className="text-[0.92rem] text-muted-foreground max-w-[62ch] m-0">
            {t("content.menu-studio.section.02.intro")}
          </p>
          <Button
            onClick={addItem}
            className="bg-ursa-gold text-ursa-dark-roast border border-ursa-gold hover:bg-ursa-gold-soft hover:text-ursa-dark-roast"
          >
            <Plus size={15} /> {t("content.menu-studio.section.02.button.add")}
          </Button>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6 items-start">
          {/* ---------- Editor (left) ---------- */}
          <div className="space-y-4">
            {items.length === 0 && (
              <Card className="bg-ursa-cream">
                <p className="text-[0.92rem] text-muted-foreground m-0 text-center py-6">
                  {t("content.menu-studio.section.02.empty")}
                </p>
              </Card>
            )}
            {items.map((it) => (
              <MenuTemplateRow
                key={it.id}
                item={it}
                allItems={items}
                onChange={(patch) => updateItem(it.id, patch)}
                onTogglePairing={(otherId) => togglePairing(it.id, otherId)}
                onRemove={() => removeItem(it.id)}
                categoryLabel={categoryLabel}
                t={t}
              />
            ))}
            <p className="text-[0.78rem] text-muted-foreground m-0">
              {t("content.menu-studio.section.02.footer")}
            </p>
          </div>

          {/* ---------- Live preview (right, sticky on lg) ---------- */}
          <div className="lg:sticky lg:top-24">
            <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
              <h4 className="font-display text-lg font-semibold text-ursa-dark-roast m-0 flex items-center gap-2">
                <Eye size={18} className="text-ursa-gold-text" /> {t("content.menu-studio.preview.title")}
              </h4>
              <SectionBadge tone="gold">{t("content.menu-studio.preview.meta")}</SectionBadge>
            </div>
            <p className="text-[0.85rem] text-muted-foreground max-w-[48ch] mb-3 m-0">
              {t("content.menu-studio.preview.intro")}
            </p>
            <MenuPreviewCard
              items={items}
              itemsByCategory={itemsByCategory}
              categoryLabel={categoryLabel}
              t={t}
            />
          </div>
        </div>
      </ViewSection>

      {/* ---------- Section 03 · Transparent calculations ---------- */}
      <ViewSection
        badge={t("content.menu-studio.section.03.badge")}
        title={t("content.menu-studio.section.03.title")}
        meta={t("content.menu-studio.section.03.meta")}
      >
        <p className="text-[0.92rem] text-muted-foreground max-w-[68ch] mb-4">
          {t("content.menu-studio.section.03.intro")}
        </p>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto ursa-scroll">
            <Table>
              <TableHeader>
                <TableRow className="bg-ursa-cream hover:bg-ursa-cream">
                  <SortableHead
                    label={t("content.menu-studio.calc.column.item")}
                    sortKey="name"
                    current={sortKey}
                    dir={sortDir}
                    onSort={toggleSort}
                    align="left"
                  />
                  <SortableHead
                    label={t("content.menu-studio.calc.column.price")}
                    sortKey="price"
                    current={sortKey}
                    dir={sortDir}
                    onSort={toggleSort}
                    align="right"
                  />
                  <SortableHead
                    label={t("content.menu-studio.calc.column.cost")}
                    sortKey="price"
                    current={sortKey}
                    dir={sortDir}
                    onSort={toggleSort}
                    align="right"
                    disabled
                  />
                  <SortableHead
                    label={t("content.menu-studio.calc.column.margin-pen")}
                    sortKey="marginPEN"
                    current={sortKey}
                    dir={sortDir}
                    onSort={toggleSort}
                    align="right"
                  />
                  <SortableHead
                    label={t("content.menu-studio.calc.column.margin-pct")}
                    sortKey="marginPct"
                    current={sortKey}
                    dir={sortDir}
                    onSort={toggleSort}
                    align="right"
                  />
                  <SortableHead
                    label={t("content.menu-studio.calc.column.popularity")}
                    sortKey="popularityScore"
                    current={sortKey}
                    dir={sortDir}
                    onSort={toggleSort}
                    align="center"
                  />
                  <SortableHead
                    label={t("content.menu-studio.calc.column.prep")}
                    sortKey="prepTime"
                    current={sortKey}
                    dir={sortDir}
                    onSort={toggleSort}
                    align="right"
                  />
                  <SortableHead
                    label={t("content.menu-studio.calc.column.attach")}
                    sortKey="attachRate"
                    current={sortKey}
                    dir={sortDir}
                    onSort={toggleSort}
                    align="right"
                  />
                  <TableHead className="font-label text-[0.7rem] tracking-[0.1em] uppercase text-ursa-medium-roast text-center min-w-[120px]">
                    {t("content.menu-studio.calc.column.classification")}
                  </TableHead>
                  <TableHead className="font-label text-[0.7rem] tracking-[0.1em] uppercase text-ursa-medium-roast min-w-[160px]">
                    {t("content.menu-studio.calc.column.pairings")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedItems.map((it) => {
                  const pct = marginPct(it);
                  const pen = marginPEN(it);
                  const quadrant = classify(it);
                  return (
                    <TableRow key={it.id} className="hover:bg-ursa-cream/40">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-display font-semibold text-ursa-dark-roast flex items-center gap-1.5">
                            {it.recommended && (
                              <Star size={13} className="text-ursa-gold-text" aria-label={t("content.menu-studio.template.field.recommended")} />
                            )}
                            {it.name}
                          </span>
                          <span className="font-label text-[0.6rem] tracking-[0.1em] uppercase text-muted-foreground">
                            {categoryLabel(it.category)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-display font-semibold text-ursa-dark-roast">
                        {fmtPEN(it.price)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {fmtPEN(it.cost)}
                      </TableCell>
                      <TableCell className="text-right font-display font-semibold text-ursa-medium-roast">
                        {fmtPEN(pen)}
                      </TableCell>
                      <TableCell className={cn("text-right font-display font-bold text-[1.05rem]", marginTextClass(pct))}>
                        {fmtPct(pct)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <PopularityDots score={it.popularityScore} size="sm" />
                          <span className="font-label text-[0.58rem] tracking-[0.06em] uppercase text-muted-foreground">
                            {it.popularityScore}/5
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-display text-ursa-dark-roast">
                        {fmtNum(it.prepTime, 0)} min
                      </TableCell>
                      <TableCell className="text-right font-display text-ursa-dark-roast">
                        {fmtPct(it.attachRate, 0)}
                      </TableCell>
                      <TableCell className="text-center">
                        <QuadrantBadge quadrant={quadrant} t={t} />
                      </TableCell>
                      <TableCell>
                        {it.pairingIds.length === 0 ? (
                          <span className="text-[0.78rem] text-muted-foreground italic">
                            {t("content.menu-studio.calc.pairings-none")}
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {it.pairingIds.map((pid) => {
                              const paired = items.find((x) => x.id === pid);
                              if (!paired) return null;
                              return (
                                <span
                                  key={pid}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-ursa-foam border border-ursa-line-soft text-[0.72rem] font-display text-ursa-dark-roast"
                                >
                                  <ArrowRight size={9} className="text-ursa-gold-text" />
                                  {paired.name}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {sortedItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      {t("content.menu-studio.section.03.empty")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <LegendChip tone="forest" label={t("content.menu-studio.section.03.legend-healthy")} />
          <LegendChip tone="gold" label={t("content.menu-studio.section.03.legend-watch")} />
          <LegendChip tone="terracotta" label={t("content.menu-studio.section.03.legend-leak")} />
        </div>
        <p className="text-[0.78rem] text-muted-foreground mt-3 m-0">
          {t("content.menu-studio.section.03.footer")}
        </p>
      </ViewSection>

      {/* ---------- Section 04 · Category performance dashboard ---------- */}
      <ViewSection
        badge={t("content.menu-studio.section.04.badge")}
        title={t("content.menu-studio.section.04.title")}
        meta={t("content.menu-studio.section.04.meta")}
      >
        <p className="text-[0.92rem] text-muted-foreground max-w-[68ch] mb-4">
          {t("content.menu-studio.section.04.intro")}
        </p>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto ursa-scroll">
            <Table>
              <TableHeader>
                <TableRow className="bg-ursa-cream hover:bg-ursa-cream">
                  <TableHead className="font-label text-[0.7rem] tracking-[0.1em] uppercase text-ursa-medium-roast text-left min-w-[160px]">
                    {t("content.menu-studio.category.column.category")}
                  </TableHead>
                  <TableHead className="font-label text-[0.7rem] tracking-[0.1em] uppercase text-ursa-medium-roast text-right">
                    {t("content.menu-studio.category.column.items")}
                  </TableHead>
                  <TableHead className="font-label text-[0.7rem] tracking-[0.1em] uppercase text-ursa-medium-roast text-right min-w-[180px]">
                    {t("content.menu-studio.category.column.avg-margin")}
                  </TableHead>
                  <TableHead className="font-label text-[0.7rem] tracking-[0.1em] uppercase text-ursa-medium-roast text-right min-w-[140px]">
                    {t("content.menu-studio.category.column.avg-popularity")}
                  </TableHead>
                  <TableHead className="font-label text-[0.7rem] tracking-[0.1em] uppercase text-ursa-medium-roast text-right">
                    {t("content.menu-studio.category.column.avg-prep")}
                  </TableHead>
                  <TableHead className="font-label text-[0.7rem] tracking-[0.1em] uppercase text-ursa-medium-roast text-right min-w-[140px]">
                    {t("content.menu-studio.category.column.avg-attach")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryAggregates.map((row) => (
                  <TableRow key={row.category} className="hover:bg-ursa-cream/40">
                    <TableCell className="font-display font-semibold text-ursa-dark-roast flex items-center gap-2">
                      <Tag size={13} className="text-ursa-gold-text" />
                      {categoryLabel(row.category)}
                    </TableCell>
                    <TableCell className="text-right font-display font-semibold text-ursa-dark-roast">
                      {row.count}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end">
                        <span className={cn("font-display font-bold text-[1rem]", marginTextClass(row.avgMargin))}>
                          {fmtPct(row.avgMargin)}
                        </span>
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", marginColorClass(row.avgMargin))}
                            style={{ width: `${Math.min(100, row.avgMargin)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <PopularityDots score={Math.round(row.avgPopularity)} size="sm" />
                        <span className="font-display text-sm font-semibold text-ursa-dark-roast">
                          {fmtNum(row.avgPopularity, 1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-display text-ursa-dark-roast">
                      {fmtNum(row.avgPrep, 1)} min
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <span className="font-display text-sm font-semibold text-ursa-dark-roast">
                          {fmtPct(row.avgAttach, 0)}
                        </span>
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-ursa-medium-roast rounded-full transition-all"
                            style={{ width: `${Math.min(100, row.avgAttach)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {categoryAggregates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {t("content.menu-studio.section.04.empty")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
        <p className="text-[0.78rem] text-muted-foreground mt-3 m-0">
          {t("content.menu-studio.section.04.footer")}
        </p>
      </ViewSection>

      {/* ---------- Section 05 · Psychology-backed design techniques ---------- */}
      <ViewSection
        badge={t("content.menu-studio.section.05.badge")}
        title={t("content.menu-studio.section.05.title")}
        meta={t("content.menu-studio.section.05.meta")}
      >
        <p className="text-[0.92rem] text-muted-foreground max-w-[72ch] mb-3">
          {t("content.menu-studio.section.05.intro")}
        </p>
        <Callout tone="gold" title={t("content.menu-studio.section.05.disclaimer-title")}>
          <p className="m-0 text-[0.9rem]">
            {t("content.menu-studio.section.05.disclaimer")}
          </p>
        </Callout>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {HYPOTHESES.map((h) => (
            <HypothesisCard key={h.id} hypothesis={h} t={t} />
          ))}
        </div>
      </ViewSection>

      {/* ---------- Section 06 · Attach-rate modeler ---------- */}
      <ViewSection
        badge={t("content.menu-studio.section.06.badge")}
        title={t("content.menu-studio.section.06.title")}
        meta={t("content.menu-studio.section.06.meta")}
      >
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 items-start">
          {/* Controls */}
          <Card>
            <h4 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-4 flex items-center gap-2">
              <Wallet size={18} className="text-ursa-gold-text" /> {t("content.menu-studio.attach.title")}
            </h4>

            <div className="space-y-5">
              <div>
                <Label className="font-label text-[0.72rem] tracking-[0.1em] uppercase text-ursa-dark-roast">
                  {t("content.menu-studio.attach.primary")}
                </Label>
                <Select value={primaryId} onValueChange={setPrimaryId}>
                  <SelectTrigger className="w-full mt-1.5 border-ursa-line-soft">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((it) => (
                      <SelectItem key={it.id} value={it.id}>
                        {it.name} · {fmtPEN(it.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-label text-[0.72rem] tracking-[0.1em] uppercase text-ursa-dark-roast">
                  {t("content.menu-studio.attach.side")}
                </Label>
                <Select value={sideId} onValueChange={setSideId}>
                  <SelectTrigger className="w-full mt-1.5 border-ursa-line-soft">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((it) => (
                      <SelectItem key={it.id} value={it.id}>
                        {it.name} · {fmtPEN(it.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="font-label text-[0.72rem] tracking-[0.1em] uppercase text-ursa-dark-roast">
                    {t("content.menu-studio.attach.volume")}
                  </Label>
                  <span className="font-display font-semibold text-ursa-dark-roast">{primaryVolume}</span>
                </div>
                <Slider
                  value={[primaryVolume]}
                  min={10}
                  max={500}
                  step={10}
                  onValueChange={(v) => setPrimaryVolume(v[0])}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="font-label text-[0.72rem] tracking-[0.1em] uppercase text-ursa-dark-roast">
                    {t("content.menu-studio.attach.rate")}
                  </Label>
                  <span className="font-display font-semibold text-ursa-dark-roast">{fmtPct(attachRate, 0)}</span>
                </div>
                <Slider
                  value={[attachRate]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(v) => setAttachRate(v[0])}
                />
                <div className="flex justify-between mt-2 font-label text-[0.62rem] tracking-[0.1em] uppercase text-muted-foreground">
                  <span>{t("content.menu-studio.attach.scale-0")}</span>
                  <span>{t("content.menu-studio.attach.scale-60")}</span>
                  <span>{t("content.menu-studio.attach.scale-100")}</span>
                </div>
              </div>
            </div>

            <Callout tone="gold" title={t("content.menu-studio.attach.callout.title")}>
              <p className="m-0 text-[0.88rem]">
                {t("content.menu-studio.attach.callout.body")}
              </p>
            </Callout>
          </Card>

          {/* Live projection */}
          <div className="space-y-4">
            <Card highlight className="bg-gradient-to-br from-ursa-paper to-ursa-cream">
              <div className="flex items-center justify-between mb-1">
                <span className="font-label text-[0.7rem] tracking-[0.18em] uppercase text-ursa-gold-text">
                  {t("content.menu-studio.attach.contribution-label")}
                </span>
                <SectionBadge tone="gold">live</SectionBadge>
              </div>
              <div className="font-display text-5xl font-semibold text-ursa-forest-deep leading-none mb-2">
                {fmtPEN(attachMarginTotal)}
              </div>
              <p className="text-[0.88rem] text-muted-foreground m-0">
                {t("content.menu-studio.attach.contribution-body", {
                  sides: sidesSold,
                  side: side?.name ?? "—",
                  volume: primaryVolume,
                  primary: primary?.name ?? "—",
                  rate: attachRate,
                })}
              </p>
            </Card>

            <Grid cols={2}>
              <MiniStat
                value={fmtPEN(primaryRevenue)}
                label={t("content.menu-studio.attach.mini.primary-revenue")}
                icon={<Coffee size={14} />}
              />
              <MiniStat
                value={fmtPEN(attachRevenue)}
                label={t("content.menu-studio.attach.mini.attach-revenue")}
                icon={<Plus size={14} />}
              />
              <MiniStat
                value={fmtPEN(sideMarginPEN)}
                label={t("content.menu-studio.attach.mini.side-margin")}
                icon={<TrendingUp size={14} />}
              />
              <MiniStat
                value={fmtPct(blendedMarginPct)}
                label={t("content.menu-studio.attach.mini.blended")}
                icon={<Percent size={14} />}
                tone={marginTone(blendedMarginPct)}
              />
            </Grid>

            {/* Visual attach bar */}
            <Card>
              <h5 className="font-label text-[0.7rem] tracking-[0.14em] uppercase text-ursa-medium-roast m-0 mb-3">
                {t("content.menu-studio.attach.composition")}
              </h5>
              <div className="flex h-10 rounded-md overflow-hidden border border-ursa-line-soft">
                <div
                  className="bg-gradient-to-r from-ursa-medium-roast to-ursa-dark-roast flex items-center justify-center text-ursa-cream font-label text-[0.66rem] tracking-[0.1em] uppercase transition-all"
                  style={{ width: `${primaryRevenue + attachRevenue > 0 ? (primaryRevenue / (primaryRevenue + attachRevenue)) * 100 : 0}%` }}
                >
                  {primaryRevenue + attachRevenue > 0 ? `${Math.round((primaryRevenue / (primaryRevenue + attachRevenue)) * 100)}%` : ""}
                </div>
                <div
                  className="bg-gradient-to-r from-ursa-gold to-ursa-gold-soft flex items-center justify-center text-ursa-dark-roast font-label text-[0.66rem] tracking-[0.1em] uppercase transition-all"
                  style={{ width: `${primaryRevenue + attachRevenue > 0 ? (attachRevenue / (primaryRevenue + attachRevenue)) * 100 : 0}%` }}
                >
                  {primaryRevenue + attachRevenue > 0 ? `${Math.round((attachRevenue / (primaryRevenue + attachRevenue)) * 100)}%` : ""}
                </div>
              </div>
              <div className="flex justify-between mt-2 font-label text-[0.66rem] tracking-[0.1em] uppercase">
                <span className="text-ursa-dark-roast">{t("content.menu-studio.attach.composition-primary")} · {fmtPEN(primaryRevenue)}</span>
                <span className="text-ursa-medium-roast">{t("content.menu-studio.attach.composition-attach")} · {fmtPEN(attachRevenue)}</span>
              </div>
            </Card>
          </div>
        </div>
      </ViewSection>

      {/* ---------- Section 07 · Stars & Puzzles matrix ---------- */}
      <ViewSection
        badge={t("content.menu-studio.section.07.badge")}
        title={t("content.menu-studio.section.07.title")}
        meta={t("content.menu-studio.section.07.meta")}
      >
        <p className="text-[0.92rem] text-muted-foreground max-w-[68ch] mb-6">
          {t("content.menu-studio.section.07.intro")}
        </p>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
          <QuadrantCard quadrant="star" items={quadrants.star} tone="forest" t={t} />
          <QuadrantCard quadrant="puzzle" items={quadrants.puzzle} tone="gold" t={t} />
          <QuadrantCard quadrant="plowhorse" items={quadrants.plowhorse} tone="gold" t={t} />
          <QuadrantCard quadrant="dog" items={quadrants.dog} tone="terracotta" t={t} />
        </div>

        {/* 2x2 visual matrix */}
        <Card className="mt-6 bg-ursa-foam">
          <h4 className="font-display text-lg font-semibold text-ursa-dark-roast mt-0 mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-ursa-gold-text" /> {t("content.menu-studio.matrix.title")}
          </h4>
          <div className="relative grid grid-cols-2 grid-rows-2 gap-3 min-h-[280px]">
            {/* axes labels */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-ursa-line" aria-hidden="true" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-ursa-line" aria-hidden="true" />

            <MatrixCell
              tone="gold"
              label={t("content.menu-studio.matrix.cell-puzzle")}
              desc={t("content.menu-studio.matrix.desc-puzzle")}
              count={quadrants.puzzle.length}
              items={quadrants.puzzle}
              position="top-left"
            />
            <MatrixCell
              tone="forest"
              label={t("content.menu-studio.matrix.cell-star")}
              desc={t("content.menu-studio.matrix.desc-star")}
              count={quadrants.star.length}
              items={quadrants.star}
              position="top-right"
            />
            <MatrixCell
              tone="terracotta"
              label={t("content.menu-studio.matrix.cell-dog")}
              desc={t("content.menu-studio.matrix.desc-dog")}
              count={quadrants.dog.length}
              items={quadrants.dog}
              position="bottom-left"
            />
            <MatrixCell
              tone="gold"
              label={t("content.menu-studio.matrix.cell-plowhorse")}
              desc={t("content.menu-studio.matrix.desc-plowhorse")}
              count={quadrants.plowhorse.length}
              items={quadrants.plowhorse}
              position="bottom-right"
            />

            {/* axis labels */}
            <span className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 font-label text-[0.62rem] tracking-[0.16em] uppercase text-muted-foreground whitespace-nowrap origin-center">
              {t("content.menu-studio.matrix.axis-margin")}
            </span>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-label text-[0.62rem] tracking-[0.16em] uppercase text-muted-foreground whitespace-nowrap">
              {t("content.menu-studio.matrix.axis-popularity")}
            </span>
            <span className="absolute -left-6 top-0 font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
              {t("content.menu-studio.matrix.axis-high")}
            </span>
            <span className="absolute -left-6 bottom-0 font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
              {t("content.menu-studio.matrix.axis-low")}
            </span>
            <span className="absolute -top-5 left-0 font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
              {t("content.menu-studio.matrix.axis-low")}
            </span>
            <span className="absolute -top-5 right-0 font-label text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
              {t("content.menu-studio.matrix.axis-high")}
            </span>
          </div>
          <p className="text-[0.78rem] text-muted-foreground mt-8 m-0">
            {t("content.menu-studio.matrix.footer")}
          </p>
        </Card>
      </ViewSection>

      {/* ---------- Section 08 · Export ---------- */}
      <ViewSection
        badge={t("content.menu-studio.section.08.badge")}
        title={t("content.menu-studio.section.08.title")}
        meta={t("content.menu-studio.section.08.meta")}
      >
        <Card className="bg-gradient-to-br from-ursa-paper to-ursa-cream">
          <div className="flex flex-col md:flex-row md:items-center gap-5 justify-between">
            <div className="flex-1">
              <h4 className="font-display text-xl font-semibold text-ursa-dark-roast mt-0 mb-2 flex items-center gap-2">
                <BearMark size={28} className="text-ursa-dark-roast" /> {t("content.menu-studio.export.title")}
              </h4>
              <p className="text-[0.9rem] text-muted-foreground m-0 max-w-[58ch]">
                {t("content.menu-studio.export.body")}
              </p>
            </div>
            <Dialog open={exportOpen} onOpenChange={setExportOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-ursa-gold text-ursa-dark-roast border border-ursa-gold hover:bg-ursa-gold-soft hover:text-ursa-dark-roast"
                  size="lg"
                >
                  <Copy size={16} /> {t("content.menu-studio.export.button")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl text-ursa-dark-roast flex items-center gap-2">
                    <BearMark size={24} className="text-ursa-dark-roast" /> {t("content.menu-studio.export.dialog-title")}
                  </DialogTitle>
                </DialogHeader>
                <ArtNouveauDivider className="my-2" />
                <Textarea
                  readOnly
                  value={exportText}
                  className="font-mono text-[0.78rem] min-h-[420px] bg-ursa-cream border-ursa-line-soft text-ursa-dark-roast"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setExportOpen(false)}
                    className="border-ursa-line text-muted-foreground"
                  >
                    {t("content.menu-studio.export.close")}
                  </Button>
                  <Button
                    onClick={copyExport}
                    className="bg-ursa-dark-roast text-ursa-cream border border-ursa-forest-deep hover:bg-ursa-medium-roast hover:text-ursa-cream"
                  >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    {copied ? t("content.menu-studio.export.copied") : t("content.menu-studio.export.copy")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        <div className="grid sm:grid-cols-4 gap-3 mt-4">
          <StatBlock value={`${metrics.count}`} label={t("content.menu-studio.export.stat.items")} tone="forest" />
          <StatBlock value={fmtPct(metrics.avgMarginPct)} label={t("content.menu-studio.export.stat.margin")} tone={marginTone(metrics.avgMarginPct) === "forest" ? "forest" : "gold"} />
          <StatBlock value={`${quadrants.star.length}`} label={t("content.menu-studio.export.stat.stars")} tone="forest" />
          <StatBlock value={fmtPEN(attachMarginTotal)} label={t("content.menu-studio.export.stat.attach")} tone="gold" />
        </div>

        <Callout tone="forest" title={t("content.menu-studio.export.callout.title")}>
          <p className="m-0 text-[0.9rem]">
            {t("content.menu-studio.export.callout.body")}
          </p>
        </Callout>
      </ViewSection>
    </>
  );
}

// ---------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------

/** Editable menu-template row — one per item, looks like a café-menu entry. */
function MenuTemplateRow({
  item,
  allItems,
  onChange,
  onTogglePairing,
  onRemove,
  categoryLabel,
  t,
}: {
  item: MenuItem;
  allItems: MenuItem[];
  onChange: (patch: Partial<MenuItem>) => void;
  onTogglePairing: (otherId: string) => void;
  onRemove: () => void;
  categoryLabel: (c: Category) => string;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const [pairingsOpen, setPairingsOpen] = useState(false);
  const quadrant = classify(item);
  return (
    <Card className="p-5">
      {/* Header: name + recommended toggle + delete */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <Input
            value={item.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="h-9 border-ursa-line-soft font-display text-[1.05rem] font-semibold text-ursa-dark-roast px-2"
            aria-label={t("content.menu-studio.template.field.name")}
          />
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Select
              value={item.category}
              onValueChange={(v) => onChange({ category: v as Category })}
            >
              <SelectTrigger className="h-7 w-auto border-ursa-line-soft text-[0.72rem] px-2 py-0 font-label tracking-[0.08em] uppercase text-ursa-medium-roast">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c} className="text-[0.82rem]">
                    {categoryLabel(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <QuadrantBadge quadrant={quadrant} t={t} />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Label className="flex items-center gap-1.5 font-label text-[0.62rem] tracking-[0.1em] uppercase text-ursa-dark-roast cursor-pointer m-0">
            <Switch
              checked={item.recommended}
              onCheckedChange={(v) => onChange({ recommended: v })}
              aria-label={t("content.menu-studio.template.field.recommended")}
            />
            <Star size={12} className={item.recommended ? "text-ursa-gold-text" : "text-muted-foreground"} />
            <span className="hidden sm:inline">{t("content.menu-studio.template.field.recommended")}</span>
          </Label>
          <button
            onClick={onRemove}
            aria-label={t("content.menu-studio.template.field.remove", { name: item.name })}
            className="p-1.5 rounded-md text-muted-foreground hover:text-ursa-terracotta-text hover:bg-ursa-terracotta/10 transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Description */}
      <Textarea
        value={item.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder={t("content.menu-studio.template.field.description-placeholder")}
        rows={2}
        className="border-ursa-line-soft text-[0.85rem] italic text-ursa-dark-roast resize-none min-h-[44px]"
        aria-label={t("content.menu-studio.template.field.description")}
      />

      {/* Economics row */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        <FieldUnit
          label={t("content.menu-studio.template.field.price")}
          value={item.price}
          onChange={(v) => onChange({ price: v })}
          step={0.5}
          tone="dark"
        />
        <FieldUnit
          label={t("content.menu-studio.template.field.cost")}
          value={item.cost}
          onChange={(v) => onChange({ cost: v })}
          step={0.25}
          tone="medium"
        />
        <FieldUnit
          label={t("content.menu-studio.template.field.prep")}
          value={item.prepTime}
          onChange={(v) => onChange({ prepTime: v })}
          step={1}
          integer
          tone="dark"
        />
      </div>

      {/* Derived margin strip */}
      <div className="mt-2 flex items-center gap-2 text-[0.78rem]">
        <span className="font-label tracking-[0.1em] uppercase text-muted-foreground">
          {t("content.menu-studio.template.margin-label")}
        </span>
        <span className={cn("font-display font-semibold", marginTextClass(marginPct(item)))}>
          {fmtPEN(marginPEN(item))} · {fmtPct(marginPct(item))}
        </span>
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", marginColorClass(marginPct(item)))}
            style={{ width: `${Math.min(100, marginPct(item))}%` }}
          />
        </div>
      </div>

      {/* Behavior row: popularity + attach rate */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <Label className="font-label text-[0.62rem] tracking-[0.1em] uppercase text-ursa-dark-roast m-0 mb-1.5 block">
            {t("content.menu-studio.template.field.popularity")}
          </Label>
          <div className="flex items-center gap-2">
            <PopularityDots
              score={item.popularityScore}
              size="md"
              interactive
              onChange={(n) => onChange({ popularityScore: n as PopularityScore })}
            />
            <span className="font-display text-sm font-semibold text-ursa-dark-roast">
              {item.popularityScore}/5
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="font-label text-[0.62rem] tracking-[0.1em] uppercase text-ursa-dark-roast m-0">
              {t("content.menu-studio.template.field.attach-rate")}
            </Label>
            <span className="font-display text-sm font-semibold text-ursa-dark-roast">
              {fmtPct(item.attachRate, 0)}
            </span>
          </div>
          <Slider
            value={[item.attachRate]}
            min={0}
            max={100}
            step={5}
            onValueChange={(v) => onChange({ attachRate: v[0] })}
          />
        </div>
      </div>

      {/* Pairings */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <Label className="font-label text-[0.62rem] tracking-[0.1em] uppercase text-ursa-dark-roast m-0 flex items-center gap-1.5">
            <Layers size={11} className="text-ursa-gold-text" />
            {t("content.menu-studio.template.field.pairings")}
          </Label>
          <button
            onClick={() => setPairingsOpen((v) => !v)}
            className="font-label text-[0.6rem] tracking-[0.1em] uppercase text-ursa-medium-roast hover:text-ursa-dark-roast transition"
          >
            {pairingsOpen
              ? t("content.menu-studio.template.pairings-collapse")
              : t("content.menu-studio.template.pairings-expand")}
          </button>
        </div>
        {item.pairingIds.length === 0 ? (
          <span className="text-[0.78rem] text-muted-foreground italic">
            {t("content.menu-studio.template.pairings-empty")}
          </span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {item.pairingIds.map((pid) => {
              const paired = allItems.find((x) => x.id === pid);
              if (!paired) return null;
              return (
                <span
                  key={pid}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-ursa-foam border border-ursa-line-soft text-[0.74rem] font-display text-ursa-dark-roast"
                >
                  <ArrowRight size={9} className="text-ursa-gold-text" />
                  {paired.name}
                  <button
                    onClick={() => onTogglePairing(pid)}
                    aria-label={t("content.menu-studio.template.pairings-remove", { name: paired.name })}
                    className="ml-1 text-muted-foreground hover:text-ursa-terracotta-text"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}
        {pairingsOpen && (
          <div className="mt-2 pt-2 border-t border-ursa-line-soft flex flex-wrap gap-1.5">
            {allItems
              .filter((x) => x.id !== item.id)
              .map((x) => {
                const selected = item.pairingIds.includes(x.id);
                return (
                  <button
                    key={x.id}
                    onClick={() => onTogglePairing(x.id)}
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[0.72rem] font-display transition",
                      selected
                        ? "bg-ursa-gold border-ursa-gold text-ursa-dark-roast"
                        : "bg-ursa-paper border-ursa-line-soft text-ursa-medium-roast hover:border-ursa-gold hover:text-ursa-dark-roast",
                    )}
                  >
                    {selected && <Check size={10} />}
                    {x.name}
                  </button>
                );
              })}
            {allItems.length <= 1 && (
              <span className="text-[0.78rem] text-muted-foreground italic">
                {t("content.menu-studio.template.pairings-no-others")}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

/** Numeric field unit used in the template editor. */
function FieldUnit({
  label,
  value,
  onChange,
  step,
  integer = false,
  tone = "dark",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step: number;
  integer?: boolean;
  tone?: "dark" | "medium";
}) {
  return (
    <div>
      <Label className="font-label text-[0.62rem] tracking-[0.1em] uppercase text-ursa-dark-roast m-0 mb-1.5 block">
        {label}
      </Label>
      <Input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={0}
        step={step}
        onChange={(e) => {
          const n = integer ? parseInt(e.target.value || "0", 10) : parseFloat(e.target.value);
          onChange(Number.isFinite(n) ? n : 0);
        }}
        className={cn(
          "h-8 w-full text-right border-ursa-line-soft font-display font-semibold",
          tone === "dark" ? "text-ursa-dark-roast" : "text-ursa-medium-roast",
        )}
      />
    </div>
  );
}

/** 1-5 popularity dots. Interactive when `interactive` is set. */
function PopularityDots({
  score,
  size = "sm",
  interactive = false,
  onChange,
}: {
  score: number;
  size?: "sm" | "md";
  interactive?: boolean;
  onChange?: (n: number) => void;
}) {
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : "w-2.5 h-2.5";
  const gap = size === "sm" ? "gap-0.5" : "gap-1";
  return (
    <div className={cn("inline-flex items-center", gap)} role="img" aria-label={`${score} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(n)}
          className={cn(
            "rounded-full transition",
            dotSize,
            interactive ? "cursor-pointer hover:scale-125" : "cursor-default",
            n <= score ? "bg-ursa-gold" : "bg-muted border border-ursa-line-soft",
          )}
          aria-label={`${n}`}
          tabIndex={interactive ? 0 : -1}
        />
      ))}
    </div>
  );
}

/** Read-only customer-facing menu preview card. */
function MenuPreviewCard({
  items,
  itemsByCategory,
  categoryLabel,
  t,
}: {
  items: MenuItem[];
  itemsByCategory: Record<Category, MenuItem[]>;
  categoryLabel: (c: Category) => string;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-ursa-line bg-ursa-foam p-8 text-center">
        <p className="text-[0.88rem] text-muted-foreground m-0">{t("content.menu-studio.preview.empty")}</p>
      </div>
    );
  }
  return (
    <div
      className="rounded-lg border border-ursa-gold/40 bg-ursa-foam p-6 md:p-8 shadow-[0_2px_0_rgba(59,36,23,0.06),0_16px_40px_-20px_rgba(59,36,23,0.25)]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at top right, rgba(184,146,74,0.10), transparent 60%), linear-gradient(180deg, var(--color-ursa-foam) 0%, var(--color-ursa-paper) 100%)",
      }}
    >
      {/* Brand header */}
      <div className="text-center mb-2">
        <div className="inline-flex items-center gap-2 text-ursa-dark-roast">
          <BearMark size={26} className="text-ursa-dark-roast" />
          <span className="font-display text-xl font-semibold tracking-[0.18em] uppercase">
            {t("content.menu-studio.preview.header-brand")}
          </span>
        </div>
        <p className="font-label text-[0.62rem] tracking-[0.22em] uppercase text-ursa-gold-text mt-1 m-0">
          {t("content.menu-studio.preview.header-tagline")}
        </p>
      </div>
      <ArtNouveauDivider className="my-4" />
      <h3 className="font-display text-2xl font-semibold text-center text-ursa-dark-roast m-0 mb-4">
        {t("content.menu-studio.preview.header-menu-title")}
      </h3>

      {/* Category sections */}
      <div className="space-y-6">
        {CATEGORY_ORDER.map((c) => {
          const list = itemsByCategory[c];
          if (!list || list.length === 0) return null;
          return (
            <div key={c}>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex-1 h-px bg-ursa-line" aria-hidden="true" />
                <span className="font-label text-[0.7rem] tracking-[0.22em] uppercase text-ursa-medium-roast">
                  {categoryLabel(c)}
                </span>
                <span className="flex-1 h-px bg-ursa-line" aria-hidden="true" />
              </div>
              <ul className="space-y-3 m-0 p-0 list-none">
                {list.map((it) => (
                  <li key={it.id} className="m-0">
                    <div className="flex items-baseline gap-2">
                      {it.recommended && (
                        <Star
                          size={13}
                          className="text-ursa-gold-text shrink-0 translate-y-[2px]"
                          aria-label={t("content.menu-studio.preview.recommended-badge")}
                        />
                      )}
                      <span className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast">
                        {it.name || "—"}
                      </span>
                      <span
                        className="flex-1 mx-1 border-b border-dotted border-ursa-line translate-y-[-3px]"
                        aria-hidden="true"
                      />
                      <span className="font-display text-[1.05rem] font-semibold text-ursa-dark-roast tabular-nums">
                        {fmtPEN(it.price)}
                      </span>
                    </div>
                    {it.description && (
                      <p className="text-[0.78rem] italic text-ursa-medium-roast m-0 mt-0.5 leading-relaxed pl-5">
                        {it.description}
                      </p>
                    )}
                    {it.pairingIds.length > 0 && (
                      <p className="text-[0.72rem] text-muted-foreground m-0 mt-1 pl-5">
                        <span className="font-label tracking-[0.06em] uppercase text-ursa-gold-text">
                          {t("content.menu-studio.preview.pairings-label")}
                        </span>{" "}
                        {it.pairingIds
                          .map((pid) => items.find((x) => x.id === pid)?.name)
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <ArtNouveauDivider className="my-5" />
      <p className="text-center font-label text-[0.62rem] tracking-[0.16em] uppercase text-ursa-gold-text m-0">
        {t("content.menu-studio.preview.footer-note")}
      </p>
    </div>
  );
}

/** Sortable table header. */
function SortableHead({
  label,
  sortKey,
  current,
  dir,
  onSort,
  align = "left",
  disabled = false,
}: {
  label: string;
  sortKey:
    | "marginPct"
    | "marginPEN"
    | "price"
    | "prepTime"
    | "popularityScore"
    | "attachRate"
    | "name";
  current: string;
  dir: "asc" | "desc";
  onSort: (
    k: "marginPct" | "marginPEN" | "price" | "prepTime" | "popularityScore" | "attachRate" | "name",
  ) => void;
  align?: "left" | "right" | "center";
  disabled?: boolean;
}) {
  const isActive = current === sortKey && !disabled;
  return (
    <TableHead className={align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}>
      <button
        onClick={() => !disabled && onSort(sortKey)}
        disabled={disabled}
        className={cn(
          "inline-flex items-center gap-1 font-label text-[0.7rem] tracking-[0.1em] uppercase transition",
          disabled ? "text-muted-foreground/60 cursor-not-allowed" : "text-ursa-medium-roast hover:text-ursa-dark-roast",
          align === "right" && "flex-row-reverse",
          align === "center" && "justify-center",
          isActive && "text-ursa-dark-roast",
        )}
      >
        {label}
        <ArrowUpDown size={11} className={cn(isActive ? "opacity-100" : "opacity-40")} />
        {isActive && <span className="text-[0.6rem]">{dir === "asc" ? "▲" : "▼"}</span>}
      </button>
    </TableHead>
  );
}

/** Legend chip. */
function LegendChip({ tone, label }: { tone: "forest" | "gold" | "terracotta"; label: string }) {
  const colors = {
    forest: "bg-ursa-dark-roast",
    gold: "bg-ursa-gold",
    terracotta: "bg-ursa-terracotta",
  };
  return (
    <div className="flex items-center gap-2 bg-card border border-ursa-line-soft rounded-md px-3 py-2">
      <span className={cn("w-3 h-3 rounded-sm", colors[tone])} />
      <span className="font-label text-[0.66rem] tracking-[0.1em] uppercase text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

/** Small stat block used in the attach-rate panel. */
function MiniStat({
  value,
  label,
  icon,
  tone = "neutral",
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  tone?: "neutral" | "forest" | "gold" | "terracotta";
}) {
  const colors = {
    neutral: "text-ursa-dark-roast",
    forest: "text-ursa-forest-deep",
    gold: "text-ursa-medium-roast",
    terracotta: "text-ursa-terracotta-text",
  };
  return (
    <div className="bg-card border border-ursa-line-soft rounded-lg p-4">
      <div className="flex items-center gap-2 text-ursa-gold-text mb-1">
        {icon}
        <span className="font-label text-[0.62rem] tracking-[0.12em] uppercase text-muted-foreground">
          {label}
        </span>
      </div>
      <p className={cn("font-display text-2xl font-semibold m-0", colors[tone])}>{value}</p>
    </div>
  );
}

/** Quadrant badge (Star / Puzzle / Plowhorse / Dog). */
function QuadrantBadge({
  quadrant,
  t,
}: {
  quadrant: Quadrant;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const meta = QUADRANT_META[quadrant];
  const toneClasses = {
    forest: "bg-ursa-dark-roast/10 text-ursa-forest-deep border-ursa-forest-deep/30",
    gold: "bg-ursa-gold/15 text-ursa-medium-roast border-ursa-gold/50",
    terracotta: "bg-ursa-terracotta/10 text-ursa-terracotta-text border-ursa-terracotta/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded border font-label text-[0.6rem] tracking-[0.1em] uppercase",
        toneClasses[meta.tone],
      )}
    >
      {meta.icon}
      {t(`content.menu-studio.quadrant.${quadrant}.label`)}
    </span>
  );
}

/** Quadrant summary card. */
function QuadrantCard({
  quadrant,
  items,
  tone,
  t,
}: {
  quadrant: Quadrant;
  items: MenuItem[];
  tone: "forest" | "gold" | "terracotta";
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const meta = QUADRANT_META[quadrant];
  const toneClasses = {
    forest: "border-ursa-forest-deep/40 bg-ursa-dark-roast/5",
    gold: "border-ursa-gold/50 bg-ursa-gold/8",
    terracotta: "border-ursa-terracotta/40 bg-ursa-terracotta/5",
  };
  const badgeTone = {
    forest: "bg-ursa-dark-roast text-ursa-cream border-ursa-forest-deep",
    gold: "bg-ursa-gold text-ursa-dark-roast border-ursa-gold",
    terracotta: "bg-ursa-terracotta text-ursa-cream border-ursa-terracotta",
  };
  const title = t(`content.menu-studio.quadrant.${quadrant}.label`);
  const desc = t(`content.menu-studio.quadrant.${quadrant}.desc`);
  const action = t(`content.menu-studio.quadrant.${quadrant}.action`);
  return (
    <div className={cn("border rounded-lg p-5", toneClasses[tone])}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("w-7 h-7 rounded-full flex items-center justify-center border", badgeTone[tone])}>
            {meta.icon}
          </span>
          <h4 className="font-display text-xl font-semibold text-ursa-dark-roast m-0">{title}</h4>
        </div>
        <span className="font-display text-2xl font-semibold text-ursa-medium-roast">
          {items.length}
        </span>
      </div>
      <p className="font-label text-[0.66rem] tracking-[0.12em] uppercase text-muted-foreground m-0 mb-2">
        {desc}
      </p>
      <p className="text-[0.85rem] text-ursa-dark-roast m-0 mb-3 leading-relaxed">{action}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.length === 0 && (
          <span className="text-[0.78rem] text-muted-foreground italic">{t("content.menu-studio.quadrant.none")}</span>
        )}
        {items.map((it) => (
          <span
            key={it.id}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-ursa-paper border border-ursa-line-soft text-[0.75rem] font-display text-ursa-dark-roast"
          >
            {it.name}
            <span className="font-label text-[0.6rem] tracking-[0.05em] uppercase text-muted-foreground">
              {fmtPct(marginPct(it), 0)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Matrix 2x2 cell. */
function MatrixCell({
  tone,
  label,
  desc,
  count,
  items,
  position,
}: {
  tone: "forest" | "gold" | "terracotta";
  label: string;
  desc: string;
  count: number;
  items: MenuItem[];
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const toneBg = {
    forest: "bg-ursa-dark-roast/10 border-ursa-forest-deep/30",
    gold: "bg-ursa-gold/15 border-ursa-gold/40",
    terracotta: "bg-ursa-terracotta/10 border-ursa-terracotta/30",
  };
  const toneText = {
    forest: "text-ursa-forest-deep",
    gold: "text-ursa-medium-roast",
    terracotta: "text-ursa-terracotta-text",
  };
  const align = {
    "top-left": "items-start text-left",
    "top-right": "items-end text-right",
    "bottom-left": "items-start text-left",
    "bottom-right": "items-end text-right",
  };
  return (
    <div className={cn("flex flex-col justify-center p-4 border rounded-md", toneBg[tone], align[position])}>
      <div className={cn("flex items-center gap-2 mb-1", align[position])}>
        <span className={cn("font-display text-2xl font-semibold", toneText[tone])}>{count}</span>
        <span className={cn("font-label text-[0.66rem] tracking-[0.14em] uppercase", toneText[tone])}>
          {label}
        </span>
      </div>
      <span className="font-label text-[0.58rem] tracking-[0.1em] uppercase text-muted-foreground mb-2">
        {desc}
      </span>
      <div className={cn("flex flex-wrap gap-1 max-w-[200px]", position.includes("right") && "justify-end")}>
        {items.slice(0, 4).map((it) => (
          <span
            key={it.id}
            className="inline-block px-1.5 py-0.5 rounded bg-ursa-foam border border-ursa-line-soft text-[0.66rem] font-display text-ursa-dark-roast"
          >
            {it.name}
          </span>
        ))}
        {items.length > 4 && (
          <span className="text-[0.66rem] text-muted-foreground self-center">
            +{items.length - 4}
          </span>
        )}
      </div>
    </div>
  );
}

/** Psychology hypothesis card — evidence, mechanism, ethics, measurement, stop rule. */
function HypothesisCard({
  hypothesis,
  t,
}: {
  hypothesis: Hypothesis;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const tone = EVIDENCE_TONE[hypothesis.evidence];
  const toneClasses = {
    forest: "border-ursa-forest-deep/40 bg-ursa-dark-roast/5",
    gold: "border-ursa-gold/50 bg-ursa-gold/8",
    terracotta: "border-ursa-terracotta/40 bg-ursa-terracotta/5",
  };
  const badgeTone = {
    forest: "bg-ursa-dark-roast text-ursa-cream border-ursa-forest-deep",
    gold: "bg-ursa-gold text-ursa-dark-roast border-ursa-gold",
    terracotta: "bg-ursa-terracotta text-ursa-cream border-ursa-terracotta",
  };
  const labelText = t(`content.menu-studio.psych.evidence.${hypothesis.evidence}`);
  return (
    <div className={cn("border rounded-lg p-5 flex flex-col", toneClasses[tone])}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="font-display text-lg font-semibold text-ursa-dark-roast m-0 flex items-start gap-2">
          <Beaker size={16} className="text-ursa-gold-text mt-1 shrink-0" />
          <span>{t(`content.menu-studio.psych.technique.${hypothesis.id}.title`)}</span>
        </h4>
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-label text-[0.58rem] tracking-[0.12em] uppercase shrink-0",
            badgeTone[tone],
          )}
        >
          {EVIDENCE_ICON[hypothesis.evidence]}
          {labelText}
        </span>
      </div>

      <dl className="space-y-3 m-0 flex-1">
        <HypothesisRow
          icon={<Ruler size={12} />}
          label={t("content.menu-studio.psych.mechanism-label")}
          value={t(`content.menu-studio.psych.technique.${hypothesis.id}.mechanism`)}
        />
        <HypothesisRow
          icon={<Scale size={12} />}
          label={t("content.menu-studio.psych.ethical-risk-label")}
          value={t(`content.menu-studio.psych.technique.${hypothesis.id}.ethical-risk`)}
          tone="terracotta"
        />
        <HypothesisRow
          icon={<Target size={12} />}
          label={t("content.menu-studio.psych.measurement-label")}
          value={t(`content.menu-studio.psych.technique.${hypothesis.id}.measurement`)}
        />
        <HypothesisRow
          icon={<AlertTriangle size={12} />}
          label={t("content.menu-studio.psych.stop-condition-label")}
          value={t(`content.menu-studio.psych.technique.${hypothesis.id}.stop-condition`)}
          tone="terracotta"
        />
      </dl>

      <p className="font-label text-[0.62rem] tracking-[0.06em] uppercase text-muted-foreground mt-4 m-0 pt-3 border-t border-ursa-line-soft">
        <span className="text-ursa-gold-text">{t("content.menu-studio.psych.citation-label")}</span>{" "}
        {t(`content.menu-studio.psych.technique.${hypothesis.id}.citation`)}
      </p>
    </div>
  );
}

/** One labelled row inside a hypothesis card. */
function HypothesisRow({
  icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "neutral" | "terracotta";
}) {
  const labelColor = tone === "terracotta" ? "text-ursa-terracotta-text" : "text-ursa-gold-text";
  return (
    <div className="m-0">
      <dt className={cn("flex items-center gap-1.5 font-label text-[0.6rem] tracking-[0.12em] uppercase mb-1", labelColor)}>
        {icon}
        {label}
      </dt>
      <dd className="text-[0.84rem] text-ursa-dark-roast m-0 leading-relaxed">{value}</dd>
    </div>
  );
}
