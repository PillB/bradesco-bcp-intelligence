// ============================================================
// URSA COFFEE — ANALYTICS INSTRUMENTATION
// ------------------------------------------------------------
// Lightweight, framework-agnostic event tracking for the
// Ursa Coffee strategic dossier. Designed to work with either
// Google Tag Manager (GTM) or direct GA4 gtag — once the owner
// adds a tracking ID. No actual GA4/GTM scripts are loaded by
// this module; events are queued in `window.dataLayer` (a plain
// array, present even before GTM loads) and replayed when the
// tag manager initializes.
//
// Two usage patterns:
//
//   1. Imperative (for programmatic events):
//        import { track } from "@/lib/analytics";
//        track("tool_open", { tool: "calculator" });
//
//   2. Declarative (for click events on buttons / links):
//        <button data-analytics="cta_click"
//                data-analytics-target="join">…</button>
//
// The declarative form is read by a single delegated click
// listener installed by `initAnalytics()` (called once on app
// mount from `src/app/page.tsx`).
//
// Custom dimensions (configured in GA4 once the owner adds the
// tracking ID): `route`, `language`, `theme`. See
// `docs/analytics/measurement-plan.md` for the full plan.
// ============================================================

export type AnalyticsEvent =
  | "page_view"
  | "tool_open"
  | "language_toggle"
  | "theme_toggle"
  | "cta_click"
  | "form_submit"
  | "pilot_signup"
  | "calculator_use";

export interface AnalyticsParams {
  /** Current hash route (without `#/`), e.g. "calculator" or "" for dashboard. */
  route?: string;
  /** Active UI language. */
  language?: "en" | "es";
  /** Active color theme. */
  theme?: "light" | "dark";
  /** Tool name for `tool_open` / `calculator_use` events. */
  tool?: string;
  /** Click target identifier (e.g. "nav_dashboard", "join_section"). */
  target?: string;
  /** Free-form extension point. */
  [key: string]: unknown;
}

declare global {
  interface Window {
    /** GTM / gtag dataLayer queue. Created on first push. */
    dataLayer?: Record<string, unknown>[];
    /** Direct GA4 gtag function (only present if gtag.js is loaded). */
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Send an analytics event. Safe to call during SSR — the call is
 * a no-op when `window` is undefined.
 */
export function track(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;

  // Ensure dataLayer exists so GTM/gtag can replay events later.
  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  // Merge contextual dimensions so every event carries route/lang/theme
  // (custom dimensions in GA4) without forcing call sites to repeat them.
  const payload: AnalyticsParams & { event: AnalyticsEvent; _ts: number } = {
    event,
    route: params.route ?? currentRoute(),
    language: params.language ?? currentLang(),
    theme: params.theme ?? currentTheme(),
    _ts: Date.now(),
    ...params,
  };

  // Always push to dataLayer (works for GTM and for gtag's dataLayer binding).
  window.dataLayer.push(payload as unknown as Record<string, unknown>);

  // If gtag.js is loaded directly (no GTM), also fire the GA4 event.
  if (typeof window.gtag === "function") {
    try {
      window.gtag("event", event, params);
    } catch {
      /* swallow — analytics must never break the UI */
    }
  }

  // Dev-only: surface events in the console so the owner can verify
  // instrumentation before wiring up GA4.
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, params);
  }
}

/**
 * Install a single delegated click listener that picks up
 * `data-analytics` attributes on any clicked element (or its
 * closest ancestor with the attribute). Returns a disposer;
 * the listener is intended to live for the app's lifetime.
 *
 * Called once on app mount from `src/app/page.tsx`.
 */
export function initAnalytics(): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const tracked = target.closest<HTMLElement>("[data-analytics]");
    if (!tracked) return;

    const event = tracked.dataset.analytics as AnalyticsEvent | undefined;
    if (!event) return;

    track(event, {
      target: tracked.dataset.analyticsTarget,
      tool: tracked.dataset.analyticsTool,
    });
  };

  window.addEventListener("click", handler, { passive: true });
  return () => window.removeEventListener("click", handler);
}

/** Read the current hash route (without the leading `#/`). */
function currentRoute(): string {
  if (typeof window === "undefined") return "";
  const hash = window.location.hash.replace(/^#\/?/, "");
  return hash || "";
}

/** Read the active UI language from the `<html lang>` attribute. */
function currentLang(): "en" | "es" {
  if (typeof window === "undefined") return "en";
  return document.documentElement.lang === "es" ? "es" : "en";
}

/** Read the active color theme from the `<html class>` list. */
function currentTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
