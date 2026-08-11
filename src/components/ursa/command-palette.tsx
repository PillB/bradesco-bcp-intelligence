"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Search, CornerDownLeft, ArrowUp, ArrowDown, Hash, X } from "lucide-react";
import { ROUTES, useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import { BearMark } from "./ursa-brand";
import { cn } from "@/lib/utils";

type CommandItem = {
  id: string;
  label: string;
  group: "Navigate" | "Dossier" | "Tools" | "Action";
  hint?: string;
  keywords?: string;
  route?: string;
  action?: () => void;
};

/** Quick actions (labels resolved at render time via `t()` so they translate). */
const QUICK_ACTIONS: CommandItem[] = [
  { id: "print", label: "print", group: "Action", hint: "current", keywords: "pdf export save print", action: () => window.print() },
  { id: "dossier", label: "openStaticDossier", group: "Action", hint: "newTab", keywords: "html reference static original", action: () => window.open("/AIMarket-Design-Consulting-Reports/dossier/index.html", "_blank") },
];

/** Resolve a QUICK_ACTION display label/hint via the i18n dictionary. */
function resolveActionLabel(item: CommandItem, t: (k: string) => string): { label: string; hint: string } {
  if (item.id === "print") {
    return { label: t("actions.printSavePdf"), hint: t("common.currentPage") };
  }
  if (item.id === "dossier") {
    return { label: t("actions.openStaticDossier"), hint: t("common.newTab") };
  }
  return { label: item.label, hint: item.hint ?? "" };
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Resolve a translated route label (handles the empty "" → "home" route key).
  const routeLabel = useCallback(
    (k: string) => t(`nav.routes.${k || "home"}`),
    [t]
  );

  // Build command list from routes (re-builds when language changes so labels
  // re-translate and search keywords include both EN + ES forms).
  const commands = useMemo<CommandItem[]>(() => {
    const navItems: CommandItem[] = Object.entries(ROUTES).map(([key, val]) => {
      const translated = routeLabel(key);
      return {
        id: key,
        label: translated,
        group: val.group === "top" ? "Navigate" : val.group === "dossier" ? "Dossier" : "Tools",
        hint: `#/${key}`,
        keywords: key + " " + val.label + " " + translated + " " + val.icon,
        route: key,
      };
    });
    return [...navItems, ...QUICK_ACTIONS];
  }, [routeLabel]);

  // Filter
  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((c) => {
      const haystack = `${c.label} ${c.group} ${c.keywords || ""} ${c.hint || ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [commands, query]);

  // Group filtered results
  const grouped = useMemo(() => {
    const g: Record<string, CommandItem[]> = { Navigate: [], Dossier: [], Tools: [], Action: [] };
    filtered.forEach((c) => g[c.group]?.push(c));
    return g;
  }, [filtered]);

  const flatFiltered = useMemo(() => Object.values(grouped).flat(), [grouped]);

  // Keyboard shortcut to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector(`[data-idx="${activeIdx}"]`);
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const execute = useCallback((item: CommandItem) => {
    if (item.action) {
      item.action();
    } else if (item.route !== undefined) {
      navigate(item.route);
    }
    setOpen(false);
  }, [navigate]);

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, flatFiltered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flatFiltered[activeIdx];
      if (item) execute(item);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="no-print fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-ursa-dark-roast text-ursa-cream border border-ursa-gold/40 shadow-lg px-4 py-2.5 font-label text-[0.72rem] tracking-[0.12em] uppercase hover:bg-ursa-espresso hover:border-ursa-gold transition group"
        aria-label={t("actions.openCommandPalette")}
      >
        <Search size={15} className="text-ursa-gold-text group-hover:scale-110 transition" />
        <span className="hidden sm:inline">{t("actions.quickJump")}</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[0.6rem] bg-ursa-espresso/60 border border-ursa-gold/30 rounded px-1.5 py-0.5 text-ursa-gold-text-soft">
          {"\u2318"}K
        </kbd>
      </button>
    );
  }

  let runningIdx = -1;

  return (
    <div
      className="no-print fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ursa-espresso/60 backdrop-blur-sm ursa-fade-up"
        onClick={() => setOpen(false)}
      />
      {/* Panel */}
      <div className="relative w-full max-w-[560px] bg-card border border-ursa-gold/50 rounded-2xl shadow-2xl overflow-hidden ursa-fade-up">
        {/* Header / search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-ursa-line-soft bg-ursa-foam">
          <Search size={18} className="text-ursa-gold-text shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t("common.searchPlaceholder")}
            className="flex-1 bg-transparent border-0 outline-none font-body text-[0.95rem] text-ursa-dark-roast placeholder:text-muted-foreground"
            aria-label={t("common.searchCommands")}
          />
          <button
            onClick={() => setOpen(false)}
            className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-ursa-dark-roast hover:bg-muted transition"
            aria-label={t("actions.close")}
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto ursa-scroll py-2">
          {flatFiltered.length === 0 && (
            <div className="px-6 py-10 text-center">
              <BearMark size={36} className="text-ursa-line mx-auto mb-3" />
              <p className="font-display text-lg text-ursa-dark-roast m-0">{t("common.noMatches")}</p>
              <p className="text-[0.85rem] text-muted-foreground m-0 mt-1">{t("common.noMatchesHint")}</p>
            </div>
          )}
          {Object.entries(grouped).map(([group, items]) => {
            if (items.length === 0) return null;
            const groupLabel =
              group === "Navigate" ? t("common.groupNavigate")
              : group === "Dossier" ? t("common.groupDossier")
              : group === "Tools" ? t("common.groupTools")
              : t("common.groupAction");
            return (
              <div key={group} className="mb-1">
                <div className="px-4 py-1.5 font-label text-[0.6rem] tracking-[0.18em] uppercase text-ursa-gold-text">
                  {groupLabel}
                </div>
                {items.map((item) => {
                  runningIdx++;
                  const idx = runningIdx;
                  const isActive = idx === activeIdx;
                  const isAction = item.route === undefined;
                  const resolved = isAction ? resolveActionLabel(item, t) : { label: item.label, hint: item.hint ?? "" };
                  return (
                    <button
                      key={item.id}
                      data-idx={idx}
                      onMouseMove={() => setActiveIdx(idx)}
                      onClick={() => execute(item)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left transition",
                        isActive ? "bg-ursa-gold/15" : "hover:bg-muted/60"
                      )}
                    >
                      <span
                        className={cn(
                          "w-8 h-8 rounded-md flex items-center justify-center shrink-0 border",
                          isActive ? "bg-ursa-dark-roast border-ursa-dark-roast text-ursa-cream" : "bg-ursa-foam border-ursa-line-soft text-ursa-medium-roast"
                        )}
                      >
                        {isAction ? <CornerDownLeft size={15} /> : <Hash size={15} />}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-display text-[0.95rem] font-semibold text-ursa-dark-roast truncate">
                          {resolved.label}
                        </span>
                        {resolved.hint && (
                          <span className="block font-label text-[0.62rem] tracking-[0.06em] text-muted-foreground truncate">
                            {resolved.hint}
                          </span>
                        )}
                      </span>
                      {isActive && (
                        <kbd className="shrink-0 inline-flex items-center gap-0.5 text-[0.58rem] bg-ursa-dark-roast text-ursa-gold-text-soft rounded px-1.5 py-0.5 border border-ursa-gold/30">
                          <CornerDownLeft size={10} />
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-ursa-line-soft bg-ursa-foam text-[0.68rem] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center w-5 h-5 bg-card border border-ursa-line rounded text-ursa-dark-roast">
                <ArrowUp size={10} />
              </kbd>
              <kbd className="inline-flex items-center justify-center w-5 h-5 bg-card border border-ursa-line rounded text-ursa-dark-roast">
                <ArrowDown size={10} />
              </kbd>
              {t("common.navigate")}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center h-5 px-1 bg-card border border-ursa-line rounded text-ursa-dark-roast">
                <CornerDownLeft size={10} />
              </kbd>
              {t("common.select")}
            </span>
          </div>
          <span className="font-label tracking-[0.1em] uppercase">{t("common.ursaCommand")}</span>
        </div>
      </div>
    </div>
  );
}
