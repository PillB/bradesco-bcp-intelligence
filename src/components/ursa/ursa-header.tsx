"use client";

import { useState } from "react";
import { Menu, X, Printer, ExternalLink } from "lucide-react";
import { BearMark } from "./ursa-brand";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { ROUTES, RouteKey, useNavigate } from "@/lib/ursa-nav";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export function UrsaHeader({ currentRoute }: { currentRoute: string }) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dossierKeys: RouteKey[] = ["brand", "market", "menu", "growth", "viral", "creative", "roadmap"];
  const toolKeys: RouteKey[] = [
    "calculator",
    "menu-studio",
    "competitors",
    "content-calendar",
    "experiments",
    "style-guide",
    "budget",
    "origin-atlas",
    "roi",
    "campaign-builder",
    "spirit-checker",
    "swot",
    "pilot",
    "scorecard",
  ];

  const isActive = (key: string) => currentRoute === key;
  const routeLabel = (k: string) => t(`nav.routes.${k || "home"}`);

  const go = (key: string) => {
    navigate(key);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-ursa-dark-roast text-ursa-cream border-b-[3px] border-ursa-gold no-print">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="flex items-center gap-4 py-3">
          {/* Brand */}
          <button
            onClick={() => go("")}
            className="flex items-center gap-3 text-left hover:opacity-90 transition shrink-0"
            aria-label={t("nav.go-dashboard")}
            data-analytics="cta_click"
            data-analytics-target="nav_brand_dashboard"
          >
            <span className="w-11 h-11 rounded-full grid place-items-center border-2 border-ursa-gold bg-ursa-cream text-ursa-dark-roast ursa-breathe">
              <BearMark size={30} />
            </span>
            <span className="hidden sm:block">
              <span className="block font-display text-xl font-semibold leading-none text-ursa-cream">
                {t("nav.ursa-tagline")}
              </span>
              <span className="block font-label text-[0.62rem] tracking-[0.22em] uppercase text-ursa-gold-soft mt-1">
                {t("nav.strategic-dossier-2026")}
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-auto" aria-label="Primary">
            <NavBtn active={isActive("")} onClick={() => go("")} data-analytics="cta_click" data-analytics-target="nav_dashboard">
              {t("nav.dashboard")}
            </NavBtn>

            <div className="relative group">
              <button className="px-3 py-2 font-label text-[0.7rem] tracking-[0.14em] uppercase rounded text-ursa-cream hover:bg-white/10 transition flex items-center gap-1" data-analytics="cta_click" data-analytics-target="nav_dossier_menu_open">
                {t("nav.dossier")}
                <span className="text-[0.6rem] opacity-60">▾</span>
              </button>
              <div className="absolute right-0 top-full pt-1 hidden group-hover:block">
                <div className="bg-ursa-espresso border border-ursa-gold/40 rounded-lg shadow-xl py-2 w-64">
                  {dossierKeys.map((k) => (
                    <button
                      key={k}
                      onClick={() => go(k)}
                      data-analytics="tool_open"
                      data-analytics-tool={k}
                      className={cn(
                        "block w-full text-left px-4 py-2 font-label text-[0.72rem] tracking-[0.1em] uppercase hover:bg-white/10 transition",
                        isActive(k) ? "text-ursa-gold-text-soft bg-white/5" : "text-ursa-cream/90"
                      )}
                    >
                      {routeLabel(k)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="px-3 py-2 font-label text-[0.7rem] tracking-[0.14em] uppercase rounded text-ursa-cream hover:bg-white/10 transition flex items-center gap-1" data-analytics="cta_click" data-analytics-target="nav_tools_menu_open">
                {t("nav.tools")}
                <span className="text-[0.6rem] opacity-60">▾</span>
              </button>
              <div className="absolute right-0 top-full pt-1 hidden group-hover:block">
                <div className="bg-ursa-espresso border border-ursa-gold/40 rounded-lg shadow-xl py-2 w-64 max-h-[70vh] overflow-y-auto ursa-scroll">
                  {toolKeys.map((k) => (
                    <button
                      key={k}
                      onClick={() => go(k)}
                      data-analytics="tool_open"
                      data-analytics-tool={k}
                      className={cn(
                        "block w-full text-left px-4 py-2 font-label text-[0.72rem] tracking-[0.1em] uppercase hover:bg-white/10 transition",
                        isActive(k) ? "text-ursa-gold-text-soft bg-white/5" : "text-ursa-cream/90"
                      )}
                    >
                      {routeLabel(k)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <NavBtn active={isActive("sources")} onClick={() => go("sources")} data-analytics="cta_click" data-analytics-target="nav_sources">
              {t("nav.sources")}
            </NavBtn>

            <NavBtn active={isActive("landing")} onClick={() => go("landing")} data-analytics="cta_click" data-analytics-target="nav_landing">
              {t("nav.ursa-manana")}
            </NavBtn>

            <LanguageToggle className="ml-1" />
            <ThemeToggle className="ml-1" />

            <a
              href="/AIMarket-Design-Consulting-Reports/dossier/index.html"
              target="_blank"
              rel="noopener noreferrer"
              data-analytics="cta_click"
              data-analytics-target="nav_static_dossier"
              className="ml-1 px-3 py-2 font-label text-[0.7rem] tracking-[0.14em] uppercase rounded border border-ursa-gold-soft/40 text-ursa-gold-text-soft hover:bg-ursa-gold hover:text-ursa-dark-roast transition flex items-center gap-1.5"
            >
              {t("nav.static-dossier")} <ExternalLink size={12} />
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            className="lg:hidden ml-auto p-2 text-ursa-cream"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t("nav.toggle-menu")}
            aria-expanded={mobileOpen}
            data-analytics="cta_click"
            data-analytics-target="nav_mobile_menu_toggle"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-ursa-gold/30 bg-ursa-espresso max-h-[80vh] overflow-y-auto ursa-scroll">
          <div className="px-4 py-4 space-y-4">
            <MobileSection title={t("nav.top")}>
              <MobileLink active={isActive("")} onClick={() => go("")} data-analytics="cta_click" data-analytics-target="nav_mobile_dashboard">
                {t("nav.dashboard")}
              </MobileLink>
              <MobileLink active={isActive("sources")} onClick={() => go("sources")} data-analytics="cta_click" data-analytics-target="nav_mobile_sources">
                {t("nav.sources-evidence")}
              </MobileLink>
              <MobileLink active={isActive("landing")} onClick={() => go("landing")} data-analytics="cta_click" data-analytics-target="nav_mobile_landing">
                {t("nav.ursa-landing")}
              </MobileLink>
            </MobileSection>
            <MobileSection title={t("nav.dossier-modules")}>
              {dossierKeys.map((k) => (
                <MobileLink key={k} active={isActive(k)} onClick={() => go(k)} data-analytics="tool_open" data-analytics-tool={k}>
                  {routeLabel(k)}
                </MobileLink>
              ))}
            </MobileSection>
            <MobileSection title={t("nav.interactive-tools")}>
              {toolKeys.map((k) => (
                <MobileLink key={k} active={isActive(k)} onClick={() => go(k)} data-analytics="tool_open" data-analytics-tool={k}>
                  {routeLabel(k)}
                </MobileLink>
              ))}
            </MobileSection>
            <a
              href="/AIMarket-Design-Consulting-Reports/dossier/index.html"
              target="_blank"
              rel="noopener noreferrer"
              data-analytics="cta_click"
              data-analytics-target="nav_mobile_static_dossier"
              className="flex items-center gap-2 px-3 py-2.5 font-label text-[0.72rem] tracking-[0.1em] uppercase rounded border border-ursa-gold-soft/40 text-ursa-gold-text-soft"
            >
              {t("nav.open-static-dossier")} <ExternalLink size={14} />
            </a>
            <div className="flex items-center justify-between pt-3 border-t border-ursa-gold/20">
              <span className="font-label text-[0.66rem] tracking-[0.16em] uppercase text-ursa-gold-soft">{t("nav.theme")}</span>
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <LanguageToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavBtn({ children, active, onClick, ...rest }: { children: React.ReactNode; active: boolean; onClick: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "px-3 py-2 font-label text-[0.7rem] tracking-[0.14em] uppercase rounded transition",
        active ? "bg-ursa-gold text-ursa-dark-roast" : "text-ursa-cream hover:bg-white/10"
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-label text-[0.62rem] tracking-[0.18em] uppercase text-ursa-gold-text-soft mb-1.5 px-1">{title}</p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function MobileLink({ children, active, onClick, ...rest }: { children: React.ReactNode; active: boolean; onClick: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-left px-3 py-2.5 font-label text-[0.74rem] tracking-[0.08em] uppercase rounded transition",
        active ? "bg-ursa-gold text-ursa-dark-roast" : "text-ursa-cream/90 hover:bg-white/10"
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function UrsaFooter({ onPrint }: { onPrint?: () => void }) {
  const { t } = useI18n();
  return (
    <footer className="bg-ursa-espresso text-ursa-cream mt-auto border-t-[3px] border-ursa-gold no-print">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-9 h-9 rounded-full bg-ursa-cream grid place-items-center text-ursa-dark-roast">
                <BearMark size={24} />
              </span>
              <h4 className="font-display text-lg text-ursa-cream m-0">{t("footer.brand-name")}</h4>
            </div>
            <p className="text-[0.88rem] text-ursa-sage leading-relaxed">
              {t("footer.intro")}
            </p>
          </div>
          <div>
            <h4 className="font-label text-[0.7rem] tracking-[0.16em] uppercase text-ursa-gold-soft mb-3">{t("footer.dossier-modules")}</h4>
            <div className="text-[0.85rem] space-y-1.5">
              <FooterLink href="#/brand">{t("footer.module-01")}</FooterLink>
              <FooterLink href="#/market">{t("footer.module-02")}</FooterLink>
              <FooterLink href="#/menu">{t("footer.module-03")}</FooterLink>
              <FooterLink href="#/growth">{t("footer.module-04")}</FooterLink>
            </div>
          </div>
          <div>
            <h4 className="font-label text-[0.7rem] tracking-[0.16em] uppercase text-ursa-gold-soft mb-3">{t("footer.more")}</h4>
            <div className="text-[0.85rem] space-y-1.5">
              <FooterLink href="#/viral">{t("footer.module-05")}</FooterLink>
              <FooterLink href="#/creative">{t("footer.module-06")}</FooterLink>
              <FooterLink href="#/roadmap">{t("footer.module-07")}</FooterLink>
              <FooterLink href="#/calculator">{t("footer.module-08")}</FooterLink>
              <FooterLink href="#/sources">{t("footer.sources")}</FooterLink>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[0.76rem] text-ursa-sage max-w-3xl">
            {t("footer.legal")}
          </p>
          {onPrint && (
            <button
              onClick={onPrint}
              data-analytics="cta_click"
              data-analytics-target="footer_print_pdf"
              className="flex items-center gap-2 border border-ursa-gold-soft/40 text-ursa-gold-text-soft px-4 py-2 rounded-full font-label text-[0.7rem] tracking-[0.14em] uppercase hover:bg-ursa-gold hover:text-ursa-dark-roast transition shrink-0"
            >
              <Printer size={14} /> {t("actions.print-pdf")}
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-ursa-cream/90 hover:text-ursa-gold-text-soft transition block">
      {children}
    </a>
  );
}
