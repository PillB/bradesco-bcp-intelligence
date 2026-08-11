"use client";
import * as React from "react";
import {
  LayoutDashboard, Building2, TrendingUp, Users, Package, Smartphone,
  Server, BrainCircuit, Lightbulb, GitBranch, Handshake, Radio,
  ShieldCheck, Scale, GraduationCap, Map, FileSearch,
  Menu, X, Search, ChevronRight, Shield, Moon, Sun, Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MODULES, PROJECT } from "@/lib/scif/data";
import { useHashRoute } from "@/lib/scif/nav";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Building2, TrendingUp, Users, Package, Smartphone,
  Server, BrainCircuit, Lightbulb, GitBranch, Handshake, Radio,
  ShieldCheck, Scale, GraduationCap, Map, FileSearch,
};

function useTheme() {
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    const stored = localStorage.getItem("scif-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = React.useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("scif-theme", next ? "dark" : "light");
      return next;
    });
  }, []);
  return { dark, toggle };
}

export function CommandCenterShell({ children }: { children: React.ReactNode }) {
  const { route, navigate } = useHashRoute();
  const { dark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const activeModule = MODULES.find((m) => m.id === route) ?? MODULES[0];

  const filtered = React.useMemo(() => {
    if (!query) return MODULES;
    const q = query.toLowerCase();
    return MODULES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.subtitle.toLowerCase().includes(q) ||
        m.number.includes(q)
    );
  }, [query]);

  const go = (id: string) => {
    navigate(id);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-md border border-border p-1.5 lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Shield className="h-4 w-4" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-tight text-foreground">Bradesco × BCP</p>
              <p className="text-[10px] leading-tight text-muted-foreground">Strategic Intelligence Command Center</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar módulo..."
                className="w-48 rounded-md border border-border bg-muted/40 py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:border-primary focus:bg-background md:w-64"
              />
            </div>
            <button
              onClick={() => window.print()}
              className="no-print rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Imprimir / Exportar PDF"
              title="Imprimir / Exportar PDF"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={toggle}
              className="no-print rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Cambiar tema"
              title={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <span className="hidden rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 md:inline-block">
              Análisis independiente
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-72 transform border-r border-border bg-card pt-14 transition-transform duration-200 lg:sticky lg:top-14 lg:z-0 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0 lg:pt-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="h-full overflow-y-auto p-3" aria-label="Módulos del dossier">
            <p className="px-2 pb-2 pt-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Dossier · 17 módulos
            </p>
            <ul className="space-y-0.5">
              {filtered.map((m) => {
                const Icon = ICONS[m.icon] ?? LayoutDashboard;
                const active = m.id === route;
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => go(m.id)}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted text-foreground/80 hover:text-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-black",
                          active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {m.number}
                      </span>
                      <Icon className={cn("h-4 w-4 shrink-0", active ? "" : "text-muted-foreground group-hover:text-foreground")} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold leading-tight">{m.title}</span>
                        <span className={cn("block truncate text-[10px] leading-tight", active ? "text-primary-foreground/70" : "text-muted-foreground")}>
                          {m.subtitle}
                        </span>
                      </span>
                      {active && <ChevronRight className="h-4 w-4 shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Comparadores</p>
              <div className="mt-2 space-y-1 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#B91C3C" }} />
                  <span>Banco Bradesco (primario)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#0F766E" }} />
                  <span>BCP Perú (comparador operativo)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#7C3AED" }} />
                  <span>Credicorp (grupo, donde aplique)</span>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {mobileOpen && (
          <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      {/* Sticky footer */}
      <footer className="mt-auto border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium">
              {PROJECT.title} · {PROJECT.framework}
            </p>
            <p className="text-muted-foreground/80">
              Evidence as-of {PROJECT.asOf} · {PROJECT.independence}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
