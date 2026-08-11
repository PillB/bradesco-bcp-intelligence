"use client";

import { createContext, useContext } from "react";

type NavigateFn = (route: string) => void;

export const NavContext = createContext<NavigateFn>(() => {});

export function useNavigate(): NavigateFn {
  return useContext(NavContext);
}

/** All routes with labels and grouping for navigation. */
export const ROUTES = {
  home: { label: "Dashboard", group: "top", icon: "home" },
  brand: { label: "Brand Audit", group: "dossier", icon: "palette" },
  market: { label: "Market & Competitors", group: "dossier", icon: "compass" },
  menu: { label: "Menu & Product", group: "dossier", icon: "coffee" },
  growth: { label: "Growth & Retention", group: "dossier", icon: "trending-up" },
  viral: { label: "Viral Content Lab", group: "dossier", icon: "zap" },
  creative: { label: "Creative Prototypes", group: "dossier", icon: "sparkles" },
  roadmap: { label: "Roadmap & KPIs", group: "dossier", icon: "map" },
  calculator: { label: "Subscription Calculator", group: "tools", icon: "calculator" },
  "menu-studio": { label: "Menu Engineering Studio", group: "tools", icon: "utensils" },
  competitors: { label: "Competitor Intelligence", group: "tools", icon: "swords" },
  "content-calendar": { label: "Content Calendar", group: "tools", icon: "calendar" },
  experiments: { label: "Experiment Tracker", group: "tools", icon: "flask-conical" },
  "style-guide": { label: "Brand Style Guide", group: "tools", icon: "swatch-book" },
  budget: { label: "Budget Allocator", group: "tools", icon: "wallet" },
  "origin-atlas": { label: "Coffee Origin Atlas", group: "tools", icon: "globe" },
  roi: { label: "ROI Dashboard", group: "tools", icon: "chart-line" },
  "campaign-builder": { label: "Campaign Builder", group: "tools", icon: "wand-2" },
  "spirit-checker": { label: "Spirit Checker", group: "tools", icon: "shield" },
  swot: { label: "SWOT Matrix", group: "tools", icon: "grid-2x2" },
  pilot: { label: "Pilot Dashboard", group: "tools", icon: "activity" },
  scorecard: { label: "Brand Scorecard", group: "tools", icon: "award" },
  loyalty: { label: "Loyalty Card Analysis", group: "tools", icon: "credit-card" },
  sources: { label: "Sources & Evidence", group: "top", icon: "book-open" },
  landing: { label: "Ursa Mañana Landing", group: "top", icon: "sunrise" },
} as const;

export type RouteKey = keyof typeof ROUTES;
