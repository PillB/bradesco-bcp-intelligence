"use client";

import { useI18n } from "@/hooks/use-i18n";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Language toggle button for the header. Cycles between English (en)
 * and Spanish (es). Persists the choice in localStorage and updates
 * the <html lang="…"> attribute via the hook.
 *
 * Shows only the next-language code ("EN" or "ES") as clean text — no
 * icon, to avoid any visual ambiguity at small sizes.
 *
 * Fires a `language_toggle` analytics event with the destination language.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, toggle, t } = useI18n();

  const next = lang === "es" ? "EN" : "ES";
  const nextLang = lang === "es" ? "en" : "es";
  const ariaLabel = lang === "es" ? t("actions.switch-en") : t("actions.switch-es");

  return (
    <button
      onClick={() => {
        track("language_toggle", { language: nextLang });
        toggle();
      }}
      aria-label={ariaLabel}
      title={ariaLabel}
      data-analytics="language_toggle"
      data-analytics-target={nextLang}
      className={cn(
        "relative w-9 h-9 rounded-full flex items-center justify-center transition-colors border font-label text-[0.7rem] tracking-[0.06em] font-semibold",
        "border-ursa-gold-soft/40 text-ursa-gold-soft hover:bg-ursa-gold hover:text-ursa-dark-roast",
        className
      )}
    >
      {next}
    </button>
  );
}
