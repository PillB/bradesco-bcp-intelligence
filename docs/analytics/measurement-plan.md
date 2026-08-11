# Ursa Coffee Dossier — Analytics Measurement Plan

**Owner:** Ursa Coffee Strategic Studio
**Last updated:** 2026-08-01
**Site:** Static-exported Next.js app at `/AIMarket-Design-Consulting-Reports/` (GitHub Pages)
**Routing:** Hash-based (`#/route`) — a single indexable URL hosts every view
**Tracking provider:** TBD by owner (GA4 via GTM recommended). No tracking scripts are loaded until the owner supplies a Measurement ID.

---

## 1 · Why we measure

The dossier is a strategic *artefact* the owner shows to partners, lenders, and the senior team. The analytics layer serves three narrow purposes:

1. **Confirm the dossier is read.** A page_view with the route lets us see whether viewers stop at the dashboard or go deep into the calculator/pilot.
2. **Find the conversion path to the Ursa Mañana pilot.** The landing view (`#/landing`) is the only place a viewer can register interest. We need to know whether viewers reach it, scroll to the `#join` section, and submit the form.
3. **Make instrumentation cheap to add later.** The `data-analytics` attribute pattern means future developers add tracking without touching the analytics module.

The plan deliberately does **not** chase vanity metrics. There is no scroll-depth event, no hover tracking, no session-recording. The dossier is a document, not an e-commerce funnel.

---

## 2 · Implementation

### 2.1 Module

All tracking goes through `src/lib/analytics.ts`:

- `track(event, params)` — imperative call (used by hooks for `theme_toggle`, `language_toggle`, and `page_view` on route change).
- `initAnalytics()` — installs a single delegated `click` listener that reads `data-analytics` attributes. Called once on app mount from `src/app/page.tsx`.

Events are pushed to `window.dataLayer` (a plain array — created on first push, replayed by GTM when it loads). If `gtag` is present (direct GA4, no GTM), the event is also sent via `gtag('event', …)`.

### 2.2 Custom dimensions (configure in GA4 → Admin → Custom definitions)

| Dimension | Scope | Source | Example values |
| --- | --- | --- | --- |
| `route` | Event | hash without `#/` | `""` (dashboard), `calculator`, `landing`, `pilot` |
| `language` | Event | `<html lang>` | `en`, `es` |
| `theme` | Event | `<html class>` | `light`, `dark` |

These three dimensions are auto-merged into every event by `track()` — call sites do not need to pass them explicitly.

### 2.3 Adding a new tracked CTA

```tsx
<button
  data-analytics="cta_click"
  data-analytics-target="share_with_partner"
>
  Share with a partner
</button>
```

The `data-analytics-target` (and `data-analytics-tool` for tool opens) becomes the `target` / `tool` parameter on the fired event. No TypeScript changes needed.

---

## 3 · Event dictionary

### 3.1 Key events (fired on every relevant interaction)

| Event | Trigger | Params | Where instrumented |
| --- | --- | --- | --- |
| `page_view` | Route change (`useHashRoute` effect) | `route` | `src/app/page.tsx` |
| `tool_open` | Click on a tool card / tool menu item | `tool`, `target` | `data-analytics` on dashboard cards, header menu, landing CTAs |
| `language_toggle` | LanguageToggle onClick | `language` (destination) | `src/components/ursa/language-toggle.tsx` |
| `theme_toggle` | ThemeToggle onClick | `theme` (destination) | `src/components/ursa/theme-toggle.tsx` |
| `cta_click` | Click on a navigational CTA | `target` | `data-analytics` on header nav, dossier menu, landing scroll buttons |
| `form_submit` | Pilot interest form submit | `target` | `data-analytics` on the landing `#join` Anótame button |

### 3.2 Conversion events (the events the owner cares about)

| Event | Trigger | Params | Notes |
| --- | --- | --- | --- |
| `pilot_signup` | Successful submit of the pilot interest form | `target: "pilot_signup"` | Marked as a **key event** (conversion) in GA4. Currently the form is a prototype (alert-only) — the owner must wire it to an inbox (Formspree, Google Sheet, or EmailJS) before this event represents a real lead. |
| `calculator_use` | First interaction with the Subscription Economics Calculator sliders | `tool: "calculator"` | Marked as a **key event**. Fires once per calculator session (not on every slider tick) so it reflects "did the viewer engage" rather than "how many ticks." |

### 3.3 Events we deliberately do **not** fire

- `scroll_depth` — the dossier is a document; scroll position is noise.
- `hover`, `mouse_move`, `focus` — intrusive and low-signal.
- `session_start`, `first_visit` — GA4 fires these automatically; no custom instrumentation needed.
- `outbound_click` — GA4's enhanced measurement already covers this for outbound links.

---

## 4 · Funnel definition

The owner's primary funnel is the path to a pilot sign-up. Defined in GA4 → Explore → Funnel exploration:

1. `page_view` (route = `landing`)
2. `cta_click` (target = `join_section`)
3. `form_submit` (target = `pilot_signup`)
4. `pilot_signup` (conversion)

A secondary funnel covers calculator engagement as a pre-pilot qualification signal:

1. `page_view` (route = `calculator`)
2. `calculator_use` (conversion)
3. `page_view` (route = `pilot`)

---

## 5 · Privacy & consent

- **No PII is collected.** The pilot interest form captures an email address, but the email is **not** sent to analytics — only the `form_submit` / `pilot_signup` events fire.
- **No cookies are set by this instrumentation.** GA4's default cookie behaviour applies only once the owner installs the gtag snippet; the owner is responsible for adding a cookie-consent banner if required by the deployment jurisdiction (Peru's Law 29733 + EU GDPR for EU visitors).
- **Dev-only console logging** (`process.env.NODE_ENV !== "production"`) helps verify instrumentation locally; the log is suppressed in production builds.

---

## 6 · Owner setup checklist

When the owner is ready to enable GA4:

1. Create a GA4 property (e.g., "Ursa Coffee Dossier").
2. Add a Web stream for `https://ursacoffeeperu.github.io/AIMarket-Design-Consulting-Reports/` (or the custom domain if one is configured).
3. Copy the Measurement ID (`G-XXXXXXXXXX`).
4. Either:
   - **Option A — gtag.js (simpler):** Add the GA4 gtag snippet to `src/app/layout.tsx` `<head>`. The existing `track()` calls will then send events to GA4 automatically (since they call `window.gtag`).
   - **Option B — GTM (more flexible):** Create a GTM container, add the GTM snippet to `src/app/layout.tsx` `<head>`/`<body>`. The existing `dataLayer` pushes will be picked up by GTM triggers.
5. In GA4 → Admin → Custom definitions → Custom dimensions, register `route`, `language`, `theme` (event-scope).
6. In GA4 → Admin → Events, mark `pilot_signup` and `calculator_use` as **Conversions** (key events).
7. Update the `metadataBase` in `src/app/layout.tsx` to the final production URL.
8. Update the `aggregateRating` in `src/app/layout.tsx` JSON-LD once real Google Business Profile reviews are collected (the placeholder reflects the dossier's brand-quality claim; verify before publishing).

---

## 7 · Audit & maintenance

- **Quarterly:** review the funnel drop-off. If `page_view (landing) → cta_click (join_section)` is high but `form_submit` is low, the form copy needs work — not the analytics.
- **On any new view:** add the view's route key to the `titles` map in `src/app/page.tsx` so `page_view` events fire with the correct route.
- **On any new CTA:** add a `data-analytics` attribute. No other change required.
