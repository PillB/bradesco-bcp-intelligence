# Ursa Coffee — Build Spec for Subagents

## Your Task
You are building ONE React view file for the Ursa Coffee Strategic Command Center. Each view is a client component rendered inside a single-page Next.js app that uses hash-based routing.

## Critical Rules
1. Read `/home/z/my-project/worklog.md` FIRST to understand prior work.
2. After finishing, APPEND your work record to `/home/z/my-project/worklog.md` (do NOT overwrite). Start with `---` and include Task ID, Agent, Task, Work Log, Stage Summary.
3. Your file MUST export the exact named export specified.
4. Use `"use client"` at the top of every file.
5. Use the shared components from `@/components/ursa/view-shell` and `@/components/ursa/ursa-brand`.
6. Use data from `@/lib/ursa-data` where available.
7. Use the `useNavigate` hook from `@/lib/ursa-nav` for internal navigation.
8. Writing must follow the Handcrafted Writing Protocol: warm, precise, elegant; each passage has clear purpose; no filler; no bulk-generated prose; verify claims against the data.
9. The file MUST be visually rich, responsive, and use the Ursa palette (browns, greens, cream, gold — NO blue/indigo).
10. Include a `DossierLinkBanner` to the relevant static dossier where applicable.

## Available Shared Components

### From `@/components/ursa/view-shell`:
- `ViewHero({ eyebrow, title, lede, meta, tone })` — hero header. `meta` is `[{label, value}]`.
- `ViewSection({ children, badge, title, meta, className })` — standard section.
- `Card({ children, href, highlight, className })` — card with optional link/highlight.
- `Grid({ children, cols })` — grid (2, 3, or 4 cols).
- `DossierLinkBanner({ moduleId })` — link to static dossier.

### From `@/components/ursa/ursa-brand`:
- `BearMark({ size, className })` — bear SVG.
- `ArtNouveauDivider({ className })` — ornamental divider.
- `CupGlyph({ size, className })` — coffee cup SVG.
- `SectionBadge({ children, tone })` — pill badge (gold/forest/terracotta).
- `EvidenceTag({ status })` — verified/partial/unverified/gap tag.
- `Pill({ children, tone })` — pill (default/ok/warn/stop/forest/gold).
- `Callout({ children, tone, title })` — callout block (gold/ok/warn/stop/forest).
- `StatBlock({ value, label, tone })` — big stat.
- `ProgressBar({ value, tone })` — progress bar.

### Data from `@/lib/ursa-data`:
`URSA_FACTS, PALETTE, TYPOGRAPHY, VERIFIED_BEVERAGES, VERIFIED_FOOD, COMPETITORS, CUSTOMER_VOICE, HORMOZI_PRINCIPLES, SUTHERLAND_PRINCIPLES, CONTENT_CONCEPTS, SCRIPTS, REPEATABLE_SERIES, CREATOR_BRIFS, UGC_MECHANISMS, EXPERIMENTS, BUDGET_SCENARIOS, ROADMAP, TWELVE_MONTH_ROADMAP, SOURCES, OPEN_QUESTIONS`

### Navigation:
`useNavigate()` from `@/lib/ursa-nav` returns a function: `navigate("brand")` etc.

### UI components (shadcn/ui — already installed):
`Button, Input, Label, Slider, Tabs, TabsList, TabsTrigger, TabsContent, Select, SelectTrigger, SelectContent, SelectItem, Badge, Progress, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, Checkbox, Switch, Textarea, ScrollArea` — import from `@/components/ui/...`.

Icons: `lucide-react` (e.g. `Coffee, Star, TrendingUp, MapPin, Clock, ...`).

## Ursa Palette (use as Tailwind classes: `text-ursa-dark-roast`, `bg-ursa-gold`, etc.)
- `ursa-green-bean #6F5B3D`, `ursa-light-roast #8B6240`, `ursa-medium-roast #6F4A2E`
- `ursa-dark-roast #3B2417`, `ursa-espresso #211208`
- `ursa-forest-deep #2D4A36`, `ursa-forest #3E6149`, `ursa-sage #8FA68B`, `ursa-leaf #B7C9A8`
- `ursa-cream #F4EBD9`, `ursa-paper #FAF5EC`, `ursa-foam #FFFCF6`
- `ursa-gold #B8924A`, `ursa-gold-soft #D9BC7E`, `ursa-terracotta #C16E4B`
- `ursa-line #C9B68C`, `ursa-line-soft #E2D4B0`

## Typography Classes
- `font-display` — Cormorant Garamond (headings)
- `font-label` — Oswald (labels, eyebrows, uppercase)
- `font-body` — Inter (body, default)

## Example Structure
```tsx
"use client";
import { ViewHero, ViewSection, Card, Grid, DossierLinkBanner } from "../view-shell";
import { Pill, Callout, SectionBadge, EvidenceTag } from "../ursa-brand";
import { Coffee } from "lucide-react";

export function BrandAuditView() {
  return (
    <>
      <ViewHero eyebrow="Module 01 · ..." title={<>...</>} lede={<>...</>} meta={[...]} />
      <ViewSection badge="Section" title="...">
        <Grid cols={2}>...</Grid>
      </ViewSection>
    </>
  );
}
```

## Quality Bar
- Each view should have 4–8 sections of real, substantive content.
- Use cards, callouts, tables, stats, and pills — not just walls of text.
- Make it visually interesting with the bear motif, Art Nouveau dividers, and the palette.
- Responsive: test mentally at mobile width.
- No placeholder text. Every passage must mean something.
